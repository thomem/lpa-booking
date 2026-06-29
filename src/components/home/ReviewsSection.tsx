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

const RATING_LABELS = ["", "Décevant", "Passable", "Bien", "Très bien", "Exceptionnel"];

const AVATAR_COLORS = [
  "from-violet-400 to-purple-600",
  "from-blue-400 to-cyan-600",
  "from-green-400 to-emerald-600",
  "from-orange-400 to-amber-600",
  "from-pink-400 to-rose-600",
  "from-indigo-400 to-blue-600",
];

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => {});
  }, []);

  return (
    <section className="py-10 border-t border-gray-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-7 h-7 fill-gray-900 text-gray-900" />
          <h2 className="text-2xl font-bold text-gray-900">
            {PROPERTY.rating} · {PROPERTY.reviewCount} avis
          </h2>
        </div>

        {/* Rating breakdown bars */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 max-w-md mb-2">
          {[
            { label: "Propreté", score: 4.9 },
            { label: "Communication", score: 5.0 },
            { label: "Emplacement", score: 4.8 },
            { label: "Arrivée", score: 4.9 },
          ].map(({ label, score }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 w-28 flex-shrink-0">{label}</span>
              <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(score / 5) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gray-900 rounded-full"
                />
              </div>
              <span className="text-gray-900 font-medium w-6 text-right">{score}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Reviews grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group relative bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md rounded-2xl p-6 transition-all duration-300"
          >
            {/* Quote icon */}
            <Quote className="absolute top-4 right-4 w-6 h-6 text-gray-100 group-hover:text-gray-200 transition-colors" />

            {/* Reviewer */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-base shadow-sm`}>
                {review.name[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{review.name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? "fill-gray-900 text-gray-900" : "text-gray-200"}`} />
              ))}
              <span className="text-xs text-gray-500 ml-1 font-medium">{RATING_LABELS[review.rating]}</span>
            </div>

            {/* Comment */}
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{review.comment}</p>
          </motion.div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Star className="w-8 h-8 mx-auto mb-2 text-gray-200" />
          <p>Les premiers avis arrivent bientôt…</p>
        </div>
      )}
    </section>
  );
}
