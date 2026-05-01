"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminUseCases } from "@/core";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({ name: "", imageUrl: "" });
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error", message?: string }>({ type: "idle" });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categories = await adminUseCases.getCategories();
        const category = categories.find(c => c.id === id);
        if (category) {
          setFormData({ name: category.name, imageUrl: category.imageUrl || "" });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });

    try {
      await adminUseCases.updateCategory(id as string, formData.name, formData.imageUrl);
      setStatus({ type: "success", message: "Category updated successfully!" });
      setTimeout(() => router.push("/admin/categories"), 1500); // Updated path
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

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 500 }}>Category Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                padding: "0.8rem",
                borderRadius: "var(--radius)",
                background: "var(--secondary)",
                border: "1px solid var(--border)",
                color: "var(--foreground)"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 500 }}>Image URL</label>
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              style={{
                padding: "0.8rem",
                borderRadius: "var(--radius)",
                background: "var(--secondary)",
                border: "1px solid var(--border)",
                color: "var(--foreground)"
              }}
            />
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
