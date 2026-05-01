"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { orderUseCases, cartUseCases, addressUseCases } from "@/core";
import { useToast } from "@/components/Toast";
import { useCart } from "@/context/CartContext";
import { Address } from "@/core/domain/entities/Address";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { refreshCartCount } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  
  const [formData, setFormData] = useState({
    contactNumber: "",
    paymentMethod: "CASH_ON_DELIVERY",
    addressId: ""
  });
  
  const isSubmitting = useRef(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await addressUseCases.getMyAddresses();
        setAddresses(data);
        if (data.length > 0) {
          // Pre-select default address or the first one
          const defaultAddress = data.find(a => a.isDefault) || data[0];
          setFormData(prev => ({ ...prev, addressId: defaultAddress.id }));
        }
      } catch (err: any) {
        showToast("Failed to load addresses", "error");
      } finally {
        setFetchingAddresses(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting.current) return;
    
    if (!formData.addressId) {
      showToast("Please select or add a shipping address", "error");
      return;
    }

    isSubmitting.current = true;
    setLoading(true);
    try {
      const order = await orderUseCases.createOrder(formData);
      // Wait a tiny bit just to ensure backend changes propagate
      await new Promise(r => setTimeout(r, 500)); 
      
      // We don't necessarily need to clear the cart if the backend does it automatically,
      // but we do need to update our frontend context count to 0.
      try {
        await cartUseCases.clearCart(); 
      } catch (e) {
        // Ignore if backend already cleared it
      }
      
      await refreshCartCount();
      
      showToast("Order placed successfully!", "success");
      router.push(`/orders/${order.id}/track`);
    } catch (err: any) {
      isSubmitting.current = false;
      showToast(err.message || "Failed to place order.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingAddresses) return <main style={{ padding: "8rem 1rem", textAlign: "center" }}>Loading checkout...</main>;

  return (
    <main className="animate-fade-in">
      <div style={{ padding: "8rem 1rem 4rem", maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", textAlign: "center" }}>Checkout</h1>

        <div className="glass" style={{ padding: "3rem 2rem" }}>
          {addresses.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📍</div>
              <h3 style={{ marginBottom: "1rem" }}>No Shipping Address Found</h3>
              <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>You need to add a shipping address before checking out.</p>
              <Link href="/profile">
                <button style={{ padding: "0.75rem 1.5rem", borderRadius: "var(--radius)", background: "var(--primary)", color: "white", fontWeight: 600, border: "none", cursor: "pointer" }}>
                  Go to Profile to Add Address
                </button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Shipping Address</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {addresses.map(address => (
                    <label key={address.id} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", background: formData.addressId === address.id ? "rgba(99, 102, 241, 0.1)" : "var(--secondary)", border: formData.addressId === address.id ? "1px solid var(--primary)" : "1px solid var(--border)", borderRadius: "var(--radius)", cursor: "pointer" }}>
                      <input 
                        type="radio" 
                        name="addressId" 
                        value={address.id}
                        checked={formData.addressId === address.id}
                        onChange={(e) => setFormData({ ...formData, addressId: e.target.value })}
                        style={{ marginTop: "0.2rem" }}
                      />
                      <div>
                        <p style={{ fontWeight: 600 }}>{address.addressDetails}</p>
                        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{address.phoneNumber}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div style={{ marginTop: "1rem", textAlign: "right" }}>
                  <Link href="/profile" style={{ color: "var(--primary)", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}>
                    + Add New Address
                  </Link>
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Contact Number for Delivery</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. +1234567890"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  style={{ width: "100%", padding: "1rem", borderRadius: "var(--radius)", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Payment Method</label>
                <select 
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  style={{ width: "100%", padding: "1rem", borderRadius: "var(--radius)", background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                >
                  <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ padding: "1.25rem", marginTop: "1rem", borderRadius: "var(--radius)", background: "var(--primary)", color: "white", fontWeight: 700, fontSize: "1.1rem", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Placing Order..." : "Confirm & Place Order"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
