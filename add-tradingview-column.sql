-- Add missing tradingview_username column to existing table
-- Run this in your Supabase SQL Editor

-- Add the missing column
ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS tradingview_username TEXT;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_subscriptions' 
ORDER BY ordinal_position;

-- Test the table structure
SELECT * FROM user_subscriptions LIMIT 1;
