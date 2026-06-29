"use client";

import { useEffect, useState } from "react";
import { Download, Search, Filter } from "lucide-react";
import { formatCurrency, formatDateShort } from "@/lib/utils";

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-green-900/50 text-green-400",
  PENDING: "bg-yellow-900/50 text-yellow-400",
  CANCELLED: "bg-red-900/50 text-red-400",
  REFUNDED: "bg-gray-800 text-gray-400",
};

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Confirmé",
  PENDING: "En attente",
  CANCELLED: "Annulé",
  REFUNDED: "Remboursé",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = filter !== "ALL" ? `?status=${filter}` : "";
    fetch(`/api/admin/bookings${params}`)
      .then((r) => r.json())
      .then(setBookings)
      .catch(() => {});
  }, [filter]);

  const filtered = bookings.filter(
    (b) =>
      b.guestName.toLowerCase().includes(search.toLowerCase()) ||
      b.guestEmail.toLowerCase().includes(search.toLowerCase())
  );

  const exportCsv = () => {
    const params = filter !== "ALL" ? `?status=${filter}&export=csv` : "?export=csv";
    window.open(`/api/admin/bookings${params}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Réservations</h1>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Exporter CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        {["ALL", "CONFIRMED", "PENDING", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === s ? "bg-brand-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {s === "ALL" ? "Tous" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                {["Voyageur", "Dates", "Nuits", "Pers.", "Total", "Statut", "Réservé le"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Aucune réservation trouvée.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-medium text-white">{b.guestName}</p>
                      <p className="text-gray-400">{b.guestEmail}</p>
                      {b.guestPhone && <p className="text-gray-500 text-xs">{b.guestPhone}</p>}
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {formatDateShort(b.checkIn)} →<br />{formatDateShort(b.checkOut)}
                    </td>
                    <td className="px-4 py-4 text-gray-300">{b.nights}</td>
                    <td className="px-4 py-4 text-gray-300">{b.guests}</td>
                    <td className="px-4 py-4 font-semibold text-green-400">{formatCurrency(b.totalPrice)}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[b.status]}`}>
                        {STATUS_LABELS[b.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-500">{formatDateShort(b.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
