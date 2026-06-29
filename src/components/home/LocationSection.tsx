"use client";

import { PROPERTY } from "@/lib/constants";
import { MapPin, Clock, Car, Plane } from "lucide-react";
import { motion } from "framer-motion";

const DISTANCES = [
  { icon: Car, label: "Ortygie (Syracuse)", time: "15 min" },
  { icon: Car, label: "Plage de Plemmirio", time: "10 min" },
  { icon: Car, label: "Modica / Raguse / Noto", time: "35-45 min" },
  { icon: Plane, label: "Aéroport de Catane", time: "50 min" },
];

export function LocationSection() {
  const { coordinates } = PROPERTY;
  const mapUrl = `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=14&output=embed`;

  return (
    <section id="localisation" className="py-12 border-t border-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Où vous serez</h2>
        <div className="flex items-center gap-2 text-gray-500 mb-6">
          <MapPin className="w-4 h-4 text-brand-600" />
          <span className="text-sm">{PROPERTY.location}</span>
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden h-80 bg-gray-100 shadow-sm border border-gray-100 mb-6">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="border-0"
            title="Localisation du logement"
          />
        </div>

        {/* Distances grid */}
        <div className="grid grid-cols-2 gap-3">
          {DISTANCES.map(({ icon: Icon, label, time }) => (
            <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <Icon className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <p className="text-gray-900 text-sm font-medium">{label}</p>
                <p className="text-gray-400 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-gray-400 text-xs mt-4">
          La localisation exacte sera communiquée après confirmation de votre réservation.
        </p>
      </motion.div>
    </section>
  );
}
