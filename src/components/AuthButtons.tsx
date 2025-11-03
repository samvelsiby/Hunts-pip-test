'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSupabaseUser } from "@/lib/useSupabaseUser";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function AuthButtons() {
  const { user, loading } = useSupabaseUser();

  if (loading) {
    return <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>;
  }

  if (user) {
    return (
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <Link 
          href="/dashboard"
          className="w-full lg:w-auto text-center px-5 py-2 text-white text-sm border border-gray-600 rounded-full hover:bg-gray-800 transition-colors"
        >
          Dashboard
        </Link>
        <Button variant="outline" onClick={() => supabaseBrowser.auth.signOut()}>Logout</Button>
      </div>
    );
  }

  return (
    <Link href="/login" className="w-full lg:w-auto px-6 py-2 text-white text-sm bg-black border border-white rounded-full hover:bg-gray-900 transition-colors">
      Login
    </Link>
  );
}
