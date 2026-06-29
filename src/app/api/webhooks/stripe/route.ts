import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOwnerNotification, sendGuestConfirmation, sendTelegramNotification } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const meta = session.metadata!;

    try {
      // Create confirmed booking
      const booking = await prisma.booking.create({
        data: {
          guestName: meta.guestName,
          guestEmail: meta.guestEmail,
          guestPhone: meta.guestPhone || null,
          checkIn: new Date(meta.checkIn),
          checkOut: new Date(meta.checkOut),
          guests: parseInt(meta.guests),
          nights: parseInt(meta.nights),
          basePrice: parseFloat(meta.totalPrice),
          cleaningFee: 0, // already included in total
          taxes: 0,
          discount: parseFloat(meta.discount || "0"),
          totalPrice: parseFloat(meta.totalPrice),
          status: "CONFIRMED",
          stripeSessionId: session.id,
          stripePaymentId: session.payment_intent as string,
          notes: meta.notes || null,
        },
      });

      const bookingData = {
        guestName: meta.guestName,
        guestEmail: meta.guestEmail,
        guestPhone: meta.guestPhone,
        checkIn: new Date(meta.checkIn),
        checkOut: new Date(meta.checkOut),
        guests: parseInt(meta.guests),
        nights: parseInt(meta.nights),
        totalPrice: parseFloat(meta.totalPrice),
        bookingId: booking.id,
      };

      // Send notifications in parallel
      await Promise.allSettled([
        sendOwnerNotification(bookingData),
        sendGuestConfirmation(bookingData),
        sendTelegramNotification(bookingData),
      ]);
    } catch (err) {
      console.error("Booking creation error:", err);
      return NextResponse.json({ error: "Booking creation failed" }, { status: 500 });
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    await prisma.booking.updateMany({
      where: { stripeSessionId: session.id },
      data: { status: "CANCELLED" },
    });
  }

  return NextResponse.json({ received: true });
}
