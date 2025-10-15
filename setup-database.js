import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ocufzjrvqjktlaohizhz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdWZ6anJ2cWprdGxhb2hpemh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjE4NDIsImV4cCI6MjA3NjAzNzg0Mn0.7ekMl8lGSVvWFGe6sGqyseztSJ7StrSxmyg_jDS1dnc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log('Setting up Supabase database schema...')
  
  try {
    // Create user_subscriptions table
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create user_subscriptions table
        CREATE TABLE IF NOT EXISTS user_subscriptions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id TEXT NOT NULL,
          plan_id TEXT NOT NULL CHECK (plan_id IN ('free', 'pro', 'premium')),
          status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
          keyword TEXT,
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

        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can view own subscriptions" ON user_subscriptions;
        DROP POLICY IF EXISTS "Users can insert own subscriptions" ON user_subscriptions;
        DROP POLICY IF EXISTS "Users can update own subscriptions" ON user_subscriptions;

        -- Create policy to allow users to read their own subscriptions
        CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
            FOR SELECT USING (true);

        -- Create policy to allow users to insert their own subscriptions
        CREATE POLICY "Users can insert own subscriptions" ON user_subscriptions
            FOR INSERT WITH CHECK (true);

        -- Create policy to allow users to update their own subscriptions
        CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
            FOR UPDATE USING (true);
      `
    })

    if (error) {
      console.error('Error setting up database:', error)
    } else {
      console.log('Database schema created successfully!')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

setupDatabase()
