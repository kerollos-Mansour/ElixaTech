"use client";

import { useEffect, useState } from "react";
import { favoriteUseCases } from "@/core";
import { Product } from "@/core/domain/entities/Product";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      const data = await favoriteUseCases.getFavorites();
      setFavorites(data);
    } catch (err: any) {
      setError(err.message || "Failed to load favorites. Are you logged in?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) return <main style={{ padding: "8rem 1rem", textAlign: "center" }}>Loading your favorites...</main>;

  if (error) return (
    <main style={{ padding: "8rem 1rem", textAlign: "center" }}>
      <h2 style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</h2>
      <Link href="/login">
        <button className="glass" style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none" }}>
          Login to see favorites
        </button>
      </Link>
    </main>
  );

  const handleRemove = (id: string) => {
    setFavorites(prev => prev.filter(p => p.id !== id));
  };

  return (
    <main>
      <div style={{ padding: "8rem 1rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>My Favorites</h1>

        {favorites.length === 0 ? (
          <div className="glass" style={{ padding: "4rem", textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>❤️</div>
            <h3>No favorites yet</h3>
            <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>Explore our products and tap the heart to save them here.</p>
            <Link href="/products">
              <button style={{ padding: "1rem 2rem", borderRadius: "var(--radius)", background: "var(--primary)", color: "white", fontWeight: 600, border: "none", cursor: "pointer" }}>
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
            gap: "2rem" 
          }}>
            {favorites.map((item: any) => {
              // Handle both direct product array and nested product object
              const product = item.product || item;
              const productId = item.productId || product.id;
              
              // Ensure the product object has the correct ID for the heart toggle to work
              const finalProduct = { ...product, id: productId };

              return (
                <ProductCard 
                  key={productId} 
                  product={finalProduct} 
                  isInitialFavorite={true} 
                  onRemove={handleRemove} 
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
