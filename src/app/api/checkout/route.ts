import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { calculatePricing } from "@/lib/pricing";
import { z } from "zod";

const schema = z.object({
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().min(1).max(10),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  promoCode: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    if (nights < 1) return NextResponse.json({ error: "Dates invalides" }, { status: 400 });

    // Check availability
    const conflicting = await prisma.booking.findFirst({
      where: {
        status: { in: ["CONFIRMED", "PENDING"] },
        OR: [
          { checkIn: { lt: checkOut }, checkOut: { gt: checkIn } },
        ],
      },
    });

    if (conflicting) {
      return NextResponse.json({ error: "Ces dates ne sont plus disponibles." }, { status: 409 });
    }

    const config = await prisma.pricingConfig.findFirst();
    if (!config) return NextResponse.json({ error: "Config manquante" }, { status: 500 });

    const pricing = calculatePricing(nights, config);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: data.guestEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(pricing.nightlyTotal * 100),
            product_data: {
              name: `${nights} nuit(s) — ${process.env.NEXT_PUBLIC_PROPERTY_NAME || "Appartement"}`,
              description: `${checkIn.toLocaleDateString("fr-FR")} → ${checkOut.toLocaleDateString("fr-FR")}`,
              images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
            },
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(pricing.cleaningFee * 100),
            product_data: { name: "Frais de ménage" },
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(pricing.taxes * 100),
            product_data: { name: "Taxes et charges" },
          },
          quantity: 1,
        },
      ],
      metadata: {
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone || "",
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: String(data.guests),
        nights: String(nights),
        totalPrice: String(pricing.total),
        discount: String(pricing.discount),
        notes: data.notes || "",
      },
      success_url: `${appUrl}/reservation/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/#reserver`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Checkout error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur lors de la création du paiement" }, { status: 500 });
  }
}
