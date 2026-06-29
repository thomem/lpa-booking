import Link from "next/link";
import { PROPERTY } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">🏠 {PROPERTY.shortName}</h3>
            <p className="text-gray-400 text-sm">{PROPERTY.tagline}</p>
            <p className="text-gray-400 text-sm mt-2">{PROPERTY.location}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Informations</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Check-in : à partir de {PROPERTY.checkInTime}</li>
              <li>Check-out : avant {PROPERTY.checkOutTime}</li>
              <li>Jusqu&apos;à {PROPERTY.maxGuests} voyageurs</li>
              <li>{PROPERTY.bedrooms} chambres • {PROPERTY.beds} lits</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Réservation directe</h3>
            <p className="text-gray-400 text-sm mb-4">
              Réservez directement auprès du propriétaire, sans commission de plateforme.
            </p>
            <Link
              href="#reserver"
              className="inline-block bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all"
            >
              Réserver maintenant
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {PROPERTY.shortName}. Tous droits réservés.
          </p>
          <Link href="/admin" className="text-gray-600 hover:text-gray-400 text-xs">
            Espace propriétaire
          </Link>
        </div>
      </div>
    </footer>
  );
}
