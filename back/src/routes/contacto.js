import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// Guardar un nuevo mensaje de contacto
router.post('/', async (req, res) => {
  try {
    const { nombre, email, telefono, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ error: "Nombre, email y mensaje son obligatorios." });
    }

    const { data, error } = await supabase
      .from('mensajes_contacto')
      .insert([{ nombre, email, telefono, mensaje }])
      .select();

    if (error) throw error;

    res.status(201).json({ mensaje: "Mensaje enviado con éxito", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;