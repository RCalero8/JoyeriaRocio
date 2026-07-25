import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import Modal from '../../components/Modal';

const emptyForm = {
  id: null, name: '', sku: '', description: '', image_url: '',
  category_id: '', price: '', stock: '', material: '', weight: '',
  dimensions: '', featured: false, active: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([api.getAllProductsAdmin(), api.getCategories()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setForm(emptyForm);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      sku: form.sku,
      description: form.description,
      image_url: form.image_url,
      category_id: form.category_id,
      price: form.price ? Number(form.price) : null,
      stock: form.stock ? Number(form.stock) : 0,
      material: form.material,
      weight: form.weight,
      dimensions: form.dimensions,
      featured: form.featured,
      active: form.active,
    };
    try {
      if (form.id) {
        await api.updateProduct(form.id, payload);
      } else {
        await api.createProduct(payload);
      }
      closeModal();
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name || '',
      sku: product.sku || '',
      description: product.description || '',
      image_url: product.image_url || '',
      category_id: product.category_id || '',
      price: product.price ?? '',
      stock: product.stock ?? '',
      material: product.material || '',
      weight: product.weight || '',
      dimensions: product.dimensions || '',
      featured: !!product.featured,
      active: product.active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await api.deleteProduct(id);
    load();
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    await api.createCategory(newCategory.trim());
    setNewCategory('');
    load();
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('¿Eliminar esta categoría? Los productos quedarán sin categoría.')) return;
    await api.deleteCategory(id);
    load();
  };

  return (
    <section>
      <header className="admin-header admin-header--row">
        <div>
          <h1>Productos</h1>
          <p>Gestiona el catálogo que ven los clientes.</p>
        </div>
        <button className="btn btn--primary" onClick={openNew}>
          + Nueva pieza
        </button>
      </header>

      {error && <p className="state-message state-message--error">{error}</p>}

      <div>
        <h2 className="admin-section-title admin-section-title--tight">Categorías</h2>
        <form className="form form--inline" onSubmit={handleAddCategory}>
          <input
            placeholder="Nueva categoría"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button type="submit" className="btn btn--small">Añadir</button>
        </form>
        <ul className="tag-list">
          {categories.map((cat) => (
            <li key={cat.id}>
              {cat.name}
              <button
                type="button"
                className="tag-list__remove"
                onClick={() => handleDeleteCategory(cat.id)}
                aria-label={`Eliminar categoría ${cat.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      <h2 className="admin-section-title">Catálogo</h2>
      {loading && <p className="state-message">Cargando…</p>}
      <div className="admin-table">
        {products.map((p) => (
          <div key={p.id} className="admin-table__row">
            <img
              src={p.image_url}
              alt={p.name}
              className="admin-table__thumb"
              onError={(e) => (e.target.style.visibility = 'hidden')}
            />
            <div className="admin-table__info">
              <strong>
                {p.name} {p.featured && <span className="badge badge--gold">Destacada</span>}
              </strong>
              <span>
                {p.sku ? `${p.sku} · ` : ''}
                {p.category?.name || 'Sin categoría'} · Stock: {p.stock ?? 0}
              </span>
            </div>
            <span className={`badge ${p.active ? 'badge--active' : 'badge--inactive'}`}>
              {p.active ? 'Visible' : 'Oculto'}
            </span>
            <div className="admin-table__actions">
              <button className="btn btn--small" onClick={() => handleEdit(p)}>Editar</button>
              <button className="btn btn--small btn--danger" onClick={() => handleDelete(p.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {!loading && products.length === 0 && (
          <p className="state-message">Aún no hay productos. Crea la primera pieza.</p>
        )}
      </div>

      {showModal && (
        <Modal title={form.id ? 'Editar pieza' : 'Nueva pieza'} onClose={closeModal}>
          <form className="form form--modal" onSubmit={handleSubmit}>
            <div className="form__grid">
              <div className="form__row">
                <label htmlFor="name">Nombre</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form__row">
                <label htmlFor="sku">SKU</label>
                <input id="sku" name="sku" value={form.sku} onChange={handleChange} />
              </div>

              <div className="form__row">
                <label htmlFor="category_id">Categoría</label>
                <select
                  id="category_id"
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona…</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form__row">
                <label htmlFor="price">Precio (MXN)</label>
                <input
                  id="price" name="price" type="number" step="0.01"
                  value={form.price} onChange={handleChange}
                />
              </div>

              <div className="form__row">
                <label htmlFor="stock">Stock</label>
                <input id="stock" name="stock" type="number" value={form.stock} onChange={handleChange} />
              </div>
              <div className="form__row">
                <label htmlFor="material">Material</label>
                <input id="material" name="material" value={form.material} onChange={handleChange} />
              </div>

              <div className="form__row">
                <label htmlFor="weight">Peso</label>
                <input id="weight" name="weight" value={form.weight} onChange={handleChange} />
              </div>
              <div className="form__row">
                <label htmlFor="dimensions">Dimensiones / talla</label>
                <input id="dimensions" name="dimensions" value={form.dimensions} onChange={handleChange} />
              </div>

              <div className="form__row form__row--full">
                <label htmlFor="image_url">URL de imagen</label>
                <input id="image_url" name="image_url" value={form.image_url} onChange={handleChange} />
              </div>

              <div className="form__row form__row--full">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description" name="description" rows={3}
                  value={form.description} onChange={handleChange}
                />
              </div>
            </div>

            <label className="checkbox-row checkbox-row--panel">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Marcar como pieza destacada / exclusiva
            </label>

            <label className="checkbox-row">
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
              Visible en la tienda
            </label>

            <div className="modal__actions">
              <button type="button" className="btn btn--ghost" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="btn btn--primary">
                {form.id ? 'Guardar cambios' : 'Crear pieza'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}