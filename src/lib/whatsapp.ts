/**
 * WhatsApp Notification Service
 * Sends messages to WhatsApp groups when subscriptions are created
 * 
 * Supports multiple WhatsApp APIs:
 * 1. WhatsApp Business API (via Meta)
 * 2. Twilio WhatsApp API
 * 3. WhatsApp Web API (via services like Wati.io, ChatAPI, etc.)
 */

interface WhatsAppMessage {
  to: string; // Group ID or phone number
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
 * Send WhatsApp message using WhatsApp Business API (Meta)
 */
async function sendViaWhatsAppBusinessAPI(message: WhatsAppMessage): Promise<boolean> {
  const apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.error('❌ WhatsApp Business API credentials not configured');
    return false;
  }

  try {
    const response = await fetch(`${apiUrl}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: message.to,
        type: 'text',
        text: {
          body: message.message,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ WhatsApp API error:', error);
      return false;
    }

    const data = await response.json();
    console.log('✅ WhatsApp message sent:', data);
    return true;
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error);
    return false;
  }
}

/**
 * Send WhatsApp message using Twilio API
 */
async function sendViaTwilio(message: WhatsAppMessage): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM; // Format: whatsapp:+14155238886

  if (!accountSid || !authToken || !fromNumber) {
    console.error('❌ Twilio credentials not configured');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: `whatsapp:${message.to}`,
          Body: message.message,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Twilio API error:', error);
      return false;
    }

    const data = await response.json();
    console.log('✅ WhatsApp message sent via Twilio:', data.sid);
    return true;
  } catch (error) {
    console.error('❌ Error sending WhatsApp message via Twilio:', error);
    return false;
  }
}

/**
 * Send WhatsApp message using generic webhook/API
 */
async function sendViaWebhook(message: WhatsAppMessage): Promise<boolean> {
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  const apiKey = process.env.WHATSAPP_WEBHOOK_API_KEY;

  if (!webhookUrl) {
    console.error('❌ WhatsApp webhook URL not configured');
    return false;
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
      headers['X-API-Key'] = apiKey;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to: message.to,
        message: message.message,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ WhatsApp webhook error:', error);
      return false;
    }

    console.log('✅ WhatsApp message sent via webhook');
    return true;
  } catch (error) {
    console.error('❌ Error sending WhatsApp message via webhook:', error);
    return false;
  }
}

/**
 * Format subscription notification message
 */
function formatSubscriptionMessage(data: SubscriptionNotification): string {
  const planName = data.planName.charAt(0).toUpperCase() + data.planName.slice(1);
  const amount = (data.amount / 100).toFixed(2); // Convert cents to dollars
  const frequency = data.frequency === 'monthly' ? 'Monthly' : 'Yearly';
  
  return `🎉 *New Subscription Created!*

👤 *User:* ${data.userName || data.userEmail || data.clerkUserId}
📦 *Plan:* ${planName} (${frequency})
💰 *Amount:* ${data.currency.toUpperCase()} ${amount}
🆔 *Customer ID:* ${data.customerId}
📝 *Subscription ID:* ${data.subscriptionId}

✅ Subscription is now active!`;
}

/**
 * Send subscription notification to WhatsApp group
 */
export async function sendSubscriptionNotification(
  data: SubscriptionNotification
): Promise<boolean> {
  const groupId = process.env.WHATSAPP_GROUP_ID;
  const provider = process.env.WHATSAPP_PROVIDER || 'webhook'; // 'business', 'twilio', or 'webhook'

  if (!groupId) {
    console.error('❌ WhatsApp group ID not configured');
    return false;
  }

  const message = formatSubscriptionMessage(data);
  const whatsappMessage: WhatsAppMessage = {
    to: groupId,
    message,
  };

  console.log('📱 Sending WhatsApp notification:', {
    provider,
    groupId,
    planId: data.planId,
  });

  try {
    let success = false;

    switch (provider.toLowerCase()) {
      case 'business':
        success = await sendViaWhatsAppBusinessAPI(whatsappMessage);
        break;
      case 'twilio':
        success = await sendViaTwilio(whatsappMessage);
        break;
      case 'webhook':
      default:
        success = await sendViaWebhook(whatsappMessage);
        break;
    }

    if (success) {
      console.log('✅ WhatsApp notification sent successfully');
    } else {
      console.error('❌ Failed to send WhatsApp notification');
    }

    return success;
  } catch (error) {
    console.error('❌ Error sending WhatsApp notification:', error);
    return false;
  }
}

