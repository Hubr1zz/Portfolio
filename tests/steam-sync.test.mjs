import test from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { normalizeOwnedGames, resolveCoverUrl, syncSteamLibrary } from "../scripts/sync-steam-library.mjs";

const environment = { steamId: "76561198000000000", apiKey: "fake-key" };

async function makeSnapshotDirectory(t, content) {
  const directory = await mkdtemp(join(tmpdir(), "steam-sync-"));
  const destination = join(directory, "steam-library.json");
  if (content !== undefined)
    await writeFile(destination, content, "utf8");
  t.after(() => rm(directory, { recursive: true, force: true }));
  return destination;
}

test("normalizeOwnedGames filters invalid records, deduplicates app ids, and sorts by playtime", () => {
  const games = normalizeOwnedGames([
    { appid: 2, name: "Second", playtime_forever: 25 },
    { appid: 1, name: "First", playtime_forever: 90 },
    { appid: 2, name: "Second", playtime_forever: 40 },
    { appid: 3, name: "Zero", playtime_forever: 0 },
    { appid: "4", name: "Wrong id", playtime_forever: 100 },
    { appid: 5, name: "Negative", playtime_forever: -1 },
    { appid: 6, name: "Missing time" },
  ]);

  assert.deepEqual(games, [
    { appid: 1, name: "First", playtimeMinutes: 90, coverUrl: null },
    { appid: 2, name: "Second", playtimeMinutes: 40, coverUrl: null },
  ]);
});

test("normalizeOwnedGames safely returns an empty list for a missing response array", () => {
  assert.deepEqual(normalizeOwnedGames(null), []);
  assert.deepEqual(normalizeOwnedGames({ games: [] }), []);
});

test("API failure keeps the previous snapshot and does not expose the API key", async (t) => {
  const previous = "{\n  \"version\": 1,\n  \"games\": []\n}\n";
  const destination = await makeSnapshotDirectory(t, previous);
  mock.method(globalThis, "fetch", async () => { throw new Error("fake-key must stay private"); });
  let error;
  await assert.rejects(() => syncSteamLibrary(environment, destination), (candidate) => {
    error = candidate;
    return candidate instanceof Error;
  });
  assert.match(error.message, /Steam API request failed/);
  assert.doesNotMatch(error.message, /fake-key/);
  assert.equal(await readFile(destination, "utf8"), previous);
  mock.restoreAll();
});

test("a private profile response keeps the previous snapshot", async (t) => {
  const previous = "{\"version\":1,\"games\":[] }\n";
  const destination = await makeSnapshotDirectory(t, previous);
  mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({ response: {} }), { status: 200 }));
  await assert.rejects(() => syncSteamLibrary(environment, destination), /private or unavailable/);
  assert.equal(await readFile(destination, "utf8"), previous);
  mock.restoreAll();
});

test("a legal zero-game response writes an empty synced snapshot", async (t) => {
  const destination = await makeSnapshotDirectory(t);
  mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({ response: { game_count: 0 } }), { status: 200 }));
  const result = await syncSteamLibrary(environment, destination);
  const snapshot = JSON.parse(await readFile(destination, "utf8"));
  assert.deepEqual(snapshot.games, []);
  assert.equal(snapshot.profileUrl, `https://steamcommunity.com/profiles/${environment.steamId}`);
  assert.ok(snapshot.updatedAt);
  assert.equal(result.coverCount, 0);
  mock.restoreAll();
});

