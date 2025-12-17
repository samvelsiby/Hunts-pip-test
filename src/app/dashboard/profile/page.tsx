'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, User as UserIcon, BadgeCheck } from 'lucide-react';

type Plan = 'free' | 'premium' | 'ultimate';

function normalizePlan(plan: unknown): Plan {
  if (plan === 'ultimate') return 'ultimate';
  if (plan === 'premium' || plan === 'pro') return 'premium';
  return 'free';
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [tradingViewUsername, setTradingViewUsername] = useState<string | null>(null);
  const [planType, setPlanType] = useState<Plan>('free');
  const [isFetching, setIsFetching] = useState(false);

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Please Sign In</h2>
            <p className="text-gray-400 mb-6">You need to be signed in to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const userInitials = user.firstName && user.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user.firstName 
      ? user.firstName[0]
      : 'U';

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsFetching(true);
      try {
        const [tvRes, subRes] = await Promise.all([
          fetch('/api/user/tradingview'),
          fetch('/api/user/subscription'),
        ]);

        if (!cancelled) {
          if (tvRes.ok) {
            const tv = await tvRes.json();
            setTradingViewUsername(tv?.username || null);
          }
          if (subRes.ok) {
            const sub = await subRes.json();
            setPlanType(normalizePlan(sub?.plan_type));
          }
        }
      } catch {
        if (!cancelled) {
          setTradingViewUsername(null);
          setPlanType('free');
        }
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const planBadgeClass = useMemo(() => {
    if (planType === 'ultimate') return 'bg-[#00DD5E]/15 text-[#00DD5E] border border-[#00DD5E]/30';
    if (planType === 'premium') return 'bg-red-950/20 text-red-400 border border-red-500/30';
    return 'bg-gray-800/50 text-gray-300 border border-gray-700';
  }, [planType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Profile</h1>
          <p className="text-gray-400 mt-1">
            User information (display only).
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Summary */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
                  <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{user.fullName || 'User'}</CardTitle>
              <CardDescription>{user.primaryEmailAddress?.emailAddress}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${planBadgeClass}`}>
                <BadgeCheck className="h-4 w-4" />
                {planType.toUpperCase()} PLAN
              </span>
            </CardContent>
          </Card>

          {/* Display-only details */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Account Info</CardTitle>
              <CardDescription>Display-only information. Use Settings to update anything.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">User</h3>
                <Separator />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">First Name</p>
                  <p className="text-sm font-medium">{user.firstName || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Name</p>
                  <p className="text-sm font-medium">{user.lastName || 'Not provided'}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{user.primaryEmailAddress?.emailAddress || 'Not provided'}</p>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium truncate">{user.id}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <h3 className="text-sm font-medium">Trading</h3>
                <Separator />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">TradingView</p>
                  <p className="text-sm font-medium">
                    {isFetching ? 'Loading…' : tradingViewUsername || 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <Badge variant="outline" className={planBadgeClass}>
                    {planType}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
