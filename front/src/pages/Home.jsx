import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero__text">
          <span className="eyebrow">Joyería fina · Hecha a mano</span>
          <h1>
            Piezas que se <em>heredan</em>,
            <br /> no que se descartan.
          </h1>
          <p className="hero__lede">
            Cada anillo, collar y pulsera nace de metales nobles y piedras
            elegidas una por una. Nada sale del taller hasta que merece
            quedarse para siempre.
          </p>
          <div className="hero__actions">
            <Link to="/productos" className="btn btn--primary">
              Ver colección
            </Link>
            <Link to="/contacto" className="btn btn--ghost">
              Hablar con nosotros
            </Link>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__frame">
            <span className="corner corner--tl" />
            <span className="corner corner--tr" />
            <span className="corner corner--bl" />
            <span className="corner corner--br" />
            <div className="hero__glow" />
          </div>
        </div>
      </section>

      <section className="section section--divider">
        <div className="section__inner three-cols">
          <div>
            <span className="eyebrow">Materiales</span>
            <p>Oro de 18k, plata de ley y piedras naturales certificadas.</p>
          </div>
          <div>
            <span className="eyebrow">Proceso</span>
            <p>Diseño y engaste artesanal, pieza por pieza, en taller propio.</p>
          </div>
          <div>
            <span className="eyebrow">Garantía</span>
            <p>Cada joya incluye certificado de autenticidad y ajuste gratuito.</p>
          </div>
        </div>
      </section>

      <section className="section section--cta">
        <div className="section__inner">
          <h2>¿Buscas una pieza en particular?</h2>
          <p>Cuéntanos qué imaginas y te ayudamos a encontrarla o crearla.</p>
          <Link to="/contacto" className="btn btn--primary">
            Escríbenos
          </Link>
        </div>
      </section>
    </>
  );
}