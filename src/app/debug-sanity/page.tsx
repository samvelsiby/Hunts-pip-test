import { client } from '@/lib/sanity'

export default async function DebugSanityPage() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '(missing)'
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || '(missing)'

  let indicators: unknown = null
  let allIndicators: unknown = null
  let totalDocs: unknown = null
  let error: unknown = null

  try {
    indicators = await client.fetch(`*[_type == "indicator" && isActive == true]{_id, title, slug}`)
    allIndicators = await client.fetch(`*[_type == "indicator"]{_id, title, slug, isActive}`)
    totalDocs = await client.fetch(`count(*[])`)
  } catch (e) {
    error = String(e)
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: 'white', fontSize: 20, marginBottom: 12 }}>Sanity Debug</h1>
      <div style={{ color: '#9CA3AF' }}>Project ID: <span style={{ color: 'white' }}>{projectId}</span></div>
      <div style={{ color: '#9CA3AF' }}>Dataset: <span style={{ color: 'white' }}>{dataset}</span></div>
      <div style={{ height: 24 }} />
      <div style={{ color: '#9CA3AF' }}>Query: <code>*[_type == "indicator" && isActive == true]</code></div>
      <div style={{ height: 12 }} />
      {error ? (
        <pre style={{ color: '#F87171', background: '#111827', padding: 12, borderRadius: 8 }}>Error: {String(error)}</pre>
      ) : (
        <>
          <div style={{ color: '#9CA3AF', marginBottom: 6 }}>Published indicators (isActive == true)</div>
          <pre style={{ color: '#D1D5DB', background: '#111827', padding: 12, borderRadius: 8 }}>{JSON.stringify(indicators, null, 2)}</pre>
          <div style={{ height: 12 }} />
          <div style={{ color: '#9CA3AF', marginBottom: 6 }}>All indicators (any status)</div>
          <pre style={{ color: '#D1D5DB', background: '#111827', padding: 12, borderRadius: 8 }}>{JSON.stringify(allIndicators, null, 2)}</pre>
          <div style={{ height: 12 }} />
          <div style={{ color: '#9CA3AF', marginBottom: 6 }}>Total documents in dataset</div>
          <pre style={{ color: '#D1D5DB', background: '#111827', padding: 12, borderRadius: 8 }}>{JSON.stringify(totalDocs, null, 2)}</pre>
        </>
      )}
      <div style={{ height: 12 }} />
      <div style={{ color: '#9CA3AF' }}>
        If this is empty, check:
        <ol>
          <li>Indicator documents are Published (not drafts)</li>
          <li>isActive is true</li>
          <li>Dataset matches (production vs staging)</li>
          <li>Sanity CORS includes http://localhost:3000</li>
        </ol>
      </div>
    </div>
  )
}


