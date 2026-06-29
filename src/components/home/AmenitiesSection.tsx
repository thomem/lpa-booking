"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AMENITIES } from "@/lib/constants";
import { CheckCircle2, ChevronDown } from "lucide-react";

const CATEGORY_META: Record<string, { icon: string; color: string; bg: string }> = {
  "Essentiels":             { icon: "⚡", color: "text-amber-600", bg: "bg-amber-50" },
  "Cuisine":                { icon: "🍳", color: "text-orange-600", bg: "bg-orange-50" },
  "Chambre & Salle de bain":{ icon: "🛁", color: "text-blue-600",   bg: "bg-blue-50" },
  "Extérieur":              { icon: "🌿", color: "text-green-600",  bg: "bg-green-50" },
  "Emplacement":            { icon: "📍", color: "text-rose-600",   bg: "bg-rose-50" },
  "Sécurité":               { icon: "🛡️", color: "text-purple-600", bg: "bg-purple-50" },
};

export function AmenitiesSection() {
  const [expanded, setExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const visible = expanded ? AMENITIES : AMENITIES.slice(0, 3);
  const totalItems = AMENITIES.flatMap((c) => c.items).length;

  return (
    <section id="equipements" className="py-12 border-t border-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Ce que propose ce logement</h2>
        <p className="text-gray-400 text-sm mb-8">{totalItems} équipements inclus</p>

        <div className="space-y-3">
          {visible.map((cat, ci) => {
            const meta = CATEGORY_META[cat.category] || { icon: "✨", color: "text-gray-600", bg: "bg-gray-50" };
            const isOpen = activeCategory === cat.category;

            return (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.06 }}
                className="border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors duration-200"
              >
                <button
                  onClick={() => setActiveCategory(isOpen ? null : cat.category)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center text-lg flex-shrink-0`}>
                      {meta.icon}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">{cat.category}</span>
                      <span className="text-gray-400 text-xs ml-2.5 bg-gray-100 px-2 py-0.5 rounded-full">
                        {cat.items.length}
                      </span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                          {cat.items.map((item, ii) => (
                            <motion.div
                              key={item}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: ii * 0.03 }}
                              className="flex items-center gap-2.5 text-gray-700 text-sm py-0.5"
                            >
                              <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                              <span>{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Show all button or quick-open hint */}
        {!expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 flex items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setExpanded(true)}
              className="flex items-center gap-2 border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 font-semibold px-7 py-3.5 rounded-xl transition-all duration-200"
            >
              Voir tous les {totalItems} équipements
              <ChevronDown className="w-4 h-4" />
            </motion.button>
            <span className="text-gray-400 text-sm">
              + {AMENITIES.length - 3} autres catégories
            </span>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
