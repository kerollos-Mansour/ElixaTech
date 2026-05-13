"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { cartUseCases } from "@/core";

interface CartContextType {
  cartCount: number;
  refreshCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!token) {
      setCartCount(0);
      return;
    }
    try {
      const cart = await cartUseCases.getCart() as any;
      const items = cart?.items || cart?.data?.items || [];
      // Calculate total quantity of items
      const count = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
