"use client";

import { useEffect, useState } from "react";
import { orderUseCases } from "@/core";
import { Order } from "@/core/domain/entities/Order";
import { useToast } from "@/components/Toast";

export default function AdminManageOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await orderUseCases.getAllOrdersAdmin();
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

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await orderUseCases.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, "success");
      fetchOrders(); // Refresh
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  if (loading) return <main style={{ padding: "8rem 1rem", textAlign: "center" }}>Loading orders...</main>;
  if (error) return <main style={{ padding: "8rem 1rem", textAlign: "center", color: "#ef4444" }}>{error}</main>;

  const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <main className="animate-fade-in">
      <div style={{ padding: "8rem 1rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>Manage Orders</h1>

        <div className="glass" style={{ padding: "2rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                <th style={{ padding: "1rem" }}>Order ID</th>
                <th style={{ padding: "1rem" }}>Date</th>
                <th style={{ padding: "1rem" }}>Total</th>
                <th style={{ padding: "1rem" }}>Status</th>
                <th style={{ padding: "1rem" }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "1rem", fontWeight: 600 }}>{order.id.slice(0, 8)}...</td>
                  <td style={{ padding: "1rem", color: "var(--muted)" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "1rem", fontWeight: 700 }}>${Number(order.totalAmount || 0).toFixed(2)}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "100px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      background: order.status === "DELIVERED" ? "rgba(34, 197, 94, 0.1)" : "rgba(99, 102, 241, 0.1)",
                      color: order.status === "DELIVERED" ? "#22c55e" : "var(--primary)"
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <select 
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      style={{ 
                        padding: "0.5rem", 
                        borderRadius: "var(--radius)", 
                        background: "var(--secondary)", 
                        border: "1px solid var(--border)", 
                        color: "var(--foreground)",
                        cursor: "pointer"
                      }}
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
