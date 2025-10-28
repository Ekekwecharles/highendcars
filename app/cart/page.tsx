"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "@/lib/supabaseClient";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";

const Container = styled.main`
  padding: 24px;

  button {
    padding: 5px 9px;
    border-radius: 5px;
    border: 0.1px solid gray;
    cursor: pointer;
  }

  .increase-quantity {
    display: flex;
    align-items: center;

    button {
      border-radius: 50%;
      height: 30px;
      width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
`;

type CartItem = {
  id: string;
  name: string;
  price: number;
  is_promo: boolean;
  couponCode?: string | null;
  discountApplied: number; // percent
  finalPrice: number;
  image?: string;
  condition: string;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(local);
  }, []);

  function removeIndex(i: number) {
    const copy = [...cart];
    copy.splice(i, 1);
    setCart(copy);
    localStorage.setItem("cart", JSON.stringify(copy));
  }

  const total = cart.reduce(
    (s, it) => s + Number(it.finalPrice) * (it.quantity || 1),
    0
  );

  // CHECKOUT: Validate coupons and create orders
  async function handleCheckout() {
    if (cart.length === 0) return alert("Cart empty");

    if (!user) {
      router.push("/auth/login?redirect=/cart");
      return;
    }

    setProcessing(true);

    try {
      // We'll validate each distinct coupon first to ensure availability
      const couponCodes = Array.from(
        new Set(cart.map((c) => c.couponCode).filter(Boolean as any))
      );
      const couponMap: Record<string, any> = {};

      // Skips these whole part if coupon code was applied
      if (couponCodes.length > 0) {
        const { data: couponsData, error } = await supabase
          .from("coupons")
          .select("*")
          .in("code", couponCodes);

        if (error) throw new Error(error.message);
        // Map by code
        for (const c of couponsData) couponMap[c.code] = c;
      }

      // Validate usage limits BEFORE creating orders
      // We must count how many times each coupon will be used in this cart
      const usageCount: Record<string, number> = {};
      for (const item of cart) {
        if (!item.couponCode) continue;
        usageCount[item.couponCode] = (usageCount[item.couponCode] || 0) + 1;
      }

      // Validate each coupon won't exceed its max_uses
      for (const code of Object.keys(usageCount)) {
        const coupon = couponMap[code];
        if (!coupon) throw new Error(`Coupon ${code} not found`);
        if (!coupon.is_active) throw new Error(`Coupon ${code} not active`);
        if (new Date(coupon.expires_at) < new Date())
          throw new Error(`Coupon ${code} expired`);
        const willUse = usageCount[code];
        if (coupon.times_used + willUse > coupon.max_uses) {
          throw new Error(
            `Coupon ${code} does not have enough remaining uses (${
              coupon.max_uses - coupon.times_used
            } left)`
          );
        }
      }

      // All validations passed — create orders and increment coupon usage.
      // NOTE: This client-side flow has race conditions if many people checkout same coupon simultaneously.
      // Recommended: implement a server-side Postgres transaction or RPC to atomically check+increment+create orders.
      const createdOrderIds: string[] = [];

      for (const item of cart) {
        // Determine discount/price again on server side (defensive)
        let discountPercent = 0;
        const couponCode = item.couponCode ?? null;
        if (item.is_promo && couponCode) {
          // Promo car: discount is 100%
          discountPercent = 100;
        } else if (couponCode) {
          const coupon = couponMap[couponCode];
          discountPercent = coupon ? coupon.discount_percent : 0;
        }

        const final = Number(item.price) * (1 - discountPercent / 100);

        console.log("Item", item);
        // Insert order
        const { data: orderData, error: orderErr } = await supabase
          .from("orders")
          .insert([
            {
              car_id: item.id,
              user_id: user.id,
              price: item.price,
              coupon_code: couponCode,
              discount_applied: discountPercent,
              total_paid: final,
              status: "pending",
            },
          ])
          .select()
          .single();

        if (orderErr) throw new Error(orderErr.message);
        createdOrderIds.push(orderData.id);

        // If coupon used for this item, increment times_used now
        if (couponCode) {
          const coupon = couponMap[couponCode];
          if (coupon) {
            const newTimes = coupon.times_used + 1;
            const { error: upErr } = await supabase
              .from("coupons")
              .update({
                times_used: newTimes,
                is_active:
                  newTimes >= coupon.max_uses ? false : coupon.is_active,
              })
              .eq("id", coupon.id);

            if (upErr) throw new Error(upErr.message);
            // Update local mapping so subsequent items using same coupon see updated times_used
            coupon.times_used = newTimes;
            couponMap[couponCode] = coupon;
          }
        }
      }

      // Success
      localStorage.removeItem("cart");
      setCart([]);
      alert(
        `Order placed (${createdOrderIds.length} items). Admin will contact you for delivery. Do well to check your email`
      );
    } catch (err: any) {
      alert("Checkout failed: " + (err.message || err));
    } finally {
      setProcessing(false);
    }
  }

  function updateQty(index: number, newQty: number) {
    const copy = [...cart];
    if (newQty <= 0) {
      copy.splice(index, 1);
    } else {
      copy[index].quantity = newQty;
    }

    setCart(copy);
    localStorage.setItem("cart", JSON.stringify(copy));
  }

  return (
    <Container>
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.map((it, i) => (
            <Row key={i}>
              <img
                src={it.image || "/car-placeholder.jpg"}
                style={{
                  width: 150,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
              <div style={{ flex: 1 }}>
                <strong>{it.name}</strong>
                <div>
                  Price:{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(it.price)}
                </div>

                {it.condition === "new" && <div>Qty: {it.quantity || 1}</div>}
                <div>Discount: {it.discountApplied}%</div>
                {/* <div>Final: ${Number(it.finalPrice).toFixed(2)}</div> */}
                <div>
                  Final:{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(
                    it.price *
                      (it.quantity || 1) *
                      (1 - it.discountApplied / 100)
                  )}
                </div>
                <div>Coupon: {it.couponCode ?? "—"}</div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                {it.condition === "new" && (
                  <div className="increase-quantity">
                    <button
                      onClick={() => updateQty(i, (it.quantity || 1) - 1)}
                    >
                      -
                    </button>
                    <span style={{ margin: "0 8px" }}>{it.quantity || 1}</span>
                    <button
                      onClick={() => updateQty(i, (it.quantity || 1) + 1)}
                    >
                      +
                    </button>
                  </div>
                )}

                <div>
                  <button onClick={() => removeIndex(i)}>Remove</button>
                </div>
              </div>
            </Row>
          ))}

          <hr />
          <div style={{ marginTop: 12 }}>
            <strong>
              {" "}
              Total:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(total)}
            </strong>
          </div>

          <div style={{ marginTop: 12 }}>
            <button onClick={handleCheckout} disabled={processing}>
              {processing
                ? "Processing..."
                : total === 0
                ? "Place Free Order"
                : "Proceed to Checkout"}
            </button>
          </div>
        </>
      )}
    </Container>
  );
}
