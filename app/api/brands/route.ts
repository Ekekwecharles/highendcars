import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase
    .from("cars")
    .select("brand")
    .neq("brand", "") // ignore empty brands
    .order("brand", { ascending: true });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Get unique brands
  const brands = [...new Set(data.map((item) => item.brand))];
  return NextResponse.json({ brands });
}
