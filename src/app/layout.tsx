import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Casa Maddalena — Réservation directe | Syracuse, Sicile",
  description:
    "Appartement de luxe 360m² avec accès privé à la mer, vue panoramique sur Ortygie et l'Etna. 6 chambres, 12 voyageurs. Réservez directement sans commission.",
  openGraph: {
    title: "Casa Maddalena — Vue sur Ortygie & Mer Ionienne",
    description: "360m² de luxe à Syracuse, Sicile. Accès privé à la mer, grande terrasse panoramique, 6 chambres.",
    images: ["https://images.unsplash.com/photo-1499678329028-101435549a4e?w=1200"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${playfair.variable} ${dmSans.variable} font-sans bg-white text-gray-900 antialiased`}>
        <Providers>
          <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
