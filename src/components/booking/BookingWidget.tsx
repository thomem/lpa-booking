"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Users, Minus, Plus, Tag, Shield, Zap } from "lucide-react";
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

  useEffect(() => {
    const now = new Date();
    fetch(`/api/availability?year=${now.getFullYear()}&month=${now.getMonth() + 1}`)
      .then((r) => r.json())
      .then((data) => {
        setBookedDates(data.bookedDates.map((d: string) => new Date(d)));
      })
      .catch(() => {});
  }, []);

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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-3xl shadow-[0_8px_60px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-gray-900 font-serif">89 €</span>
            <span className="text-gray-400 text-sm">/ nuit</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
            <Star className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
            <span className="font-bold text-sm text-gray-900">{PROPERTY.rating}</span>
            <span className="text-gray-400 text-xs">({PROPERTY.reviewCount})</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-green-500" />
          <p className="text-green-600 text-xs font-semibold">Réservation directe — sans frais de service</p>
        </div>
      </div>

      {/* Step tabs */}
      <div className="flex border-b border-gray-100">
        {(["dates", "info"] as const).map((s, i) => (
          <button
            key={s}
            onClick={() => s === "info" && range.from && range.to && setStep(s)}
            className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              step === s
                ? "text-brand-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {i + 1}. {s === "dates" ? "Dates" : "Mes informations"}
            {step === s && (
              <motion.div
                layoutId="booking-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600"
              />
            )}
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
              }}
              numberOfMonths={1}
            />

            {/* Date summary */}
            {range.from && range.to && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Arrivée</p>
                  <p className="font-bold text-gray-900">{formatDateShort(range.from)}</p>
                </div>
                <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Départ</p>
                  <p className="font-bold text-gray-900">{formatDateShort(range.to)}</p>
                </div>
              </div>
            )}

            {/* Guests */}
            <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-semibold text-sm text-gray-900">Voyageurs</p>
                  <p className="text-xs text-gray-400">Max {PROPERTY.maxGuests} personnes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-900 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold w-6 text-center text-gray-900">{guests}</span>
                <button
                  onClick={() => setGuests((g) => Math.min(PROPERTY.maxGuests, g + 1))}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-900 flex items-center justify-center transition-colors"
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
                  placeholder="Code promo (facultatif)"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Pricing breakdown */}
            {pricing && nights > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-brand-50 border border-brand-100 rounded-xl p-4 space-y-2 text-sm"
              >
                <div className="flex justify-between text-gray-700">
                  <span>{formatCurrency(pricing.basePrice)} × {nights} nuit{nights > 1 ? "s" : ""}</span>
                  <span className="font-medium">{formatCurrency(pricing.nightlyTotal)}</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>{pricing.discountLabel || pricing.promoLabel}</span>
                    <span>-{formatCurrency(pricing.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Frais de ménage</span>
                  <span className="font-medium">{formatCurrency(pricing.cleaningFee)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Taxes</span>
                  <span className="font-medium">{formatCurrency(pricing.taxes)}</span>
                </div>
                <div className="flex justify-between font-black text-base border-t border-brand-200 pt-2.5 mt-2 text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(pricing.total)}</span>
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!range.from || !range.to) return toast.error("Sélectionnez vos dates d'arrivée et de départ.");
                setStep("info");
              }}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-brand-200 text-sm"
            >
              {range.from && range.to
                ? `Continuer — ${nights} nuit${nights > 1 ? "s" : ""}`
                : "Choisir les dates"}
            </motion.button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5" />
              Aucun débit maintenant · Paiement sécurisé
            </div>
          </div>
        )}

        {step === "info" && (
          <div className="space-y-4">
            {/* Summary */}
            {range.from && range.to && (
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-3.5 text-sm flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900">{formatDateShort(range.from)} → {formatDateShort(range.to)}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{nights} nuit{nights > 1 ? "s" : ""} · {guests} voyageur{guests > 1 ? "s" : ""}</p>
                </div>
                <button onClick={() => setStep("dates")} className="text-brand-600 text-xs font-bold hover:underline">
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Adresse email *"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
              <input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="Téléphone (facultatif)"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Message au propriétaire (facultatif)"
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {pricing && (
              <div className="flex justify-between font-black text-lg border-t pt-3 text-gray-900">
                <span>Total à payer</span>
                <span>{formatCurrency(pricing.total)}</span>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2.5 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirection vers le paiement...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Payer avec Stripe
                </>
              )}
            </motion.button>

            <p className="text-xs text-gray-400 text-center">
              🔒 Paiement 100% sécurisé via Stripe
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
