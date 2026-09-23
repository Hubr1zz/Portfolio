"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { assetPath, InternalLink } from "./portfolio-links";
import { MarginContours } from "./presentation-extras";
import { getBoardItems, projects, tabs, type BoardItem, type DiagramId, type PageId, type Project, type TabId } from "./portfolio-data";
import { useI18n } from "./i18n";

export type { PageId } from "./portfolio-data";
export type ShellPage = PageId | "other";

const originStorageKey = "portfolio-origin";
const resumeHref = assetPath("/resume/Ziang-Zhou-Resume.pdf");

function rememberProjectOrigin(event: MouseEvent<HTMLAnchorElement>, projectId: string) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    return;
  try {
    sessionStorage.setItem(originStorageKey, JSON.stringify({ path: window.location.pathname, scrollY: window.scrollY, projectCardId: "project-" + projectId }));
  } catch {
    return;
  }
}

function useRestoreOrigin() {
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(originStorageKey);
      if (!raw)
        return;
      const origin = JSON.parse(raw) as { path?: string; scrollY?: number; projectCardId?: string };
      if (typeof origin.path !== "string" || normalizePortfolioPath(origin.path) !== normalizePortfolioPath(window.location.pathname))
        return;
      if (!origin.projectCardId || window.location.hash !== "#" + origin.projectCardId) {
        sessionStorage.removeItem(originStorageKey);
        return;
      }
      sessionStorage.removeItem(originStorageKey);
      if (typeof origin.scrollY !== "number")
        return;
      window.scrollTo({ top: origin.scrollY, behavior: "auto" });
      window.requestAnimationFrame(() => {
        if (!origin.projectCardId)
          return;
        const card = document.getElementById(origin.projectCardId);
        if (!(card instanceof HTMLElement))
          return;
        card.focus({ preventScroll: true });
      });
    } catch {
      return;
    }
  }, []);
}

function normalizePortfolioPath(path: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const withoutBase = basePath && path.startsWith(basePath) ? path.slice(basePath.length) : path;
  return withoutBase.replace(/\/+$/g, "") || "/";
}

function isPortfolioPath(path: string) {
  const normalizedPath = normalizePortfolioPath(path);
  return normalizedPath === "/" || tabs.some((tab) => normalizePortfolioPath(tab.path) === normalizedPath);
}

function categoryMeta(category: TabId) {
  return tabs.find((tab) => tab.id === category) ?? tabs[0];
}

function categoryPath(category: TabId) {
  return categoryMeta(category).path;
}

function BackLink({ category, projectId, className, children }: { category: TabId; projectId: string; className?: string; children: ReactNode }) {
  const { t } = useI18n();
  const defaultHref = categoryPath(category) + "#project-" + projectId;
  const [href, setHref] = useState(defaultHref);
  const [originPath, setOriginPath] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(originStorageKey);
      if (!raw)
        return;
      const origin = JSON.parse(raw) as { path?: string; projectCardId?: string };
      if (!origin.path || !isPortfolioPath(origin.path) || origin.projectCardId !== "project-" + projectId)
        return;
      const normalizedOriginPath = normalizePortfolioPath(origin.path);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOriginPath(normalizedOriginPath);
      setHref(normalizedOriginPath + "#" + origin.projectCardId);
    } catch {
      return;
    }
  }, [projectId]);

  return <InternalLink className={className} href={href}>{originPath !== null && normalizePortfolioPath(originPath) === "/" ? <span className="case-navigation-card"><small>{t("case.returnSelected")}</small><strong>{t("case.backSelected")}</strong><i aria-hidden="true">↗</i></span> : children}</InternalLink>;
}

function ProjectVisual({ project }: { project: Project }) {
  const { localize } = useI18n();
  if (project.gallery) {
    return (
      <div className="media-grid">
        {project.gallery.map((image, index) => (
          <Image key={image.src} src={assetPath(image.src)} alt={image.alt} width={1200} height={720} sizes="(max-width: 760px) 100vw, 55vw" className={index === 0 ? "media-lead" : ""} unoptimized />
        ))}
      </div>
    );
  }

  if (project.image) {
    return (
      <figure className="project-image">
        <Image src={assetPath(project.image)} alt={project.imageAlt ?? ""} width={1200} height={720} sizes="(max-width: 760px) 100vw, 50vw" unoptimized />
        <figcaption><span>{localize("FIELD_CAPTURE")}</span><span>{project.index} / {project.year}</span></figcaption>
      </figure>
    );
  }

  if (project.visual === "workflow") {
    return (
      <div className="system-visual workflow-visual" aria-label={localize("Design to implementation workflow diagram")}>
        <span className="visual-label">{localize("SYSTEM_MAP / LIVE")}</span>
        <div className="system-node node-a">{localize("Design docs")}</div>
        <div className="system-node node-b">{localize("Draft change")}</div>
        <div className="system-node node-c">{localize("Review")}</div>
        <div className="system-node node-d">{localize("Implementation")}</div>
        <div className="system-core"><span>SPEC</span></div>
      </div>
    );
  }

  if (project.visual === "interaction") {
    return (
      <div className="system-visual interaction-visual" aria-label={localize("Unified interaction system diagram")}>
        <span className="visual-label">{localize("EVENT_ROUTING / 3D + UI")}</span>
        <div className="input-stream"><i /><i /><i /><i /><i /></div>
        <div className="interaction-core"><span>I</span><small>{localize("DISPATCH")}</small></div>
        <div className="output-tags"><span>{localize("FOCUS")}</span><span>{localize("CLICK")}</span><span>{localize("DRAG")}</span></div>
      </div>
    );
  }

  if (project.visual === "editor") {
    return (
      <div className="system-visual editor-visual" aria-label={localize("Abstract Unity editor window layout")}>
        <span className="visual-label">{localize("EDITOR_LAYER / MODULAR")}</span>
        <div className="fake-toolbar"><i /><i /><i /><i /></div>
        <div className="fake-tree"><span /><span /><span /><span /><span /></div>
        <div className="fake-panel"><b>{localize("INSPECT")}</b><i /><i /><i /></div>
      </div>
    );
  }

  if (project.visual === "prototype") {
    return (
      <div className="system-visual prototype-visual" aria-label={localize("Abstract movement trajectory diagram")}>
        <span className="visual-label">{localize("MOTION_TRACE / ITERATION")}</span>
        <div className="motion-line" />
        <div className="motion-point p1">A</div><div className="motion-point p2">B</div><div className="motion-point p3">C</div>
      </div>
    );
  }

  return <div className="system-visual quiet-visual"><span className="visual-label">{localize("ARCHIVE")} / {project.year}</span><strong>{project.index}</strong></div>;
}

