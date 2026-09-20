export const MAX_CONTOUR_CELLS = 18000;
export const MAX_CONTOUR_LEVELS = 32;
export const DEFAULT_GRID_SPACING = 10;

export interface ContourSettings {
  seed: number;
  noiseScale: number;
  octaves: number;
  persistence: number;
  warpIntensity: number;
  contourGap: number;
  lineWidth: number;
  baseOpacity: number;
  pointerIntensity: number;
  pointerRadius: number;
}

export interface ContourPath {
  d: string;
  major: boolean;
  level: number;
}

export interface ContourFieldGeometry {
  width: number;
  height: number;
  spacing: number;
  columns: number;
  rows: number;
  cells: number;
  paths: ContourPath[];
}

export const DEFAULT_CONTOUR_SETTINGS: Readonly<ContourSettings> = Object.freeze({
  seed: 137,
  noiseScale: 340,
  octaves: 2,
  persistence: .24,
  warpIntensity: .28,
  contourGap: .065,
  lineWidth: 1,
  baseOpacity: .035,
  pointerIntensity: .14,
  pointerRadius: 220,
});

const CONTOUR_LIMITS = {
  seed: [1, 999],
  noiseScale: [80, 600],
  octaves: [1, 4],
  persistence: [.05, .65],
  warpIntensity: [0, .65],
  contourGap: [.03, .13],
  lineWidth: [.5, 1.5],
  baseOpacity: [.015, .14],
  pointerIntensity: [.05, .4],
  pointerRadius: [100, 500],
} as const;

type SettingKey = keyof ContourSettings;
type SettingInput = Partial<Record<SettingKey, unknown>> | null | undefined;

function finiteNumber(value: unknown, fallback: number) {
  if (typeof value !== "number" || !Number.isFinite(value))
    return fallback;
  return value;
}

function clampNumber(value: unknown, fallback: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, finiteNumber(value, fallback)));
}

export function normalizeContourSettings(input: SettingInput = undefined): ContourSettings {
  const source = input && typeof input === "object" ? input : {};
  const defaults = DEFAULT_CONTOUR_SETTINGS;
  return {
    seed: Math.round(clampNumber(source.seed, defaults.seed, CONTOUR_LIMITS.seed[0], CONTOUR_LIMITS.seed[1])),
    noiseScale: clampNumber(source.noiseScale, defaults.noiseScale, CONTOUR_LIMITS.noiseScale[0], CONTOUR_LIMITS.noiseScale[1]),
    octaves: Math.round(clampNumber(source.octaves, defaults.octaves, CONTOUR_LIMITS.octaves[0], CONTOUR_LIMITS.octaves[1])),
    persistence: clampNumber(source.persistence, defaults.persistence, CONTOUR_LIMITS.persistence[0], CONTOUR_LIMITS.persistence[1]),
    warpIntensity: clampNumber(source.warpIntensity, defaults.warpIntensity, CONTOUR_LIMITS.warpIntensity[0], CONTOUR_LIMITS.warpIntensity[1]),
    contourGap: clampNumber(source.contourGap, defaults.contourGap, CONTOUR_LIMITS.contourGap[0], CONTOUR_LIMITS.contourGap[1]),
    lineWidth: clampNumber(source.lineWidth, defaults.lineWidth, CONTOUR_LIMITS.lineWidth[0], CONTOUR_LIMITS.lineWidth[1]),
    baseOpacity: clampNumber(source.baseOpacity, defaults.baseOpacity, CONTOUR_LIMITS.baseOpacity[0], CONTOUR_LIMITS.baseOpacity[1]),
    pointerIntensity: clampNumber(source.pointerIntensity, defaults.pointerIntensity, CONTOUR_LIMITS.pointerIntensity[0], CONTOUR_LIMITS.pointerIntensity[1]),
    pointerRadius: clampNumber(source.pointerRadius, defaults.pointerRadius, CONTOUR_LIMITS.pointerRadius[0], CONTOUR_LIMITS.pointerRadius[1]),
  };
}

function finiteDimension(value: number) {
  if (!Number.isFinite(value))
    return 1;
  return Math.min(100000, Math.max(1, value));
}

export function getContourGrid(width: number, height: number, preferredSpacing = DEFAULT_GRID_SPACING) {
  const safeWidth = finiteDimension(width);
  const safeHeight = finiteDimension(height);
  const safeSpacing = Math.max(1, finiteNumber(preferredSpacing, DEFAULT_GRID_SPACING));
  const preferredColumns = Math.max(1, Math.ceil(safeWidth / safeSpacing));
  const preferredRows = Math.max(1, Math.ceil(safeHeight / safeSpacing));
  const preferredCells = preferredColumns * preferredRows;
  let spacing = safeSpacing;

  if (preferredCells > MAX_CONTOUR_CELLS)
    spacing *= Math.sqrt(preferredCells / MAX_CONTOUR_CELLS);

  let columns = Math.max(1, Math.ceil(safeWidth / spacing));
  let rows = Math.max(1, Math.ceil(safeHeight / spacing));
  while (columns * rows > MAX_CONTOUR_CELLS) {
    spacing *= 1.01;
    columns = Math.max(1, Math.ceil(safeWidth / spacing));
    rows = Math.max(1, Math.ceil(safeHeight / spacing));
  }

  return { width: safeWidth, height: safeHeight, spacing, columns, rows, cells: columns * rows };
}

