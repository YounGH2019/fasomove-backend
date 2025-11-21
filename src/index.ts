import express from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

// ------------------
// TYPES
// ------------------
interface User {
  id: string;
  phone: string;
  role: string;
  createdAt: string;
}

interface Ride {
  id: string;
  customerId: string;
  transportMode: string;
  requireLicensedDriver: boolean;
  pickup: any;
  dropoff: any;
  status: string;
  estimatedFare: number;
  currency: string;
  createdAt: string;
}

// ------------------
// BASE EN MÉMOIRE (pour tests)
// ------------------
let users: User[] = [];
let rides: Ride[] = [];

// ---- INSCRIPTION ----
app.post("/api/register", (req, res) => {
  const { phone, role } = req.body as { phone?: string; role?: string };

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

  const user: User = {
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
  const { phone } = req.body as { phone?: string };

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
  } = req.body as {
    customerId: string;
    transportMode: string;
    requireLicensedDriver: boolean;
    pickup: any;
    dropoff: any;
  };

  const ride: Ride = {
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

// ---- ROUTE DE DEBUG ----
app.get("/whoami", (req, res) => {
  res.send("FasoMove backend – version TypeScript avec /api/register");
});

// ---- START SERVER ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FasoMove backend running on http://localhost:${PORT}`);
});
