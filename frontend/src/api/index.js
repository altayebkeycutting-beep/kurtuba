import axios from 'axios';

const normalizeBaseUrl = (value) => {
  const trimmed = value?.trim();
  if (!trimmed) return '/api';
  return trimmed.replace(/\/+$/, '');
};

const API_BASE = normalizeBaseUrl(import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ks_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ks_token');
      localStorage.removeItem('ks_user');
      if (window.location.pathname.startsWith('/admin') &&
          window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Blog API ─────────────────────────────────────────────────────
export const blogAPI = {
  getAll: (params) => api.get('blogs', { params }),
  getBySlug: (slug) => api.get(`blogs/${slug}`),
  getForEdit: (id) => api.get(`blogs/edit/${id}`),
  getAllAdmin: (params) => api.get('blogs/admin/all', { params }),
  create: (data) => api.post('blogs', data),
  update: (id, data) => api.put(`blogs/${id}`, data),
  delete: (id) => api.delete(`blogs/${id}`),
  getCategories: () => api.get('blogs/meta/categories'),
};

// ── Service API ──────────────────────────────────────────────────
export const serviceAPI = {
  getAll: () => api.get('services'),
  getFeatured: () => api.get('services/featured'),
  getBySlug: (slug) => api.get(`services/${slug}`),
  getAllAdmin: () => api.get('services/admin/all'),
  create: (data) => api.post('services', data),
  update: (id, data) => api.put(`services/${id}`, data),
  delete: (id) => api.delete(`services/${id}`),
};

// ── Contact API ──────────────────────────────────────────────────
export const contactAPI = {
  submit: (data) => api.post('contact', data),
  getAll: (params) => api.get('contact', { params }),
  update: (id, data) => api.put(`contact/${id}`, data),
  delete: (id) => api.delete(`contact/${id}`),
};

// ── Gallery API ──────────────────────────────────────────────────
export const galleryAPI = {
  getAll: (category) => api.get('gallery', { params: { category } }),
  getFeatured: () => api.get('gallery/featured'),
  getAllAdmin: () => api.get('gallery/admin/all'),
  upload: (formData) =>
    api.post('gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, data) => api.put(`gallery/${id}`, data),
  delete: (id) => api.delete(`gallery/${id}`),
};

// ── Auth API ─────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('auth/login', data),
  me: () => api.get('auth/me'),
  updatePassword: (data) => api.put('auth/updatepassword', data),
  register: (data) => api.post('auth/register', data),
};

// ── Admin API ────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('admin/stats'),
  getUsers: () => api.get('admin/users'),
  toggleUser: (id) => api.put(`admin/users/${id}/toggle`),
};

// ── SEO API ──────────────────────────────────────────────────────
export const seoAPI = {
  getPage: (page) => api.get(`seo/${page}`),
  getAll: () => api.get('seo'),
  updatePage: (page, data) => api.put(`seo/${page}`, data),
};

export default api;
