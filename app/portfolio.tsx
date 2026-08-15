"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type RefObject } from "react";
import Image from "next/image";
import Link from "next/link";

type TabId = "technical" | "games" | "design";
export type PageId = "home" | TabId;
type ProjectLink = { label: string; href: string };
type Project = {
  id: string;
  index: string;
  title: string;
  eyebrow: string;
  year: string;
  description: string;
  details?: string;
  tags: string[];
  links: ProjectLink[];
  image?: string;
  imageAlt?: string;
  gallery?: { src: string; alt: string }[];
  visual?: "workflow" | "interaction" | "editor" | "prototype";
  featured?: boolean;
  tier?: "release" | "study";
};

const tabs: { id: TabId; label: string; count: string; description: string; path: string }[] = [
  {
    id: "technical",
    label: "Technical Projects",
    count: "05",
    description: "Production tools, gameplay architecture, procedural motion, and real-time rendering studies.",
    path: "/technical",
  },
  {
    id: "games",
    label: "Game Works",
    count: "04",
    description: "Playable prototypes and small games where design decisions were validated through implementation.",
    path: "/games",
  },
  {
    id: "design",
    label: "Design Experience",
    count: "03",
    description: "System design documents, comparative analysis, and an evolving library of design breakdowns.",
    path: "/design",
  },
];

