import { createContext, useContext, useState, useMemo } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));

  const login = async (email, password) => {
    const { token } = await api.login(email, password);
    localStorage.setItem('admin_token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  const value = useMemo(
    () => ({ token, isAuthenticated: !!token, login, logout }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}