"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  max_uses: number;
  times_used: number;
  expires_at: string;
  is_active: boolean;
}

export default function AdminCouponsPage() {
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [maxUses, setMaxUses] = useState(1);
  const [expiresAt, setExpiresAt] = useState("");

  // Fetch all coupons from Supabase
  async function fetchCoupons() {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return alert(error.message);
    setCoupons(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Create new coupon
  async function handleCreateCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!code || discount < 0 || discount > 100 || !expiresAt || maxUses < 1) {
      return alert("Invalid input");
    }

    const { error } = await supabase.from("coupons").insert([
      {
        code: code.toUpperCase(),
        discount_percent: discount,
        max_uses: maxUses,
        expires_at: expiresAt,
        is_active: true,
      },
    ]);

    if (error) return alert(error.message);

    // Reset form
    setCode("");
    setDiscount(0);
    setMaxUses(1);
    setExpiresAt("");

    fetchCoupons();
  }

  // Toggle coupon active / expire
  async function toggleCoupon(coupon: Coupon) {
    const { error } = await supabase
      .from("coupons")
      .update({ is_active: !coupon.is_active })
      .eq("id", coupon.id);

    if (error) return alert(error.message);
    fetchCoupons();
  }

  if (loading) return <div>Loading coupons...</div>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Manage Promo Codes</h1>

      {/* Create Coupon Form */}
      <form onSubmit={handleCreateCoupon} style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Discount % (for non-promo cars)"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          min={0}
          max={100}
          required
        />
        <input
          type="number"
          placeholder="Max uses"
          value={maxUses}
          onChange={(e) => setMaxUses(Number(e.target.value))}
          min={1}
          required
        />
        <input
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          required
        />
        <button type="submit" style={{ cursor: "pointer" }}>
          Create Coupon
        </button>
      </form>

      {/* Coupons Table */}
      <table border={1} cellPadding={8} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount %</th>
            <th>Max Uses</th>
            <th>Times Used</th>
            <th>Expires At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c.id}>
              <td>{c.code}</td>
              <td>{c.discount_percent}%</td>
              <td>{c.max_uses}</td>
              <td>{c.times_used}</td>
              <td>{new Date(c.expires_at).toLocaleDateString()}</td>
              <td>{c.is_active ? "Active" : "Expired"}</td>
              <td>
                <button onClick={() => toggleCoupon(c)}>
                  {c.is_active ? "Expire" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
