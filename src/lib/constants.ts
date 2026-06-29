export const PROPERTY = {
  name: "Casa Maddalena — Vue Panoramique sur Ortygie & Mer Ionienne",
  shortName: "Casa Maddalena",
  tagline: "Design contemporain, accès privé à la mer, vue imprenable sur Ortygie",
  description: `Bienvenue à Casa Maddalena, un appartement d'un étage de 360 m² magnifiquement rénové, conçu pour vous plonger dans la beauté de la Sicile. Avec une vue imprenable sur la mer, Ortygie et l'Etna en arrière-plan, cette propriété d'exception offre le mélange parfait de confort, de style et de panorama.

Six chambres spacieuses, cinq salles de bains élégantes carrelées de pierres de l'Etna, une grande terrasse, un jardin privé avec cuisine extérieure et barbecue Komodo, et un accès exclusif à la mer — tout est réuni pour un séjour inoubliable.

Depuis la terrasse, admirez les voiliers, yachts et la vie sicilienne animée, avec vue jusqu'au rocher de Gallera, relique de l'Antiquité grecque. À 15 minutes en voiture d'Ortygie, proche des plus belles plages et des sites historiques de Syracuse, Modica, Raguse et Noto.`,
  location: "Syracuse, Sicile, Italie",
  coordinates: { lat: 37.0755, lng: 15.2866 },
  maxGuests: 12,
  bedrooms: 6,
  beds: 7,
  bathrooms: 5,
  rating: 4.7,
  reviewCount: 10,
  checkInTime: "15:00",
  checkOutTime: "11:00",
};

export const HIGHLIGHTS = [
  { icon: "🌊", title: "Accès privé à la mer", desc: "Plongez directement depuis la propriété dans les eaux cristallines" },
  { icon: "🏛️", title: "Vue sur Ortygie", desc: "Panorama sur la baie de Syracuse, l'Etna et l'île d'Ortygie" },
  { icon: "🌅", title: "Grande terrasse", desc: "Table pour 12 personnes, canapés et chaises longues face à la mer" },
  { icon: "🍕", title: "Cuisine de chef", desc: "Cuisine extérieure avec BBQ Komodo + cuisine intérieure haut de gamme" },
  { icon: "🚗", title: "Parking privé", desc: "Stationnement gratuit et sécurisé dans la propriété" },
  { icon: "🏄", title: "Paddle & Canoë", desc: "SUP et canoë disponibles avec la location" },
];

export const AMENITIES = [
  { category: "Essentiels", items: ["WiFi haut débit", "TV écran plat", "Machine à laver", "Climatisation", "Chauffage", "Espace de travail dédié"] },
  { category: "Cuisine", items: ["Grand four", "Cuisinière numérique", "Deux réfrigérateurs (dont américain)", "Centrifugeuse à agrumes", "Machine à expresso", "Cafetière filtre", "BBQ Komodo", "Ustensiles de cuisine"] },
  { category: "Chambre & Salle de bain", items: ["6 chambres (4 avec vue mer)", "Baignoire (1 salle de bain)", "Douches à l'italienne", "Carreaux artisanaux de l'Etna", "3 salles de bain avec vue baie", "Draps & serviettes fournis"] },
  { category: "Extérieur", items: ["Accès privé à la mer", "Grande terrasse panoramique", "Jardin privé", "Table extérieure 12 personnes", "Cuisine extérieure", "Paddle SUP & Canoë", "Parking privé sécurisé", "Portail fermé"] },
  { category: "Emplacement", items: ["15 min d'Ortygie en voiture", "Plage isolée adjacente", "Bus vers Syracuse & Plemmirio", "Proche théâtre grec & Oreille de Dionysos", "35-45 min de Modica, Raguse, Noto"] },
];

export const RULES = [
  "Check-in à partir de 15h00",
  "Check-out avant 11h00",
  "Non-fumeur",
  "Animaux de compagnie non acceptés",
  "Pas de fêtes ou événements",
  "Maximum 12 voyageurs",
  "Portail sécurisé — code remis à l'arrivée",
];

// Casa Maddalena — Syracuse, Sicile
export const PROPERTY_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=1600&q=90",
    alt: "Vue panoramique sur la mer Ionienne et Ortygie",
    hero: true,
  },
  {
    url: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200&q=85",
    alt: "Grande terrasse avec table pour 12 personnes face à la mer",
  },
  {
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85",
    alt: "Chambre avec vue mer",
  },
  {
    url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=85",
    alt: "Accès privé à la mer",
  },
  {
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=85",
    alt: "Salon contemporain style années 70",
  },
  {
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85",
    alt: "Cuisine intérieure haut de gamme",
  },
  {
    url: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&q=85",
    alt: "Terrasse extérieure avec vue sur la baie",
  },
  {
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=85",
    alt: "Salle de bain avec carreaux artisanaux de l'Etna",
  },
  {
    url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=85",
    alt: "Jardin privé et espace extérieur",
  },
];
