# Guide de déploiement — Vercel + Neon PostgreSQL

## Prérequis
- Compte Vercel (gratuit)
- Compte Neon (PostgreSQL serverless gratuit)
- Compte Stripe (mode test puis production)
- Compte Gmail ou SMTP pour les emails

---

## ÉTAPE 1 — Base de données PostgreSQL (Neon)

1. Créez un compte sur https://neon.tech (gratuit)
2. Créez un nouveau projet "lpa-booking"
3. Copiez la connection string (format: `postgresql://user:pass@host/dbname?sslmode=require`)

---

## ÉTAPE 2 — Stripe

1. Créez un compte sur https://stripe.com
2. **Mode test d'abord** — récupérez vos clés dans Dashboard > Developers > API Keys:
   - `STRIPE_SECRET_KEY` = `sk_test_...`
   - `STRIPE_PUBLISHABLE_KEY` = `pk_test_...`
3. Webhooks (après déploiement):
   - Dashboard > Developers > Webhooks > Add endpoint
   - URL: `https://votre-domaine.vercel.app/api/webhooks/stripe`
   - Événements à sélectionner:
     - `checkout.session.completed`
     - `checkout.session.expired`
   - Copiez le `STRIPE_WEBHOOK_SECRET` = `whsec_...`

---

## ÉTAPE 3 — Email (Gmail App Password)

1. Activez la validation en 2 étapes sur votre compte Gmail
2. Allez dans Compte Google > Sécurité > Mots de passe d'application
3. Créez un mot de passe pour "Autre (nom personnalisé)" → "LPA Booking"
4. Notez le mot de passe à 16 caractères généré

Variables email:
```
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=votre@gmail.com
EMAIL_SERVER_PASSWORD=abcd efgh ijkl mnop   ← le mot de passe app (sans espaces)
EMAIL_FROM=Votre Logement <votre@gmail.com>
OWNER_EMAIL=proprietaire@example.com
```

---

## ÉTAPE 4 — Déploiement Vercel

### 4a. Préparer le dépôt Git
```bash
cd lpa-booking
git init
git add .
git commit -m "Initial commit"
# Créez un repo GitHub et pushez:
git remote add origin https://github.com/vous/lpa-booking.git
git push -u origin main
```

### 4b. Importer sur Vercel
1. Allez sur https://vercel.com/new
2. Importez votre repo GitHub
3. Framework: **Next.js** (auto-détecté)
4. Build command: `prisma generate && next build`
5. Ajoutez **toutes les variables d'environnement** (voir section ci-dessous)

### 4c. Variables d'environnement Vercel
Ajoutez ces variables dans Settings > Environment Variables:

```
DATABASE_URL          = postgresql://... (depuis Neon)
NEXTAUTH_SECRET       = [générez avec: openssl rand -base64 32]
NEXTAUTH_URL          = https://votre-app.vercel.app
STRIPE_SECRET_KEY     = sk_test_...
STRIPE_PUBLISHABLE_KEY= pk_test_...
STRIPE_WEBHOOK_SECRET = whsec_... (après création du webhook)
EMAIL_SERVER_HOST     = smtp.gmail.com
EMAIL_SERVER_PORT     = 587
EMAIL_SERVER_USER     = votre@gmail.com
EMAIL_SERVER_PASSWORD = votre-app-password
EMAIL_FROM            = Votre Logement <votre@gmail.com>
OWNER_EMAIL           = proprietaire@example.com
NEXT_PUBLIC_APP_URL   = https://votre-app.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
NEXT_PUBLIC_PROPERTY_NAME = L'Appartement Parisien
ADMIN_EMAIL           = admin@votrelogement.fr
ADMIN_PASSWORD        = MotDePasseSecurise123!
```

Options:
```
TELEGRAM_BOT_TOKEN    = (si vous utilisez Telegram)
TELEGRAM_CHAT_ID      = (votre chat ID Telegram)
```

---

## ÉTAPE 5 — Initialiser la base de données

Après le premier déploiement, dans le terminal local:
```bash
# Installez les dépendances
npm install

# Pointez vers la DB de production
export DATABASE_URL="postgresql://... (votre URL Neon)"

# Créez les tables
npx prisma db push

# Insérez les données initiales (admin + config tarifaire + avis exemples)
npx prisma db seed
```

Ou via Vercel CLI:
```bash
npx vercel env pull .env.local
npx prisma db push
npx prisma db seed
```

---

