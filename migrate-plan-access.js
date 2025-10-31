require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ ERROR: SANITY_API_TOKEN environment variable is required!')
  console.log('\n📝 To get your API token:')
  console.log('   1. Go to https://www.sanity.io/manage')
  console.log('   2. Select your project (Huntspip)')
  console.log('   3. Go to Settings → API → Tokens')
  console.log('   4. Click "Add API token"')
  console.log('   5. Name it "Migration Token" and grant "Editor" permissions')
  console.log('   6. Copy the token')
  console.log('\n   Then add it to your .env.local file:')
  console.log('   SANITY_API_TOKEN=your_token_here')
  console.log('\n   Then run: npm run migrate:plan-access')
  process.exit(1)
}

const client = createClient({
  projectId: '3zh3et0i',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function migratePlanAccess() {
  console.log('🔍 Fetching indicators with "pro" plan access...')
  
  try {
    // Fetch all indicators with 'pro' plan access
    const indicators = await client.fetch(
      `*[_type == "indicator" && planAccess == "pro"]{
        _id,
        title,
        planAccess
      }`
    )

    if (indicators.length === 0) {
      console.log('✅ No indicators found with "pro" plan access. Migration not needed.')
      return
    }

    console.log(`📋 Found ${indicators.length} indicator(s) to migrate:`)
    indicators.forEach(ind => {
      console.log(`   - ${ind.title} (${ind.planAccess})`)
    })

    // Update each indicator
    console.log('\n🔄 Updating indicators...')
    const updates = indicators.map(indicator =>
      client
        .patch(indicator._id)
        .set({ planAccess: 'ultimate' })
        .commit()
    )

    await Promise.all(updates)
    
    console.log(`\n✅ Successfully migrated ${indicators.length} indicator(s) from "pro" to "ultimate" plan access!`)
    
    // Verify the changes
    const updated = await client.fetch(
      `*[_type == "indicator" && planAccess == "ultimate"]{
        _id,
        title,
        planAccess
      }`
    )
    
    console.log(`\n✅ Verification: ${updated.length} indicator(s) now have "ultimate" plan access.`)
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migratePlanAccess()

