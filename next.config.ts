import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserSite = repositoryName.toLowerCase().endsWith(".github.io");
const derivedBasePath = repositoryName && !isUserSite ? `/${repositoryName}` : "";

function normalizeBasePath(value: string) {
  if (!value || value === "/") return "";
  return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

const githubBasePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? derivedBasePath);

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      trailingSlash: true,
      basePath: githubBasePath,
      images: { unoptimized: true },
      typescript: { tsconfigPath: "tsconfig.pages.json" },
    }
  : {};

export default nextConfig;
