"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cartUseCases, getProductsUseCase } from "@/core";
import { Cart } from "@/core/domain/entities/Cart";
import { API_CONFIG } from "@/core/infrastructure/api/config";
import { useToast } from "@/components/Toast";
import { useCart } from "@/context/CartContext";

const getImageUrl = API_CONFIG.getImageUrl;

// Realistic Icons (SVG)
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 0h6"/></svg>
);
const ClearIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);

export default function CartPage() {
  const { showToast } = useToast();
  const { refreshCartCount } = useCart();
  const [cart, setCart] = useState<Cart | null>(null);
  const [productImages, setProductImages] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      const cartData = await cartUseCases.getCart() as any;
      const finalCart = cartData?.data || cartData;
      setCart(finalCart);

      if (finalCart?.items?.length > 0) {
        const allProducts = await getProductsUseCase.execute();
        const imageMap: Record<string, any> = {};
        allProducts.forEach(p => {
          imageMap[p.id] = p.images || p.image || p.imageUrl;
        });
        setProductImages(imageMap);
      }
      
      // Update global count
      refreshCartCount();
    } catch (err: any) {
      setError(err.message || "Failed to load cart.");
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
      await cartUseCases.updateQuantity(itemId, newQty);
      await fetchCart();
      showToast("Quantity updated", "success");
    } catch (err: any) {
      showToast(err.message || "Update failed", "error");
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await cartUseCases.removeFromCart(itemId);
      await fetchCart();
      showToast("Item removed from cart", "info");
    } catch (err: any) {
      showToast(err.message || "Removal failed", "error");
    }
  };

  const handleClear = async () => {
    if (!confirm("Are you sure you want to clear your entire cart?")) return;
    try {
      await cartUseCases.clearCart();
      setCart({ items: [], totalAmount: 0 });
      refreshCartCount();
      showToast("Cart cleared", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to clear cart", "error");
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem" }}>Shopping Cart</h1>
          {items.length > 0 && (
            <button onClick={handleClear} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600 }}>
              <ClearIcon /> Clear Cart
            </button>
          )}
        </div>

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
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {items.map((item) => {
                const imgData = productImages[item.productId] || item.product.images || item.product.image || item.product.imageUrl;

                return (
                  <div key={item.id} className="glass animate-fade-in" style={{ display: "flex", gap: "1.5rem", padding: "1.5rem", alignItems: "center" }}>
                    <Link href={`/products/${item.productId}`}>
                      <img 
                        src={getImageUrl(imgData) || "https://placehold.co/400x400/1e1e1e/ffffff?text=Product"} 
                        alt={item.product.name} 
                        style={{ width: "100px", height: "100px", borderRadius: "0.5rem", objectFit: "cover", background: "var(--secondary)", cursor: "pointer" }} 
                      />
                    </Link>
                    <div style={{ flex: 1 }}>
                      <Link href={`/products/${item.productId}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <h3 style={{ marginBottom: "0.25rem", cursor: "pointer" }}>{item.product.name}</h3>
                      </Link>
                      <p style={{ color: "var(--primary)", fontWeight: 600, marginBottom: "0.5rem" }}>
                        ${Number(item.product.price).toFixed(2)}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", background: "var(--secondary)", borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)" }}>
                          <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="qty-btn" style={{ padding: "0.5rem 1rem", border: "none", background: "none", cursor: "pointer", color: "var(--foreground)", transition: "all 0.2s" }}>-</button>
                          <span style={{ padding: "0 1rem", fontWeight: 600, borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>{item.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="qty-btn" style={{ padding: "0.5rem 1rem", border: "none", background: "none", cursor: "pointer", color: "var(--foreground)", transition: "all 0.2s" }}>+</button>
                        </div>
                        <button onClick={() => handleRemove(item.id)} style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>
                          <TrashIcon /> Remove
                        </button>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: 700, fontSize: "1.2rem" }}>${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

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
              <button style={{ width: "100%", padding: "1.25rem", borderRadius: "var(--radius)", background: "var(--primary)", color: "white", fontWeight: 700, fontSize: "1rem", boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)", cursor: "pointer", border: "none" }}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
