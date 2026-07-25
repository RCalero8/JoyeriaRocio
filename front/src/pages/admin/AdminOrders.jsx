import { useEffect, useState } from 'react';
import { api } from '../../api/client';

const STATUSES = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];
const emptyForm = { customer_name: '', customer_phone: '', customer_email: '', total: '', notes: '' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .getOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createManualOrder({ ...form, total: form.total ? Number(form.total) : 0 });
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    await api.updateOrderStatus(id, status);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este pedido?')) return;
    await api.deleteOrder(id);
    load();
  };

  return (
    <section>
      <header className="admin-header">
        <h1>Pedidos</h1>
        <p>Pedidos recibidos por la tienda o registrados manualmente.</p>
      </header>

      {error && <p className="state-message state-message--error">{error}</p>}

      <button className="btn btn--small" onClick={() => setShowForm((v) => !v)}>
        {showForm ? 'Cancelar' : '+ Registrar pedido manual'}
      </button>

      {showForm && (
        <form className="form admin-form" onSubmit={handleCreate}>
          <div className="form__row form__row--split">
            <div>
              <label>Cliente</label>
              <input name="customer_name" value={form.customer_name} onChange={handleChange} required />
            </div>
            <div>
              <label>Teléfono</label>
              <input name="customer_phone" value={form.customer_phone} onChange={handleChange} />
            </div>
          </div>
          <div className="form__row form__row--split">
            <div>
              <label>Email</label>
              <input name="customer_email" value={form.customer_email} onChange={handleChange} />
            </div>
            <div>
              <label>Total</label>
              <input name="total" type="number" step="0.01" value={form.total} onChange={handleChange} />
            </div>
          </div>
          <div className="form__row">
            <label>Notas</label>
            <textarea name="notes" rows={2} value={form.notes} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn--primary">Guardar pedido</button>
        </form>
      )}

      {loading && <p className="state-message">Cargando…</p>}

      <div className="admin-list">
        {orders.map((order) => (
          <article key={order.id} className="admin-card">
            <div className="admin-card__header">
              <strong>{order.customer_name}</strong>
              <span className="admin-card__date">
                {new Date(order.created_at).toLocaleString()}
              </span>
            </div>
            <p className="admin-card__meta">
              {order.customer_phone || 'Sin teléfono'} · {order.customer_email || 'Sin email'}
            </p>
            {order.items?.length > 0 && (
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity} × {item.product?.name || 'Producto eliminado'} — {item.price}
                  </li>
                ))}
              </ul>
            )}
            {order.notes && <p className="admin-card__notes">{order.notes}</p>}
            <div className="admin-card__footer">
              <strong>Total: {order.total}</strong>
              <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button className="btn btn--small btn--danger" onClick={() => handleDelete(order.id)}>
                Eliminar
              </button>
            </div>
          </article>
        ))}
        {!loading && orders.length === 0 && (
          <p className="state-message">No hay pedidos todavía.</p>
        )}
      </div>
    </section>
  );
}