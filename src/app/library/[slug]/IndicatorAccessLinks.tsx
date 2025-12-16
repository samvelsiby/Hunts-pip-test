'use client'

import { useEffect, useMemo, useState } from 'react'
import { SignInButton, useUser } from '@clerk/nextjs'
import TradingViewButton from '@/components/TradingViewButton'
import PurchaseButton from '@/components/PurchaseButton'

type Plan = 'free' | 'premium' | 'ultimate'

const PLAN_RANK: Record<Plan, number> = {
  free: 0,
  premium: 1,
  ultimate: 2,
}

function normalizePlan(plan: unknown): Plan {
  if (plan === 'ultimate') return 'ultimate'
  if (plan === 'premium' || plan === 'pro') return 'premium'
  return 'free'
}

export default function IndicatorAccessLinks(props: {
  indicatorPlanAccess: Plan
  tradingViewLink?: string
  themeColor: string
}) {
  const { indicatorPlanAccess, tradingViewLink, themeColor } = props
  const { isLoaded, isSignedIn } = useUser()

  const [userPlan, setUserPlan] = useState<Plan>('free')
  const [isFetchingPlan, setIsFetchingPlan] = useState(false)

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    let cancelled = false
    setIsFetchingPlan(true)

    fetch('/api/user/subscription')
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to fetch subscription: ${res.status}`)
        return await res.json()
      })
      .then((data) => {
        if (cancelled) return
        setUserPlan(normalizePlan(data?.plan_type))
      })
      .catch(() => {
        if (cancelled) return
        setUserPlan('free')
      })
      .finally(() => {
        if (cancelled) return
        setIsFetchingPlan(false)
      })

    return () => {
      cancelled = true
    }
  }, [isLoaded, isSignedIn])

  const hasAccess = useMemo(() => {
    if (!isSignedIn) return false
    return PLAN_RANK[userPlan] >= PLAN_RANK[indicatorPlanAccess]
  }, [indicatorPlanAccess, isSignedIn, userPlan])

  // Requirement: links should be shown ONLY for logged-in users
  if (!isLoaded) return null

  if (!isSignedIn) {
    return (
      <div className="flex flex-col sm:flex-row gap-4">
        <SignInButton>
          <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white text-sm font-semibold bg-[#FF5B41] hover:bg-[#DD0000] transition-colors">
            Sign in to view indicator link
          </button>
        </SignInButton>
      </div>
    )
  }

  if (isFetchingPlan) {
    return (
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-gray-300 text-sm font-medium bg-black/40 border border-gray-700">
          Checking your access…
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col sm:flex-row gap-4">
        <PurchaseButton href="/pricing" themeColor={themeColor}>
          Upgrade to Access
        </PurchaseButton>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {tradingViewLink ? (
        <TradingViewButton href={tradingViewLink}>
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z" />
          </svg>
          TradingView Indicator Link
        </TradingViewButton>
      ) : (
        <div className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-gray-300 text-sm font-medium bg-black/40 border border-gray-700">
          Link not available yet.
        </div>
      )}
    </div>
  )
}


