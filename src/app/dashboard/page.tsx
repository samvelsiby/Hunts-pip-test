'use client';

import { useSupabaseUser } from "@/lib/useSupabaseUser";
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, LineChart, Zap, Award, ArrowRight } from "lucide-react";
import { supabaseBrowser } from '@/lib/supabase-browser';
import DebugAuthStatus from '@/components/DebugAuthStatus';

function DashboardOverview() {
  const { user } = useSupabaseUser();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, {user?.email?.split('@')[0] || 'Trader'}!</h1>
        <p className="text-gray-400 mt-1">Here&apos;s an overview of your trading setup and performance.</p>
      </div>

      {/* Plan Selection Success Message */}
      {planId && (
        <Card className="border-green-500/50 bg-green-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Plan Selected Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-300">
              You&apos;ve selected the <span className="text-green-400 font-semibold capitalize">{planId}</span> plan. 
              Complete your setup below to start using your trading indicators.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Trading Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Trading Performance</CardTitle>
            <CardDescription>Your recent trading activity and metrics</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="h-[200px] flex items-center justify-center bg-gray-800/50 rounded-md">
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-400">Performance charts will appear here once you connect your TradingView account</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/settings" className="text-sm text-[#FF5B41] hover:text-[#DD0000] flex items-center gap-1">
              Connect TradingView <ArrowRight className="h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>

        {/* Plan Information */}
        <Card>
          <CardHeader>
            <CardTitle>Your Plan</CardTitle>
            <CardDescription>Current subscription and features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Current Plan</span>
              <span className="text-green-400 font-semibold capitalize">{planId || 'Free'}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status</span>
              <span className="text-green-400 font-semibold">Active</span>
            </div>

            {(planId === 'free' || !planId) && (
              <div className="mt-2 p-3 bg-[#FF5B41]/10 border border-[#FF5B41]/30 rounded-md">
                <h4 className="text-[#FF5B41] font-semibold text-sm mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4" /> Free Plan Features
                </h4>
                <ul className="text-gray-300 text-xs space-y-1">
                  <li className="flex items-center gap-2">• Basic trading signals</li>
                  <li className="flex items-center gap-2">• Limited keyword access</li>
                  <li className="flex items-center gap-2">• Community support</li>
                </ul>
              </div>
            )}

            {planId === 'pro' && (
              <div className="mt-2 p-3 bg-green-950/20 border border-green-500/30 rounded-md">
                <h4 className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4" /> Pro Plan Features
                </h4>
                <ul className="text-gray-300 text-xs space-y-1">
                  <li className="flex items-center gap-2">• Advanced trading signals</li>
                  <li className="flex items-center gap-2">• Unlimited keyword access</li>
                  <li className="flex items-center gap-2">• Priority support</li>
                  <li className="flex items-center gap-2">• Custom alerts</li>
                </ul>
              </div>
            )}

            {planId === 'premium' && (
              <div className="mt-2 p-3 bg-purple-950/20 border border-purple-500/30 rounded-md">
                <h4 className="text-purple-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4" /> Premium Plan Features
                </h4>
                <ul className="text-gray-300 text-xs space-y-1">
                  <li className="flex items-center gap-2">• All Pro features</li>
                  <li className="flex items-center gap-2">• AI-powered insights</li>
                  <li className="flex items-center gap-2">• 24/7 premium support</li>
                  <li className="flex items-center gap-2">• Custom strategies</li>
                  <li className="flex items-center gap-2">• API access</li>
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              Manage Subscription
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used tools and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/library" className="group block">
              <div className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700 group-hover:border-gray-600">
                <div className="text-white font-medium mb-1 flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-[#FF5B41]" /> Indicator Library
                </div>
                <div className="text-gray-400 text-sm">Browse all available indicators</div>
              </div>
            </Link>
            <Link href="/dashboard/settings" className="group block">
              <div className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700 group-hover:border-gray-600">
                <div className="text-white font-medium mb-1 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-400" /> TradingView Setup
                </div>
                <div className="text-gray-400 text-sm">Connect your TradingView account</div>
              </div>
            </Link>
            <Link href="/dashboard/profile" className="group block">
              <div className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700 group-hover:border-gray-600">
                <div className="text-white font-medium mb-1 flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-400" /> Account Settings
                </div>
                <div className="text-gray-400 text-sm">Manage your profile and preferences</div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardContent() {
  const { loading, user } = useSupabaseUser();
  const [ready, setReady] = useState(false);
  const graceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await supabaseBrowser.auth.getSession();
        await supabaseBrowser.auth.refreshSession();
        await supabaseBrowser.auth.getUser();
      } finally {
        if (!mounted) return;
        // Start a short grace period to allow hydration
        if (graceTimer.current) clearTimeout(graceTimer.current);
        graceTimer.current = setTimeout(() => setReady(true), 1200);
      }
    })();
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange(() => {
      // Session changed; mark as ready sooner
      if (graceTimer.current) clearTimeout(graceTimer.current);
      setReady(true);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); if (graceTimer.current) clearTimeout(graceTimer.current); };
  }, []);

  if (!ready && loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (ready && !user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Sign In</h2>
          <p className="text-gray-400 mb-6">You need to be signed in to access this feature.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <DebugAuthStatus />
      {/* subtle debug text for user detection; can be removed later */}
      <div className="text-xs text-gray-500 mb-2">{user ? `Signed in as ${user.email ?? user.id}` : 'Resolving session...'}</div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="indicators">Indicators</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <DashboardOverview />
        </TabsContent>
        <TabsContent value="indicators">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">Your Indicators</h1>
            <p className="text-gray-400">Manage your trading indicators and signals.</p>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Indicators</CardTitle>
                <CardDescription>Indicators currently deployed to your TradingView account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[200px] bg-gray-800/50 rounded-md">
                  <p className="text-gray-400">Connect your TradingView account to see your indicators</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/settings">
                  <Button variant="outline">Connect TradingView</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="performance">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">Performance Analytics</h1>
            <p className="text-gray-400">Track your trading performance and metrics.</p>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Your trading statistics and performance data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px] bg-gray-800/50 rounded-md">
                  <p className="text-gray-400">Connect your TradingView account to see performance metrics</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/settings">
                  <Button variant="outline">Connect TradingView</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[calc(100vh-128px)]"><div className="text-white text-xl">Loading...</div></div>}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
