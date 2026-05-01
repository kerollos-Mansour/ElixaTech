"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getProductsUseCase, searchProductsUseCase, filterProductsUseCase } from "@/core";
import { Product } from "@/core/domain/entities/Product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProductsUseCase.execute();
      setProducts(data);
      setActiveFilter("all");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }
    setLoading(true);
    try {
      const data = await searchProductsUseCase.execute(searchQuery);
      setProducts(data);
      setActiveFilter("search");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (type: string) => {
    setLoading(true);
    setActiveFilter(type);
    try {
      let data;
      if (type === "top") {
        // Fetch all products first so we sort the full list
        data = await getProductsUseCase.execute();
        // Sort directly on the frontend (Highest rating first)
        data = data.sort((a, b) => {
          const ratingA = a.averageRating ?? a.rating ?? 0;
          const ratingB = b.averageRating ?? b.rating ?? 0;
          return ratingB - ratingA;
        });
      } else if (type === "all") {
        data = await getProductsUseCase.execute();
      } else {
        data = await filterProductsUseCase.execute(type);
      }
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Hottest", value: "hottest" },
    { label: "Popular", value: "popular" },
    { label: "New", value: "new" },
    { label: "Top Rated", value: "top" },
  ];

  return (
    <main>
      {/* Hero Section for Products */}
      <section style={{ padding: "8rem 1rem 4rem", textAlign: "center", background: "linear-gradient(to bottom, var(--secondary), transparent)" }}>
        <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>Explore Our Products</h1>
        <p style={{ color: "var(--muted)", maxWidth: "600px", margin: "0 auto 3rem" }}>
          Quality items curated just for you. Use search or filters to find exactly what you need.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ maxWidth: "600px", margin: "0 auto", display: "flex", gap: "1rem" }}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "1rem 1.5rem",
              borderRadius: "var(--radius)",
              background: "var(--background)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              fontSize: "1rem",
              outline: "none"
            }}
          />
          <button type="submit" style={{ 
            padding: "1rem 2rem", 
            borderRadius: "var(--radius)", 
            background: "var(--primary)", 
            color: "white", 
            fontWeight: 600,
            cursor: "pointer"
          }}>
            Search
          </button>
        </form>

        {/* Filter Chips */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
          {filterOptions.map((opt) => (
            <button 
              key={opt.value}
              onClick={() => handleFilter(opt.value)}
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "100px",
                background: activeFilter === opt.value ? "var(--primary)" : "var(--background)",
                color: activeFilter === opt.value ? "white" : "var(--foreground)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                fontWeight: 500,
                transition: "all 0.2s"
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section style={{ padding: "4rem 1rem", maxWidth: "1200px", margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>Searching for quality...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h3>No products found</h3>
            <p style={{ color: "var(--muted)" }}>Try a different search term or filter.</p>
            <button 
              onClick={fetchProducts}
              style={{ marginTop: "1.5rem", color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