const projects: Record<TabId, Project[]> = {
  technical: [
    {
      id: "zworkflow",
      index: "01",
      title: "zWorkFlow",
      eyebrow: "AI-assisted game production",
      year: "2026",
      description:
        "A shared workflow that turns game design documents into reviewable specifications, implementation plans, and traceable technical decisions.",
      details:
        "The system coordinates multiple AI coding tools around one source of truth, keeps design intent separate from implementation, and exposes dependency graphs, blockers, and change history through a Unity-based workbench.",
      tags: ["Python", "Unity", "OpenSpec", "Tooling", "Bilingual"],
      links: [{ label: "GitHub repository", href: "https://github.com/Hubr1zz/zWorkFlow" }],
      visual: "workflow",
      featured: true,
      tier: "release",
    },
    {
      id: "interaction",
      index: "02",
      title: "Interaction System",
      eyebrow: "Reusable Unity architecture",
      year: "2026",
      description:
        "A unified interaction layer for 3D objects and UI. Focus, click, and drag behaviors use one dispatch model while remaining composable.",
      details:
        "The architecture separates interaction logic from MonoBehaviours, supports typed drag targets, and caches generic dispatch mappings so runtime interaction avoids reflection overhead.",
      tags: ["Unity", "C#", "UGUI", "Architecture"],
      links: [{ label: "GitHub repository", href: "https://github.com/Hubr1zz/InteractionSystem" }],
      visual: "interaction",
      tier: "release",
    },
    {
      id: "editor-tools",
      index: "03",
      title: "Unity Editor Tools",
      eyebrow: "Editor workflow toolkit",
      year: "2026",
      description:
        "A collection of Unity editor extensions for faster project navigation, hierarchy work, inspection, favorites, and tab management.",
      details:
        "The toolkit explores how small, persistent interface improvements can reduce context switching during day-to-day Unity production.",
      tags: ["Unity Editor", "C#", "UX", "Productivity"],
      links: [{ label: "GitHub repository", href: "https://github.com/Hubr1zz/UnityEditorTools" }],
      visual: "editor",
      tier: "study",
    },
    {
      id: "procedural-motion",
      index: "04",
      title: "Procedural Locomotion",
      eyebrow: "Gameplay animation study",
      year: "2023",
      description:
        "A multi-legged locomotion prototype using sphere casts and raycasts to search for valid footholds around obstacles.",
      details:
        "Phase offsets keep the legs from moving together, while body position interpolates between average foot placement and a predicted movement target. If no valid foothold is available, movement stops instead of producing an unstable pose.",
      tags: ["Unity", "3D Math", "Physics", "Cinemachine"],
      links: [
        { label: "Technical case", href: "https://leonzhouziang.wixsite.com/leonzhou/technical-cases" },
        { label: "GitHub profile", href: "https://github.com/Hubr1zz" },
      ],
      image: "/images/tech-03.webp",
      imageAlt: "Unity editor showing a procedural multi-legged locomotion prototype",
      tier: "study",
    },
    {
      id: "rendering-studies",
      index: "05",
      title: "Stylized Rendering Studies",
      eyebrow: "Real-time graphics",
      year: "2023—24",
      description:
        "A series of shader studies spanning animated grass, wind-shaped sand, depth-based water edges, and world-space caustics.",
      details:
        "The grass combines authored geometry, baked normals, and vertex animation. The water reconstructs world position from the depth buffer to place caustics, while the sand study uses HLSL and particle-driven wind cues to pursue the visual rhythm of Journey.",
      tags: ["Shader Graph", "HLSL", "Blender", "Depth Buffer"],
      links: [
        { label: "Technical case", href: "https://leonzhouziang.wixsite.com/leonzhou/technical-cases" },
        { label: "GitHub profile", href: "https://github.com/Hubr1zz" },
      ],
      gallery: [
        { src: "/images/tech-05.webp", alt: "Stylized animated grass in Unity" },
        { src: "/images/tech-04.webp", alt: "Depth-based stylized water shader" },
        { src: "/images/tech-06.webp", alt: "Warm stylized desert rendering study" },
        { src: "/images/tech-01.webp", alt: "Grass geometry authored with Blender geometry nodes" },
      ],
      featured: true,
      tier: "study",
    },
  ],
  games: [
    {
      id: "punch-in-rush",
      index: "01",
      title: "Punch In Rush",
      eyebrow: "Movement prototype → parkour game",
      year: "2025",
      description:
        "Originally conceived as a high-mobility combat prototype, the project was deliberately rescaled into a focused parkour experience.",
      details:
        "The shift made the character controller the product rather than supporting infrastructure: responsiveness, momentum, and readable traversal became the primary design material.",
      tags: ["Unity", "Character Controller", "Parkour", "Iteration"],
      links: [
        { label: "Watch video", href: "https://www.youtube.com/watch?v=mOsh8QEO0Fo" },
        { label: "Read devlog", href: "https://leonzhouziang.notion.site/1c7ca7501690802cb125f737304092ee?v=1c7ca75016908036b2b5000c5f304776" },
      ],
      visual: "prototype",
      featured: true,
    },
    {
      id: "hunting-in-darkness",
      index: "02",
      title: "Hunting in Darkness",
      eyebrow: "One-week gameplay validation",
      year: "2025",
      description:
        "A compact prototype built in one week to test a small slice of a larger tactical game concept and collect actionable player feedback.",
      tags: ["Rapid Prototyping", "Combat Design", "Playtesting"],
      links: [{ label: "Play on Itch.io", href: "https://leon-zhou.itch.io/rpg-demo" }],
    },
    {
      id: "outlaws-dead-end",
      index: "03",
      title: "Outlaw’s Dead End",
      eyebrow: "GMTK Game Jam 2025",
      year: "2025",
      description:
        "A puzzle game built around a preset action loop. Players place jump pads and roadblocks to guide an outlaw through the sequence to safety.",
      details:
        "As team lead, programmer, and designer, I translated the theme “Loop” into both the character’s constraint and the player’s planning space.",
      tags: ["Team Lead", "Puzzle Design", "Unity", "Game Jam"],
      links: [
        { label: "Play on Itch.io", href: "https://leon-zhou.itch.io/outlaws-dead-end" },
        { label: "Watch video", href: "https://youtu.be/T-ioPNVUhss" },
      ],
      image: "/images/game-outlaws-deadend.webp",
      imageAlt: "Outlaw's Dead End game jam project cover",
    },
    {
      id: "top-hotpot",
      index: "04",
      title: "Top Hotpot",
      eyebrow: "Three-day experimental game",
      year: "2024",
      description:
        "A tactile timing-and-search game where ingredients disappear beneath the soup and continue moving, turning uncertainty into the central source of feedback and delight.",
      details:
        "I worked as designer, programmer, and art director. Hiding ingredients recreates the feeling of a real hotpot while their slow movement naturally explains why players must search carefully for the exact location.",
      tags: ["Experimental Design", "Solo Development", "Positive Feedback"],
      links: [{ label: "Itch.io profile", href: "https://leon-zhou.itch.io/" }],
    },
  ],
  design: [
    {
      id: "tactics-design",
      index: "01",
      title: "Tactical Game Design Document",
      eyebrow: "Personal system-design project",
      year: "2025—26",
      description:
        "An evolving tactics-game design inspired by the pressure, preparation, and consequence structures of Kingdom Death: Monster.",
      tags: ["Systems Design", "Combat Economy", "Progression", "Documentation"],
      links: [{ label: "Read on Notion", href: "https://www.notion.so/leonzhouziang/KDM-inspired-tactic-game-design-63affac2d3d843b5bad6e01835a1fba1?p=2a0ca75016908091a97ac2a359c6e375&pm=s" }],
      image: "/images/design-document.webp",
      imageAlt: "Diagram from Leon Zhou's tactical game design document",
      featured: true,
    },
    {
      id: "comparative-writing",
      index: "02",
      title: "Comparative Game Analysis",
      eyebrow: "Gameplay-oriented essays",
      year: "2025",
      description:
        "Short-form essays examining how games position themselves, screen players, and produce different strategic behaviors through small systemic changes.",
      details:
        "Current subjects include Elden Ring’s relationship to traditional Souls-like games and a comparison of League of Legends with Dota. Mandarin editions are currently available; English translations are in progress.",
      tags: ["Critical Analysis", "Player Segmentation", "Systems"],
      links: [
        { label: "Elden Ring essay", href: "https://docs.qq.com/doc/DWkdJTnVvUURTRHpU" },
        { label: "LoL / Dota essay", href: "https://docs.qq.com/doc/DWm5td0ZHUVBDem9v" },
      ],
    },
    {
      id: "design-vault",
      index: "03",
      title: "Design Breakdown Notes",
      eyebrow: "Ongoing design journal",
      year: "Ongoing",
      description:
        "A working library of good and bad design examples, broken down to preserve reusable lessons rather than isolated opinions.",
      tags: ["Design Research", "Breakdowns", "Knowledge Base"],
      links: [
        { label: "Notion notebook", href: "https://www.notion.so/leonzhouziang/Game-design-analysis-212ca7501690809586fbd4c37af7e12c?source=copy_link" },
        { label: "GitHub vault", href: "https://github.com/Hubr1zz/GameDesignVault" },
      ],
    },
  ],
};

