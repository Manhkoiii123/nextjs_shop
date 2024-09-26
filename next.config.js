/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    largePageDataBytes: 128 * 100000
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*lh3.googleusercontent.com',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: '*platform-lookaside.fbsbx.com',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: '*scontent.fhan14-2.fna.fbcdn.net',
        port: '',
        pathname: '**'
      }
    ]
  }
}

module.exports = nextConfig
