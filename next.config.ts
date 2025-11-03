import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      // Scripts we allow (remove Clerk CDNs)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https://cdn.sanity.io data: blob: https:",
      "font-src 'self' data:",
      // Connect sources (remove Clerk domains, add Supabase)
      "connect-src 'self' https://*.sanity.io https://cdn.sanity.io https://vitals.vercel-insights.com https://vercel.live https://*.supabase.co",
      // Frames (YouTube allowed)
      "frame-src https://www.youtube.com",
      "media-src 'self' blob:",
      "worker-src 'self' blob:",
      'upgrade-insecure-requests',
    ].join('; ')

    const securityHeaders = [
      { key: 'Content-Security-Policy', value: csp },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-XSS-Protection', value: '0' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    ]

    return [
      { source: '/:path*', headers: securityHeaders },
    ]
  },
};

export default nextConfig;
