"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import styled from "styled-components";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const Main = styled.main`
  padding: 15px 24px;

  .desc {
    margin-bottom: 1rem;
  }

  label {
    white-space: nowrap;
    font-weight: 500;
  }

  button {
    cursor: pointer;
    white-space: nowrap;
    padding: 8px 12px;
    border-radius: 4px;
  }

  input {
    padding: 8px;
    width: 100%;
  }
`;

const Layout = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const ImageSection = styled.div`
  flex: 1 1 600px; /* Grow/Shrink, minimum width 600px */
  min-width: 300px;
`;

const Sidebar = styled.aside`
  flex: 1 1 300px;
  min-width: 250px;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 550px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    height: 400px; /* Reduce height on smaller screens */
  }

  @media (max-width: 480px) {
    height: 300px;
  }
`;

// Fetch Car Data
const fetchCar = async (id: string) => {
  const res = await axios.get(`/api/cars/${id}`);
  return res.data;
};

export default function CarDetail({ carId }: { carId: string }) {
  const [index, setIndex] = useState(0);
  const [couponInput, setCouponInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    null
  );
  const [appliedFinalPrice, setAppliedFinalPrice] = useState<number | null>(
    null
  );
  const [checking, setChecking] = useState(false);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  // This helps prevent React from triggering a warning when the component unmounts
  const isMounted = useRef(true);
  const hasShownError = useRef(false);

  useEffect(() => {
    // cleanup function runs when component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    hasShownError.current = false;
  }, [carId]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["car", carId],
    queryFn: () => fetchCar(carId),
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  if (isLoading) return <div className="loader">Loading...</div>;

  if (error && !hasShownError.current) {
    hasShownError.current = true;
    toast.error("Failed to load car details");
    console.log("Error", error);
    return (
      <div style={{ textAlign: "center", marginTop: "2rem", color: "gray" }}>
        Error loading car details
      </div>
    );
  }

  if (!data)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem", color: "gray" }}>
        No car details found.
      </div>
    );

  // Validate coupon but DO NOT increment times_used here
  async function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    try {
      const code = (couponInput || "").toUpperCase().trim();
      if (!code) {
        toast.error("Enter a coupon code");
        return;
      }

      const { data: couponData, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code)
        .maybeSingle(); // safer than .single() if no result

      if (error) {
        console.error("Supabase error:", error);
        toast.error("Error verifying coupon");
        return;
      }

      if (!couponData) {
        toast.error("Invalid coupon code");
        return;
      }
      if (!couponData.is_active) return alert("Coupon not active");
      if (new Date(couponData.expires_at) < new Date())
        return toast.error("Coupon expired");
      if (couponData.times_used >= couponData.max_uses)
        return toast.error("Coupon usage limit reached");

      const discount = data.is_promo ? 100 : couponData.discount_percent;
      const final = Number(data.price) * (1 - discount / 100);

      setAppliedDiscount(discount);
      setAppliedFinalPrice(final);
      setAppliedCouponCode(code);

      toast.success(
        discount === 100
          ? "Promo car! 100% off."
          : `Coupon applied: ${discount}% off`,
        { duration: 8000 }
      );
    } catch (err) {
      console.error("Error applying coupon:", err);
      toast.error("Something went wrong while applying coupon");
    } finally {
      // This helps prevent React from triggering a warning when the component unmounts
      setChecking(false);
      if (isMounted.current) setChecking(false);
    }
  }

  // Add to cart (localStorage). We DON'T touch coupon.times_used here.
  function handleAddToCart() {
    if (!user) {
      const redirectUrl = `/auth/login?redirect=/cars/${carId}`;
      router.push(redirectUrl);
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    //Check if this car already exists in cart
    const existingIndex = cart.findIndex((c: any) => c.id === data.id);

    // --- For USED cars: only one allowed ---
    if (data.condition === "used" || data.is_promo === true) {
      if (existingIndex !== -1) {
        toast.error("This used car is already in your cart");
        return;
      }

      const item = {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        is_promo: !!data.is_promo,
        couponCode: appliedCouponCode, // may be null
        discountApplied: appliedDiscount ?? 0, // numeric percent
        finalPrice: appliedFinalPrice ?? Number(data.price),
        image: data.images?.[0] || "/car-placeholder.jpg",
        condition: data.condition,
        quantity: 1,
      };
      cart.push(item);
    } else {
      // --- For Existing New cars: merge quantity ---
      if (existingIndex !== -1) {
        // Car already exists in cart, just increase quantity
        cart[existingIndex].quantity += 1;
        cart[existingIndex].finalPrice =
          (appliedFinalPrice ?? Number(data.price)) *
          cart[existingIndex].quantity;
      } else {
        // Add as new item
        const item = {
          id: data.id,
          name: data.name,
          price: Number(data.price),
          is_promo: !!data.is_promo,
          couponCode: appliedCouponCode,
          discountApplied: appliedDiscount ?? 0,
          finalPrice: appliedFinalPrice ?? Number(data.price),
          image: data.images?.[0] || "/car-placeholder.jpg",
          condition: data.condition,
          quantity: 1,
        };
        cart.push(item);
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
  }

  return (
    <Main>
      <h1>{data.name}</h1>
      <Layout>
        <ImageSection>
          <ImageWrapper>
            <Image
              src={data.images?.[index] || "/car-placeholder.jpg"}
              fill
              alt={`${data.name}`}
              priority
              style={{
                objectFit: "cover",
                objectPosition: "40% 70%",
                borderRadius: 8,
              }}
            />
          </ImageWrapper>

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {data.images?.map((img: string, i: number) => (
              <Image
                key={i}
                src={img}
                width={100}
                height={60}
                alt={`thumb-${i}`}
                onClick={() => setIndex(i)}
                style={{
                  cursor: "pointer",
                  opacity: i === index ? 1 : 0.6,
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
        </ImageSection>

        <Sidebar>
          <h2>
            {appliedFinalPrice !== null
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(appliedFinalPrice)
              : new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(data.price)}
          </h2>
          <p className="desc">{data.description}</p>

          <form onSubmit={handleApplyCoupon}>
            <label htmlFor="coupon">Have a Coupon?</label>
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <input
                id="coupon"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon code (optional)"
              />
              <button type="submit" disabled={checking}>
                {checking ? "Checking..." : "Apply Coupon"}
              </button>
            </div>
          </form>

          <div style={{ marginTop: 23 }}>
            <button onClick={handleAddToCart}>Add to cart</button>
            {/* Optionally allow immediate checkout for single item - recommended to redirect to /cart */}
            <button
              onClick={() => {
                handleAddToCart();
                window.location.href = "/cart";
              }}
              style={{ marginLeft: 8 }}
            >
              Add & Go to Cart
            </button>
          </div>
        </Sidebar>
      </Layout>
    </Main>
  );
}
