import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TrendingUp, Calendar, CheckCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalBookings, confirmed, pending, revenue, upcoming] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.aggregate({ where: { status: "CONFIRMED" }, _sum: { totalPrice: true } }),
    prisma.booking.findMany({
      where: { status: "CONFIRMED", checkIn: { gte: new Date() } },
      orderBy: { checkIn: "asc" },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Revenus totaux", value: formatCurrency(revenue._sum.totalPrice || 0), icon: TrendingUp, color: "text-green-400" },
    { label: "Réservations totales", value: totalBookings, icon: Calendar, color: "text-blue-400" },
    { label: "Confirmées", value: confirmed, icon: CheckCircle, color: "text-brand-400" },
    { label: "En attente", value: pending, icon: Clock, color: "text-yellow-400" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm">{label}</p>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Upcoming bookings */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h2 className="text-lg font-semibold text-white mb-4">Prochaines arrivées</h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-500">Aucune réservation à venir.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                <div>
                  <p className="font-semibold text-white">{b.guestName}</p>
                  <p className="text-sm text-gray-400">{b.guestEmail}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(b.checkIn)} → {formatDate(b.checkOut)} · {b.nights} nuit(s) · {b.guests} pers.
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">{formatCurrency(b.totalPrice)}</p>
                  <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded-full">Confirmé</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
