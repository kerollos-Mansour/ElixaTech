"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cartUseCases } from "@/core";
import { Cart } from "@/core/domain/entities/Cart";
import { API_CONFIG } from "@/core/infrastructure/api/config";

const getImageUrl = API_CONFIG.getImageUrl;

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      const data = await cartUseCases.getCart();
      setCart(data);
    } catch (err: any) {
      setError(err.message || "Failed to load cart. Are you logged in?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      const updatedCart = await cartUseCases.updateQuantity(itemId, newQty);
      setCart(updatedCart);
    } catch (err: any) {
      alert(err.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await cartUseCases.removeFromCart(itemId);
      fetchCart(); // Refresh cart
    } catch (err: any) {
      alert(err.message || "Failed to remove item");
    }
  };

  if (loading) return <main style={{ padding: "8rem 1rem", textAlign: "center" }}>Loading your cart...</main>;

  if (error) return (
    <main style={{ padding: "8rem 1rem", textAlign: "center" }}>
      <h2 style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</h2>
      <Link href="/login">
        <button className="glass" style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none" }}>
          Login to see your cart
        </button>
      </Link>
    </main>
  );

  const items = cart?.items || [];

  return (
    <main>
      <div style={{ padding: "8rem 1rem 4rem", maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="glass" style={{ padding: "4rem", textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
            <h3>Your cart is empty</h3>
            <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>Looks like you haven't added anything yet.</p>
            <Link href="/products">
              <button style={{ padding: "1rem 2rem", borderRadius: "var(--radius)", background: "var(--primary)", color: "white", fontWeight: 600, border: "none", cursor: "pointer" }}>
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "2rem", alignItems: "start" }}>
            
            {/* Items List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {items.map((item) => (
                <div key={item.id} className="glass" style={{ display: "flex", gap: "1.5rem", padding: "1.5rem", alignItems: "center" }}>
                  <img 
                    src={getImageUrl(item.product.images || item.product.image || item.product.imageUrl)!} 
                    alt={item.product.name} 
                    style={{ width: "100px", height: "100px", borderRadius: "0.5rem", objectFit: "cover" }} 
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: "0.25rem" }}>{item.product.name}</h3>
                    <p style={{ color: "var(--primary)", fontWeight: 600, marginBottom: "0.5rem" }}>
                      ${Number(item.product.price).toFixed(2)}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", background: "var(--secondary)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          style={{ padding: "0.5rem 1rem", border: "none", background: "none", cursor: "pointer", color: "var(--foreground)" }}
                        >-</button>
                        <span style={{ padding: "0 1rem", fontWeight: 600 }}>{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          style={{ padding: "0.5rem 1rem", border: "none", background: "none", cursor: "pointer", color: "var(--foreground)" }}
                        >+</button>
                      </div>
                      <button 
                        onClick={() => handleRemove(item.id)}
                        style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 700, fontSize: "1.2rem" }}>
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Box */}
            <div className="glass" style={{ padding: "2rem", position: "sticky", top: "100px" }}>
              <h3 style={{ marginBottom: "1.5rem" }}>Order Summary</h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span style={{ color: "var(--muted)" }}>Subtotal</span>
                <span>${(cart?.totalAmount || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span style={{ color: "var(--muted)" }}>Shipping</span>
                <span style={{ color: "#22c55e" }}>Free</span>
              </div>
              <div style={{ height: "1px", background: "var(--border)", margin: "1.5rem 0" }}></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", fontSize: "1.5rem", fontWeight: 700 }}>
                <span>Total</span>
                <span>${(cart?.totalAmount || 0).toFixed(2)}</span>
              </div>
              <button style={{ 
                width: "100%", 
                padding: "1.25rem", 
                borderRadius: "var(--radius)", 
                background: "var(--primary)", 
                color: "white", 
                fontWeight: 700,
                fontSize: "1rem",
                boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)",
                cursor: "pointer",
                border: "none"
              }}>
                Proceed to Checkout
              </button>
              <Link href="/products" style={{ 
                display: "block", 
                textAlign: "center", 
                marginTop: "1.5rem", 
                color: "var(--muted)", 
                fontSize: "0.9rem" 
              }}>
                Continue Shopping
              </Link>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