const SIMPLEX_F2 = .3660254037844386;
const SIMPLEX_G2 = .2113248654051871;
const SIMPLEX_GRADIENTS: ReadonlyArray<readonly [number, number]> = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];

function hash2d(x: number, y: number, seed: number) {
  let value = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(Math.round(seed), 1442695041);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return (value ^ (value >>> 16)) >>> 0;
}

function gradientDot(x: number, y: number, dx: number, dy: number, seed: number) {
  const gradient = SIMPLEX_GRADIENTS[hash2d(x, y, seed) % SIMPLEX_GRADIENTS.length];
  return (gradient[0] * dx + gradient[1] * dy) * .7071067811865475;
}

function simplexNoise(x: number, y: number, seed: number) {
  const skewed = (x + y) * SIMPLEX_F2;
  const cellX = Math.floor(x + skewed);
  const cellY = Math.floor(y + skewed);
  const unskewed = (cellX + cellY) * SIMPLEX_G2;
  const originX = cellX - unskewed;
  const originY = cellY - unskewed;
  const localX = x - originX;
  const localY = y - originY;
  const secondCorner = localX > localY ? [1, 0] : [0, 1];
  const contribution = (offsetX: number, offsetY: number) => {
    const skew = offsetX && offsetY ? SIMPLEX_G2 * 2 : offsetX || offsetY ? SIMPLEX_G2 : 0;
    const dx = localX - offsetX + skew;
    const dy = localY - offsetY + skew;
    const radius = .5 - dx * dx - dy * dy;
    if (radius <= 0)
      return 0;
    return radius ** 4 * gradientDot(cellX + offsetX, cellY + offsetY, dx, dy, seed);
  };
  const first = contribution(0, 0);
  const middle = contribution(secondCorner[0], secondCorner[1]);
  const last = contribution(1, 1);
  return Math.max(-1, Math.min(1, (first + middle + last) * 70));
}

function fractalNoise(x: number, y: number, settings: ContourSettings) {
  const baseX = x / settings.noiseScale;
  const baseY = y / settings.noiseScale;
  const warpSeed = settings.seed * 17 + 11;
  const warpX = simplexNoise(baseX * .35 + 19.1, baseY * .35 - 7.3, warpSeed) * settings.warpIntensity;
  const warpY = simplexNoise(baseX * .35 - 13.7, baseY * .35 + 23.9, warpSeed + 53) * settings.warpIntensity;
  const warpedX = baseX + warpX;
  const warpedY = baseY + warpY;
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let amplitudeTotal = 0;

  for (let octave = 0; octave < settings.octaves; octave += 1) {
    const offsetX = warpSeed * .013 * frequency;
    const offsetY = warpSeed * -.009 * frequency;
    value += simplexNoise(warpedX * frequency + offsetX, warpedY * frequency + offsetY, settings.seed + octave * 101) * amplitude;
    amplitudeTotal += amplitude;
    amplitude *= settings.persistence;
    frequency *= 2;
  }

  return Math.min(1, Math.max(0, value / amplitudeTotal * .5 + .5));
}

function vertexValue(values: Float32Array, columns: number, column: number, row: number) {
  return values[row * (columns + 1) + column];
}

function interpolate(first: number, second: number, level: number) {
  const difference = second - first;
  if (Math.abs(difference) < .000001)
    return .5;
  return Math.min(1, Math.max(0, (level - first) / difference));
}

type Point = readonly [number, number];
type EdgePoint = { id: string; point: Point };
type ContourSegment = { first: EdgePoint; second: EdgePoint };

function edgeId(edge: number, column: number, row: number) {
  if (edge === 0)
    return `h:${row}:${column}`;
  if (edge === 1)
    return `v:${row}:${column + 1}`;
  if (edge === 2)
    return `h:${row + 1}:${column}`;
  return `v:${row}:${column}`;
}

