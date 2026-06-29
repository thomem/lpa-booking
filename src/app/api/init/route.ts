import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Temporary init endpoint — delete after first use
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== "init-casa-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Test DB connection
    await prisma.$connect();

    // 2. Admin user
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12);
    const adminEmail = process.env.ADMIN_EMAIL || "admin@casamaddalena.fr";

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { password: adminPassword },
      create: {
        name: "Frédéric",
        email: adminEmail,
        password: adminPassword,
        role: "ADMIN",
      },
    });

    // 3. Pricing config — delete existing and recreate
    await prisma.pricingConfig.deleteMany();
    const config = await prisma.pricingConfig.create({
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

    return NextResponse.json({
      success: true,
      message: "✅ Base de données initialisée",
      adminEmail,
      pricingConfig: config,
    });
  } catch (error) {
    console.error("Init error:", error);
    return NextResponse.json(
      { error: "DB error", details: String(error) },
      { status: 500 }
    );
  }
}
