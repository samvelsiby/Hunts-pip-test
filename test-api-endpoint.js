// Test script to check if API endpoints work
// Run with: node test-api-endpoint.js

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing environment variables');
  process.exit(1);
}

const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testQuery() {
  console.log('Testing Supabase query with admin client...');
  
  // Test 1: Query users table
  const { data: users, error: usersError } = await supabaseAdmin
    .from('users')
    .select('id, clerk_id, email, tradingview_username')
    .limit(5);
  
  console.log('\n1. Users query:');
  if (usersError) {
    console.error('ERROR:', usersError);
  } else {
    console.log('SUCCESS:', users);
  }
  
  // Test 2: Query specific user
  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .select('tradingview_username')
    .eq('clerk_id', 'user_34tWhpmabYf0g7gNzj8x1lpbtmJ')
    .single();
  
  console.log('\n2. Single user query:');
  if (userError) {
    console.error('ERROR:', userError);
  } else {
    console.log('SUCCESS:', user);
  }
  
  // Test 3: Query subscriptions
  const { data: subscriptions, error: subError } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .limit(5);
  
  console.log('\n3. Subscriptions query:');
  if (subError) {
    console.error('ERROR:', subError);
  } else {
    console.log('SUCCESS:', subscriptions);
  }
}

testQuery().catch(console.error);

