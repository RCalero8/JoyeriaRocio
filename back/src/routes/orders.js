/* 
 * Ruta de pedidos
 */
const express = require('express');
const supabase = require('../config/supabase');
const { requireAdmin } = require('../middleware/auth');
const { sendWhatsAppMessage } = require('../services/whatsapp');

const router = express.Router();

function buildOrderNotification({ id, customer_name, customer_phone, total }) {
  return (
    `Nuevo pedido recibido (#${id})\n` +
    `Cliente: ${customer_name}\n` +
    `Teléfono: ${customer_phone || 'No indicado'}\n` +
    `Total estimado: ${total ?? 'A confirmar'}`
  );
}

// Publico: crear pedido con items (para cuando se agregue carrito al frontend)
router.post('/', async (req, res) => {
  const { customer_name, customer_phone, customer_email, items, notes } = req.body;

  if (!customer_name || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'customer_name e items son requeridos' });
  }

  const total = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{ customer_name, customer_phone, customer_email, notes, total, status: 'pendiente' }])
    .select()
    .single();

  if (orderError) return res.status(500).json({ error: orderError.message });

  const itemsToInsert = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity || 1,
    price: item.price || 0,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
  if (itemsError) return res.status(500).json({ error: itemsError.message });

  sendWhatsAppMessage(buildOrderNotification({ id: order.id, customer_name, customer_phone, total })).catch(
    (err) => console.error('[orders] Error notificando por WhatsApp:', err)
  );

  res.status(201).json(order);
});

// Admin: listar pedidos con sus items
router.get('/', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(id, name, image_url))')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Admin: crear pedido manualmente (venta por WhatsApp o en tienda física)
router.post('/manual', requireAdmin, async (req, res) => {
  const { customer_name, customer_phone, customer_email, total, notes, status } = req.body;

  if (!customer_name) {
    return res.status(400).json({ error: 'customer_name es requerido' });
  }

  const { data, error } = await supabase
    .from('orders')
    .insert([{ customer_name, customer_phone, customer_email, total: total || 0, notes, status: status || 'pendiente' }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// Admin: actualizar estado del pedido
router.patch('/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Admin: eliminar pedido
router.delete('/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase.from('orders').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;


