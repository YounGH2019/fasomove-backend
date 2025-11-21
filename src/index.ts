import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import rideRoutes from './routes/rideRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();

// --------- Middlewares de base ----------
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
}));
app.use(express.json());

// --------- Healthcheck / ping ----------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'fasomove-backend',
    env: process.env.NODE_ENV || 'development',
  });
});

// --------- Routes métiers ----------
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);

// --------- Gestion d’erreurs globale ----------
app.use(errorHandler);

// --------- Démarrage du serveur ----------
const PORT = Number(process.env.PORT) || 3100;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`✅ FasoMove backend démarré sur http://${HOST}:${PORT}`);
});

export default app;