## ÉTAPE 6 — Configurer le webhook Stripe (post-déploiement)

1. Dans Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://votre-app.vercel.app/api/webhooks/stripe`
3. Sélectionnez: `checkout.session.completed` + `checkout.session.expired`
4. Copiez le Signing Secret → ajoutez-le comme `STRIPE_WEBHOOK_SECRET` dans Vercel
5. Redéployez (Settings > Deployments > Redeploy)

---

## ÉTAPE 7 — Accès admin

URL: `https://votre-app.vercel.app/admin`
- Email: valeur de `ADMIN_EMAIL`
- Mot de passe: valeur de `ADMIN_PASSWORD`

---

## ÉTAPE 8 — Domaine personnalisé (optionnel)

Dans Vercel > Settings > Domains:
- Ajoutez `votrelogement.fr`
- Suivez les instructions DNS
- Mettez à jour `NEXTAUTH_URL` et `NEXT_PUBLIC_APP_URL` avec le nouveau domaine
- Mettez à jour l'URL du webhook Stripe

---

## ÉTAPE 9 — Passage en production Stripe

Quand tout fonctionne en mode test:
1. Stripe Dashboard > Passez en mode Live
2. Remplacez `STRIPE_SECRET_KEY` et `STRIPE_PUBLISHABLE_KEY` par les clés Live
3. Recréez le webhook en mode Live avec la nouvelle URL
4. Mettez à jour `STRIPE_WEBHOOK_SECRET` avec le secret Live
5. Redéployez

---

## Test des paiements (mode test Stripe)

Cartes de test:
- ✅ Paiement réussi: `4242 4242 4242 4242` — date future — CVC: `123`
- ❌ Paiement refusé: `4000 0000 0000 0002`
- 🔐 3D Secure: `4000 0025 0000 3155`

---

## iCal — Synchronisation calendrier

URL du flux iCal: `https://votre-app.vercel.app/api/ical`

Utilisable avec:
- **Airbnb**: Calendrier > Disponibilités > Importer un calendrier
- **Booking.com**: Propriété > Calendrier > Importer
- **Google Calendar**: Ajouter un agenda > Via URL
- **Apple Calendar**: Fichier > S'abonner à un calendrier

---

## Structure finale du projet

```
lpa-booking/
├── prisma/
│   ├── schema.prisma          # Modèles DB
│   └── seed.ts                # Données initiales
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx
│   │   ├── providers.tsx
│   │   ├── globals.css
│   │   ├── admin/             # Dashboard admin (protégé)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx       # Dashboard stats
│   │   │   ├── bookings/      # Liste réservations + export CSV
│   │   │   ├── calendar/      # Blocage dates manuel
│   │   │   ├── pricing/       # Config tarifaire
│   │   │   ├── reviews/       # Modération avis
│   │   │   ├── promo/         # Codes promo
│   │   │   ├── settings/      # Infos config
│   │   │   └── login/         # Auth admin
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth
│   │   │   ├── availability/  # Dates disponibles
│   │   │   ├── pricing/       # Calcul prix
│   │   │   ├── checkout/      # Création session Stripe
│   │   │   ├── booking/confirm/ # Confirmation post-paiement
│   │   │   ├── reviews/       # CRUD avis publics
│   │   │   ├── contact/       # Formulaire contact
│   │   │   ├── ical/          # Flux iCal
│   │   │   ├── webhooks/stripe/ # Webhook Stripe
│   │   │   └── admin/         # API admin protégées
│   │   └── reservation/confirmation/ # Page succès paiement
│   ├── components/
│   │   ├── home/              # Sections landing page
│   │   ├── booking/           # Widget réservation
│   │   ├── admin/             # Composants dashboard
│   │   └── layout/            # Navbar + Footer
│   ├── lib/
│   │   ├── prisma.ts          # Client DB
│   │   ├── stripe.ts          # Client Stripe
│   │   ├── auth.ts            # Config NextAuth
│   │   ├── email.ts           # Nodemailer (owner + guest)
│   │   ├── pricing.ts         # Moteur de calcul
│   │   ├── constants.ts       # Données logement
│   │   └── utils.ts           # Helpers
│   └── middleware.ts          # Protection routes admin
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Commandes utiles

```bash
npm run dev          # Dev local (localhost:3000)
npm run build        # Build production
npm run db:studio    # Interface DB visuelle (Prisma Studio)
npm run db:push      # Sync schéma → DB
npm run db:seed      # Insérer données initiales
```
