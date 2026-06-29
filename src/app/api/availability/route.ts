import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
  const month = parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString());

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month + 1, 0); // get extra month for calendar nav

  // Get confirmed bookings
  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ["CONFIRMED", "PENDING"] },
      OR: [
        { checkIn: { gte: startDate, lte: endDate } },
        { checkOut: { gte: startDate, lte: endDate } },
        { AND: [{ checkIn: { lte: startDate } }, { checkOut: { gte: endDate } }] },
      ],
    },
    select: { checkIn: true, checkOut: true },
  });

  // Get manually blocked dates
  const blocked = await prisma.blockedDate.findMany({
    where: { date: { gte: startDate, lte: endDate } },
    select: { date: true },
  });

  // Expand bookings into individual dates
  const bookedDates: string[] = [];

  for (const booking of bookings) {
    const current = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);
    while (current < end) {
      bookedDates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
  }

  const blockedDates = blocked.map((b) => b.date.toISOString().split("T")[0]);

  return NextResponse.json({
    bookedDates: [...new Set([...bookedDates, ...blockedDates])],
  });
}
