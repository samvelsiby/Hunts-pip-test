"use client";

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'

export default function DebugAuthStatus() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [sessionOk, setSessionOk] = useState<boolean | null>(null)
  const [dbOk, setDbOk] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const { data: sess } = await supabaseBrowser.auth.getSession()
        setSessionOk(!!sess.session)
        const { data: u } = await supabaseBrowser.auth.getUser()
        setUserEmail(u.user?.email ?? null)
        const { error: dbErr } = await supabaseBrowser
          .from('user_subscriptions')
          .select('id')
          .limit(1)
        setDbOk(!dbErr)
        if (dbErr) setError(dbErr.message)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'unknown error')
      }
    })()
  }, [])

  return (
    <div className="mb-3 rounded-md border border-gray-800 bg-gray-900/60 p-3 text-xs text-gray-400">
      <div>Auth session: {sessionOk === null ? '...' : sessionOk ? 'yes' : 'no'}</div>
      <div>User email: {userEmail ?? 'null'}</div>
      <div>DB reachable: {dbOk === null ? '...' : dbOk ? 'yes' : 'no'}</div>
      {error && <div className="text-red-400">Error: {error}</div>}
    </div>
  )
}

