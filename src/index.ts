import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// TRACE pour vérifier qu'on est dans le bon fichier
console.log('=== FasoMove backend index.ts chargé ===');

// Health check simple
app.get('/', (req, res) => {
  res.send('FasoMove backend is running ✅ (route /)');
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Health OK depuis index.ts',
    time: new Date().toISOString(),
  });
});

// (on rajoutera authRoutes et rideRoutes après, là on isole juste le problème)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`FasoMove backend listening on port ${PORT}`);
});

export default app;
