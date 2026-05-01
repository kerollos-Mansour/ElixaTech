"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminUseCases } from "@/core";
import { Category } from "@/core/domain/repositories/ICategoryRepository";

export default function CreateProductPage() {
  const router = useRouter();
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
  const [previews, setPreviews] = useState<string[]>([]);
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error", message?: string }>({ type: "idle" });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await adminUseCases.getCategories();
        setCategories(data);
        if (data.length > 0) setFormData(prev => ({ ...prev, categoryId: data[0].id }));
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
    
    // Generate previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      setStatus({ type: "error", message: "Please select at least one image" });
      return;
    }

    setStatus({ type: "loading" });

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("stockQuantity", formData.stockQuantity);
    data.append("categoryId", formData.categoryId);
    data.append("isRecommended", String(formData.isRecommended));
    
    // Append all images with the key 'images' as per documentation
    imageFiles.forEach(file => {
      data.append("images", file);
    });

    try {
      await adminUseCases.createProduct(data);
      setStatus({ type: "success", message: "Product created successfully!" });
      setTimeout(() => router.push("/products"), 1500);
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Failed to create product" });
    }
  };

  return (
    <main style={{ padding: "8rem 1rem", maxWidth: "800px", margin: "0 auto" }}>
      <div className="glass animate-fade-in" style={{ padding: "3rem" }}>
        <h1 style={{ marginBottom: "2rem", textAlign: "center" }}>Create New Product</h1>
        
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {status.message && (
            <div style={{ 
              gridColumn: "1 / -1",
              padding: "1rem", 
              borderRadius: "var(--radius)", 
              textAlign: "center",
              background: status.type === "error" ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
              color: status.type === "error" ? "#ef4444" : "#22c55e"
            }}>
              {status.message}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 500 }}>Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ padding: "0.8rem", borderRadius: "var(--radius)", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 500 }}>Price ($)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              style={{ padding: "0.8rem", borderRadius: "var(--radius)", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", gridColumn: "1 / -1" }}>
            <label style={{ fontWeight: 500 }}>Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ padding: "0.8rem", borderRadius: "var(--radius)", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)", resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 500 }}>Stock Quantity</label>
            <input
              type="number"
              required
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              style={{ padding: "0.8rem", borderRadius: "var(--radius)", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 500 }}>Category</label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              style={{ padding: "0.8rem", borderRadius: "var(--radius)", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", gridColumn: "1 / -1" }}>
            <label style={{ fontWeight: 500 }}>Product Images (Multiple)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{ padding: "0.6rem", color: "var(--muted)" }}
            />
            
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {previews.map((src, i) => (
                <div key={i} style={{ position: "relative", width: "80px", height: "80px" }}>
                  <img src={src} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "0.5rem" }} />
                  <button 
                    type="button"
                    onClick={() => removeImage(i)}
                    style={{ position: "absolute", top: "-5px", right: "-5px", background: "#ef4444", color: "white", borderRadius: "50%", width: "20px", height: "20px", border: "none", cursor: "pointer", fontSize: "12px" }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <input
              type="checkbox"
              id="recommended"
              checked={formData.isRecommended}
              onChange={(e) => setFormData({ ...formData, isRecommended: e.target.checked })}
              style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
            />
            <label htmlFor="recommended" style={{ cursor: "pointer" }}>Mark as Recommended</label>
          </div>

          <button
            type="submit"
            disabled={status.type === "loading"}
            style={{
              gridColumn: "1 / -1",
              padding: "1rem",
              borderRadius: "var(--radius)",
              background: "var(--primary)",
              color: "white",
              fontWeight: 600,
              marginTop: "1rem",
              cursor: status.type === "loading" ? "not-allowed" : "pointer"
            }}
          >
            {status.type === "loading" ? "Creating Product..." : "Create Product"}
          </button>
        </form>
      </div>
    </main>
  );
}