function pointForEdge(edge: number, column: number, row: number, x: number, y: number, cellWidth: number, cellHeight: number, values: [number, number, number, number], level: number): EdgePoint {
  const [topLeft, topRight, bottomRight, bottomLeft] = values;
  if (edge === 0)
    return { id: edgeId(edge, column, row), point: [x + interpolate(topLeft, topRight, level) * cellWidth, y] };
  if (edge === 1)
    return { id: edgeId(edge, column, row), point: [x + cellWidth, y + interpolate(topRight, bottomRight, level) * cellHeight] };
  if (edge === 2)
    return { id: edgeId(edge, column, row), point: [x + interpolate(bottomLeft, bottomRight, level) * cellWidth, y + cellHeight] };
  return { id: edgeId(edge, column, row), point: [x, y + interpolate(topLeft, bottomLeft, level) * cellHeight] };
}

function addSegment(segments: ContourSegment[], firstEdge: number, secondEdge: number, column: number, row: number, x: number, y: number, cellWidth: number, cellHeight: number, values: [number, number, number, number], level: number) {
  segments.push({ first: pointForEdge(firstEdge, column, row, x, y, cellWidth, cellHeight, values, level), second: pointForEdge(secondEdge, column, row, x, y, cellWidth, cellHeight, values, level) });
}

function addCellSegments(segments: ContourSegment[], mask: number, column: number, row: number, x: number, y: number, cellWidth: number, cellHeight: number, values: [number, number, number, number], level: number) {
  if (mask === 0 || mask === 15)
    return;
  if (mask === 1 || mask === 14) {
    addSegment(segments, 3, 0, column, row, x, y, cellWidth, cellHeight, values, level);
    return;
  }
  if (mask === 2 || mask === 13) {
    addSegment(segments, 0, 1, column, row, x, y, cellWidth, cellHeight, values, level);
    return;
  }
  if (mask === 3 || mask === 12) {
    addSegment(segments, 3, 1, column, row, x, y, cellWidth, cellHeight, values, level);
    return;
  }
  if (mask === 4 || mask === 11) {
    addSegment(segments, 1, 2, column, row, x, y, cellWidth, cellHeight, values, level);
    return;
  }
  if (mask === 6 || mask === 9) {
    addSegment(segments, 0, 2, column, row, x, y, cellWidth, cellHeight, values, level);
    return;
  }
  if (mask === 7 || mask === 8) {
    addSegment(segments, 3, 2, column, row, x, y, cellWidth, cellHeight, values, level);
    return;
  }
  const center = (values[0] + values[1] + values[2] + values[3]) * .25;
  if (mask === 5) {
    if (center >= level) {
      addSegment(segments, 0, 1, column, row, x, y, cellWidth, cellHeight, values, level);
      addSegment(segments, 2, 3, column, row, x, y, cellWidth, cellHeight, values, level);
      return;
    }
    addSegment(segments, 3, 0, column, row, x, y, cellWidth, cellHeight, values, level);
    addSegment(segments, 1, 2, column, row, x, y, cellWidth, cellHeight, values, level);
    return;
  }
  if (center >= level) {
    addSegment(segments, 3, 0, column, row, x, y, cellWidth, cellHeight, values, level);
    addSegment(segments, 1, 2, column, row, x, y, cellWidth, cellHeight, values, level);
    return;
  }
  addSegment(segments, 0, 1, column, row, x, y, cellWidth, cellHeight, values, level);
  addSegment(segments, 2, 3, column, row, x, y, cellWidth, cellHeight, values, level);
}

function midpoint(first: Point, second: Point): Point {
  return [(first[0] + second[0]) * .5, (first[1] + second[1]) * .5];
}

function samePoint(first: Point, second: Point) {
  return Math.abs(first[0] - second[0]) < .000001 && Math.abs(first[1] - second[1]) < .000001;
}

function distance(first: Point, second: Point) {
  return Math.hypot(second[0] - first[0], second[1] - first[1]);
}

function tracePolyline(startSegment: number, startEdge: string, segments: ContourSegment[], adjacency: Map<string, number[]>, visited: Uint8Array) {
  const points: Point[] = [];
  let segmentIndex = startSegment;
  let edge = startEdge;
  points.push(segments[segmentIndex].first.id === edge ? segments[segmentIndex].first.point : segments[segmentIndex].second.point);
  while (segmentIndex >= 0 && !visited[segmentIndex]) {
    const segment = segments[segmentIndex];
    visited[segmentIndex] = 1;
    const next = segment.first.id === edge ? segment.second : segment.first;
    points.push(next.point);
    edge = next.id;
    const candidates = adjacency.get(edge) ?? [];
    segmentIndex = candidates.find((candidate) => !visited[candidate]) ?? -1;
  }
  if (points.length > 1 && samePoint(points[0], points[points.length - 1]))
    points.pop();
  return points;
}

