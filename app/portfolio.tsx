/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type RefObject } from "react";
import Image from "next/image";

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
type DiagramId = "workflow-lifecycle" | "workflow-knowledge" | "interaction-routing" | "interaction-typed";
type BoardItem = {
  id: string;
  title: string;
  description: string;
  details?: string;
  image?: string;
  imageAlt?: string;
  diagram?: DiagramId;
  visual?: boolean;
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
      tags: ["Unity", "OpenSpec", "Tooling", "Bilingual"],
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
      links: [
        { label: "GitHub design document", href: "https://github.com/Hubr1zz/GameDesignVault" },
        { label: "Legacy Notion document", href: "https://www.notion.so/leonzhouziang/KDM-inspired-tactic-game-design-63affac2d3d843b5bad6e01835a1fba1?p=2a0ca75016908091a97ac2a359c6e375&pm=s" },
      ],
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
      links: [{ label: "Notion notebook", href: "https://www.notion.so/leonzhouziang/Game-design-analysis-212ca7501690809586fbd4c37af7e12c?source=copy_link" }],
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

function FlowDiagram({ id }: { id: DiagramId }) {
  if (id === "workflow-lifecycle") {
    return (
      <div className="flow-diagram flow-lifecycle" aria-label="zWorkFlow change lifecycle diagram">
        <span className="flow-kicker">CHANGE_LIFECYCLE</span>
        <div className="flow-chain"><b>Design docs</b><i>→</i><b>Draft change</b><i>→</i><b>Review</b><i>→</i><b>Approve</b><i>→</i><b>Apply</b><i>→</i><b>Sync + archive</b></div>
        <p>Human approval remains the gate between design intent and implementation.</p>
      </div>
    );
  }

  if (id === "workflow-knowledge") {
    return (
      <div className="flow-diagram flow-network" aria-label="zWorkFlow shared project knowledge diagram">
        <span className="flow-kicker">SHARED_PROJECT_CONTEXT</span>
        <div className="flow-inputs"><b>OpenSpec</b><b>Project skills</b><b>Code index</b></div>
        <i className="flow-line" />
        <div className="flow-hub"><span>ONE SOURCE</span><strong>WORKBENCH</strong></div>
        <i className="flow-line" />
        <div className="flow-outputs"><b>Codex</b><b>Claude</b><b>Cursor + tools</b></div>
      </div>
    );
  }

  if (id === "interaction-routing") {
    return (
      <div className="flow-diagram flow-routing" aria-label="Interaction System unified event routing diagram">
        <span className="flow-kicker">UNIFIED_EVENT_ROUTING</span>
        <div className="route-sources"><b>Physics raycast<small>3D OBJECT</small></b><b>EventSystem<small>UGUI</small></b></div>
        <i>↓</i><div className="route-target">IInteractableTarget</div><i>↓</i><div className="route-dispatch">InteractionSystem / dispatch</div>
        <div className="route-results"><b>FOCUS</b><b>CLICK</b><b>DRAG</b></div>
      </div>
    );
  }

  return (
    <div className="flow-diagram flow-typed" aria-label="Interaction System typed drag communication diagram">
      <span className="flow-kicker">TYPED_DRAG_COMMUNICATION</span>
      <div className="typed-node"><small>SOURCE</small><b>IDraggable&lt;T&gt;</b><span>Card</span></div>
      <i>→</i><div className="typed-cache"><small>CACHED MAP</small><strong>T</strong><span>zero runtime reflection</span></div>
      <i>→</i><div className="typed-node"><small>TARGET</small><b>IFocusable&lt;T&gt;</b><span>Slot</span></div>
      <p>ENTER · STAY · RELEASE · LEAVE</p>
    </div>
  );
}

function getBoardItems(project: Project): BoardItem[] {
  if (project.id === "zworkflow") {
    return [
      {
        id: "change-lifecycle",
        title: "Reviewed change lifecycle",
        description: "Design intent is converted into a Draft Change, reviewed by a person, then approved before implementation begins.",
        details: "Apply updates code and validation records without silently rewriting the formal specification. A deliberate sync merges the approved delta into the project contract, and only completed, synchronized work can be archived.",
        diagram: "workflow-lifecycle",
      },
      {
        id: "shared-context",
        title: "Shared project context",
        description: "Different AI tools work from the same OpenSpec records, project skills, code evidence, and design documents.",
        details: "Thin tool-specific adapters point Codex, Claude Code, Cursor, and other supported agents at one shared source of truth. The Unity Workbench exposes review status, dependencies, blockers, translations, and implementation evidence without duplicating the workflow.",
        diagram: "workflow-knowledge",
      },
    ];
  }

  if (project.id === "interaction") {
    return [
      {
        id: "unified-routing",
        title: "Unified 3D and UI routing",
        description: "Physics raycasts and Unity EventSystem events converge on the same IInteractableTarget contract.",
        details: "InteractionSystem does not need to know whether a target originated in world space or UI. It dispatches both paths to composable Behaviour classes that implement Focus, Click, or Drag responsibilities.",
        diagram: "interaction-routing",
      },
      {
        id: "typed-drag",
        title: "Typed drag communication",
        description: "Generic drag and focus interfaces let a source and target exchange strongly typed context—for example, a card and its receiving slot.",
        details: "Generic method mappings are discovered and cached at startup. Runtime dispatch then avoids reflection while still delivering enter, stay, release, and leave callbacks with the correct target data.",
        diagram: "interaction-typed",
      },
    ];
  }

  if (project.id === "procedural-motion") {
    return [{
      id: "locomotion-capture",
      title: "Procedural locomotion prototype",
      description: "A locomotion test that combines sphere casts, fixed raycasts, phase offsets, and Cinemachine camera control.",
      details: "A sphere cast searches for a foot landing area and a raycast rejects positions blocked by obstacles. The search rotates through alternative angles until it finds a valid foothold; if none exists, movement stops. Per-leg phase differences prevent simultaneous steps, while the body interpolates between the average foot position and a predicted movement position.",
      image: project.image,
      imageAlt: project.imageAlt,
    }];
  }

  if (project.id === "rendering-studies" && project.gallery) {
    const explanations = [
      {
        title: "Stylized grass in Unity",
        description: "A Shader Graph recreation of the stylized lawn study, including vertex animation and authored lighting response.",
        details: "The source grass was built in Blender with Geometry Nodes and baked normals so the lawn would not read as a flat sheet under lighting. The Unity version rebuilds the look as a real-time shader; later exploration targets GPU instancing and a mask-painting workflow.",
      },
      {
        title: "Depth-based water and caustics",
        description: "A stylized water surface built by comparing screen-space depth with reconstructed world-space distance.",
        details: "World coordinates are reconstructed from the depth buffer and used to sample noise for the caustics. This lets shoreline edges, depth transitions, and the projected light pattern respond to the scene rather than to a fixed texture placement.",
      },
      {
        title: "Wind-shaped desert",
        description: "A Journey-inspired sand study using a custom HLSL shader and particle-driven wind cues.",
        details: "The broad terrain undulation is authored in Blender. A custom sand shader and vertex animation add the smaller moving response, while particles provide readable wind direction and rhythm across the scene.",
      },
      {
        title: "Geometry Nodes grass source",
        description: "The authored Blender source used to study grass distribution, silhouette, and lighting before rebuilding the effect in Unity.",
        details: "Geometry Nodes distributes the grass procedurally, while baked normals soften the lighting across individual blades. This source establishes the visual target for the later Shader Graph implementation.",
      },
    ];

    return project.gallery.map((image, index) => ({ id: `image-${index}`, ...explanations[index], image: image.src, imageAlt: image.alt }));
  }

  if (project.gallery) return project.gallery.map((image, index) => ({ id: `image-${index}`, title: image.alt, description: image.alt, image: image.src, imageAlt: image.alt }));
  if (project.image) return [{ id: "image-0", title: project.imageAlt ?? project.title, description: project.imageAlt ?? "", image: project.image, imageAlt: project.imageAlt ?? project.title }];
  return [{ id: "system-visual", title: project.eyebrow, description: project.description, details: project.details, visual: true }];
}

function BoardArtwork({ item, project }: { item: BoardItem; project: Project }) {
  if (item.diagram) return <FlowDiagram id={item.diagram} />;
  if (item.image) return <Image src={item.image} alt={item.imageAlt ?? item.title} width={1600} height={1000} sizes="(max-width: 760px) 96vw, 58vw" unoptimized />;
  return <ProjectVisual project={project} />;
}

function ProjectBoard({ project, items, selectedIndex, onSelect }: { project: Project; items: BoardItem[]; selectedIndex: number | null; onSelect: (index: number | null) => void }) {
  const selectedItem = selectedIndex === null ? null : items[selectedIndex];

  return (
    <div className="project-board-shell">
      <div className={`project-board ${selectedItem ? "is-detail" : "is-preview"}`}>
        <div className="board-toolbar">
          <span>PROJECT_BOARD / {project.index}</span>
          <span>{items.length} ITEM{items.length === 1 ? "" : "S"}</span>
        </div>

        {!selectedItem ? (
          <div className={`board-preview-grid board-count-${Math.min(items.length, 4)}`}>
            {items.map((item, index) => (
              <button className={`board-item ${item.image ? "" : "board-vector-item"}`} type="button" key={item.id} onClick={() => onSelect(index)} aria-label={`Enlarge image: ${item.title}`}>
                <div className="board-artwork"><BoardArtwork item={item} project={project} /></div>
                <span><b>FIG. {String(index + 1).padStart(2, "0")}</b>{item.title}</span>
              </button>
            ))}
            <p className="board-hint">SELECT IMAGE TO INSPECT</p>
          </div>
        ) : (
          <div className="board-detail">
            <button className="board-back" type="button" onClick={() => onSelect(null)} aria-label="Back to project board">
              <span aria-hidden="true">←</span> BACK TO BOARD
            </button>
            <div className={`board-detail-media ${selectedItem.image ? "" : "is-vector"}`}><BoardArtwork item={selectedItem} project={project} /></div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const boardItems = getBoardItems(project);
  const [selectedBoardIndex, setSelectedBoardIndex] = useState<number | null>(null);
  const selectedBoardItem = selectedBoardIndex === null ? null : boardItems[selectedBoardIndex];
  const cardRef = useRef<HTMLElement>(null);
  const cardBounds = useRef<DOMRect | null>(null);
  const pendingPointer = useRef<{ x: number; y: number } | null>(null);
  const pointerFrame = useRef(0);

  useEffect(() => () => window.cancelAnimationFrame(pointerFrame.current), []);

  function cacheCardBounds(event: PointerEvent<HTMLElement>) {
    cardBounds.current = event.currentTarget.getBoundingClientRect();
  }

  function trackCardPointer(event: PointerEvent<HTMLElement>) {
    pendingPointer.current = { x: event.clientX, y: event.clientY };
    if (pointerFrame.current) return;

    pointerFrame.current = window.requestAnimationFrame(() => {
      pointerFrame.current = 0;
      const bounds = cardBounds.current;
      const pointer = pendingPointer.current;
      const card = cardRef.current;
      if (!bounds || !pointer || !card) return;

      card.style.setProperty("--local-x", `${pointer.x - bounds.left}px`);
      card.style.setProperty("--local-y", `${pointer.y - bounds.top}px`);
    });
  }

  return (
    <article id={`project-${project.id}`} ref={cardRef} className="project-card uniform-project-card focus-frame" onPointerEnter={cacheCardBounds} onPointerMove={trackCardPointer}>
      <div className="project-copy">
        <div className="project-meta"><span>{project.index}</span><span>{project.year}</span></div>
        <p className="project-eyebrow">{project.eyebrow}</p>
        <h3>{project.title}</h3>
        <p className="project-description">{project.description}</p>
        {project.details && <p className="project-details">{project.details}</p>}
        {selectedBoardItem && (
          <div className="project-insight-insert" key={selectedBoardItem.id}>
            <div>
              <section className="project-image-insight" aria-label={`Details for ${selectedBoardItem.title}`}>
                <span>SELECTED MEDIA / FIG. {String((selectedBoardIndex ?? 0) + 1).padStart(2, "0")}</span>
                <h4>{selectedBoardItem.title}</h4>
                <p>{selectedBoardItem.description}</p>
                {selectedBoardItem.details && <p>{selectedBoardItem.details}</p>}
              </section>
            </div>
          </div>
        )}
        <ul className="tag-list" aria-label={`${project.title} technologies and disciplines`}>
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
        <div className="project-links">
          {project.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}<span aria-hidden="true">↗</span></a>)}
        </div>
      </div>
      <ProjectBoard project={project} items={boardItems} selectedIndex={selectedBoardIndex} onSelect={setSelectedBoardIndex} />
    </article>
  );
}

function TopographicField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const [red, green, blue] = [232, 156, 78];
    let resizeFrame = 0;

    function hash(x: number, y: number) {
      let value = Math.imul(x, 374761393) + Math.imul(y, 668265263) + 731947;
      value = Math.imul(value ^ value >>> 13, 1274126177);
      return ((value ^ value >>> 16) >>> 0) / 4294967295;
    }

    function smooth(value: number) {
      return value * value * (3 - 2 * value);
    }

    function valueNoise(x: number, y: number) {
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);
      const tx = smooth(x - x0);
      const ty = smooth(y - y0);
      const a = hash(x0, y0);
      const b = hash(x0 + 1, y0);
      const c = hash(x0, y0 + 1);
      const d = hash(x0 + 1, y0 + 1);
      const top = a + (b - a) * tx;
      const bottom = c + (d - c) * tx;
      return top + (bottom - top) * ty;
    }

    function fractalNoise(x: number, y: number) {
      let value = 0;
      let amplitude = .54;
      let frequency = 1;
      let total = 0;
      for (let octave = 0; octave < 5; octave += 1) {
        value += valueNoise(x * frequency, y * frequency) * amplitude;
        total += amplitude;
        amplitude *= .5;
        frequency *= 2.03;
      }
      return value / total;
    }

    type Point = { x: number; y: number };

    function interpolate(a: Point, b: Point, valueA: number, valueB: number, level: number): Point {
      const denominator = valueB - valueA;
      const amount = Math.abs(denominator) < .000001 ? .5 : Math.max(0, Math.min(1, (level - valueA) / denominator));
      return { x: a.x + (b.x - a.x) * amount, y: a.y + (b.y - a.y) * amount };
    }

    function segment(path: Path2D, start: Point, end: Point) {
      path.moveTo(start.x, start.y);
      path.lineTo(end.x, end.y);
    }

    function renderContours() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const spacing = width < 760 ? 9 : 12;
      const columns = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const values = new Float32Array(columns * rows);
      let minimum = Number.POSITIVE_INFINITY;
      let maximum = Number.NEGATIVE_INFINITY;

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const nx = column * spacing / width;
          const ny = row * spacing / width;
          const value = fractalNoise(nx * 3.4 + .7, ny * 3.4 + 1.9);
          values[row * columns + column] = value;
          minimum = Math.min(minimum, value);
          maximum = Math.max(maximum, value);
        }
      }

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.lineCap = "round";
      context.lineJoin = "round";

      const levelCount = 28;
      const range = maximum - minimum;
      for (let levelIndex = 1; levelIndex < levelCount; levelIndex += 1) {
        const level = minimum + range * levelIndex / levelCount;
        const path = new Path2D();

        for (let row = 0; row < rows - 1; row += 1) {
          for (let column = 0; column < columns - 1; column += 1) {
            const topLeftValue = values[row * columns + column];
            const topRightValue = values[row * columns + column + 1];
            const bottomRightValue = values[(row + 1) * columns + column + 1];
            const bottomLeftValue = values[(row + 1) * columns + column];
            const state = (topLeftValue >= level ? 1 : 0) | (topRightValue >= level ? 2 : 0) | (bottomRightValue >= level ? 4 : 0) | (bottomLeftValue >= level ? 8 : 0);
            if (state === 0 || state === 15) continue;

            const x = column * spacing;
            const y = row * spacing;
            const topLeft = { x, y };
            const topRight = { x: x + spacing, y };
            const bottomRight = { x: x + spacing, y: y + spacing };
            const bottomLeft = { x, y: y + spacing };
            const top = interpolate(topLeft, topRight, topLeftValue, topRightValue, level);
            const right = interpolate(topRight, bottomRight, topRightValue, bottomRightValue, level);
            const bottom = interpolate(bottomLeft, bottomRight, bottomLeftValue, bottomRightValue, level);
            const left = interpolate(topLeft, bottomLeft, topLeftValue, bottomLeftValue, level);
            const centerIsHigh = (topLeftValue + topRightValue + bottomRightValue + bottomLeftValue) * .25 >= level;

            if (state === 1 || state === 14) segment(path, left, top);
            else if (state === 2 || state === 13) segment(path, top, right);
            else if (state === 3 || state === 12) segment(path, left, right);
            else if (state === 4 || state === 11) segment(path, right, bottom);
            else if (state === 6 || state === 9) segment(path, top, bottom);
            else if (state === 7 || state === 8) segment(path, left, bottom);
            else if (state === 5) {
              if (centerIsHigh) {
                segment(path, top, right);
                segment(path, bottom, left);
              } else {
                segment(path, top, left);
                segment(path, right, bottom);
              }
            } else if (state === 10) {
              if (centerIsHigh) {
                segment(path, top, left);
                segment(path, right, bottom);
              } else {
                segment(path, top, right);
                segment(path, bottom, left);
              }
            }
          }
        }

        const emphasis = levelIndex % 4 === 0 ? 1.5 : 1;
        const alpha = emphasis === 1.5 ? .42 : .25;
        context.lineWidth = emphasis;
        context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        context.stroke(path);
      }
    }

    const resize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        renderContours();
      });
    };

    renderContours();
    window.addEventListener("resize", resize, { passive: true });
    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(resizeFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="topographic-canvas" aria-hidden="true" />;
}

