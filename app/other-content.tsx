"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { PortfolioShell } from "./portfolio";
import { assetPath, InternalLink } from "./portfolio-links";
import { useI18n } from "./i18n";

type OtherSection = "games" | "projects";
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
  source?: "steam-api" | "screenshots";
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
    source: data.source === "screenshots" ? "screenshots" : "steam-api",
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : null,
    profileUrl: typeof data.profileUrl === "string" ? data.profileUrl : null,
    profiles: Array.isArray(data.profiles) ? data.profiles.filter((profile): profile is SteamLibrary["profiles"][number] => Boolean(profile) && typeof profile === "object" && /^\d{17}$/.test(profile.steamId) && (profile.role === "primary" || profile.role === "family") && typeof profile.url === "string") : [],
    games,
  };
}

function formatPlaytime(minutes: number, t: ReturnType<typeof useI18n>["t"]) {
  if (!Number.isFinite(minutes) || minutes <= 0)
    return t("library.noRecordedTime");
  const hours = Math.floor(minutes / 60);
  if (hours < 1)
    return t("library.minutes", { count: minutes });
  return t(hours === 1 ? "library.hours" : "library.hoursPlural", { count: hours.toLocaleString() });
}

function formatUpdatedAt(value: string | null, locale: "en" | "zh") {
  if (!value)
    return null;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf()))
    return null;
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", { year: "numeric", month: "short", day: "numeric" }).format(date);
}

function GameCover({ game }: { game: SteamGame }) {
  const { t } = useI18n();
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(game.coverUrl) && !failed;

  return (
    <div className="game-cover">
      {showImage ? <img src={game.coverUrl ?? undefined} alt={t("library.cover", { name: game.name })} loading="lazy" decoding="async" onError={() => setFailed(true)} /> : <span className="game-cover-fallback"><span>{game.name}</span></span>}
    </div>
  );
}

function GamesLibrary() {
  const { locale, t } = useI18n();
  const [library, setLibrary] = useState<SteamLibrary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [query, setQuery] = useState("");
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
          setError("load-error");
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
    const scopedGames = library.source === "screenshots" ? library.games : scope === "primary" ? library.games.filter((game) => game.playtimeMinutes > 0) : library.games.filter((game) => game.playtimeMinutes > 0 || game.origin === "family" || game.origin === "both");
    return scopedGames.filter((game) => !normalizedQuery || game.name.toLocaleLowerCase().includes(normalizedQuery));
  }, [library, query, scope]);

  function retryLoad() {
    setError(null);
    setLibrary(null);
    setRetryKey((value) => value + 1);
  }

  if (error) {
    return <section className="library-state library-error" role="alert"><span className="section-index">{t("library.unavailable")}</span><h2>{t("library.loadFailed")}</h2><p>{t("library.loadError")}</p><button type="button" className="text-action" onClick={retryLoad}>{t("library.retry")} <span aria-hidden="true">↗</span></button></section>;
  }

  if (!library)
    return <section className="library-state" aria-live="polite"><span className="section-index">{t("library.loading")}</span><p>{t("library.loadingText")}</p></section>;
  if (library.games.length === 0)
    return <LibraryEmpty isSynced={Boolean(library.updatedAt)} />;

  const updatedAt = formatUpdatedAt(library.updatedAt, locale);
  const visibleGames = filteredGames.slice(0, visibleCount);

  return (
    <section className="games-library" aria-labelledby="games-library-heading">
      <div className="library-heading">
        <div><div className="numbered-heading"><span className="section-index">01</span><h2 id="games-library-heading">{t("other.games")}</h2></div><p>{library.source === "screenshots" ? t("library.snapshotDescription") : t("library.description")}</p></div>
        <div className="library-meta"><span>{library.source === "screenshots" ? t("library.snapshot") : t("library.gamesCount", { count: filteredGames.length })}</span>{updatedAt && <span>{t("library.updated", { date: updatedAt })}</span>}</div>
      </div>
      <div className="library-controls" aria-label={t("library.controls")}>
        <label htmlFor="game-search">{t("library.search")}</label>
        <input id="game-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(PAGE_SIZE); }} placeholder={t("library.searchPlaceholder")} />
        {library.source !== "screenshots" && <><label htmlFor="game-library-scope">{t("library.scope")}</label><select id="game-library-scope" value={scope} onChange={(event) => { setScope(event.target.value as LibraryScope); setVisibleCount(PAGE_SIZE); }}><option value="primary">{t("library.mine")}</option><option value="family">{t("library.family")}</option></select></>}
      </div>
      {filteredGames.length > 0 ? <>
        <div className="game-grid">
          {visibleGames.map((game) => <a className="game-card" href={`https://store.steampowered.com/app/${game.appid}/`} target="_blank" rel="noreferrer" key={game.appid}><GameCover game={game} /><div className="game-card-copy"><h3>{game.name}</h3><p>{library.source === "screenshots" ? t("library.cardSnapshot") : scope === "family" ? t("library.family") : formatPlaytime(game.playtimeMinutes, t)}</p><span className="game-card-external" aria-label={t("library.opensStore")}>↗</span></div></a>)}
        </div>
        {visibleCount < filteredGames.length && <button type="button" className="load-more" onClick={() => setVisibleCount((value) => value + PAGE_SIZE)}>{t("library.loadMore")} <span aria-hidden="true">+24</span></button>}
      </> : query.trim() ? <div className="library-no-results"><p>{t("library.noMatch", { query: query.trim() })}</p><button type="button" className="text-action" onClick={() => { setQuery(""); setVisibleCount(PAGE_SIZE); }}>{t("library.reset")} <span aria-hidden="true">↗</span></button></div> : scope === "primary" ? <div className="library-no-results"><p>{t("library.noPlaytime")}</p><button type="button" className="text-action" onClick={() => { setScope("family"); setVisibleCount(PAGE_SIZE); }}>{t("library.exploreFamily")} <span aria-hidden="true">↗</span></button></div> : <div className="library-no-results"><p>{t("library.noGames")}</p></div>}
    </section>
  );
}

