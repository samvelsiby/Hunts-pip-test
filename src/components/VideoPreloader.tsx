'use client'

import { useEffect } from 'react'
import { CLOUDFLARE_STREAM_UIDS, cloudflareStreamHlsUrl } from '@/config/cloudflare-stream'

// Preload video manifests for faster loading
export default function VideoPreloader() {
  useEffect(() => {
    const videoUrls = [
      cloudflareStreamHlsUrl(CLOUDFLARE_STREAM_UIDS.tradeChartsLoop),
      cloudflareStreamHlsUrl(CLOUDFLARE_STREAM_UIDS.phooen),
      cloudflareStreamHlsUrl(CLOUDFLARE_STREAM_UIDS.services2),
      cloudflareStreamHlsUrl(CLOUDFLARE_STREAM_UIDS.obCharts),
      cloudflareStreamHlsUrl(CLOUDFLARE_STREAM_UIDS.comp1),
    ]

    // Preload HLS manifests
    const preloadPromises = videoUrls.map(async (url) => {
      try {
        const response = await fetch(url, {
          method: 'HEAD', // Just check if available, don't download
          mode: 'cors',
        })
        console.log(`Preloaded manifest: ${url} - ${response.status}`)
      } catch (error) {
        console.warn(`Failed to preload: ${url}`, error)
      }
    })

    Promise.all(preloadPromises).then(() => {
      console.log('Video manifests preloaded')
    })

    // Add link prefetch for better browser caching
    videoUrls.forEach((url) => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = url
      link.as = 'fetch'
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })

    // Cleanup function
    return () => {
      // Remove prefetch links on unmount
      const links = document.querySelectorAll(`link[href*="cloudflarestream.com"]`)
      links.forEach(link => link.remove())
    }
  }, [])

  return null // This component doesn't render anything
}