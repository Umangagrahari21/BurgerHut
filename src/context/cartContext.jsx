import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    const existingItem = cartItems.find(
      (i) => i.id === item.id
    );

    if (existingItem) {
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        { ...item, quantity: 1 },
      ]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const getTotalItems = () =>
    cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

  const getSubtotal = () =>
    cartItems.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartContext);
