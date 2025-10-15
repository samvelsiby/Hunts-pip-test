'use client';

import { useUser, UserButton } from "@clerk/nextjs";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import KeywordInputComponent from '@/components/KeywordInputComponent';

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();

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
      <KeywordInputComponent />
    </div>
  );
}
