'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, Check } from 'lucide-react';

interface TradingViewUsernameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsername?: string | null;
  onSave: (username: string) => Promise<void>;
  required?: boolean; // If true, modal cannot be closed without saving
}

export function TradingViewUsernameModal({
  open,
  onOpenChange,
  currentUsername,
  onSave,
  required = false,
}: TradingViewUsernameModalProps) {
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Initialize username when modal opens
  useEffect(() => {
    if (open) {
      setUsername(currentUsername || '');
      setError('');
      setSuccess(false);
    }
  }, [open, currentUsername]);

  const handleSave = async () => {
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      setError('TradingView username is required');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      setSuccess(false);

      await onSave(trimmedUsername);
      
      setSuccess(true);
      // Close modal after 1.5 seconds on success
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save username');
    } finally {
      setIsSaving(false);
    }
  };

  const isEdit = !!currentUsername;
  const hasChanges = username.trim() !== (currentUsername || '');

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // If required, only allow closing if username is saved
      if (required && !newOpen && !success && !currentUsername) {
        // Don't allow closing if username is required and not saved
        return;
      }
      // If not required or username is saved, allow closing
      if (!required || success || currentUsername) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent 
        className="sm:max-w-md"
        showCloseButton={!required || success || !!currentUsername} // Only show close button if not required, saved, or already has username
        onInteractOutside={(e) => {
          // Prevent closing by clicking outside if required and not saved
          if (required && !success && !currentUsername) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing with Escape if required and not saved
          if (required && !success && !currentUsername) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {isEdit ? 'Update TradingView Username' : 'Enter TradingView Username'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isEdit 
              ? 'Update your TradingView username to continue receiving your subscription benefits.'
              : 'Your TradingView username is required to activate your subscription and receive indicators.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tradingview-username" className="text-white">
              TradingView Username
            </Label>
            <Input
              id="tradingview-username"
              placeholder="Enter your TradingView username (e.g., username123)"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              disabled={isSaving || success}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isSaving && hasChanges) {
                  handleSave();
                }
              }}
            />
            {currentUsername && (
              <p className="text-xs text-gray-500">
                Current: <span className="text-gray-400">{currentUsername}</span>
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-950/20 border border-red-500/30 rounded-md p-3 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-500">Error</p>
                <p className="text-xs text-gray-400 mt-1">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-950/20 border border-green-500/30 rounded-md p-3 flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-500">Success!</p>
                <p className="text-xs text-gray-400 mt-1">
                  Your TradingView username has been saved successfully.
                </p>
              </div>
            </div>
          )}

          <div className="bg-blue-950/20 border border-blue-500/30 rounded-md p-3">
            <p className="text-xs text-gray-300">
              <strong className="text-blue-400">Important:</strong> Your TradingView username is required to grant you access to premium indicators. Make sure you enter the correct username from your TradingView account.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={isSaving || success || !hasChanges || !username.trim()}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : success ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Saved!
              </>
            ) : isEdit ? (
              'Update Username'
            ) : (
              'Save Username'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

