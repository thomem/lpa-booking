"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Users, Moon, Shield, ChevronDown } from "lucide-react";
import { PROPERTY, PROPERTY_IMAGES } from "@/lib/constants";
import { useRef } from "react";

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const hero = PROPERTY_IMAGES.find((i) => i.hero) || PROPERTY_IMAGES[0];

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] flex flex-col justify-end overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <Image
          src={hero.url}
          alt={hero.alt}
          fill
          className="object-cover"
          priority
          quality={95}
        />
      </motion.div>

      {/* Multi-layer gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      {/* Floating badge top-right */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute top-28 right-6 sm:right-10 z-20"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 text-white text-center shadow-2xl">
          <p className="text-3xl font-black">89€</p>
          <p className="text-xs text-white/70 mt-0.5">/ nuit</p>
          <div className="mt-2 flex items-center gap-1 justify-center">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{PROPERTY.rating}</span>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pb-16 w-full"
      >
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-5"
        >
          {[
            { icon: "🏆", text: "Superhost" },
            { icon: "✨", text: "Appartement entier" },
            { icon: "🎖️", text: "Réservation directe — 0% commission" },
          ].map((b) => (
            <span key={b.text} className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              {b.icon} {b.text}
            </span>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-4 max-w-3xl"
        >
          {PROPERTY.name}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-xl sm:text-2xl text-white/75 font-light mb-6 max-w-xl"
        >
          {PROPERTY.tagline}
        </motion.p>

        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap items-center gap-5 mb-8"
        >
          <div className="flex items-center gap-1.5 text-white">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-lg">{PROPERTY.rating}</span>
            <span className="text-white/60 text-sm">({PROPERTY.reviewCount} avis)</span>
          </div>
          <div className="w-px h-4 bg-white/30" />
          <div className="flex items-center gap-1.5 text-white/70 text-sm">
            <MapPin className="w-4 h-4" />
            {PROPERTY.location}
          </div>
          <div className="w-px h-4 bg-white/30" />
          <div className="flex items-center gap-1.5 text-white/70 text-sm">
            <Users className="w-4 h-4" />
            {PROPERTY.maxGuests} voyageurs max
          </div>
          <div className="w-px h-4 bg-white/30" />
          <div className="flex items-center gap-1.5 text-white/70 text-sm">
            <Moon className="w-4 h-4" />
            {PROPERTY.bedrooms} chambres · {PROPERTY.beds} lits
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-wrap gap-3"
        >
          <Link
            href="#reserver"
            className="group relative inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(225,29,72,0.5)] hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10">Réserver maintenant</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="relative z-10 text-xl"
            >→</motion.span>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            href="#galerie"
            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 hover:-translate-y-1"
          >
            📸 Voir les photos
          </Link>
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-4 mt-6"
        >
          {[
            { icon: Shield, text: "Paiement 100% sécurisé" },
            { icon: Star, text: "Annulation flexible" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-white/50 text-xs">
              <Icon className="w-3.5 h-3.5" />
              {text}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/40 flex flex-col items-center gap-1"
      >
        <span className="text-xs tracking-widest uppercase">Découvrir</span>
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
}
