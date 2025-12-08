import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Sanity webhook secret for verification (optional but recommended)
const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  try {
    // Verify webhook secret if configured
    if (SANITY_WEBHOOK_SECRET) {
      const authHeader = req.headers.get('authorization')
      if (authHeader !== `Bearer ${SANITY_WEBHOOK_SECRET}`) {
        console.error('❌ Unauthorized webhook request - invalid secret')
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    const body = await req.json()
    const { _type, _id, slug } = body

    console.log(`🔄 Sanity webhook received: ${_type} - ${_id}`)

    // Revalidate based on document type
    if (_type === 'indicator') {
      // Revalidate the library listing page
      revalidatePath('/library', 'page')
      await revalidateTag('indicators', 'page')
      await revalidateTag('sanity-content', 'page')
      
      // If we have a slug, also revalidate the specific indicator page
      if (slug?.current) {
        revalidatePath(`/library/${slug.current}`, 'page')
        await revalidateTag(`indicator-${slug.current}`, 'page')
        console.log(`✅ Revalidated indicator page: /library/${slug.current}`)
      }
      
      // Revalidate by document ID as well
      await revalidateTag(`indicator-${_id}`, 'page')
      console.log(`✅ Revalidated library listing and indicator: ${_id}`)
    } else {
      // For any other document type, revalidate all Sanity content
      revalidatePath('/library', 'page')
      await revalidateTag('sanity-content', 'page')
      console.log(`✅ Revalidated all Sanity content`)
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: _type,
      id: _id,
      message: `Successfully revalidated ${_type}`,
    })
  } catch (error) {
    console.error('❌ Error revalidating Sanity content:', error)
    return NextResponse.json(
      { 
        message: 'Error revalidating', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}

// Allow GET for testing
export async function GET() {
  return NextResponse.json({
    message: 'Sanity revalidation webhook endpoint',
    usage: 'POST to /api/revalidate/sanity with Sanity webhook payload',
    status: 'ready',
  })
}

