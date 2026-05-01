"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/core/domain/entities/Product";
import { API_CONFIG } from "@/core/infrastructure/api/config";
import { cartUseCases, favoriteUseCases } from "@/core";
import { useToast } from "./Toast";
import { useCart } from "@/context/CartContext";
import { useFavorite } from "@/context/FavoriteContext";
import { StarIcon } from "./Icons";

const getImageUrl = API_CONFIG.getImageUrl;

interface ProductCardProps {
  product: Product;
  isInitialFavorite?: boolean;
  onRemove?: (id: string) => void;
}

export default function ProductCard({ product, isInitialFavorite = false, onRemove }: ProductCardProps) {
  const { showToast } = useToast();
  const { refreshCartCount } = useCart();
  const { refreshFavCount } = useFavorite();
  const [adding, setAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isInitialFavorite);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await cartUseCases.addToCart(product.id, 1);
      await refreshCartCount();
      showToast(`${product.name} added to cart`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to add to cart", "error");
    } finally {
      setAdding(false);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (isFavorite) {
        await favoriteUseCases.removeFromFavorites(product.id);
        showToast("Removed from favorites", "info");
        if (onRemove) onRemove(product.id);
      } else {
        await favoriteUseCases.addToFavorites(product.id);
        showToast("Added to favorites", "success");
      }
      setIsFavorite(!isFavorite);
      refreshFavCount();
    } catch (err: any) {
      showToast(err.message || "Action failed. Are you logged in?", "error");
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="glass animate-fade-in card-hover" style={{
      display: "flex",
      flexDirection: "column",
      padding: "1rem",
      textDecoration: "none",
      color: "inherit",
      height: "100%",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ position: "relative", marginBottom: "1rem" }}>
        <div style={{
          aspectRatio: "1/1",
          borderRadius: "calc(var(--radius) - 4px)",
          overflow: "hidden",
          background: "var(--secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {getImageUrl(product.images || product.image || product.imageUrl) ? (
            <img 
              src={getImageUrl(product.images || product.image || product.imageUrl)!} 
              alt={product.name} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          ) : (
            "No Image Available"
          )}
        </div>
        
        <button 
          onClick={toggleFavorite}
          style={{
            position: "absolute",
            top: "0.5rem",
            left: "0.5rem",
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(4px)",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            zIndex: 10
          }}
          className="qty-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? "#ef4444" : "none"} stroke={isFavorite ? "#ef4444" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {product.isRecommended && (
          <span style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            background: "var(--primary)",
            color: "white",
            padding: "0.2rem 0.6rem",
            borderRadius: "100px",
            fontSize: "0.65rem",
            fontWeight: 700
          }}>
            Recommended
          </span>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
        <h3 style={{ fontSize: "1.1rem" }}>{product.name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.85rem" }}>
          <StarIcon size={14} />
          <span style={{ fontWeight: 600 }}>{product.averageRating || product.rating || 0}</span>
        </div>
      </div>

      <p style={{ color: "var(--muted)", fontSize: "0.85rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", height: "2.5rem", marginBottom: "1rem" }}>
        {product.description}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
        <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--primary)" }}>
          ${Number(product.price || 0).toFixed(2)}
        </span>
        <button 
          onClick={handleAddToCart}
          disabled={adding}
          style={{ 
            background: "var(--primary)", 
            color: "white", 
            border: "none", 
            borderRadius: "var(--radius)", 
            padding: "0.5rem 1rem", 
            fontSize: "0.85rem", 
            fontWeight: 600, 
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}
