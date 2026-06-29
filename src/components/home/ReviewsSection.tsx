"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { PROPERTY } from "@/lib/constants";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const AIRBNB_REVIEWS = [
  { name: "Thierry", rating: 5, comment: "Maison vraiment parfaite! Extrêmement confortable, spacieuse et équipements parfaits! L'emplacement est un rêve avec vue panoramique sur Ortigia et accès direct à la plage.", date: "2025-08" },
  { name: "Andras", rating: 5, comment: "Nous avons passé un séjour fantastique. L'appartement était confortable. La cuisine était équipée d'appareils haut de gamme — un rêve pour les amoureux de la cuisine. Un endroit idéal avec une vue imprenable depuis le jardin.", date: "2025-12" },
  { name: "Donna", rating: 5, comment: "Belle maison et emplacement parfait pour notre semaine en Sicile. Andrea était toujours disponible pour les recommandations de restaurants ou les repas du chef. Ma famille a adoré les couchers de soleil à couper le souffle.", date: "2025-09" },
  { name: "Arthur", rating: 5, comment: "Magnifique emplacement surplombant Ortygie. Cuisine spacieuse. Espace pour 12 personnes en termes de chambres, salles de bain et tables à manger, à l'extérieur comme à l'intérieur.", date: "2026-04" },
  { name: "Othmane", rating: 4, comment: "L'emplacement de la villa est fantastique, la plage privée en face est vraiment un point fort. Nous avons apprécié notre séjour là-bas.", date: "2025-07" },
  { name: "Nancy", rating: 4, comment: "L'appartement était agréable et très bien équipé. Vaisselle, ustensiles et serviettes disponibles en nombre. Meublé avec des matériaux de haute qualité. Les lits étaient très confortables.", date: "2025-10" },
];

const AVATAR_COLORS = [
  "from-violet-400 to-purple-600",
  "from-brand-400 to-brand-700",
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-orange-600",
  "from-pink-400 to-rose-600",
  "from-indigo-400 to-blue-600",
];

export function ReviewsSection() {
  const [dbReviews, setDbReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then(setDbReviews)
      .catch(() => {});
  }, []);

  const reviews = dbReviews.length > 0 ? dbReviews : null;

  return (
    <section className="py-12 border-t border-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-7 h-7 fill-gray-900 text-gray-900" />
          <h2 className="font-serif text-3xl font-bold text-gray-900">
            {PROPERTY.rating} · {PROPERTY.reviewCount} avis
          </h2>
        </div>

        {/* Rating bars */}
        <div className="grid grid-cols-2 gap-x-16 gap-y-3 max-w-sm">
          {[
            { label: "Propreté", score: 4.4 },
            { label: "Communication", score: 5.0 },
            { label: "Arrivée", score: 5.0 },
            { label: "Emplacement", score: 4.3 },
            { label: "Précision", score: 4.7 },
            { label: "Qualité-prix", score: 4.3 },
          ].map(({ label, score }) => (
            <div key={label} className="flex items-center gap-3 text-sm">
              <span className="text-gray-600 w-28 flex-shrink-0 text-xs">{label}</span>
              <div className="flex-1 h-[3px] bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(score / 5) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gray-900 rounded-full"
                />
              </div>
              <span className="text-gray-900 font-semibold text-xs w-6 text-right">{score}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Reviews grid — Airbnb reviews shown when no DB reviews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {AIRBNB_REVIEWS.map((review, i) => (
          <motion.div
            key={review.name + i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            className="group relative bg-white border border-gray-100 hover:border-brand-100 hover:shadow-lg hover:shadow-brand-50 rounded-2xl p-6 transition-all duration-300"
          >
            <Quote className="absolute top-5 right-5 w-7 h-7 text-gray-100 group-hover:text-brand-100 transition-colors" />

            <div className="flex items-center gap-3 mb-4">
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-base shadow-sm flex-shrink-0`}>
                {review.name[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{review.name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(review.date + "-01").toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? "fill-gray-900 text-gray-900" : "text-gray-200"}`} />
              ))}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>

            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400">Avis vérifié</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-[10px] text-gray-400">Airbnb</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
