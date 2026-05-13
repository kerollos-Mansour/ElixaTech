"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProductsUseCase, filterProductsUseCase, categoryRepository, getMeUseCase, cartUseCases, favoriteUseCases } from "@/core";
import { Product } from "@/core/domain/entities/Product";
import { Category } from "@/core/domain/repositories/ICategoryRepository";
import { SearchIcon, HeartIcon, ShoppingBagIcon, UserIcon, ArrowRightIcon, PlusIcon } from "@/components/Icons";
import { API_CONFIG } from "@/core/infrastructure/api/config";

export default function Home() {
  const [hottestProduct, setHottestProduct] = useState<Product | null>(null);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
        const [hottest, popular, newItems, cats, all, userData] = await Promise.all([
          filterProductsUseCase.execute("hottest"),
          filterProductsUseCase.execute("popular"),
          filterProductsUseCase.execute("new"),
          categoryRepository.getAllCategories(),
          getProductsUseCase.execute(),
          token ? getMeUseCase.execute().catch(() => null) : Promise.resolve(null)
        ]);

        const heroProduct = hottest[0] || null;
        setHottestProduct(heroProduct);

        // Filter out the hero product from other lists to ensure variety
        const otherPopular = popular.filter(p => p.id !== heroProduct?.id);
        setPopularProducts(otherPopular);

        const otherNew = newItems.filter(p => 
          p.id !== heroProduct?.id && 
          !otherPopular.find(op => op.id === p.id)
        );
        setNewArrivals(otherNew);

        const otherAll = all.filter(p => 
          p.id !== heroProduct?.id && 
          !otherPopular.find(op => op.id === p.id) &&
          !otherNew.find(on => on.id === p.id)
        );
        // Fallback: If no products left after filtering, show all products to avoid empty section
        setAllProducts(otherAll.length > 0 ? otherAll : all);
        
        setCategories(cats);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
        <div className="animate-float" style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--primary)" }}>Crafting your experience...</div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "var(--background)" }}>
      {/* Background Auras for depth */}
      <div className="aura" style={{ top: "-10%", left: "-10%", background: "var(--primary)" }}></div>
      <div className="aura" style={{ bottom: "-10%", right: "-10%", background: "var(--accent)", animationDelay: "-5s" }}></div>
      
      {/* Top Announcement Bar */}
      <div className="marquee-container">
        <div className="marquee-content">
          <span>FREE SHIPPING ON ALL ORDERS OVER $200 • NEW SUMMER COLLECTION IS HERE • SAVE UP TO 50% ON SELECTED ELECTRONICS • JOIN OUR LOYALTY PROGRAM FOR EXCLUSIVE REWARDS • </span>
          <span>FREE SHIPPING ON ALL ORDERS OVER $200 • NEW SUMMER COLLECTION IS HERE • SAVE UP TO 50% ON SELECTED ELECTRONICS • JOIN OUR LOYALTY PROGRAM FOR EXCLUSIVE REWARDS • </span>
        </div>
      </div>

      <div style={{ padding: "1.5rem" }}>
        {/* Main Dashboard Container */}
        <div className="glass" style={{ 
          maxWidth: "1600px", 
          margin: "0 auto", 
          minHeight: "calc(100vh - 8rem)", 
          display: "flex", 
          flexDirection: "column",
          borderRadius: "2.5rem",
          boxShadow: "0 40px 100px -20px rgba(0,0,0,0.05)",
          background: "var(--card)",
          padding: "2rem",
          border: "1px solid var(--border)",
          position: "relative",
          zIndex: 1
        }}>
          
          {/* Top Header Bar */}
          <header style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 2fr 1fr", 
            alignItems: "center", 
            marginBottom: "2.5rem",
            padding: "0 1rem"
          }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "32px", height: "32px", background: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>E</div>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.5px" }}>ElixaTech</span>
            </div>

            {/* Search Bar */}
            <div style={{ position: "relative", maxWidth: "500px", margin: "0 auto", width: "100%" }}>
              <input 
                type="text" 
                placeholder="Search products, brands and more..." 
                style={{ 
                  width: "100%", 
                  padding: "0.8rem 1.5rem 0.8rem 3rem", 
                  borderRadius: "100px", 
                  background: "var(--secondary)", 
                  border: "1px solid var(--border)",
                  fontSize: "0.95rem",
                  outline: "none",
                  color: "var(--foreground)"
                }}
              />
              <div style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>
                <SearchIcon size={18} />
              </div>
              <div style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)" }}>
                <button style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <SearchIcon size={14} />
                </button>
              </div>
            </div>

            {/* Action Icons */}
            <div style={{ display: "flex", gap: "1.2rem", justifyContent: "flex-end", alignItems: "center" }}>
              <Link href="/favorites" className="card-hover">
                <div style={{ position: "relative", padding: "0.5rem", color: "var(--foreground)" }}>
                  <HeartIcon size={22} />
                </div>
              </Link>
              <Link href="/cart" className="card-hover">
                <div style={{ position: "relative", padding: "0.5rem", color: "var(--foreground)" }}>
                  <ShoppingBagIcon size={22} />
                  <span style={{ position: "absolute", top: 0, right: 0, width: "8px", height: "8px", background: "var(--accent)", borderRadius: "50%", border: "2px solid var(--card)" }}></span>
                </div>
              </Link>
              <Link href="/profile" style={{ display: "flex", alignItems: "center", marginLeft: "0.5rem" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)" }}>{user?.fullName?.split(" ")[0] || "Guest"}</span>
              </Link>
            </div>
          </header>

          {/* Hero Grid Section */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(12, 1fr)", 
            gap: "1.5rem",
            flex: 1
          }}>
            
            {/* Main Hero Card */}
            <section className="animate-fade-in" style={{ 
              gridColumn: "span 8", 
              gridRow: "span 2",
              background: "linear-gradient(135deg, var(--card) 0%, var(--secondary) 100%)",
              borderRadius: "var(--radius)",
              padding: "3rem",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: "1px solid var(--border)"
            }}>
              <div style={{ position: "relative", zIndex: 2, maxWidth: "60%" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
                  Featured Product
                </span>
                <h1 style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1.1, marginBottom: "1.5rem" }}>
                  {hottestProduct?.name || "Premium Sound Experience"}
                </h1>
                <p style={{ color: "var(--muted)", fontSize: "1.1rem", marginBottom: "2.5rem", lineHeight: 1.6 }}>
                  {hottestProduct?.description?.slice(0, 100) || "Discover the next generation of audio technology with our curated collection."}...
                </p>
                <Link href={`/products/${hottestProduct?.id || ""}`}>
                  <button style={{ 
                    padding: "1rem 2.5rem", 
                    borderRadius: "100px", 
                    background: "var(--primary)", 
                    color: "white", 
                    fontWeight: 700, 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "1rem",
                    boxShadow: "0 15px 30px -5px rgba(99, 102, 241, 0.4)"
                  }} className="card-hover">
                    View All Products <ArrowRightIcon size={20} />
                  </button>
                </Link>
              </div>
              
              {/* Hero Image & Animations */}
              <div style={{ 
                position: "absolute", 
                right: "0", 
                top: "50%", 
                transform: "translateY(-50%)", 
                width: "45%", 
                height: "80%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {/* Pulse Rings */}
                <div className="pulse-ring" style={{ animationDelay: "0s" }}></div>
                <div className="pulse-ring" style={{ animationDelay: "1s" }}></div>
                <div className="pulse-ring" style={{ animationDelay: "2s" }}></div>

                {/* Floating Tech Badges */}
                <div className="floating-badge" style={{ top: "10%", left: "-10%", animationDelay: "0s" }}>
                  <span style={{ color: "var(--primary)" }}>⚡</span> 5G Ready
                </div>
                <div className="floating-badge" style={{ bottom: "20%", left: "-20%", animationDelay: "1s" }}>
                  <span style={{ color: "#ef4444" }}>🔥</span> 120Hz Display
                </div>
                <div className="floating-badge" style={{ top: "30%", right: "0%", animationDelay: "2s" }}>
                  <span style={{ color: "#f59e0b" }}>🔋</span> Fast Charging
                </div>

                <div className="animate-float" style={{ 
                  width: "100%", 
                  height: "100%",
                  backgroundImage: `url(${API_CONFIG.getImageUrl(hottestProduct?.images) || "/ecommerce_hero_banner_1777628591565.png"})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.1))",
                  position: "relative",
                  zIndex: 2
                }} />
              </div>
            </section>

            {/* Right Top Card - Popular Choices */}
            <aside className="animate-fade-in delay-100" style={{ 
              gridColumn: "span 4", 
              background: "var(--secondary)",
              borderRadius: "var(--radius)",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid var(--border)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Popular Choices</h3>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{ width: "12px", height: "12px", background: "var(--primary)", borderRadius: "50%" }}></div>
                  <div style={{ width: "12px", height: "12px", background: "#ef4444", borderRadius: "50%" }}></div>
                  <div style={{ width: "12px", height: "12px", background: "#f59e0b", borderRadius: "50%" }}></div>
                  <div style={{ width: "12px", height: "12px", background: "#10b981", borderRadius: "50%" }}></div>
                </div>
              </div>
              
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                <img src={API_CONFIG.getImageUrl(popularProducts[0]?.images) || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop"} alt="Product" style={{ maxWidth: "80%", maxHeight: "150px", objectFit: "contain", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700 }}>{popularProducts[0]?.name || "New Arrival"}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{popularProducts[0]?.price ? `$${popularProducts[0].price}` : "Premium"}</p>
                </div>
                <button style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                  <PlusIcon size={16} />
                </button>
              </div>
            </aside>

            {/* Right Bottom Card - Promotion */}
            <aside className="animate-fade-in delay-200" style={{ 
              gridColumn: "span 4", 
              background: "var(--card)",
              borderRadius: "var(--radius)",
              padding: "2rem",
              position: "relative",
              overflow: "hidden",
              border: "1px solid var(--border)",
              display: "flex",
              gap: "1.5rem"
            }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem" }}>New Gen <br /> {newArrivals[0]?.name?.split(" ")[0] || "Products"}</h3>
                <Link href="/products" style={{ color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", fontWeight: 600 }}>
                  Explore Now <ArrowRightIcon size={14} />
                </Link>
              </div>
              <div style={{ width: "40%", display: "flex", alignItems: "center" }}>
                 <img src={API_CONFIG.getImageUrl(newArrivals[0]?.images) || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop"} alt="Product" style={{ width: "100%", objectFit: "contain", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))" }} />
              </div>
            </aside>

          </div>

          {/* Bottom Row - More Products & Stats */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(12, 1fr)", 
            gap: "1.5rem",
            marginTop: "1.5rem"
          }}>
            
            {/* More Products List */}
            <section style={{ 
              gridColumn: "span 4", 
              background: "var(--card)",
              borderRadius: "var(--radius)",
              padding: "2rem",
              border: "1px solid var(--border)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontWeight: 700 }}>Trending Today</h3>
                <Link href="/products" style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600 }}>View All</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {allProducts.slice(0, 3).map(product => (
                  <div key={product.id} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{ width: "60px", height: "60px", background: "var(--secondary)", borderRadius: "12px", overflow: "hidden", padding: "0.5rem" }}>
                      <img src={API_CONFIG.getImageUrl(product.images) || "/placeholder.jpg"} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700 }}>{product.name}</p>
                      <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>${product.price}</p>
                    </div>
                    <HeartIcon size={16} color="var(--muted)" />
                  </div>
                ))}
              </div>
            </section>

            {/* Highlights Section */}
            <section style={{ 
              gridColumn: "span 4", 
              background: "var(--primary)",
              borderRadius: "var(--radius)",
              padding: "2rem",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.4)"
            }}>
              <div style={{ display: "flex", gap: "-10px" }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid var(--primary)", background: "white", overflow: "hidden", marginLeft: i > 1 ? "-12px" : 0 }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <div>
                <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>50k+</h2>
                <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>Happy customers worldwide sharing their experiences.</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", fontWeight: 700 }}>
                4.8 Ratings <div style={{ display: "flex", gap: "2px" }}>{"★".repeat(5)}</div>
              </div>
            </section>

            {/* Flash Sale Card */}
            <section style={{ 
              gridColumn: "span 4", 
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
              borderRadius: "var(--radius)",
              padding: "2rem",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", position: "relative", zIndex: 1 }}>
                  <span style={{ padding: "0.4rem 1rem", background: "#f59e0b", color: "#451a03", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 800 }}>FLASH SALE</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.8 }}>ENDS IN:</span>
               </div>

               <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", position: "relative", zIndex: 1 }}>
                  {[ {l: "HRS", v: "05"}, {l: "MIN", v: "42"}, {l: "SEC", v: "15"} ].map((t, i) => (
                    <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.1)", padding: "0.8rem", borderRadius: "12px", textAlign: "center", backdropFilter: "blur(10px)" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{t.v}</div>
                      <div style={{ fontSize: "0.6rem", fontWeight: 700, opacity: 0.6 }}>{t.l}</div>
                    </div>
                  ))}
               </div>

               <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "1.5rem", position: "relative", zIndex: 1 }}>Up to 70% Off on <br /> Premium Accessories</h3>
               
               <button style={{ 
                 width: "100%", 
                 padding: "1rem", 
                 background: "white", 
                 color: "#1e1b4b", 
                 borderRadius: "12px", 
                 fontWeight: 800, 
                 fontSize: "0.9rem",
                 position: "relative",
                 zIndex: 1
               }} className="card-hover">
                 Shop the Sale
               </button>

               {/* Decorative background glow */}
               <div style={{ position: "absolute", top: "-20%", right: "-20%", width: "150px", height: "150px", background: "var(--primary)", filter: "blur(60px)", opacity: 0.4 }}></div>
            </section>

          </div>
        </div>

        {/* Brands Section (The "Activity" Noise) */}
        <section style={{ maxWidth: "1600px", margin: "4rem auto", padding: "0 2rem" }}>
          <div style={{ 
            background: "var(--secondary)", 
            borderRadius: "2.5rem", 
            padding: "3rem", 
            textAlign: "center",
            border: "1px solid var(--border)"
          }}>
            <p style={{ color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "2px", marginBottom: "2.5rem" }}>
              Trusted by leading brands worldwide
            </p>
                {["APPLE", "SAMSUNG", "SONY", "BOSE", "BEATS", "MICROSOFT"].map(brand => (
                  <span key={brand} style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--foreground)", letterSpacing: "2px" }}>{brand}</span>
                ))}
            </div>
        </section>

        {/* Categories Grid */}
        <section style={{ maxWidth: "1600px", margin: "4rem auto 2rem", padding: "0 2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem" }}>
            <div>
              <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Explore Categories</h2>
              <p style={{ color: "var(--muted)" }}>Find exactly what you're looking for.</p>
            </div>
            <Link href="/products" style={{ fontWeight: 700, color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              See All <ArrowRightIcon size={16} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1.5rem" }}>
            {categories.map(cat => (
              <Link href={`/products?category=${cat.id}`} key={cat.id} className="card-hover">
                <div style={{ 
                  background: "white", 
                  borderRadius: "var(--radius)", 
                  padding: "1.5rem", 
                  textAlign: "center",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem"
                }}>
                  <div style={{ width: "80px", height: "80px", borderRadius: "20px", background: "#f3f3ee", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <img src={API_CONFIG.getImageUrl(cat.imageUrl) || "https://api.dicebear.com/7.x/shapes/svg?seed=" + cat.name} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Product Grid Section */}
        <section className="section-pattern" style={{ maxWidth: "1600px", margin: "6rem auto", padding: "4rem 2rem" }}>
          <div className="reveal-on-scroll visible" style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>Trending Now</h2>
            <p style={{ color: "var(--muted)", maxWidth: "600px", margin: "0 auto" }}>Discover our most loved products across all categories.</p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
            {allProducts.slice(0, 8).map((product, index) => (
              <div key={product.id} className="stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "5rem" }}>
            <Link href="/products">
              <button style={{ 
                padding: "1.2rem 3rem", 
                borderRadius: "100px", 
                background: "white", 
                border: "1px solid var(--border)", 
                fontWeight: 700,
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
              }} className="card-hover">
                Browse All Products
              </button>
            </Link>
          </div>
        </section>

        {/* Premium Footer */}
        <footer style={{ 
          maxWidth: "1600px", 
          margin: "4rem auto 0", 
          padding: "5rem 2rem 2rem", 
          borderTop: "1px solid var(--border)",
          background: "linear-gradient(to bottom, transparent, var(--secondary))",
          borderRadius: "3rem 3rem 0 0"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr", gap: "4rem", marginBottom: "4rem" }}>
            {/* Brand Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
               <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <div style={{ width: "40px", height: "40px", background: "var(--primary)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.2rem", fontWeight: 900 }}>E</div>
                  <span style={{ fontWeight: 900, fontSize: "1.5rem", letterSpacing: "-1px" }}>ElixaTech</span>
               </div>
               <p style={{ color: "var(--muted)", fontSize: "1.1rem", lineHeight: 1.8, maxWidth: "350px" }}>
                 The world's most trusted marketplace for premium goods. We deliver quality and satisfaction directly to your doorstep.
               </p>
               <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="card-hover" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "white", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                       <div style={{ width: "18px", height: "18px", background: "var(--muted)", borderRadius: "2px" }}></div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Quick Links 1 */}
            <div>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "2rem", color: "var(--foreground)" }}>Shop</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1.2rem", color: "var(--muted)", fontSize: "1.05rem", fontWeight: 600 }}>
                <li><Link href="/products" className="card-hover" style={{ display: "inline-block" }}>All Products</Link></li>
                <li><Link href="/products?filter=new" className="card-hover" style={{ display: "inline-block" }}>New Arrivals</Link></li>
                <li><Link href="/products?filter=top" className="card-hover" style={{ display: "inline-block" }}>Top Rated</Link></li>
                <li><Link href="/offers" className="card-hover" style={{ display: "inline-block" }}>Special Offers</Link></li>
              </ul>
            </div>

            {/* Quick Links 2 */}
            <div>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "2rem", color: "var(--foreground)" }}>Support</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1.2rem", color: "var(--muted)", fontSize: "1.05rem", fontWeight: 600 }}>
                <li><Link href="#" className="card-hover" style={{ display: "inline-block" }}>Help Center</Link></li>
                <li><Link href="#" className="card-hover" style={{ display: "inline-block" }}>Contact Us</Link></li>
                <li><Link href="#" className="card-hover" style={{ display: "inline-block" }}>Privacy Policy</Link></li>
                <li><Link href="#" className="card-hover" style={{ display: "inline-block" }}>Terms of Service</Link></li>
              </ul>
            </div>

            {/* Newsletter Section */}
            <div style={{ 
              background: "white", 
              padding: "2.5rem", 
              borderRadius: "2rem", 
              border: "1px solid var(--border)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.03)"
            }}>
               <h4 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "1rem" }}>Stay in the loop</h4>
               <p style={{ fontSize: "0.95rem", color: "var(--muted)", marginBottom: "1.5rem" }}>Subscribe to get special offers and first look at new arrivals.</p>
               <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    style={{ 
                      flex: 1, 
                      padding: "0.8rem 1.2rem", 
                      borderRadius: "12px", 
                      background: "var(--secondary)", 
                      border: "1px solid var(--border)",
                      outline: "none",
                      fontSize: "0.9rem"
                    }}
                  />
                  <button style={{ 
                    padding: "0.8rem 1.2rem", 
                    background: "var(--primary)", 
                    color: "white", 
                    borderRadius: "12px", 
                    fontWeight: 700,
                    fontSize: "0.9rem"
                  }}>Join</button>
               </div>
            </div>
          </div>
          
          <div style={{ 
            textAlign: "center", 
            color: "var(--muted)", 
            fontSize: "1rem", 
            paddingTop: "3rem", 
            borderTop: "1px solid var(--border)",
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span>&copy; {new Date().getFullYear()} ElixaTech. All rights reserved.</span>
            <div style={{ display: "flex", gap: "2rem" }}>
               <span>English (US)</span>
               <span>USD ($)</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

