import { readFile } from "node:fs/promises";
import { flatProjects, getBoardItems, tabs } from "../app/portfolio-data.ts";
import { contentMessages, messages } from "../app/translations.ts";

const translatableFields = new Set(["alt", "description", "details", "eyebrow", "imageAlt", "label", "language", "linkLabel", "summary", "text", "title", "year"]);
const translatableArrays = new Set(["tags"]);
const intentionalEnglish = new Set([
  "3D Math", "Alive", "Blender", "C#", "Card", "Cinemachine", "Codex", "Cursor", "DOTween", "EventSystem", "GitHub", "HLSL", "Hunt in Darkness", "IInteractableTarget", "Interaction System", "Itch.io", "Obsidian", "Odin Serializer", "OpenSpec", "Outlaw’s Deadend", "Punch-in Rush", "ScriptableObjects", "Shader Graph", "Top Hotpot", "UGUI", "UniTask", "Unity", "Unity 2022.3+", "Unity Editor Tools", "UPM", "VR", "ZFramework", "vFavorites2", "vFolders2", "vHierarchy2", "vInspector2", "vTabs2", "zWorkFlow",
]);

const requiredContent = new Map();

function itemSegment(value, index) {
  if (value && typeof value === "object" && typeof value.id === "string")
    return value.id;
  return String(index);
}

function collect(value, path, field = "") {
  if (typeof value === "string") {
    if (field === "year" && /^[\d—-]+$/.test(value))
      return;
    const parentField = path.split(".").at(-2) ?? "";
    if (translatableFields.has(field) || translatableArrays.has(parentField))
      requiredContent.set(path, value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collect(item, `${path}.${itemSegment(item, index)}`, String(index)));
    return;
  }
  if (!value || typeof value !== "object")
    return;
  Object.entries(value).forEach(([key, item]) => collect(item, `${path}.${key}`, key));
}

tabs.forEach((tab) => collect(tab, `tab.${tab.id}`));
flatProjects.forEach((project) => {
  collect(project, `project.${project.id}`);
  getBoardItems(project).forEach((item) => collect(item, `project.${project.id}.section.${item.id}`));
});

const errors = [];
const englishMessageKeys = Object.keys(messages.en);
const chineseMessageKeys = Object.keys(messages.zh);
const missingUiKeys = englishMessageKeys.filter((key) => !chineseMessageKeys.includes(key));
const extraUiKeys = chineseMessageKeys.filter((key) => !englishMessageKeys.includes(key));
if (missingUiKeys.length)
  errors.push(`Missing Chinese UI keys:\n  ${missingUiKeys.join("\n  ")}`);
if (extraUiKeys.length)
  errors.push(`Chinese UI keys without English copy:\n  ${extraUiKeys.join("\n  ")}`);

const englishContentKeys = Object.keys(contentMessages.en);
const chineseContentKeys = Object.keys(contentMessages.zh);
const missingContentKeys = englishContentKeys.filter((key) => !chineseContentKeys.includes(key));
const extraContentKeys = chineseContentKeys.filter((key) => !englishContentKeys.includes(key));
if (missingContentKeys.length)
  errors.push(`Missing Chinese semantic content keys:\n  ${missingContentKeys.join("\n  ")}`);
if (extraContentKeys.length)
  errors.push(`Chinese semantic keys without English copy:\n  ${extraContentKeys.join("\n  ")}`);

const missingContent = [...requiredContent].filter(([path, english]) => !Object.hasOwn(contentMessages.zh, path) && !intentionalEnglish.has(english));
if (missingContent.length)
  errors.push(`Missing Chinese project content:\n${missingContent.map(([path, english]) => `  ${path}\n    ${english}`).join("\n")}`);

const requiredPaths = new Set(requiredContent.keys());
const staleContent = chineseContentKeys.filter((path) => (path.startsWith("project.") || path.startsWith("tab.")) && !requiredPaths.has(path));
if (staleContent.length)
  errors.push(`Stale project translation paths:\n  ${staleContent.join("\n  ")}`);

const changedEnglish = [...requiredContent].filter(([path, english]) => Object.hasOwn(contentMessages.en, path) && contentMessages.en[path] !== english);
if (changedEnglish.length)
  errors.push(`English project copy changed without updating translations.ts:\n${changedEnglish.map(([path, english]) => `  ${path}\n    expected: ${contentMessages.en[path]}\n    actual:   ${english}`).join("\n")}`);

const portfolioSource = await readFile(new URL("../app/portfolio.tsx", import.meta.url), "utf8");
const usedStaticPaths = new Set([...portfolioSource.matchAll(/\bcontent\("([^"]+)"/g)].map((match) => match[1]));
const staticPaths = chineseContentKeys.filter((path) => path.startsWith("diagram.") || path.startsWith("visual."));
const missingStaticPaths = [...usedStaticPaths].filter((path) => !Object.hasOwn(contentMessages.zh, path));
const staleStaticPaths = staticPaths.filter((path) => !usedStaticPaths.has(path));
if (missingStaticPaths.length)
  errors.push(`Missing Chinese diagram keys:\n  ${missingStaticPaths.join("\n  ")}`);
if (staleStaticPaths.length)
  errors.push(`Stale diagram translation paths:\n  ${staleStaticPaths.join("\n  ")}`);

const invalidPaths = chineseContentKeys.filter((path) => !/^(diagram|project|tab|visual)\.[a-z0-9.-]+$/i.test(path));
if (invalidPaths.length)
  errors.push(`Invalid non-semantic translation keys:\n  ${invalidPaths.join("\n  ")}`);

if (errors.length) {
  console.error(errors.join("\n\n"));
  process.exitCode = 1;
} else {
  console.log(`i18n check passed: ${englishMessageKeys.length} UI keys and ${requiredContent.size} project content paths.`);
}