function Navigation({ page, navRef }: { page: PageId; navRef: RefObject<HTMLElement | null> }) {
  return (
    <header className="site-header nav-visible at-page-top" ref={navRef}>
      <a className="brand" href="/" aria-label="Leon Zhou portfolio home"><span className="brand-mark">LZ</span><span className="brand-label">PORTFOLIO / 2026</span></a>
      <nav className="header-links" aria-label="Primary navigation">
        <a href="/" aria-current={page === "home" ? "page" : undefined}>Home</a>
        {tabs.map((tab) => <a key={tab.id} href={tab.path} aria-current={page === tab.id ? "page" : undefined}>{tab.id === "technical" ? "Technical" : tab.id === "games" ? "Games" : "Design"}</a>)}
      </nav>
      <span className="nav-proximity">MOVE TO TOP / NAV</span>
    </header>
  );
}

function Footer() {
  const [copyStatus, setCopyStatus] = useState("COPY");
  const copyTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("leonzhouziang@gmail.com");
      setCopyStatus("COPIED");
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopyStatus("COPY"), 1800);
    } catch {
      setCopyStatus("COPY FAILED");
    }
  }

  return (
    <footer className="site-footer">
      <div><span className="footer-kicker">OPEN TO COLLABORATION</span><h2>Let’s make<br />something playable.</h2></div>
      <div className="footer-links"><button className="footer-copy" type="button" onClick={copyEmail}><span>leonzhouziang@gmail.com</span><small aria-live="polite">{copyStatus}</small></button><a href="https://github.com/Hubr1zz" target="_blank" rel="noreferrer">GitHub <span>↗</span></a><a href="https://leon-zhou.itch.io/" target="_blank" rel="noreferrer">Itch.io <span>↗</span></a><a href="https://52ccdc57-ad3f-47d6-9b83-c35f8ad2c41f.filesusr.com/ugd/2967e1_9d3e636f150d4a08a49e78ff06525b6a.pdf" target="_blank" rel="noreferrer">Résumé <span>↗</span></a></div>
      <div className="footer-base"><span>LEON ZHOU / PORTFOLIO</span><span>DESIGNED FOR CLARITY · BUILT WITH INTENT</span></div>
    </footer>
  );
}

