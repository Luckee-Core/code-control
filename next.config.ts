import type { NextConfig } from 'next';

/**
 * Proxy /api/* to Express so the browser stays same-origin.
 * Hub sets EXPRESS_API_URL / CODE_CONTROL_API_URL when spawning Next.js.
 */
const nextConfig: NextConfig = {
  async rewrites() {
    const expressTarget =
      process.env.CODE_CONTROL_API_URL?.trim() ||
      process.env.EXPRESS_API_URL?.trim() ||
      process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL?.trim() ||
      (process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:3010' : '');

    if (!expressTarget) {
      return [];
    }

    const base = expressTarget.replace(/\/$/, '');
    return [{ source: '/api/:path*', destination: `${base}/api/:path*` }];
  },
};

export default nextConfig;
