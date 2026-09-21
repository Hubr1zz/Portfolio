import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { writeSnapshot } from "./sync-steam-library.mjs";

const rootDirectory = fileURLToPath(new URL("..", import.meta.url));
const gamesPath = resolve(rootDirectory, "data/steam-library-games.json");
const outputPath = resolve(rootDirectory, "public/data/steam-library.json");
const envPath = resolve(rootDirectory, ".env.steam.local");
const steamGridDbApi = "https://www.steamgriddb.com/api/v2";
const profileIds = ["76561198388597018", "76561198851590196"];

class ImportError extends Error {}

function readApiKey() {
  if (typeof process.loadEnvFile === "function")
    process.loadEnvFile(envPath);
  const key = process.env.STEAMGRIDDB_API_KEY?.trim();
  if (!key)
    throw new ImportError("Missing STEAMGRIDDB_API_KEY in .env.steam.local.");
  return key;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(20000) });
  if (!response.ok)
    throw new ImportError(`Request failed (${response.status}) for ${url}`);
  return response.json();
}

async function readPreviousCovers() {
  try {
    const snapshot = JSON.parse(await readFile(outputPath, "utf8"));
    if (!Array.isArray(snapshot?.games))
      return new Map();
    return new Map(snapshot.games.filter((game) => Number.isInteger(game?.appid) && typeof game?.coverUrl === "string" && game.coverUrl.startsWith("https://cdn2.steamgriddb.com/")).map((game) => [game.appid, game.coverUrl]));
  } catch {
    return new Map();
  }
}

async function findCover(appid, headers) {
  const gamePayload = await fetchJson(`${steamGridDbApi}/games/steam/${appid}`, { headers });
  const gameId = gamePayload?.data?.id;
  if (!Number.isInteger(gameId))
    return null;
  const gridsPayload = await fetchJson(`${steamGridDbApi}/grids/game/${gameId}?dimensions=600x900`, { headers });
  const grids = Array.isArray(gridsPayload?.data) ? gridsPayload.data : [];
  const preferred = grids.find((grid) => grid?.language === "en" && !grid.nsfw && typeof grid.url === "string") ?? grids.find((grid) => !grid.nsfw && typeof grid.url === "string");
  return preferred?.url ?? null;
}

async function mapWithConcurrency(values, limit, callback) {
  const results = new Array(values.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex++;
      try {
        results[index] = await callback(values[index]);
      } catch {
        results[index] = null;
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, () => worker()));
  return results;
}

function validateGames(value) {
  if (!Array.isArray(value) || !value.every((game) => Number.isInteger(game?.appid) && game.appid > 0 && typeof game?.name === "string" && game.name.trim().length > 0))
    throw new ImportError("Curated screenshot game source is invalid.");
  if (new Set(value.map((game) => game.appid)).size !== value.length)
    throw new ImportError("Curated screenshot game source contains duplicate Steam AppIDs.");
  return value;
}

export async function importScreenshotLibrary() {
  const sourceGames = validateGames(JSON.parse(await readFile(gamesPath, "utf8")));
  const headers = { Authorization: `Bearer ${readApiKey()}` };
  const previousCovers = await readPreviousCovers();
  const missingGames = sourceGames.filter((game) => !previousCovers.has(game.appid));
  const resolvedCovers = await mapWithConcurrency(missingGames, 5, (game) => findCover(game.appid, headers));
  const newCovers = new Map(missingGames.map((game, index) => [game.appid, resolvedCovers[index]]));
  const games = sourceGames.map((game) => ({
    ...game,
    playtimeMinutes: 0,
    familyPlaytimeMinutes: 0,
    accountIds: [...profileIds],
    origin: "both",
    coverUrl: previousCovers.get(game.appid) ?? newCovers.get(game.appid) ?? null,
  }));
  const snapshot = {
    version: 3,
    source: "screenshots",
    updatedAt: new Date().toISOString(),
    profileUrl: `https://steamcommunity.com/profiles/${profileIds[0]}`,
    profiles: profileIds.map((steamId, index) => ({ steamId, role: index === 0 ? "primary" : "family", url: `https://steamcommunity.com/profiles/${steamId}` })),
    games,
  };
  await writeSnapshot(snapshot, outputPath);
  return { snapshot, reusedCount: games.filter((game) => previousCovers.has(game.appid)).length, missingCoverCount: games.filter((game) => !game.coverUrl).length };
}

async function main() {
  const result = await importScreenshotLibrary();
  const coverCount = result.snapshot.games.length - result.missingCoverCount;
  console.log(`[steam-import] imported ${result.snapshot.games.length} verified games; ${coverCount} SteamGridDB covers (${result.reusedCount} reused, ${result.missingCoverCount} unavailable).`);
}

const entryPoint = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === entryPoint)
  main().catch((error) => {
    console.error(`[steam-import] ${error instanceof ImportError ? error.message : "Screenshot library import failed."}`);
    process.exitCode = 1;
  });
