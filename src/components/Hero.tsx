export default function Hero() {
  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "8rem 1rem 4rem",
      position: "relative",
      overflow: "hidden"
    }}>
      <div className="animate-fade-in" style={{ maxWidth: "800px" }}>
        <span style={{ 
          display: "inline-block", 
          padding: "0.5rem 1rem", 
          borderRadius: "100px", 
          background: "rgba(99, 102, 241, 0.1)", 
          color: "var(--primary)",
          fontSize: "0.85rem",
          fontWeight: 600,
          marginBottom: "1.5rem",
          border: "1px solid rgba(99, 102, 241, 0.2)"
        }}>
          Premium Shopping Experience
        </span>
        
        <h1 style={{ fontSize: "clamp(3rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
          Quality Products with <span style={{ background: "linear-gradient(to right, var(--primary), var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Precision</span>
        </h1>
        
        <p style={{ fontSize: "1.25rem", color: "var(--muted)", marginBottom: "3rem", lineHeight: "1.6" }}>
          Join thousands of customers who enjoy the best products from our 
          curated collection. Premium quality, beautifully delivered.
        </p>
        
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button style={{ 
            padding: "1rem 2.5rem", 
            borderRadius: "var(--radius)", 
            background: "var(--primary)", 
            color: "white", 
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.4)"
          }}>
            Shop Now
          </button>
          <button className="glass" style={{ 
            padding: "1rem 2.5rem", 
            borderRadius: "var(--radius)", 
            fontWeight: 600,
            fontSize: "1rem"
          }}>
            View Trends
          </button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "10%",
        width: "300px",
        height: "300px",
        background: "var(--primary)",
        filter: "blur(150px)",
        opacity: 0.15,
        zIndex: -1,
        borderRadius: "50%"
      }}></div>
      <div style={{
        position: "absolute",
        bottom: "20%",
        right: "10%",
        width: "300px",
        height: "300px",
        background: "var(--accent)",
        filter: "blur(150px)",
        opacity: 0.15,
        zIndex: -1,
        borderRadius: "50%"
      }}></div>
    </section>
  );
}
