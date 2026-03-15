import { NextRequest, NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs/server';
import { createTradingViewBrowserService, ScriptAccessRequest } from '@/lib/tradingview-browser-service';
// import { getUserData, grantPineScriptAccess } from '@/lib/data-access-layer';

// Tier-based script access configuration
const TIER_SCRIPTS = {
  basic: ['jZux9ArT-Ultimate-SMC-HuntsPip'], // Ultimate SMC (HuntsPip)
  pro: ['jZux9ArT-Ultimate-SMC-HuntsPip'], // Same script for all tiers for now
  enterprise: ['jZux9ArT-Ultimate-SMC-HuntsPip'] // Can add more scripts later
} as const;

const TIER_DURATIONS = {
  basic: '30d',
  pro: '90d', 
  enterprise: '1y'
} as const;

interface GrantAccessBody {
  tradingview_username: string;
  tier: 'basic' | 'pro' | 'enterprise';
  duration?: string;
  custom_script_ids?: string[];
}

export async function POST(req: NextRequest) {
  try {
    // const { userId } = auth();
    
    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // For testing, we'll skip auth
    // const userResult = await getUserData(userId);
    // if (!userResult.data || !userResult.authorized) {
    //   return NextResponse.json({ error: 'User not found' }, { status: 404 });
    // }
    // const user = userResult.data;

    const body: GrantAccessBody = await req.json();
    const { tradingview_username, tier, duration, custom_script_ids } = body;

    if (!tradingview_username || !tier) {
      return NextResponse.json({ 
        error: 'Missing required fields: tradingview_username, tier' 
      }, { status: 400 });
    }

    // Validate tier
    if (!['basic', 'pro', 'enterprise'].includes(tier)) {
      return NextResponse.json({ 
        error: 'Invalid tier. Must be basic, pro, or enterprise' 
      }, { status: 400 });
    }

    // Determine script IDs based on tier or use custom ones
    const scriptIds = custom_script_ids || TIER_SCRIPTS[tier];
    const accessDuration = duration || TIER_DURATIONS[tier];

    // Create TradingView service
    const tvService = createTradingViewBrowserService();
    if (!tvService) {
      return NextResponse.json({ 
        error: 'TradingView service not available' 
      }, { status: 503 });
    }

    try {
      console.log(`🚀 Starting access grant process for ${tradingview_username} (${tier})`);
      
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

      // Validate TradingView username
      const usernameValidation = await tvService.validateUsername(tradingview_username);
      if (!usernameValidation.valid) {
        return NextResponse.json({ 
          error: 'Invalid TradingView username',
          suggestions: usernameValidation.suggestions 
        }, { status: 400 });
      }

      // Grant access to scripts
      const accessRequest: ScriptAccessRequest = {
        username: tradingview_username,
        scriptIds,
        duration: accessDuration,
        tier
      };

      const grantResult = await tvService.grantScriptAccess(accessRequest);

      // Log the operation in database (disabled for testing)
      // try {
      //   for (const result of grantResult.results) {
      //     await grantPineScriptAccess(
      //       userId,
      //       result.scriptId,
      //       tradingview_username,
      //       accessDuration.endsWith('d') ? 'd' : 'm',
      //       parseInt(accessDuration.replace(/\D/g, '')) || 30
      //     );
      //   }
      // } catch (logError) {
      //   console.error('Failed to log access operation in database:', logError);
      //   // Continue even if database logging fails
      // }

      return NextResponse.json({
        success: grantResult.success,
        message: grantResult.success 
          ? `Successfully granted ${tier} access to ${tradingview_username}`
          : `Partial success - some scripts may not have been granted access`,
        results: grantResult.results,
        errors: grantResult.errors,
        tier,
        duration: accessDuration,
        scriptsGranted: grantResult.results.filter(r => r.success).length,
        totalScripts: scriptIds.length
      });

    } finally {
      // Always cleanup browser resources
      await tvService.cleanup();
    }

  } catch (error) {
    console.error('Grant access error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : undefined
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // const { userId } = auth();
    
    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Return available tiers and their associated scripts
    return NextResponse.json({
      available_tiers: {
        basic: {
          duration: TIER_DURATIONS.basic,
          scripts: TIER_SCRIPTS.basic,
          description: 'Basic tier with essential indicators'
        },
        pro: {
          duration: TIER_DURATIONS.pro,
          scripts: TIER_SCRIPTS.pro,
          description: 'Pro tier with advanced indicators and tools'
        },
        enterprise: {
          duration: TIER_DURATIONS.enterprise,
          scripts: TIER_SCRIPTS.enterprise,
          description: 'Enterprise tier with full access to all premium indicators'
        }
      },
      usage: {
        endpoint: 'POST /api/tradingview/grant-access',
        required_fields: ['tradingview_username', 'tier'],
        optional_fields: ['duration', 'custom_script_ids'],
        example: {
          tradingview_username: 'user123',
          tier: 'pro',
          duration: '90d'
        }
      }
    });

  } catch (error) {
    console.error('Get tiers error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}