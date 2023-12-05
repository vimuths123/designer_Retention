/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [process.env.NEXT_PUBLIC_IMAGE_DOMAIN, process.env.NEXT_PUBLIC_IMAGE_DOMAIN2], // Add the IP address or domain here
  },
}

module.exports = nextConfig