function FlowDiagram({ id }: { id: DiagramId }) {
  const { localize } = useI18n();
  if (id === "workflow-overview") {
    return (
      <div className="flow-diagram flow-overview" aria-label={localize("zWorkFlow production workflow diagram")}>
        <span className="flow-kicker">{localize("WORKFLOW_OVERVIEW")}</span>
        <span className="flow-workbench">{localize("WORKBENCH")}</span>
        <div className="flow-overview-steps"><b>{localize("Design documents")}</b><b>{localize("Draft modules")}</b><b>{localize("Review & approve")}</b><b>{localize("Implement & verify")}</b><b>{localize("Sync & archive")}</b></div>
        <div className="flow-context-rail"><span>{localize("Project skills")}</span><span>OpenSpec</span><span>{localize("Code evidence")}</span></div>
      </div>
    );
  }

  if (id === "editor-overview") {
    return (
      <div className="flow-diagram editor-overview" aria-label={localize("zEditor workspace and scene tools overview")}>
        <span className="flow-kicker">{localize("EDITOR_TOOLKIT / OVERVIEW")}</span>
        <div className="editor-overview-columns"><section><small>{localize("ZEDITOR CONTRIBUTIONS")}</small><strong>{localize("Favorites interface")}</strong><span>{localize("Inspector component workflows")}</span></section><section><small>{localize("SCENE TOOLS")}</small><strong>{localize("Independent package")}</strong><span>{localize("Camera / Pivot / Saved expansion")}</span></section></div>
      </div>
    );
  }

  if (id === "editor-navigation") {
    return (
      <div className="flow-diagram editor-navigation" aria-label={localize("zEditor navigation schematic")}>
        <span className="flow-kicker">{localize("EDITOR_NAVIGATION")}</span>
        <div className="editor-nav-context"><b>{localize("Project overlay")}</b><b>{localize("Favorites window")}</b></div>
        <div className="editor-nav-panel"><span>{localize("SHARED FAVORITES PANEL")}</span><div><i>{localize("Page tabs")}</i><i>{localize("Grid / list")}</i><i>{localize("Navigation")}</i></div></div>
        <p>{localize("One interface · two contexts")}</p>
      </div>
    );
  }

  if (id === "editor-scene") {
    return (
      <div className="flow-diagram editor-scene" aria-label={localize("zEditor scene tools diagram")}>
        <span className="flow-kicker">{localize("SCENE_TOOLS / PERSISTENT_STATE")}</span>
        <div className="editor-scene-grid"><section><b>{localize("Camera follow & LookAt")}</b><small>{localize("SceneView follows and looks toward the target")}</small></section><section><b>{localize("Rotation root")}</b><small>{localize("Selected target becomes the pivot")}</small></section><section><b>{localize("Saved expansion")}</b><small>{localize("Scene · prefab · project folders")}</small></section></div>
      </div>
    );
  }

  if (id === "vault-map") {
    return (
      <div className="flow-diagram vault-map" aria-label={localize("Living design vault overview")}>
        <span className="flow-kicker">{localize("LIVING DESIGN VAULT")}</span>
        <div className="vault-map-groups"><section><small>01</small><b>{localize("Principles & world")}</b><span>{localize("Premise, rules, and setting")}</span></section><section><small>02</small><b>{localize("Hunt / Showdown / Settlement")}</b><span>{localize("Three phases, one consequence loop")}</span></section><section><small>03</small><b>{localize("Shared rules / Terms / References")}</b><span>{localize("Linked knowledge for revision")}</span></section></div>
      </div>
    );
  }

  if (id === "vault-loop") {
    return (
      <div className="flow-diagram vault-loop" aria-label={localize("Living design vault tactical loop")}>
        <span className="flow-kicker">{localize("TACTICAL_LOOP")}</span>
        <div className="vault-loop-steps"><section><b>{localize("Hunt")}</b><small>{localize("Information & risk")}</small></section><i>→</i><section><b>{localize("Showdown")}</b><small>{localize("Tactical commitment")}</small></section><i>→</i><section><b>{localize("Settlement")}</b><small>{localize("Lasting consequences")}</small></section><i>→</i><section><b>{localize("Preparation")}</b><small>{localize("Ready the next hunt")}</small></section></div>
      </div>
    );
  }

  if (id === "workflow-lifecycle") {
    return (
      <div className="flow-diagram flow-lifecycle" aria-label={localize("zWorkFlow change lifecycle diagram")}>
        <span className="flow-kicker">{localize("CHANGE_LIFECYCLE")}</span>
        <div className="flow-chain"><b>{localize("Design docs")}</b><i>→</i><b>{localize("Draft change")}</b><i>→</i><b>{localize("Review")}</b><i>→</i><b>{localize("Approve")}</b><i>→</i><b>{localize("Apply")}</b><i>→</i><b>{localize("Sync + archive")}</b></div>
        <p>{localize("Human approval remains the gate between design intent and implementation.")}</p>
      </div>
    );
  }

  if (id === "workflow-knowledge") {
    return (
      <div className="flow-diagram flow-network" aria-label={localize("zWorkFlow shared project knowledge diagram")}>
        <span className="flow-kicker">{localize("SHARED_PROJECT_CONTEXT")}</span>
        <div className="flow-inputs"><b>OpenSpec</b><b>{localize("Project skills")}</b><b>{localize("Code index")}</b></div>
        <i className="flow-line" />
        <div className="flow-hub"><span>{localize("ONE SOURCE")}</span><strong>{localize("WORKBENCH")}</strong></div>
        <i className="flow-line" />
        <div className="flow-outputs"><b>Codex</b><b>Claude</b><b>{localize("Cursor + tools")}</b></div>
      </div>
    );
  }

  if (id === "interaction-routing") {
    return (
      <div className="flow-diagram flow-routing" aria-label={localize("Interaction System unified event routing diagram")}>
        <span className="flow-kicker">{localize("UNIFIED_EVENT_ROUTING")}</span>
        <div className="route-sources"><b>{localize("Physics raycast")}<small>{localize("3D OBJECT")}</small></b><b>EventSystem<small>UGUI</small></b></div>
        <i>↓</i><div className="route-target">IInteractableTarget</div><i>↓</i><div className="route-dispatch">InteractionSystem / {localize("dispatch")}</div>
        <div className="route-results"><b>{localize("FOCUS")}</b><b>{localize("CLICK")}</b><b>{localize("DRAG")}</b></div>
      </div>
    );
  }

  return (
    <div className="flow-diagram flow-typed" aria-label={localize("Interaction System typed drag communication diagram")}>
      <span className="flow-kicker">{localize("TYPED_DRAG_COMMUNICATION")}</span>
      <div className="typed-node"><small>{localize("SOURCE")}</small><b>IDraggable&lt;T&gt;</b><span>{localize("Card")}</span></div>
      <i>→</i><div className="typed-cache"><small>{localize("CACHED MAP")}</small><strong>T</strong><span>{localize("cached method mappings")}</span></div>
      <i>→</i><div className="typed-node"><small>{localize("TARGET")}</small><b>IFocusable&lt;T&gt;</b><span>{localize("Slot")}</span></div>
      <p>{localize("ENTER · STAY · RELEASE · LEAVE")}</p>
    </div>
  );
}

