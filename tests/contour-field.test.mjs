import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../app/contour-field.ts", import.meta.url), "utf8");
const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const contourField = await import(`data:text/javascript;charset=utf-8,${encodeURIComponent(output)}`);
const { DEFAULT_CONTOUR_SETTINGS, generateContourField, getContourGrid, normalizeContourSettings } = contourField;

function pathPoints(path) {
  return [...path.matchAll(/[MLQ]\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)(?:\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?))?/g)].flatMap((match) => match[3] ? [[Number(match[1]), Number(match[2])], [Number(match[3]), Number(match[4])]] : [[Number(match[1]), Number(match[2])]]);
}

function quadraticSegments(path) {
  return [...path.matchAll(/Q\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)].map((match) => ({ control: [Number(match[1]), Number(match[2])], end: [Number(match[3]), Number(match[4])] }));
}

function movePoint(path) {
  const match = path.match(/^M\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/);
  return match ? [Number(match[1]), Number(match[2])] : null;
}

function closeEnough(first, second, tolerance = .03) {
  return Math.abs(first[0] - second[0]) <= tolerance && Math.abs(first[1] - second[1]) <= tolerance;
}

test("same seed and viewport produce deterministic geometry", () => {
  const first = generateContourField(900, 620, DEFAULT_CONTOUR_SETTINGS);
  const second = generateContourField(900, 620, DEFAULT_CONTOUR_SETTINGS);
  assert.deepEqual(first, second);
  assert.ok(first.paths.length > 1);
});

test("different seeds change the sampled field", () => {
  const first = generateContourField(900, 620, { ...DEFAULT_CONTOUR_SETTINGS, seed: 101 });
  const second = generateContourField(900, 620, { ...DEFAULT_CONTOUR_SETTINGS, seed: 102 });
  assert.notDeepEqual(first.paths, second.paths);
});

test("contours cover the viewport instead of one central ornament", () => {
  const width = 1280;
  const height = 720;
  const geometry = generateContourField(width, height, DEFAULT_CONTOUR_SETTINGS);
  const points = geometry.paths.flatMap((path) => pathPoints(path.d));
  const xValues = points.map(([x]) => x);
  const yValues = points.map(([, y]) => y);
  assert.ok(Math.min(...xValues) < width * .15);
  assert.ok(Math.max(...xValues) > width * .85);
  assert.ok(Math.min(...yValues) < height * .15);
  assert.ok(Math.max(...yValues) > height * .85);
});

test("connected contour paths use shared quadratic joins", () => {
  const geometry = generateContourField(900, 620, DEFAULT_CONTOUR_SETTINGS);
  const smoothPaths = geometry.paths.flatMap((path) => path.d.split(/(?=M\s)/).map((subpath) => subpath.trim()).filter(Boolean)).filter((path) => quadraticSegments(path).length > 0);
  assert.ok(smoothPaths.length > 0);
  assert.ok(smoothPaths.some((path) => path.endsWith("Z")));
  for (const path of smoothPaths) {
    const segments = quadraticSegments(path);
    for (let index = 0; index < segments.length - 1; index += 1)
      assert.ok(closeEnough(segments[index].end, [(segments[index].control[0] + segments[index + 1].control[0]) * .5, (segments[index].control[1] + segments[index + 1].control[1]) * .5]));
    if (path.endsWith("Z"))
      assert.ok(closeEnough(segments.at(-1).end, movePoint(path)));
  }
});

test("malicious settings normalize to finite bounded values", () => {
  const settings = normalizeContourSettings({ seed: Infinity, noiseScale: -1000, octaves: NaN, persistence: 999, warpIntensity: -1, contourGap: "nope", lineWidth: -1, baseOpacity: Infinity, pointerIntensity: 0, pointerRadius: 999999 });
  assert.deepEqual(settings, { seed: 137, noiseScale: 80, octaves: 1, persistence: .65, warpIntensity: 0, contourGap: .086, lineWidth: .5, baseOpacity: .05, pointerIntensity: .05, pointerRadius: 500 });
  assert.ok(Object.values(settings).every(Number.isFinite));
});

test("domain warp changes contours while remaining deterministic", () => {
  const straight = generateContourField(900, 620, { ...DEFAULT_CONTOUR_SETTINGS, warpIntensity: 0 });
  const warped = generateContourField(900, 620, { ...DEFAULT_CONTOUR_SETTINGS, warpIntensity: .65 });
  assert.notDeepEqual(straight.paths, warped.paths);
  assert.ok(warped.paths.some((path) => path.d.includes("Q")));
});

test("minimum roughness still produces smooth quadratic contours", () => {
  const geometry = generateContourField(900, 620, { ...DEFAULT_CONTOUR_SETTINGS, persistence: .05 });
  assert.ok(geometry.paths.length > 0);
  assert.ok(geometry.paths.some((path) => path.d.includes("Q")));
});

test("large viewports stay inside the cell and level budgets", () => {
  const grid = getContourGrid(100000, 100000);
  assert.ok(grid.cells <= 18000);
  const geometry = generateContourField(6000, 4000, { ...DEFAULT_CONTOUR_SETTINGS, contourGap: .03 });
  assert.ok(geometry.cells <= 18000);
  assert.ok(geometry.paths.length <= 32);
  assert.ok(new Set(geometry.paths.map((path) => path.level)).size <= 32);
});
