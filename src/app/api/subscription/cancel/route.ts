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

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const atPeriodEnd = typeof body?.atPeriodEnd === "boolean" ? body.atPeriodEnd : true;

    const { data: subRow, error: subErr } = await supabaseAdmin
      .from("user_subscriptions")
      .select("id, stripe_customer_id, stripe_subscription_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subErr) {
      return NextResponse.json({ error: "Failed to load subscription", message: subErr.message }, { status: 500 });
    }
    if (!subRow?.stripe_subscription_id) {
      return NextResponse.json(
        { error: "No active Stripe subscription", message: "No paid subscription found to cancel." },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    if (atPeriodEnd) {
      const updated = await stripe.subscriptions.update(subRow.stripe_subscription_id, {
        cancel_at_period_end: true,
        metadata: { userId, cancelRequested: "true" },
      });

      // Keep status as-is so access continues until period end; webhook will mark canceled once deleted.
      await supabaseAdmin
        .from("user_subscriptions")
        .update({
          stripe_customer_id: (updated.customer as string) || subRow.stripe_customer_id,
          stripe_subscription_id: updated.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", subRow.id);

      return NextResponse.json({
        success: true,
        atPeriodEnd: true,
        status: updated.status,
        subscriptionId: updated.id,
      });
    }

    const canceled = await stripe.subscriptions.cancel(subRow.stripe_subscription_id);

    await supabaseAdmin
      .from("user_subscriptions")
      .update({
        status: "canceled",
        stripe_customer_id: (canceled.customer as string) || subRow.stripe_customer_id,
        stripe_subscription_id: canceled.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subRow.id);

    return NextResponse.json({
      success: true,
      atPeriodEnd: false,
      status: canceled.status,
      subscriptionId: canceled.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Internal server error", message }, { status: 500 });
  }
}


