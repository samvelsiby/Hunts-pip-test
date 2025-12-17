import { CLOUDFLARE_STREAM } from '@/config/cloudflare-stream'

type CloudflareApiResult<T> = {
  success: boolean
  errors: Array<{ code: number; message: string }>
  messages: Array<{ code: number; message: string }>
  result: T
}

export type CloudflareStreamVideo = {
  uid: string
  created: string
  modified: string
  size: number
  duration: number
  status: { state: string; pctComplete?: string; errorReasonCode?: string; errorReasonText?: string }
  meta?: Record<string, unknown>
  playback?: { hls?: string; dash?: string }
}

function getToken() {
  const token = process.env.CLOUDFLARE_STREAM_API_TOKEN
  if (!token) throw new Error('CLOUDFLARE_STREAM_API_TOKEN is not set')
  return token
}

export async function listStreamVideos() {
  const token = getToken()
  const res = await fetch(`${CLOUDFLARE_STREAM.apiBase}/accounts/${CLOUDFLARE_STREAM.accountId}/stream`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // Cloudflare list endpoint can be cached briefly if desired
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Cloudflare Stream API error: ${res.status}`)
  const data = (await res.json()) as CloudflareApiResult<CloudflareStreamVideo[]>
  if (!data.success) throw new Error(data.errors?.[0]?.message || 'Cloudflare Stream API returned success=false')
  return data.result
}


