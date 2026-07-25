import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminMessages from './pages/admin/AdminMessages';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/productos" element={<PublicLayout><Products /></PublicLayout>} />
        <Route path="/contacto" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/admin/login" element={<PublicLayout><AdminLogin /></PublicLayout>} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="mensajes" replace />} />
          <Route path="mensajes" element={<AdminMessages />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="pedidos" element={<AdminOrders />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}