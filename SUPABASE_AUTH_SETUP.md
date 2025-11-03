# Supabase Authentication Setup Guide

This guide explains how to set up and configure Supabase authentication for the Hunts PIP application.

## Prerequisites

1. A Supabase account and project
2. Access to your project's API keys and URL
3. Node.js and npm installed

## Setup Steps

### 1. Environment Variables

Make sure your `.env.local` file contains the following Supabase-related variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Database Setup

Run the SQL commands in `supabase-setup.sql` in your Supabase SQL editor to create the necessary tables and functions:

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the SQL commands

This will create:
- `user_subscriptions` table
- Row-level security policies
- Triggers for automatic user subscription creation

### 3. Google OAuth Setup

To enable Google authentication:

1. Go to your Supabase Dashboard > Authentication > Providers
2. Enable Google provider
3. Create a Google OAuth application in the Google Cloud Console
4. Add your authorized redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
5. Copy your Client ID and Client Secret to Supabase

### 4. Configure Site URL and Redirect URLs

1. Go to your Supabase Dashboard > Authentication > URL Configuration
2. Set your Site URL to your application's URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://your-production-domain.com/auth/callback` (for production)

### 5. MCP Server Configuration

The MCP server configuration is in `.mcp-config.json`. Make sure the Supabase MCP server is properly configured with your project reference and API keys.

## Authentication Flow

1. Users sign up or log in through the login/signup pages
2. Upon successful authentication, a user subscription record is created if it doesn't exist
3. The middleware checks for authentication on protected routes
4. API routes validate the session token before allowing access

## Troubleshooting

### Common Issues

1. **Login not working**: Check that your Supabase URL and anon key are correct in `.env.local`
2. **Google auth redirecting to wrong port**: Update the redirect URL in your Supabase dashboard
3. **Missing user subscription records**: Run the `ensureAllUserSubscriptions` function from the Supabase MCP

### Database Maintenance

To clean up orphaned user records:

1. Use the `cleanupUserSubscriptions` function from the Supabase MCP
2. This will remove subscription records for users that no longer exist

## Security Considerations

1. Never expose your `SUPABASE_SERVICE_ROLE_KEY` to the client
2. Always use Row Level Security (RLS) policies to protect your data
3. Validate authentication in all API routes that access protected data
