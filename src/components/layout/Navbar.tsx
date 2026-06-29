"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PROPERTY } from "@/lib/constants";
import { Star, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Photos", href: "#galerie" },
  { label: "Équipements", href: "#equipements" },
  { label: "Avis", href: "#avis" },
  { label: "Localisation", href: "#localisation" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className={`font-bold text-lg transition-colors flex items-center gap-2 ${
                scrolled ? "text-gray-900" : "text-white"
              }`}
            >
              <span className="text-xl">🏠</span>
              <span className="hidden sm:block">{PROPERTY.shortName}</span>
            </Link>

            {/* Center nav links — only when scrolled */}
            <div className={`hidden md:flex items-center gap-1 transition-all duration-300 ${scrolled ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition-all"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Rating chip — visible when scrolled */}
              <div className={`hidden sm:flex items-center gap-1.5 transition-all duration-300 ${scrolled ? "opacity-100" : "opacity-0"}`}>
                <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                <span className="font-semibold text-sm text-gray-900">{PROPERTY.rating}</span>
                <span className="text-gray-400 text-sm">({PROPERTY.reviewCount})</span>
              </div>

              {/* CTA */}
              <Link
                href="#reserver"
                className={`font-bold px-5 py-2.5 rounded-full text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                  scrolled
                    ? "bg-brand-600 hover:bg-brand-700 text-white"
                    : "bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white"
                }`}
              >
                Réserver
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden p-2 rounded-xl transition-colors ${scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-sm transition-all"
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100">
              <Link
                href="#reserver"
                onClick={() => setMobileOpen(false)}
                className="block text-center bg-brand-600 text-white font-bold px-4 py-3 rounded-xl"
              >
                Réserver maintenant
              </Link>
            </div>
          </motion.div>
        )}
      </motion.nav>
    </>
  );
}
