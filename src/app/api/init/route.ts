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

    // Check existing tables
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;
    const t = tables.map((x) => x.tablename);
    log.push("existing tables: " + (t.join(", ") || "none"));

    // Each statement runs separately — TEXT columns instead of enums to avoid CREATE TYPE issues
    const stmts: [string, string][] = [
      ["User", `CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL DEFAULT gen_random_uuid()::text, "name" TEXT, "email" TEXT NOT NULL, "password" TEXT, "role" TEXT NOT NULL DEFAULT 'GUEST', "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "User_pkey" PRIMARY KEY ("id"))`],
      ["User_email_idx", `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`],
      ["Booking", `CREATE TABLE IF NOT EXISTS "Booking" ("id" TEXT NOT NULL DEFAULT gen_random_uuid()::text, "userId" TEXT, "guestName" TEXT NOT NULL, "guestEmail" TEXT NOT NULL, "guestPhone" TEXT, "checkIn" TIMESTAMP NOT NULL, "checkOut" TIMESTAMP NOT NULL, "guests" INTEGER NOT NULL, "nights" INTEGER NOT NULL, "basePrice" DOUBLE PRECISION NOT NULL, "cleaningFee" DOUBLE PRECISION NOT NULL, "taxes" DOUBLE PRECISION NOT NULL, "discount" DOUBLE PRECISION NOT NULL DEFAULT 0, "totalPrice" DOUBLE PRECISION NOT NULL, "status" TEXT NOT NULL DEFAULT 'PENDING', "stripeSessionId" TEXT, "stripePaymentId" TEXT, "promoCode" TEXT, "notes" TEXT, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "Booking_pkey" PRIMARY KEY ("id"))`],
      ["Booking_session_idx", `CREATE UNIQUE INDEX IF NOT EXISTS "Booking_stripeSessionId_key" ON "Booking"("stripeSessionId")`],
      ["PromoCode", `CREATE TABLE IF NOT EXISTS "PromoCode" ("id" TEXT NOT NULL DEFAULT gen_random_uuid()::text, "code" TEXT NOT NULL, "discount" DOUBLE PRECISION NOT NULL, "type" TEXT NOT NULL, "maxUses" INTEGER, "usedCount" INTEGER NOT NULL DEFAULT 0, "expiresAt" TIMESTAMP, "active" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id"))`],
      ["PromoCode_code_idx", `CREATE UNIQUE INDEX IF NOT EXISTS "PromoCode_code_key" ON "PromoCode"("code")`],
    ];

    for (const [name, sql] of stmts) {
      try {
        await prisma.$executeRawUnsafe(sql);
        log.push("✅ " + name);
      } catch (e) {
        log.push("⚠️ " + name + ": " + String(e).substring(0, 100));
      }
    }

    // Seed pricing config
    const config = await prisma.pricingConfig.findFirst();
    if (!config) {
      await prisma.pricingConfig.create({
        data: { basePrice: 350, cleaningFee: 150, taxRate: 0.1, weeklyDiscount: 0.1, monthlyDiscount: 0.2, minNights: 2, maxGuests: 12 },
      });
      log.push("✅ PricingConfig seeded");
    } else {
      log.push("✅ PricingConfig already exists");
    }

    // Seed admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@casamaddalena.fr";
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12);
      await prisma.user.create({ data: { name: "Frédéric", email: adminEmail, password: hash, role: "ADMIN" } });
      log.push("✅ Admin created: " + adminEmail);
    } else {
      log.push("✅ Admin exists: " + adminEmail);
    }

    const finalConfig = await prisma.pricingConfig.findFirst();
    return NextResponse.json({ success: true, log, pricingConfig: finalConfig });

  } catch (error) {
    return NextResponse.json({ error: String(error), log }, { status: 500 });
  }
}
