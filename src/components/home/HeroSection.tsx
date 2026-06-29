"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Users, Moon } from "lucide-react";
import { PROPERTY, PROPERTY_IMAGES } from "@/lib/constants";

export function HeroSection() {
  const hero = PROPERTY_IMAGES.find((i) => i.hero) || PROPERTY_IMAGES[0];

  return (
    <section className="relative h-screen min-h-[600px] flex items-end pb-20">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={hero.url}
          alt={hero.alt}
          fill
          className="object-cover"
          priority
          quality={95}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              ✨ Superhost
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
              Réservation directe — sans commission
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
            {PROPERTY.name}
          </h1>

          {/* Rating + location */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-1.5 text-white">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{PROPERTY.rating}</span>
              <span className="text-white/70">({PROPERTY.reviewCount} avis)</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/80">
              <MapPin className="w-4 h-4" />
              <span>{PROPERTY.location}</span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { icon: Users, label: `${PROPERTY.maxGuests} voyageurs` },
              { icon: Moon, label: `${PROPERTY.bedrooms} chambres` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                <Icon className="w-4 h-4" />
                {label}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="#reserver"
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-2xl hover:-translate-y-1 inline-flex items-center gap-2"
            >
              Réserver maintenant
              <span className="text-xl">→</span>
            </Link>
            <Link
              href="#galerie"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all border border-white/30"
            >
              Voir les photos
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
