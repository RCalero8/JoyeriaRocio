// Asegúrate de que el archivo se vea exactamente así:
import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('productos') // <-- VERIFICA ESTO
      .select(`
        id, nombre, slug, descripcion, precio, material, peso_gramos, stock,
        categorias!productos_categoria_id_fkey (id, nombre, slug),
        imagenes_productos (id, url_imagen, posicion)
      `)
      .eq('activo', true)
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabase
      .from('productos') // <-- VERIFICA ESTO TAMBIÉN
      .select(`
        *,
        categorias!productos_categoria_id_fkey (id, nombre, slug),
        imagenes_productos (id, url_imagen, posicion)
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;