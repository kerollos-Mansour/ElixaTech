"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtpUseCase } from "@/core";

function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is missing. Please sign up again.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await verifyOtpUseCase.execute(email, otp);
      // On success, token is saved and we can redirect
      // We can force a hard refresh to / so navbar updates immediately, or just router.push
      window.location.href = "/"; 
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email is missing.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await verifyOtpUseCase.resend(email);
      setMessage("A new OTP has been sent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "8rem 1rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem", textAlign: "center" }}>Verify Your Email</h1>
      <p style={{ textAlign: "center", color: "var(--muted)", marginBottom: "2rem" }}>
        We sent an OTP to <strong>{email}</strong>
      </p>

      {error && <div style={{ color: "#ef4444", marginBottom: "1rem", textAlign: "center", background: "rgba(239, 68, 68, 0.1)", padding: "0.5rem", borderRadius: "var(--radius)" }}>{error}</div>}
      {message && <div style={{ color: "#22c55e", marginBottom: "1rem", textAlign: "center", background: "rgba(34, 197, 94, 0.1)", padding: "0.5rem", borderRadius: "var(--radius)" }}>{message}</div>}

      <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input 
          type="text" 
          placeholder="Enter OTP code" 
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          style={{ padding: "0.8rem", borderRadius: "var(--radius)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}
        />
        <button 
          type="submit" 
          disabled={loading || !otp}
          style={{ padding: "0.8rem", borderRadius: "var(--radius)", background: "var(--primary)", color: "white", fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Didn't receive the code?</p>
        <button 
          onClick={handleResend}
          disabled={loading}
          style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginTop: "0.5rem" }}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <main className="animate-fade-in">
      <Suspense fallback={<div style={{ textAlign: "center", padding: "8rem" }}>Loading...</div>}>
        <VerifyOTPForm />
      </Suspense>
    </main>
  );
}
