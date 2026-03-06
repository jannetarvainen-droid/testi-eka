import express from 'express';
import cors from 'cors';
import storeRoutes from './routes/storeRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api', storeRoutes);

app.listen(PORT, () => {
  console.log(`Työmaaseuranta API käynnissä: http://localhost:${PORT}`);
});
