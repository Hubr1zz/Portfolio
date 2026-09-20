"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { PortfolioShell } from "./portfolio";
import { assetPath, InternalLink } from "./portfolio-links";

type OtherSection = "games" | "projects";
type SortMode = "playtime" | "name";
type LibraryScope = "primary" | "family";
type SteamGame = {
  appid: number;
  name: string;
  playtimeMinutes: number;
  familyPlaytimeMinutes: number;
  accountIds: string[];
  origin: "primary" | "family" | "both";
  coverUrl: string | null;
};
type SteamLibrary = {
  version: number;
  updatedAt: string | null;
  profileUrl: string | null;
  profiles: { steamId: string; role: "primary" | "family"; url: string }[];
  games: SteamGame[];
};

const PAGE_SIZE = 24;

function isSteamGame(value: unknown, allowFamilyMetadata: boolean): value is SteamGame {
  if (!value || typeof value !== "object")
    return false;
  const game = value as Partial<SteamGame>;
  if (typeof game.appid !== "number" || !Number.isInteger(game.appid) || game.appid <= 0)
    return false;
  if (typeof game.name !== "string" || game.name.length === 0)
    return false;
  if (typeof game.playtimeMinutes !== "number" || !Number.isInteger(game.playtimeMinutes) || !Number.isFinite(game.playtimeMinutes) || (allowFamilyMetadata ? game.playtimeMinutes < 0 : game.playtimeMinutes <= 0))
    return false;
  if (allowFamilyMetadata && (typeof game.familyPlaytimeMinutes !== "number" || !Number.isInteger(game.familyPlaytimeMinutes) || !Number.isFinite(game.familyPlaytimeMinutes) || game.familyPlaytimeMinutes < 0 || !Array.isArray(game.accountIds) || game.accountIds.length === 0 || !game.accountIds.every((id) => typeof id === "string" && /^\d{17}$/.test(id)) || !["primary", "family", "both"].includes(game.origin ?? "")))
    return false;
  return game.coverUrl === null || (typeof game.coverUrl === "string" && game.coverUrl.length > 0);
}

function parseLibrary(value: unknown): SteamLibrary {
  if (!value || typeof value !== "object")
    throw new Error("Library data is unavailable.");
  const data = value as Partial<SteamLibrary>;
  const version = typeof data.version === "number" ? data.version : 1;
  if (!Array.isArray(data.games) || !data.games.every((game) => isSteamGame(game, version >= 2)))
    throw new Error("Library data is unavailable.");
  const games = data.games.map((game) => version >= 2 ? game : { ...game, familyPlaytimeMinutes: 0, accountIds: [], origin: "primary" as const });
  return {
    version,
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : null,
    profileUrl: typeof data.profileUrl === "string" ? data.profileUrl : null,
    profiles: Array.isArray(data.profiles) ? data.profiles.filter((profile): profile is SteamLibrary["profiles"][number] => Boolean(profile) && typeof profile === "object" && /^\d{17}$/.test(profile.steamId) && (profile.role === "primary" || profile.role === "family") && typeof profile.url === "string") : [],
    games,
  };
}

function formatPlaytime(minutes: number) {
  if (!Number.isFinite(minutes) || minutes <= 0)
    return "No recorded time";
  const hours = Math.floor(minutes / 60);
  if (hours < 1)
    return `${minutes} min played`;
  return `${hours.toLocaleString()} hr${hours === 1 ? "" : "s"} played`;
}

function formatUpdatedAt(value: string | null) {
  if (!value)
    return null;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf()))
    return null;
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(date);
}

function GameCover({ game }: { game: SteamGame }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(game.coverUrl) && !failed;

  return (
    <div className="game-cover">
      {showImage ? <img src={game.coverUrl ?? undefined} alt={`${game.name} cover`} loading="lazy" decoding="async" onError={() => setFailed(true)} /> : <span className="game-cover-fallback"><span>{game.name}</span></span>}
    </div>
  );
}

