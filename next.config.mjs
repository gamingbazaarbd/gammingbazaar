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
        destination: 'https://backend.gammingbazaar.com/api/:path*',
      },
      {
        source: '/storage/:path*',
        destination: 'https://backend.gammingbazaar.com/storage/:path*',
      }
    ];
  },
};

export default nextConfig;
