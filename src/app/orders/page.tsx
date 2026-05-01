"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { orderUseCases } from "@/core";
import { Order } from "@/core/domain/entities/Order";
import { useToast } from "@/components/Toast";

export default function MyOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await orderUseCases.getMyOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <main style={{ padding: "8rem 1rem", textAlign: "center" }}>Loading your orders...</main>;

  if (error) return (
    <main style={{ padding: "8rem 1rem", textAlign: "center" }}>
      <h2 style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</h2>
      <Link href="/login">
        <button className="glass" style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none" }}>
          Login to see orders
        </button>
      </Link>
    </main>
  );

  return (
    <main className="animate-fade-in">
      <div style={{ padding: "8rem 1rem 4rem", maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>My Orders</h1>

        {orders.length === 0 ? (
          <div className="glass" style={{ padding: "4rem", textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📦</div>
            <h3>No orders yet</h3>
            <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>You haven't placed any orders.</p>
            <Link href="/products">
              <button style={{ padding: "1rem 2rem", borderRadius: "var(--radius)", background: "var(--primary)", color: "white", fontWeight: 600, border: "none", cursor: "pointer" }}>
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {orders.map((order, index) => (
              <div key={order.id} className={`glass animate-fade-in delay-${Math.min((index + 1) * 100, 500)}`} style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem" }}>Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "100px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      background: order.status === "DELIVERED" ? "rgba(34, 197, 94, 0.1)" : "rgba(99, 102, 241, 0.1)",
                      color: order.status === "DELIVERED" ? "#22c55e" : "var(--primary)"
                    }}>
                      {order.status}
                    </span>
                    <p style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "0.5rem" }}>${Number(order.totalAmount).toFixed(2)}</p>
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                  {order.status === "DELIVERED" && (
                    <Link href={`/orders/${order.id}`}>
                      <button style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius)", background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)", cursor: "pointer", fontWeight: 600 }}>
                        View Details
                      </button>
                    </Link>
                  )}
                  {order.status !== "DELIVERED" && (
                    <Link href={`/orders/${order.id}/track`}>
                      <button style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius)", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontWeight: 600 }}>
                        Track Order
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
