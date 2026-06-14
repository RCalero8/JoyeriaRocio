const express = require('express');
const router = express.Router();
const supabase = require('../config/db');

// GET /api/productos?categoria=Sortija&limit=100&offset=0
router.get('/', async (req, res, next) => {
  try {
    const { categoria, limit = 100, offset = 0 } = req.query;

    let query = supabase
      .from('catalogo_publico')
      .select('id, nombre, categoria, url_imagen, posicion')
      .order('posicion', { ascending: true, nullsFirst: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (categoria) query = query.eq('categoria', categoria);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/productos/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({ error: 'El id debe ser un número' });
    }

    const { data, error } = await supabase
      .from('catalogo_publico')
      .select('id, nombre, categoria, url_imagen, posicion')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;