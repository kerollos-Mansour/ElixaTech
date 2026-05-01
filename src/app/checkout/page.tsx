"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { orderUseCases, cartUseCases } from "@/core";
import { useToast } from "@/components/Toast";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { refreshCartCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contactNumber: "",
    paymentMethod: "CASH_ON_DELIVERY",
    addressId: "00000000-0000-0000-0000-000000000000" // Mocked for simplicity, assuming a generic address or a default one exists
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // First, create the order
      const order = await orderUseCases.createOrder(formData);
      
      // Then, clear the cart to simulate successful checkout
      await cartUseCases.clearCart();
      await refreshCartCount();
      
      showToast("Order placed successfully!", "success");
      router.push(`/orders/${order.id}/track`);
    } catch (err: any) {
      showToast(err.message || "Failed to place order.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="animate-fade-in">
      <div style={{ padding: "8rem 1rem 4rem", maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", textAlign: "center" }}>Checkout</h1>

        <div className="glass" style={{ padding: "3rem 2rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Contact Number</label>
              <input 
                type="text" 
                required 
                placeholder="+1234567890"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                style={{ width: "100%", padding: "1rem", borderRadius: "var(--radius)", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Payment Method</label>
              <select 
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                style={{ width: "100%", padding: "1rem", borderRadius: "var(--radius)", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              >
                <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                <option value="CREDIT_CARD">Credit Card</option>
              </select>
            </div>

            <div style={{ marginTop: "1rem", padding: "1rem", background: "rgba(99, 102, 241, 0.1)", borderRadius: "var(--radius)", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
              <p style={{ fontSize: "0.9rem", color: "var(--primary)" }}>
                Note: A default shipping address will be used for this demonstration.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ padding: "1.25rem", marginTop: "1rem", borderRadius: "var(--radius)", background: "var(--primary)", color: "white", fontWeight: 700, fontSize: "1.1rem", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Placing Order..." : "Confirm & Place Order"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
