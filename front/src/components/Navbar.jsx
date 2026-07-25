import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="brand">
          <span className="brand__mark">✦</span>
          <span className="brand__name">Taller Joyeria Zulema</span>
        </NavLink>
        <nav className="site-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Inicio
          </NavLink>
          <NavLink to="/productos" className={({ isActive }) => (isActive ? 'active' : '')}>
            Productos
          </NavLink>
          <NavLink to="/contacto" className={({ isActive }) => (isActive ? 'active' : '')}>
            Contacto
          </NavLink>
        </nav>
      </div>
    </header>
  );
}