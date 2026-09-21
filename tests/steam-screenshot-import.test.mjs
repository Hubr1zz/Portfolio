import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = JSON.parse(await readFile(new URL("../data/steam-library-games.json", import.meta.url), "utf8"));
const snapshot = JSON.parse(await readFile(new URL("../public/data/steam-library.json", import.meta.url), "utf8"));
const excludedAppids = new Set(JSON.parse(await readFile(new URL("../data/steam-library-corrections.json", import.meta.url), "utf8")).removeAppids);

test("screenshot snapshot exactly follows the curated game manifest", () => {
  assert.equal(snapshot.source, "screenshots");
  assert.equal(snapshot.games.length, source.length);
  assert.deepEqual(snapshot.games.map(({ appid, name }) => ({ appid, name })), source);
});

test("curated game manifest has unique app ids and excludes non-game launch entries", () => {
  assert.equal(new Set(source.map((game) => game.appid)).size, source.length);
  assert.equal(source.some((game) => excludedAppids.has(game.appid)), false);
  assert.equal(source.some((game) => /\b(?:demo|prologue)\b|test server|public beta|unstable|friend's pass|wallpaper engine|aseprite|unity hub|tmodloader|aimlabs/i.test(game.name)), false);
});

test("known screenshot title corrections stay pinned to verified Steam apps", () => {
  const byAppid = new Map(source.map((game) => [game.appid, game.name]));
  assert.equal(byAppid.get(975370), "Dwarf Fortress");
  assert.equal(byAppid.get(4001890), "How to Fish");
  assert.equal(byAppid.get(3003460), "Bang Bang Barrage");
  assert.equal(byAppid.get(1190460), "DEATH STRANDING");
  assert.equal(byAppid.get(625960), "Stoneshard");
  assert.equal(byAppid.get(942970), "Unheard - Voices of Crime");
});
