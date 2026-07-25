/* 
 * Clase Mensaje
 */
const express = require('express');
const supabase = require('../config/supabase');
const { requireAdmin } = require('../middleware/auth');
const { sendWhatsAppMessage, buildContactNotification } = require('../services/whatsapp');

const router = express.Router();

// Publico: enviar mensaje desde el formulario de contacto
router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: 'name y message son requeridos' });
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([{ name, email, phone, message }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Notificar al admin por WhatsApp (no bloquea la respuesta si falla)
  sendWhatsAppMessage(buildContactNotification({ name, email, phone, message })).catch((err) =>
    console.error('[messages] Error notificando por WhatsApp:', err)
  );

  res.status(201).json(data);
});

// Admin: listar mensajes
router.get('/', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Admin: marcar como leido
router.patch('/:id/read', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Admin: eliminar mensaje
router.delete('/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase.from('messages').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;

