import { NextResponse } from 'next/server'
import { supabaseBrowser } from '@/lib/supabase-browser'

export async function GET() {
  try {
    const { data: sessionData } = await supabaseBrowser.auth.getSession()
    const { data: userData } = await supabaseBrowser.auth.getUser()
    return NextResponse.json({ session: sessionData.session ?? null, user: userData.user ?? null })
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
