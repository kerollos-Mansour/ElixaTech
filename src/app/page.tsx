import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
      
      {/* Features Section */}
      <section style={{ 
        padding: "8rem 1rem", 
        maxWidth: "1200px", 
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "2rem"
      }}>
        {[
          { title: "Premium Quality", desc: "We source only the finest products from industry-leading manufacturers." },
          { title: "Fast Delivery", desc: "Get your orders delivered to your doorstep with our express shipping service." },
          { title: "Customer Support", desc: "Our dedicated support team is available 24/7 to help with your inquiries." }
        ].map((feature, i) => (
          <div key={i} className="glass animate-fade-in card-hover" style={{ padding: "3rem 2rem", animationDelay: `${(i + 3) * 100}ms` }}>
            <div style={{ 
              width: "3rem", 
              height: "3rem", 
              borderRadius: "1rem", 
              background: "var(--primary)", 
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700
            }}>
              {i + 1}
            </div>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>{feature.title}</h3>
            <p style={{ color: "var(--muted)" }}>{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: "4rem 1rem", 
        textAlign: "center", 
        borderTop: "1px solid var(--border)",
        color: "var(--muted)",
        fontSize: "0.9rem"
      }}>
        <p>&copy; {new Date().getFullYear()} Easy Store. All rights reserved.</p>
      </footer>
    </main>
  );
}
