import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Performance ──────────────────────────────────────────────────
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // ─── Compression & Output ─────────────────────────────────────────
  compress: true,

  // ─── Headers ──────────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Cache static assets aggressively
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },

  // ─── Redirects ────────────────────────────────────────────────────
  async redirects() {
    return [
      // Redirect common resume paths to the resume section
      {
        source: "/resume",
        destination: "/#resume",
        permanent: true,
      },
      {
        source: "/cv",
        destination: "/#resume",
        permanent: true,
      },
    ];
  },

  // ─── Experimental ─────────────────────────────────────────────────
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
    ],
  },
};

export default nextConfig;
