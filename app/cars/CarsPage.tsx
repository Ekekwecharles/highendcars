"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CarCard from "@/components/CarCard";
import Pagination from "@/components/Pagination";
import { Car } from "@/types/car";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;

  input {
    /* width: 100px; */
  }

  input[type="number"] {
    width: 100px;
  }

  select {
    min-width: 100px;
  }

  @media (max-width: 600px) {
    gap: 10px;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  row-gap: 3rem;

  @media (min-width: 1200px) {
       grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 600px) and (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 599px) {
    grid-template-columns: repeat(1, 1fr);
  }
`

interface CarsResponse {
  items: Car[];
  totalPages: number;
}

// Fetch cars with all filters
const fetchCars = async (
  params: Record<string, string | number | undefined>
): Promise<CarsResponse> => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([Key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(Key, String(value));
    }
  });

  const res = await axios.get(`/api/cars?${searchParams.toString()}`);
  return res.data;
};

// Fetch brands
const fetchBrands = async (): Promise<string[]> => {
  const res = await axios.get("/api/brands");
  return res.data.brands;
};

export default function CarsPage() {
  const params = useSearchParams();
  const router = useRouter();

  // Read initial filters from URL params
  const initialCondition = params.get("condition") || "";
  const initialPromo = params.get("promo") === "true";

  const [page, setPage] = useState(1);
  const [q, setQ] = useState(""); 
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState(initialCondition);
  const [isPromo, setIsPromo] = useState(initialPromo);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [limit, setLimit] = useState<number>(8);
  // const limit = 8;

  // Load brands for dropdown
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  //Track window width
  useEffect(() => {
    const updateLimit = () => {
      if (window.innerWidth < 760) setLimit(8);
      if (window.innerWidth < 1200 && window.innerWidth > 760) setLimit(9);
      else setLimit(8);
      console.log("Screen width:", window.innerWidth);
    };
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  // Load cars with filters
  const { data, isLoading } = useQuery({
    queryKey: ["cars", page, q, brand, condition, isPromo, minPrice, maxPrice, limit],
    queryFn: () =>
      fetchCars({
        page,
        limit,
        q,
        brand,
        condition,
        is_promo: isPromo ? "true" : undefined,
        minPrice,
        maxPrice,
      }),
    placeholderData: (prev) => prev, // keeps previous page while loading new one
  });
  console.log("Cars data:", data);

  // Sync query params when filters change
  useEffect(() => {
    const query: Record<string, string> = {};
    if (condition) query.condition = condition;
    if (isPromo) query.promo = "true";

    const queryString = new URLSearchParams(query).toString();
    router.replace(`/cars${queryString ? `?${queryString}` : ""}`);
  }, [condition, isPromo, router]);

  if (isLoading) return <div className="loader">Loading...</div>;

  return (
    <section style={{ padding: 24 }}>
      <h2 style={{ marginBottom: "1rem" }}>
        {isPromo
          ? "Promo Cars"
          : condition === "new"
          ? "Brand New Cars"
          : condition === "used"
          ? "Used Cars"
          : "Explore Cars"}
      </h2>

      {/* Filters */}
      <FiltersContainer>
        <input
          type="text"
          placeholder="Search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        {/* Brand dropdown */}
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">All Brands</option>
          {brands?.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        {/* Condition dropdown */}
        <select
          value={condition}
          onChange={(e) => {
            setCondition(e.target.value);
            setIsPromo(false); // reset promo when user manually selects condition
          }}
        >
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>

        {/* Price inputs */}
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) =>
            setMinPrice(e.target.value ? Number(e.target.value) : "")
          }
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(e.target.value ? Number(e.target.value) : "")
          }
        />
      </FiltersContainer>

      {/* Cars grid */}
      <Grid>
        {data?.items.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </Grid>

      {/* Pagination */}
      <Pagination
        page={page}
        total={data?.totalPages || 1}
        onChange={setPage}
      />
    </section>
  );
}
