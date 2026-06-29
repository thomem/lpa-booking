"use client";

import { motion } from "framer-motion";
import { PROPERTY, HIGHLIGHTS } from "@/lib/constants";

export function HighlightsSection() {
  return (
    <section className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6 pb-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Appartement entier — {PROPERTY.bedrooms} chambres
            </h2>
            <p className="text-gray-500 mt-1">
              {PROPERTY.maxGuests} voyageurs · {PROPERTY.bedrooms} chambres · {PROPERTY.beds} lits · {PROPERTY.bathrooms} salle de bain
            </p>
          </div>
          <div className="w-14 h-14 rounded-full bg-brand-600 flex items-center justify-center text-2xl flex-shrink-0">
            🏠
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{PROPERTY.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {HIGHLIGHTS.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <span className="text-3xl">{h.icon}</span>
              <div>
                <p className="font-semibold text-gray-900">{h.title}</p>
                <p className="text-sm text-gray-500">{h.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
