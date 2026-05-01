"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductDetailUseCase, cartUseCases, getReviewsUseCase, addReviewUseCase } from "@/core";
import { Product } from "@/core/domain/entities/Product";
import { Review } from "@/core/domain/entities/Review";
import { API_CONFIG } from "@/core/infrastructure/api/config";
import { useToast } from "@/components/Toast";
import { useCart } from "@/context/CartContext";
import { useFavorite } from "@/context/FavoriteContext";
import { favoriteUseCases } from "@/core";

const getImageUrl = API_CONFIG.getImageUrl;

// Icons
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "none"} stroke={filled ? "#fbbf24" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const CartPlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.56-7.43H5.05"/></svg>
);

export default function ProductDetailPage() {
  const { showToast } = useToast();
  const { refreshCartCount } = useCart();
  const { refreshFavCount } = useFavorite();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratings, setRatings] = useState({ average: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    try {
      const [prodData, reviewsData, favsData] = await Promise.all([
        getProductDetailUseCase.execute(id as string),
        getReviewsUseCase.execute(id as string) as any,
        favoriteUseCases.getFavorites()
      ]);
      setProduct(prodData);
      
      // Check if current product is in favorites
      const favs = favsData as Product[];
      setIsFavorite(favs.some(f => (f.id === id || (f as any).productId === id)));
      
      if (reviewsData && !Array.isArray(reviewsData)) {
        setReviews(reviewsData.reviews || []);
        setRatings({ average: reviewsData.averageRating || 0, total: reviewsData.totalReviews || 0 });
      } else {
        setReviews(reviewsData || []);
      }
      
      const initialImg = getImageUrl(prodData.images || prodData.image || prodData.imageUrl);
      setSelectedImage(initialImg);
    } catch (err: any) {
      setError(err.message || "Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await cartUseCases.addToCart(product.id, quantity);
      await refreshCartCount();
      showToast(`${quantity} items added to cart`, "success");
    } catch (err: any) {
      showToast(err.message || "Add failed", "error");
    } finally {
      setAdding(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (newReview.rating === 0) {
      showToast("Please select a rating", "error");
      return;
    }
    setSubmittingReview(true);
    try {
      await addReviewUseCase.execute(id as string, newReview.rating, newReview.comment);
      setNewReview({ rating: 0, comment: "" });
      const updatedReviewsData = await getReviewsUseCase.execute(id as string) as any;
      if (updatedReviewsData && !Array.isArray(updatedReviewsData)) {
        setReviews(updatedReviewsData.reviews || []);
        setRatings({ average: updatedReviewsData.averageRating || 0, total: updatedReviewsData.totalReviews || 0 });
      } else {
        setReviews(updatedReviewsData || []);
      }
      showToast("Review submitted!", "success");
    } catch (err: any) {
      showToast(err.message || "Submission failed", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <main style={{ padding: "8rem 1rem", textAlign: "center" }}>Loading product details...</main>;
  if (error || !product) return <main style={{ padding: "8rem 1rem", textAlign: "center", color: "#ef4444" }}>{error || "Product not found"}</main>;

  const allImages = product.images || [];

  return (
    <main className="animate-fade-in">
      <div style={{ padding: "8rem 1rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Main Product Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "4rem", marginBottom: "6rem" }}>
          
          <div className="animate-fade-in delay-100" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="glass" style={{ aspectRatio: "1/1", borderRadius: "var(--radius)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--secondary)" }}>
              {selectedImage ? (
                <img src={selectedImage} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ color: "var(--muted)" }}>No Image Available</span>
              )}
            </div>

            {allImages.length > 1 && (
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {allImages.map((img) => (
                  <button key={img.id} onClick={() => setSelectedImage(getImageUrl(img.url))} style={{ width: "80px", height: "80px", borderRadius: "0.5rem", overflow: "hidden", border: selectedImage === getImageUrl(img.url) ? "2px solid var(--primary)" : "2px solid transparent", padding: 0, cursor: "pointer", background: "none" }}>
                    <img src={getImageUrl(img.url)!} alt="thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="animate-fade-in delay-200" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {product.isRecommended && (
                <span style={{ width: "fit-content", background: "rgba(99, 102, 241, 0.1)", color: "var(--primary)", padding: "0.25rem 0.75rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700 }}>Highly Recommended</span>
              )}
              <h1 style={{ fontSize: "3.5rem", letterSpacing: "-1px" }}>{product.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <StarIcon filled={true} />
                <span style={{ fontWeight: 600 }}>{ratings.average || product.rating || "New"}</span>
                <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>({ratings.total} reviews)</span>
              </div>
            </div>

            <p style={{ fontSize: "1.25rem", color: "var(--muted)", lineHeight: "1.6" }}>{product.description}</p>

            <div style={{ margin: "1.5rem 0" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                <span style={{ fontSize: "3rem", fontWeight: 800, color: "var(--primary)" }}>${Number(product.price || 0).toFixed(2)}</span>
                <span style={{ color: "var(--muted)", textDecoration: "line-through", fontSize: "1.2rem" }}>${(Number(product.price || 0) * 1.2).toFixed(2)}</span>
              </div>
              <p style={{ color: product.stockQuantity > 0 ? "#22c55e" : "#ef4444", fontSize: "0.95rem", fontWeight: 600, marginTop: "0.5rem" }}>
                {product.stockQuantity > 0 ? `✓ ${product.stockQuantity} in stock` : "✗ Out of stock"}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", background: "var(--secondary)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden" }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn" style={{ padding: "0.8rem 1.4rem", border: "none", background: "none", cursor: "pointer", color: "var(--foreground)", fontSize: "1.2rem" }}>-</button>
                <span style={{ padding: "0 1.5rem", fontWeight: 700, fontSize: "1.1rem", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="qty-btn" style={{ padding: "0.8rem 1.4rem", border: "none", background: "none", cursor: "pointer", color: "var(--foreground)", fontSize: "1.2rem" }}>+</button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={handleAddToCart} disabled={adding || product.stockQuantity === 0} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "1.25rem", borderRadius: "var(--radius)", background: product.stockQuantity === 0 ? "var(--muted)" : "var(--primary)", color: "white", fontWeight: 700, fontSize: "1.1rem", boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.4)", cursor: (adding || product.stockQuantity === 0) ? "not-allowed" : "pointer", transition: "all 0.3s", border: "none" }}>
                <CartPlusIcon />
                {product.stockQuantity === 0 ? "Out of Stock" : (adding ? "Adding..." : "Add to Cart")}
              </button>
              
              <button 
                onClick={async () => {
                  try {
                    if (isFavorite) {
                      await favoriteUseCases.removeFromFavorites(product.id);
                      showToast("Removed from favorites", "info");
                    } else {
                      await favoriteUseCases.addToFavorites(product.id);
                      showToast("Added to favorites", "success");
                    }
                    setIsFavorite(!isFavorite);
                    refreshFavCount();
                  } catch (err: any) {
                    showToast(err.message || "Failed to update favorites", "error");
                  }
                }}
                className="qty-btn"
                style={{ 
                  width: "60px", 
                  borderRadius: "var(--radius)", 
                  border: "1px solid var(--border)", 
                  background: isFavorite ? "rgba(239, 68, 68, 0.1)" : "var(--secondary)", 
                  cursor: "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "#ef4444" : "none"} stroke={isFavorite ? "#ef4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Improved Reviews Section */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "6rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4rem" }}>
            <div>
              <h2 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Customer Reviews</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                 <div style={{ display: "flex", gap: "2px" }}>
                   {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < Math.round(ratings.average)} />)}
                 </div>
                 <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{ratings.average} out of 5</span>
                 <span style={{ color: "var(--muted)" }}>({ratings.total} ratings)</span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "5rem", alignItems: "start" }}>
            
            {/* Reviews List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {reviews.length === 0 ? (
                <div className="glass" style={{ padding: "4rem", textAlign: "center", color: "var(--muted)" }}>
                  <p style={{ fontSize: "1.2rem" }}>No reviews yet. Share your thoughts!</p>
                </div>
              ) : (
                reviews.map((rev, index) => (
                  <div key={rev.id} className={`glass animate-fade-in delay-${(index + 1) * 100}`} style={{ padding: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.2rem" }}>
                          {(rev.user?.fullName || "U")[0]}
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 700, fontSize: "1.1rem" }}>{rev.user?.fullName || "User"}</h4>
                          <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{new Date(rev.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < rev.rating} />)}
                      </div>
                    </div>
                    <p style={{ color: "var(--foreground)", lineHeight: "1.7", fontSize: "1.05rem" }}>{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Sticky Write a Review Form */}
            <div className="glass animate-fade-in delay-300" style={{ padding: "2.5rem", position: "sticky", top: "120px" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>Write a Review</h3>
              <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.95rem", fontWeight: 600 }}>Rating</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: num })}
                        style={{ background: "none", border: "none", cursor: "pointer", transition: "transform 0.2s" }}
                        className="qty-btn"
                      >
                        <StarIcon filled={newReview.rating >= num} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.95rem", fontWeight: 600 }}>Comment</label>
                  <textarea required rows={5} value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} placeholder="Tell others what you think about this product..." style={{ width: "100%", padding: "1rem", borderRadius: "var(--radius)", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: "1rem", lineHeight: "1.6", outline: "none", transition: "border-color 0.3s" }} onFocus={(e) => e.target.style.borderColor = "var(--primary)"} onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
                </div>
                <button type="submit" disabled={submittingReview} style={{ padding: "1.25rem", borderRadius: "var(--radius)", background: "var(--primary)", color: "white", fontWeight: 700, fontSize: "1rem", boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)", cursor: submittingReview ? "not-allowed" : "pointer" }}>
                  {submittingReview ? "Submitting..." : "Post Review"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
