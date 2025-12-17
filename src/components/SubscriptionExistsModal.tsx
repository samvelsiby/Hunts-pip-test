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
import { ExternalLink, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface SubscriptionExistsModalProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  currentPlan: string;
}

export function SubscriptionExistsModal({
  open,
  onOpenChangeAction,
  currentPlan,
}: SubscriptionExistsModalProps) {
  const planName = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  const openBillingPortal = async () => {
    try {
      setIsOpeningPortal(true);
      const res = await fetch('/api/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnPath: '/dashboard' }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.message || data?.error || 'Failed to open billing portal');
      }
      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      alert('Could not open subscription manager. Please try again.');
    } finally {
      setIsOpeningPortal(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
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
              To upgrade/downgrade/cancel, use the Stripe subscription manager.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChangeAction(false)}
            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white"
          >
            Close
          </Button>
          <Button
            onClick={openBillingPortal}
            disabled={isOpeningPortal}
            className="w-full sm:w-auto bg-[#00DD5E] hover:bg-[#00DD5E]/90 text-black"
          >
            {isOpeningPortal ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Opening…
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Manage in Stripe
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

