"use client";

import { useEffect, useState } from 'react'
import { supabaseBrowser } from './supabase-browser'

export function useSupabaseUser() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Awaited<ReturnType<typeof supabaseBrowser.auth.getSession>>['data']['session']>(null)
  const [user, setUser] = useState<Awaited<ReturnType<typeof supabaseBrowser.auth.getUser>>['data']['user'] | null>(null)

  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        const { data: sessData } = await supabaseBrowser.auth.getSession()
        if (!mounted) return
        setSession(sessData.session)

        // Try to resolve user even if session is temporarily null
        const { data: userData } = await supabaseBrowser.auth.getUser()
        if (!mounted) return
        setUser(userData.user ?? null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    const { data: sub } = supabaseBrowser.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      const { data: userData } = await supabaseBrowser.auth.getUser()
      setUser(userData.user ?? null)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return { session, user, loading }
}
