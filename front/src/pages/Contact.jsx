import { useState } from 'react';
import { api } from '../api/client';

const initialForm = { name: '', email: '', phone: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    try {
      await api.sendMessage(form);
      setStatus('sent');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  return (
    <section className="section">
      <div className="section__inner section__inner--narrow">
        <span className="eyebrow">Contacto</span>
        <h1 className="section__title">Hablemos de tu próxima pieza</h1>
        <p className="hero__lede">
          Escríbenos y te responderemos lo antes posible. Tu mensaje llega
          directo al equipo de la joyería.
        </p>

        {status === 'sent' ? (
          <div className="alert alert--success">
            Gracias, tu mensaje fue enviado. Te contactaremos pronto.
          </div>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <div className="form__row">
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="form__row form__row--split">
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="phone">Teléfono</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form__row">
              <label htmlFor="message">Mensaje</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
              />
            </div>

            {status === 'error' && (
              <div className="alert alert--error">
                No se pudo enviar el mensaje: {error}
              </div>
            )}

            <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}