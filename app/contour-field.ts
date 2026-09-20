export const MAX_CONTOUR_CELLS = 18000;
export const MAX_CONTOUR_LEVELS = 32;
export const DEFAULT_GRID_SPACING = 18;

export interface ContourSettings {
  seed: number;
  noiseScale: number;
  octaves: number;
  persistence: number;
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
  noiseScale: 190,
  octaves: 3,
  persistence: .5,
  contourGap: .065,
  lineWidth: 1,
  baseOpacity: .06,
  pointerIntensity: .18,
  pointerRadius: 220,
});

const CONTOUR_LIMITS = {
  seed: [1, 999],
  noiseScale: [80, 420],
  octaves: [1, 5],
  persistence: [.2, .8],
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

function hash2d(x: number, y: number, seed: number) {
  let value = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1442695041);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function smoothStep(value: number) {
  return value * value * (3 - 2 * value);
}

function valueNoise(x: number, y: number, seed: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = smoothStep(x - x0);
  const ty = smoothStep(y - y0);
  const top = hash2d(x0, y0, seed) + (hash2d(x0 + 1, y0, seed) - hash2d(x0, y0, seed)) * tx;
  const bottom = hash2d(x0, y0 + 1, seed) + (hash2d(x0 + 1, y0 + 1, seed) - hash2d(x0, y0 + 1, seed)) * tx;
  return top + (bottom - top) * ty;
}

function fractalNoise(x: number, y: number, settings: ContourSettings) {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let amplitudeTotal = 0;
  const baseSeed = settings.seed * 17 + 11;

  for (let octave = 0; octave < settings.octaves; octave += 1) {
    const offsetX = baseSeed * .013 * frequency;
    const offsetY = baseSeed * -.009 * frequency;
    value += valueNoise(x / settings.noiseScale * frequency + offsetX, y / settings.noiseScale * frequency + offsetY, settings.seed + octave * 101) * amplitude;
    amplitudeTotal += amplitude;
    amplitude *= settings.persistence;
    frequency *= 2;
  }

  return value / amplitudeTotal;
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

function pointForEdge(edge: number, x: number, y: number, cellWidth: number, cellHeight: number, values: [number, number, number, number], level: number) {
  const [topLeft, topRight, bottomRight, bottomLeft] = values;
  if (edge === 0)
    return [x + interpolate(topLeft, topRight, level) * cellWidth, y] as const;
  if (edge === 1)
    return [x + cellWidth, y + interpolate(topRight, bottomRight, level) * cellHeight] as const;
  if (edge === 2)
    return [x + interpolate(bottomLeft, bottomRight, level) * cellWidth, y + cellHeight] as const;
  return [x, y + interpolate(topLeft, bottomLeft, level) * cellHeight] as const;
}

function addSegment(parts: string[], firstEdge: number, secondEdge: number, x: number, y: number, cellWidth: number, cellHeight: number, values: [number, number, number, number], level: number) {
  const first = pointForEdge(firstEdge, x, y, cellWidth, cellHeight, values, level);
  const second = pointForEdge(secondEdge, x, y, cellWidth, cellHeight, values, level);
  parts.push("M", first[0].toFixed(1), first[1].toFixed(1), "L", second[0].toFixed(1), second[1].toFixed(1));
}

function addCellSegments(parts: string[], mask: number, x: number, y: number, cellWidth: number, cellHeight: number, values: [number, number, number, number], level: number) {
  if (mask === 0 || mask === 15)
    return;
  if (mask === 1 || mask === 14) {
    addSegment(parts, 3, 0, x, y, cellWidth, cellHeight, values, level);
    return;
  }
  if (mask === 2 || mask === 13) {
    addSegment(parts, 0, 1, x, y, cellWidth, cellHeight, values, level);
    return;
  }
  if (mask === 3 || mask === 12) {
    addSegment(parts, 3, 1, x, y, cellWidth, cellHeight, values, level);
    return;
  }
  if (mask === 4 || mask === 11) {
    addSegment(parts, 1, 2, x, y, cellWidth, cellHeight, values, level);
    return;
  }
  if (mask === 6 || mask === 9) {
    addSegment(parts, 0, 2, x, y, cellWidth, cellHeight, values, level);
    return;
  }
  if (mask === 7 || mask === 8) {
    addSegment(parts, 3, 2, x, y, cellWidth, cellHeight, values, level);
    return;
  }
  const center = (values[0] + values[1] + values[2] + values[3]) * .25;
  if (mask === 5) {
    if (center >= level) {
      addSegment(parts, 0, 1, x, y, cellWidth, cellHeight, values, level);
      addSegment(parts, 2, 3, x, y, cellWidth, cellHeight, values, level);
      return;
    }
    addSegment(parts, 3, 0, x, y, cellWidth, cellHeight, values, level);
    addSegment(parts, 1, 2, x, y, cellWidth, cellHeight, values, level);
    return;
  }
  if (center >= level) {
    addSegment(parts, 3, 0, x, y, cellWidth, cellHeight, values, level);
    addSegment(parts, 1, 2, x, y, cellWidth, cellHeight, values, level);
    return;
  }
  addSegment(parts, 0, 1, x, y, cellWidth, cellHeight, values, level);
  addSegment(parts, 2, 3, x, y, cellWidth, cellHeight, values, level);
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
    const parts: string[] = [];
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
        addCellSegments(parts, mask, x, y, cellWidth, cellHeight, valuesForCell, level);
      }
    }
    if (parts.length > 0)
      paths.push({ d: parts.join(" "), level, major: levelIndex % 4 === 0 });
  }

  return { ...grid, paths };
}
