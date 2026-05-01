"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminUseCases, getProductDetailUseCase } from "@/core";
import { Category } from "@/core/domain/repositories/ICategoryRepository";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stockQuantity: "",
    categoryId: "",
    isRecommended: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error", message?: string }>({ type: "idle" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, product] = await Promise.all([
          adminUseCases.getCategories(),
          getProductDetailUseCase.execute(id as string)
        ]);
        
        setCategories(cats);
        setFormData({
          name: product.name,
          price: String(product.price),
          description: product.description,
          stockQuantity: String(product.stockQuantity),
          categoryId: product.categoryId,
          isRecommended: product.isRecommended,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("stockQuantity", formData.stockQuantity);
    data.append("categoryId", formData.categoryId);
    data.append("isRecommended", String(formData.isRecommended));
    
    // Append images if new ones are selected
    imageFiles.forEach(file => {
      data.append("images", file);
    });

    try {
      await adminUseCases.updateProduct(id as string, data);
      setStatus({ type: "success", message: "Product updated successfully!" });
      setTimeout(() => router.push("/admin/products"), 1500); // Updated path
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Failed to update product" });
    }
  };

  return (
    <main style={{ padding: "8rem 1rem", maxWidth: "900px", margin: "0 auto" }}>
      <div className="glass animate-fade-in" style={{ padding: "3rem" }}>
        <h1 style={{ marginBottom: "2rem", textAlign: "center" }}>Edit Product</h1>
        
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {status.message && (
            <div style={{ 
              gridColumn: "1 / -1",
              padding: "1rem", 
              borderRadius: "1rem", 
              textAlign: "center",
              background: status.type === "error" ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
              color: status.type === "error" ? "#ef4444" : "#22c55e",
              fontWeight: 600
            }}>
              {status.message}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Product Name</label>
            <input
              type="text"
              required
              className="premium-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Price ($)</label>
            <input
              type="number"
              step="0.01"
              required
              className="premium-input"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", gridColumn: "1 / -1" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Description</label>
            <textarea
              required
              rows={4}
              className="premium-input"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Stock Quantity</label>
            <input
              type="number"
              required
              className="premium-input"
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Category</label>
            <select
              required
              className="premium-select"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", gridColumn: "1 / -1" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Replace Images (Optional)</label>
            <div 
              style={{
                height: "180px",
                borderRadius: "1.5rem",
                background: "var(--secondary)",
                border: "2px dashed var(--border)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              className="card-hover"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
               <div style={{ 
                     width: "48px", 
                     height: "48px", 
                     background: "white", 
                     borderRadius: "50%", 
                     display: "flex", 
                     alignItems: "center", 
                     justifyContent: "center", 
                     marginBottom: "1rem",
                     boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                     color: "var(--primary)"
                   }}>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                     </svg>
                </div>
                <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>{imageFiles.length > 0 ? `${imageFiles.length} files selected` : 'Click to replace images'}</p>
                <input 
                  id="fileInput"
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                  style={{ display: "none" }}
                />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <input
              type="checkbox"
              id="recommended"
              className="premium-checkbox"
              checked={formData.isRecommended}
              onChange={(e) => setFormData({ ...formData, isRecommended: e.target.checked })}
            />
            <label htmlFor="recommended" style={{ cursor: "pointer", fontWeight: 600, fontSize: "0.95rem" }}>Mark as Recommended</label>
          </div>

          <button
            type="submit"
            disabled={status.type === "loading"}
            style={{
              gridColumn: "1 / -1",
              padding: "1.2rem",
              borderRadius: "1.2rem",
              background: "var(--primary)",
              color: "white",
              fontWeight: 700,
              fontSize: "1.05rem",
              marginTop: "1.5rem",
              cursor: status.type === "loading" ? "not-allowed" : "pointer",
              boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.4)"
            }}
            className="card-hover"
          >
            {status.type === "loading" ? "Updating Product..." : "Update Product"}
          </button>
        </form>
      </div>
    </main>
  );
}
