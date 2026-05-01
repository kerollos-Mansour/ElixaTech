"use client";

import { useEffect, useState } from "react";
import { getMeUseCase, addressUseCases } from "@/core";
import { User } from "@/core/domain/entities/User";
import { Address } from "@/core/domain/entities/Address";
import { useToast } from "@/components/Toast";
import Link from "next/link";

export default function ProfilePage() {
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressDetails: "",
    phoneNumber: "",
    isDefault: false
  });

  const fetchData = async () => {
    try {
      const [userData, addressesData] = await Promise.all([
        getMeUseCase.execute(),
        addressUseCases.getMyAddresses()
      ]);
      setUser(userData);
      setAddresses(addressesData);
    } catch (err: any) {
      setError(err.message || "Failed to load profile. Are you logged in?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addressUseCases.createAddress(newAddress);
      showToast("Address added successfully", "success");
      setNewAddress({ addressDetails: "", phoneNumber: "", isDefault: false });
      setShowAddForm(false);
      fetchData(); // Refresh list
    } catch (err: any) {
      showToast(err.message || "Failed to add address", "error");
    }
  };

  if (loading) return <main style={{ padding: "8rem 1rem", textAlign: "center" }}>Loading profile...</main>;
  if (error) return (
    <main style={{ padding: "8rem 1rem", textAlign: "center" }}>
      <h2 style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</h2>
      <Link href="/login">
        <button className="glass" style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none" }}>
          Login
        </button>
      </Link>
    </main>
  );

  return (
    <main className="animate-fade-in">
      <div style={{ padding: "8rem 1rem 4rem", maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>My Profile</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          
          {/* User Info Section */}
          <div className="glass" style={{ padding: "2rem", height: "fit-content" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              👤 Personal Information
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Full Name</label>
                <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{user?.fullName}</p>
              </div>
              <div>
                <label style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Email</label>
                <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{user?.email}</p>
              </div>
              <div>
                <label style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Phone Number</label>
                <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{user?.phoneNumber}</p>
              </div>
              <div>
                <label style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Role</label>
                <p style={{ display: "inline-block", padding: "0.2rem 0.5rem", background: "var(--primary)", color: "white", borderRadius: "100px", fontSize: "0.8rem", fontWeight: 700 }}>
                  {user?.role}
                </p>
              </div>
              <div>
                <label style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Joined</label>
                <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="glass" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                📍 Addresses
              </h2>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}
              >
                {showAddForm ? "Cancel" : "+ Add New"}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddAddress} style={{ marginBottom: "2rem", padding: "1rem", background: "var(--secondary)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Add New Address</h3>
                <input 
                  type="text" 
                  placeholder="Address Details (e.g. 123 Main St)" 
                  required 
                  value={newAddress.addressDetails}
                  onChange={e => setNewAddress({...newAddress, addressDetails: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", borderRadius: "var(--radius)", background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                />
                <input 
                  type="text" 
                  placeholder="Phone Number" 
                  required 
                  value={newAddress.phoneNumber}
                  onChange={e => setNewAddress({...newAddress, phoneNumber: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", borderRadius: "var(--radius)", background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                />
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={newAddress.isDefault}
                    onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})}
                  />
                  Set as default address
                </label>
                <button type="submit" style={{ width: "100%", padding: "0.75rem", background: "var(--primary)", color: "white", fontWeight: 600, border: "none", borderRadius: "var(--radius)", cursor: "pointer" }}>
                  Save Address
                </button>
              </form>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {addresses.length === 0 ? (
                <p style={{ color: "var(--muted)", textAlign: "center", padding: "1rem 0" }}>No addresses found.</p>
              ) : (
                addresses.map((address) => (
                  <div key={address.id} style={{ padding: "1rem", background: "var(--secondary)", borderRadius: "var(--radius)", border: address.isDefault ? "1px solid var(--primary)" : "1px solid var(--border)", position: "relative" }}>
                    {address.isDefault && (
                      <span style={{ position: "absolute", top: "-10px", right: "10px", background: "var(--primary)", color: "white", fontSize: "0.7rem", padding: "0.2rem 0.5rem", borderRadius: "100px", fontWeight: 700 }}>
                        Default
                      </span>
                    )}
                    <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{address.addressDetails}</p>
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      📞 {address.phoneNumber}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
