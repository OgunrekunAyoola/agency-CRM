import type { NextConfig } from "next";
import path from "path";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const normalizedApiBase = apiBase
  ? (apiBase.startsWith('http://') || apiBase.startsWith('https://')
    ? apiBase.replace(/\/$/, '')
    : `https://${apiBase.replace(/\/$/, '')}`)
  : '';

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  compress: false,
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, "../"),
  async rewrites() {
    // Prevent circular rewrites if normalizedApiBase is empty or the same as the current host
    if (!normalizedApiBase) {
      return [];
    }

    return [
      {
        source: '/api/:path*',
        destination: `${normalizedApiBase}/api/:path*`,
      },
    ];
  },
  async headers() {
    const cspConnectSrc = normalizedApiBase || 'http://localhost:8000';
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' ${cspConnectSrc};`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
