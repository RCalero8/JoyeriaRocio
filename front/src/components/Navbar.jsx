import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/productos?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="site-header">
      <div className="site-header__topbar">
        <div className="site-header__topbar-inner">
          <span>Atención al cliente L-V 10:00h a 18:00h</span>
          <a href="https://wa.me/34637817016" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </div>

      <div className="site-header__inner">
        <NavLink to="/" className="brand">
          <span className="brand__mark"><img src="/logo.png" alt="logo" /></span>
          <span className="brand__name">Taller Joyeria Zulema</span>
        </NavLink>

        <form className="site-search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Buscar piezas…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" aria-label="Buscar">⌕</button>
        </form>

        <nav className="site-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Inicio
          </NavLink>
          <NavLink to="/contacto" className={({ isActive }) => (isActive ? 'active' : '')}>
            Contacto
          </NavLink>
        </nav>
      </div>

      {categories.length > 0 && (
        <div className="category-strip">
          <div className="category-strip__inner">
            {categories.map((cat) => (
              <NavLink key={cat.id} to={`/productos?category=${cat.id}`}>
                {cat.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}