function ProjectVisual({ project }: { project: Project }) {
  if (project.gallery) {
    return (
      <div className="media-grid">
        {project.gallery.map((image, index) => (
          <Image key={image.src} src={image.src} alt={image.alt} width={1200} height={720} sizes="(max-width: 760px) 100vw, 55vw" className={index === 0 ? "media-lead" : ""} unoptimized />
        ))}
      </div>
    );
  }

  if (project.image) {
    return (
      <figure className="project-image">
        <Image src={project.image} alt={project.imageAlt ?? ""} width={1200} height={720} sizes="(max-width: 760px) 100vw, 50vw" unoptimized />
        <figcaption><span>FIELD_CAPTURE</span><span>{project.index} / {project.year}</span></figcaption>
      </figure>
    );
  }

  if (project.visual === "workflow") {
    return (
      <div className="system-visual workflow-visual" aria-label="Design to implementation workflow diagram">
        <span className="visual-label">SYSTEM_MAP / LIVE</span>
        <div className="system-node node-a">Design docs</div>
        <div className="system-node node-b">Draft change</div>
        <div className="system-node node-c">Review</div>
        <div className="system-node node-d">Implementation</div>
        <div className="system-core"><span>SPEC</span></div>
      </div>
    );
  }

  if (project.visual === "interaction") {
    return (
      <div className="system-visual interaction-visual" aria-label="Unified interaction system diagram">
        <span className="visual-label">EVENT_ROUTING / 3D + UI</span>
        <div className="input-stream"><i /><i /><i /><i /><i /></div>
        <div className="interaction-core"><span>I</span><small>DISPATCH</small></div>
        <div className="output-tags"><span>FOCUS</span><span>CLICK</span><span>DRAG</span></div>
      </div>
    );
  }

  if (project.visual === "editor") {
    return (
      <div className="system-visual editor-visual" aria-label="Abstract Unity editor window layout">
        <span className="visual-label">EDITOR_LAYER / MODULAR</span>
        <div className="fake-toolbar"><i /><i /><i /><i /></div>
        <div className="fake-tree"><span /><span /><span /><span /><span /></div>
        <div className="fake-panel"><b>INSPECT</b><i /><i /><i /></div>
      </div>
    );
  }

  if (project.visual === "prototype") {
    return (
      <div className="system-visual prototype-visual" aria-label="Abstract movement trajectory diagram">
        <span className="visual-label">MOTION_TRACE / ITERATION</span>
        <div className="motion-line" />
        <div className="motion-point p1">A</div><div className="motion-point p2">B</div><div className="motion-point p3">C</div>
      </div>
    );
  }

  return <div className="system-visual quiet-visual"><span className="visual-label">ARCHIVE / {project.year}</span><strong>{project.index}</strong></div>;
}

