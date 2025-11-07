import { NextResponse } from 'next/server'
import { client, indicatorsQuery } from '@/lib/sanity'

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    config: {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID 
        ? `${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID.substring(0, 8)}...` 
        : '❌ NOT SET',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      hasToken: !!process.env.SANITY_API_TOKEN,
    },
  }

  try {
    // Test a simple query
    const testQuery = `*[_type == "indicator"][0...1] { _id, title }`
    const testResult = await client.fetch(testQuery)
    
    diagnostics.testQuery = {
      success: true,
      resultCount: testResult?.length || 0,
      sample: testResult?.[0] || null,
    }

    // Test the full indicators query
    const indicators = await client.fetch(indicatorsQuery)
    
    diagnostics.fullQuery = {
      success: true,
      resultCount: indicators?.length || 0,
    }

    return NextResponse.json({
      status: 'success',
      ...diagnostics,
    })
  } catch (error) {
    diagnostics.error = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }

    return NextResponse.json(
      {
        status: 'error',
        ...diagnostics,
      },
      { status: 500 }
    )
  }
}

