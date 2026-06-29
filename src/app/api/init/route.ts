import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("secret") !== "init-casa-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const log: string[] = [];

  try {
    await prisma.$connect();
    log.push("connected");

    // Check existing tables
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;
    const t = tables.map((x) => x.tablename);
    log.push("tables: " + t.join(", "));

    if (!t.includes("User")) {
      // Create enums one by one
      const stmts = [
        `CREATE TYPE IF NOT EXISTS "Role" AS ENUM ('GUEST', 'ADMIN')`,
        `CREATE TYPE IF NOT EXISTS "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED')`,
        `CREATE TYPE IF NOT EXISTS "PromoType" AS ENUM ('PERCENTAGE', 'FIXED')`,
        `CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL, "name" TEXT, "email" TEXT NOT NULL, "password" TEXT, "role" "Role" NOT NULL DEFAULT 'GUEST', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "User_pkey" PRIMARY KEY ("id"))`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
        `CREATE TABLE IF NOT EXISTS "Booking" ("id" TEXT NOT NULL, "userId" TEXT, "guestName" TEXT NOT NULL, "guestEmail" TEXT NOT NULL, "guestPhone" TEXT, "checkIn" TIMESTAMP(3) NOT NULL, "checkOut" TIMESTAMP(3) NOT NULL, "guests" INTEGER NOT NULL, "nights" INTEGER NOT NULL, "basePrice" DOUBLE PRECISION NOT NULL, "cleaningFee" DOUBLE PRECISION NOT NULL, "taxes" DOUBLE PRECISION NOT NULL, "discount" DOUBLE PRECISION NOT NULL DEFAULT 0, "totalPrice" DOUBLE PRECISION NOT NULL, "status" "BookingStatus" NOT NULL DEFAULT 'PENDING', "stripeSessionId" TEXT, "stripePaymentId" TEXT, "promoCode" TEXT, "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Booking_pkey" PRIMARY KEY ("id"))`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "Booking_stripeSessionId_key" ON "Booking"("stripeSessionId")`,
        `CREATE TABLE IF NOT EXISTS "BlockedDate" ("id" TEXT NOT NULL, "date" TIMESTAMP(3) NOT NULL, "reason" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "BlockedDate_pkey" PRIMARY KEY ("id"))`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "BlockedDate_date_key" ON "BlockedDate"("date")`,
        `CREATE TABLE IF NOT EXISTS "Review" ("id" TEXT NOT NULL, "userId" TEXT, "name" TEXT NOT NULL, "rating" INTEGER NOT NULL, "comment" TEXT NOT NULL, "approved" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Review_pkey" PRIMARY KEY ("id"))`,
        `CREATE TABLE IF NOT EXISTS "PricingConfig" ("id" TEXT NOT NULL, "basePrice" DOUBLE PRECISION NOT NULL, "cleaningFee" DOUBLE PRECISION NOT NULL, "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0.1, "weeklyDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0.1, "monthlyDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0.2, "minNights" INTEGER NOT NULL DEFAULT 1, "maxGuests" INTEGER NOT NULL DEFAULT 8, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PricingConfig_pkey" PRIMARY KEY ("id"))`,
        `CREATE TABLE IF NOT EXISTS "PromoCode" ("id" TEXT NOT NULL, "code" TEXT NOT NULL, "discount" DOUBLE PRECISION NOT NULL, "type" "PromoType" NOT NULL, "maxUses" INTEGER, "usedCount" INTEGER NOT NULL DEFAULT 0, "expiresAt" TIMESTAMP(3), "active" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id"))`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "PromoCode_code_key" ON "PromoCode"("code")`,
      ];

      for (const sql of stmts) {
        try {
          await prisma.$executeRawUnsafe(sql);
          log.push("OK: " + sql.substring(0, 50));
        } catch (e) {
          log.push("SKIP: " + String(e).substring(0, 80));
        }
      }
    }

    // Seed pricing config
    const config = await prisma.pricingConfig.findFirst();
    if (!config) {
      await prisma.pricingConfig.create({
        data: { basePrice: 350, cleaningFee: 150, taxRate: 0.1, weeklyDiscount: 0.1, monthlyDiscount: 0.2, minNights: 2, maxGuests: 12 },
      });
      log.push("pricing config created");
    } else {
      log.push("pricing config exists");
    }

    // Seed admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@casamaddalena.fr";
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12);
      await prisma.user.create({ data: { name: "Frédéric", email: adminEmail, password: hash, role: "ADMIN" } });
      log.push("admin created: " + adminEmail);
    } else {
      log.push("admin exists: " + adminEmail);
    }

    const finalConfig = await prisma.pricingConfig.findFirst();
    return NextResponse.json({ success: true, log, pricingConfig: finalConfig });

  } catch (error) {
    return NextResponse.json({ error: String(error), log }, { status: 500 });
  }
}