function HomePage() {
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
          <span className="fixed-accent">CONTOUR SIGNAL / AMBER</span>
        </div>
      </section>

      <section className="home-work-portal page-enter" id="work">
        <div className="section-heading"><div><span className="section-index">INDEX / WORK</span><h2>Selected work</h2></div><p>Three signature works form the shortest route into my technical and design practice. Two are selected; the final position remains intentionally open.</p></div>
        <div className="portal-grid">
          <a className="portal-card portal-technical focus-frame" href="/technical#project-zworkflow"><span>01 / TECHNICAL</span><h3>zWorkFlow</h3><p>An AI-assisted production workflow that turns design intent into reviewable changes, implementation, and traceable project knowledge.</p><strong>OPEN PROJECT ↗</strong></a>
          <a className="portal-card portal-design focus-frame" href="/design#project-tactics-design"><span>02 / DESIGN</span><h3>Tactical Game Design Document</h3><p>An evolving systems-design project exploring preparation, pressure, progression, and consequence in a tactical game structure.</p><strong>OPEN PROJECT ↗</strong></a>
          <div className="portal-card portal-pending" aria-label="Third signature project not yet selected"><span>03 / RESERVED</span><h3>Next signature work</h3><p>The third position remains open until another project represents the portfolio at the same level.</p><strong>SELECTION PENDING</strong></div>
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
      </section>

      <section className="work-page-body project-surface page-enter">
        {page === "technical" ? (
          <>
            <section className="project-tier release-tier" aria-labelledby="released-heading">
              <div className="tier-heading"><span>01 / RELEASED</span><div><h2 id="released-heading">Published projects</h2><p>Maintained tools and systems intended for use beyond a single prototype.</p></div></div>
              <div className="release-list">{releasedProjects.map((project) => <ProjectCard project={project} key={project.id} />)}</div>
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

  useEffect(() => {
    const target = { x: window.innerWidth * .72, y: window.innerHeight * .24 };
    const current = { ...target };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let pointerY = target.y;

    const updateNavigation = () => {
      const atPageTop = window.scrollY < 48;
      const navigation = navRef.current;
      navigation?.classList.toggle("at-page-top", atPageTop);
      navigation?.classList.toggle("nav-visible", atPageTop || pointerY < 132);
    };

    const move = (event: globalThis.PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      pointerY = event.clientY;
      updateNavigation();
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
    window.addEventListener("scroll", updateNavigation, { passive: true });
    updateNavigation();
    if (!reduceMotion) frame = window.requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", updateNavigation);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main ref={shellRef} className={`site-shell page-${page} theme-amber`} style={{ "--pointer-x": "72vw", "--pointer-y": "24vh", "--pointer-rx": ".22", "--pointer-ry": "-.26" } as CSSProperties}>
      <div className="ambient-grid" aria-hidden="true" />
      <div className="ambient-scan" aria-hidden="true" />
      <TopographicField />
      <Navigation page={page} navRef={navRef} />
      {page === "home" ? <HomePage /> : <WorkPage page={page} />}
      <Footer />
    </main>
  );
}
