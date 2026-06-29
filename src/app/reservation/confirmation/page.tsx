"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Users, Euro } from "lucide-react";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  status: string;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) { setError("Session invalide."); setLoading(false); return; }

    fetch(`/api/booking/confirm?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.booking) setBooking(data.booking);
        else setError("Réservation introuvable.");
      })
      .catch(() => setError("Erreur lors de la récupération de la réservation."))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg">{error || "Réservation introuvable."}</p>
          <Link href="/" className="mt-4 inline-block text-brand-600 hover:underline">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Réservation confirmée !</h1>
          <p className="text-gray-500">
            Merci {booking.guestName}. Un email de confirmation a été envoyé à {booking.guestEmail}.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Calendar className="w-5 h-5 text-brand-600" />
            <div>
              <p className="text-xs text-gray-500">Séjour</p>
              <p className="font-semibold">{formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</p>
              <p className="text-sm text-gray-500">{booking.nights} nuit(s)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Users className="w-5 h-5 text-brand-600" />
            <div>
              <p className="text-xs text-gray-500">Voyageurs</p>
              <p className="font-semibold">{booking.guests} personne(s)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-brand-50 rounded-xl">
            <Euro className="w-5 h-5 text-brand-600" />
            <div>
              <p className="text-xs text-gray-500">Total payé</p>
              <p className="font-bold text-xl text-brand-700">{formatCurrency(booking.totalPrice)}</p>
            </div>
          </div>

          <div className="pt-2 border-t text-xs text-gray-400 text-center">
            Référence : {booking.id}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" /></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
