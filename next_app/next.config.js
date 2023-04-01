/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
    appDir: true,
  },
}

module.exports = nextConfig
