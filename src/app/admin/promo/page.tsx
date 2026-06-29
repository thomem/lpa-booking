"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Tag } from "lucide-react";
import toast from "react-hot-toast";

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  type: "PERCENTAGE" | "FIXED";
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
}

export default function PromoPage() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [form, setForm] = useState({ code: "", discount: 10, type: "PERCENTAGE" as const, maxUses: "", expiresAt: "" });
  const [saving, setSaving] = useState(false);

  const fetch_ = () => {
    fetch("/api/admin/promo").then((r) => r.json()).then(setPromos).catch(() => {});
  };

  useEffect(fetch_, []);

  const create = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          discount: Number(form.discount),
          type: form.type,
          maxUses: form.maxUses ? Number(form.maxUses) : null,
          expiresAt: form.expiresAt || null,
        }),
      });
      if (res.ok) { toast.success("Code promo créé !"); setForm({ code: "", discount: 10, type: "PERCENTAGE", maxUses: "", expiresAt: "" }); fetch_(); }
      else { const d = await res.json(); toast.error(d.error || "Erreur"); }
    } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/promo?id=${id}`, { method: "DELETE" });
    toast.success("Code supprimé"); fetch_();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Codes promo</h1>

      {/* Create form */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Créer un code</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Code *</label>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="BIENVENUE20" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "PERCENTAGE" | "FIXED" })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="PERCENTAGE">Pourcentage (%)</option>
              <option value="FIXED">Montant fixe (€)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Réduction *</label>
            <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Max utilisations</label>
            <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
              placeholder="Illimité" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Expire le</label>
            <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>
        <button onClick={create} disabled={saving || !form.code}
          className="mt-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
          {saving ? "Création..." : "Créer le code promo"}
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {promos.length === 0 && <p className="text-gray-400">Aucun code promo.</p>}
        {promos.map((p) => (
          <div key={p.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-900/30 rounded-lg flex items-center justify-center">
                <Tag className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="font-bold text-white font-mono">{p.code}</p>
                <p className="text-sm text-gray-400">
                  {p.type === "PERCENTAGE" ? `${p.discount}% de réduction` : `${p.discount}€ de réduction`}
                  {p.maxUses && ` · ${p.usedCount}/${p.maxUses} utilisations`}
                  {!p.maxUses && ` · ${p.usedCount} utilisations`}
                  {p.expiresAt && ` · Expire le ${new Date(p.expiresAt).toLocaleDateString("fr-FR")}`}
                </p>
              </div>
            </div>
            <button onClick={() => remove(p.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
