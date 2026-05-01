"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminUseCases } from "@/core";
import { API_CONFIG } from "@/core/infrastructure/api/config";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error", message?: string }>({ type: "idle" });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categories = await adminUseCases.getCategories();
        const category = categories.find(c => c.id === id);
        if (category) {
          setName(category.name);
          setPreviewUrl(API_CONFIG.getImageUrl(category.imageUrl));
          setCurrentImageUrl(category.imageUrl || "");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategory();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });

    try {
      if (selectedFile) {
        await adminUseCases.updateCategoryWithFile(id as string, name, selectedFile);
      } else {
        await adminUseCases.updateCategory(id as string, name, currentImageUrl);
      }
      setStatus({ type: "success", message: "Category updated successfully!" });
      setTimeout(() => router.push("/admin/categories"), 1500);
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Failed to update category" });
    }
  };

  return (
    <main style={{ padding: "8rem 1rem", maxWidth: "600px", margin: "0 auto" }}>
      <div className="glass animate-fade-in" style={{ padding: "3rem" }}>
        <h1 style={{ marginBottom: "2rem", textAlign: "center" }}>Edit Category</h1>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {status.message && (
            <div style={{ 
              padding: "1rem", 
              borderRadius: "var(--radius)", 
              textAlign: "center",
              background: status.type === "error" ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
              color: status.type === "error" ? "#ef4444" : "#22c55e"
            }}>
              {status.message}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.95rem" }}>Category Name</label>
            <input
              type="text"
              required
              className="premium-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--foreground)" }}>Category Image</label>
            <div 
              style={{
                position: "relative",
                height: "240px",
                borderRadius: "1.5rem",
                background: "var(--secondary)",
                border: "2px dashed var(--border)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }} 
              className="card-hover"
              onClick={() => document.getElementById("fileInput")?.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--primary)"; }}
              onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--border)"; }}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileChange({ target: { files: [file] } } as any);
              }}
            >
              {previewUrl ? (
                <div style={{ width: "100%", height: "100%", position: "relative" }}>
                  <img src={previewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                    <div style={{ textAlign: "center", color: "white" }}>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Click to Change</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", color: "var(--muted)", padding: "2rem" }}>
                   <div style={{ 
                     width: "60px", 
                     height: "60px", 
                     background: "white", 
                     borderRadius: "50%", 
                     display: "flex", 
                     alignItems: "center", 
                     justifyContent: "center", 
                     margin: "0 auto 1.5rem",
                     boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                     color: "var(--primary)"
                   }}>
                     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                     </svg>
                   </div>
                   <p style={{ fontWeight: 700, color: "var(--foreground)", marginBottom: "0.4rem" }}>Click to upload</p>
                   <p style={{ fontSize: "0.85rem" }}>or drag and drop your image here</p>
                </div>
              )}
              <input 
                id="fileInput"
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ display: "none" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status.type === "loading"}
            style={{
              padding: "1rem",
              borderRadius: "var(--radius)",
              background: "var(--primary)",
              color: "white",
              fontWeight: 600,
              cursor: status.type === "loading" ? "not-allowed" : "pointer"
            }}
          >
            {status.type === "loading" ? "Updating..." : "Update Category"}
          </button>
        </form>
      </div>
    </main>
  );
}
