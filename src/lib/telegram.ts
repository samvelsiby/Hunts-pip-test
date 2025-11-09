/**
 * Telegram Notification Service
 * Sends messages to Telegram groups/channels when subscriptions are created
 * 
 * Uses Telegram Bot API - easier to set up than WhatsApp
 */

// Helper function to escape HTML special characters
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

interface TelegramMessage {
  chatId: string; // Group ID or Channel ID
  message: string;
}

interface SubscriptionNotification {
  clerkUserId: string;
  planId: string;
  planName: string;
  frequency: string;
  amount: number;
  currency: string;
  customerId: string;
  subscriptionId: string;
  userEmail?: string;
  userName?: string;
}

/**
 * Send message to Telegram using Bot API
 */
async function sendTelegramMessage(message: TelegramMessage): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_GROUP_ID || message.chatId;

  if (!botToken) {
    console.error('❌ Telegram Bot Token not configured');
    return false;
  }

  if (!chatId) {
    console.error('❌ Telegram Group ID not configured');
    return false;
  }

  try {
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message.message,
        parse_mode: 'HTML', // Use HTML for better compatibility and easier formatting
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Telegram API error:', error);
      return false;
    }

    const data = await response.json();
    if (data.ok) {
      console.log('✅ Telegram message sent successfully:', data.result.message_id);
      return true;
    } else {
      console.error('❌ Telegram API returned error:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending Telegram message:', error);
    return false;
  }
}

/**
 * Format subscription notification message for Telegram
 */
function formatSubscriptionMessage(data: SubscriptionNotification): string {
  const planName = data.planName.charAt(0).toUpperCase() + data.planName.slice(1);
  const amount = (data.amount / 100).toFixed(2); // Convert cents to dollars
  const frequency = data.frequency === 'monthly' ? 'Monthly' : 'Yearly';
  
  // Build user info section
  let userInfo = '';
  if (data.userName) {
    userInfo += `👤 <b>Name:</b> ${escapeHtml(data.userName)}\n`;
  }
  if (data.userEmail) {
    userInfo += `📧 <b>Email:</b> ${escapeHtml(data.userEmail)}\n`;
  }
  if (!userInfo) {
    userInfo = `👤 <b>User ID:</b> <code>${data.clerkUserId}</code>\n`;
  }
  
  return `🎉 <b>New Subscription Created!</b>

${userInfo}📦 <b>Plan:</b> ${escapeHtml(planName)} (${escapeHtml(frequency)})
💰 <b>Amount:</b> ${data.currency.toUpperCase()} ${amount}
🆔 <b>Customer ID:</b> <code>${data.customerId}</code>
📝 <b>Subscription ID:</b> <code>${data.subscriptionId}</code>

✅ Subscription is now active!`;
}

/**
 * Send subscription notification to Telegram group/channel
 */
export async function sendSubscriptionNotification(
  data: SubscriptionNotification
): Promise<boolean> {
  const chatId = process.env.TELEGRAM_GROUP_ID;

  if (!chatId) {
    console.error('❌ Telegram Group ID not configured');
    return false;
  }

  const message = formatSubscriptionMessage(data);
  const telegramMessage: TelegramMessage = {
    chatId,
    message,
  };

  console.log('📱 Sending Telegram notification:', {
    chatId,
    planId: data.planId,
  });

  try {
    const success = await sendTelegramMessage(telegramMessage);
    
    if (success) {
      console.log('✅ Telegram notification sent successfully');
    } else {
      console.error('❌ Failed to send Telegram notification');
    }

    return success;
  } catch (error) {
    console.error('❌ Error sending Telegram notification:', error);
    return false;
  }
}

/**
 * Get bot info (for testing)
 */
export async function getBotInfo(): Promise<{ ok: boolean; result?: { id: number; is_bot: boolean; first_name: string; username: string; [key: string]: unknown } }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    return { ok: false };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error getting bot info:', error);
    return { ok: false };
  }
}

