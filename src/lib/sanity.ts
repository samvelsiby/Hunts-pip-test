import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
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