function TacticsMap() {
  return <FlowDiagram id="vault-map" />;
}

function ArticleIndexCover({ articles }: { articles: NonNullable<Project["articles"]> }) {
  const { t } = useI18n();
  const draftCount = articles.filter((article) => article.status === "draft").length;
  const completedCount = articles.length - draftCount;
  return <div className="article-index-cover" aria-label={t("cover.essayLabel")}><div className="article-index-heading"><span>{t("cover.essay")}</span><strong>{t("cover.entries", { count: String(articles.length).padStart(2, "0") })}</strong></div><p>{t("cover.progress", { complete: completedCount, draft: draftCount })}</p><ol>{articles.map((article, index) => <li key={article.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{article.title}</strong>{article.status === "draft" && <small>{t("case.draft")}</small>}</li>)}</ol><footer>{t("cover.readCompare")}</footer></div>;
}

function DesignNotebookCover() {
  const { t } = useI18n();
  return <div className="design-notebook-cover" aria-label={t("cover.notebookLabel")}><div className="design-notebook-heading"><span>{t("cover.notebook")}</span><svg viewBox="0 0 72 48" aria-hidden="true" focusable="false"><rect x="8" y="8" width="44" height="32" /><path d="M16 16h28M16 24h20M16 32h28M52 16h12v16H52" /></svg></div><div className="design-notebook-rows"><div><b>{t("cover.observe")}</b><span>{t("cover.observeText")}</span></div><div><b>{t("cover.explain")}</b><span>{t("cover.explainText")}</span></div><div><b>{t("cover.reuse")}</b><span>{t("cover.reuseText")}</span></div></div><footer>{t("cover.evolving")}</footer></div>;
}

function ProjectCover({ project }: { project: Project }) {
  if (project.articles?.length)
    return <ArticleIndexCover articles={project.articles} />;
  if (project.id === "design-vault")
    return <DesignNotebookCover />;
  const coverDiagram = coverDiagramByProject[project.id];
  if (coverDiagram)
    return <FlowDiagram id={coverDiagram} />;
  const image = project.gallery?.[0];
  if (image)
    return <Image src={assetPath(image.src)} alt={image.alt} width={1200} height={720} sizes="(max-width: 760px) 100vw, 50vw" unoptimized />;
  if (project.image)
    return <Image src={assetPath(project.image)} alt={project.imageAlt ?? ""} width={1200} height={720} sizes="(max-width: 760px) 100vw, 50vw" unoptimized />;
  return <ProjectVisual project={project} />;
}

const coverDiagramByProject: Partial<Record<string, DiagramId>> = {
  zworkflow: "workflow-overview",
  interaction: "interaction-routing",
  "editor-tools": "editor-overview",
  "tactics-design": "vault-map",
};

function FeatureCard({ project, index }: { project: Project; index: string }) {
  const { t } = useI18n();
  const visual = project.id === "tactics-design" ? <TacticsMap /> : <ProjectCover project={project} />;
  return <InternalLink id={"project-" + project.id} className="featured-card" href={"/projects/" + project.id} onClick={(event) => rememberProjectOrigin(event, project.id)}><div className="feature-media">{visual}</div><div className="feature-copy reading-surface"><div className="feature-title-row"><span className="feature-number">{index}</span><h3>{project.title}</h3></div><div className="feature-meta"><span>{project.year}</span></div><p className="feature-description">{project.description}</p><span className="feature-link details-action"><span>{t("common.viewDetails")}</span><span aria-hidden="true">↗</span></span></div></InternalLink>;
}

function ArchiveDecoration({ page }: { page: TabId }) {
  if (page === "technical")
    return <svg className="archive-decoration archive-decoration-technical" viewBox="0 0 420 260" aria-hidden="true" focusable="false"><path pathLength="1" d="M16 224V154h92V82h98V34h190" /><path pathLength="1" d="M108 154h72v54h102V112h114" /><path pathLength="1" d="M206 82v76h94" /><circle cx="16" cy="224" r="4" /><circle cx="108" cy="154" r="4" /><circle cx="206" cy="82" r="4" /><circle cx="306" cy="112" r="4" /><circle cx="396" cy="34" r="4" /></svg>;
  if (page === "design")
    return <svg className="archive-decoration archive-decoration-design" viewBox="0 0 420 260" aria-hidden="true" focusable="false"><path pathLength="1" d="M94 34h172l46 46v148H94z" /><path pathLength="1" d="M266 34v46h46" /><path pathLength="1" d="M58 70h172l46 46v110H58z" /><path pathLength="1" d="M230 70v46h46" /><path pathLength="1" d="M34 40v18m-9-9h18M374 190v18m-9-9h18M342 46v14m-7-7h14" /></svg>;
  return <svg className="archive-decoration archive-decoration-games" viewBox="0 0 420 260" aria-hidden="true" focusable="false"><path pathLength="1" d="M12 214C84 72 146 52 206 122s88 102 202-80" /><path pathLength="1" d="M12 246C84 104 146 84 206 154s88 102 202-80" /><circle cx="12" cy="214" r="4" /><circle cx="206" cy="122" r="4" /><circle cx="408" cy="42" r="4" /><circle cx="146" cy="84" r="3" /></svg>;
}

function Navigation({ page }: { page: ShellPage }) {
  const { locale, t, toggleLocale } = useI18n();
  const navTabs = [tabs.find((tab) => tab.id === "technical"), tabs.find((tab) => tab.id === "design"), tabs.find((tab) => tab.id === "games")].filter((tab): tab is (typeof tabs)[number] => Boolean(tab));
  return <header className="site-header"><InternalLink className="brand" href="/" aria-label={t("nav.homeLabel")}><span className="brand-label">LEON ZHOU</span><small>PORTFOLIO / 2026</small></InternalLink><div className="header-actions"><nav className="header-links" aria-label={t("nav.primaryLabel")}><InternalLink href="/" aria-current={page === "home" ? "page" : undefined}><span className="hover-shift-label">{t("nav.home")}</span></InternalLink>{navTabs.map((tab) => <InternalLink key={tab.id} href={tab.path} aria-current={page === tab.id ? "page" : undefined}><span className="hover-shift-label">{tab.id === "technical" ? t("nav.technical") : tab.id === "games" ? t("nav.games") : t("nav.design")}</span></InternalLink>)}<InternalLink href="/other" aria-current={page === "other" ? "page" : undefined}><span className="hover-shift-label">{t("nav.other")}</span></InternalLink></nav><button className="language-toggle" type="button" onClick={toggleLocale} aria-label={locale === "en" ? t("language.switchToChinese") : t("language.switchToEnglish")} title={locale === "en" ? t("language.switchToChinese") : t("language.switchToEnglish")}><span className={locale === "en" ? "is-active" : ""}>{t("language.short.en")}</span><i aria-hidden="true">/</i><span className={locale === "zh" ? "is-active" : ""}>{t("language.short.zh")}</span></button></div></header>;
}

function Footer() {
  const { t } = useI18n();
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const copyTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("leonzhouziang@gmail.com");
      setCopyStatus("copied");
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopyStatus("idle"), 1800);
    } catch {
      setCopyStatus("failed");
    }
  }

  const copyLabel = copyStatus === "copied" ? t("footer.copied") : copyStatus === "failed" ? t("footer.copyFailed") : t("footer.copy");
  return <footer className="site-footer"><div><span className="footer-kicker">{t("footer.kicker")}</span><h2>{t("footer.titleLine1")}<br />{t("footer.titleLine2")}</h2></div><div className="footer-links"><button className="footer-copy" type="button" onClick={copyEmail}><span className="hover-shift-label"><span>leonzhouziang@gmail.com</span><small aria-live="polite">{copyLabel}</small></span></button><a href="https://github.com/Hubr1zz" target="_blank" rel="noreferrer"><span className="hover-shift-label"><span>GitHub</span><span aria-hidden="true">↗</span></span></a><a href="https://leon-zhou.itch.io/" target="_blank" rel="noreferrer"><span className="hover-shift-label"><span>Itch.io</span><span aria-hidden="true">↗</span></span></a><a href={resumeHref} target="_blank" rel="noreferrer"><span className="hover-shift-label"><span>{t("footer.resume")}</span><span aria-hidden="true">↗</span></span></a></div><div className="footer-base"><span>LEON ZHOU / PORTFOLIO</span><span>{t("footer.signature")}</span></div></footer>;
}

