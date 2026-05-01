"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductDetailUseCase, cartUseCases, getReviewsUseCase, addReviewUseCase } from "@/core";
import { Product } from "@/core/domain/entities/Product";
import { Review } from "@/core/domain/entities/Review";
import { API_CONFIG } from "@/core/infrastructure/api/config";

const getImageUrl = API_CONFIG.getImageUrl;

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratings, setRatings] = useState({ average: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Review form state
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const fetchData = async () => {
    if (!id) return;
    try {
      const [prodData, reviewsData] = await Promise.all([
        getProductDetailUseCase.execute(id as string),
        getReviewsUseCase.execute(id as string)
      ]);
      setProduct(prodData);
      
      // Handle the object structure { averageRating, totalReviews, reviews }
      const rData = reviewsData as any;
      if (rData && !Array.isArray(rData)) {
        setReviews(rData.reviews || []);
        setRatings({ 
          average: rData.averageRating || 0, 
          total: rData.totalReviews || 0 
        });
      } else {
        setReviews(rData || []);
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
      await cartUseCases.addToCart(product.id, 1);
      alert("Added to cart successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to add to cart. Are you logged in?");
    } finally {
      setAdding(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmittingReview(true);
    try {
      await addReviewUseCase.execute(id as string, newReview.rating, newReview.comment);
      setNewReview({ rating: 5, comment: "" });
      // Refresh reviews
      const updatedReviewsData = await getReviewsUseCase.execute(id as string) as any;
      if (updatedReviewsData && !Array.isArray(updatedReviewsData)) {
        setReviews(updatedReviewsData.reviews || []);
        setRatings({ 
          average: updatedReviewsData.averageRating || 0, 
          total: updatedReviewsData.totalReviews || 0 
        });
      } else {
        setReviews(updatedReviewsData || []);
      }
      alert("Review submitted successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to submit review. Are you logged in?");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <main style={{ padding: "8rem 1rem", textAlign: "center" }}>Loading product details...</main>;
  if (error || !product) return <main style={{ padding: "8rem 1rem", textAlign: "center", color: "#ef4444" }}>{error || "Product not found"}</main>;

  const allImages = product.images || [];

  return (
    <main>
      <div style={{ padding: "8rem 1rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Product Info Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "4rem", marginBottom: "6rem" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
                  <button 
                    key={img.id}
                    onClick={() => setSelectedImage(getImageUrl(img.url))}
                    style={{ width: "80px", height: "80px", borderRadius: "0.5rem", overflow: "hidden", border: selectedImage === getImageUrl(img.url) ? "2px solid var(--primary)" : "2px solid transparent", padding: 0, cursor: "pointer", background: "none" }}
                  >
                    <img src={getImageUrl(img.url)!} alt="thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {product.isRecommended && (
                <span style={{ width: "fit-content", background: "rgba(99, 102, 241, 0.1)", color: "var(--primary)", padding: "0.25rem 0.75rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700 }}>
                  Highly Recommended
                </span>
              )}
              <h1 style={{ fontSize: "3rem" }}>{product.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "#fbbf24" }}>★</span>
                <span style={{ fontWeight: 600 }}>{ratings.average || product.rating || "New"}</span>
                <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>({ratings.total} reviews)</span>
              </div>
            </div>

            <p style={{ fontSize: "1.25rem", color: "var(--muted)", lineHeight: "1.6" }}>{product.description}</p>

            <div style={{ margin: "1rem 0" }}>
              <span style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--primary)" }}>
                ${Number(product.price || 0).toFixed(2)}
              </span>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                Stock: {product.stockQuantity > 0 ? `${product.stockQuantity} available` : "Out of stock"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                onClick={handleAddToCart}
                disabled={adding}
                style={{ flex: 1, padding: "1rem", borderRadius: "var(--radius)", background: "var(--primary)", color: "white", fontWeight: 600, boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)", cursor: adding ? "not-allowed" : "pointer", opacity: adding ? 0.7 : 1 }}
              >
                {adding ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "4rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "3rem" }}>Customer Reviews</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem" }}>
            
            {/* Reviews List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {reviews.length === 0 ? (
                <p style={{ color: "var(--muted)" }}>No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="glass" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <span style={{ fontWeight: 600 }}>{rev.user?.fullName || "User"}</span>
                      <span style={{ color: "#fbbf24" }}>{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</span>
                    </div>
                    <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>{rev.comment}</p>
                    <span style={{ display: "block", marginTop: "1rem", fontSize: "0.75rem", color: "var(--muted)" }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Add Review Form */}
            <div className="glass" style={{ padding: "2rem", height: "fit-content" }}>
              <h3 style={{ marginBottom: "1.5rem" }}>Write a Review</h3>
              <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Rating</label>
                  <select 
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius)", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                  >
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Comment</label>
                  <textarea 
                    required
                    rows={4}
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="What did you think about this product?"
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius)", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)", resize: "none" }}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={submittingReview}
                  style={{ padding: "1rem", borderRadius: "var(--radius)", background: "var(--primary)", color: "white", fontWeight: 600, cursor: submittingReview ? "not-allowed" : "pointer" }}
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
