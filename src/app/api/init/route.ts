import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  if (secret !== "init-casa-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.$connect();

    // Check what tables exist
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;

    const tableNames = tables.map((t) => t.tablename);

    // Create tables if they don't exist
    if (!tableNames.includes("User")) {
      await prisma.$executeRawUnsafe(`
        CREATE TYPE "Role" AS ENUM ('GUEST', 'ADMIN');
        CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED');
        CREATE TYPE "PromoType" AS ENUM ('PERCENTAGE', 'FIXED');

        CREATE TABLE "User" (
          "id" TEXT NOT NULL,
          "name" TEXT,
          "email" TEXT NOT NULL,
          "password" TEXT,
          "role" "Role" NOT NULL DEFAULT 'GUEST',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        );
        CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

        CREATE TABLE "Booking" (
          "id" TEXT NOT NULL,
          "userId" TEXT,
          "guestName" TEXT NOT NULL,
          "guestEmail" TEXT NOT NULL,
          "guestPhone" TEXT,
          "checkIn" TIMESTAMP(3) NOT NULL,
          "checkOut" TIMESTAMP(3) NOT NULL,
          "guests" INTEGER NOT NULL,
          "nights" INTEGER NOT NULL,
          "basePrice" DOUBLE PRECISION NOT NULL,
          "cleaningFee" DOUBLE PRECISION NOT NULL,
          "taxes" DOUBLE PRECISION NOT NULL,
          "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
          "totalPrice" DOUBLE PRECISION NOT NULL,
          "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
          "stripeSessionId" TEXT,
          "stripePaymentId" TEXT,
          "promoCode" TEXT,
          "notes" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
        );
        CREATE UNIQUE INDEX "Booking_stripeSessionId_key" ON "Booking"("stripeSessionId");

        CREATE TABLE "BlockedDate" (
          "id" TEXT NOT NULL,
          "date" TIMESTAMP(3) NOT NULL,
          "reason" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "BlockedDate_pkey" PRIMARY KEY ("id")
        );
        CREATE UNIQUE INDEX "BlockedDate_date_key" ON "BlockedDate"("date");

        CREATE TABLE "Review" (
          "id" TEXT NOT NULL,
          "userId" TEXT,
          "name" TEXT NOT NULL,
          "rating" INTEGER NOT NULL,
          "comment" TEXT NOT NULL,
          "approved" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
        );

        CREATE TABLE "PricingConfig" (
          "id" TEXT NOT NULL,
          "basePrice" DOUBLE PRECISION NOT NULL,
          "cleaningFee" DOUBLE PRECISION NOT NULL,
          "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
          "weeklyDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
          "monthlyDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
          "minNights" INTEGER NOT NULL DEFAULT 1,
          "maxGuests" INTEGER NOT NULL DEFAULT 8,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "PricingConfig_pkey" PRIMARY KEY ("id")
        );

        CREATE TABLE "PromoCode" (
          "id" TEXT NOT NULL,
          "code" TEXT NOT NULL,
          "discount" DOUBLE PRECISION NOT NULL,
          "type" "PromoType" NOT NULL,
          "maxUses" INTEGER,
          "usedCount" INTEGER NOT NULL DEFAULT 0,
          "expiresAt" TIMESTAMP(3),
          "active" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
        );
        CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");

        CREATE TABLE "_prisma_migrations" (
          "id" VARCHAR(36) NOT NULL,
          "checksum" VARCHAR(64) NOT NULL,
          "finished_at" TIMESTAMPTZ,
          "migration_name" VARCHAR(255) NOT NULL,
          "logs" TEXT,
          "rolled_back_at" TIMESTAMPTZ,
          "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
          "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
          CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
        );
      `);
    }

    // Seed pricing config
    const existingConfig = await prisma.pricingConfig.findFirst();
    if (!existingConfig) {
      await prisma.pricingConfig.create({
        data: {
          basePrice: 350,
          cleaningFee: 150,
          taxRate: 0.1,
          weeklyDiscount: 0.1,
          monthlyDiscount: 0.2,
          minNights: 2,
          maxGuests: 12,
        },
      });
    }

    // Seed admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@casamaddalena.fr";
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12);
      await prisma.user.create({
        data: { name: "Frédéric", email: adminEmail, password: hash, role: "ADMIN" },
      });
    }

    const finalConfig = await prisma.pricingConfig.findFirst();
    const tablesNow = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;

    return NextResponse.json({
      success: true,
      message: "✅ Base de données initialisée",
      tables: tablesNow.map((t) => t.tablename),
      pricingConfig: finalConfig,
      adminEmail,
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur", details: String(error) }, { status: 500 });
  }
}