export function PortfolioShell({ page, children }: { page: ShellPage; children: ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const mainContentRef = useRef<HTMLDivElement>(null);
  useRestoreOrigin();
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;
      const root = mainContentRef.current;
      if (!root)
        return;
      root.getAnimations({ subtree: true }).forEach((animation) => {
        animation.cancel();
        animation.play();
      });
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);
  return <main className={"site-shell page-" + page + " theme-amber"}><a className="skip-link" href="#main-content">{t("nav.skip")}</a><MarginContours /><Navigation page={page} /><div id="main-content" key={pathname} ref={mainContentRef}>{children}</div><Footer /></main>;
}

function HomePage() {
  const { localize, t } = useI18n();
  const localizedProjects = useMemo(() => localize(projects), [localize]);
  const localizedTabs = useMemo(() => localize(tabs), [localize]);
  const zworkflow = localizedProjects.technical[0];
  const tactics = localizedProjects.design[0];

  return (
    <>
      <section className="home-intro" id="top">
        <div className="intro-kicker reading-surface">
          <span>{t("home.role")}</span>
          <span>{t("home.location")}</span>
        </div>
        <h1 className="intro-title reading-surface">
          <span>{t("home.title1")}</span>
          <span>{t("home.title2")}</span>
        </h1>
        <div className="intro-bottom">
          <p className="intro-summary reading-surface">{t("home.summary")}</p>
          <div className="intro-actions reading-surface">
            <svg className="intro-registration" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path pathLength="1" d="M4 4H20V20" /></svg>
            <a className="resume-action" href={resumeHref} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 3.5h8l4 4V20.5H6z" /><path d="M14 3.5v4h4M9 12h6M9 15.5h6" /></svg><span>{t("footer.resume")}</span><small>PDF</small></a>
            <a className="explore-action" href="#work">{t("home.explore")}</a>
          </div>
        </div>
      </section>
      <section className="profile-section">
        <div className="profile-title-group reading-surface">
          <div className="section-heading">
            <div>
              <h2>{t("home.about")}</h2>
              <p className="profile-name"><span>Leon</span>{" "}<span>Zhou</span></p>
              <p className="profile-lead">{t("home.lead")}</p>
            </div>
          </div>
        </div>
        <div className="profile-copy reading-surface">
          <p>{t("home.bio1")}</p>
          <p>{t("home.bio2")}</p>
          <p>{t("home.bio3")}</p>
          <p className="profile-goal">{t("home.goal")}</p>
        </div>
      </section>
      <section className="featured-section page-enter" id="work">
        <div className="section-heading reading-surface">
          <div className="selected-heading"><h2>{t("home.selected")}</h2></div>
          <p>{t("home.selectedDescription")}</p>
        </div>
        <div className="featured-grid">
          <FeatureCard project={zworkflow} index="01" />
          <FeatureCard project={tactics} index="02" />
          <article className="featured-card is-pending" aria-label={t("home.pendingLabel")}>
            <div className="feature-media pending-art" aria-hidden="true"><i /><i /><i /></div>
            <div className="feature-copy reading-surface"><div className="feature-title-row"><span className="feature-number">03</span><h3>ActionQueue</h3></div><div className="feature-meta"><span>{t("home.inPreparation")}</span></div><p className="feature-description">{t("home.comingSoon")}</p><span className="feature-link">{t("home.inPreparation")}</span></div>
          </article>
        </div>
      </section>
      <nav className="discipline-nav" aria-label={t("home.exploreDisciplines")}>
        {localizedTabs.map((tab, index) => (
          <InternalLink key={tab.id} className="discipline-link" href={tab.path}>
            <span className="index">{String(index + 1).padStart(2, "0")}</span>
            <h3>{tab.label}</h3>
            <p>{tab.description}</p>
            <span className="arrow" aria-hidden="true">↗</span>
          </InternalLink>
        ))}
      </nav>
    </>
  );
}

