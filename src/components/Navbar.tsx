"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useFavorite } from "@/context/FavoriteContext";
import { useEffect, useState } from "react";
import { HeartIcon, CartIcon, OrdersIcon, ProfileIcon, ManageIcon } from "./Icons";

export default function Navbar() {
  const { cartCount } = useCart();
  const { favCount } = useFavorite();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setIsLoggedIn(true);
      const role = localStorage.getItem("user_role");
      if (role === "ADMIN") {
        setIsAdmin(true);
      } else {
        // Fallback to decode if role is not in localStorage yet
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.role === 'ADMIN' || payload.role === 'admin' || payload.Role === 'ADMIN') {
            setIsAdmin(true);
          }
        } catch (e) {
          console.error("Failed to decode token", e);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = "/login"; // Redirect to login page
  };

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
          <HeartIcon size={18} /> Favorites
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
          <CartIcon size={18} /> Cart
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
          <OrdersIcon size={18} /> Orders
        </Link>
        <Link href="/profile" className="nav-link-item" style={{ fontWeight: 500, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <ProfileIcon size={18} /> Profile
        </Link>

        {isAdmin && (
          <Link href="/admin/manage" style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <ManageIcon size={18} /> Manage
          </Link>
        )}
        
        {!isLoggedIn ? (
          <>
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
          </>
        ) : (
          <button 
            onClick={handleLogout} 
            style={{ 
              fontWeight: 600, 
              fontSize: "0.95rem", 
              background: "transparent", 
              border: "none", 
              color: "#ef4444", 
              cursor: "pointer",
              padding: "0.5rem"
            }}
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}
