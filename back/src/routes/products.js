/* 
 * Clase Productos
 */
const express = require('express');
const supabase = require('../config/supabase');
   const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Publico: listar productos activos, con filtro opcional por categoria
// GET /api/products?category=uuid-de-categoria
router.get('/', async (req, res) => {
  let query = supabase
    .from('products')
    .select('*, category:categories(id, name)')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (req.query.category) {
    query = query.eq('category_id', req.query.category);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Listar TODOS los productos (activos e inactivos) - lo usaremos en el admin
router.get('/admin/all', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id, name)')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Un solo producto
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id, name)')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(data);
});

// Crear producto
router.post('/', requireAdmin, async (req, res) => {
  const {
    name, sku, description, image_url, category_id,
    price, stock, material, weight, dimensions, featured,active,
  } = req.body;
  if (!name || !category_id){
    return res.status(400).json({ error: 'name y category_id son requeridos' });
  }
   const { data, error } = await supabase
    .from('products')
    .insert([{
      name, sku: sku || null, description, image_url, category_id,
      price, stock: stock ?? 0, material, weight, dimensions,
      featured: featured ?? false, active: active ?? true,
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
})

// Actualizar producto
router.put('/:id', requireAdmin, async (req, res) => {
  const {
    name, sku, description, image_url, category_id,
    price, stock, material, weight, dimensions, featured, active,
  } = req.body;

  const { data, error } = await supabase
    .from('products')
    .update({
      name, sku: sku || null, description, image_url, category_id,
      price, stock, material, weight, dimensions, featured, active,
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
// Eliminar producto
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('products').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;

