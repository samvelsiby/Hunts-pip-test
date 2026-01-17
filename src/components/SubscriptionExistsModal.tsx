'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, CreditCard } from 'lucide-react';
import { useState } from 'react';

interface SubscriptionExistsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: string;
}

export function SubscriptionExistsModal({
  open,
  onOpenChange,
  currentPlan,
}: SubscriptionExistsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const planName = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to redirect to portal');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error opening portal:', error);
      alert('Failed to open subscription management. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Already Subscribed
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            You already have an active subscription plan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-blue-950/20 border border-blue-500/30 rounded-md p-4">
            <p className="text-sm text-gray-300">
              You are currently subscribed to the{' '}
              <span className="font-semibold text-blue-400">{planName}</span> plan.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-400">
              You can upgrade, downgrade, or cancel your subscription at any time through the customer portal.
            </p>

            <div className="bg-gray-800/50 border border-gray-700 rounded-md p-4">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Manage Billing</p>
                  <p className="text-gray-200 text-sm font-medium">
                    Update payment method, download invoices, change plan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="w-full sm:w-auto text-gray-400 hover:text-white hover:bg-white/10"
          >
            Close
          </Button>
          <Button
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Opening Portal...</span>
              </div>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Subscription
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
