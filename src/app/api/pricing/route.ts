import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePricing } from "@/lib/pricing";
import { z } from "zod";

const schema = z.object({
  checkIn: z.string(),
  checkOut: z.string(),
  promoCode: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { checkIn, checkOut, promoCode } = schema.parse(body);

    const config = await prisma.pricingConfig.findFirst();
    if (!config) return NextResponse.json({ error: "Config not found" }, { status: 500 });

    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (nights < config.minNights) {
      return NextResponse.json({ error: `Minimum ${config.minNights} nuit(s)` }, { status: 400 });
    }

    let promoDiscount = 0;
    let promoLabel = "";

    if (promoCode) {
      const promo = await prisma.promoCode.findFirst({
        where: {
          code: promoCode.toUpperCase(),
          active: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });

      if (promo && (!promo.maxUses || promo.usedCount < promo.maxUses)) {
        if (promo.type === "PERCENTAGE") {
          promoDiscount = promo.discount / 100;
          promoLabel = `Code promo (${promo.discount}%)`;
        } else {
          // Fixed — we'll handle separately
          promoLabel = `Code promo (-${promo.discount}€)`;
        }
      }
    }

    const breakdown = calculatePricing(nights, config, promoDiscount);

    return NextResponse.json({ ...breakdown, promoLabel });
  } catch (error) {
    return NextResponse.json({ error: "Erreur de calcul" }, { status: 400 });
  }
}
