import Link from "next/link";

export default function Navbar() {
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
        <Link href="/products" style={{ fontWeight: 500, fontSize: "0.95rem" }}>Products</Link>
        <Link href="/admin/create-category" style={{ fontWeight: 500, fontSize: "0.85rem", color: "var(--muted)" }}>+ Category</Link>
        <Link href="/admin/create-product" style={{ fontWeight: 500, fontSize: "0.85rem", color: "var(--muted)" }}>+ Product</Link>
        <Link href="/login" style={{ fontWeight: 500, fontSize: "0.95rem" }}>Login</Link>
        <Link href="/signup">
          <button className="glass" style={{ 
            padding: "0.6rem 1.5rem", 
            fontWeight: 600, 
            fontSize: "0.9rem",
            background: "var(--primary)",
            color: "white",
            border: "none"
          }}>
            Get Started
          </button>
        </Link>
      </div>
    </nav>
  );
}
