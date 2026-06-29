import Link from "next/link";
import { PROPERTY, AMENITIES } from "@/lib/constants";
import { Star, MapPin, Waves, Shield, CreditCard, CheckCircle } from "lucide-react";

export function Footer() {
  const topAmenities = AMENITIES.flatMap((c) => c.items).slice(0, 8);

  return (
    <footer className="bg-gray-950 text-white mt-16">
      {/* CTA band */}
      <div className="relative bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-white rounded-full -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full translate-y-1/2 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black mb-1">Prêt à réserver ?</h3>
            <p className="text-brand-100 text-sm">Réservation directe · Aucune commission · Paiement sécurisé Stripe</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-brand-100 text-xs">
                <Shield className="w-3.5 h-3.5" />
                Paiement SSL
              </div>
              <div className="flex items-center gap-1.5 text-brand-100 text-xs">
                <CheckCircle className="w-3.5 h-3.5" />
                Confirmation instantanée
              </div>
              <div className="flex items-center gap-1.5 text-brand-100 text-xs">
                <CreditCard className="w-3.5 h-3.5" />
                Stripe
              </div>
            </div>
          </div>
          <Link
            href="#reserver"
            className="flex-shrink-0 bg-white text-brand-700 hover:bg-brand-50 font-black px-8 py-4 rounded-2xl text-lg transition-all hover:shadow-2xl hover:-translate-y-1.5 whitespace-nowrap"
          >
            Réserver maintenant →
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg font-serif">{PROPERTY.shortName}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">{PROPERTY.tagline}</p>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-white">{PROPERTY.rating}</span>
              <span className="text-gray-500 text-sm">· {PROPERTY.reviewCount} avis</span>
            </div>
          </div>

          {/* Logement */}
          <div>
            <h4 className="font-bold mb-5 text-white text-sm uppercase tracking-wider">Le logement</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />{PROPERTY.location}</li>
              <li>👥 Max {PROPERTY.maxGuests} voyageurs</li>
              <li>🛏️ {PROPERTY.bedrooms} chambres · {PROPERTY.beds} lits</li>
              <li>🚿 {PROPERTY.bathrooms} salles de bain</li>
              <li>🏖️ Accès privé à la mer</li>
              <li>🔑 Check-in : {PROPERTY.checkInTime}</li>
              <li>🚪 Check-out : {PROPERTY.checkOutTime}</li>
            </ul>
          </div>

          {/* Équipements */}
          <div>
            <h4 className="font-bold mb-5 text-white text-sm uppercase tracking-wider">Équipements clés</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {topAmenities.map((a) => (
                <li key={a} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Réservation */}
          <div>
            <h4 className="font-bold mb-5 text-white text-sm uppercase tracking-wider">Réservation directe</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                "Sans commission Airbnb",
                "Paiement Stripe sécurisé",
                "Confirmation instantanée",
                "Annulation flexible",
                "Support propriétaire direct",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7 space-y-2">
              <Link href="#reserver" className="block text-center bg-brand-600 hover:bg-brand-500 font-semibold px-5 py-3 rounded-xl text-sm transition-all">
                Vérifier les disponibilités
              </Link>
              <Link href="#contact" className="block text-center bg-white/8 hover:bg-white/12 font-semibold px-5 py-3 rounded-xl text-sm transition-all border border-white/10">
                Contacter le propriétaire
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800/60 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} {PROPERTY.shortName} · Syracuse, Sicile
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SSL sécurisé</span>
            <span>·</span>
            <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> Stripe</span>
            <span>·</span>
            <Link href="/admin" className="hover:text-gray-400 transition-colors">
              Espace propriétaire
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
