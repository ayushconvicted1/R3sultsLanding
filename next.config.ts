import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", port: "", pathname: "**" },
      { protocol: "https", hostname: "images.pexels.com", port: "", pathname: "**" },
      { protocol: "https", hostname: "via.placeholder.com", port: "", pathname: "**" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com", port: "", pathname: "**" },
      { protocol: "https", hostname: "encrypted-tbn1.gstatic.com", port: "", pathname: "**" },
      { protocol: "https", hostname: "encrypted-tbn2.gstatic.com", port: "", pathname: "**" },
      { protocol: "https", hostname: "encrypted-tbn3.gstatic.com", port: "", pathname: "**" },
      { protocol: "https", hostname: "static1.industrybuying.com", port: "", pathname: "**" },
    ],
  },
};

export default nextConfig;
