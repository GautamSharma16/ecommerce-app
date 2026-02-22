import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch {
      setCart({ items: [] });
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user?._id]);

  const addToCart = async (productId, qty = 1, size = '', color = '') => {
    setLoading(true);
    try {
      const { data } = await api.post('/cart', { productId, qty, size, color });
      setCart(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, qty) => {
    setLoading(true);
    try {
      const { data } = await api.put('/cart/item', { itemId, qty });
      setCart(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    setLoading(true);
    try {
      const { data } = await api.delete(`/cart/item/${itemId}`);
      setCart(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      const { data } = await api.delete('/cart');
      setCart(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cart?.items?.reduce((sum, i) => sum + i.qty, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        fetchCart,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
