'use client';

import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Award, Check, AlertCircle, Loader2, ExternalLink, Crown, Sparkles } from "lucide-react";
import { TradingViewUsernameModal } from "@/components/TradingViewUsernameModal";

interface Subscription {
  plan_type: string;
  status: string;
}

export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [tradingViewUsername, setTradingViewUsername] = useState('');
  const [originalUsername, setOriginalUsername] = useState('');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showTradingViewModal, setShowTradingViewModal] = useState(false);
  const [showModalAfterPayment, setShowModalAfterPayment] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Only fetch if user is signed in
      if (!isSignedIn || !user) {
        setIsLoading(false);
        return;
      }

      // Fetch TradingView username - sync with database
      const usernameResponse = await fetch('/api/user/tradingview', {
        credentials: 'include', // Include cookies for authentication
      });
      if (usernameResponse.ok) {
        const usernameData = await usernameResponse.json();
        // Handle both null and empty string cases
        const username = usernameData.username || '';
        setTradingViewUsername(username);
        setOriginalUsername(username);
      } else if (usernameResponse.status === 401) {
        // User is not authenticated
        console.error('Not authenticated to fetch TradingView username');
      } else {
        console.error('Failed to fetch TradingView username:', usernameResponse.status);
      }

      // Fetch subscription
      console.log('📥 Dashboard: Fetching subscription...');
      const subscriptionResponse = await fetch('/api/user/subscription', {
        credentials: 'include', // Include cookies for authentication
        cache: 'no-store', // Disable caching to always get fresh data
      });
      
      console.log('📥 Dashboard: Subscription response status:', subscriptionResponse.status);
      
      if (subscriptionResponse.ok) {
        const subscriptionData = await subscriptionResponse.json();
        console.log('📥 Dashboard: Subscription data received:', subscriptionData);
        setSubscription({
          plan_type: subscriptionData.plan_type || 'free',
          status: subscriptionData.status || 'active'
        });
        console.log('✅ Dashboard: Subscription state updated:', {
          plan_type: subscriptionData.plan_type || 'free',
          status: subscriptionData.status || 'active'
        });
      } else {
        console.error('❌ Dashboard: Failed to fetch subscription, status:', subscriptionResponse.status);
        // Default to free plan if fetch fails
        setSubscription({ plan_type: 'free', status: 'active' });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Default to free plan on error
      setSubscription({ plan_type: 'free', status: 'active' });
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    // Only fetch data when user is fully loaded and signed in
    if (isLoaded && isSignedIn && user) {
      fetchUserData();
    }
  }, [isLoaded, isSignedIn, user, fetchUserData]);

  // Refresh subscription data when returning from payment success
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      const sessionId = urlParams.get('session_id');
      
      // If payment was successful, refresh subscription data and show modal
      if (success === 'true' && sessionId) {
        console.log('✅ Payment successful, refreshing subscription data...');
        // Clean up URL params first
        window.history.replaceState({}, '', '/dashboard');
        
        // Set flag to show modal after data is fetched
        setShowModalAfterPayment(true);
        
        // Retry fetching subscription data multiple times with increasing delays
        // Webhook might take a few seconds to process
        const retryDelays = [1000, 3000, 5000]; // 1s, 3s, 5s
        retryDelays.forEach((delay, index) => {
          setTimeout(() => {
            console.log(`🔄 Refreshing subscription data (attempt ${index + 1}/${retryDelays.length})...`);
            fetchUserData();
          }, delay);
        });
      }
    }
  }, [isLoaded, isSignedIn, user, fetchUserData]);

  // Show TradingView modal after payment when data is loaded
  useEffect(() => {
    if (showModalAfterPayment && !isLoading && isLoaded && isSignedIn) {
      // Wait a bit for subscription data to be fetched, then show modal
      // Only show if user has a paid subscription (not free)
      const timer = setTimeout(() => {
        const currentPlan = subscription?.plan_type || 'free';
        // Only show modal if user has a paid subscription (premium or ultimate)
        if (currentPlan !== 'free') {
          setShowTradingViewModal(true);
        }
        setShowModalAfterPayment(false);
      }, 2000); // Wait 2 seconds for subscription data to load
      
      return () => clearTimeout(timer);
    }
  }, [showModalAfterPayment, isLoading, isLoaded, isSignedIn, subscription]);

  const handleSaveUsernameInModal = async (username: string) => {
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      throw new Error('Please enter a TradingView username');
    }

    try {
      setIsSaving(true);
      setSaveStatus('idle');
      setErrorMessage('');

      console.log('Saving TradingView username:', trimmedUsername);

      const response = await fetch('/api/user/tradingview', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username: trimmedUsername }),
      });

      const contentType = response.headers.get('content-type');
      let data: { success?: boolean; error?: string; username?: string } = {};
      
      if (contentType && contentType.includes('application/json')) {
        const responseText = await response.text();
        if (!responseText || responseText.trim() === '') {
          throw new Error('Empty response from server. Please try again.');
        }
        data = JSON.parse(responseText);
      } else {
        await response.text();
        throw new Error('Unexpected response from server. Please try again.');
      }

      if (response.ok && data.success) {
        const savedUsername = data.username || trimmedUsername;
        console.log('Successfully saved username:', savedUsername);
        
        setTradingViewUsername(savedUsername);
        setOriginalUsername(savedUsername);
        setSaveStatus('success');
        setErrorMessage('');
        
        // Refetch data to ensure everything is synced
        setTimeout(() => {
          fetchUserData();
        }, 500);
      } else {
        const errorMsg = data.error || 'Failed to update TradingView username';
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error saving TradingView username:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveUsername = async () => {
    const trimmedUsername = tradingViewUsername.trim();
    
    if (!trimmedUsername) {
      setErrorMessage('Please enter a TradingView username');
      setSaveStatus('error');
      return;
    }

    // Don't save if nothing changed
    if (trimmedUsername === originalUsername) {
      setSaveStatus('success');
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus('idle');
      setErrorMessage('');

      console.log('Saving TradingView username:', trimmedUsername);

      const response = await fetch('/api/user/tradingview', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({ username: trimmedUsername }),
      });

      console.log('Response status:', response.status, response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data: { success?: boolean; error?: string; username?: string } = {};
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const responseText = await response.text();
          console.log('Response text (raw):', responseText);
          
          if (!responseText || responseText.trim() === '') {
            console.error('Empty response body');
            setSaveStatus('error');
            setErrorMessage('Empty response from server. Please try again.');
            return;
          }
          
          data = JSON.parse(responseText);
          console.log('Response data (parsed):', data);
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError);
          setSaveStatus('error');
          setErrorMessage('Invalid response from server. Please try again.');
          return;
        }
      } else {
        // Non-JSON response (likely HTML redirect)
        const text = await response.text();
        console.error('Non-JSON response received:', text.substring(0, 200));
        setSaveStatus('error');
        if (response.status === 401 || response.status === 403) {
          setErrorMessage('You are not authorized. Please sign in again.');
        } else {
          setErrorMessage('Unexpected response from server. Please try again.');
        }
        return;
      }

      if (response.ok && data.success) {
        // Use the username from the API response to ensure we have the correct value
        const savedUsername = data.username || trimmedUsername;
        console.log('Successfully saved username:', savedUsername);
        
        setTradingViewUsername(savedUsername);
        setOriginalUsername(savedUsername);
        setSaveStatus('success');
        setErrorMessage('');
        
        // Refetch data to ensure everything is synced
        setTimeout(() => {
          fetchUserData();
        }, 500);
      } else {
        const errorMsg = data.error || 'Failed to update TradingView username';
        console.error('Update failed:', { status: response.status, error: errorMsg, data });
        setSaveStatus('error');
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      console.error('Error saving TradingView username:', error);
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Sign In</h2>
          <p className="text-gray-400 mb-6">You need to be signed in to access this feature.</p>
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasChanges = tradingViewUsername !== originalUsername;
  const planType = subscription?.plan_type || 'free';

  // Get plan display info
  const planInfo = {
    free: { name: 'Free', color: 'text-gray-400', bgColor: 'bg-gray-800/50', borderColor: 'border-gray-700', icon: Award },
    premium: { name: 'Premium', color: 'text-green-400', bgColor: 'bg-green-950/20', borderColor: 'border-green-500/30', icon: Sparkles },
    ultimate: { name: 'Ultimate', color: 'text-purple-400', bgColor: 'bg-purple-950/20', borderColor: 'border-purple-500/30', icon: Crown },
  };

  const currentPlanInfo = planInfo[planType as keyof typeof planInfo] || planInfo.free;
  const PlanIcon = currentPlanInfo.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* TradingView Username Modal - Required after payment */}
      <TradingViewUsernameModal
        open={showTradingViewModal}
        onOpenChange={setShowTradingViewModal}
        currentUsername={originalUsername}
        onSave={handleSaveUsernameInModal}
        required={planType !== 'free'} // Required for paid subscriptions
      />

      <div className="space-y-6">
        {/* Membership Banner */}
        {planType !== 'free' && (
          <Alert className={`${currentPlanInfo.bgColor} ${currentPlanInfo.borderColor} border-2`}>
            <PlanIcon className={`h-5 w-5 ${currentPlanInfo.color}`} />
            <AlertTitle className={`${currentPlanInfo.color} text-lg font-bold`}>
              {currentPlanInfo.name} Member
            </AlertTitle>
            <AlertDescription className="text-gray-300 mt-1">
              You are currently subscribed to the <span className={`font-semibold ${currentPlanInfo.color}`}>{currentPlanInfo.name}</span> plan. 
              {planType === 'premium' && ' Enjoy advanced trading signals and unlimited keyword access.'}
              {planType === 'ultimate' && ' Enjoy all premium features plus AI-powered insights and 24/7 premium support.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Welcome header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, {user?.firstName || 'Trader'}!</h1>
          <p className="text-gray-400 mt-1">Manage your subscription, indicators, and TradingView account.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Subscription Management */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>Your current plan and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Plan</span>
                <span className="text-green-400 font-semibold capitalize">{planType}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 font-semibold capitalize">{subscription?.status || 'Active'}</span>
              </div>

              {planType === 'free' && (
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

              {planType === 'premium' && (
                <div className="mt-2 p-3 bg-green-950/20 border border-green-500/30 rounded-md">
                  <h4 className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" /> Premium Plan Features
                  </h4>
                  <ul className="text-gray-300 text-xs space-y-1">
                    <li className="flex items-center gap-2">• Advanced trading signals</li>
                    <li className="flex items-center gap-2">• Unlimited keyword access</li>
                    <li className="flex items-center gap-2">• Priority support</li>
                    <li className="flex items-center gap-2">• Custom alerts</li>
                  </ul>
                </div>
              )}

              {planType === 'ultimate' && (
                <div className="mt-2 p-3 bg-purple-950/20 border border-purple-500/30 rounded-md">
                  <h4 className="text-purple-400 font-semibold text-sm mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" /> Ultimate Plan Features
                  </h4>
                  <ul className="text-gray-300 text-xs space-y-1">
                    <li className="flex items-center gap-2">• All Premium features</li>
                    <li className="flex items-center gap-2">• AI-powered insights</li>
                    <li className="flex items-center gap-2">• 24/7 premium support</li>
                    <li className="flex items-center gap-2">• Custom strategies</li>
                    <li className="flex items-center gap-2">• API access</li>
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/pricing">
                  Manage Subscription <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Active Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Active Indicators</CardTitle>
              <CardDescription>Indicators currently deployed to your TradingView account</CardDescription>
            </CardHeader>
            <CardContent>
              {originalUsername ? (
                <div className="space-y-3">
                  <div className="bg-gray-800/50 rounded-md p-4">
                    <p className="text-sm text-gray-400 mb-3">Your indicators are active and deployed to:</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{originalUsername}</span>
                      <span className="text-green-400 text-sm">Active</span>
                    </div>
                  </div>
                  <Link href="/library">
                    <Button variant="outline" className="w-full">
                      Browse Indicator Library <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] bg-gray-800/50 rounded-md">
                  <p className="text-gray-400 mb-4">Connect your TradingView account to see your indicators</p>
                  <p className="text-sm text-gray-500">Enter your TradingView username below to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* TradingView Username Management */}
        <Card>
          <CardHeader>
            <CardTitle>TradingView Username</CardTitle>
            <CardDescription>
              Enter your TradingView username to connect your account and receive indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tradingview-username">TradingView Username</Label>
              <Input
                id="tradingview-username"
                placeholder={originalUsername ? `Current: ${originalUsername}` : "Enter your TradingView username (e.g., username123)"}
                value={tradingViewUsername}
                onChange={(e) => setTradingViewUsername(e.target.value)}
                disabled={isLoading || isSaving}
                className={originalUsername ? "border-green-500/50" : ""}
              />
              {originalUsername && (
                <p className="text-sm text-green-400">
                  ✓ Currently synced: <span className="font-semibold">{originalUsername}</span>
                </p>
              )}
              <div className="bg-blue-950/20 border border-blue-500/30 rounded-md p-3">
                <h4 className="text-blue-400 font-semibold text-sm mb-2">How to manage your TradingView username:</h4>
                <ol className="text-gray-300 text-xs space-y-1.5 list-decimal list-inside">
                  <li>Your username is automatically synced with the database when you sign in</li>
                  <li>If you see a username above, it&apos;s already saved in your account</li>
                  <li>To change it, edit the field above and click &quot;Save Changes&quot;</li>
                  <li>Your indicators will be deployed to this username within 24 hours</li>
                </ol>
                <p className="text-xs text-gray-400 mt-3">
                  <strong>Note:</strong> Make sure your TradingView username is correct. This will be used to grant you access to premium indicators.
                </p>
              </div>
            </div>

            {saveStatus === 'success' && (
              <div className="bg-green-950/20 border border-green-500/30 rounded-md p-3 flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-500">TradingView username saved successfully</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Your indicators will be deployed to this account within 24 hours.
                  </p>
                </div>
              </div>
            )}

            {saveStatus === 'error' && (
              <div className="bg-red-950/20 border border-red-500/30 rounded-md p-3 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-500">Failed to save TradingView username</p>
                  <p className="text-xs text-gray-400 mt-1">{errorMessage}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-400">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                </span>
              ) : originalUsername ? (
                <span>Current username: <span className="font-medium text-white">{originalUsername}</span></span>
              ) : (
                <span>No TradingView username set</span>
              )}
            </div>
            <Button 
              onClick={handleSaveUsername} 
              disabled={isLoading || isSaving || !hasChanges}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
