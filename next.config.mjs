/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://backend.codvouchers.com/api/:path*',
      },
      {
        source: '/storage/:path*',
        destination: 'https://backend.codvouchers.com/storage/:path*',
      }
    ];
  },
};

export default nextConfig;
