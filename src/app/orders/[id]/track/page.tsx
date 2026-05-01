"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { orderUseCases } from "@/core";

// SVG Icons
const PendingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

const ProcessingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);

const ShippedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
);

const DeliveredIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

export default function TrackOrderPage() {
  const { id } = useParams();
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async () => {
    if (!id) return;
    try {
      const data = await orderUseCases.trackOrder(id as string);
      setTrackingData(data);
    } catch (err: any) {
      setError(err.message || "Failed to track order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, [id]);

  if (loading) return <main style={{ padding: "8rem 1rem", textAlign: "center" }}>Loading tracking info...</main>;
  if (error) return <main style={{ padding: "8rem 1rem", textAlign: "center", color: "#ef4444" }}>{error}</main>;

  const status = trackingData?.status || "UNKNOWN";
  
  const steps = [
    { name: "PENDING", icon: <PendingIcon />, label: "Order Placed" },
    { name: "PROCESSING", icon: <ProcessingIcon />, label: "Processing" },
    { name: "SHIPPED", icon: <ShippedIcon />, label: "Shipped" },
    { name: "DELIVERED", icon: <DeliveredIcon />, label: "Delivered" }
  ];
  
  const statusNames = steps.map(s => s.name);
  const currentStepIndex = statusNames.indexOf(status);

  return (
    <main className="animate-fade-in">
      <div style={{ padding: "8rem 1rem 4rem", maxWidth: "900px", margin: "0 auto" }}>
        <Link href="/orders" style={{ color: "var(--primary)", textDecoration: "none", marginBottom: "2rem", display: "inline-block", fontWeight: 600 }}>
          ← Back to Orders
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Track Order</h1>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>Order ID: {id}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Total Amount</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)" }}>${Number(trackingData?.totalAmount || 0).toFixed(2)}</p>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="glass" style={{ padding: "3rem 2rem", position: "relative", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            {steps.map((step, index) => {
              const isCompleted = currentStepIndex >= 0 && index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, zIndex: 2 }}>
                  <div style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: isCompleted ? "var(--primary)" : "var(--secondary)",
                    border: isCompleted ? "none" : "2px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isCompleted ? "white" : "var(--muted)",
                    marginBottom: "1rem",
                    boxShadow: isCurrent ? "0 0 0 6px rgba(99, 102, 241, 0.2)" : (isCompleted ? "0 4px 10px rgba(99, 102, 241, 0.3)" : "none"),
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: isCurrent ? "scale(1.1)" : "scale(1)"
                  }}>
                    {step.icon}
                  </div>
                  <span style={{ 
                    fontWeight: isCompleted ? 700 : 500, 
                    color: isCompleted ? "var(--foreground)" : "var(--muted)", 
                    fontSize: "0.95rem",
                    textAlign: "center"
                  }}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Progress Bar Background */}
          <div style={{ position: "absolute", top: "4.7rem", left: "12%", right: "12%", height: "4px", background: "var(--secondary)", zIndex: 0, borderRadius: "2px" }}>
            <div style={{ 
              height: "100%", 
              background: "var(--primary)", 
              width: currentStepIndex >= 0 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : "0%",
              transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: "2px",
              boxShadow: "0 0 10px rgba(99, 102, 241, 0.5)"
            }} />
          </div>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          
          {/* Order Info */}
          <div className="glass" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              📄 Order Summary
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Date Placed</span>
                <span style={{ fontWeight: 600 }}>{trackingData?.createdAt ? new Date(trackingData.createdAt).toLocaleDateString() : "N/A"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Payment Method</span>
                <span style={{ fontWeight: 600 }}>{trackingData?.paymentMethod?.replace(/_/g, " ")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Payment Status</span>
                <span style={{ 
                  fontWeight: 700, 
                  color: trackingData?.paymentStatus === "COMPLETED" ? "#22c55e" : "#fbbf24",
                  background: trackingData?.paymentStatus === "COMPLETED" ? "rgba(34, 197, 94, 0.1)" : "rgba(251, 191, 36, 0.1)",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "100px",
                  fontSize: "0.8rem"
                }}>
                  {trackingData?.paymentStatus || "PENDING"}
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
                  {trackingData?.address?.addressDetails || "No address provided"}
                </p>
              </div>
              <div>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Contact Number</p>
                <p style={{ fontWeight: 600 }}>
                  {trackingData?.contactNumber || trackingData?.address?.phoneNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Items List */}
        {trackingData?.items && trackingData.items.length > 0 && (
          <div className="glass" style={{ padding: "2rem", marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Items Ordered</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {trackingData.items.map((item: any) => (
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
