"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { orderUseCases } from "@/core";

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
  
  const steps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentStepIndex = steps.indexOf(status);

  return (
    <main className="animate-fade-in">
      <div style={{ padding: "8rem 1rem 4rem", maxWidth: "800px", margin: "0 auto" }}>
        <Link href="/orders" style={{ color: "var(--primary)", textDecoration: "none", marginBottom: "2rem", display: "inline-block", fontWeight: 600 }}>
          ← Back to Orders
        </Link>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Track Order</h1>
        <p style={{ color: "var(--muted)", marginBottom: "3rem" }}>Order ID: {id}</p>

        <div className="glass" style={{ padding: "3rem 2rem", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: isCompleted ? "var(--primary)" : "var(--secondary)",
                    border: isCompleted ? "none" : "2px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isCompleted ? "white" : "var(--muted)",
                    fontWeight: 700,
                    marginBottom: "1rem",
                    boxShadow: isCurrent ? "0 0 0 4px rgba(99, 102, 241, 0.2)" : "none",
                    transition: "all 0.3s"
                  }}>
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  <span style={{ fontWeight: isCompleted ? 700 : 500, color: isCompleted ? "var(--foreground)" : "var(--muted)", fontSize: "0.9rem" }}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Progress Bar Background */}
          <div style={{ position: "absolute", top: "4.2rem", left: "10%", right: "10%", height: "4px", background: "var(--secondary)", zIndex: 0 }}>
            <div style={{ 
              height: "100%", 
              background: "var(--primary)", 
              width: currentStepIndex >= 0 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : "0%",
              transition: "width 0.5s ease-in-out"
            }} />
          </div>
        </div>
        
        <div className="glass" style={{ padding: "2rem", marginTop: "2rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Tracking Details</h3>
          <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
            {JSON.stringify(trackingData, null, 2)}
          </p>
        </div>
      </div>
    </main>
  );
}
