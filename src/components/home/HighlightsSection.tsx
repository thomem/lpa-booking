"use client";

import { motion } from "framer-motion";
import { PROPERTY, HIGHLIGHTS } from "@/lib/constants";
import { Star } from "lucide-react";

export function HighlightsSection() {
  return (
    <section className="py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="flex items-start justify-between gap-6 pb-10 border-b border-gray-100"
      >
        <div className="flex-1">
          <p className="text-brand-600 text-sm font-bold uppercase tracking-[0.15em] mb-2">
            Logement entier · Luxe & Nature
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2 leading-tight">
            {PROPERTY.bedrooms} chambres · {PROPERTY.beds} lits · {PROPERTY.bathrooms} salles de bain
          </h2>
          <p className="text-gray-500 text-base">
            Jusqu&apos;à {PROPERTY.maxGuests} voyageurs · 360 m² · Syracuse, Sicile
          </p>
          <div className="flex items-center gap-2.5 mt-4">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${s <= Math.round(PROPERTY.rating) ? "fill-gray-900 text-gray-900" : "text-gray-200"}`} />
              ))}
            </div>
            <span className="font-bold text-gray-900">{PROPERTY.rating}</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500 text-sm underline cursor-pointer">{PROPERTY.reviewCount} avis</span>
          </div>
        </div>

        {/* Host avatar */}
        <div className="flex-shrink-0 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-800 flex items-center justify-center text-white text-2xl shadow-xl shadow-brand-200">
            🏠
          </div>
          <p className="text-xs text-gray-400 mt-2 font-medium">Frédéric</p>
          <span className="inline-block bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-full mt-1 border border-brand-100">
            Hôte vérifié
          </span>
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="py-10 border-b border-gray-100"
      >
        <p className="text-gray-700 leading-[1.85] text-base whitespace-pre-line">
          {PROPERTY.description}
        </p>
      </motion.div>

      {/* Highlights grid */}
      <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        {HIGHLIGHTS.map((h, i) => (
          <motion.div
            key={h.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="flex gap-5 py-5 border-b border-gray-100 last:border-0 sm:last:border-0 group"
          >
            <span className="text-3xl mt-0.5 group-hover:scale-110 transition-transform duration-300 select-none">
              {h.icon}
            </span>
            <div>
              <p className="font-semibold text-gray-900">{h.title}</p>
              <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{h.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
