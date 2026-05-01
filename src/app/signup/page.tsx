"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupUseCase } from "@/core";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "CUSTOMER"
  });
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error", message?: string }>({ type: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });

    try {
      await signupUseCase.execute(formData);
      setStatus({ type: "success", message: "Account created! Redirecting to OTP verification..." });
      setTimeout(() => router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`), 1500);
    } catch (error: any) {
      setStatus({ type: "error", message: error.message || "Registration failed" });
    }
  };

  return (
    <main>
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 1rem 2rem",
      }}>
        <div className="glass animate-fade-in" style={{
          width: "100%",
          maxWidth: "450px",
          padding: "3rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Create Account</h1>
            <p style={{ color: "var(--muted)" }}>Join Easy Store and start your shopping journey today.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {status.message && (
              <div style={{ 
                padding: "0.75rem", 
                borderRadius: "var(--radius)", 
                fontSize: "0.85rem",
                textAlign: "center",
                background: status.type === "error" ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                color: status.type === "error" ? "#ef4444" : "#22c55e",
                border: `1px solid ${status.type === "error" ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)"}`
              }}>
                {status.message}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--muted)" }}>Full Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.fullName}
                disabled={status.type === "loading"}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                style={{
                  padding: "0.8rem 1rem",
                  borderRadius: "var(--radius)",
                  background: "var(--secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  fontSize: "1rem",
                  outline: "none",
                  opacity: status.type === "loading" ? 0.6 : 1
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--muted)" }}>Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                disabled={status.type === "loading"}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  padding: "0.8rem 1rem",
                  borderRadius: "var(--radius)",
                  background: "var(--secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  fontSize: "1rem",
                  outline: "none",
                  opacity: status.type === "loading" ? 0.6 : 1
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--muted)" }}>Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+1 234 567 890"
                value={formData.phoneNumber}
                disabled={status.type === "loading"}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                style={{
                  padding: "0.8rem 1rem",
                  borderRadius: "var(--radius)",
                  background: "var(--secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  fontSize: "1rem",
                  outline: "none",
                  opacity: status.type === "loading" ? 0.6 : 1
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--muted)" }}>Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                disabled={status.type === "loading"}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{
                  padding: "0.8rem 1rem",
                  borderRadius: "var(--radius)",
                  background: "var(--secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  fontSize: "1rem",
                  outline: "none",
                  opacity: status.type === "loading" ? 0.6 : 1
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={status.type === "loading"}
              style={{
                marginTop: "1rem",
                padding: "1rem",
                borderRadius: "var(--radius)",
                background: "var(--primary)",
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)",
                opacity: status.type === "loading" ? 0.7 : 1,
                cursor: status.type === "loading" ? "not-allowed" : "pointer"
              }}
            >
              {status.type === "loading" ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem", color: "var(--muted)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
