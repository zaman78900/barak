import { useState, useEffect } from 'react';
import api from './api';

// Custom React hooks for API calls

export const useProducts = (page = 1, limit = 12, filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams({
          page,
          limit,
          ...filters,
        }).toString();

        const data = await api.get(`/products?${query}`);
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.error || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit, JSON.stringify(filters)]);

  return { products, loading, error, pagination };
};

export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const data = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.error || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

export const useOrders = (page = 1, limit = 10) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.get(`/orders?page=${page}&limit=${limit}`);
        setOrders(data.orders);
      } catch (err) {
        setError(err.error || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit]);

  return { orders, loading, error };
};

export const useReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await api.get(`/reviews?product_id=${productId}`);
        setReviews(data.reviews);
      } catch (err) {
        setError(err.error || 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  return { reviews, loading, error };
};

export const useCoupon = () => {
  const validate = async (code, orderTotal) => {
    try {
      return await api.post('/coupons/validate', { code, order_total: orderTotal });
    } catch (err) {
      throw err.error || 'Failed to validate coupon';
    }
  };

  return { validate };
};

export const useAuth = () => {
  const login = async (email, password) => {
    try {
      return await api.post('/auth/login', { email, password });
    } catch (err) {
      throw err.error || 'Login failed';
    }
  };

  const register = async (email, password, fullName, phone) => {
    try {
      return await api.post('/auth/register', {
        email,
        password,
        full_name: fullName,
        phone,
      });
    } catch (err) {
      throw err.error || 'Registration failed';
    }
  };

  const getCurrentUser = async () => {
    try {
      return await api.get('/auth/me');
    } catch (err) {
      throw err.error || 'Failed to fetch user';
    }
  };

  return { login, register, getCurrentUser };
};

export const useShipment = () => {
  const track = async (trackingNumber) => {
    try {
      return await api.get(`/shipments/track/${trackingNumber}`);
    } catch (err) {
      throw err.error || 'Tracking not found';
    }
  };

  return { track };
};
