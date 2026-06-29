import { PROPERTY, RULES } from "@/lib/constants";
import { Shield, Clock, CheckCircle2 } from "lucide-react";

export function RulesSection() {
  return (
    <section className="py-8 border-t">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">À savoir</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2 font-semibold mb-3">
            <Shield className="w-5 h-5" /> Règles du logement
          </div>
          <ul className="space-y-2">
            {RULES.map((rule) => (
              <li key={rule} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-2 font-semibold mb-3">
            <Clock className="w-5 h-5" /> Horaires
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Arrivée :</span> à partir de {PROPERTY.checkInTime}</p>
            <p><span className="font-medium">Départ :</span> avant {PROPERTY.checkOutTime}</p>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 font-semibold mb-3">
            🛡️ Politique d&apos;annulation
          </div>
          <p className="text-sm text-gray-600">
            Annulation gratuite jusqu&apos;à 48h avant l&apos;arrivée. Passé ce délai, les frais de la première nuit sont retenus.
          </p>
        </div>
      </div>
    </section>
  );
}