function GamesLibrary() {
  const [library, setLibrary] = useState<SteamLibrary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("playtime");
  const [scope, setScope] = useState<LibraryScope>("primary");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);
    let active = true;

    fetch(assetPath("/data/steam-library.json"), { cache: "no-store", signal: controller.signal })
      .then((response) => {
        if (!response.ok)
          throw new Error("Library data could not be loaded.");
        return response.json() as Promise<unknown>;
      })
      .then((value) => {
        if (active)
          setLibrary(parseLibrary(value));
      })
      .catch(() => {
        if (active)
          setError("The library could not be loaded right now.");
      })
      .finally(() => window.clearTimeout(timeoutId));

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [retryKey]);

  const filteredGames = useMemo(() => {
    if (!library)
      return [];
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const scopedGames = scope === "primary" ? library.games.filter((game) => game.playtimeMinutes > 0) : library.games.filter((game) => game.playtimeMinutes > 0 || game.origin === "family" || game.origin === "both");
    return scopedGames
      .filter((game) => !normalizedQuery || game.name.toLocaleLowerCase().includes(normalizedQuery))
      .sort((left, right) => sortMode === "name" ? left.name.localeCompare(right.name) : right.playtimeMinutes - left.playtimeMinutes);
  }, [library, query, scope, sortMode]);

  function retryLoad() {
    setError(null);
    setLibrary(null);
    setRetryKey((value) => value + 1);
  }

  if (error) {
    return <section className="library-state library-error" role="alert"><span className="section-index">LIBRARY / UNAVAILABLE</span><h2>Games could not load.</h2><p>{error}</p><button type="button" className="text-action" onClick={retryLoad}>Try again <span aria-hidden="true">↗</span></button></section>;
  }

  if (!library)
    return <section className="library-state" aria-live="polite"><span className="section-index">LIBRARY / LOADING</span><p>Loading play history…</p></section>;
  if (library.games.length === 0)
    return <LibraryEmpty isSynced={Boolean(library.updatedAt)} />;

  const updatedAt = formatUpdatedAt(library.updatedAt);
  const visibleGames = filteredGames.slice(0, visibleCount);

  return (
    <section className="games-library" aria-labelledby="games-library-heading">
      <div className="library-heading">
        <div><span className="section-index">01 / PLAY HISTORY</span><h2 id="games-library-heading">Games I Played</h2><p>An ongoing record of the games I spend time with, plus an additional family library.</p></div>
        <div className="library-meta"><span>{filteredGames.length} games</span>{updatedAt && <span>Updated {updatedAt}</span>}</div>
      </div>
      <div className="library-controls" aria-label="Game library controls">
        <label htmlFor="game-search">Search games</label>
        <input id="game-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(PAGE_SIZE); }} placeholder="Search by name" />
        <label htmlFor="game-library-scope">Library</label>
        <select id="game-library-scope" value={scope} onChange={(event) => { const nextScope = event.target.value as LibraryScope; setScope(nextScope); setSortMode(nextScope === "family" ? "name" : "playtime"); setVisibleCount(PAGE_SIZE); }}><option value="primary">My play history</option><option value="family">Family library</option></select>
        <label htmlFor="game-sort">Sort by</label>
        <select id="game-sort" value={sortMode} onChange={(event) => { setSortMode(event.target.value as SortMode); setVisibleCount(PAGE_SIZE); }}><option value="playtime">My playtime</option><option value="name">Name</option></select>
      </div>
      {filteredGames.length > 0 ? <>
        <div className="game-grid">
          {visibleGames.map((game) => <a className="game-card" href={`https://store.steampowered.com/app/${game.appid}/`} target="_blank" rel="noreferrer" key={game.appid}><GameCover game={game} /><div className="game-card-copy"><h3>{game.name}</h3><p>{scope === "family" ? "Family library" : formatPlaytime(game.playtimeMinutes)}</p><span className="game-card-external" aria-label="Opens Steam store">↗</span></div></a>)}
        </div>
        {visibleCount < filteredGames.length && <button type="button" className="load-more" onClick={() => setVisibleCount((value) => value + PAGE_SIZE)}>Load more <span aria-hidden="true">+24</span></button>}
      </> : query.trim() ? <div className="library-no-results"><p>No games match “{query.trim()}”.</p><button type="button" className="text-action" onClick={() => { setQuery(""); setVisibleCount(PAGE_SIZE); }}>Reset search <span aria-hidden="true">↗</span></button></div> : scope === "primary" ? <div className="library-no-results"><p>No recorded playtime on my account yet.</p><button type="button" className="text-action" onClick={() => { setScope("family"); setSortMode("name"); setVisibleCount(PAGE_SIZE); }}>Explore family library <span aria-hidden="true">↗</span></button></div> : <div className="library-no-results"><p>No games in this collection.</p></div>}
    </section>
  );
}

function LibraryEmpty({ isSynced }: { isSynced: boolean }) {
  return <section className="library-empty" aria-labelledby="library-empty-heading"><div className="empty-spines" aria-hidden="true"><i /><i /><i /><i /></div><div><span className="section-index">01 / PLAY HISTORY</span><h2 id="library-empty-heading">{isSynced ? "No played games yet." : "Play history, coming soon."}</h2><p>{isSynced ? "No games with recorded playtime are available yet." : "The library is being prepared."}</p></div></section>;
}

function OtherHeader({ section }: { section: OtherSection }) {
  return (
    <>
      <header className="other-header page-enter">
        <div><span className="section-index">OFF THE CLOCK</span><h1>Other</h1><p>Games, small tools, and side experiments.</p></div>
        <svg className="other-header-field" viewBox="0 0 520 250" aria-hidden="true" focusable="false"><path d="M0 196C74 98 148 100 224 178S380 264 520 68" /><path d="M0 218C74 120 148 122 224 200S380 286 520 90" /><path d="M0 240C74 142 148 144 224 222S380 308 520 112" /><path className="other-header-field-major" d="M0 174C74 76 148 78 224 156S380 242 520 46" /></svg>
      </header>
      <nav className="other-tabs" aria-label="Other sections">
        <InternalLink href="/other/games" aria-current={section === "games" ? "page" : undefined}><span>01</span><strong>Games I Played</strong><span aria-hidden="true">↗</span></InternalLink>
        <InternalLink href="/other/projects" aria-current={section === "projects" ? "page" : undefined}><span>02</span><strong>Other Projects</strong><span aria-hidden="true">↗</span></InternalLink>
      </nav>
    </>
  );
}

function ProjectsEmpty() {
  return <section className="side-projects-empty" aria-labelledby="side-projects-empty-heading"><span className="section-index">02 / WORKBENCH</span><h2 id="side-projects-empty-heading">On the workbench.</h2><p>Learning tools and Unity experiments. More to share soon.</p></section>;
}

export function OtherContent({ section }: { section: OtherSection }) {
  return <PortfolioShell page="other"><div className="other-page"><OtherHeader section={section} />{section === "games" ? <GamesLibrary /> : <section className="side-projects" aria-labelledby="side-projects-heading"><div className="side-projects-heading"><span className="section-index">02 / SIDE WORK</span><h2 id="side-projects-heading">Other Projects</h2><p>Small tools and experiments outside my main practice.</p></div><ProjectsEmpty /></section>}</div></PortfolioShell>;
}
