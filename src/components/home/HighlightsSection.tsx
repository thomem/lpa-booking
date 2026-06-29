"use client";

import { motion } from "framer-motion";
import { PROPERTY, HIGHLIGHTS } from "@/lib/constants";
import { Star, Award } from "lucide-react";

export function HighlightsSection() {
  return (
    <section className="py-10">
      {/* Host + title row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-start justify-between gap-6 pb-8 border-b border-gray-100"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-brand-600" />
            <span className="text-sm font-semibold text-brand-600 uppercase tracking-wider">Superhost</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Appartement entier — {PROPERTY.bedrooms} chambres · {PROPERTY.beds} lits
          </h2>
          <p className="text-gray-500">
            {PROPERTY.maxGuests} voyageurs · {PROPERTY.bedrooms} chambres · {PROPERTY.beds} lits · {PROPERTY.bathrooms} salle de bain
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${s <= Math.round(PROPERTY.rating) ? "fill-gray-900 text-gray-900" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="font-semibold text-gray-900">{PROPERTY.rating}</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500 underline cursor-pointer">{PROPERTY.reviewCount} avis</span>
          </div>
        </div>

        {/* Host avatar */}
        <div className="flex-shrink-0 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            🏠
          </div>
          <p className="text-xs text-gray-400 mt-1 font-medium">Propriétaire</p>
          <span className="inline-block bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full mt-1">
            Superhost
          </span>
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="py-8 border-b border-gray-100"
      >
        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
          {PROPERTY.description}
        </p>
      </motion.div>

      {/* Highlights grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-0"
      >
        {HIGHLIGHTS.map((h, i) => (
          <motion.div
            key={h.title}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="flex gap-5 py-5 border-b border-gray-100 last:border-0 group"
          >
            <span className="text-3xl mt-0.5 group-hover:scale-110 transition-transform duration-200">
              {h.icon}
            </span>
            <div>
              <p className="font-semibold text-gray-900 text-base">{h.title}</p>
              <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{h.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
