"use client";

import { motion } from "framer-motion";
import { PROPERTY, HIGHLIGHTS } from "@/lib/constants";
import { Star, Shield, Award } from "lucide-react";

const STAT_ITEMS = [
  { value: "360", unit: "m²", label: "Surface totale" },
  { value: String(PROPERTY.bedrooms), unit: "ch.", label: "Chambres vue mer" },
  { value: String(PROPERTY.maxGuests), unit: "pers.", label: "Capacité max." },
  { value: String(PROPERTY.rating), unit: "★", label: `${PROPERTY.reviewCount} avis clients` },
];

export function HighlightsSection() {
  return (
    <section className="py-12">
      {/* Property header — Airbnb style */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="flex items-start justify-between gap-6 pb-8 border-b border-gray-100"
      >
        <div className="flex-1">
          <p className="text-brand-600 text-sm font-bold uppercase tracking-[0.15em] mb-2">
            Logement entier · Luxe &amp; Nature
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-1.5 leading-tight">
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

        {/* Host card */}
        <div className="flex-shrink-0 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-800 flex items-center justify-center text-white text-2xl shadow-xl shadow-brand-200 mb-2">
            🏠
          </div>
          <p className="text-xs text-gray-500 font-semibold">Frédéric</p>
          <div className="flex items-center gap-1 justify-center mt-1">
            <Shield className="w-3 h-3 text-brand-600" />
            <span className="text-xs text-brand-700 font-bold">Hôte vérifié</span>
          </div>
          <div className="flex items-center gap-1 justify-center mt-0.5">
            <Award className="w-3 h-3 text-amber-500" />
            <span className="text-xs text-amber-700 font-semibold">Superhost</span>
          </div>
        </div>
      </motion.div>

      {/* Key stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-b border-gray-100"
      >
        {STAT_ITEMS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center group"
          >
            <div className="flex items-baseline justify-center gap-1 mb-1">
              <span className="font-serif font-black text-3xl text-gray-900 group-hover:text-brand-600 transition-colors">
                {stat.value}
              </span>
              <span className="text-brand-500 font-bold text-base">{stat.unit}</span>
            </div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="py-8 border-b border-gray-100"
      >
        <p className="text-gray-700 leading-[1.9] text-base whitespace-pre-line">
          {PROPERTY.description}
        </p>
      </motion.div>

      {/* Highlights grid */}
      <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-0">
        {HIGHLIGHTS.map((h, i) => (
          <motion.div
            key={h.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            className="flex gap-5 py-5 border-b border-gray-100 last:border-0 sm:[&:nth-last-child(2)]:border-0 group hover:bg-gray-50/70 rounded-xl px-3 -mx-3 transition-colors duration-200"
          >
            <div className="w-10 h-10 flex-shrink-0 bg-brand-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-brand-100 group-hover:scale-110 transition-all duration-300">
              {h.icon}
            </div>
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
