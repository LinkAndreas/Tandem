/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Allow testing the dev server from phones and tablets in the local network.
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '*.local'],
}

module.exports = nextConfig
