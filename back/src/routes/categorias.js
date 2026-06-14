const express = require('express');
const router = express.Router();
const supabase = require('../config/db');

// GET /api/categorias
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('categorias')
      .select('id, nombre, slug, descripcion')
      .order('id');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/categorias/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabase
      .from('categorias')
      .select('id, nombre, slug, descripcion')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;