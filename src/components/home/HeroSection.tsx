"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Users, BedDouble, Bath, Waves, ChevronDown, Anchor } from "lucide-react";
import { PROPERTY, PROPERTY_IMAGES } from "@/lib/constants";
import { useRef } from "react";

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const hero = PROPERTY_IMAGES.find((i) => i.hero) || PROPERTY_IMAGES[0];
  const mosaicImages = PROPERTY_IMAGES.filter((i) => !i.hero).slice(0, 4);

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

      {/* Cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/98 via-black/40 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

      {/* Floating photo mosaic — top right */}
      <motion.div
        initial={{ opacity: 0, x: 60, y: -20, rotate: 2 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
        transition={{ delay: 1.0, duration: 0.9, type: "spring", stiffness: 100 }}
        className="absolute top-24 right-6 sm:right-10 z-20 hidden lg:block"
      >
        <div className="relative">
          {/* Mosaic grid */}
          <div className="grid grid-cols-2 gap-1.5 w-72 h-52 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
            {mosaicImages.map((img, i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="144px"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>

          {/* Photo count pill */}
          <Link href="#galerie">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-xl whitespace-nowrap cursor-pointer hover:bg-brand-50 transition-colors"
            >
              📸 Voir les {PROPERTY_IMAGES.length} photos
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pb-20 w-full"
      >
        {/* Location + badge pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center gap-2.5 mb-5"
        >
          <div className="flex items-center gap-2 bg-brand-600/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
            <MapPin className="w-3.5 h-3.5" />
            Syracuse, Sicile, Italie
          </div>
          <div className="flex items-center gap-2 bg-white/12 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full">
            🎖️ Réservation directe — 0% commission
          </div>
          <div className="flex items-center gap-1.5 bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-bold px-4 py-2 rounded-full">
            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
            {PROPERTY.rating} · {PROPERTY.reviewCount} avis
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-5 max-w-5xl"
        >
          Casa
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-300 to-cyan-200">
            Maddalena
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg sm:text-xl text-white/65 font-light mb-7 max-w-xl leading-relaxed"
        >
          Design contemporain · Accès privé à la mer
          <br />
          <span className="text-white/45">Vue panoramique sur Ortygie & l&apos;Etna</span>
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.48 }}
          className="flex flex-wrap items-center gap-3 mb-9"
        >
          {[
            { icon: Users, label: `${PROPERTY.maxGuests} voyageurs` },
            { icon: BedDouble, label: `${PROPERTY.bedrooms} chambres` },
            { icon: Bath, label: `${PROPERTY.bathrooms} salles de bain` },
            { icon: Waves, label: "Accès mer privé" },
            { icon: Anchor, label: "360 m²" },
          ].map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.52 + i * 0.06 }}
              className="flex items-center gap-2 bg-white/8 hover:bg-white/14 backdrop-blur-sm border border-white/12 text-white/80 text-sm px-4 py-2 rounded-xl transition-colors duration-200 cursor-default"
            >
              <Icon className="w-4 h-4 text-sky-300" />
              {label}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.62 }}
          className="flex flex-wrap gap-4 items-center"
        >
          <Link
            href="#reserver"
            className="group relative inline-flex items-center gap-3 bg-brand-600 hover:bg-brand-500 text-white font-bold px-9 py-4 rounded-2xl text-lg transition-all duration-300 hover:shadow-[0_0_60px_rgba(2,132,199,0.7)] hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Réserver maintenant</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="relative z-10 text-xl"
            >
              →
            </motion.span>
          </Link>

          <Link
            href="#galerie"
            className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/18 backdrop-blur-md border border-white/22 text-white font-semibold px-7 py-4 rounded-2xl text-base transition-all duration-300 hover:-translate-y-2"
          >
            <span>📸</span>
            Galerie photos
          </Link>

          {/* Price pill */}
          <div className="hidden sm:flex items-center gap-2 ml-2">
            <div className="w-px h-8 bg-white/20" />
            <div className="text-white">
              <span className="text-2xl font-black font-serif">89€</span>
              <span className="text-white/50 text-sm ml-1">/ nuit</span>
            </div>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex flex-wrap gap-5 mt-7"
        >
          {[
            "🔒 Paiement 100% sécurisé",
            "✓ Confirmation instantanée",
            "↩ Annulation flexible",
            "🏆 Hôte vérifié",
          ].map((text) => (
            <span key={text} className="text-white/35 text-xs tracking-wide">{text}</span>
          ))}
        </motion.div>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
      >
        <span className="text-white/25 text-[10px] tracking-[0.3em] uppercase">Découvrir</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/35 to-transparent" />
        <ChevronDown className="w-4 h-4 text-white/25" />
      </motion.div>
    </section>
  );
}
