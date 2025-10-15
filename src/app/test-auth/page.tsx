'use client';

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function TestAuth() {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded">
            <h2 className="font-semibold mb-2">Status:</h2>
            <p>Loaded: {isLoaded ? 'Yes' : 'No'}</p>
            <p>Signed In: {isSignedIn ? 'Yes' : 'No'}</p>
            {user && (
              <div>
                <p>User ID: {user.id}</p>
                <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <SignInButton>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Sign In
              </button>
            </SignInButton>
            
            <SignUpButton>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Sign Up
              </button>
            </SignUpButton>
            
            {isSignedIn && (
              <UserButton afterSignOutUrl="/" />
            )}
          </div>

          <div className="p-4 bg-yellow-50 rounded">
            <h3 className="font-semibold mb-2">Environment Check:</h3>
            <p>Publishable Key: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not Set'}</p>
            <p>Key starts with: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 10)}...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
