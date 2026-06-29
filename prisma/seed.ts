import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12);
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@lappartement.fr" },
    update: {},
    create: {
      name: "Admin",
      email: process.env.ADMIN_EMAIL || "admin@lappartement.fr",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Pricing config
  await prisma.pricingConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      basePrice: 89,
      cleaningFee: 35,
      taxRate: 0.1,
      weeklyDiscount: 0.1,
      monthlyDiscount: 0.2,
      minNights: 1,
      maxGuests: 6,
    },
  });

  // Sample approved reviews
  const reviews = [
    { name: "Sophie L.", rating: 5, comment: "Appartement magnifique, très bien situé. Le logement est exactement comme sur les photos, voire encore mieux ! Nous avons passé un séjour inoubliable.", approved: true },
    { name: "Marc D.", rating: 5, comment: "Hôte très réactif et accueillant. L'appartement est propre, moderne et bien équipé. Vue superbe depuis le balcon. Je recommande vivement !", approved: true },
    { name: "Camille R.", rating: 4, comment: "Très bon séjour dans cet appartement spacieux. L'emplacement est idéal, proche de tout. Quelques petits détails à améliorer mais globalement excellent.", approved: true },
    { name: "Thomas B.", rating: 5, comment: "Le meilleur Airbnb dans lequel j'ai séjourné ! Tout est parfait : la déco, la literie, la cuisine équipée. On reviendra sans hésiter.", approved: true },
    { name: "Julie M.", rating: 5, comment: "Séjour parfait ! L'appartement est exactement comme décrit. Très propre, bien équipé et dans un quartier vivant. Communication fluide avec le propriétaire.", approved: true },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }

  console.log("✅ Seed completed");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
