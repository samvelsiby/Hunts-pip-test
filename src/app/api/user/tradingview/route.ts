import { NextRequest, NextResponse } from 'next/server';

// Temporary neutral implementations to avoid runtime failures during auth migration
// TODO: Replace with Supabase-backed persistence tied to authenticated user

export async function GET() {
  try {
    return NextResponse.json({ username: null });
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

    // Echo success for now
    return NextResponse.json({ success: true, username });
  } catch (error) {
    console.error('Error updating TradingView username:', error);
    return NextResponse.json(
      { error: 'Failed to update TradingView username' },
      { status: 500 }
    );
  }
}
