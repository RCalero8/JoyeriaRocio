const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('admin_token');
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || 'Error en la solicitud');
  }

  return data;
}

export const api = {
  getCategories: () => request('/categories'),
  getProducts: ({ category, search, page, limit } = {}) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (page) params.set('page', page);
    if (limit) params.set('limit', limit);
    const qs = params.toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },
  uploadImage: async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error || 'Error al subir la imagen');
    }

    return res.json();
  },
  sendMessage: (payload) => request(`/messages`, { method: 'POST', body: payload }),

  login: (email, password) =>
    request(`/auth/login`, { method: 'POST', body: { email, password } }),

  // Admin - mensajes
  getMessages: () => request(`/messages`, {auth:true}),
  markMessageRead: (id) => request(`/messages/${id}/read`, { method: 'PATCH', auth: true }),
  deleteMessage: (id) => request(`/messages/${id}`, {method: 'DELETE', auth: true}),
  // Admin - productos
  getAllProductsAdmin: () => request(`/products/admin/all`, { auth: true }),
  createProduct: (payload) =>
    request(`/products`, { method: 'POST', body: payload, auth: true }),
  updateProduct: (id, payload) =>
    request(`/products/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE', auth: true }),

  // Admin - categorias
  createCategory: (name) =>
    request(`/categories`, { method: 'POST', body: { name }, auth: true }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE', auth: true }),

  //Admin - pedidos
  getOrders: () => request('/orders', {auth: true}),
  createManualOrder: (payload) =>
    request(`/orders/manual`, {method: 'POST', body:payload, auth: true}),
  updateOrderStatus: (id, status) => 
    request(`/orders/${id}/status`, {method: 'PATCH', body: {status}, auth: true}),
  deleteOrder: (id) => request('/orders/${id}', {method:'DELETE',auth: true}),
};