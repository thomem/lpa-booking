"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ImageIcon } from "lucide-react";
import { PROPERTY_IMAGES } from "@/lib/constants";

export function GallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const next = useCallback(() =>
    setLightbox((p) => (p! + 1) % PROPERTY_IMAGES.length), []);
  const prev = useCallback(() =>
    setLightbox((p) => (p! - 1 + PROPERTY_IMAGES.length) % PROPERTY_IMAGES.length), []);

  return (
    <section id="galerie" className="py-12 border-t border-gray-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Galerie photos</h2>
          <p className="text-gray-400 text-sm mt-0.5">{PROPERTY_IMAGES.length} photos de la propriété</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-brand-700 bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-200 px-5 py-2.5 rounded-xl transition-all duration-200"
        >
          <ImageIcon className="w-4 h-4" />
          {showAll ? "Réduire" : `Toutes les photos`}
        </motion.button>
      </motion.div>

      {/* Magazine-style grid */}
      <div className="rounded-3xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-4 grid-rows-2 gap-1 h-[520px]">
          {/* Hero image — 2 cols × 2 rows */}
          <motion.div
            className="col-span-2 row-span-2 relative cursor-pointer group overflow-hidden"
            onClick={() => setLightbox(0)}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={PROPERTY_IMAGES[0].url}
              alt={PROPERTY_IMAGES[0].alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-2 text-white text-sm font-medium bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <ZoomIn className="w-4 h-4" />
                Vue panoramique
              </div>
            </div>
          </motion.div>

          {/* 4 smaller images */}
          {PROPERTY_IMAGES.slice(1, 5).map((img, i) => (
            <motion.div
              key={i}
              className="relative cursor-pointer group overflow-hidden"
              onClick={() => setLightbox(i + 1)}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.07, duration: 0.4 }}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
              </div>
              {/* "More" overlay on last tile */}
              {i === 3 && PROPERTY_IMAGES.length > 5 && (
                <motion.div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-2 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setShowAll(true); setLightbox(4); }}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                >
                  <div className="w-12 h-12 rounded-full bg-white/15 border border-white/30 flex items-center justify-center mb-1">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <span className="font-black text-2xl">+{PROPERTY_IMAGES.length - 5}</span>
                  <span className="text-xs text-white/70 font-medium tracking-widest uppercase">photos</span>
                </motion.div>
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
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-1 rounded-2xl overflow-hidden">
              {PROPERTY_IMAGES.slice(5).map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="relative h-56 cursor-pointer group overflow-hidden"
                  onClick={() => setLightbox(i + 5)}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-108"
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/97 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5 z-10 bg-gradient-to-b from-black/70 to-transparent">
              <span className="text-white/50 text-sm font-medium tabular-nums">
                {lightbox + 1} <span className="text-white/25">/</span> {PROPERTY_IMAGES.length}
              </span>
              <p className="text-white/70 text-sm text-center flex-1 px-4 line-clamp-1">
                {PROPERTY_IMAGES[lightbox].alt}
              </p>
              <button
                onClick={() => setLightbox(null)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2.5 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 z-10 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-full transition-all hover:scale-110 border border-white/10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-6xl h-[82vh] mx-20"
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

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 z-10 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-full transition-all hover:scale-110 border border-white/10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Thumbnail strip */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 overflow-x-auto max-w-lg px-4 pb-1">
              {PROPERTY_IMAGES.map((img, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                  className={`relative w-14 h-10 flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                    i === lightbox
                      ? "ring-2 ring-white ring-offset-1 ring-offset-black scale-105 opacity-100"
                      : "opacity-35 hover:opacity-65"
                  }`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" sizes="56px" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
