"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Users, BedDouble, Bath, Waves, ChevronDown } from "lucide-react";
import { PROPERTY, PROPERTY_IMAGES } from "@/lib/constants";
import { useRef } from "react";

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const hero = PROPERTY_IMAGES.find((i) => i.hero) || PROPERTY_IMAGES[0];

  return (
    <section ref={ref} className="relative h-screen min-h-[750px] flex flex-col justify-end overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src={hero.url}
          alt={hero.alt}
          fill
          className="object-cover"
          priority
          quality={100}
        />
      </motion.div>

      {/* Layered gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent" />

      {/* Floating price badge */}
      <motion.div
        initial={{ opacity: 0, x: 50, rotate: 3 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ delay: 1.2, duration: 0.7, type: "spring" }}
        className="absolute top-28 right-6 sm:right-10 z-20"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/25 rounded-3xl px-6 py-5 text-white text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">À partir de</p>
          <p className="text-4xl font-black font-serif">89€</p>
          <p className="text-xs text-white/50 mt-0.5">/ nuit · réservation directe</p>
          <div className="mt-3 flex items-center gap-1.5 justify-center bg-white/10 rounded-full px-3 py-1.5">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold">{PROPERTY.rating}</span>
            <span className="text-white/50 text-xs">({PROPERTY.reviewCount})</span>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pb-20 w-full"
      >
        {/* Location pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2 mb-5"
        >
          <div className="flex items-center gap-2 bg-brand-600/80 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-full">
            <MapPin className="w-3.5 h-3.5" />
            Syracuse, Sicile, Italie
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full">
            🎖️ Réservation directe — 0% commission
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.0] tracking-tight mb-5 max-w-4xl"
        >
          Casa
          <br />
          <span className="text-brand-300">Maddalena</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-lg sm:text-xl text-white/70 font-light mb-8 max-w-lg leading-relaxed"
        >
          Design contemporain · Accès privé à la mer · Vue panoramique sur Ortygie & l&apos;Etna
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center gap-4 mb-10"
        >
          {[
            { icon: Users, label: `${PROPERTY.maxGuests} voyageurs` },
            { icon: BedDouble, label: `${PROPERTY.bedrooms} chambres` },
            { icon: Bath, label: `${PROPERTY.bathrooms} salles de bain` },
            { icon: Waves, label: "Accès mer privé" },
          ].map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.07 }}
              className="flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/15 text-white/80 text-sm px-4 py-2 rounded-xl"
            >
              <Icon className="w-4 h-4 text-brand-300" />
              {label}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-wrap gap-4"
        >
          <Link
            href="#reserver"
            className="group relative inline-flex items-center gap-3 bg-brand-600 hover:bg-brand-500 text-white font-bold px-9 py-4.5 rounded-2xl text-lg transition-all duration-300 hover:shadow-[0_0_50px_rgba(2,132,199,0.6)] hover:-translate-y-1.5 overflow-hidden"
          >
            <span className="relative z-10">Réserver maintenant</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="relative z-10 text-xl"
            >
              →
            </motion.span>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <Link
            href="#galerie"
            className="inline-flex items-center gap-3 bg-white/12 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-semibold px-8 py-4 rounded-2xl text-base transition-all duration-300 hover:-translate-y-1.5"
          >
            <span>📸</span>
            Voir les photos
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex flex-wrap gap-6 mt-8"
        >
          {[
            "🔒 Paiement 100% sécurisé",
            "✓ Confirmation instantanée",
            "↩ Annulation flexible",
          ].map((text) => (
            <span key={text} className="text-white/40 text-xs">{text}</span>
          ))}
        </motion.div>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
      >
        <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase">Découvrir</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        <ChevronDown className="w-4 h-4 text-white/30" />
      </motion.div>
    </section>
  );
}