function ProjectMedia({ project }: { project: Project }) {
  if (project.image) {
    return (
      <figure className="title-media">
        <Image src={project.image} alt={project.imageAlt ?? ""} width={900} height={540} sizes="(max-width: 760px) 100vw, 34vw" unoptimized />
        <figcaption>PROJECT MEDIA / {project.year}</figcaption>
      </figure>
    );
  }

  return (
    <div className="title-media media-placeholder" aria-label={`Reserved space for ${project.title} project imagery`}>
      <span>PROJECT_MEDIA</span>
      <strong>IMAGE SLOT</strong>
      <small>16:09 / READY FOR ASSET</small>
    </div>
  );
}

function ProjectCard({ project, release = false }: { project: Project; release?: boolean }) {
  function trackCardPointer(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--local-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--local-y", `${event.clientY - bounds.top}px`);
  }

  if (release) {
    return (
      <article className="release-card focus-frame" onPointerMove={trackCardPointer}>
        <div className="release-head">
          <div className="release-title">
            <div className="project-meta"><span>{project.index}</span><span>{project.year}</span></div>
            <p className="project-eyebrow">{project.eyebrow}</p>
            <h3>{project.title}</h3>
            <div className="release-links">
              {project.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}<span aria-hidden="true">↗</span></a>)}
            </div>
          </div>
          <ProjectMedia project={project} />
        </div>
        <div className="release-body">
          <div className="project-copy">
            <p className="project-description">{project.description}</p>
            {project.details && <p className="project-details">{project.details}</p>}
            <ul className="tag-list" aria-label={`${project.title} technologies and disciplines`}>
              {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </div>
          <ProjectVisual project={project} />
        </div>
      </article>
    );
  }

  return (
    <article className={`project-card focus-frame ${project.featured ? "featured" : ""}`} onPointerMove={trackCardPointer}>
      <div className="project-copy">
        <div className="project-meta"><span>{project.index}</span><span>{project.year}</span></div>
        <p className="project-eyebrow">{project.eyebrow}</p>
        <h3>{project.title}</h3>
        <p className="project-description">{project.description}</p>
        {project.details && <p className="project-details">{project.details}</p>}
        <ul className="tag-list" aria-label={`${project.title} technologies and disciplines`}>
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
        <div className="project-links">
          {project.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}<span aria-hidden="true">↗</span></a>)}
        </div>
      </div>
      <ProjectVisual project={project} />
    </article>
  );
}

type Accent = "lichen" | "ice" | "ember";

function TopographicPointer() {
  return <div className="pointer-topography" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <span key={index} style={{ "--ring": index } as CSSProperties} />)}</div>;
}

function Navigation({ page, navRef }: { page: PageId; navRef: RefObject<HTMLElement | null> }) {
  return (
    <header className="site-header nav-visible" ref={navRef}>
      <Link className="brand" href="/" aria-label="Leon Zhou portfolio home"><span className="brand-mark">LZ</span><span className="brand-label">PORTFOLIO / 2026</span></Link>
      <nav className="header-links" aria-label="Primary navigation">
        <Link href="/" aria-current={page === "home" ? "page" : undefined}>Home</Link>
        {tabs.map((tab) => <Link key={tab.id} href={tab.path} aria-current={page === tab.id ? "page" : undefined}>{tab.id === "technical" ? "Technical" : tab.id === "games" ? "Games" : "Design"}</Link>)}
      </nav>
      <span className="nav-proximity">MOVE TO TOP / NAV</span>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div><span className="footer-kicker">OPEN TO COLLABORATION</span><h2>Let’s make<br />something playable.</h2></div>
      <div className="footer-links"><a href="mailto:leonzhouziang@gmail.com">Email <span>↗</span></a><a href="https://github.com/Hubr1zz" target="_blank" rel="noreferrer">GitHub <span>↗</span></a><a href="https://leon-zhou.itch.io/" target="_blank" rel="noreferrer">Itch.io <span>↗</span></a><a href="https://52ccdc57-ad3f-47d6-9b83-c35f8ad2c41f.filesusr.com/ugd/2967e1_9d3e636f150d4a08a49e78ff06525b6a.pdf" target="_blank" rel="noreferrer">Résumé <span>↗</span></a></div>
      <div className="footer-base"><span>LEON ZHOU / PORTFOLIO</span><span>DESIGNED FOR CLARITY · BUILT WITH INTENT</span></div>
    </footer>
  );
}

