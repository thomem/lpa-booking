import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// iCal feed — compatible Airbnb / Google Calendar / Apple Calendar sync
export async function GET() {
  const bookings = await prisma.booking.findMany({
    where: { status: { in: ["CONFIRMED", "PENDING"] } },
    orderBy: { checkIn: "asc" },
  });

  const now = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  const propertyName = process.env.NEXT_PUBLIC_PROPERTY_NAME || "Location";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000";

  const events = bookings
    .map((b) => {
      const uid = `booking-${b.id}@${new URL(appUrl).hostname}`;
      const dtstart = b.checkIn.toISOString().split("T")[0].replace(/-/g, "");
      const dtend = b.checkOut.toISOString().split("T")[0].replace(/-/g, "");
      const created = b.createdAt.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";

      return [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        `CREATED:${created}`,
        `DTSTART;VALUE=DATE:${dtstart}`,
        `DTEND;VALUE=DATE:${dtend}`,
        `SUMMARY:Réservé — ${propertyName}`,
        `DESCRIPTION:Voyageur: ${b.guestName}\\nStatut: ${b.status}`,
        "STATUS:CONFIRMED",
        "TRANSP:OPAQUE",
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  const ical = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${propertyName}//Booking Calendar//FR`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${propertyName} — Réservations`,
    "X-WR-CALDESC:Calendrier des réservations confirmées",
    "X-WR-TIMEZONE:Europe/Paris",
    events,
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new Response(ical, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="reservations.ics"`,
      "Cache-Control": "no-cache, no-store",
    },
  });
}
