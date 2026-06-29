import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "L'Appartement Parisien — Réservation directe",
  description:
    "Réservez directement ce magnifique appartement parisien. Vue imprenable, entièrement rénové, idéalement situé.",
  openGraph: {
    title: "L'Appartement Parisien — Vue Imprenable",
    description: "Réservez directement sans commission. Appartement de charme au cœur de Paris.",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <Providers>
          <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
