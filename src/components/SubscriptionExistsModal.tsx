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
import { ArrowRight } from 'lucide-react';

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
  const planName = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);

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
              To upgrade, downgrade, or change billing frequency, use the Billing page in your dashboard.
            </p>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-md p-4">
              <p className="text-xs text-gray-400">
                Go to <span className="text-white">Dashboard → Billing</span> to manage your subscription.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              window.location.href = '/dashboard/billing';
            }}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Open Billing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

