"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Star } from "lucide-react";
import { PROPERTY } from "@/lib/constants";

export function MobileStickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] px-4 py-3 safe-area-pb"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-black text-xl text-gray-900">89 €</span>
                <span className="text-gray-400 text-sm">/ nuit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                <span className="text-xs font-semibold text-gray-700">{PROPERTY.rating}</span>
                <span className="text-xs text-gray-400">· {PROPERTY.reviewCount} avis</span>
              </div>
            </div>
            <Link
              href="#reserver"
              className="flex-shrink-0 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-lg"
            >
              Réserver maintenant
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
