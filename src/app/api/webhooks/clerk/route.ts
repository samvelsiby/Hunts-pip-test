import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: Request) {
  // Get the Svix headers for verification
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new NextResponse('Error occurred', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, primary_email_address_id } = evt.data

    try {
      // Get the primary email address
      const primaryEmail = email_addresses?.find((email) => email.id === primary_email_address_id)
        ?.email_address || email_addresses?.[0]?.email_address

      if (!primaryEmail || !email_addresses || email_addresses.length === 0) {
        console.error('No email address found for user:', id)
        return new NextResponse('Error: No email address', { status: 400 })
      }

      // Check if user already exists in Supabase
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('clerk_id', id)
        .single()

      if (existingUser) {
        console.log('User already exists in Supabase:', id)
        return new NextResponse('User already exists', { status: 200 })
      }

      // Insert user into Supabase
      const { data: newUser, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          clerk_id: id,
          email: primaryEmail,
          first_name: first_name || null,
          last_name: last_name || null,
          tradingview_verified: false,
        })
        .select()
        .single()

      if (userError) {
        console.error('Error creating user in Supabase:', userError)
        return new NextResponse(`Error creating user: ${userError.message}`, {
          status: 500,
        })
      }

      // Create default subscription for the user
      const { error: subscriptionError } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: newUser.id,
          plan_type: 'free',
          status: 'active',
        })

      if (subscriptionError) {
        console.error('Error creating subscription:', subscriptionError)
        // Don't fail the webhook if subscription creation fails
        // We can retry this later
      }

      console.log('Successfully synced user to Supabase:', id, primaryEmail)
      return new NextResponse('User synced successfully', { status: 200 })
    } catch (error) {
      console.error('Error processing user.created webhook:', error)
      return new NextResponse('Error processing webhook', { status: 500 })
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, primary_email_address_id } = evt.data

    try {
      // Get the primary email address
      const primaryEmail = email_addresses?.find((email) => email.id === primary_email_address_id)
        ?.email_address || email_addresses?.[0]?.email_address

      if (!primaryEmail || !email_addresses || email_addresses.length === 0) {
        console.error('No email address found for user:', id)
        return new NextResponse('Error: No email address', { status: 400 })
      }

      // Update user in Supabase
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          email: primaryEmail,
          first_name: first_name || null,
          last_name: last_name || null,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_id', id)

      if (updateError) {
        console.error('Error updating user in Supabase:', updateError)
        return new NextResponse(`Error updating user: ${updateError.message}`, {
          status: 500,
        })
      }

      console.log('Successfully updated user in Supabase:', id)
      return new NextResponse('User updated successfully', { status: 200 })
    } catch (error) {
      console.error('Error processing user.updated webhook:', error)
      return new NextResponse('Error processing webhook', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    try {
      // Find the user in Supabase by clerk_id
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('clerk_id', id)
        .single()

      if (!user) {
        console.log('User not found in Supabase:', id)
        return new NextResponse('User not found', { status: 200 })
      }

      // Delete associated subscriptions first (due to foreign key constraint)
      const { error: subscriptionDeleteError } = await supabaseAdmin
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id)

      if (subscriptionDeleteError) {
        console.error('Error deleting subscriptions:', subscriptionDeleteError)
        // Continue with user deletion even if subscription deletion fails
      }

      // Delete tradingview credentials
      const { error: tradingviewDeleteError } = await supabaseAdmin
        .from('tradingview_credentials')
        .delete()
        .eq('user_id', user.id)

      if (tradingviewDeleteError) {
        console.error('Error deleting tradingview credentials:', tradingviewDeleteError)
      }

      // Delete the user
      const { error: deleteError } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', user.id)

      if (deleteError) {
        console.error('Error deleting user from Supabase:', deleteError)
        return new NextResponse(`Error deleting user: ${deleteError.message}`, {
          status: 500,
        })
      }

      console.log('Successfully deleted user from Supabase:', id)
      return new NextResponse('User deleted successfully', { status: 200 })
    } catch (error) {
      console.error('Error processing user.deleted webhook:', error)
      return new NextResponse('Error processing webhook', { status: 500 })
    }
  }

  // Return a response for unhandled events
  return new NextResponse('Webhook received', { status: 200 })
}

