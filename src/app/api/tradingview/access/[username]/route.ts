import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createTradingViewService } from '@/lib/tradingview-service';

interface RequestBody {
  pine_ids: string[];
  duration?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { username } = params;
    const { searchParams } = new URL(request.url);
    const pineIdsParam = searchParams.get('pine_ids');
    
    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { error: 'Username parameter is required' },
        { status: 400 }
      );
    }

    if (!pineIdsParam) {
      return NextResponse.json(
        { error: 'pine_ids parameter is required' },
        { status: 400 }
      );
    }

    const pineIds = pineIdsParam.split(',').map(id => id.trim()).filter(Boolean);
    if (pineIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one pine_id is required' },
        { status: 400 }
      );
    }

    const tvService = createTradingViewService();
    if (!tvService) {
      return NextResponse.json(
        { error: 'TradingView service not configured' },
        { status: 503 }
      );
    }

    const initResult = await tvService.initialize();
    if (!initResult.success) {
      return NextResponse.json(
        { error: initResult.error || 'Failed to initialize TradingView service' },
        { status: 500 }
      );
    }

    const accessList = [];
    for (const pineId of pineIds) {
      try {
        const accessDetails = await tvService.getAccessDetails(username.trim(), pineId);
        accessList.push(accessDetails);
      } catch (error) {
        console.error(`Error getting access for pine_id ${pineId}:`, error);
        accessList.push({
          username: username.trim(),
          pine_id: pineId,
          access_granted: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({ accessList });
  } catch (error) {
    console.error('Error getting TradingView access details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { username } = params;
    const body: RequestBody = await request.json();
    const { pine_ids, duration } = body;
    
    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { error: 'Username parameter is required' },
        { status: 400 }
      );
    }

    if (!pine_ids || !Array.isArray(pine_ids) || pine_ids.length === 0) {
      return NextResponse.json(
        { error: 'pine_ids array is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (!duration || typeof duration !== 'string') {
      return NextResponse.json(
        { error: 'duration is required (e.g., "7d", "2m", "lifetime")' },
        { status: 400 }
      );
    }

    const tvService = createTradingViewService();
    if (!tvService) {
      return NextResponse.json(
        { error: 'TradingView service not configured' },
        { status: 503 }
      );
    }

    const initResult = await tvService.initialize();
    if (!initResult.success) {
      return NextResponse.json(
        { error: initResult.error || 'Failed to initialize TradingView service' },
        { status: 500 }
      );
    }

    let durationType: string;
    let durationNumber: number;
    
    if (duration === 'lifetime') {
      durationType = 'lifetime';
      durationNumber = 0;
    } else {
      const durationMatch = duration.match(/^(\d+)([dmw])$/);
      if (!durationMatch) {
        return NextResponse.json(
          { error: 'Invalid duration format. Use format like "7d", "2m", "1w", or "lifetime"' },
          { status: 400 }
        );
      }
      
      durationNumber = parseInt(durationMatch[1]);
      durationType = durationMatch[2];
    }

    const results = await tvService.bulkManageAccess(
      username.trim(),
      pine_ids,
      'grant',
      { type: durationType, number: durationNumber }
    );

    const hasErrors = results.some(result => !result.success);
    const responseStatus = hasErrors ? 207 : 200;

    return NextResponse.json({ 
      results,
      summary: {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    }, { status: responseStatus });
  } catch (error) {
    console.error('Error granting TradingView access:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { username } = params;
    const body: Pick<RequestBody, 'pine_ids'> = await request.json();
    const { pine_ids } = body;
    
    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { error: 'Username parameter is required' },
        { status: 400 }
      );
    }

    if (!pine_ids || !Array.isArray(pine_ids) || pine_ids.length === 0) {
      return NextResponse.json(
        { error: 'pine_ids array is required and cannot be empty' },
        { status: 400 }
      );
    }

    const tvService = createTradingViewService();
    if (!tvService) {
      return NextResponse.json(
        { error: 'TradingView service not configured' },
        { status: 503 }
      );
    }

    const initResult = await tvService.initialize();
    if (!initResult.success) {
      return NextResponse.json(
        { error: initResult.error || 'Failed to initialize TradingView service' },
        { status: 500 }
      );
    }

    const results = await tvService.bulkManageAccess(
      username.trim(),
      pine_ids,
      'remove'
    );

    const hasErrors = results.some(result => !result.success);
    const responseStatus = hasErrors ? 207 : 200;

    return NextResponse.json({ 
      results,
      summary: {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    }, { status: responseStatus });
  } catch (error) {
    console.error('Error removing TradingView access:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}