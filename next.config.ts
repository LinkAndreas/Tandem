/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  // Pages end in a slash (/privacy/de/), like the developer's other sites; the export writes
  // each page as <path>/index.html.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Allow testing the dev server from phones and tablets in the local network.
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '*.local'],
}

module.exports = nextConfig
