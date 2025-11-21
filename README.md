🚀 FasoMove Backend – Node.js / TypeScript / Prisma / PostgreSQL

Mobilité. Livraison. Transport scolaire. Une seule plateforme.

🧭 Sommaire

📘 Présentation

📁 Structure du projet

⚙️ Installation

🗄️ Base de données & Prisma

🌐 API Endpoints

☁️ Déploiement Render

🧬 Roadmap

👤 Auteur

📘 Présentation

FasoMove est une plateforme backend pour :

🚕 Courses (taxis, motos)

🚚 Livraison & logistique

🏫 Transport scolaire

🚗 Location de véhicules

🤝 Covoiturage (version future)

Construit avec :
Node.js + TypeScript + Express + Prisma ORM + PostgreSQL
Déployé sur Render.com.

📁 Structure du projet
<details> <summary><strong>📂 Voir l’arborescence complète</strong></summary>
fasomove-backend/
├── package.json
├── tsconfig.json
├── .env.example
├── prisma/
│   └── schema.prisma
├── src/
│   ├── index.ts
│   ├── utils/
│   │   └── prisma.ts
│   ├── middleware/
│   │   └── errorHandler.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── rideController.ts
│   ├── services/
│   │   └── rideService.ts
│   └── routes/
│       ├── authRoutes.ts
│       └── rideRoutes.ts
└── README.md

</details>
⚙️ Installation
<details> <summary><strong>🔧 Procédure complète</strong></summary>
1. Clonez le projet
git clone https://github.com/YounGH2019/fasomove-backend.git
cd fasomove-backend

2. Installez les dépendances
npm install

3. Configurez l’environnement

Créez un .env basé sur .env.example :

DATABASE_URL="postgresql://user:password@localhost:5432/fasomove_db"
PORT=3000
NODE_ENV=development

4. Initialisez Prisma
npx prisma migrate dev --name init
npx prisma generate

5. Démarrez
npm run dev


👉 Test :
http://localhost:3000/api/status

</details>
🗄️ Base de données & Prisma
<details> <summary><strong>🧱 Modèle Prisma</strong></summary>
model User {
  id        String   @id @default(uuid())
  phone     String   @unique
  createdAt DateTime @default(now())
  rides     Ride[]
}

model Ride {
  id             String   @id @default(uuid())
  customerId     String
  customer       User     @relation(fields: [customerId], references: [id])
  transportMode  String
  status         String   @default("SEARCHING")
  estimatedFare  Float

  pickupLat      Float
  pickupLng      Float
  pickupAddress  String

  dropoffLat     Float
  dropoffLng     Float
  dropoffAddress String

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

</details>
🌐 API Endpoints
<details> <summary><strong>🧾 Liste complète des endpoints</strong></summary>
🔹 GET /api/status

Vérifie que le backend fonctionne.

🔹 POST /api/register

Créer un utilisateur

{ "phone": "+22670000000" }

🔹 POST /api/login

Connexion utilisateur

{ "phone": "+22670000000" }

🔹 POST /api/rides

Créer une course

{
  "customerId": "uuid",
  "transportMode": "CAR",
  "pickup": { "lat": 12.36, "lng": -1.52, "address": "Centre-ville" },
  "dropoff": { "lat": 12.40, "lng": -1.50, "address": "Zone du Bois" }
}

🔹 GET /api/rides/:customerId

Récupérer les courses d’un client.

</details>
☁️ Déploiement Render
<details> <summary><strong>☁️ Commandes Render</strong></summary>
Build
npm install && npm run build

Start
npm start

Migration production
npx prisma migrate deploy
npx prisma generate

URL de production
https://fasomove-backend.onrender.com/api/status

</details>
🧬 Roadmap
<details> <summary><strong>📅 Voir les prochaines versions</strong></summary>
✅ V1 (actuel)

Authentification simple

Courses (taxis, motos)

Historique des courses

🟧 V2

Tricycles / Transport de marchandises

Location de véhicules

Gestion des conducteurs avec permis

🟩 V3

Covoiturage intelligent

Attribution en temps réel (matching)

Live map + tracking GPS

🟦 V4

Transport scolaire complet

Gestion des élèves et trajets

Notifications parentales

</details>
👤 Auteur

Développé par Youn Sanfo (YounGH2019)
🌍 Burkina Faso / France
📱 Mobilité intelligente & IA appliquée
