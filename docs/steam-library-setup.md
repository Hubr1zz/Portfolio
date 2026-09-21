# Steam library snapshot

The portfolio reads `public/data/steam-library.json` at runtime. The file starts as an empty snapshot and is safe to commit because it contains no Steam API key. The sync script runs locally and writes only the public fields used by the page.

## Screenshot-based snapshot

When the Steam profile does not expose a complete public library, use the supplied screenshots as the source of truth. `data/steam-library-screenshot-names.json` preserves the transcribed titles, while `data/steam-library-games.json` is the reviewed manifest of English names and verified Steam AppIDs. `data/steam-library-corrections.json` records removed utilities, demos, alternate launch entries, and corrected matches. The importer uses the reviewed manifest directly and asks SteamGridDB only for missing cover URLs:

```text
npm run steam:import-screenshots
```

This command reads only `STEAMGRIDDB_API_KEY` from `.env.steam.local` and writes a static snapshot to `public/data/steam-library.json`. The key is never sent to the browser. Existing cover URLs are reused, and a failed cover lookup leaves that game's cover empty without dropping the game. The generated snapshot is tagged with `source: "screenshots"`, so the page does not imply that playtime or live library data was collected.

Create an ignored `.env.steam.local` file at the repository root. The API key stays local and is never sent to the frontend:

```text
STEAM_IDS=76561198388597018,76561198851590196
STEAM_API_KEY=your_steam_web_api_key
```

`STEAM_ID64` remains supported for a single account. When neither ID variable is set, the sync uses the two public IDs above. The first ID is treated as the primary account and the remaining IDs as family-library accounts. Every configured ID must be a valid 17-digit Steam ID.

Run the sync with Node 22 or later:

```text
npm run steam:sync
```

The underlying command is `node scripts/sync-steam-library.mjs`. As an optional alternative, Node can load the environment file before running it: `node --env-file=.env.steam.local scripts/sync-steam-library.mjs`. The script also loads `.env.steam.local` itself when the file exists. `STEAM_ID64` identifies the profile and is not a secret. The API key is a secret: keep it local and never put it in frontend code, `public/`, or the generated snapshot.

The source is Steam's [GetOwnedGames](https://partner.steamgames.com/doc/webapi/IPlayerService#GetOwnedGames) endpoint with app information and played free games included. The committed file is currently a pending empty snapshot; after a successful local sync it will contain the merged public owned-game lists for the two configured accounts. That result is not a complete Steam Family Sharing authorization view or a record of all historical play. The sync merges the public owned-game lists for the configured accounts; it does not claim to retrieve complete Steam Family Sharing entitlements. Primary-account playtime is stored in `playtimeMinutes`; family-account playtime is kept separately in `familyPlaytimeMinutes` and is never presented as the user's personal time. Family-owned games are retained even with zero recorded minutes, while the page's default “My play history” view shows primary games with recorded playtime and “Family library” shows the additional collection. Steam privacy settings for game details or playtime can limit the result; refunds, removed games, and every game ever played are not guaranteed to be retrievable. Every account must be fetched and validated successfully before writing. A private or unavailable profile, a failed request, or invalid data leaves the previous snapshot unchanged. A valid `game_count: 0` response writes a synced empty account result.

Each successful snapshot is version 2 and contains `profiles` with each configured ID, its role, and its public URL. It keeps `profileUrl` for version 1 readers, then stores `appid`, `name`, primary `playtimeMinutes`, family `familyPlaytimeMinutes`, `accountIds`, `origin`, and `coverUrl`. Version 1 snapshots remain readable by the page. Steam's [Library Assets](https://partner.steamgames.com/doc/store/assets/libraryassets) documentation provides the portrait cover specifications. The script uses the matching official CDN path only after an actual HEAD request confirms an image response; that CDN path is not a field guaranteed by `GetOwnedGames`. A missing cover stays `null`, and the page uses the game's name as its placeholder. Existing validated covers are reused for matching app IDs to avoid unnecessary checks. The cover checks run at most six at a time and time out after eight seconds; the Steam API request times out after fifteen seconds.
