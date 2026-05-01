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
      setTimeout(() => router.push("/admin/products"), 1500); // Updated path
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Failed to create product" });
    }
  };

  return (
    <main style={{ padding: "8rem 1rem", maxWidth: "900px", margin: "0 auto" }}>
      <div className="glass animate-fade-in" style={{ padding: "3rem" }}>
        <h1 style={{ marginBottom: "2rem", textAlign: "center" }}>Create New Product</h1>
        
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
              placeholder="e.g. Wireless Headphones"
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
              placeholder="0.00"
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
              placeholder="Tell more about your product..."
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
              placeholder="0"
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
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Product Images</label>
            <div 
              style={{
                height: "200px",
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
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--primary)"; }}
              onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--border)"; }}
              onDrop={(e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files);
                if (files.length > 0) handleImageChange({ target: { files: e.dataTransfer.files } } as any);
              }}
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
                <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>Click or drag images here</p>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>You can select multiple files</p>
                <input 
                  id="fileInput"
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  style={{ display: "none" }}
                />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
              {previews.map((src, i) => (
                <div key={i} className="animate-fade-in" style={{ position: "relative", width: "100%", paddingTop: "100%", borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)" }}>
                  <img src={src} alt="preview" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ 
                    position: "absolute", 
                    inset: 0, 
                    background: "rgba(0,0,0,0.3)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.2s"
                  }} className="hover-reveal">
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                      style={{ background: "#ef4444", color: "white", borderRadius: "50%", width: "24px", height: "24px", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
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
            {status.type === "loading" ? "Creating Product..." : "Launch Product"}
          </button>
        </form>
      </div>
    </main>
  );
}
