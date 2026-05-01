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

  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: ""
  });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
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

    if (formData.paymentMethod === "CREDIT_CARD") {
      if (!cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
        showToast("Please fill in all credit card details", "error");
        return;
      }
      if (cardDetails.number.replace(/\s/g, '').length < 16) {
        showToast("Invalid card number", "error");
        return;
      }
    }

    isSubmitting.current = true;
    setLoading(true);
    try {
      let order = await orderUseCases.createOrder(formData);
      
      // If user selected Credit Card, simulate processing via the Backend Stripe Endpoint
      if (formData.paymentMethod === "CREDIT_CARD") {
        try {
          order = await orderUseCases.payOrder(order.id, "pm_card_visa");
        } catch (paymentErr: any) {
          throw new Error("Order created but payment processing failed: " + paymentErr.message);
        }
      }

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

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) return parts.join(' ');
    return value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
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

              <div style={{ marginBottom: formData.paymentMethod === "CREDIT_CARD" ? "1rem" : "0", position: "relative" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Payment Method</label>
                
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{ 
                    width: "100%", 
                    padding: "1rem", 
                    borderRadius: "var(--radius)", 
                    background: "var(--secondary)", 
                    border: isDropdownOpen ? "1px solid var(--primary)" : "1px solid var(--border)", 
                    color: "var(--foreground)",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s ease"
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 500 }}>
                    {formData.paymentMethod === "CASH_ON_DELIVERY" ? "💵 Cash on Delivery" : "💳 Credit Card"}
                  </span>
                  <svg 
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>

                {/* Dropdown Options */}
                <div style={{ 
                  position: "absolute", 
                  top: "100%", 
                  left: 0, 
                  right: 0, 
                  marginTop: "0.5rem",
                  background: "var(--secondary)", 
                  border: "1px solid var(--border)", 
                  borderRadius: "var(--radius)",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                  zIndex: 10,
                  overflow: "hidden",
                  opacity: isDropdownOpen ? 1 : 0,
                  transform: isDropdownOpen ? "translateY(0)" : "translateY(-10px)",
                  pointerEvents: isDropdownOpen ? "auto" : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}>
                  <div 
                    onClick={() => { setFormData({ ...formData, paymentMethod: "CASH_ON_DELIVERY" }); setIsDropdownOpen(false); }}
                    onMouseEnter={() => setHoveredOption("CASH_ON_DELIVERY")}
                    onMouseLeave={() => setHoveredOption(null)}
                    style={{ 
                      padding: "1rem", 
                      cursor: "pointer", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "0.5rem",
                      background: formData.paymentMethod === "CASH_ON_DELIVERY" ? "rgba(99, 102, 241, 0.15)" : (hoveredOption === "CASH_ON_DELIVERY" ? "rgba(99, 102, 241, 0.08)" : "transparent"),
                      borderBottom: "1px solid var(--border)",
                      transition: "background 0.2s"
                    }}
                  >
                    💵 Cash on Delivery
                  </div>
                  <div 
                    onClick={() => { setFormData({ ...formData, paymentMethod: "CREDIT_CARD" }); setIsDropdownOpen(false); }}
                    onMouseEnter={() => setHoveredOption("CREDIT_CARD")}
                    onMouseLeave={() => setHoveredOption(null)}
                    style={{ 
                      padding: "1rem", 
                      cursor: "pointer", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "0.5rem",
                      background: formData.paymentMethod === "CREDIT_CARD" ? "rgba(99, 102, 241, 0.15)" : (hoveredOption === "CREDIT_CARD" ? "rgba(99, 102, 241, 0.08)" : "transparent"),
                      transition: "background 0.2s"
                    }}
                  >
                    💳 Credit Card
                  </div>
                </div>
              </div>

              {formData.paymentMethod === "CREDIT_CARD" && (
                <div className="animate-fade-in" style={{ padding: "1.5rem", background: "var(--secondary)", borderRadius: "var(--radius)", border: "1px solid var(--border)", marginBottom: "1rem" }}>
                  <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>Card Details</span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <div style={{ width: "40px", height: "25px", background: "#1a1f36", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "italic", fontWeight: 700, fontSize: "0.7rem", color: "white" }}>VISA</div>
                      <div style={{ width: "40px", height: "25px", background: "#ff5f00", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.6rem", color: "white" }}>MC</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--muted)", fontSize: "0.9rem" }}>Cardholder Name</label>
                      <input 
                        type="text" 
                        placeholder="JOHN DOE"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value.toUpperCase() })}
                        style={{ width: "100%", padding: "0.8rem", borderRadius: "var(--radius)", background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", textTransform: "uppercase" }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--muted)", fontSize: "0.9rem" }}>Card Number</label>
                      <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })}
                        style={{ width: "100%", padding: "0.8rem", borderRadius: "var(--radius)", background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", fontFamily: "monospace", fontSize: "1.1rem", letterSpacing: "2px" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--muted)", fontSize: "0.9rem" }}>Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })}
                          style={{ width: "100%", padding: "0.8rem", borderRadius: "var(--radius)", background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", fontFamily: "monospace", fontSize: "1.1rem" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--muted)", fontSize: "0.9rem" }}>CVC</label>
                        <input 
                          type="password" 
                          placeholder="***"
                          maxLength={3}
                          value={cardDetails.cvc}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value.replace(/\D/g, '') })}
                          style={{ width: "100%", padding: "0.8rem", borderRadius: "var(--radius)", background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", fontFamily: "monospace", fontSize: "1.1rem", letterSpacing: "3px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
