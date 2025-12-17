import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// Lazy initialization to avoid build-time errors
function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(secretKey, { apiVersion: "2025-10-29.clover" });
}

function getBaseUrl(req: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_BASE_URL ||
    (req.headers.get("origin") && !req.headers.get("origin")?.includes("localhost") ? req.headers.get("origin") : null) ||
    "https://huntspip.com"
  );
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const returnPath = typeof body?.returnPath === "string" ? body.returnPath : "/dashboard/billing";

    const { data: subRow, error: subErr } = await supabaseAdmin
      .from("user_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subErr) {
      return NextResponse.json({ error: "Failed to load subscription", message: subErr.message }, { status: 500 });
    }
    if (!subRow?.stripe_customer_id) {
      return NextResponse.json(
        {
          error: "No Stripe customer",
          message: "No Stripe customer found. Complete a paid checkout first, then you can manage billing details here.",
        },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const baseUrl = getBaseUrl(req);

    const session = await stripe.billingPortal.sessions.create({
      customer: subRow.stripe_customer_id,
      return_url: `${baseUrl}${returnPath.startsWith("/") ? returnPath : `/${returnPath}`}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Internal server error", message }, { status: 500 });
  }
}