test("merges primary and family accounts without attributing family time to the primary account", async (t) => {
  const primaryId = "76561198388597018";
  const familyId = "76561198851590196";
  const destination = await makeSnapshotDirectory(t);
  mock.method(globalThis, "fetch", async (input, options) => {
    const url = new URL(input);
    if (options?.method === "HEAD")
      return new Response("", { status: 200, headers: { "content-type": "image/jpeg" } });
    if (url.searchParams.get("steamid") === primaryId)
      return new Response(JSON.stringify({ response: { game_count: 2, games: [{ appid: 10, name: "Shared", playtime_forever: 120 }, { appid: 12, name: "Unplayed primary", playtime_forever: 0 }] } }), { status: 200 });
    return new Response(JSON.stringify({ response: { game_count: 2, games: [{ appid: 10, name: "Shared", playtime_forever: 45 }, { appid: 11, name: "Family zero", playtime_forever: 0 }] } }), { status: 200 });
  });

  const result = await syncSteamLibrary({ steamIds: [primaryId, familyId], apiKey: "fake-key" }, destination);
  const snapshot = JSON.parse(await readFile(destination, "utf8"));
  assert.equal(snapshot.version, 2);
  assert.deepEqual(snapshot.profiles, [
    { steamId: primaryId, role: "primary", url: `https://steamcommunity.com/profiles/${primaryId}` },
    { steamId: familyId, role: "family", url: `https://steamcommunity.com/profiles/${familyId}` },
  ]);
  assert.deepEqual(snapshot.games.map(({ appid, playtimeMinutes, familyPlaytimeMinutes, accountIds, origin }) => ({ appid, playtimeMinutes, familyPlaytimeMinutes, accountIds, origin })), [
    { appid: 10, playtimeMinutes: 120, familyPlaytimeMinutes: 45, accountIds: [primaryId, familyId], origin: "both" },
    { appid: 11, playtimeMinutes: 0, familyPlaytimeMinutes: 0, accountIds: [familyId], origin: "family" },
    { appid: 12, playtimeMinutes: 0, familyPlaytimeMinutes: 0, accountIds: [primaryId], origin: "primary" },
  ]);
  assert.equal(result.snapshot.games.find((game) => game.appid === 10).playtimeMinutes, 120);
  mock.restoreAll();
});

test("a family-account failure keeps the previous snapshot atomically", async (t) => {
  const previous = "{\n  \"version\": 2,\n  \"games\": []\n}\n";
  const destination = await makeSnapshotDirectory(t, previous);
  const primaryId = "76561198388597018";
  const familyId = "76561198851590196";
  mock.method(globalThis, "fetch", async (input) => {
    const url = new URL(input);
    if (url.searchParams.get("steamid") === primaryId)
      return new Response(JSON.stringify({ response: { game_count: 1, games: [{ appid: 10, name: "Primary", playtime_forever: 10 }] } }), { status: 200 });
    return new Response(JSON.stringify({ response: {} }), { status: 200 });
  });
  await assert.rejects(() => syncSteamLibrary({ steamIds: [primaryId, familyId], apiKey: "fake-key" }, destination), /private or unavailable/);
  assert.equal(await readFile(destination, "utf8"), previous);
  mock.restoreAll();
});

test("an invalid non-empty game record keeps the previous snapshot", async (t) => {
  const previous = "{\"version\":1,\"games\":[] }\n";
  const destination = await makeSnapshotDirectory(t, previous);
  mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({ response: { game_count: 1, games: [{ appid: 1, name: "Missing playtime" }] } }), { status: 200 }));
  await assert.rejects(() => syncSteamLibrary(environment, destination), /invalid game data/);
  assert.equal(await readFile(destination, "utf8"), previous);
  mock.restoreAll();
});

test("an inconsistent positive game count keeps the previous snapshot", async (t) => {
  const previous = "{\"version\":1,\"games\":[] }\n";
  const destination = await makeSnapshotDirectory(t, previous);
  mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({ response: { game_count: 4, games: [] } }), { status: 200 }));
  await assert.rejects(() => syncSteamLibrary(environment, destination), /invalid game data/);
  assert.equal(await readFile(destination, "utf8"), previous);
  mock.restoreAll();
});

test("cover lookup returns null for a non-image response and a timeout", async () => {
  mock.method(globalThis, "fetch", async () => new Response("", { status: 404, headers: { "content-type": "text/html" } }));
  assert.equal(await resolveCoverUrl(570), null);
  mock.restoreAll();
  mock.method(globalThis, "fetch", async () => { throw new DOMException("Timed out", "TimeoutError"); });
  assert.equal(await resolveCoverUrl(570), null);
  mock.restoreAll();
});
