import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-cc-webhook-signature") || "";
  const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SHARED_SECRET;
  if (!secret)
    return new Response("Webhook secret not configured", { status: 500 });

  const computed = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  if (signature !== computed)
    return new Response("Invalid signature", { status: 400 });

  const payload = JSON.parse(rawBody);
  const type = payload.type;
  const charge = payload.data;
  const metadata = charge?.metadata || {};
  const orderId = metadata.orderId;

  if (orderId) {
    let status = "pending";
    if (type === "charge:confirmed" || type === "charge:resolved")
      status = "paid";
    if (type === "charge:failed") status = "failed";
    await supabase.from("orders").update({ status }).eq("id", orderId);
  }

  return NextResponse.json({ received: true });
}
