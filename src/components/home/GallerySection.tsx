"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid3x3, ZoomIn } from "lucide-react";
import { PROPERTY_IMAGES } from "@/lib/constants";

export function GallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const next = useCallback(() =>
    setLightbox((p) => (p! + 1) % PROPERTY_IMAGES.length), []);
  const prev = useCallback(() =>
    setLightbox((p) => (p! - 1 + PROPERTY_IMAGES.length) % PROPERTY_IMAGES.length), []);

  return (
    <section id="galerie" className="py-10 border-t border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Galerie photos</h2>
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-xl transition-all"
        >
          <Grid3x3 className="w-4 h-4" />
          {showAll ? "Réduire" : `Toutes les photos (${PROPERTY_IMAGES.length})`}
        </button>
      </div>

      {/* Main grid — Airbnb style 5-photo layout */}
      <div className="rounded-2xl overflow-hidden">
        <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-[480px]">
          {/* Hero image — takes 2 cols × 2 rows */}
          <motion.div
            className="col-span-2 row-span-2 relative cursor-pointer group overflow-hidden"
            onClick={() => setLightbox(0)}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={PROPERTY_IMAGES[0].url}
              alt={PROPERTY_IMAGES[0].alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>

          {/* 4 smaller images */}
          {PROPERTY_IMAGES.slice(1, 5).map((img, i) => (
            <motion.div
              key={i}
              className="relative cursor-pointer group overflow-hidden"
              onClick={() => setLightbox(i + 1)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.25 }}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {/* "More photos" overlay on last tile */}
              {i === 3 && PROPERTY_IMAGES.length > 5 && (
                <div
                  className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-white gap-1"
                  onClick={(e) => { e.stopPropagation(); setShowAll(true); setLightbox(4); }}
                >
                  <Grid3x3 className="w-6 h-6" />
                  <span className="font-bold text-lg">+{PROPERTY_IMAGES.length - 4}</span>
                  <span className="text-xs opacity-80">photos</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Extended grid */}
      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-1.5 mt-1.5">
              {PROPERTY_IMAGES.slice(5).map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative h-52 cursor-pointer group overflow-hidden rounded-xl"
                  onClick={() => setLightbox(i + 5)}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/97 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10 bg-gradient-to-b from-black/60 to-transparent">
              <span className="text-white/60 text-sm font-medium">
                {lightbox + 1} / {PROPERTY_IMAGES.length}
              </span>
              <p className="text-white/80 text-sm text-center flex-1 px-4">
                {PROPERTY_IMAGES[lightbox].alt}
              </p>
              <button
                onClick={() => setLightbox(null)}
                className="text-white/70 hover:text-white hover:bg-white/10 p-2.5 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Prev button */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 z-10 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3.5 rounded-full transition-all hover:scale-110"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl h-[80vh] mx-20"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={PROPERTY_IMAGES[lightbox].url}
                alt={PROPERTY_IMAGES[lightbox].alt}
                fill
                className="object-contain"
                quality={95}
              />
            </motion.div>

            {/* Next button */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 z-10 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3.5 rounded-full transition-all hover:scale-110"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* Thumbnail strip */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-md px-4">
              {PROPERTY_IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                  className={`relative w-12 h-9 flex-shrink-0 rounded overflow-hidden transition-all ${
                    i === lightbox ? "ring-2 ring-white scale-105" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