function HomePage({ accent, onAccentChange }: { accent: Accent; onAccentChange: (accent: Accent) => void }) {
  return (
    <>
      <section className="hero page-enter" id="top">
        <div className="contour-field" aria-hidden="true"><span /><span /><span /><span /></div>
        <div className="hero-kicker"><span>PROFILE_001</span><span>LOS ANGELES / CA</span></div>
        <div className="hero-copy">
          <p className="role-label">Technical Designer · Gameplay Programmer</p>
          <h1 aria-label="Leon Zhou"><span className="name-leon">Leon</span><span className="name-zhou">Zhou</span></h1>
          <p className="hero-intro">I design gameplay systems and build the technology that makes them tangible—bridging mechanics, tools, and real-time visuals.</p>
        </div>
        <aside className="hero-profile focus-frame">
          <p className="profile-lead">Game designer, gameplay programmer, but most importantly, game player.</p>
          <p>I graduated from Rensselaer Polytechnic Institute’s Games &amp; Simulation Arts &amp; Sciences program, connecting computer science, game design, and real-time visual practice.</p>
          <p>I care about how mechanics, systems, and feedback shape player experience. Programming and 3D math let me turn ambiguous ideas into playable, testable systems.</p>
          <p className="profile-goal">Seeking Technical Designer, Systems Designer, or Gameplay Engineer opportunities.</p>
          <div className="hero-status"><span className="status-dot" /><span>Current focus</span><strong>Gameplay systems &amp; production tooling</strong></div>
        </aside>
        <div className="hero-controls">
          <a className="scroll-cue" href="#work"><span>Explore selected work</span><i aria-hidden="true" /></a>
          <div className="accent-picker" aria-label="Topographic highlight color">
            <span>CONTOUR SIGNAL</span>
            {(["lichen", "ice", "ember"] as Accent[]).map((item) => <button key={item} type="button" className={accent === item ? "active" : ""} onClick={() => onAccentChange(item)} aria-pressed={accent === item}><i aria-hidden="true" />{item}</button>)}
          </div>
        </div>
      </section>

      <section className="home-work-portal page-enter" id="work">
        <div className="section-heading"><div><span className="section-index">INDEX / WORK</span><h2>Selected work</h2></div><p>A compact index only. Each category opens as a separate page with its own layout, rhythm, and interaction field.</p></div>
        <div className="portal-grid">
          {tabs.map((tab, index) => <Link className={`portal-card portal-${tab.id} focus-frame`} href={tab.path} key={tab.id}><span>0{index + 1} / {tab.count}</span><h3>{tab.label}</h3><p>{tab.description}</p><strong>OPEN INDEX ↗</strong></Link>)}
        </div>
      </section>
    </>
  );
}

