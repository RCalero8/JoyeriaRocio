import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const activeCategory = searchParams.get('category');
  const searchTerm = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentPage = Number(searchParams.get('page') || '1');
  const limit = 12;

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getProducts({ category: activeCategory, search: searchTerm, page: currentPage, limit })
      .then((result) => {
        setProducts(result.data || []);
        setTotalProducts(result.total || 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeCategory, searchTerm, currentPage]);

  const activeCategoryName = categories.find((category) => category.id === activeCategory)?.name;
  const title = searchTerm
    ? `Resultados para "${searchTerm}"${activeCategoryName ? ` en ${activeCategoryName}` : ''}`
    : `Productos${activeCategoryName ? ` en ${activeCategoryName}` : ''}`;

  const totalPages = Math.max(1, Math.ceil(totalProducts / limit));
  const setPage = (page) => {
    const next = new URLSearchParams(searchParams);
    if (page <= 1) {
      next.delete('page');
    } else {
      next.set('page', String(page));
    }
    setSearchParams(next);
  };

  const pageNumbers = (() => {
    const pages = [];
    const maxButtons = 5;
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }
    return pages;
  })();

  const openProduct = (product) => setSelectedProduct(product);
  const closeProduct = () => setSelectedProduct(null);

  return (
    <section className="section">
      <div className="section__inner">
        <span className="eyebrow">Colección</span>
        <h1 className="section__title">{title}</h1>

        {loading && <p className="state-message">Cargando piezas…</p>}
        {error && <p className="state-message state-message--error">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="state-message">No encontramos piezas con esos filtros.</p>
        )}

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onClick={() => openProduct(product)} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button type="button" disabled={currentPage <= 1} onClick={() => setPage(1)}>
              Primera
            </button>
            <button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
              Anterior
            </button>
            <div className="pagination__pages">
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  type="button"
                  className={page === currentPage ? 'active' : ''}
                  onClick={() => setPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>
              Siguiente
            </button>
            <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage(totalPages)}>
              Última
            </button>
          </div>
        )}
      </div>

      {selectedProduct && (
        <Modal title={selectedProduct.name} onClose={closeProduct}>
          <div className="product-modal">
            {selectedProduct.image_url ? (
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                className="product-modal__image"
              />
            ) : (
              <div className="product-modal__placeholder">Sin imagen</div>
            )}
            <div className="product-modal__content">
              {selectedProduct.category || selectedProduct.category_name ? (
                <p className="product-modal__category">
                  {selectedProduct.category || selectedProduct.category_name}
                </p>
              ) : null}
              <p className="product-modal__description">{selectedProduct.description}</p>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}