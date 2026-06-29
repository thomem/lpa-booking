"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Config {
  basePrice: number;
  cleaningFee: number;
  taxRate: number;
  weeklyDiscount: number;
  monthlyDiscount: number;
  minNights: number;
  maxGuests: number;
}

export default function PricingPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) toast.success("Tarification mise à jour !");
      else toast.error("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  if (!config) return <div className="text-white">Chargement...</div>;

  const fields: { key: keyof Config; label: string; suffix: string; step: number }[] = [
    { key: "basePrice", label: "Prix de base / nuit", suffix: "€", step: 1 },
    { key: "cleaningFee", label: "Frais de ménage", suffix: "€", step: 1 },
    { key: "taxRate", label: "Taux de taxes", suffix: "%", step: 0.01 },
    { key: "weeklyDiscount", label: "Réduction hebdomadaire (7+ nuits)", suffix: "%", step: 0.01 },
    { key: "monthlyDiscount", label: "Réduction mensuelle (28+ nuits)", suffix: "%", step: 0.01 },
    { key: "minNights", label: "Séjour minimum (nuits)", suffix: "", step: 1 },
    { key: "maxGuests", label: "Nombre max de voyageurs", suffix: "", step: 1 },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Tarification</h1>

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-5">
        {fields.map(({ key, label, suffix, step }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
            <div className="relative">
              <input
                type="number"
                step={step}
                value={
                  suffix === "%" ? +(config[key] as number * 100).toFixed(1) : config[key]
                }
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setConfig((c) => ({
                    ...c!,
                    [key]: suffix === "%" ? v / 100 : v,
                  }));
                }}
                className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {suffix && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  {suffix}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3 rounded-xl transition-colors disabled:opacity-50"
      >
        {saving ? "Enregistrement..." : "Enregistrer les modifications"}
      </button>
    </div>
  );
}
