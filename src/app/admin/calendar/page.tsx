"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import "react-day-picker/style.css";
import { Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface BlockedDate {
  id: string;
  date: string;
  reason?: string;
}

export default function CalendarPage() {
  const [blocked, setBlocked] = useState<BlockedDate[]>([]);
  const [selected, setSelected] = useState<Date | undefined>();
  const [reason, setReason] = useState("");

  const fetchBlocked = () => {
    fetch("/api/admin/blocked-dates")
      .then((r) => r.json())
      .then(setBlocked)
      .catch(() => {});
  };

  useEffect(fetchBlocked, []);

  const addBlock = async () => {
    if (!selected) return toast.error("Sélectionnez une date.");
    const res = await fetch("/api/admin/blocked-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: selected.toISOString(), reason }),
    });
    if (res.ok) {
      toast.success("Date bloquée.");
      setSelected(undefined);
      setReason("");
      fetchBlocked();
    } else {
      toast.error("Erreur.");
    }
  };

  const removeBlock = async (id: string) => {
    const res = await fetch(`/api/admin/blocked-dates?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Date débloquée."); fetchBlocked(); }
  };

  const blockedDates = blocked.map((b) => new Date(b.date));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Gestion du calendrier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar picker */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="font-semibold text-white mb-4">Bloquer une date</h2>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            disabled={{ before: new Date() }}
            modifiers={{ blocked: blockedDates }}
            modifiersClassNames={{ blocked: "line-through opacity-50" }}
            locale={fr}
            className="text-white"
          />
          <div className="mt-4 space-y-3">
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Raison (facultatif)"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              onClick={addBlock}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Bloquer cette date
            </button>
          </div>
        </div>

        {/* List of blocked dates */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="font-semibold text-white mb-4">
            Dates bloquées ({blocked.length})
          </h2>
          {blocked.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucune date bloquée.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {blocked.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-xl">
                  <div>
                    <p className="text-white font-medium text-sm">
                      {new Date(b.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    {b.reason && <p className="text-gray-400 text-xs mt-0.5">{b.reason}</p>}
                  </div>
                  <button
                    onClick={() => removeBlock(b.id)}
                    className="p-1.5 hover:bg-red-900/30 hover:text-red-400 text-gray-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
