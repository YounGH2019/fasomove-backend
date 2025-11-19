// FasoMove - Backend de Test Minimal
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { v4 as uuid } from "uuid";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ------------------
// BASE DE DONNÉES EN MÉMOIRE
// ------------------
let users = [];
let rides = [];

// ---- INSCRIPTION ----
app.post("/api/register", (req, res) => {
  const { phone, role } = req.body;
  const user = {
    id: uuid(),
    phone,
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  res.json({ success: true, user });
});

// ---- LOGIN ----
app.post("/api/login", (req, res) => {
  const { phone } = req.body;
  const user = users.find((u) => u.phone === phone);
  if (!user) {
    return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
  }
  res.json({ success: true, user });
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

  res.json({ success: true, ride });
});

// ---- LISTE DES COURSES ----
app.get("/api/rides/:customerId", (req, res) => {
  const { customerId } = req.params;
  const rideList = rides.filter((r) => r.customerId === customerId);
  res.json({ success: true, rides: rideList });
});

// ---- START SERVER ----
app.listen(3000, () => {
  console.log("FasoMove backend running on http://localhost:3000");
});
