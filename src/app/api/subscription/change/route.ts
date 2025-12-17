import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { getStripePriceId } from "@/config/stripe-prices";
import { supabaseAdmin } from "@/lib/supabase-server";

type Frequency = "monthly" | "yearly";
type PlanId = "premium" | "ultimate";

// Lazy initialization to avoid build-time errors
function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(secretKey, { apiVersion: "2025-10-29.clover" });
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const planId = body?.planId as PlanId | undefined;
    const frequency = body?.frequency as Frequency | undefined;

    if (!planId || (planId !== "premium" && planId !== "ultimate")) {
      return NextResponse.json({ error: "Invalid planId", message: "planId must be premium or ultimate" }, { status: 400 });
    }
    if (!frequency || (frequency !== "monthly" && frequency !== "yearly")) {
      return NextResponse.json(
        { error: "Invalid frequency", message: "frequency must be monthly or yearly" },
        { status: 400 }
      );
    }

    const priceId = getStripePriceId(planId, frequency);
    if (!priceId) {
      return NextResponse.json(
        { error: "Missing Stripe price", message: `No Stripe price configured for ${planId}/${frequency}` },
        { status: 400 }
      );
    }

    // Load most recent subscription record for this user (must have a Stripe subscription id)
    const { data: subRow, error: subErr } = await supabaseAdmin
      .from("user_subscriptions")
      .select("id, plan_id, status, stripe_customer_id, stripe_subscription_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subErr) {
      return NextResponse.json({ error: "Failed to load subscription", message: subErr.message }, { status: 500 });
    }

    if (!subRow?.stripe_subscription_id) {
      return NextResponse.json(
        {
          error: "No active Stripe subscription",
          message: "You don’t have a paid subscription yet. Please subscribe from the pricing page first.",
        },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve(subRow.stripe_subscription_id, {
      expand: ["items.data.price"],
    });

    const item = subscription.items.data[0];
    if (!item?.id) {
      return NextResponse.json({ error: "Invalid Stripe subscription", message: "No subscription item found" }, { status: 400 });
    }

    const updated = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: false,
      proration_behavior: "create_prorations",
      items: [{ id: item.id, price: priceId }],
      metadata: {
        userId,
        planId,
        frequency,
      },
    });

    // Sync Supabase immediately for UX (webhook will also keep it consistent)
    const { error: updateErr } = await supabaseAdmin
      .from("user_subscriptions")
      .update({
        plan_id: planId,
        status: updated.status === "active" ? "active" : (updated.status as string),
        stripe_customer_id: (updated.customer as string) || subRow.stripe_customer_id,
        stripe_subscription_id: updated.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subRow.id);

    if (updateErr) {
      return NextResponse.json(
        { error: "Subscription updated in Stripe, but failed to update database", message: updateErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscriptionId: updated.id,
      status: updated.status,
      planId,
      frequency,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Internal server error", message }, { status: 500 });
  }
}


