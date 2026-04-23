// Admin API Service - All CRUD operations for admin panel
import api from './api.js';

// ─── PRODUCTS ──────────────────────────────────────────────────────────────
export const productsAPI = {
  // Get all products (for admin - no active filter)
  getAll: (page = 1, limit = 12, filters = {}) => 
    api.get('/products', { params: { page, limit, ...filters } }),

  // Get single product
  getById: (id) => api.get(`/products/${id}`),

  // Create product
  create: (data) => api.post('/products', data),

  // Update product
  update: (id, data) => api.put(`/products/${id}`, data),

  // Delete product
  delete: (id) => api.delete(`/products/${id}`),
};

// ─── ORDERS ────────────────────────────────────────────────────────────────
export const ordersAPI = {
  // Get all orders
  getAll: (page = 1, limit = 10, filters = {}) =>
    api.get('/orders', { params: { page, limit, ...filters } }),

  // Get single order
  getById: (id) => api.get(`/orders/${id}`),

  // Update order status
  updateStatus: (id, status) => api.put(`/orders/${id}`, { status }),

  // Get order analytics
  getAnalytics: () => api.get('/orders/admin/analytics'),
};

// ─── CUSTOMERS ────────────────────────────────────────────────────────────
export const customersAPI = {
  // Get all customers
  getAll: (page = 1, limit = 10) =>
    api.get('/customers', { params: { page, limit } }),

  // Get single customer
  getById: (id) => api.get(`/customers/${id}`),

  // Get customer orders
  getOrders: (customerId) => api.get(`/customers/${customerId}/orders`),
};

// ─── SHIPMENTS ────────────────────────────────────────────────────────────
export const shipmentsAPI = {
  // Get all shipments
  getAll: (page = 1, limit = 10, filters = {}) =>
    api.get('/shipments', { params: { page, limit, ...filters } }),

  // Get single shipment
  getById: (id) => api.get(`/shipments/${id}`),

  // Create shipment
  create: (data) => api.post('/shipments', data),

  // Update shipment
  update: (id, data) => api.put(`/shipments/${id}`, data),

  // Update tracking status
  updateStatus: (id, status) => api.put(`/shipments/${id}`, { status }),
};

// ─── COUPONS ────────────────────────────────────────────────────────────────
export const couponsAPI = {
  // Get all coupons
  getAll: (page = 1, limit = 10) =>
    api.get('/coupons', { params: { page, limit } }),

  // Get single coupon
  getById: (id) => api.get(`/coupons/${id}`),

  // Create coupon
  create: (data) => api.post('/coupons', data),

  // Update coupon
  update: (id, data) => api.put(`/coupons/${id}`, data),

  // Delete coupon
  delete: (id) => api.delete(`/coupons/${id}`),
};

// ─── REVIEWS ───────────────────────────────────────────────────────────────
export const reviewsAPI = {
  // Get all reviews (pending, approved, rejected)
  getAll: (page = 1, limit = 10, filter = {}) =>
    api.get('/reviews', { params: { page, limit, ...filter } }),

  // Approve review
  approve: (id) => api.put(`/reviews/${id}`, { status: 'approved' }),

  // Reject review
  reject: (id) => api.put(`/reviews/${id}`, { status: 'rejected' }),

  // Delete review
  delete: (id) => api.delete(`/reviews/${id}`),
};

// ─── WHOLESALE ────────────────────────────────────────────────────────────
export const wholesaleAPI = {
  // Get all wholesale enquiries
  getAll: (page = 1, limit = 10, filters = {}) =>
    api.get('/wholesale', { params: { page, limit, ...filters } }),

  // Get single enquiry
  getById: (id) => api.get(`/wholesale/${id}`),

  // Update enquiry status
  updateStatus: (id, status) => api.put(`/wholesale/${id}`, { status }),

  // Add note to enquiry
  addNote: (id, note) => api.put(`/wholesale/${id}`, { notes: note }),
};

export default {
  products: productsAPI,
  orders: ordersAPI,
  customers: customersAPI,
  shipments: shipmentsAPI,
  coupons: couponsAPI,
  reviews: reviewsAPI,
  wholesale: wholesaleAPI,
};
