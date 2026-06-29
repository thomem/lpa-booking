import { PROPERTY, RULES } from "@/lib/constants";
import { Shield, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export function RulesSection() {
  return (
    <section className="py-10 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">À savoir avant de réserver</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Rules */}
        <div>
          <div className="flex items-center gap-2.5 font-semibold text-gray-900 mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            Règles du logement
          </div>
          <ul className="space-y-2.5">
            {RULES.map((rule) => (
              <li key={rule} className="flex items-start gap-2.5 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Horaires */}
        <div>
          <div className="flex items-center gap-2.5 font-semibold text-gray-900 mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            Horaires
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500">Arrivée</span>
              <span className="font-semibold text-gray-900">À partir de {PROPERTY.checkInTime}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500">Départ</span>
              <span className="font-semibold text-gray-900">Avant {PROPERTY.checkOutTime}</span>
            </div>
          </div>
        </div>

        {/* Annulation */}
        <div>
          <div className="flex items-center gap-2.5 font-semibold text-gray-900 mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            Politique d&apos;annulation
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 leading-relaxed">
            Annulation gratuite jusqu&apos;à <strong>48h avant l&apos;arrivée</strong>. Passé ce délai, les frais de la première nuit sont retenus.
          </div>
        </div>
      </div>
    </section>
  );
}
