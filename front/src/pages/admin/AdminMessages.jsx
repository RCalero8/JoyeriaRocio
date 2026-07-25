import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .getMessages()
      .then(setMessages)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleRead = async (id) => {
    await api.markMessageRead(id);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este mensaje?')) return;
    await api.deleteMessage(id);
    load();
  };

  return (
    <section>
      <header className="admin-header">
        <h1>Mensajes de contacto</h1>
        <p>Los mensajes nuevos también llegan por WhatsApp.</p>
      </header>

      {loading && <p className="state-message">Cargando…</p>}
      {error && <p className="state-message state-message--error">{error}</p>}

      <div className="admin-list">
        {messages.map((msg) => (
          <article key={msg.id} className={`admin-card ${msg.read ? '' : 'admin-card--unread'}`}>
            <div className="admin-card__header">
              <strong>{msg.name}</strong>
              <span className="admin-card__date">
                {new Date(msg.created_at).toLocaleString()}
              </span>
            </div>
            <p className="admin-card__meta">
              {msg.email || 'Sin email'} · {msg.phone || 'Sin teléfono'}
            </p>
            <p>{msg.message}</p>
            <div className="admin-card__actions">
              {!msg.read && (
                <button className="btn btn--small" onClick={() => handleRead(msg.id)}>
                  Marcar leído
                </button>
              )}
              <button className="btn btn--small btn--danger" onClick={() => handleDelete(msg.id)}>
                Eliminar
              </button>
            </div>
          </article>
        ))}
        {!loading && messages.length === 0 && (
          <p className="state-message">No hay mensajes todavía.</p>
        )}
      </div>
    </section>
  );
}