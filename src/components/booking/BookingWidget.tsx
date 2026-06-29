"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Users, Minus, Plus, Tag } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import "react-day-picker/style.css";
import { PROPERTY } from "@/lib/constants";
import { formatCurrency, diffInDays, formatDateShort } from "@/lib/utils";
import toast from "react-hot-toast";

interface PricingBreakdown {
  nights: number;
  basePrice: number;
  nightlyTotal: number;
  cleaningFee: number;
  taxes: number;
  discount: number;
  discountLabel: string;
  total: number;
  promoLabel?: string;
}

export function BookingWidget() {
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [notes, setNotes] = useState("");
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"dates" | "info">("dates");

  // Load availability
  useEffect(() => {
    const now = new Date();
    fetch(`/api/availability?year=${now.getFullYear()}&month=${now.getMonth() + 1}`)
      .then((r) => r.json())
      .then((data) => {
        setBookedDates(data.bookedDates.map((d: string) => new Date(d)));
      })
      .catch(() => {});
  }, []);

  // Fetch pricing when dates change
  useEffect(() => {
    if (!range.from || !range.to) {
      setPricing(null);
      return;
    }
    fetch("/api/pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkIn: range.from.toISOString(),
        checkOut: range.to.toISOString(),
        promoCode: promoCode || undefined,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setPricing(data);
      })
      .catch(() => {});
  }, [range, promoCode]);

  const nights = range.from && range.to ? diffInDays(range.from, range.to) : 0;

  const handleSubmit = async () => {
    if (!range.from || !range.to) return toast.error("Sélectionnez vos dates.");
    if (!guestName.trim()) return toast.error("Indiquez votre nom.");
    if (!guestEmail.includes("@")) return toast.error("Email invalide.");

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkIn: range.from.toISOString(),
          checkOut: range.to.toISOString(),
          guests,
          guestName,
          guestEmail,
          guestPhone,
          promoCode: promoCode || undefined,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erreur lors de la réservation.");
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-baseline justify-between mb-1">
          <div>
            <span className="text-2xl font-bold text-gray-900">À partir de 89 €</span>
            <span className="text-gray-500 ml-1">/ nuit</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-gray-900" />
            <span className="font-semibold">{PROPERTY.rating}</span>
            <span className="text-gray-500">({PROPERTY.reviewCount})</span>
          </div>
        </div>
        <p className="text-green-600 text-sm font-medium mb-4">✓ Réservation directe — sans frais de service</p>
      </div>

      {/* Steps */}
      <div className="flex border-b">
        {(["dates", "info"] as const).map((s) => (
          <button
            key={s}
            onClick={() => s === "info" && range.from && range.to && setStep(s)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              step === s
                ? "border-b-2 border-brand-600 text-brand-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {s === "dates" ? "1. Dates" : "2. Vos informations"}
          </button>
        ))}
      </div>

      <div className="p-4">
        {step === "dates" && (
          <div className="space-y-4">
            {/* Calendar */}
            <DayPicker
              mode="range"
              selected={{ from: range.from, to: range.to }}
              onSelect={(r) => setRange(r || {})}
              disabled={[{ before: new Date() }, ...bookedDates]}
              locale={fr}
              className="!w-full"
              classNames={{
                root: "text-sm",
                day_selected: "bg-brand-600 text-white",
                day_range_middle: "bg-brand-100 text-brand-900",
              }}
              numberOfMonths={1}
            />

            {/* Date summary */}
            {range.from && range.to && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="border rounded-xl p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Arrivée</p>
                  <p className="font-semibold">{formatDateShort(range.from)}</p>
                </div>
                <div className="border rounded-xl p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Départ</p>
                  <p className="font-semibold">{formatDateShort(range.to)}</p>
                </div>
              </div>
            )}

            {/* Guests */}
            <div className="border rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-semibold text-sm">Voyageurs</p>
                  <p className="text-xs text-gray-500">Max {PROPERTY.maxGuests}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-semibold w-6 text-center">{guests}</span>
                <button
                  onClick={() => setGuests((g) => Math.min(PROPERTY.maxGuests, g + 1))}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Promo code */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Code promo"
                  className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Pricing breakdown */}
            {pricing && nights > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{formatCurrency(pricing.basePrice)} × {nights} nuit(s)</span>
                  <span>{formatCurrency(pricing.nightlyTotal)}</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{pricing.discountLabel || pricing.promoLabel}</span>
                    <span>-{formatCurrency(pricing.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de ménage</span>
                  <span>{formatCurrency(pricing.cleaningFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span>{formatCurrency(pricing.taxes)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>{formatCurrency(pricing.total)}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (!range.from || !range.to) return toast.error("Sélectionnez vos dates d'arrivée et de départ.");
                setStep("info");
              }}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg disabled:opacity-50"
            >
              {range.from && range.to ? `Continuer — ${nights} nuit(s)` : "Choisir les dates"}
            </button>
          </div>
        )}

        {step === "info" && (
          <div className="space-y-4">
            {/* Summary */}
            {range.from && range.to && (
              <div className="bg-gray-50 rounded-xl p-3 text-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold">{formatDateShort(range.from)} → {formatDateShort(range.to)}</p>
                  <p className="text-gray-500">{nights} nuit(s) · {guests} voyageur(s)</p>
                </div>
                <button onClick={() => setStep("dates")} className="text-brand-600 text-xs font-semibold hover:underline">
                  Modifier
                </button>
              </div>
            )}

            {/* Guest info form */}
            <div className="space-y-3">
              <input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Nom complet *"
                className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Adresse email *"
                className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="Téléphone (facultatif)"
                className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Message au propriétaire (facultatif)"
                rows={2}
                className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            {/* Final total */}
            {pricing && (
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total à payer</span>
                <span>{formatCurrency(pricing.total)}</span>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirection vers le paiement...
                </>
              ) : (
                <>💳 Payer avec Stripe</>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
              🔒 Paiement 100% sécurisé — Stripe
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
