import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import rideRoutes from './routes/rideRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Petit endpoint de santé utilisé par le frontend
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'FasoMove backend is running' });
});

// Auth (register / login)
app.use('/api/auth', authRoutes);

// Rides (créer une course, lister les courses d’un client)
app.use('/api/rides', rideRoutes);

// Middleware global d’erreurs (toujours en dernier)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`FasoMove backend listening on port ${PORT}`);
});
