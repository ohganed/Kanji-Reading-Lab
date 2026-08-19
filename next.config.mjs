const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? "/Kanji-Reading-Lab" : "",
  assetPrefix: isGitHubPages ? "/Kanji-Reading-Lab/" : "",
  images: { unoptimized: true },
  typescript: isGitHubPages ? { tsconfigPath: "tsconfig.pages.json" } : undefined,
};

export default nextConfig;
