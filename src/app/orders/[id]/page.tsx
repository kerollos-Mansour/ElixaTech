"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { orderUseCases } from "@/core";

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!id) return;
    try {
      // We use trackOrder because it currently fetches the full order details via GET /orders/{id}
      const data = await orderUseCases.trackOrder(id as string);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) return <main style={{ padding: "8rem 1rem", textAlign: "center" }}>Loading order details...</main>;
  if (error) return <main style={{ padding: "8rem 1rem", textAlign: "center", color: "#ef4444" }}>{error}</main>;

  return (
    <main className="animate-fade-in">
      <div style={{ padding: "8rem 1rem 4rem", maxWidth: "900px", margin: "0 auto" }}>
        <Link href="/orders" style={{ color: "var(--primary)", textDecoration: "none", marginBottom: "2rem", display: "inline-block", fontWeight: 600 }}>
          ← Back to Orders
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Order Details</h1>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>Order ID: {id}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Total Amount</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)" }}>${Number(order?.totalAmount || 0).toFixed(2)}</p>
          </div>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          
          {/* Order Info */}
          <div className="glass" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              📄 Invoice Summary
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Date Placed</span>
                <span style={{ fontWeight: 600 }}>{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Payment Method</span>
                <span style={{ fontWeight: 600 }}>{order?.paymentMethod?.replace(/_/g, " ")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Order Status</span>
                <span style={{ 
                  fontWeight: 700, 
                  color: order?.status === "DELIVERED" ? "#22c55e" : "var(--primary)",
                  background: order?.status === "DELIVERED" ? "rgba(34, 197, 94, 0.1)" : "rgba(99, 102, 241, 0.1)",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "100px",
                  fontSize: "0.8rem"
                }}>
                  {order?.status || "UNKNOWN"}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="glass" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <LocationIcon /> Shipping Details
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Delivery Address</p>
                <p style={{ fontWeight: 600, lineHeight: 1.5 }}>
                  {order?.address?.addressDetails || "No address provided"}
                </p>
              </div>
              <div>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Contact Number</p>
                <p style={{ fontWeight: 600 }}>
                  {order?.contactNumber || order?.address?.phoneNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Items List */}
        {order?.items && order.items.length > 0 && (
          <div className="glass" style={{ padding: "2rem", marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Items in this Order</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {order.items.map((item: any) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "var(--secondary)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "48px", height: "48px", background: "var(--background)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                      📦
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "1.05rem" }}>{item.product?.name || "Unknown Product"}</p>
                      <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 700, color: "var(--primary)" }}>${Number(item.priceAtPurchase || 0).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
