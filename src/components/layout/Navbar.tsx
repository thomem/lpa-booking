"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PROPERTY } from "@/lib/constants";
import { Star, Menu, X, Waves } from "lucide-react";

const NAV_LINKS = [
  { label: "Photos", href: "#galerie" },
  { label: "Équipements", href: "#equipements" },
  { label: "Avis", href: "#avis" },
  { label: "Localisation", href: "#localisation" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled
            ? "bg-white/96 backdrop-blur-xl shadow-[0_1px_24px_rgba(0,0,0,0.08)] border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                scrolled ? "bg-brand-600 text-white shadow-md shadow-brand-200" : "bg-white/15 backdrop-blur-sm text-white border border-white/25"
              }`}>
                <Waves className="w-5 h-5" />
              </div>
              <span className={`font-serif font-bold text-lg transition-colors duration-300 hidden sm:block ${
                scrolled ? "text-gray-900" : "text-white"
              }`}>
                {PROPERTY.shortName}
              </span>
            </Link>

            {/* Center nav */}
            <div className={`hidden lg:flex items-center gap-0.5 transition-all duration-300 ${scrolled ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="px-3.5 py-2 text-sm text-gray-600 hover:text-brand-700 hover:bg-brand-50 rounded-xl font-medium transition-all duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className={`hidden sm:flex items-center gap-1.5 transition-all duration-300 ${scrolled ? "opacity-100" : "opacity-0"}`}>
                <Star className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
                <span className="font-semibold text-sm text-gray-900">{PROPERTY.rating}</span>
                <span className="text-gray-400 text-xs">· {PROPERTY.reviewCount} avis</span>
              </div>

              <Link
                href="#reserver"
                className={`font-bold px-5 py-2.5 rounded-full text-sm transition-all duration-300 hover:-translate-y-0.5 ${
                  scrolled
                    ? "bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-200 hover:shadow-lg hover:shadow-brand-200"
                    : "bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white"
                }`}
              >
                Réserver
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 rounded-xl transition-all ${scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
            >
              <div className="px-5 py-4 space-y-1">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-4 py-3 text-gray-700 hover:text-brand-700 hover:bg-brand-50 rounded-xl font-medium text-sm transition-all"
                  >
                    {label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-gray-100 mt-2">
                  <Link
                    href="#reserver"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 bg-brand-600 text-white font-bold px-4 py-3.5 rounded-2xl text-sm hover:bg-brand-700 transition-colors"
                  >
                    Réserver maintenant →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
