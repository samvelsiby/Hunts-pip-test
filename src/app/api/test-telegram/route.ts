import { NextRequest, NextResponse } from 'next/server';
import { sendSubscriptionNotification } from '@/lib/telegram';
import { getBotInfo } from '@/lib/telegram';

/**
 * Test endpoint for Telegram notifications
 * GET /api/test-telegram - Test bot connection
 * POST /api/test-telegram - Send test notification
 */
export async function GET() {
  try {
    const botInfo = await getBotInfo();
    
    if (!botInfo.ok) {
      return NextResponse.json({
        error: 'Bot token not configured or invalid',
        botToken: process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Not set',
        groupId: process.env.TELEGRAM_GROUP_ID ? 'Set' : 'Not set',
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      bot: botInfo.result,
      botToken: process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Not set',
      groupId: process.env.TELEGRAM_GROUP_ID ? 'Set' : 'Not set',
      message: 'Bot is working! Check groupId is set to send messages.',
    });
  } catch (error) {
    console.error('Error testing bot:', error);
    return NextResponse.json({
      error: 'Failed to test bot',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { groupId } = await request.json().catch(() => ({}));
    
    // Check bot token
    const botInfo = await getBotInfo();
    if (!botInfo.ok) {
      return NextResponse.json({
        error: 'Bot token not configured or invalid',
        botToken: process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Not set',
      }, { status: 400 });
    }
    
    // Use provided groupId or from env
    const chatId = groupId || process.env.TELEGRAM_GROUP_ID;
    
    if (!chatId) {
      return NextResponse.json({
        error: 'Group ID not configured',
        message: 'Please provide groupId in request body or set TELEGRAM_GROUP_ID in .env.local',
        botToken: 'Set',
        groupId: 'Not set',
      }, { status: 400 });
    }
    
    // Send test notification
    const success = await sendSubscriptionNotification({
      clerkUserId: 'test_user_123',
      planId: 'premium',
      planName: 'Premium',
      frequency: 'monthly',
      amount: 3000, // $30.00 in cents
      currency: 'usd',
      customerId: 'cus_test_123',
      subscriptionId: 'sub_test_123',
      userEmail: 'test@example.com',
      userName: 'Test User',
    });
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Test notification sent successfully!',
        bot: botInfo.result,
        groupId: chatId,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send notification',
        bot: botInfo.result,
        groupId: chatId,
        message: 'Check server logs for details',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json({
      error: 'Failed to send test notification',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

