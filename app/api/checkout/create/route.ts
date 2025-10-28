import { NextResponse } from "next/server";
import axios from "axios";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const body = await req.json();
  const { carId, userId } = body || {};
  if (!carId)
    return NextResponse.json({ error: "carId required" }, { status: 400 });

  const { data: car, error: carError } = await supabase
    .from("cars")
    .select("*")
    .eq("id", carId)
    .single();
  if (carError || !car)
    return NextResponse.json({ error: "Car not found" }, { status: 400 });

  const amount = car.price;
  const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
  if (!apiKey)
    return NextResponse.json(
      { error: "Coinbase API key not configured" },
      { status: 500 }
    );

  try {
    const orderId = uuidv4();
    const { error: orderError } = await supabase.from("orders").insert([
      {
        id: orderId,
        user_id: userId || null,
        car_id: carId,
        amount,
        status: "pending",
      },
    ]);
    if (orderError)
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );

    const resp = await axios.post(
      "https://api.commerce.coinbase.com/charges",
      {
        name: `Purchase — ${car.name}`,
        description: `Purchase of ${car.brand} ${car.name} (${car.year})`,
        local_price: { amount: String(amount), currency: "USD" },
        pricing_type: "fixed_price",
        metadata: { orderId, carId },
      },
      {
        headers: {
          "X-CC-Api-Key": apiKey,
          "X-CC-Version": "2018-03-22",
          "Content-Type": "application/json",
        },
      }
    );
    return NextResponse.json(resp.data);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
