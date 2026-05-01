"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { favoriteUseCases } from "@/core";

interface FavoriteContextType {
  favCount: number;
  refreshFavCount: () => Promise<void>;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const [favCount, setFavCount] = useState(0);

  const refreshFavCount = async () => {
    try {
      const favs = await favoriteUseCases.getFavorites();
      setFavCount(Array.isArray(favs) ? favs.length : 0);
    } catch (error) {
      setFavCount(0);
    }
  };

  useEffect(() => {
    refreshFavCount();
  }, []);

  return (
    <FavoriteContext.Provider value={{ favCount, refreshFavCount }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error("useFavorite must be used within a FavoriteProvider");
  return context;
};
