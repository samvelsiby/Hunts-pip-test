'use client';

import dynamic from 'next/dynamic';
import BackgroundParticles from '@/components/BackgroundParticles'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// Dynamically import SignIn with SSR disabled to prevent hydration errors
const SignIn = dynamic(
  () => import('@clerk/nextjs').then((mod) => mod.SignIn),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full max-w-md h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00dd5e] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
);

function SignInContent() {
  const searchParams = useSearchParams();
  const tier = searchParams.get('tier');
  const frequency = searchParams.get('frequency');
  
  // If plan info is present, redirect to payment handler after sign-in
  const redirectUrl = tier && frequency 
    ? `/redirect-to-payment?tier=${encodeURIComponent(tier)}&frequency=${encodeURIComponent(frequency)}`
    : '/dashboard';

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Corner gradient */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-[600px] h-[600px] opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #DD0000 0%, #FF5B41 50%, transparent 70%)',
          }}
        />
      </div>
      
      {/* Background particles effect */}
      <BackgroundParticles />

      {/* Navigation Bar - Logo Only */}
      <nav className="relative z-50 flex items-center justify-center px-4 sm:px-8 py-4 bg-black/50 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image 
            src="/hunts-pip-logo.svg" 
            alt="HUNTS PIP Logo" 
            width={120} 
            height={32}
            className="sm:w-[150px] sm:h-[40px]"
            priority
          />
        </Link>
      </nav>

      {/* Clerk Sign In Component */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md relative">
          {/* Green Gradient Glow Behind Component */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-30 blur-2xl -z-10"
            style={{
              background: 'radial-gradient(circle, #00dd5e 0%, transparent 70%)',
            }}
          />
          <SignIn
            fallbackRedirectUrl={redirectUrl}
            appearance={{
              elements: {
                formButtonPrimary: 'bg-[#ff0000] hover:bg-[#DD0000] text-white text-sm normal-case border-2 border-[#00dd5e] transition-all hover:scale-105 shadow-lg',
                card: 'bg-transparent shadow-none',
                headerTitle: 'text-white text-2xl font-bold',
                headerSubtitle: 'text-gray-300',
                socialButtonsBlockButton: 'bg-gray-800/50 border border-gray-700/50 text-white hover:bg-gray-700/50 hover:border-gray-600/50 transition-all',
                formFieldInput: 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:border-[#00dd5e] focus:ring-2 focus:ring-[#00dd5e]/20',
                formFieldLabel: 'text-gray-300',
                footerActionLink: 'text-[#00dd5e] hover:text-[#00dd5e]/80 transition-colors',
                identityPreviewText: 'text-white',
                identityPreviewEditButton: 'text-[#00dd5e] hover:text-[#00dd5e]/80',
                formResendCodeLink: 'text-[#00dd5e] hover:text-[#00dd5e]/80',
                dividerLine: 'bg-gray-700',
                dividerText: 'text-gray-400',
                footer: 'text-gray-400',
                footerLink: 'text-[#00dd5e] hover:text-[#00dd5e]/80',
                formFieldErrorText: 'text-red-400',
                alertText: 'text-red-400',
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00dd5e] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
