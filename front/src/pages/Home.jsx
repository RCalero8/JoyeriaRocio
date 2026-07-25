import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api
      .getProducts({})
      .then((products) => setRecent(products.slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="hero-shop">
        <div className="hero-shop__main">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80"
            alt="Joyería Orfeva"
          />
          <div className="hero-shop__caption">
            <span className="eyebrow">Joyería fina · Hecha a mano</span>
            <h1>Deja que tus joyas hablen por ti</h1>
            <Link to="/productos" className="btn btn--primary">Ver colección</Link>
          </div>
        </div>

        <div className="hero-shop__side">
          <div className="promo-box">
            <strong>Materiales nobles</strong>
            <span>Oro 18k, plata de ley y piedras naturales certificadas.</span>
          </div>
          <div className="promo-box promo-box--gold">
            <strong>Hecho a mano</strong>
            <span>Diseño y engaste artesanal, pieza por pieza.</span>
          </div>
          <div className="promo-box">
            <strong>Garantía incluida</strong>
            <span>Certificado de autenticidad y ajuste gratuito.</span>
          </div>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="section">
          <div className="section__inner">
            <span className="eyebrow">Novedades</span>
            <h2 className="section__title">Recién llegados</h2>
            <div className="product-grid">
              {recent.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="section__cta-link">
              <Link to="/productos" className="btn btn--ghost">Ver todo el catálogo</Link>
            </div>
          </div>
        </section>
      )}

      <section className="section section--cta">
        <div className="section__inner">
          <h2>¿Buscas una pieza en particular?</h2>
          <p>Cuéntanos qué imaginas y te ayudamos a encontrarla o crearla.</p>
          <Link to="/contacto" className="btn btn--primary">Escríbenos</Link>
        </div>
      </section>
    </>
  );
}