"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Phone, Mail, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        toast.success("Message envoyé !");
      } else {
        toast.error("Erreur lors de l'envoi.");
      }
    } catch {
      toast.error("Erreur réseau.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-12 border-t border-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="w-6 h-6 text-brand-600" />
          <h2 className="text-2xl font-bold text-gray-900">Contacter le propriétaire</h2>
        </div>
        <p className="text-gray-400 text-sm mb-8">Réponse habituelle en moins de 2 heures</p>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center"
          >
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <p className="font-semibold text-green-800 text-lg">Message envoyé !</p>
            <p className="text-green-600 text-sm mt-1">Le propriétaire vous répondra dans les plus brefs délais.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nom</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                placeholder="Posez vos questions sur le logement, les disponibilités, l'accès..."
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 hover:-translate-y-0.5 hover:shadow-lg"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Envoyer le message
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