function LibraryEmpty({ isSynced }: { isSynced: boolean }) {
  const { t } = useI18n();
  return <section className="library-empty" aria-labelledby="library-empty-heading"><div className="empty-spines" aria-hidden="true"><i /><i /><i /><i /></div><div><div className="numbered-heading"><span className="section-index">01</span><h2 id="library-empty-heading">{isSynced ? t("library.noPlayed") : t("library.comingSoon")}</h2></div><p>{isSynced ? t("library.noPlayedDescription") : t("library.preparing")}</p></div></section>;
}

function OtherHeader({ section }: { section: OtherSection }) {
  const { t } = useI18n();
  return (
    <>
      <header className="other-header">
        <div><span className="section-index"><span className="type-reveal">{t("other.kicker")}</span></span><h1><span className="type-reveal">{t("other.title")}</span></h1><p>{t("other.description")}</p></div>
        <svg className="other-header-field" viewBox="0 0 520 250" aria-hidden="true" focusable="false"><path d="M0 196C74 98 148 100 224 178S380 264 520 68" /><path d="M0 218C74 120 148 122 224 200S380 286 520 90" /><path d="M0 240C74 142 148 144 224 222S380 308 520 112" /><path className="other-header-field-major" d="M0 174C74 76 148 78 224 156S380 242 520 46" /></svg>
      </header>
      <nav className="other-tabs" aria-label={t("other.sections")}>
        <InternalLink href="/other/games" aria-current={section === "games" ? "page" : undefined}><span>01</span><strong>{t("other.games")}</strong><span aria-hidden="true">↗</span></InternalLink>
        <InternalLink href="/other/projects" aria-current={section === "projects" ? "page" : undefined}><span>02</span><strong>{t("other.projects")}</strong><span aria-hidden="true">↗</span></InternalLink>
      </nav>
    </>
  );
}

function ProjectsEmpty() {
  const { t } = useI18n();
  return <section className="side-projects-empty" aria-labelledby="side-projects-empty-heading"><div className="numbered-heading"><span className="section-index">02</span><h2 id="side-projects-empty-heading">{t("other.workbench")}</h2></div><p>{t("other.workbenchDescription")}</p></section>;
}

export function OtherContent({ section }: { section: OtherSection }) {
  const { t } = useI18n();
  return <PortfolioShell page="other"><div className="other-page"><OtherHeader section={section} />{section === "games" ? <GamesLibrary /> : <section className="side-projects" aria-labelledby="side-projects-heading"><div className="side-projects-heading"><div className="numbered-heading"><span className="section-index">02</span><h2 id="side-projects-heading">{t("other.projects")}</h2></div><p>{t("other.projectsDescription")}</p></div><ProjectsEmpty /></section>}</div></PortfolioShell>;
}
