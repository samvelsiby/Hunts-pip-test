"use client";

import { useState } from 'react'
import Link from 'next/link'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PageBreadcrumbs from '@/components/PageBreadcrumbs'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const signInEmail = async () => {
    setLoading(true)
    setMessage(null)
    const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setMessage(error.message)
    else setMessage('Signed in successfully.')
  }

  const signUpEmail = async () => {
    setLoading(true)
    setMessage(null)
    const { error } = await supabaseBrowser.auth.signUp({ email, password })
    setLoading(false)
    if (error) setMessage(error.message)
    else setMessage('Signup successful. Check your inbox for confirmation if required.')
  }

  const signInGoogle = async () => {
    setLoading(true)
    const { error } = await supabaseBrowser.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: typeof window !== 'undefined' ? window.location.origin + '/dashboard' : undefined } })
    if (error) setMessage(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div
          className="absolute top-0 left-0 w-[600px] h-[600px] opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #DD0000 0%, #FF5B41 50%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageBreadcrumbs />

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Use your email and password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button onClick={signInEmail} disabled={loading}>Sign In</Button>
              <Button variant="outline" onClick={signInGoogle} disabled={loading}>Continue with Google</Button>
              {message && <p className="text-sm text-gray-400">{message}</p>}
              <p className="text-xs text-gray-500">Don&apos;t have an account? <Link className="text-[#FF5B41]" href="#" onClick={(e)=>{e.preventDefault(); signUpEmail();}}>Sign up</Link></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button onClick={signUpEmail} disabled={loading}>Create Account</Button>
              <Button variant="outline" onClick={signInGoogle} disabled={loading}>Continue with Google</Button>
              {message && <p className="text-sm text-gray-400">{message}</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
