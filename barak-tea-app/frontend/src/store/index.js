import { create } from 'zustand';

// Auth store
export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: !!localStorage.getItem('authToken'),

  setAuth: (token, user) => {
    localStorage.setItem('authToken', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

// Cart store
export const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  total: 0,

  addItem: (product) => {
    const items = get().items;
    const existing = items.find((item) => item.id === product.id && item.variant === product.variant);

    if (existing) {
      existing.quantity += product.quantity;
    } else {
      items.push({ ...product, quantity: product.quantity || 1 });
    }

    localStorage.setItem('cart', JSON.stringify(items));
    get().calculateTotal();
    set({ items });
  },

  removeItem: (id, variant) => {
    const items = get().items.filter((item) => !(item.id === id && item.variant === variant));
    localStorage.setItem('cart', JSON.stringify(items));
    get().calculateTotal();
    set({ items });
  },

  updateQuantity: (id, variant, quantity) => {
    const items = get().items;
    const item = items.find((item) => item.id === id && item.variant === variant);
    if (item) {
      item.quantity = Math.max(1, quantity);
      localStorage.setItem('cart', JSON.stringify(items));
      get().calculateTotal();
      set({ items });
    }
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [], total: 0 });
  },

  calculateTotal: () => {
    const total = get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    set({ total });
  },
}));

// Product store
export const useProductStore = create((set) => ({
  products: [],
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),

  setProducts: (products) => set({ products }),

  toggleFavorite: (productId) => {
    set((state) => {
      const favorites = state.favorites.includes(productId)
        ? state.favorites.filter((id) => id !== productId)
        : [...state.favorites, productId];

      localStorage.setItem('favorites', JSON.stringify(favorites));
      return { favorites };
    });
  },
}));