function polylinePath(points: Point[], closed: boolean) {
  if (closed) {
    if (points.length < 5)
      return null;
    let perimeter = distance(points[points.length - 1], points[0]);
    for (let index = 1; index < points.length; index += 1)
      perimeter += distance(points[index - 1], points[index]);
    if (perimeter < 24)
      return null;
    const start = midpoint(points[points.length - 1], points[0]);
    const parts = ["M", start[0].toFixed(2), start[1].toFixed(2)];
    for (let index = 0; index < points.length; index += 1) {
      const next = points[(index + 1) % points.length];
      const control = points[index];
      const end = midpoint(control, next);
      parts.push("Q", control[0].toFixed(2), control[1].toFixed(2), end[0].toFixed(2), end[1].toFixed(2));
    }
    parts.push("Z");
    return parts.join(" ");
  }
  if (points.length < 2)
    return null;
  if (points.length === 2)
    return `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)} L ${points[1][0].toFixed(2)} ${points[1][1].toFixed(2)}`;
  const firstMidpoint = midpoint(points[0], points[1]);
  const parts = ["M", points[0][0].toFixed(2), points[0][1].toFixed(2), "L", firstMidpoint[0].toFixed(2), firstMidpoint[1].toFixed(2)];
  for (let index = 1; index < points.length - 1; index += 1) {
    const control = points[index];
    const end = midpoint(control, points[index + 1]);
    parts.push("Q", control[0].toFixed(2), control[1].toFixed(2), end[0].toFixed(2), end[1].toFixed(2));
  }
  const last = points[points.length - 1];
  parts.push("L", last[0].toFixed(2), last[1].toFixed(2));
  return parts.join(" ");
}

function connectSegments(segments: ContourSegment[]) {
  if (segments.length === 0)
    return [];
  const adjacency = new Map<string, number[]>();
  for (const [index, segment] of segments.entries()) {
    for (const edge of [segment.first.id, segment.second.id]) {
      const connected = adjacency.get(edge);
      if (connected)
        connected.push(index);
      else
        adjacency.set(edge, [index]);
    }
  }
  const visited = new Uint8Array(segments.length);
  const paths: Array<{ d: string; closed: boolean }> = [];
  for (const [edge, connected] of adjacency.entries()) {
    if (connected.length !== 1)
      continue;
    const points = tracePolyline(connected[0], edge, segments, adjacency, visited);
    const d = polylinePath(points, false);
    if (d)
      paths.push({ d, closed: false });
  }
  for (let index = 0; index < segments.length; index += 1) {
    if (visited[index])
      continue;
    const segment = segments[index];
    const points = tracePolyline(index, segment.first.id, segments, adjacency, visited);
    const d = polylinePath(points, true);
    if (d)
      paths.push({ d, closed: true });
  }
  return paths;
}

function contourLevels(gap: number) {
  const levels: number[] = [];
  for (let level = .08; level < .93 && levels.length < MAX_CONTOUR_LEVELS; level += gap)
    levels.push(Number(level.toFixed(4)));
  return levels;
}

export function generateContourField(width: number, height: number, input: SettingInput = undefined): ContourFieldGeometry {
  const settings = normalizeContourSettings(input);
  const grid = getContourGrid(width, height);
  const vertexColumns = grid.columns + 1;
  const vertexRows = grid.rows + 1;
  const values = new Float32Array(vertexColumns * vertexRows);

  for (let row = 0; row < vertexRows; row += 1) {
    const y = Math.min(grid.height, row * grid.spacing);
    for (let column = 0; column < vertexColumns; column += 1) {
      const x = Math.min(grid.width, column * grid.spacing);
      values[row * vertexColumns + column] = fractalNoise(x, y, settings);
    }
  }

  const paths: ContourPath[] = [];
  for (const [levelIndex, level] of contourLevels(settings.contourGap).entries()) {
    const segments: ContourSegment[] = [];
    for (let row = 0; row < grid.rows; row += 1) {
      const y = row * grid.spacing;
      const cellHeight = Math.min(grid.spacing, grid.height - y);
      for (let column = 0; column < grid.columns; column += 1) {
        const x = column * grid.spacing;
        const cellWidth = Math.min(grid.spacing, grid.width - x);
        const valuesForCell: [number, number, number, number] = [
          vertexValue(values, grid.columns, column, row),
          vertexValue(values, grid.columns, column + 1, row),
          vertexValue(values, grid.columns, column + 1, row + 1),
          vertexValue(values, grid.columns, column, row + 1),
        ];
        let mask = 0;
        if (valuesForCell[0] >= level)
          mask |= 1;
        if (valuesForCell[1] >= level)
          mask |= 2;
        if (valuesForCell[2] >= level)
          mask |= 4;
        if (valuesForCell[3] >= level)
          mask |= 8;
        addCellSegments(segments, mask, column, row, x, y, cellWidth, cellHeight, valuesForCell, level);
      }
    }
    const connected = connectSegments(segments);
    if (connected.length > 0)
      paths.push({ d: connected.map((path) => path.d).join(" "), level, major: levelIndex % 4 === 0 });
  }

  return { ...grid, paths };
}
