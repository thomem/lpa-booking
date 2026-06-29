"use client";

import { useEffect, useState } from "react";
import { Check, X, Trash2, Star } from "lucide-react";
import toast from "react-hot-toast";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = () => {
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((d) => { setReviews(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(fetch_, []);

  const toggle = async (id: string, approved: boolean) => {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved }),
    });
    toast.success(approved ? "Avis approuvé" : "Avis masqué");
    fetch_();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cet avis ?")) return;
    await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
    toast.success("Avis supprimé");
    fetch_();
  };

  if (loading) return <div className="text-white">Chargement...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Avis clients</h1>
      <div className="space-y-3">
        {reviews.length === 0 && (
          <p className="text-gray-400">Aucun avis pour l&apos;instant.</p>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-white">{r.name}</p>
                <div className="flex">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${r.approved ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-gray-400"}`}>
                  {r.approved ? "Publié" : "En attente"}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{r.comment}</p>
              <p className="text-gray-500 text-xs mt-1">
                {new Date(r.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div className="flex gap-2 items-start">
              <button
                onClick={() => toggle(r.id, !r.approved)}
                className={`p-2 rounded-xl transition-colors ${r.approved ? "bg-gray-800 hover:bg-gray-700 text-gray-400" : "bg-green-900/30 hover:bg-green-900/50 text-green-400"}`}
                title={r.approved ? "Masquer" : "Approuver"}
              >
                {r.approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              </button>
              <button
                onClick={() => remove(r.id)}
                className="p-2 rounded-xl bg-red-900/20 hover:bg-red-900/40 text-red-400 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
