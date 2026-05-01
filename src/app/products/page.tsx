"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getProductsUseCase } from "@/core";
import { Product } from "@/core/domain/entities/Product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsUseCase.execute();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main>
      <div style={{ padding: "8rem 1rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Our Products</h1>
          <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>
            Explore our curated selection of premium products.
          </p>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass" style={{ height: "400px", animation: "pulse 2s infinite" }}></div>
            ))}
          </div>
        ) : error ? (
          <div className="glass" style={{ padding: "4rem", textAlign: "center", color: "#ef4444" }}>
            <h3>Oops! {error}</h3>
            <button onClick={() => window.location.reload()} style={{ marginTop: "1rem", color: "var(--primary)", textDecoration: "underline" }}>
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="glass" style={{ padding: "4rem", textAlign: "center" }}>
            <p>No products found. Start by adding some in the admin panel!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
