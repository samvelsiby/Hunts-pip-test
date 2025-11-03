"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PageBreadcrumbs from '@/components/PageBreadcrumbs'
import { ensureUserSubscription } from '@/lib/supabase-auth'

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabaseBrowser.auth.getSession()
      if (data.session) {
        // Ensure user has subscription record
        const user = data.session.user
        await ensureUserSubscription(user)
        router.replace(redirectTo)
      }
    }
    
    checkSession()
    
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange(async (_e, session) => {
      if (session) {
        // Ensure user has subscription record
        await ensureUserSubscription(session.user)
        router.replace(redirectTo)
      }
    })
    
    return () => { sub.subscription.unsubscribe() }
  }, [router, redirectTo])

  const signUpEmail = async () => {
    // Validate inputs
    if (!email) {
      setMessage('Please enter your email address')
      return
    }
    
    if (!password) {
      setMessage('Please enter a password')
      return
    }
    
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters')
      return
    }
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }
    
    try {
      setLoading(true)
      setMessage(null)
      
      // Sign up with email and password
      const { data, error } = await supabaseBrowser.auth.signUp({ 
        email, 
        password, 
        options: { 
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined 
        } 
      })
      
      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }
      
      // If email confirmations are disabled, Supabase may return a session
      if (data.session && data.user) {
        // Ensure user has subscription record
        await ensureUserSubscription(data.user)
        router.replace(redirectTo)
        return
      }
      
      // Otherwise try to sign in immediately (works if confirmations are off)
      const { data: signInData, error: signInErr } = await supabaseBrowser.auth.signInWithPassword({ email, password })
      
      if (signInErr) {
        setMessage('Account created. Please verify your email, then sign in.')
      } else if (signInData.user) {
        // Ensure user has subscription record
        await ensureUserSubscription(signInData.user)
        router.replace(redirectTo)
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'An error occurred during sign up')
    } finally {
      setLoading(false)
    }
  }

  const signInGoogle = async () => {
    try {
      setLoading(true)
      setMessage(null)
      const { error } = await supabaseBrowser.auth.signInWithOAuth({ 
        provider: 'google', 
        options: { 
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        } 
      })
      
      if (error) {
        setMessage(error.message)
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'An error occurred with Google sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #DD0000 0%, #FF5B41 50%, transparent 70%)' }} />
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageBreadcrumbs />
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Sign up with your email/password or Google</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <Input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && signUpEmail()}
            />
            {message && <p className="text-sm text-red-400">{message}</p>}
            <div className="flex gap-3">
              <Button onClick={signUpEmail} disabled={loading} className="flex-1">Create Account</Button>
              <Button variant="outline" onClick={signInGoogle} disabled={loading} className="flex-1">Google</Button>
            </div>
            <p className="text-xs text-gray-500">Already have an account? <Link className="text-[#FF5B41]" href="/login">Login</Link></p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
