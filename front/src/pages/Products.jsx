import { useEffect, useState } from 'react';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';
import CategoryTabs from '../components/CategoryTabs';

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getProducts(activeCategory)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <section className="section">
      <div className="section__inner">
        <span className="eyebrow">Colección</span>
        <h1 className="section__title">Productos</h1>

        <CategoryTabs
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {loading && <p className="state-message">Cargando piezas…</p>}
        {error && <p className="state-message state-message--error">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="state-message">Aún no hay productos en esta categoría.</p>
        )}

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}