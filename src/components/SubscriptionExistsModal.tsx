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
import { Mail } from 'lucide-react';

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
  const supportEmail = 'support@huntspip.com'; // Update with your actual support email

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
              To upgrade or change your subscription plan, please contact our support team.
            </p>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-md p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Contact Support</p>
                  <a
                    href={`mailto:${supportEmail}?subject=Subscription Upgrade Request&body=Hello,%0D%0A%0D%0AI would like to upgrade my subscription plan.%0D%0ACurrent Plan: ${planName}%0D%0A%0D%0AThank you!`}
                    className="text-green-400 hover:text-green-300 font-medium text-sm break-all"
                  >
                    {supportEmail}
                  </a>
                </div>
              </div>
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
              window.location.href = `mailto:${supportEmail}?subject=Subscription Upgrade Request&body=Hello,%0D%0A%0D%0AI would like to upgrade my subscription plan.%0D%0ACurrent Plan: ${planName}%0D%0A%0D%0AThank you!`;
            }}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

