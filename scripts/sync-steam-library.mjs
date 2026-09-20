import { existsSync } from "node:fs";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootDirectory = fileURLToPath(new URL("..", import.meta.url));
const outputPath = resolve(rootDirectory, "public/data/steam-library.json");
const envPath = resolve(rootDirectory, ".env.steam.local");
const steamApiUrl = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/";
const coverUrlTemplate = (appid) => `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appid}/library_600x900.jpg`;
const defaultSteamIds = ["76561198388597018", "76561198851590196"];

class SyncError extends Error {}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isValidCoverUrl(value) {
  return typeof value === "string" && value.startsWith("https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/");
}

export function normalizeOwnedGames(games) {
  if (!Array.isArray(games))
    return [];

  const byAppId = new Map();
  for (const rawGame of games) {
    if (!isRecord(rawGame) || !Number.isInteger(rawGame.appid) || rawGame.appid <= 0 || typeof rawGame.name !== "string" || rawGame.name.trim().length === 0 || !Number.isInteger(rawGame.playtime_forever) || rawGame.playtime_forever <= 0)
      continue;
    const candidate = { appid: rawGame.appid, name: rawGame.name, playtimeMinutes: rawGame.playtime_forever, coverUrl: null };
    const previous = byAppId.get(candidate.appid);
    if (!previous || previous.playtimeMinutes < candidate.playtimeMinutes)
      byAppId.set(candidate.appid, candidate);
  }

  return [...byAppId.values()].sort((left, right) => right.playtimeMinutes - left.playtimeMinutes || left.appid - right.appid);
}

function validateSteamIds(value) {
  let steamIds = [];
  if (Array.isArray(value))
    steamIds = value;
  else if (typeof value === "string")
    steamIds = value.split(",");
  const uniqueIds = [...new Set(steamIds.map((steamId) => String(steamId).trim()).filter(Boolean))];
  if (uniqueIds.length === 0 || uniqueIds.some((steamId) => !/^\d{17}$/.test(steamId)))
    throw new SyncError("Steam IDs must be 17-digit numbers.");
  return uniqueIds;
}

