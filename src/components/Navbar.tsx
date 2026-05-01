"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useFavorite } from "@/context/FavoriteContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const { favCount } = useFavorite();

  return (
    <nav className="glass" style={{
      position: "fixed",
      top: "1.5rem",
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(90%, 1200px)",
      height: "4.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 2rem",
      zIndex: 1000,
    }}>
      <Link href="/" style={{ fontSize: "1.5rem", fontWeight: 700, background: "linear-gradient(to right, var(--primary), var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        Easy Store
      </Link>
      
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <Link href="/products" className="nav-link-item" style={{ fontWeight: 500, fontSize: "0.95rem" }}>Products</Link>
        
        <Link href="/favorites" className="nav-link-item" style={{ fontWeight: 500, fontSize: "0.95rem", position: "relative", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          ❤️ Favorites
          {favCount > 0 && (
            <span style={{
              background: "#ef4444",
              color: "white",
              fontSize: "0.65rem",
              minWidth: "18px",
              height: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              fontWeight: 700,
              boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.4)",
              marginLeft: "-2px",
              marginTop: "-10px"
            }}>
              {favCount}
            </span>
          )}
        </Link>
        
        <Link href="/cart" className="nav-link-item" style={{ fontWeight: 500, fontSize: "0.95rem", position: "relative", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          🛒 Cart
          {cartCount > 0 && (
            <span style={{
              background: "var(--primary)",
              color: "white",
              fontSize: "0.65rem",
              minWidth: "18px",
              height: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              fontWeight: 700,
              boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.4)",
              marginLeft: "-2px",
              marginTop: "-10px"
            }}>
              {cartCount}
            </span>
          )}
        </Link>

        <Link href="/orders" className="nav-link-item" style={{ fontWeight: 500, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          📦 Orders
        </Link>
        <Link href="/profile" className="nav-link-item" style={{ fontWeight: 500, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          👤 Profile
        </Link>

        <Link href="/admin/manage" style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--primary)" }}>⚙️ Manage</Link>
        <Link href="/login" style={{ fontWeight: 500, fontSize: "0.95rem" }}>Login</Link>
        <Link href="/signup">
          <button className="nav-link" style={{ 
            padding: "0.6rem 1.5rem", 
            fontWeight: 600, 
            fontSize: "0.9rem",
            background: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius)"
          }}>
            Get Started
          </button>
        </Link>
      </div>
    </nav>
  );
}
