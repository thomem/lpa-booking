import Link from "next/link";
import { PROPERTY, AMENITIES } from "@/lib/constants";
import { Star, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  const allAmenities = AMENITIES.flatMap((c) => c.items).slice(0, 8);

  return (
    <footer className="bg-gray-950 text-white mt-20">
      {/* Top CTA band */}
      <div className="bg-brand-600 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black">Prêt à réserver ?</h3>
            <p className="text-brand-200 mt-1">Réservation directe — aucune commission. Paiement sécurisé Stripe.</p>
          </div>
          <Link
            href="#reserver"
            className="flex-shrink-0 bg-white text-brand-600 hover:bg-brand-50 font-bold px-8 py-4 rounded-2xl text-lg transition-all hover:shadow-xl hover:-translate-y-1 whitespace-nowrap"
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
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏠</span>
              <span className="font-black text-lg">{PROPERTY.shortName}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">{PROPERTY.tagline}</p>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{PROPERTY.rating}</span>
              <span className="text-gray-500 text-sm">· {PROPERTY.reviewCount} avis</span>
            </div>
          </div>

          {/* Logement */}
          <div>
            <h4 className="font-bold mb-4 text-white">Le logement</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-600" />{PROPERTY.location}</li>
              <li>👥 Max {PROPERTY.maxGuests} voyageurs</li>
              <li>🛏️ {PROPERTY.bedrooms} chambres · {PROPERTY.beds} lits</li>
              <li>🚿 {PROPERTY.bathrooms} salle de bain</li>
              <li>🔑 Check-in : {PROPERTY.checkInTime}</li>
              <li>🚪 Check-out : {PROPERTY.checkOutTime}</li>
            </ul>
          </div>

          {/* Équipements */}
          <div>
            <h4 className="font-bold mb-4 text-white">Équipements clés</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {allAmenities.map((a) => (
                <li key={a}>✓ {a}</li>
              ))}
            </ul>
          </div>

          {/* Réservation */}
          <div>
            <h4 className="font-bold mb-4 text-white">Réservation directe</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span> Sans commission Airbnb
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span> Paiement Stripe sécurisé
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span> Confirmation instantanée
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span> Annulation flexible
              </li>
            </ul>
            <div className="mt-6 space-y-2">
              <Link href="#reserver" className="block text-center bg-brand-600 hover:bg-brand-500 font-semibold px-5 py-3 rounded-xl text-sm transition-all">
                Vérifier les disponibilités
              </Link>
              <Link href="#contact" className="block text-center bg-white/10 hover:bg-white/15 font-semibold px-5 py-3 rounded-xl text-sm transition-all">
                Contacter le propriétaire
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} {PROPERTY.shortName}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>🔒 Paiement sécurisé SSL</span>
            <span>·</span>
            <span>💳 Stripe</span>
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
