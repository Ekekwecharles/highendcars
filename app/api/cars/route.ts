import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Parse query params
  const page = Math.max(1, Number(searchParams.get("page")) || 1); //Negative, zero, NaN, or huge values could break logic or create expensive DB calls
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit")) || 12)
  ); //Negative, zero, NaN, or huge values could break logic or create expensive DB calls
  const q = (searchParams.get("q") || "").trim();
  const brand = searchParams.get("brand") || "";
  const condition = searchParams.get("condition") || "";
  const is_promo = searchParams.get("is_promo") === "true";
  // const minPrice = Number(searchParams.get("minPrice") || 0);
  // const maxPrice = Number(searchParams.get("maxPrice") || 999999999);

  // Detect whether minPrice and maxPrice were actually provided
  const hasMin = searchParams.has("minPrice");
  const hasMax = searchParams.has("maxPrice");

  let minPrice = hasMin ? Number(searchParams.get("minPrice")) : null;
  let maxPrice = hasMax ? Number(searchParams.get("maxPrice")) : null;

  // Swap if minPrice > maxPrice so query still works correctly
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  // Build base Supabase query
  let query = supabase
    .from("cars")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  // Apply filters
  if (q) query = query.ilike("name", `%${q}%`);
  if (brand) query = query.eq("brand", brand);
  if (condition) query = query.eq("condition", condition);
  if (is_promo) query = query.eq("is_promo", true);

  // Apply price filters only if user provided them
  if (hasMin && minPrice !== null && !isNaN(minPrice)) {
    query = query.gte("price", minPrice);
  }
  if (hasMax && maxPrice !== null && !isNaN(maxPrice)) {
    query = query.lte("price", maxPrice);
  }

  // Execute query
  const { data, error, count } = await query;

  // Handle errors
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Calculate total pages for pagination
  const totalPages = Math.ceil((count || 0) / limit);

  // Return final JSON response
  return NextResponse.json({ items: data ?? [], totalPages });
}