export async function writeSnapshot(snapshot, destination = outputPath) {
  const directory = dirname(destination);
  const temporaryPath = `${destination}.${process.pid}.${Date.now()}.tmp`;
  await mkdir(directory, { recursive: true });
  try {
    await writeFile(temporaryPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
    await rename(temporaryPath, destination);
  } catch {
    await unlink(temporaryPath).catch(() => undefined);
    throw new SyncError("The local Steam snapshot could not be written.");
  }
}

async function readPreviousSnapshot(destination) {
  try {
    const value = JSON.parse(await readFile(destination, "utf8"));
    if (!isRecord(value) || !Array.isArray(value.games))
      return new Map();
    return new Map(value.games.filter((game) => isRecord(game) && Number.isInteger(game.appid) && isValidCoverUrl(game.coverUrl)).map((game) => [game.appid, game.coverUrl]));
  } catch {
    return new Map();
  }
}

export async function resolveCoverUrl(appid) {
  try {
    const response = await fetch(coverUrlTemplate(appid), { method: "HEAD", signal: AbortSignal.timeout(8000) });
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (!response.ok || !contentType.startsWith("image/"))
      return null;
    return coverUrlTemplate(appid);
  } catch {
    return null;
  }
}

async function mapWithConcurrency(values, limit, callback) {
  const results = new Array(values.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await callback(values[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, () => worker()));
  return results;
}

function requiredEnvironment() {
  if (existsSync(envPath))
    process.loadEnvFile(envPath);
  const configuredIds = process.env.STEAM_IDS?.trim() || (process.env.STEAM_ID64 ? [process.env.STEAM_ID64] : defaultSteamIds);
  const apiKey = process.env.STEAM_API_KEY;
  const steamIds = validateSteamIds(configuredIds);
  if (!apiKey)
    throw new SyncError("Missing STEAM_API_KEY in .env.steam.local.");
  return { steamIds, steamId: steamIds[0], apiKey };
}

async function fetchOwnedGames({ steamId, apiKey }) {
  let response;
  try {
    const url = new URL(steamApiUrl);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("steamid", steamId);
    url.searchParams.set("include_appinfo", "true");
    url.searchParams.set("include_played_free_games", "true");
    response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  } catch {
    throw new SyncError("Steam API request failed.");
  }
  if (!response.ok)
    throw new SyncError("Steam API request failed.");

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new SyncError("Steam API returned invalid JSON.");
  }
  if (!isRecord(payload) || !isRecord(payload.response))
    throw new SyncError("Steam profile is private or unavailable; no games were returned.");
  const responseData = payload.response;
  if (Object.keys(responseData).length === 0)
    throw new SyncError("Steam profile is private or unavailable; no games were returned.");
  if (responseData.game_count === 0) {
    if (responseData.games === undefined || Array.isArray(responseData.games) && responseData.games.length === 0)
      return [];
    throw new SyncError("Steam returned invalid game data; the existing snapshot was kept.");
  }
  if (!Number.isInteger(responseData.game_count) || responseData.game_count < 1 || !Array.isArray(responseData.games) || responseData.games.length === 0 || responseData.games.length !== responseData.game_count)
    throw new SyncError("Steam returned invalid game data; the existing snapshot was kept.");
  if (!responseData.games.every((game) => isRecord(game) && Number.isInteger(game.appid) && game.appid > 0 && typeof game.name === "string" && game.name.trim().length > 0 && Number.isInteger(game.playtime_forever) && game.playtime_forever >= 0))
    throw new SyncError("Steam returned invalid game data; the existing snapshot was kept.");
  return responseData.games;
}

function normalizeAccountGames(games, steamId, role) {
  const byAppId = new Map();
  for (const rawGame of games) {
    const playtimeMinutes = rawGame.playtime_forever;
    const candidate = {
      appid: rawGame.appid,
      name: rawGame.name,
      playtimeMinutes: role === "primary" ? playtimeMinutes : 0,
      familyPlaytimeMinutes: role === "family" ? playtimeMinutes : 0,
      coverUrl: null,
      accountIds: [steamId],
      origin: role,
    };
    const previous = byAppId.get(candidate.appid);
    if (!previous || playtimeMinutes > (role === "primary" ? previous.playtimeMinutes : previous.familyPlaytimeMinutes))
      byAppId.set(candidate.appid, candidate);
  }
  return [...byAppId.values()];
}

function mergeAccountGames(accounts) {
  const byAppId = new Map();
  const primarySteamId = accounts[0]?.steamId;
  for (const account of accounts) {
    for (const game of normalizeAccountGames(account.games, account.steamId, account.role)) {
      const previous = byAppId.get(game.appid);
      if (!previous) {
        byAppId.set(game.appid, game);
        continue;
      }
      if (previous.origin !== "primary" && game.origin === "primary")
        previous.name = game.name;
      previous.playtimeMinutes = Math.max(previous.playtimeMinutes, game.playtimeMinutes);
      previous.familyPlaytimeMinutes = Math.max(previous.familyPlaytimeMinutes, game.familyPlaytimeMinutes);
      previous.accountIds = [...new Set([...previous.accountIds, ...game.accountIds])];
      if (!previous.accountIds.includes(primarySteamId)) {
        previous.origin = "family";
        continue;
      }
      if (previous.accountIds.length > 1) {
        previous.origin = "both";
        continue;
      }
      previous.origin = "primary";
    }
  }
  return [...byAppId.values()].sort((left, right) => right.playtimeMinutes - left.playtimeMinutes || right.familyPlaytimeMinutes - left.familyPlaytimeMinutes || left.appid - right.appid);
}

export async function syncSteamLibrary(environment, destination = outputPath) {
  const steamIds = validateSteamIds(environment.steamIds ?? environment.steamId);
  if (typeof environment.apiKey !== "string" || environment.apiKey.length === 0)
    throw new SyncError("Missing Steam API key.");
  const accounts = await Promise.all(steamIds.map(async (steamId, index) => ({ steamId, role: index === 0 ? "primary" : "family", games: await fetchOwnedGames({ steamId, apiKey: environment.apiKey }) })));
  const normalizedGames = mergeAccountGames(accounts);

  const previousCovers = await readPreviousSnapshot(destination);
  const missingCoverGames = normalizedGames.filter((game) => !previousCovers.has(game.appid));
  const resolvedCovers = await mapWithConcurrency(missingCoverGames, 6, (game) => resolveCoverUrl(game.appid));
  const covers = new Map(missingCoverGames.map((game, index) => [game.appid, resolvedCovers[index]]));
  const games = normalizedGames.map((game) => ({ ...game, coverUrl: previousCovers.get(game.appid) ?? covers.get(game.appid) ?? null }));
  const profiles = accounts.map((account) => ({ steamId: account.steamId, role: account.role, url: `https://steamcommunity.com/profiles/${account.steamId}` }));
  const snapshot = { version: 2, updatedAt: new Date().toISOString(), profileUrl: profiles[0].url, profiles, games };
  await writeSnapshot(snapshot, destination);
  const reusedCount = normalizedGames.filter((game) => previousCovers.has(game.appid)).length;
  const coverCount = games.filter((game) => Boolean(game.coverUrl)).length;
  return { snapshot, reusedCount, coverCount };
}

async function main() {
  const result = await syncSteamLibrary(requiredEnvironment());
  console.log(`[steam-sync] synced ${result.snapshot.games.length} games; ${result.coverCount} covers available (${result.reusedCount} reused, ${result.snapshot.games.length - result.coverCount} unavailable).`);
}

const entryPoint = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === entryPoint)
  main().catch((error) => {
    console.error(`[steam-sync] ${error instanceof SyncError ? error.message : "Steam sync failed."}`);
    process.exitCode = 1;
  });
