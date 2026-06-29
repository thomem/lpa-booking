import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [totalBookings, confirmedBookings, pendingBookings, revenue, upcomingBookings] =
    await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.aggregate({
        where: { status: "CONFIRMED" },
        _sum: { totalPrice: true },
      }),
      prisma.booking.findMany({
        where: { status: "CONFIRMED", checkIn: { gte: new Date() } },
        orderBy: { checkIn: "asc" },
        take: 5,
      }),
    ]);

  return NextResponse.json({
    totalBookings,
    confirmedBookings,
    pendingBookings,
    totalRevenue: revenue._sum.totalPrice || 0,
    upcomingBookings,
  });
}
