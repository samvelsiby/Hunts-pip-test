'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);

  // Persist simple preferences locally (UI only for now)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('dashboardSettings');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setEmailUpdates(parsed.emailUpdates ?? true);
      setProductUpdates(parsed.productUpdates ?? true);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'dashboardSettings',
        JSON.stringify({ emailUpdates, productUpdates })
      );
    } catch {}
  }, [emailUpdates, productUpdates]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
          <p className="text-gray-400 mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

      <Tabs defaultValue="tradingview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="tradingview">TradingView</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tradingview">
          <TradingViewSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">Email updates</p>
                    <p className="text-xs text-muted-foreground">Receive important account updates.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailUpdates(v => !v)}
                    className={`h-6 w-11 rounded-full transition-colors ${emailUpdates ? 'bg-[#00DD5E]' : 'bg-gray-700'}`}
                    aria-pressed={emailUpdates}
                  >
                    <span className={`block h-5 w-5 bg-white rounded-full transition-transform ${emailUpdates ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">Product updates</p>
                    <p className="text-xs text-muted-foreground">New indicators and feature announcements.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProductUpdates(v => !v)}
                    className={`h-6 w-11 rounded-full transition-colors ${productUpdates ? 'bg-[#00DD5E]' : 'bg-gray-700'}`}
                    aria-pressed={productUpdates}
                  >
                    <span className={`block h-5 w-5 bg-white rounded-full transition-transform ${productUpdates ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <CardTitle>Plan</CardTitle>
              <CardDescription>Change or upgrade your plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You can upgrade/downgrade from the pricing page.
              </p>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button asChild>
                <a href="/pricing">Change plan</a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}

function TradingViewSettings() {
  const { user, isLoaded } = useUser();
  const [tradingViewUsername, setTradingViewUsername] = useState('');
  const [originalUsername, setOriginalUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isLoaded && user) {
      fetchTradingViewUsername();
    }
  }, [isLoaded, user]);

  const fetchTradingViewUsername = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/tradingview');
      const data = await response.json();
      
      if (data.username) {
        setTradingViewUsername(data.username);
        setOriginalUsername(data.username);
      }
    } catch (error) {
      console.error('Error fetching TradingView username:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!tradingViewUsername.trim()) {
      setErrorMessage('Please enter a TradingView username');
      setSaveStatus('error');
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus('idle');
      setErrorMessage('');

      const response = await fetch('/api/user/tradingview', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: tradingViewUsername.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSaveStatus('success');
        setOriginalUsername(tradingViewUsername);
      } else {
        setSaveStatus('error');
        setErrorMessage(data.error || 'Failed to update TradingView username');
      }
    } catch (error) {
      console.error('Error saving TradingView username:', error);
      setSaveStatus('error');
      setErrorMessage('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = tradingViewUsername !== originalUsername;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>TradingView Account</CardTitle>
          <CardDescription>
            Connect your TradingView account to use our indicators and trading tools.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tradingview-username">TradingView Username</Label>
            <Input
              id="tradingview-username"
              placeholder="Enter your TradingView username"
              value={tradingViewUsername}
              onChange={(e) => setTradingViewUsername(e.target.value)}
              disabled={isLoading || isSaving}
            />
            <p className="text-sm text-muted-foreground">
              This username will be used to grant you access to premium TradingView indicators.
            </p>
          </div>

          {saveStatus === 'success' && (
            <div className="bg-green-950/20 border border-green-500/30 rounded-md p-3 flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-500">TradingView username saved successfully</p>
                <p className="text-xs text-muted-foreground mt-1">
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
                <p className="text-xs text-muted-foreground mt-1">{errorMessage}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading...
              </span>
            ) : originalUsername ? (
              <span>Current username: <span className="font-medium">{originalUsername}</span></span>
            ) : (
              <span>No TradingView username set</span>
            )}
          </div>
          <Button 
            onClick={handleSave} 
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

      <Card>
        <CardHeader>
          <CardTitle>Indicator Deployment</CardTitle>
          <CardDescription>
            View the status of your TradingView indicator deployments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-md p-4">
              <h4 className="text-sm font-medium mb-2">Deployment Status</h4>
              {originalUsername ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Username</span>
                    <span>{originalUsername}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-green-400">Active</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <Separator className="my-3" />
                  <p className="text-xs text-muted-foreground">
                    Your indicators are deployed to your TradingView account. If you change your username,
                    it may take up to 24 hours for the changes to take effect.
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">
                    No TradingView account connected. Add your username above to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
