"use client";

import { PROPERTY } from "@/lib/constants";
import { MapPin } from "lucide-react";

export function LocationSection() {
  const { coordinates } = PROPERTY;
  const mapUrl = `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15&output=embed`;

  return (
    <section className="py-8 border-t">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Où vous serez</h2>
      <div className="flex items-center gap-2 text-gray-600 mb-6">
        <MapPin className="w-4 h-4" />
        <span>{PROPERTY.location}</span>
      </div>
      <div className="rounded-2xl overflow-hidden h-72 bg-gray-100">
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
      <p className="text-gray-500 text-sm mt-3">
        La localisation exacte sera communiquée après confirmation de la réservation.
      </p>
    </section>
  );
}
