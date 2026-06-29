import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Force la racine de tracing sur CE dossier (évite que Next remonte vers
  // C:\Users\gusta à cause d'un package-lock.json parasite, ce qui injectait
  // des chemins Windows cassés dans le handler serveur déployé sur Linux).
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "a0.muscache.com" },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "casa-maddalena.netlify.app"],
    },
  },
};

export default nextConfig;
