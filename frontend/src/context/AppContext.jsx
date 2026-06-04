import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

const AppContext = createContext(null);

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const AppProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => readStorage('vieshop_auth', null));
  const [cart, setCart] = useState(() => readStorage('vieshop_cart', []));
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('vieshop_auth', JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    localStorage.setItem('vieshop_cart', JSON.stringify(cart));
  }, [cart]);

  const pushToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2600);
  };

  const navigateRef = useRef(null);

  const addToCart = (product, quantity = 1) => {
    if (!auth) {
      pushToast('Vui lòng đăng nhập để thêm vào giỏ hàng', 'error');
      if (navigateRef.current) navigateRef.current('/login');
      return;
    }
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity,
          image: product.primary_image_url || product.thumbnail_url || '',
        },
      ];
    });
    pushToast('Đã thêm sản phẩm vào giỏ hàng 🛒');
  };

  const updateCartItem = (productId, quantity) => {
    setCart((current) =>
      current
        .map((item) => (item.id === productId ? { ...item, quantity: Math.max(quantity, 1) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeCartItem = (productId) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);
  const logout = () => setAuth(null);

  const value = useMemo(
    () => ({
      auth,
      setAuth,
      cart,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart,
      logout,
      pushToast,
      toasts,
      navigateRef,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      cartSubtotal: cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    }),
    [auth, cart, toasts],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
