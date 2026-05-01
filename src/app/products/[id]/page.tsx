"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductDetailUseCase } from "@/core";
import { Product } from "@/core/domain/entities/Product";
import { API_CONFIG } from "@/core/infrastructure/api/config";

const getImageUrl = API_CONFIG.getImageUrl;

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      try {
        const data = await getProductDetailUseCase.execute(id as string);
        setProduct(data);
        
        // Set initial selected image
        const initialImg = getImageUrl(data.images || data.image || data.imageUrl);
        setSelectedImage(initialImg);
      } catch (err: any) {
        setError(err.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return (
    <main>
      <div style={{ padding: "8rem 1rem", textAlign: "center" }}>Loading details...</div>
    </main>
  );

  if (error || !product) return (
    <main>
      <div style={{ padding: "8rem 1rem", textAlign: "center", color: "#ef4444" }}>
        {error || "Product not found"}
      </div>
    </main>
  );

  const allImages = product.images || [];

  return (
    <main>
      <div style={{ padding: "8rem 1rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "4rem" }}>
          
          {/* Image Gallery Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="glass" style={{ 
              aspectRatio: "1/1", 
              borderRadius: "var(--radius)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--secondary)"
            }}>
              {selectedImage ? (
                <img src={selectedImage} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ color: "var(--muted)" }}>No Image Available</span>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {allImages.map((img) => (
                  <button 
                    key={img.id}
                    onClick={() => setSelectedImage(getImageUrl(img.url))}
                    style={{ 
                      width: "80px", 
                      height: "80px", 
                      borderRadius: "0.5rem", 
                      overflow: "hidden", 
                      border: selectedImage === getImageUrl(img.url) ? "2px solid var(--primary)" : "2px solid transparent",
                      padding: 0,
                      cursor: "pointer",
                      background: "none"
                    }}
                  >
                    <img src={getImageUrl(img.url)!} alt="thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {product.isRecommended && (
                <span style={{ 
                  width: "fit-content", 
                  background: "rgba(99, 102, 241, 0.1)", 
                  color: "var(--primary)", 
                  padding: "0.25rem 0.75rem", 
                  borderRadius: "100px", 
                  fontSize: "0.75rem", 
                  fontWeight: 700 
                }}>
                  Highly Recommended
                </span>
              )}
              <h1 style={{ fontSize: "3rem" }}>{product.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "#fbbf24" }}>★</span>
                <span style={{ fontWeight: 600 }}>{product.rating || "New"}</span>
                <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>(Not yet reviewed)</span>
              </div>
            </div>

            <p style={{ fontSize: "1.25rem", color: "var(--muted)", lineHeight: "1.6" }}>
              {product.description}
            </p>

            <div style={{ margin: "1rem 0" }}>
              <span style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--primary)" }}>
                ${Number(product.price || 0).toFixed(2)}
              </span>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                Stock: {product.stockQuantity > 0 ? `${product.stockQuantity} available` : "Out of stock"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button style={{ 
                flex: 1, 
                padding: "1rem", 
                borderRadius: "var(--radius)", 
                background: "var(--primary)", 
                color: "white", 
                fontWeight: 600,
                boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)"
              }}>
                Add to Cart
              </button>
              <button className="glass" style={{ padding: "1rem" }}>
                ♡
              </button>
            </div>
            
            <div style={{ marginTop: "2rem", borderTop: "1px solid var(--border)", paddingTop: "2rem" }}>
              <h3 style={{ marginBottom: "1rem" }}>Product Highlights</h3>
              <ul style={{ listArrayType: "none", color: "var(--muted)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li>✓ Premium Quality Guarantee</li>
                <li>✓ 24/7 Customer Support</li>
                <li>✓ Secure Payment Options</li>
                <li>✓ 30-Day Easy Returns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
