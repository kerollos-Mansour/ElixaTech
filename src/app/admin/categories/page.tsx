"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminUseCases } from "@/core";
import { Category } from "@/core/domain/repositories/ICategoryRepository";
import { API_CONFIG } from "@/core/infrastructure/api/config";

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const data = await adminUseCases.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    try {
      await adminUseCases.deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      alert("Category deleted successfully");
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    }
  };

  return (
    <main style={{ padding: "8rem 1rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <h1>Manage Categories</h1>
        <Link href="/admin/categories/create">
          <button className="glass" style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none" }}>
            + Add Category
          </button>
        </Link>
      </div>

      <div className="glass" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "1.5rem" }}>Image</th>
              <th style={{ padding: "1.5rem" }}>Name</th>
              <th style={{ padding: "1.5rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} style={{ padding: "2rem", textAlign: "center" }}>Loading categories...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={3} style={{ padding: "2rem", textAlign: "center" }}>No categories found</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "1.5rem" }}>
                    <img 
                      src={API_CONFIG.getImageUrl(cat.imageUrl)!} 
                      alt="" 
                      style={{ width: "50px", height: "50px", borderRadius: "0.5rem", objectFit: "cover" }} 
                    />
                  </td>
                  <td style={{ padding: "1.5rem" }}>{cat.name}</td>
                  <td style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <Link href={`/admin/categories/edit/${cat.id}`} style={{ color: "var(--primary)", fontWeight: 600 }}>Edit</Link>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
