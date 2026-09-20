import { readFile, readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/g, "");
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const outputDirectory = "out";
const expectedRoutes = [
  "",
  "technical",
  "games",
  "design",
  "other",
  "other/games",
  "other/projects",
  "projects/zworkflow",
  "projects/interaction",
  "projects/editor-tools",
  "projects/procedural-motion",
  "projects/rendering-studies",
  "projects/punch-in-rush",
  "projects/hunting-in-darkness",
  "projects/outlaws-dead-end",
  "projects/alive",
  "projects/top-hotpot",
  "projects/tactics-design",
  "projects/comparative-writing",
  "projects/design-vault",
];

async function findRouteFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findRouteFiles(path));
      continue;
    }
    if (entry.isFile() && entry.name === "index.html")
      files.push(path);
  }
  return files;
}

function routeName(file) {
  const directory = relative(outputDirectory, join(file, ".."));
  return directory.split(sep).join("/");
}

function isExternal(value) {
  return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("//") || value.startsWith("#") || value.startsWith("mailto:") || value.startsWith("tel:") || value.startsWith("data:");
}

function checkInternalPaths(html, file) {
  const attributes = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const value of attributes) {
    if (isExternal(value))
      continue;
    if (!value.startsWith("/"))
      continue;
    if (basePath && !value.startsWith(basePath + "/") && value !== basePath)
      throw new Error(`Internal path bypasses the base path in ${file}: ${value}`);
    if (basePath && value.startsWith(basePath + basePath))
      throw new Error(`Internal path duplicates the base path in ${file}: ${value}`);
  }
}

const routeFiles = await findRouteFiles(outputDirectory);
const routeMap = new Map(routeFiles.map((file) => [routeName(file), file]));
for (const route of expectedRoutes) {
  if (!routeMap.has(route))
    throw new Error(`Missing static route: /${route}`);
}

const renderedPages = await Promise.all(routeFiles.map(async (file) => [file, await readFile(file, "utf8")]));
for (const [file, html] of renderedPages)
  checkInternalPaths(html, file);

const homePage = await readFile(routeMap.get(""), "utf8");
if (siteUrl && !homePage.includes(`content="${siteUrl}/`))
  throw new Error("Open Graph URL does not match the GitHub Pages URL.");

for (const route of expectedRoutes) {
  const html = await readFile(routeMap.get(route), "utf8");
  if (!html.includes("<title>"))
    throw new Error(`Static route has no title: /${route}`);
}

const imagePages = renderedPages.filter(([, html]) => html.includes("<img"));
if (imagePages.length === 0)
  throw new Error("No static page contains project images.");

console.log(`Verified ${routeFiles.length} static routes and ${imagePages.length} image-bearing pages for ${basePath || "/" }.`);
