/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    // Optimize image loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  // Optimize page loading
  reactStrictMode: true,
  async headers() {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      // Allow Clerk JS and supporting CDNs
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://challenges.cloudflare.com https://vercel.live https://cdn.clerk.com https://cdn.clerk.dev https://*.clerk.com https://*.clerk.dev https://*.clerk.accounts.dev https://clerk.huntspip.com https://www.huntspip.com https://huntspip.com https://*.huntspip.com https://*.cloudflare.com https://*.spline.design https://my.spline.design",
      "style-src 'self' 'unsafe-inline' https://*.spline.design",
      "img-src 'self' https://cdn.sanity.io https://*.clerk.com https://*.clerk.dev https://*.clerk.accounts.dev https://clerk.huntspip.com https://www.huntspip.com https://huntspip.com https://*.huntspip.com https://*.spline.design data: blob: https:",
      "font-src 'self' data: https://*.spline.design",
      // Allow Clerk APIs and realtime connections
      "connect-src 'self' https://*.sanity.io https://cdn.sanity.io https://vitals.vercel-insights.com https://vercel.live https://api.clerk.com https://*.clerk.com https://*.clerk.dev https://*.clerk.accounts.dev https://challenges.cloudflare.com https://*.cloudflare.com https://*.cloudflarestream.com https://clerk.huntspip.com https://www.huntspip.com https://huntspip.com https://*.huntspip.com https://*.spline.design https://my.spline.design wss://*.spline.design",
      // Allow Clerk hosted widgets, YouTube embeds, and Spline 3D
      "frame-src https://www.youtube.com https://*.clerk.com https://*.clerk.dev https://*.clerk.accounts.dev https://challenges.cloudflare.com https://*.cloudflare.com https://clerk.huntspip.com https://www.huntspip.com https://huntspip.com https://*.huntspip.com https://my.spline.design https://*.spline.design",
      "child-src https://my.spline.design https://*.spline.design blob:",
      "media-src 'self' blob: https://*.spline.design https://*.cloudflarestream.com",
      "worker-src 'self' blob: https://*.spline.design",
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
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
};

export default nextConfig;
