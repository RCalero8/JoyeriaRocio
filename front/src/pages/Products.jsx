import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';
import CategoryTabs from '../components/CategoryTabs';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const searchTerm = searchParams.get('search') || '';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getProducts({ category: activeCategory, search: searchTerm })
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeCategory, searchTerm]);

  const handleCategoryChange = (categoryId) => {
    const next = new URLSearchParams(searchParams);
    if (categoryId) {
      next.set('category', categoryId);
    } else {
      next.delete('category');
    }
    setSearchParams(next);
  };

  return (
    <section className="section">
      <div className="section__inner">
        <span className="eyebrow">Colección</span>
        <h1 className="section__title">
          {searchTerm ? `Resultados para "${searchTerm}"` : 'Productos'}
        </h1>

        <CategoryTabs
          categories={categories}
          active={activeCategory}
          onChange={handleCategoryChange}
        />

        {loading && <p className="state-message">Cargando piezas…</p>}
        {error && <p className="state-message state-message--error">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="state-message">No encontramos piezas con esos filtros.</p>
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