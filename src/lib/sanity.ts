import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  stega: {
    enabled: false,
  },
  // Use Next.js built-in caching
  perspective: 'published',
  // Ensure we fetch fresh data when developing
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: unknown) {
  return builder.image(source as never)
}

// Generate a blur placeholder URL for images
export function getBlurDataURL(source: unknown) {
  return builder
    .image(source as never)
    .width(24)
    .height(24)
    .format('webp')
    .quality(10)
    .blur(10)
    .url()
}

// Queries
export const indicatorsQuery = `*[_type == "indicator" && isActive == true] | order(order asc) {
  _id,
  title,
  slug,
  description,
  category,
  icon,
  features,
  planAccess,
  tradingViewLink,
  order
}`

export const indicatorBySlugQuery = `*[_type == "indicator" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  category,
  icon,
  features,
  planAccess,
  tradingViewLink,
  documentation[]{
    ...,
    _type == "image" => {
      ...,
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      }
    }
  },
  isActive
}`
