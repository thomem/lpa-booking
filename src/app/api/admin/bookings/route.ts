import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const exportCsv = searchParams.get("export") === "csv";

  const where = status ? { status: status as "CONFIRMED" | "PENDING" | "CANCELLED" } : {};

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  if (exportCsv) {
    const headers = ["ID", "Nom", "Email", "Téléphone", "Check-in", "Check-out", "Nuits", "Voyageurs", "Total", "Statut", "Date réservation"];
    const rows = bookings.map((b) => [
      b.id,
      b.guestName,
      b.guestEmail,
      b.guestPhone || "",
      b.checkIn.toISOString().split("T")[0],
      b.checkOut.toISOString().split("T")[0],
      b.nights,
      b.guests,
      b.totalPrice.toFixed(2),
      b.status,
      b.createdAt.toISOString().split("T")[0],
    ]);

    const csv = [headers, ...rows].map((r) => r.join(";")).join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="reservations-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  }

  return NextResponse.json(bookings);
}
