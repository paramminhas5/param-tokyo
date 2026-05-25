/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pixel art assets must not be optimized (we want them un-mangled, served as-is).
  // The hero/skills sheets are referenced as background-image URLs from /public/game/*.
  images: {
    unoptimized: true,
  },
  experimental: {
    // Tailwind v4 + Next 15 are happy without any extra flags.
  },
};

export default nextConfig;
