import Link from "next/link";
import { BoxIcon, FolderIcon, TruckIcon } from "@/components/Icons";

export default function AdminDashboard() {
  const items = [
    { title: "Manage Products", desc: "View, edit, or delete existing products. You can also add new products from there.", path: "/admin/products", icon: <BoxIcon size={48} color="var(--primary)" /> },
    { title: "Manage Categories", desc: "View, edit, or delete categories. You can also add new categories from there.", path: "/admin/categories", icon: <FolderIcon size={48} color="var(--primary)" /> },
    { title: "Manage Orders", desc: "View all user orders and update their shipping and delivery statuses.", path: "/admin/orders", icon: <TruckIcon size={48} color="var(--primary)" /> },
  ];

  return (
    <main style={{ padding: "8rem 1rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "4rem", fontSize: "3rem", fontWeight: 800 }}>Admin Management</h1>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "2rem" 
      }}>
        {items.map((item, i) => (
          <Link key={i} href={item.path} className="glass" style={{ 
            padding: "3rem 2rem", 
            textAlign: "center", 
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem"
          }}>
            <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>{item.title}</h3>
            <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{item.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