function WorkPage({ page }: { page: TabId }) {
  const meta = tabs.find((tab) => tab.id === page) ?? tabs[0];
  const releasedProjects = projects.technical.filter((project) => project.tier === "release");
  const studyProjects = projects.technical.filter((project) => project.tier === "study");

  return (
    <>
      <section className="work-page-head page-enter">
        <div className="page-field" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <span className="section-index">WORK INDEX / {meta.count}</span>
        <h1>{meta.label}</h1>
        <p>{meta.description}</p>
        <div className="page-crosslinks">{tabs.filter((tab) => tab.id !== page).map((tab) => <Link href={tab.path} key={tab.id}>{tab.label}<span>↗</span></Link>)}</div>
      </section>

      <section className="work-page-body project-surface page-enter">
        {page === "technical" ? (
          <>
            <section className="project-tier release-tier" aria-labelledby="released-heading">
              <div className="tier-heading"><span>01 / RELEASED</span><div><h2 id="released-heading">Published projects</h2><p>Maintained tools and systems intended for use beyond a single prototype.</p></div></div>
              <div className="release-list">{releasedProjects.map((project) => <ProjectCard project={project} release key={project.id} />)}</div>
              <a className="roadmap-slot focus-frame" href="https://github.com/Hubr1zz/ZFramework" target="_blank" rel="noreferrer"><span>NEXT_RELEASE</span><strong>ZFramework</strong><small>IN DEVELOPMENT ↗</small></a>
            </section>
            <section className="project-tier study-tier" aria-labelledby="studies-heading">
              <div className="tier-heading"><span>02 / PRACTICE</span><div><h2 id="studies-heading">Studies &amp; experiments</h2><p>Focused exercises used to investigate animation, rendering, and editor workflow problems.</p></div></div>
              <div className="study-grid">{studyProjects.map((project) => <ProjectCard project={project} key={project.id} />)}</div>
            </section>
          </>
        ) : <div className="standard-grid">{projects[page].map((project) => <ProjectCard project={project} key={project.id} />)}</div>}
      </section>
    </>
  );
}

export function Portfolio({ page = "home" }: { page?: PageId }) {
  const shellRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [accent, setAccent] = useState<Accent>("lichen");

  useEffect(() => {
    try {
      const savedAccent = window.localStorage.getItem("portfolio-accent") as Accent | null;
      if (savedAccent === "lichen" || savedAccent === "ice" || savedAccent === "ember") window.requestAnimationFrame(() => setAccent(savedAccent));
    } catch {
      // Storage can be unavailable in privacy-restricted contexts; the default remains usable.
    }

    const target = { x: window.innerWidth * .72, y: window.innerHeight * .24 };
    const current = { ...target };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const navTimer = window.setTimeout(() => navRef.current?.classList.remove("nav-visible"), 1800);

    const move = (event: globalThis.PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      const nearTop = event.clientY < 132;
      navRef.current?.classList.toggle("nav-visible", nearTop);
      if (nearTop) window.clearTimeout(navTimer);
      if (reduceMotion && shellRef.current) {
        shellRef.current.style.setProperty("--pointer-x", `${target.x}px`);
        shellRef.current.style.setProperty("--pointer-y", `${target.y}px`);
      }
    };
    const animate = () => {
      current.x += (target.x - current.x) * .095;
      current.y += (target.y - current.y) * .095;
      const shell = shellRef.current;
      if (shell) {
        shell.style.setProperty("--pointer-x", `${current.x.toFixed(2)}px`);
        shell.style.setProperty("--pointer-y", `${current.y.toFixed(2)}px`);
        shell.style.setProperty("--pointer-rx", (current.x / window.innerWidth - .5).toFixed(4));
        shell.style.setProperty("--pointer-ry", (current.y / window.innerHeight - .5).toFixed(4));
      }
      frame = window.requestAnimationFrame(animate);
    };
    window.addEventListener("pointermove", move, { passive: true });
    if (!reduceMotion) frame = window.requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("pointermove", move);
      window.cancelAnimationFrame(frame);
      window.clearTimeout(navTimer);
    };
  }, []);

  function changeAccent(nextAccent: Accent) {
    setAccent(nextAccent);
    try {
      window.localStorage.setItem("portfolio-accent", nextAccent);
    } catch {
      // The visual choice still applies for this page even when storage is blocked.
    }
  }

  return (
    <main ref={shellRef} className={`site-shell page-${page} theme-${accent}`} style={{ "--pointer-x": "72vw", "--pointer-y": "24vh", "--pointer-rx": ".22", "--pointer-ry": "-.26" } as CSSProperties}>
      <div className="ambient-grid" aria-hidden="true" />
      <div className="ambient-scan" aria-hidden="true" />
      <TopographicPointer />
      <Navigation page={page} navRef={navRef} />
      {page === "home" ? <HomePage accent={accent} onAccentChange={changeAccent} /> : <WorkPage page={page} />}
      <Footer />
    </main>
  );
}
