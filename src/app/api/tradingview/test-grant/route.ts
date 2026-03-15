import { NextRequest, NextResponse } from 'next/server';
import { createTradingViewBrowserService, ScriptAccessRequest } from '@/lib/tradingview-browser-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tradingview_username, tier = 'basic', duration = '30d' } = body;

    if (!tradingview_username) {
      return NextResponse.json({ 
        error: 'Missing required field: tradingview_username' 
      }, { status: 400 });
    }

    console.log(`🎯 Testing access grant for ${tradingview_username}`);

    // Create TradingView service
    const tvService = createTradingViewBrowserService();
    if (!tvService) {
      return NextResponse.json({ 
        error: 'TradingView service not available' 
      }, { status: 503 });
    }

    try {
      console.log(`🚀 Initializing browser for ${tradingview_username}`);
      
      // Initialize browser
      const initResult = await tvService.initialize();
      if (!initResult.success) {
        throw new Error(`Browser initialization failed: ${initResult.error}`);
      }

      // Authenticate
      const authResult = await tvService.authenticate();
      if (!authResult.success) {
        throw new Error(`Authentication failed: ${authResult.error}`);
      }

      // Grant access to Ultimate SMC script
      const accessRequest: ScriptAccessRequest = {
        username: tradingview_username,
        scriptIds: ['jZux9ArT-Ultimate-SMC-HuntsPip'],
        duration: duration,
        tier: tier as 'basic' | 'pro' | 'enterprise'
      };

      const grantResult = await tvService.grantScriptAccess(accessRequest);

      return NextResponse.json({
        success: grantResult.success,
        message: grantResult.success 
          ? `Successfully granted ${tier} access to ${tradingview_username}`
          : `Failed to grant access`,
        results: grantResult.results,
        errors: grantResult.errors,
        tier,
        duration,
        script: 'Ultimate SMC (HuntsPip)',
        script_id: 'jZux9ArT-Ultimate-SMC-HuntsPip'
      });

    } finally {
      // Always cleanup browser resources
      await tvService.cleanup();
    }

  } catch (error) {
    console.error('Test grant access error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'TradingView Test Grant Access Endpoint',
    usage: {
      method: 'POST',
      body: {
        tradingview_username: 'string (required)',
        tier: 'basic | pro | enterprise (optional, default: basic)',
        duration: 'string (optional, default: 30d)'
      },
      example: {
        tradingview_username: 'samvelsiby',
        tier: 'basic',
        duration: '30d'
      }
    },
    script_info: {
      name: 'Ultimate SMC (HuntsPip)',
      id: 'jZux9ArT-Ultimate-SMC-HuntsPip'
    }
  });
}