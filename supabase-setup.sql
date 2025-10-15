-- MUNTS PIP Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('free', 'pro', 'premium')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
  keyword TEXT,
  tradingview_username TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_id ON user_subscriptions(plan_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
    FOR SELECT USING (true);

-- Create policy to allow users to insert their own subscriptions
CREATE POLICY "Users can insert own subscriptions" ON user_subscriptions
    FOR INSERT WITH CHECK (true);

-- Create policy to allow users to update their own subscriptions
CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
    FOR UPDATE USING (true);

-- Insert some sample data for testing
INSERT INTO user_subscriptions (user_id, plan_id, status, keyword, tradingview_username) VALUES
('test_user_1', 'free', 'active', 'BTC', 'trader1'),
('test_user_2', 'pro', 'active', 'ETH', 'trader2'),
('test_user_3', 'premium', 'active', 'AAPL', 'trader3')
ON CONFLICT DO NOTHING;
