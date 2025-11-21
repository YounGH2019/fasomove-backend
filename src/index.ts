import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import rideRoutes from './routes/rideRoutes';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();

// 🔌 Port backend (local) : 3100 par défaut
const PORT = process.env.PORT || 3100;

app.use(cors());
app.use(express.json());

// ✅ Route racine simple
app.get('/', (req, res) => {
  res.send('FasoMove backend is running ✅');
});

// ✅ Route de santé appelée par le frontend (bouton "Tester le serveur")
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'fasomove-backend',
    time: new Date().toISOString(),
  });
});

// 🔐 Routes métier
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);

// 🧯 Middleware global d’erreurs
app.use(errorHandler);

// 🚀 Démarrage du serveur (écoute sur toutes les interfaces)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`FasoMove backend listening on port ${PORT}`);
});

export default app;
