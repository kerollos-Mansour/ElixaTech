import Link from "next/link";
import { Product } from "@/core/domain/entities/Product";
import { API_CONFIG } from "@/core/infrastructure/api/config";

const getImageUrl = API_CONFIG.getImageUrl;

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="glass animate-fade-in" style={{
      display: "flex",
      flexDirection: "column",
      padding: "1.5rem",
      gap: "1rem",
      transition: "transform 0.3s ease",
    }}>
      <div style={{
        aspectRatio: "1/1",
        background: "var(--secondary)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        position: "relative"
      }}>
        {/* Placeholder for product image */}
        <div style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--muted)",
          fontSize: "0.8rem"
        }}>
          {getImageUrl(product.images || product.image || product.imageUrl || (product as any).ProductImage) ? (
            <img src={getImageUrl(product.images || product.image || product.imageUrl || (product as any).ProductImage)!} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            "No Image Available"
          )}
        </div>
        
        {product.isRecommended && (
          <span style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            background: "var(--primary)",
            color: "white",
            padding: "0.25rem 0.75rem",
            borderRadius: "100px",
            fontSize: "0.7rem",
            fontWeight: 700
          }}>
            Recommended
          </span>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{product.name}</h3>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", height: "2.5rem" }}>
          {product.description}
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
        <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--primary)" }}>
          ${Number(product.price || 0).toFixed(2)}
        </span>
        <button style={{
          padding: "0.5rem 1rem",
          background: "var(--foreground)",
          color: "var(--background)",
          borderRadius: "0.5rem",
          fontSize: "0.8rem",
          fontWeight: 600
        }}>
          View Details
        </button>
      </div>
    </Link>
  );
}
