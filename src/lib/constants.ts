export const PROPERTY = {
  name: "L'Appartement Parisien — Vue Imprenable",
  shortName: "L'Appartement Parisien",
  tagline: "Votre havre de paix au cœur de la ville",
  description: `Bienvenue dans cet appartement d'exception, entièrement rénové et décoré avec soin pour vous offrir une expérience inoubliable. Situé dans un quartier prisé, à deux pas des meilleurs restaurants, musées et transports, ce logement lumineux saura ravir les amoureux du beau comme les voyageurs d'affaires.

Avec ses grandes fenêtres qui laissent entrer la lumière naturelle, son salon moderne, sa cuisine entièrement équipée et ses chambres douillettes, vous aurez tout le confort d'un chez-soi, avec le charme en plus.

Que ce soit pour un week-end romantique, des vacances en famille ou un déplacement professionnel, cet appartement est l'endroit idéal pour se ressourcer et profiter de tout ce que la ville a à offrir.`,
  location: "Paris, Île-de-France, France",
  coordinates: { lat: 48.8566, lng: 2.3522 },
  maxGuests: 6,
  bedrooms: 2,
  beds: 3,
  bathrooms: 1,
  rating: 4.96,
  reviewCount: 127,
  checkInTime: "15:00",
  checkOutTime: "11:00",
};

export const HIGHLIGHTS = [
  { icon: "🏆", title: "Superhost", desc: "Propriétaire expérimenté et très bien noté" },
  { icon: "✨", title: "Appartement entier", desc: "Profitez de tout l'espace pour vous" },
  { icon: "📍", title: "Quartier idéal", desc: "Au cœur de la ville, proche de tout" },
  { icon: "🔑", title: "Arrivée autonome", desc: "Check-in flexible avec boîte à clés" },
  { icon: "🍳", title: "Cuisine équipée", desc: "Tout le nécessaire pour cuisiner" },
  { icon: "💻", title: "WiFi haut débit", desc: "Idéal pour le télétravail" },
];

export const AMENITIES = [
  { category: "Essentiels", items: ["WiFi haut débit", "TV écran plat", "Cuisine équipée", "Machine à laver", "Sèche-linge", "Climatisation", "Chauffage"] },
  { category: "Cuisine", items: ["Réfrigérateur", "Micro-ondes", "Lave-vaisselle", "Cafetière", "Théière", "Grille-pain", "Ustensiles de cuisine"] },
  { category: "Chambre & Salle de bain", items: ["Draps fournis", "Serviettes fournies", "Sèche-cheveux", "Produits de toilette"] },
  { category: "Sécurité", items: ["Détecteur de fumée", "Détecteur de monoxyde", "Extincteur", "Boîte de premiers secours", "Serrure connectée"] },
  { category: "Extérieur", items: ["Balcon", "Vue panoramique", "Parking à proximité"] },
];

export const RULES = [
  "Check-in à partir de 15h00",
  "Check-out avant 11h00",
  "Non-fumeur",
  "Animaux de compagnie non acceptés",
  "Pas de fêtes ou événements",
  "Maximum 6 voyageurs",
];

// Curated images representing a premium Parisian apartment
export const PROPERTY_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=90",
    alt: "Salon lumineux avec vue sur la ville",
    hero: true,
  },
  {
    url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85",
    alt: "Chambre principale élégante",
  },
  {
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85",
    alt: "Cuisine moderne entièrement équipée",
  },
  {
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=85",
    alt: "Salle de bain design",
  },
  {
    url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=85",
    alt: "Balcon avec vue panoramique",
  },
  {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85",
    alt: "Espace repas cosy",
  },
  {
    url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=85",
    alt: "Canapé confortable",
  },
  {
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=85",
    alt: "Chambre secondaire",
  },
  {
    url: "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=1200&q=85",
    alt: "Vue nocturne de la ville",
  },
];
