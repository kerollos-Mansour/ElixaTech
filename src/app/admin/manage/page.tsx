import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main style={{ padding: "8rem 1rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "4rem", fontSize: "3rem" }}>Admin Management</h1>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "2rem" 
      }}>
        {[
          { title: "Manage Products", desc: "View, edit, or delete existing products. You can also add new products from there.", path: "/admin/products", icon: "📦" },
          { title: "Manage Categories", desc: "View, edit, or delete categories. You can also add new categories from there.", path: "/admin/categories", icon: "📁" },
        ].map((item, i) => (
          <Link key={i} href={item.path} className="glass" style={{ padding: "3rem 2rem", textAlign: "center", transition: "transform 0.2s" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{item.icon}</div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{item.title}</h3>
            <p style={{ color: "var(--muted)" }}>{item.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
