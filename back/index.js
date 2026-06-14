require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middlewares/errorHandler');
const categoriasRouter = require('./src/routes/categorias');
const productosRouter  = require('./src/routes/productos');

const app = express();

// ── CORS ──────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://joyeria-zulema.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS no permitido para: ${origin}`));
  },
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// ── Rutas ─────────────────────────────────────────────
app.use('/api/categorias', categoriasRouter);
app.use('/api/productos',  productosRouter);

// ── Health check ──────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// ── 404 ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` });
});

// ── Error handler ─────────────────────────────────────
app.use(errorHandler);

// ── Arrancar ──────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✓ Servidor en http://localhost:${PORT}`);
});

module.exports = app;