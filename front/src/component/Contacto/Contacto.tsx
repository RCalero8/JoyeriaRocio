import React, { useMemo, useState } from "react";
import "./Contacto.css";

const Contacto: React.FC = () => {
  const categories = useMemo(() => {
    const allCategories = [
      { value: "consulta", label: "Consulta general" },
      { value: "pedido", label: "Pedido" },
      { value: "reparacion", label: "Reparación" },
      { value: "colaboracion", label: "Colaboración" },
      { value: "diseño", label: "Diseño personalizado" },
      { value: "revision", label: "Revisión" },
      { value: "reclamo", label: "Reclamo" },
      { value: "otros", label: "Otro" },
    ];
    for (let i = allCategories.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCategories[i], allCategories[j]] = [allCategories[j], allCategories[i]];
    }
    return allCategories.slice(0, 5);
  }, []);

  const [sent, setSent] = useState(false);
  const [category, setCategory] = useState(categories[0]?.value ?? "consulta");

  return (
    <section className="contacto">
      <div className="section__header">
        <span className="section__eyebrow">Encargos y consultas</span>
        <h2 className="section__title">Hablamos</h2>
        <p className="section__sub">¿Tienes algo en mente? Cuéntanos y lo hacemos realidad.</p>
      </div>
      <div className="contacto__layout">
        <div className="contacto__info">
          {[
            { label: "Taller",    value: "Joyeria Zulema" },
            { label: "Teléfono", value: "+34 637 81 70 16" },
            { label: "Horario",  value: "Lun–Vie, 10:00–20:00" },
            { label: "Horario Fines de Semana",  value: "Sabado, 10:00–14:00" },
          ].map(({ label, value }) => (
            <div key={label} className="contacto__dato">
              <span className="contacto__label">{label}</span>
              <span className="contacto__value">{value}</span>
            </div>
          ))}
        </div>

        <div className="contacto__form-wrap">
          {sent ? (
            <div className="contacto__thanks">
              <p>Mensaje enviado. Nos ponemos en contacto contigo pronto.</p>
            </div>
          ) : (
            <div className="contacto__form">
              <div className="form__row">
                <div className="form__field">
                  <label className="form__label">Nombre</label>
                  <input className="form__input" type="text" placeholder="Tu nombre" />
                </div>
                <div className="form__field">
                  <label className="form__label">Teléfono</label>
                  <input className="form__input" type="tel" placeholder="+34 600 000 000" />
                </div>
              </div>
              <div className="form__field">
                <label className="form__label">Categoría</label>
                <select
                  className="form__input"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form__field">
                <label className="form__label">Mensaje</label>
                <textarea className="form__input form__textarea" placeholder="Cuéntanos qué tienes en mente…" />
              </div>
              <button className="btn btn--primary" onClick={() => setSent(true)}>
                Enviar mensaje
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contacto;