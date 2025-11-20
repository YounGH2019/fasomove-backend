import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint de test pour le frontend FasoMove
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'FasoMove backend is running'
  });
});

// Page d'accueil simple
app.get('/', (req, res) => {
  res.send('FasoMove backend running');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

