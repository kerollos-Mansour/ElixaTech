"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminUseCases } from "@/core";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", imageUrl: "" });
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error", message?: string }>({ type: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });

    try {
      await adminUseCases.createCategory(formData.name, formData.imageUrl);
      setStatus({ type: "success", message: "Category created successfully!" });
      setTimeout(() => router.push("/products"), 1500);
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Failed to create category" });
    }
  };

  return (
    <main style={{ padding: "8rem 1rem", maxWidth: "600px", margin: "0 auto" }}>
      <div className="glass animate-fade-in" style={{ padding: "3rem" }}>
        <h1 style={{ marginBottom: "2rem", textAlign: "center" }}>Create Category</h1>
        
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
              placeholder="e.g. Electronics"
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
              placeholder="https://example.com/image.jpg"
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
            {status.type === "loading" ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>
    </main>
  );
}
