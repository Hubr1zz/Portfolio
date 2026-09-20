import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../app/contour-field.ts", import.meta.url), "utf8");
const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const contourField = await import(`data:text/javascript;charset=utf-8,${encodeURIComponent(output)}`);
const { DEFAULT_CONTOUR_SETTINGS, generateContourField, getContourGrid, normalizeContourSettings } = contourField;

function endpointPairs(path) {
  return [...path.matchAll(/[ML]\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)].map((match) => [Number(match[1]), Number(match[2])]);
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
  const points = geometry.paths.flatMap((path) => endpointPairs(path.d));
  const xValues = points.map(([x]) => x);
  const yValues = points.map(([, y]) => y);
  assert.ok(Math.min(...xValues) < width * .15);
  assert.ok(Math.max(...xValues) > width * .85);
  assert.ok(Math.min(...yValues) < height * .15);
  assert.ok(Math.max(...yValues) > height * .85);
});

test("interior segment endpoints remain continuous across neighboring cells", () => {
  const width = 900;
  const height = 620;
  const geometry = generateContourField(width, height, DEFAULT_CONTOUR_SETTINGS);
  const degrees = new Map();
  for (const path of geometry.paths) {
    const points = endpointPairs(path.d);
    for (const [x, y] of points) {
      if (x <= .5 || y <= .5 || x >= width - .5 || y >= height - .5)
        continue;
      const key = `${x.toFixed(1)},${y.toFixed(1)}`;
      degrees.set(key, (degrees.get(key) ?? 0) + 1);
    }
  }
  assert.ok(degrees.size > 0);
  assert.ok([...degrees.values()].every((degree) => degree % 2 === 0));
});

test("malicious settings normalize to finite bounded values", () => {
  const settings = normalizeContourSettings({ seed: Infinity, noiseScale: -1000, octaves: NaN, persistence: 999, contourGap: "nope", lineWidth: -1, baseOpacity: Infinity, pointerIntensity: 0, pointerRadius: 999999 });
  assert.deepEqual(settings, { seed: 137, noiseScale: 80, octaves: 3, persistence: .8, contourGap: .065, lineWidth: .5, baseOpacity: .06, pointerIntensity: .05, pointerRadius: 500 });
  assert.ok(Object.values(settings).every(Number.isFinite));
});

test("large viewports stay inside the cell and level budgets", () => {
  const grid = getContourGrid(100000, 100000);
  assert.ok(grid.cells <= 18000);
  const geometry = generateContourField(6000, 4000, { ...DEFAULT_CONTOUR_SETTINGS, contourGap: .03 });
  assert.ok(geometry.cells <= 18000);
  assert.ok(geometry.paths.length <= 32);
});