function ProjectPreview({ project }: { project: Project }) {
  const { t } = useI18n();
  return (
    <article id={"project-" + project.id} className="project-preview" tabIndex={-1}>
      <InternalLink className="project-preview-link" href={"/projects/" + project.id} onClick={(event) => rememberProjectOrigin(event, project.id)}>
        <div className="preview-media"><ProjectCover project={project} /></div>
        <div className="preview-copy reading-surface">
          <div className="preview-meta">
            <span>{project.index}</span>
            <span>{project.year}</span>
          </div>
          <h2>{project.title}</h2>
          <p className="preview-description">{project.description}</p>
          <ul className="tag-list" aria-label={project.title + " " + t("case.technologies")}>
            {project.tags.slice(0, 3).map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <span className="preview-link details-action"><span>{t("common.viewDetails")}</span><span aria-hidden="true">↗</span></span>
        </div>
      </InternalLink>
    </article>
  );
}

function RenderingGallery({ project, standalone = false }: { project?: Project; standalone?: boolean }) {
  const { localize, t } = useI18n();
  const items = useMemo(() => project ? localize(getBoardItems(project)) : [], [localize, project]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeIndex = Math.min(selectedIndex, Math.max(0, items.length - 1));
  const selected = items[activeIndex] ?? items[0];

  if (!project || !selected)
    return null;

  const selectPrevious = () => setSelectedIndex((current) => Math.max(0, current - 1));
  const selectNext = () => setSelectedIndex((current) => Math.min(items.length - 1, current + 1));

  return (
    <section id="project-rendering-studies" className={"rendering-gallery" + (standalone ? " rendering-gallery-standalone" : "")} tabIndex={-1} aria-labelledby="rendering-gallery-heading">
      <div className="archive-group-heading">
        <span>{standalone ? "01" : "03"}</span>
        <div className="reading-surface">
          <h2 id="rendering-gallery-heading">{t("gallery.title")}</h2>
          <p>{t("gallery.description")}</p>
        </div>
      </div>
      <div className="rendering-gallery-controls">
        <button type="button" onClick={selectPrevious} disabled={activeIndex === 0} aria-label={t("gallery.previousLabel")}>{t("gallery.previous")}</button>
        <button type="button" onClick={selectNext} disabled={activeIndex === items.length - 1} aria-label={t("gallery.nextLabel")}>{t("gallery.next")}</button>
      </div>
      <div className="rendering-gallery-strip" aria-label={t("gallery.title")}>
        {items.map((item, index) => <button key={item.id} type="button" aria-pressed={activeIndex === index} onClick={() => setSelectedIndex(index)}>
          {item.image && <Image src={assetPath(item.image)} alt="" width={240} height={150} sizes="120px" unoptimized />}
          <span className="reading-surface">{item.title}</span>
        </button>)}
      </div>
      <div className="rendering-gallery-stage">
        <div className="rendering-stage-media">
          {selected.image ? <Image src={assetPath(selected.image)} alt={selected.imageAlt ?? selected.title} width={1600} height={1000} sizes="(max-width: 760px) 100vw, 62vw" unoptimized /> : <ProjectVisual project={project} />}
        </div>
        <div className="rendering-stage-copy reading-surface">
          <span>{String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          <h3 aria-live="polite">{selected.title}</h3>
          <p>{selected.description}</p>
          {selected.details && <p>{selected.details}</p>}
        </div>
      </div>
      {!standalone && <InternalLink className="rendering-gallery-link" href="/projects/rendering-studies" onClick={(event) => rememberProjectOrigin(event, "rendering-studies")}>{t("gallery.full")}</InternalLink>}
    </section>
  );
}

function archiveGroupCopy(page: TabId, t: ReturnType<typeof useI18n>["t"]) {
  if (page === "design")
    return { title: t("archive.designTitle"), description: t("archive.designDescription") };
  return { title: t("archive.gamesTitle"), description: t("archive.gamesDescription") };
}

function ArchivePage({ page }: { page: TabId }) {
  const { localize, t } = useI18n();
  const localizedProjects = useMemo(() => localize(projects), [localize]);
  const meta = localize(categoryMeta(page));
  const groupCopy = archiveGroupCopy(page, t);
  const categoryProjects = localizedProjects[page];
  const releasedProjects = localizedProjects.technical.filter((project) => project.tier === "release");
  const studyProjects = localizedProjects.technical.filter((project) => project.tier === "study" && project.id !== "rendering-studies");

  return (
    <>
      <header className="archive-header">
        <span className="section-index reading-surface"><span className="type-reveal">{t("archive.kicker")}</span></span>
        <h1 className="reading-surface"><span className="type-reveal">{meta.label}</span></h1>
        <p className="reading-surface">{meta.description}</p>
        <ArchiveDecoration page={page} />
      </header>
      <section className="archive-body page-enter">
        {page === "technical" ? (
          <>
            <section className="archive-group" aria-labelledby="published-heading">
              <div className="archive-group-heading">
                <span>01</span>
                <div className="reading-surface">
                  <h2 id="published-heading">{t("archive.published")}</h2>
                  <p>{t("archive.publishedDescription")}</p>
                </div>
              </div>
              <div className="project-grid">
                {releasedProjects.map((project) => <ProjectPreview key={project.id} project={project} />)}
              </div>
              <a className="roadmap-slot focus-frame" href="https://github.com/Hubr1zz/ZFramework" target="_blank" rel="noreferrer">
                <span>{t("archive.nextRelease")}</span>
                <strong>ZFramework</strong>
                <small>{t("archive.inDevelopment")}</small>
              </a>
            </section>
            <section className="archive-group" aria-labelledby="studies-heading">
              <div className="archive-group-heading">
                <span>02</span>
                <div className="reading-surface">
                  <h2 id="studies-heading">{t("archive.studies")}</h2>
                  <p>{t("archive.studiesDescription")}</p>
                </div>
              </div>
              <div className="project-grid">
                {studyProjects.map((project) => <ProjectPreview key={project.id} project={project} />)}
              </div>
            </section>
            <RenderingGallery project={localizedProjects.technical.find((project) => project.id === "rendering-studies")} />
          </>
        ) : (
          <section className="archive-group" aria-labelledby="archive-projects-heading">
            <div className="archive-group-heading">
              <span>01</span>
              <div className="reading-surface">
                <h2 id="archive-projects-heading">{groupCopy.title}</h2>
                <p>{groupCopy.description}</p>
              </div>
            </div>
            <div className="project-grid">
              {categoryProjects.map((project) => <ProjectPreview key={project.id} project={project} />)}
            </div>
          </section>
        )}
      </section>
    </>
  );
}

function CaseMedia({ item, project, onExpand }: { item: BoardItem; project: Project; onExpand: (event: MouseEvent<HTMLButtonElement>, item: BoardItem) => void }) {
  const { t } = useI18n();
  if (item.image)
    return <div className="case-media"><Image src={assetPath(item.image)} alt={item.imageAlt ?? item.title} width={1600} height={1000} sizes="(max-width: 900px) 100vw, 65vw" unoptimized /><button className="media-expand" type="button" onClick={(event) => onExpand(event, item)} aria-label={t("case.enlarge") + ": " + item.title}>{t("case.enlarge")} ↗</button></div>;
  if (item.diagram)
    return <div className="case-media"><FlowDiagram id={item.diagram} /></div>;
  if (item.visual)
    return <div className="case-media"><ProjectVisual project={project} /></div>;
  return null;
}

const relatedProjectIds: Partial<Record<string, string[]>> = { "tactics-design": ["hunting-in-darkness"], "hunting-in-darkness": ["tactics-design"], zworkflow: ["interaction"], interaction: ["zworkflow"] };

function relatedProjects(project: Project & { category: TabId }) {
  const preferred = relatedProjectIds[project.id] ?? [];
  const sameCategory = projects[project.category].filter((candidate) => candidate.id !== project.id).map((candidate) => candidate.id);
  const ids = [...preferred, ...sameCategory].filter((id, index, list) => list.indexOf(id) === index).slice(0, 2);
  return ids.map((id) => projects[project.category].find((candidate) => candidate.id === id) ?? Object.values(projects).flat().find((candidate) => candidate.id === id)).filter((candidate): candidate is Project => Boolean(candidate));
}

function ImageDialog({ item, onClose }: { item: BoardItem | null; onClose: () => void }) {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog)
      return;
    if (!item) {
      if (dialog.open)
        dialog.close();
      return;
    }
    if (!dialog.open)
      dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [item]);

  // Native cancel and Close button provide keyboard closing; backdrop dismissal is pointer-only.
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
  return <dialog className="image-dialog" ref={dialogRef} aria-labelledby="image-dialog-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>{item && <><div className="image-dialog-header"><h2 id="image-dialog-title">{item.title}</h2><button type="button" className="dialog-close" onClick={onClose}>{t("case.close")}</button></div><div className="image-dialog-media"><Image src={assetPath(item.image ?? "")} alt={item.imageAlt ?? item.title} width={2000} height={1400} sizes="90vw" unoptimized /></div><div className="image-dialog-caption"><span>{item.imageAlt ?? item.title}</span><a href={assetPath(item.image ?? "")} target="_blank" rel="noreferrer">{t("case.openOriginal")}</a></div></>}</dialog>;
}

function CaseCopyContent({ item }: { item: BoardItem }) {
  if (item.bullets?.length)
    return <ul className="case-bullets">{item.bullets.map((bullet) => <li key={bullet.title}><strong>{bullet.title}</strong><span>{bullet.text}</span></li>)}</ul>;
  if (item.details)
    return <p>{item.details}</p>;
  return null;
}

function ProjectDetailContent({ project, category }: { project: Project & { category: TabId }; category: TabId }) {
  const { localize, t } = useI18n();
  const hasCaseMedia = Boolean(project.gallery?.length || project.image || project.visual);
  const isRenderingStudies = project.id === "rendering-studies";
  const articles = useMemo(() => project.articles ?? [], [project.articles]);
  const isComparative = articles.length > 0;
  const hasBoardContent = hasCaseMedia || project.id === "tactics-design";
  const items = useMemo(() => hasBoardContent ? localize(getBoardItems(project)) : [], [hasBoardContent, localize, project]);
  const [activeSection, setActiveSection] = useState(items[0]?.id ?? articles[0]?.id ?? "overview");
  const [dialogItem, setDialogItem] = useState<BoardItem | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const meta = localize(categoryMeta(category));
  const tocEntries = useMemo(() => items.length ? items.map((item) => ({ id: item.id, title: item.title })) : articles.length ? articles.map((article) => ({ id: article.id, title: article.title })) : project.details ? [{ id: "overview", title: t("case.overview") }] : [], [articles, items, project.details, t]);

  useEffect(() => {
    if (isRenderingStudies || !tocEntries.length)
      return;
    const sections = tocEntries.map((entry) => document.getElementById(entry.id === "overview" ? "overview" : "chapter-" + entry.id)).filter((section): section is HTMLElement => section instanceof HTMLElement);
    let frame = 0;
    const updateActive = () => {
      frame = 0;
      const rootStyle = getComputedStyle(document.documentElement);
      const sectionStyle = sections[0] ? getComputedStyle(sections[0]) : null;
      const offset = (parseFloat(rootStyle.scrollPaddingTop) || 0) + (parseFloat(sectionStyle?.scrollMarginTop ?? "0") || 0) + 2;
      const current = sections.filter((section) => section.getBoundingClientRect().top <= offset).at(-1) ?? sections[0];
      if (current)
        setActiveSection(current.id.replace("chapter-", ""));
    };
    const scheduleUpdate = () => {
      if (frame)
        return;
      frame = window.requestAnimationFrame(updateActive);
    };
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    scheduleUpdate();
    return () => {
      if (frame)
        window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, [isRenderingStudies, tocEntries]);

  function openImage(event: MouseEvent<HTMLButtonElement>, item: BoardItem) {
    triggerRef.current = event.currentTarget;
    setDialogItem(item);
  }

  function closeImage() {
    setDialogItem(null);
  }

  useEffect(() => {
    if (dialogItem)
      return;
    const trigger = triggerRef.current;
    if (!trigger)
      return;
    window.requestAnimationFrame(() => trigger.focus());
  }, [dialogItem]);

  return (
    <>
      <header className="case-header">
        <nav className="case-breadcrumb reading-surface" aria-label={t("case.breadcrumb")}>
          <InternalLink href={meta.path}>{meta.label}</InternalLink>
          <span aria-hidden="true">/</span>
          <span>{project.title}</span>
        </nav>
        <div className="case-heading reading-surface">
          <span className="section-index">{meta.label.toUpperCase()} / {project.year}</span>
          <h1>{project.title}</h1>
          <p className="case-intro">{project.description}</p>
          <ul className="tag-list" aria-label={project.title + " " + t("case.technologies")}>
            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        </div>
        {project.attribution && <aside className="source-credit" aria-label={project.attribution.title}><div><span>{project.attribution.title}</span><p>{project.attribution.text}</p></div><div className="source-credit-links">{project.attribution.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div></aside>}
        {!isComparative && project.links.length > 0 && (
          <div className="project-links reading-surface">
            {project.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer"><span className="hover-shift-label"><span>{link.label}</span><span aria-hidden="true">↗</span></span></a>)}
          </div>
        )}
        {!isComparative && !isRenderingStudies && project.details && items.length > 0 && <p className="case-summary reading-surface">{project.details}</p>}
      </header>
      {!isRenderingStudies && tocEntries.length > 0 && (
        <details className="mobile-toc reading-surface">
          <summary>{t("case.onThisPage")}</summary>
          <nav className="toc-links" aria-label={t("case.sections")}>
            {tocEntries.map((entry, index) => (
              <a key={entry.id} className="toc-link" onClick={(event) => { setActiveSection(entry.id); const menu = event.currentTarget.closest("details"); if (menu instanceof HTMLDetailsElement) menu.open = false; }} aria-current={activeSection === entry.id ? "location" : undefined} href={entry.id === "overview" ? "#overview" : "#chapter-" + entry.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {entry.title}
              </a>
            ))}
          </nav>
        </details>
      )}
      {isRenderingStudies ? <RenderingGallery project={project} standalone /> : !tocEntries.length ? null : (
        <div className="case-layout">
          <div className="case-content">
            {items.length ? items.map((item, index) => (
              <section tabIndex={-1} className={"case-section case-section-" + (item.layout ?? "prose")} id={"chapter-" + item.id} key={item.id}>
                <header className="case-section-heading reading-surface">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h2>{item.title}</h2>
                </header>
                <CaseMedia item={item} project={project} onExpand={openImage} />
                <div className="case-copy reading-surface">
                  <p>{item.description}</p>
                  <CaseCopyContent item={item} />
                  {item.href && <a className="case-source-link" href={item.href} target="_blank" rel="noreferrer">{item.linkLabel ?? t("common.viewSource")} ↗</a>}
                  {item.sources?.length ? <div className="case-sources">{item.sources.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div> : null}
                </div>
              </section>
            )) : articles.length ? articles.map((article, index) => (
              <section tabIndex={-1} className="case-section article-case-section" id={"chapter-" + article.id} key={article.id}>
                <div className="article-card">
                  <header className="case-section-heading reading-surface">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h2>{article.title}</h2>
                  </header>
                  <div className="article-card-copy"><p>{article.summary}</p><div className="article-card-meta"><span>{article.language}</span>{article.status === "draft" && <small className="article-status">{t("case.draft")}</small>}</div><a href={article.href} target="_blank" rel="noreferrer">{article.status === "draft" ? t("case.openDraft") : t("case.readArticle")} ↗</a></div>
                </div>
              </section>
            )) : project.details ? (
              <section tabIndex={-1} className="case-section" id="overview">
                <header className="case-section-heading reading-surface">
                  <span>01</span>
                  <h2>{t("case.overview")}</h2>
                </header>
                <div className="case-copy reading-surface"><p>{project.details}</p></div>
              </section>
            ) : null}
          </div>
          <aside className="case-toc reading-surface">
            <p>{t("case.inProject")}</p>
            <nav className="toc-links" aria-label={t("case.sections")}>
              {tocEntries.map((entry, index) => (
                <a key={entry.id} className="toc-link" onClick={() => setActiveSection(entry.id)} aria-current={activeSection === entry.id ? "location" : undefined} href={entry.id === "overview" ? "#overview" : "#chapter-" + entry.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {entry.title}
                </a>
              ))}
            </nav>
          </aside>
        </div>
      )}
      {hasCaseMedia && !isRenderingStudies && !isComparative && <ImageDialog item={dialogItem} onClose={closeImage} />}
      <nav className="case-navigation" aria-label={t("case.navigation")}>
        <div className="case-navigation-heading"><span>{t("case.continue")}</span><span>{meta.label.toUpperCase()}</span></div>
        <div className="case-navigation-links">
          <BackLink category={category} projectId={project.id}><span className="case-navigation-card"><small>{t("case.returnArchive")}</small><strong>{t("case.backTo", { category: meta.label })}</strong><i aria-hidden="true">↗</i></span></BackLink>
          {relatedProjects(project).map((candidate) => localize(candidate)).map((candidate) => <InternalLink key={candidate.id} href={"/projects/" + candidate.id} onClick={(event) => rememberProjectOrigin(event, candidate.id)}><span className="case-navigation-card"><small>{t("case.nextProject")}</small><strong>{candidate.title}</strong><i aria-hidden="true">↗</i></span></InternalLink>)}
        </div>
      </nav>
    </>
  );
}

export function ProjectDetail({ project, category }: { project: Project & { category: TabId }; category: TabId }) {
  const { localize } = useI18n();
  const localizedProject = useMemo(() => localize(project), [localize, project]);
  return <PortfolioShell page={category}><ProjectDetailContent project={localizedProject} category={category} /></PortfolioShell>;
}

export function Portfolio({ page = "home" }: { page?: PageId }) {
  return <PortfolioShell page={page}>{page === "home" ? <HomePage /> : <ArchivePage page={page} />}</PortfolioShell>;
}
