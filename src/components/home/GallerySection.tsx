"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid } from "lucide-react";
import { PROPERTY_IMAGES } from "@/lib/constants";

export function GallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const next = () => setLightbox((p) => (p! + 1) % PROPERTY_IMAGES.length);
  const prev = () => setLightbox((p) => (p! - 1 + PROPERTY_IMAGES.length) % PROPERTY_IMAGES.length);

  return (
    <section id="galerie" className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Galerie photos</h2>

      {/* Grid gallery */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-96">
        <div
          className="col-span-2 row-span-2 cursor-pointer relative group"
          onClick={() => setLightbox(0)}
        >
          <Image
            src={PROPERTY_IMAGES[0].url}
            alt={PROPERTY_IMAGES[0].alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        {PROPERTY_IMAGES.slice(1, 5).map((img, i) => (
          <div
            key={i}
            className="cursor-pointer relative group overflow-hidden"
            onClick={() => setLightbox(i + 1)}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {i === 3 && PROPERTY_IMAGES.length > 5 && (
              <div
                className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setLightbox(4); }}
              >
                <Grid className="w-5 h-5 mr-2" />
                +{PROPERTY_IMAGES.length - 5} photos
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 text-white p-3 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <div
              className="relative w-full max-w-5xl h-[80vh] mx-16"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={PROPERTY_IMAGES[lightbox].url}
                alt={PROPERTY_IMAGES[lightbox].alt}
                fill
                className="object-contain"
              />
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 text-white p-3 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-4 text-white/60 text-sm">
              {lightbox + 1} / {PROPERTY_IMAGES.length} — {PROPERTY_IMAGES[lightbox].alt}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
