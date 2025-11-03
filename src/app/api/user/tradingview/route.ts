import { NextRequest, NextResponse } from 'next/server';
import { getTradingViewUsername, updateTradingViewUsername } from '@/lib/clerk-utils';

export async function GET() {
  try {
    const username = await getTradingViewUsername();
    
    if (username) {
      return NextResponse.json({ username });
    } else {
      return NextResponse.json({ username: null });
    }
  } catch (error) {
    console.error('Error getting TradingView username:', error);
    return NextResponse.json(
      { error: 'Failed to get TradingView username' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const success = await updateTradingViewUsername(username);

    if (success) {
      return NextResponse.json({ success: true, username });
    } else {
      return NextResponse.json(
        { error: 'Failed to update TradingView username' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating TradingView username:', error);
    return NextResponse.json(
      { error: 'Failed to update TradingView username' },
      { status: 500 }
    );
  }
}
