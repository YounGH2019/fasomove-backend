import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import rideRoutes from './routes/rideRoutes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Simple root route (debug)
app.get('/', (req: Request, res: Response) => {
  res.send('FasoMove backend is running 🚀');
});

// Healthcheck pour tests (PC + téléphone)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'fasomove-backend',
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);

// Gestion d’erreurs simple (au cas où)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`FasoMove backend listening on port ${PORT}`);
});

export default app;
