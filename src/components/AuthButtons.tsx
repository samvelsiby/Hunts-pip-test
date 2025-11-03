'use client';

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function AuthButtons() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>;
  }

  if (isSignedIn) {
    return (
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <Link 
          href="/dashboard"
          className="w-full lg:w-auto text-center px-5 py-2 text-white text-sm border border-gray-600 rounded-full hover:bg-gray-800 transition-colors"
        >
          Dashboard
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    );
  }

  return (
    <Link href="/auth" className="w-full lg:w-auto px-6 py-2 text-white text-sm bg-black border border-white rounded-full hover:bg-gray-900 transition-colors">
      Login
    </Link>
  );
}
