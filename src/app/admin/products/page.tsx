"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProductsUseCase, adminUseCases } from "@/core";
import { Product } from "@/core/domain/entities/Product";
import { API_CONFIG } from "@/core/infrastructure/api/config";

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await getProductsUseCase.execute();
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await adminUseCases.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      alert("Product deleted successfully");
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    }
  };

  return (
    <main style={{ padding: "8rem 1rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <h1>Manage Products</h1>
        <Link href="/admin/products/create">
          <button className="glass" style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none" }}>
            + Add Product
          </button>
        </Link>
      </div>

      <div className="glass" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "1.5rem" }}>Product</th>
              <th style={{ padding: "1.5rem" }}>Price</th>
              <th style={{ padding: "1.5rem" }}>Stock</th>
              <th style={{ padding: "1.5rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: "2rem", textAlign: "center" }}>Loading products...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: "2rem", textAlign: "center" }}>No products found</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <img 
                        src={API_CONFIG.getImageUrl(product.images || product.image || product.imageUrl)!} 
                        alt="" 
                        style={{ width: "50px", height: "50px", borderRadius: "0.5rem", objectFit: "cover" }} 
                      />
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "1.5rem" }}>${Number(product.price || 0).toFixed(2)}</td>
                  <td style={{ padding: "1.5rem" }}>{product.stockQuantity}</td>
                  <td style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <Link href={`/admin/products/edit/${product.id}`} style={{ color: "var(--primary)", fontWeight: 600 }}>Edit</Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
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
