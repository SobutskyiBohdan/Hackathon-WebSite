/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/.well-known/appspecific/:path*',
        destination: '/api/not-found', // або просто поверніть 404
      },
    ]
  },
}

module.exports = nextConfig