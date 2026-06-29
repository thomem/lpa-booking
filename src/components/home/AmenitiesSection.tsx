"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AMENITIES } from "@/lib/constants";
import { CheckCircle2, ChevronRight } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  "Essentiels": "⚡",
  "Cuisine": "🍳",
  "Chambre & Salle de bain": "🛁",
  "Sécurité": "🛡️",
  "Extérieur": "🌿",
};

export function AmenitiesSection() {
  const [expanded, setExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const visible = expanded ? AMENITIES : AMENITIES.slice(0, 3);
  const totalItems = AMENITIES.flatMap((c) => c.items).length;

  return (
    <section className="py-10 border-t border-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ce que propose ce logement</h2>
        <p className="text-gray-500 mb-8">{totalItems} équipements inclus</p>

        <div className="space-y-6">
          {visible.map((cat, ci) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.07 }}
            >
              <button
                onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
                className="w-full flex items-center justify-between py-3 border-b border-gray-100 hover:border-gray-300 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{CATEGORY_ICONS[cat.category] || "✨"}</span>
                  <span className="font-semibold text-gray-800 group-hover:text-gray-900">{cat.category}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cat.items.length}</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${activeCategory === cat.category ? "rotate-90" : ""}`} />
              </button>

              <AnimatePresence>
                {(activeCategory === cat.category || !activeCategory) && (
                  <motion.div
                    initial={activeCategory ? { opacity: 0, height: 0 } : false}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 pt-4 pb-2">
                      {cat.items.map((item, ii) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: ii * 0.04 }}
                          className="flex items-center gap-2.5 text-gray-700 text-sm group/item"
                        >
                          <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                          <span className="group-hover/item:text-gray-900 transition-colors">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {!expanded && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setExpanded(true)}
            className="mt-8 flex items-center gap-2 border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 font-semibold px-7 py-3.5 rounded-xl transition-all duration-200"
          >
            Voir tous les {totalItems} équipements
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>
    </section>
  );
}
