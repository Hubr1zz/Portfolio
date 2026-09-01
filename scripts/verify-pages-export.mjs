import { readFile } from "node:fs/promises";
import { join } from "node:path";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const routeFiles = ["index.html", "technical/index.html", "games/index.html", "design/index.html"];
const renderedPages = await Promise.all(routeFiles.map((file) => readFile(join("out", file), "utf8")));
const homePage = renderedPages[0];
const combinedPages = renderedPages.join("\n");

if (!homePage.includes(`href="${basePath}/technical/"`)) throw new Error("Technical route is missing the GitHub Pages base path.");
if (!homePage.includes(`content="${siteUrl}/"`)) throw new Error("Open Graph URL does not match the GitHub Pages URL.");
if (!combinedPages.includes(`src="${basePath}/images/`)) throw new Error("Project images are missing the GitHub Pages base path.");
if (basePath && combinedPages.includes(`href="/technical/"`)) throw new Error("Found an internal link that bypasses the GitHub Pages base path.");
if (combinedPages.includes(`${basePath}${basePath}/og.png`)) throw new Error("The Open Graph image contains a duplicated base path.");

console.log(`Verified ${routeFiles.length} static routes for ${basePath || "/"}.`);
