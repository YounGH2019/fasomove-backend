// server.js - FasoMove backend JS + Prisma

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3100;

// ---- Middlewares ----
app.use(cors());
app.use(express.json());

// ---- Healthcheck simples ----
app.get("/", (req, res) => {
  res.send("FasoMove backend JS + Prisma running");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

app.get("/whoami", (req, res) => {
  res.send("FasoMove backend JS + Prisma – DB Render OK");
});

// ---- Helpers ----
function computeEstimatedFare(transportMode) {
  if (transportMode === "MOTO") return 500;
  return 2500;
}

// ---- Auth : /api/register & /api/login ----

// POST /api/register { phone, role }
app.post("/api/register", async (req, res) => {
  const { phone, role } = req.body;
  const finalRole = role || "CUSTOMER";

  if (!phone) {
    return res.status(400).json({ success: false, error: "Phone requis" });
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { phone: phone.toString(),
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: "Utilisateur déjà enregistré",
      });
    }

    const user = await prisma.user.create({
      data: {
        phone: phone.toString(),
        role: finalRole,
      },
    });

    return res.json({ success: true, user });
  } catch (err) {
    console.error("[FasoMove API] /api/register error =", err);
    return res
      .status(500)
      .json({ success: false, error: "Erreur serveur lors de register" });
  }
});

// POST /api/login { phone }
app.post("/api/login", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, error: "Phone requis" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { phone: phone.toString() },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur introuvable",
      });
    }

    return res.json({ success: true, user });
  } catch (err) {
    console.error("[FasoMove API] /api/login error =", err);
    return res
      .status(500)
      .json({ success: false, error: "Erreur serveur lors de login" });
  }
});

// ---- Création de course : POST /api/rides ----
app.post('/api/rides', async (req, res) => {
  try {
    console.log('[FasoMove API] POST /api/rides body =', req.body);

    const {
      customerId,
      transportMode,
      requireLicensedDriver,
      pickup,
      dropoff,
    } = req.body;

    if (!customerId || !transportMode || !pickup || !dropoff) {
      return res.status(400).json({
        success: false,
        error:
          'Champs requis manquants (customerId, transportMode, pickup, dropoff)',
      });
    }

    const estimatedFare = computeEstimatedFare(transportMode);

    const ride = await prisma.ride.create({
      data: {
        customerId,
        transportMode,
        status: 'REQUESTED',
        estimatedFare,

        // on mappe les objets pickup/dropoff sur les champs **scalaires** du modèle
        pickupLat: Number(pickup.lat) || 0,
        pickupLng: Number(pickup.lng) || 0,
        pickupAddress: pickup.address || 'Adresse départ',

        dropoffLat: Number(dropoff.lat) || 0,
        dropoffLng: Number(dropoff.lng) || 0,
        dropoffAddress: dropoff.address || 'Adresse arrivée',
      },
    });

    console.log('[FasoMove API] /api/rides created ride =', ride);

    return res.json({ success: true, ride });
  } catch (err) {
    console.error('[FasoMove API] /api/rides INTERNAL ERROR =', err);
    return res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la création de course',
    });
  }
});

// ---- Récupération des courses d’un client ----
app.get("/api/rides/:customerId", async (req, res) => {
  const { customerId } = req.params;

  if (!customerId) {
    return res
      .status(400)
      .json({ success: false, error: "customerId requis" });
  }

  try {
    const rides = await prisma.ride.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, rides });
  } catch (err) {
    console.error("[FasoMove API] GET /api/rides/:customerId error =", err);
    return res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la récupération des courses",
    });
  }
});

// ---- Démarrage du serveur ----
app.listen(PORT, () => {
  console.log(`FasoMove backend JS + Prisma running on port ${PORT}`);
});
