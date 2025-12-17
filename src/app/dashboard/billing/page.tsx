"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink, Loader2 } from "lucide-react";

type PlanId = "free" | "premium" | "ultimate";
type Frequency = "monthly" | "yearly";

type SubscriptionResponse = {
  plan_type?: PlanId;
  status?: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
};

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);

  const [planId, setPlanId] = useState<Exclude<PlanId, "free">>("premium");
  const [frequency, setFrequency] = useState<Frequency>("monthly");

  const [isChanging, setIsChanging] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const currentPlan = (subscription?.plan_type ?? "free") as PlanId;
  const currentStatus = subscription?.status ?? "active";

  const refreshSubscription = useCallback(async () => {
    setMessage(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/subscription", { credentials: "include", cache: "no-store" });
      const data = (await res.json()) as SubscriptionResponse;
      if (!res.ok) {
        throw new Error((data as any)?.error || "Failed to load subscription");
      }
      setSubscription(data);
    } catch (e) {
      setSubscription({ plan_type: "free", status: "active" });
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Failed to load subscription" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSubscription();
  }, [refreshSubscription]);

  // Default selectors to current plan when possible
  useEffect(() => {
    if (currentPlan === "premium" || currentPlan === "ultimate") {
      setPlanId(currentPlan);
    }
  }, [currentPlan]);

  const canManageInStripePortal = useMemo(() => {
    return Boolean(subscription?.stripe_customer_id);
  }, [subscription?.stripe_customer_id]);

  const handleChange = async () => {
    setMessage(null);
    setIsChanging(true);
    try {
      const res = await fetch("/api/subscription/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ planId, frequency }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Failed to change subscription");
      }
      setMessage({ type: "success", text: "Subscription updated successfully." });
      await refreshSubscription();
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Failed to change subscription" });
    } finally {
      setIsChanging(false);
    }
  };

  const handleCancel = async () => {
    setMessage(null);
    const ok = window.confirm(
      "Cancel your subscription at the end of the current billing period?\n\nYou will keep access until the period ends."
    );
    if (!ok) return;

    setIsCanceling(true);
    try {
      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ atPeriodEnd: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Failed to cancel subscription");
      }
      setMessage({ type: "success", text: "Cancellation scheduled. You’ll keep access until period end." });
      await refreshSubscription();
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Failed to cancel subscription" });
    } finally {
      setIsCanceling(false);
    }
  };

  const handleOpenPortal = async () => {
    setMessage(null);
    setIsOpeningPortal(true);
    try {
      const res = await fetch("/api/stripe/customer-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ returnPath: "/dashboard/billing" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Failed to open billing portal");
      }
      if (!data?.url) throw new Error("Missing portal URL");
      window.location.href = data.url;
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Failed to open billing portal" });
    } finally {
      setIsOpeningPortal(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Billing</h1>
          <p className="text-gray-400 mt-1">Manage your subscription, plan changes, and billing details.</p>
        </div>

        {message && (
          <Alert
            className={
              message.type === "success"
                ? "bg-[#00DD5E]/10 border border-[#00DD5E]/30"
                : "bg-red-950/20 border border-red-500/30"
            }
          >
            <AlertTitle className={message.type === "success" ? "text-[#00DD5E]" : "text-red-400"}>
              {message.type === "success" ? "Success" : "Action failed"}
            </AlertTitle>
            <AlertDescription className="text-gray-300">{message.text}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Current subscription</CardTitle>
            <CardDescription>Your current plan and status from your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading subscription…
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Plan</span>
                  <span className="text-white font-semibold capitalize">{currentPlan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-white font-semibold capitalize">{currentStatus}</span>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/pricing">
                View pricing <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              onClick={refreshSubscription}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change plan</CardTitle>
            <CardDescription>Upgrade, downgrade, or change billing frequency.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select value={planId} onValueChange={(v) => setPlanId(v as any)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="ultimate">Ultimate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Billing frequency</Label>
                <Select value={frequency} onValueChange={(v) => setFrequency(v as any)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleChange} disabled={isChanging || isLoading} className="sm:w-auto w-full">
                {isChanging ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating…
                  </>
                ) : (
                  "Update subscription"
                )}
              </Button>
              <Button asChild variant="outline" className="sm:w-auto w-full">
                <Link href="/pricing">Compare plans</Link>
              </Button>
            </div>
            {currentPlan === "free" && (
              <p className="text-sm text-gray-400">
                You’re on the free plan. To start a paid subscription, use the pricing page.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing details</CardTitle>
            <CardDescription>Update card and download invoices (handled securely by Stripe).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-400">
              For security, payment methods and invoices are managed in Stripe’s hosted portal.
            </p>
            {!canManageInStripePortal && (
              <p className="text-sm text-gray-400">
                No Stripe customer found yet. This is normal if you haven’t completed a paid checkout.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleOpenPortal}
              disabled={isOpeningPortal || !canManageInStripePortal}
              className="w-full sm:w-auto"
            >
              {isOpeningPortal ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Opening…
                </>
              ) : (
                <>
                  Manage billing details <ExternalLink className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cancel subscription</CardTitle>
            <CardDescription>Schedule cancellation at the end of the current billing period.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              If you cancel, you’ll keep access until the current billing period ends.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isCanceling || isLoading || currentPlan === "free"}
              className="w-full sm:w-auto"
            >
              {isCanceling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Canceling…
                </>
              ) : (
                "Cancel subscription"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}


