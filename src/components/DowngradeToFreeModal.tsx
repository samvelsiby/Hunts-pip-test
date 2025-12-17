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
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface DowngradeToFreeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: string;
}

export function DowngradeToFreeModal({
  open,
  onOpenChange,
  currentPlan,
}: DowngradeToFreeModalProps) {
  const planName = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            Downgrade to Free Plan
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            You currently have an active paid subscription.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-yellow-950/20 border border-yellow-500/30 rounded-md p-4">
            <p className="text-sm text-gray-300">
              You are currently subscribed to the{' '}
              <span className="font-semibold text-yellow-400">{planName}</span> plan.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Switching to the Free plan will downgrade your subscription and you will lose access to premium features.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-400">
              To downgrade (including switching to free), cancel or change your subscription in the Billing page.
            </p>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-md p-4">
              <p className="text-xs text-gray-400">
                Go to <span className="text-white">Dashboard → Billing</span> to manage cancellation and plan changes.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white"
          >
            Cancel
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

