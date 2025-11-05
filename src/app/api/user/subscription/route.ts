import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserSubscription } from '@/lib/data-access-layer';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use data access layer to get subscription (enforces access control)
    const result = await getUserSubscription(userId);
    
    if (!result.authorized) {
      return NextResponse.json(
        { error: result.error?.message || 'Unauthorized access' },
        { status: 403 }
      );
    }

    if (result.error) {
      console.error('Error fetching subscription:', result.error);
      // Return default subscription if error
      return NextResponse.json({
        plan_type: 'free',
        status: 'active'
      });
    }

    return NextResponse.json(result.data || {
      plan_type: 'free',
      status: 'active'
    });
  } catch (error) {
    console.error('Error getting subscription:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription' },
      { status: 500 }
    );
  }
}

