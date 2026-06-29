"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AMENITIES } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";

export function AmenitiesSection() {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? AMENITIES : AMENITIES.slice(0, 3);

  return (
    <section className="py-8 border-t">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Ce que propose ce logement</h2>
      <div className="space-y-6">
        {visible.map((cat, i) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <h3 className="font-semibold text-gray-700 mb-3">{cat.category}</h3>
            <div className="grid grid-cols-2 gap-2">
              {cat.items.map((item) => (
                <div key={item} className="flex items-center gap-2 text-gray-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-6 border-2 border-gray-900 hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Voir tous les équipements ({AMENITIES.flatMap((c) => c.items).length})
        </button>
      )}
    </section>
  );
}
