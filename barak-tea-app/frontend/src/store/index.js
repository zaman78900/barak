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
    const current = get().items;
    const existingIndex = current.findIndex(
      (item) => item.id === product.id && item.variant === product.variant
    );

    let newItems;
    if (existingIndex !== -1) {
      // Return a new array with the updated item
      newItems = current.map((item, i) =>
        i === existingIndex
          ? { ...item, quantity: item.quantity + (product.quantity || 1) }
          : item
      );
    } else {
      newItems = [...current, { ...product, quantity: product.quantity || 1 }];
    }

    const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(newItems));
    set({ items: newItems, total });
  },

  removeItem: (id, variant) => {
    const newItems = get().items.filter(
      (item) => !(item.id === id && item.variant === variant)
    );
    const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(newItems));
    set({ items: newItems, total });
  },

  updateQuantity: (id, variant, quantity) => {
    const newItems = get().items.map((item) =>
      item.id === id && item.variant === variant
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    );
    const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(newItems));
    set({ items: newItems, total });
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [], total: 0 });
  },

  calculateTotal: () => {
    const total = get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
