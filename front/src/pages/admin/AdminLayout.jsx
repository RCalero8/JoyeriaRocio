import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="brand brand--admin">
          <span className="brand__mark">✦</span>
          <span className="brand__name">Taller Joyeria Zulema</span>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/mensajes" className={({ isActive }) => (isActive ? 'active' : '')}>
            Mensajes
          </NavLink>
          <NavLink to="/admin/productos" className={({ isActive }) => (isActive ? 'active' : '')}>
            Productos
          </NavLink>
          <NavLink to="/admin/pedidos" className={({ isActive }) => (isActive ? 'active' : '')}>
            Pedidos
          </NavLink>
        </nav>
        <button type="button" className="btn btn--ghost admin-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
} 