import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

/** Resolve deps from this app's node_modules (fixes wrong root when workspace is a parent folder) */
function resolvePackageDir(pkg: string): string {
  try {
    return path.dirname(require.resolve(`${pkg}/package.json`));
  } catch {
    return path.join(projectRoot, "node_modules", pkg);
  }
}

const tailwindAliases = {
  tailwindcss: resolvePackageDir("tailwindcss"),
  "@tailwindcss/postcss": resolvePackageDir("@tailwindcss/postcss"),
} as const;

const nextConfig: NextConfig = {
  /* Use this project as Turbopack root when multiple lockfiles exist (e.g. parent folder) */
  turbopack: {
    root: projectRoot,
    resolveAlias: tailwindAliases,
  },
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      ...tailwindAliases,
    };
    return config;
  },
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
      { protocol: "https", hostname: "cdn.printify.com", port: "", pathname: "**" },
      { protocol: "https", hostname: "printify.com", port: "", pathname: "**" },
      { protocol: "https", hostname: "images.printify.com", port: "", pathname: "**" },
    ],
  },
};

export default nextConfig;
