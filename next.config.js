/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "aa-travel-group.firebasestorage.app" },
    ],
  },
  eslint: { ignoreDuringBuilds: false },
};

module.exports = nextConfig;
