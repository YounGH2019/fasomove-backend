// FasoMove - Backend JS minimal pour Render

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { v4 as uuid } from "uuid";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ------------------
// BASE DE DONNÉES EN MÉMOIRE (pour tests)
// ------------------
let users = [];
let rides = [];

// ---- ROUTE DE DEBUG ----
app.get("/whoami", (req, res) => {
  res.send("FasoMove backend JS – version Render avec /api/register");
});

// ---- INSCRIPTION ----
app.post("/api/register", (req, res) => {
  const { phone, role } = req.body;

  if (!phone) {
    return res
      .status(400)
      .json({ success: false, error: "Numéro de téléphone requis" });
  }

  const existing = users.find((u) => u.phone === phone);
  if (existing) {
    return res.status(409).json({
      success: false,
      error: "Cet utilisateur existe déjà",
    });
  }

  const user = {
    id: uuid(),
    phone,
    role: role || "CUSTOMER",
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  return res.json({ success: true, user });
});

// ---- LOGIN ----
app.post("/api/login", (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res
      .status(400)
      .json({ success: false, error: "Numéro de téléphone requis" });
  }

  const user = users.find((u) => u.phone === phone);
  if (!user) {
    return res
      .status(404)
      .json({ success: false, error: "Utilisateur introuvable" });
  }

  return res.json({ success: true, user });
});

// ---- CRÉER UNE COURSE ----
app.post("/api/rides", (req, res) => {
  const {
    customerId,
    transportMode,
    requireLicensedDriver,
    pickup,
    dropoff,
  } = req.body;

  const ride = {
    id: uuid(),
    customerId,
    transportMode,
    requireLicensedDriver,
    pickup,
    dropoff,
    status: "REQUESTED",
    estimatedFare: transportMode === "MOTO" ? 500 : 1500,
    currency: "XOF",
    createdAt: new Date().toISOString(),
  };

  rides.push(ride);
  return res.json({ success: true, ride });
});

// ---- LISTE DES COURSES ----
app.get("/api/rides/:customerId", (req, res) => {
  const { customerId } = req.params;
  const rideList = rides.filter((r) => r.customerId === customerId);
  return res.json({ success: true, rides: rideList });
});

// ---- START SERVER ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FasoMove backend JS running on port ${PORT}`);
});
