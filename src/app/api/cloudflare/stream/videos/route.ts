import { NextResponse } from 'next/server'
import { listStreamVideos } from '@/lib/cloudflare-stream'

export async function GET() {
  try {
    const videos = await listStreamVideos()
    return NextResponse.json({ success: true, videos })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}


