import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const config = await prisma.pricingConfig.findFirst();
  return NextResponse.json(config);
}

const schema = z.object({
  basePrice: z.number().positive(),
  cleaningFee: z.number().min(0),
  taxRate: z.number().min(0).max(1),
  weeklyDiscount: z.number().min(0).max(1),
  monthlyDiscount: z.number().min(0).max(1),
  minNights: z.number().min(1),
  maxGuests: z.number().min(1).max(20),
});

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const data = schema.parse(body);

  const config = await prisma.pricingConfig.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json(config);
}
