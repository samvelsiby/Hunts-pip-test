import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createTradingViewService } from '@/lib/tradingview-service';

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
    
    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { error: 'Username parameter is required' },
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

    const validationResult = await tvService.validateUsername(username.trim());
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error || 'Failed to validate username' },
        { status: 500 }
      );
    }

    return NextResponse.json(validationResult.data);
  } catch (error) {
    console.error('Error validating TradingView username:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}