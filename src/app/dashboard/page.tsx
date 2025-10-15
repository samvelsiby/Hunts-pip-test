'use client';

import { useUser, UserButton } from "@clerk/nextjs";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import KeywordInputComponent from '@/components/KeywordInputComponent';

function DashboardContent() {
  const { isLoaded, isSignedIn, user } = useUser();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
          <p className="text-gray-300 mb-6">You need to sign in to access the dashboard.</p>
          <div className="flex gap-4 justify-center">
            <SignInButton>
              <button className="px-6 py-3 bg-green-400 text-black rounded-lg hover:bg-green-500 transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-black font-bold text-lg">{`{}`}</span>
          </div>
          <span className="text-white text-xl font-bold">MUNTS PIP</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-white">Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}!</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Plan Selection Success Message */}
          {planId && (
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h2 className="text-xl font-semibold text-green-400">Plan Selected Successfully!</h2>
              </div>
              <p className="text-gray-300">
                You&apos;ve selected the <span className="text-green-400 font-semibold capitalize">{planId}</span> plan. 
                Complete your setup below to start using your trading indicators.
              </p>
            </div>
          )}

          {/* Dashboard Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Trading Setup */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Trading Setup</h3>
              <KeywordInputComponent />
            </div>

            {/* Plan Information */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Your Plan</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Plan</span>
                  <span className="text-green-400 font-semibold capitalize">{planId || 'Free'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Status</span>
                  <span className="text-green-400 font-semibold">Active</span>
                </div>

                {planId === 'free' && (
                  <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
                    <h4 className="text-blue-400 font-semibold mb-2">Free Plan Features</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Basic trading signals</li>
                      <li>• Limited keyword access</li>
                      <li>• Community support</li>
                    </ul>
                  </div>
                )}

                {planId === 'pro' && (
                  <div className="mt-6 p-4 bg-green-900/30 border border-green-500 rounded-lg">
                    <h4 className="text-green-400 font-semibold mb-2">Pro Plan Features</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Advanced trading signals</li>
                      <li>• Unlimited keyword access</li>
                      <li>• Priority support</li>
                      <li>• Custom alerts</li>
                    </ul>
                  </div>
                )}

                {planId === 'premium' && (
                  <div className="mt-6 p-4 bg-purple-900/30 border border-purple-500 rounded-lg">
                    <h4 className="text-purple-400 font-semibold mb-2">Premium Plan Features</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• All Pro features</li>
                      <li>• AI-powered insights</li>
                      <li>• 24/7 premium support</li>
                      <li>• Custom strategies</li>
                      <li>• API access</li>
                    </ul>
                  </div>
                )}

                <div className="mt-6">
                  <button className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                    Manage Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <button className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left">
                <div className="text-white font-semibold mb-2">View Trading Signals</div>
                <div className="text-gray-400 text-sm">Access your personalized indicators</div>
              </button>
              <button className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left">
                <div className="text-white font-semibold mb-2">Update Keywords</div>
                <div className="text-gray-400 text-sm">Modify your trading preferences</div>
              </button>
              <button className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left">
                <div className="text-white font-semibold mb-2">Account Settings</div>
                <div className="text-gray-400 text-sm">Manage your account details</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
      <DashboardContent />
    </Suspense>
  );
}
