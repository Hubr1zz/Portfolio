"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type RefObject } from "react";
import Image from "next/image";
import Link from "next/link";

const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function assetPath(path: string) {
  if (!assetBasePath || !path.startsWith("/")) return path;
  return `${assetBasePath}${path}`;
}

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
    count: "05",
    description: "Playable prototypes, game-jam productions, and systems-led experiments where design decisions were validated through implementation.",
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
      title: "Punch-in Rush",
      eyebrow: "Movement prototype → parkour game",
      year: "2025",
      description:
        "A first-person parkour game about a frantic morning commute: wall-run, wall-grab, and dash across a stylized city to reach work on time.",
      details:
        "The project began as a high-mobility combat study, then deliberately narrowed its scope around the character controller. Responsiveness, momentum, readable routes, and level iteration became the primary design material.",
      tags: ["Unity", "Character Controller", "Parkour", "Iteration"],
      links: [
        { label: "Play on Itch.io", href: "https://leon-zhou.itch.io/punchinrush" },
        { label: "Watch video", href: "https://youtu.be/HvlybNRaYVQ" },
        { label: "Read devlog", href: "https://leonzhouziang.notion.site/1c7ca7501690802cb125f737304092ee?v=1c7ca75016908036b2b5000c5f304776" },
      ],
      gallery: [
        { src: "/images/portfolio/punch-overview.webp", alt: "Punch-in Rush overview and playable links" },
        { src: "/images/portfolio/punch-concept.webp", alt: "Punch-in Rush concept, movement model, and design principles" },
        { src: "/images/portfolio/punch-level-design.webp", alt: "Punch-in Rush level design iterations" },
        { src: "/images/portfolio/punch-technical.webp", alt: "Punch-in Rush character controller and rendering studies" },
      ],
      featured: true,
    },
    {
      id: "hunting-in-darkness",
      index: "02",
      title: "Hunt in Darkness",
      eyebrow: "Tactical card-RPG prototype",
      year: "2025",
      description:
        "A compact prototype built in one week to test the hunting and showdown loop of a larger, Kingdom Death: Monster-inspired tactical game design.",
      details:
        "Cards and dice combine uncertainty with preparation: players gather food, preparedness, and target tokens during the hunt, then spend limited energy to attack, dodge, or rest during the showdown.",
      tags: ["Systems Design", "Card Combat", "Rapid Prototyping", "Playtesting"],
      links: [
        { label: "Play on Itch.io", href: "https://leon-zhou.itch.io/rpg-demo" },
        { label: "Watch video", href: "https://youtu.be/JI4dIV5Zk6o" },
      ],
      gallery: [
        { src: "/images/portfolio/hunt-overview.webp", alt: "Hunt in Darkness playable prototype" },
        { src: "/images/portfolio/hunt-design.webp", alt: "Hunt in Darkness inspiration and design document" },
        { src: "/images/portfolio/hunt-systems.webp", alt: "Hunt in Darkness combat actions, rules, and event balancing" },
        { src: "/images/portfolio/hunt-production.webp", alt: "Hunt in Darkness Unity tooling and art pipeline" },
      ],
    },
    {
      id: "outlaws-dead-end",
      index: "03",
      title: "Outlaw’s Deadend",
      eyebrow: "GMTK Game Jam 2025",
      year: "2025",
      description:
        "A puzzle game built around a preset action loop. Players alter the loop with jump pads and blockers to guide an outlaw to each destination.",
      details:
        "As team lead, programmer, and designer, I translated GMTK 2025’s theme “Loop” into both the character’s constraint and the player’s planning space, then supported the team with a custom level editor and shared asset workflow.",
      tags: ["Team Lead", "Puzzle Design", "Unity Tools", "Game Jam"],
      links: [
        { label: "Play on Itch.io", href: "https://leon-zhou.itch.io/outlaws-dead-end" },
        { label: "Watch video", href: "https://youtu.be/LEBErr-W2pE" },
      ],
      gallery: [
        { src: "/images/portfolio/outlaws-overview.webp", alt: "Outlaw’s Deadend overview and core loop" },
        { src: "/images/portfolio/outlaws-systems.webp", alt: "Outlaw’s Deadend puzzle rules and level editor" },
        { src: "/images/portfolio/outlaws-teamwork.webp", alt: "Outlaw’s Deadend team roles and production workflow" },
      ],
    },
    {
      id: "alive",
      index: "04",
      title: "Alive",
      eyebrow: "Team card / simulation game",
      year: "2025",
      description:
        "A playful simulation built around the theme “Everything is Alive”: objects eat, produce new resources, and must be fed and raised by the player.",
      details:
        "The system turns familiar work and investment behaviors into living card relationships. As team lead, I organized the art pipeline, documented asset requirements, and shared the project’s 500-yuan prize with the team.",
      tags: ["Team Lead", "Systems Design", "ScriptableObjects", "Simulation"],
      links: [
        { label: "Play on Itch.io", href: "https://leon-zhou.itch.io/alive" },
        { label: "Watch video", href: "https://youtu.be/0MTk48wgJoM" },
      ],
      gallery: [
        { src: "/images/portfolio/alive-overview.webp", alt: "Alive game overview and everything-is-alive theme" },
        { src: "/images/portfolio/alive-systems.webp", alt: "Alive emergent systems and configurable card outputs" },
        { src: "/images/portfolio/alive-teamwork.webp", alt: "Alive team leadership and production process" },
      ],
    },
    {
      id: "top-hotpot",
      index: "05",
      title: "Top Hotpot",
      eyebrow: "VR cooking simulation",
      year: "2024",
      description:
        "A VR hotpot simulation where ingredients cook, overcook, drift beneath the broth, and visibly change as they approach their ideal serving time.",
      details:
        "The project remakes an earlier 2D experimental game in 3D. Buoyancy and randomized forces simulate boiling water, material color interpolates through cooking states, and most food assets were modeled in Blender.",
      tags: ["VR", "Physics", "Shader", "Blender"],
      links: [{ label: "Watch video", href: "https://youtu.be/YI5XWamgaiQ" }],
      gallery: [
        { src: "/images/portfolio/top-hotpot-overview.webp", alt: "Top Hotpot VR cooking loop" },
        { src: "/images/portfolio/top-hotpot-engineering.webp", alt: "Top Hotpot ingredient simulation and cooking state implementation" },
        { src: "/images/portfolio/top-hotpot-art.webp", alt: "Top Hotpot water effects and Blender asset production" },
      ],
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
      gallery: [
        { src: "/images/design-document.webp", alt: "System diagram from the tactical game design document" },
        { src: "/images/portfolio/hunt-design.webp", alt: "Tactical game inspiration and living design document" },
        { src: "/images/portfolio/hunt-systems.webp", alt: "Tactical game combat rules and numerical balancing" },
        { src: "/images/portfolio/hunt-production.webp", alt: "Tactical prototype engineering and art workflow" },
      ],
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
          <Image key={image.src} src={assetPath(image.src)} alt={image.alt} width={1200} height={720} sizes="(max-width: 760px) 100vw, 55vw" className={index === 0 ? "media-lead" : ""} unoptimized />
        ))}
      </div>
    );
  }

  if (project.image) {
    return (
      <figure className="project-image">
        <Image src={assetPath(project.image)} alt={project.imageAlt ?? ""} width={1200} height={720} sizes="(max-width: 760px) 100vw, 50vw" unoptimized />
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

  if (project.id === "punch-in-rush" && project.gallery) {
    const explanations = [
      {
        title: "From combat study to morning commute",
        description: "The finished prototype reframes high-speed traversal as a race through a stylized city to arrive at work on time.",
        details: "The project originally targeted time-slowing combat and extreme mobility. I reduced the scope to the strongest component—the character controller—and used my daily commute as the theme. This made wall-running, wall-grabbing, route readability, and a clear time goal the center of the experience.",
      },
      {
        title: "Movement model and design principles",
        description: "Traversal is organized as a small state machine spanning grounded, airborne, wall-running, and wall-grabbing states.",
        details: "Each transition checks speed, facing, look direction, fall velocity, and the relationship between movement and wall normals. The levels follow two rules: the next destination should remain legible at speed, and optional rewards should not pull players too far away from the main flow.",
      },
      {
        title: "Level design through playtesting",
        description: "Two levels progressed from layout and whitebox to art pass, playtest, and targeted iteration.",
        details: "The opening level communicates a morning routine before introducing traversal. The second level expands into a vertical city with moving buses, elevators, and wall-grab sequences. Playtest feedback drove changes to choke points, platform spacing, landing readability, and the visual treatment of valid surfaces.",
      },
      {
        title: "Controller and rendering experiments",
        description: "The controller prototype was isolated in a test scene before being validated by multiple players and integrated into production levels.",
        details: "Velocity updates use vector projections and state-specific formulas with explicit edge-case checks. I also studied ray-marched volumetric clouds and a Blender-baked wall-unfold animation; the latter was removed after testing because it conflicted with the final skybox and did not improve the experience.",
      },
    ];
    return project.gallery.map((image, index) => ({ id: `punch-${index}`, ...explanations[index], image: image.src, imageAlt: image.alt }));
  }

  if (project.id === "hunting-in-darkness" && project.gallery) {
    const explanations = [
      {
        title: "Playable tactical slice",
        description: "A one-week prototype validates the core feel of a larger tactical card-RPG before the full design is committed to production.",
        details: "The prototype focuses on two connected phases: prepare while hunting, then survive a showdown. It creates a fast feedback loop for checking whether the design is understandable, playable, and worth iterating through direct player feedback.",
      },
      {
        title: "KDM-inspired structure",
        description: "The design adapts the preparation, risk, and lasting consequence of Kingdom Death: Monster into a compact digital format.",
        details: "Players explore a hostile world, collect resources, craft, develop characters, and face dangerous monsters. The current document is maintained as an evolving design rather than a fixed pitch: ideas move into prototypes so combat rhythm, resource pressure, and game feel can be tested early.",
      },
      {
        title: "Cards, dice, and calculated uncertainty",
        description: "Random outcomes are constrained by preparation so lucky rolls feel exciting without removing strategic control.",
        details: "Food Stock sustains the hunt, Target Tokens advance toward the showdown, Preparedness absorbs risk, and Wounds define failure. During combat, limited Energy is spent on attack, dodge, or rest. Event probabilities and expected resource changes were modeled in spreadsheets, then adjusted through playtesting.",
      },
      {
        title: "Data-driven production pipeline",
        description: "Unity authoring tools keep card events, outcomes, animation flow, and presentation easy to revise as the design changes.",
        details: "Odin Serializer powers an event configuration tool, while DOTween and UniTask coordinate card animation and game flow. The monochrome comic direction was developed with generative image tools and refined in Photoshop to keep line weight, shadow, and atmosphere consistent.",
      },
    ];
    return project.gallery.map((image, index) => ({ id: `hunt-${index}`, ...explanations[index], image: image.src, imageAlt: image.alt }));
  }

  if (project.id === "outlaws-dead-end" && project.gallery) {
    const explanations = [
      {
        title: "Loop as movement constraint",
        description: "Every level gives the outlaw a preset action loop; the player cannot steer directly and must instead reshape the route.",
        details: "Jump pads displace the character while blocker boxes cancel one attempted grid entry. By placing those components at the correct moments, players transform an otherwise repeating sequence into a path that reaches the destination.",
      },
      {
        title: "Puzzle system and level editor",
        description: "Thirteen levels are stored as ScriptableObjects and authored through a custom in-editor grid tool.",
        details: "The editor made it practical to paint cells, place puzzle components, change the action loop, and tune level properties during the jam. Separating level data from scene setup let the team iterate quickly without rebuilding the world by hand.",
      },
      {
        title: "Game-jam team pipeline",
        description: "As team lead, programmer, and designer, I organized seven contributors around clear design, art, and technical responsibilities.",
        details: "Designers discussed puzzles in Figma, requirements and levels were tracked in shared spreadsheets, and artists delivered 2D and 3D assets against explicit briefs. A technical artist worked directly in Unity with me while the level-editing tools kept content integration consistent.",
      },
    ];
    return project.gallery.map((image, index) => ({ id: `outlaws-${index}`, ...explanations[index], image: image.src, imageAlt: image.alt }));
  }

  if (project.id === "alive" && project.gallery) {
    const explanations = [
      {
        title: "Everything is Alive",
        description: "Cards behave like living objects: they consume resources, produce outcomes, and ask the player to feed and raise an unstable little economy.",
        details: "The theme becomes the mechanic rather than a surface treatment. Money bags, computers, livestock, and the player character all participate in the same playful ecosystem, making the board feel busy, reactive, and slightly absurd.",
      },
      {
        title: "Emergent card relationships",
        description: "Dragging one card onto another produces weighted outcomes that model work, investment, and social behavior.",
        details: "For example, investing a Coin in an Indie Game may produce profit, public opinion, or nothing. Each card’s input, output, amount, and probability are configured as ScriptableObjects, allowing new relationships to be authored without changing the core interaction code.",
      },
      {
        title: "Leadership and delivery",
        description: "I led communication and asset coordination, translating game needs into a shared production list for the art team.",
        details: "Asset descriptions were tracked in a spreadsheet and delivered through the team’s communication channel. The finished project received a 500-yuan prize, which I divided across the group—a small but meaningful conclusion to the team’s work.",
      },
    ];
    return project.gallery.map((image, index) => ({ id: `alive-${index}`, ...explanations[index], image: image.src, imageAlt: image.alt }));
  }

  if (project.id === "top-hotpot" && project.gallery) {
    const explanations = [
      {
        title: "A hotpot rebuilt for VR",
        description: "Players place raw ingredients into the broth, retrieve them when cooked, and learn each ingredient’s timing and overcook tolerance through direct interaction.",
        details: "The project revisits an earlier 2D experimental design in a spatial format. Hiding food beneath the soup combines timing with searching, while slow drifting makes the uncertainty feel natural instead of arbitrary.",
      },
      {
        title: "Cooking state and boiling motion",
        description: "Ingredient behavior is driven by data, elapsed cooking time, and a lightweight approximation of movement in boiling water.",
        details: "Food objects read their cooking information from a data table. A constant buoyancy force and periodic randomized impulses keep them moving after release, and material color interpolates across cooking thresholds to provide readable state feedback.",
      },
      {
        title: "Water, steam, bubbles, and food assets",
        description: "The presentation combines a tiled liquid material with particle systems for steam and bubbles.",
        details: "Polar-coordinate tiling and a normal map help the plane read as disturbed hotpot broth. Most ingredients and tableware were modeled in Blender, keeping the stylized asset language consistent across the VR scene.",
      },
    ];
    return project.gallery.map((image, index) => ({ id: `hotpot-${index}`, ...explanations[index], image: image.src, imageAlt: image.alt }));
  }

  if (project.id === "tactics-design" && project.gallery) {
    const explanations = [
      {
        title: "System map and design goals",
        description: "The living document connects the hunting loop, showdown rules, resources, events, and progression so each feature can be evaluated against the intended experience.",
        details: "The project is inspired by Kingdom Death: Monster but is not a direct digital conversion. Its goal is to preserve pressure, preparation, and consequence while building a format suited to a smaller digital tactical game. The current GitHub vault is the source of truth; Notion remains available as a legacy archive.",
      },
      {
        title: "From reference to prototype",
        description: "The document records the reference, the intended emotional structure, and the parts selected for early gameplay validation.",
        details: "Rather than perfecting rules only on paper, I now move uncertain mechanics into playable slices. The Hunt in Darkness prototype is the current validation surface for the hunting phase, resource preparation, card actions, and showdown rhythm.",
      },
      {
        title: "Rules and balance model",
        description: "Combat actions, monster behavior, hunting events, and resource expectations are expressed as explicit, testable rules.",
        details: "Expected-value calculations establish an initial difficulty target for Food Stock, Target Tokens, Preparedness, and Wounds. Playtests then challenge those assumptions, revealing where probabilities, pacing, or player understanding need revision.",
      },
      {
        title: "Implementation as design evidence",
        description: "The prototype’s data tools, animation flow, and visual pipeline turn document claims into observable behavior.",
        details: "Authoring tools make event outcomes easy to modify, while the playable card flow exposes timing and comprehension problems that prose alone cannot reveal. This implementation evidence is fed back into the design vault as the next iteration begins.",
      },
    ];
    return project.gallery.map((image, index) => ({ id: `tactics-${index}`, ...explanations[index], image: image.src, imageAlt: image.alt }));
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
  if (item.image) return <Image src={assetPath(item.image)} alt={item.imageAlt ?? item.title} width={1600} height={1000} sizes="(max-width: 760px) 96vw, 58vw" unoptimized />;
  return <ProjectVisual project={project} />;
}

function ProjectBoard({ project, items, selectedIndex, displayedIndex, onSelect }: { project: Project; items: BoardItem[]; selectedIndex: number | null; displayedIndex: number; onSelect: (index: number | null) => void }) {
  const selectedItem = selectedIndex === null ? null : items[selectedIndex];
  const displayedItem = items[displayedIndex];

  return (
    <div className="project-board-shell">
      <div className={`project-board ${selectedItem ? "is-detail" : "is-preview"}`}>
        <div className="board-toolbar">
          <span>PROJECT_BOARD / {project.index}</span>
          <span>{items.length} ITEM{items.length === 1 ? "" : "S"}</span>
        </div>

        <div className="board-stage">
          <div className={`board-preview-grid board-count-${Math.min(items.length, 4)}`} aria-hidden={selectedItem ? true : undefined} inert={selectedItem ? true : undefined}>
            {items.map((item, index) => (
              <button className={`board-item ${item.image ? "" : "board-vector-item"}`} type="button" key={item.id} onClick={() => onSelect(index)} aria-label={`Enlarge image: ${item.title}`}>
                <div className="board-artwork"><BoardArtwork item={item} project={project} /></div>
                <span><b>FIG. {String(index + 1).padStart(2, "0")}</b>{item.title}</span>
              </button>
            ))}
            <p className="board-hint">SELECT IMAGE TO INSPECT</p>
          </div>
          <div className="board-detail" aria-hidden={!selectedItem} inert={!selectedItem}>
            <button className="board-back" type="button" onClick={() => onSelect(null)} aria-label="Back to project board">
              <span aria-hidden="true">←</span> BACK TO BOARD
            </button>
            <div className={`board-detail-media ${displayedItem.image ? "" : "is-vector"}`}><BoardArtwork item={displayedItem} project={project} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const boardItems = getBoardItems(project);
  const [selectedBoardIndex, setSelectedBoardIndex] = useState<number | null>(null);
  const [displayedBoardIndex, setDisplayedBoardIndex] = useState(0);
  const selectedBoardItem = selectedBoardIndex === null ? null : boardItems[displayedBoardIndex];
  const displayedBoardItem = boardItems[displayedBoardIndex];
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

  function selectBoardItem(index: number | null) {
    if (index !== null) setDisplayedBoardIndex(index);
    setSelectedBoardIndex(index);
  }

  return (
    <article id={`project-${project.id}`} ref={cardRef} className="project-card uniform-project-card focus-frame" onPointerEnter={cacheCardBounds} onPointerMove={trackCardPointer}>
      <div className={`project-copy ${selectedBoardItem ? "is-detail" : "is-overview"}`}>
        <div className="project-copy-stage">
          <div className="project-copy-panel project-copy-overview" aria-hidden={selectedBoardItem ? true : undefined} inert={selectedBoardItem ? true : undefined}>
            <div className="project-meta"><span>{project.index}</span><span>{project.year}</span></div>
            <p className="project-eyebrow">{project.eyebrow}</p>
            <h3>{project.title}</h3>
            <p className="project-description">{project.description}</p>
            {project.details && <p className="project-details">{project.details}</p>}
            <ul className="tag-list" aria-label={`${project.title} technologies and disciplines`}>
              {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
            <div className="project-links">
              {project.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer"><span className="hover-shift-label"><span>{link.label}</span><span aria-hidden="true">↗</span></span></a>)}
            </div>
          </div>
          <section className="project-copy-panel project-copy-detail" aria-label={`Details for ${displayedBoardItem.title}`} aria-hidden={!selectedBoardItem} inert={!selectedBoardItem}>
            <div className="project-meta"><span>FIG. {String(displayedBoardIndex + 1).padStart(2, "0")}</span><span>MEDIA DETAIL</span></div>
            <p className="project-eyebrow">{project.title} / SELECTED MEDIA</p>
            <h3>{displayedBoardItem.title}</h3>
            <p className="project-description">{displayedBoardItem.description}</p>
            {displayedBoardItem.details && <p className="project-details">{displayedBoardItem.details}</p>}
            <div className="project-detail-context"><span>PROJECT</span><strong>{project.title}</strong></div>
          </section>
        </div>
      </div>
      <ProjectBoard project={project} items={boardItems} selectedIndex={selectedBoardIndex} displayedIndex={displayedBoardIndex} onSelect={selectBoardItem} />
    </article>
  );
}

function TopographicField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const drawingContext = canvasElement.getContext("2d");
    if (!drawingContext) return;
    const canvas: HTMLCanvasElement = canvasElement;
    const context: CanvasRenderingContext2D = drawingContext;

    const [red, green, blue] = [232, 156, 78];
    let resizeFrame = 0;
    let resizeTimer = 0;
    const parentSurface = canvas.parentElement;
    if (!parentSurface) return;
    const surface: HTMLElement = parentSurface;

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
      const surfaceRect = surface.getBoundingClientRect();
      const width = Math.max(1, Math.ceil(surfaceRect.width));
      const height = Math.max(window.innerHeight, Math.ceil(surfaceRect.height));
      const maximumCanvasPixels = 14_000_000;
      const maximumCanvasDimension = 16_384;
      const ratioForPixelBudget = Math.sqrt(maximumCanvasPixels / (width * height));
      const ratioForDimension = maximumCanvasDimension / Math.max(width, height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5, ratioForPixelBudget, ratioForDimension);
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
      canvas.dataset.worldWidth = `${width}`;
      canvas.dataset.worldHeight = `${height}`;
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

    const resizeAfterLayoutSettles = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 180);
    };

    const resizeObserver = new ResizeObserver(resizeAfterLayoutSettles);
    renderContours();
    resizeObserver.observe(surface);
    window.addEventListener("resize", resize, { passive: true });
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.clearTimeout(resizeTimer);
      window.cancelAnimationFrame(resizeFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="topographic-canvas" aria-hidden="true" />;
}

function Navigation({ page, navRef }: { page: PageId; navRef: RefObject<HTMLElement | null> }) {
  return (
    <header className="site-header nav-visible at-page-top" ref={navRef}>
      <Link className="brand" href="/" prefetch aria-label="Leon Zhou portfolio home"><span className="brand-mark">LZ</span><span className="brand-label">PORTFOLIO / 2026</span></Link>
      <nav className="header-links" aria-label="Primary navigation">
        <Link href="/" prefetch aria-current={page === "home" ? "page" : undefined}><span className="hover-shift-label">Home</span></Link>
        {tabs.map((tab) => <Link key={tab.id} href={tab.path} prefetch aria-current={page === tab.id ? "page" : undefined}><span className="hover-shift-label">{tab.id === "technical" ? "Technical" : tab.id === "games" ? "Games" : "Design"}</span></Link>)}
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
      <div className="footer-links"><button className="footer-copy" type="button" onClick={copyEmail}><span className="hover-shift-label"><span>leonzhouziang@gmail.com</span><small aria-live="polite">{copyStatus}</small></span></button><a href="https://github.com/Hubr1zz" target="_blank" rel="noreferrer"><span className="hover-shift-label"><span>GitHub</span><span aria-hidden="true">↗</span></span></a><a href="https://leon-zhou.itch.io/" target="_blank" rel="noreferrer"><span className="hover-shift-label"><span>Itch.io</span><span aria-hidden="true">↗</span></span></a><a href="https://52ccdc57-ad3f-47d6-9b83-c35f8ad2c41f.filesusr.com/ugd/2967e1_9d3e636f150d4a08a49e78ff06525b6a.pdf" target="_blank" rel="noreferrer"><span className="hover-shift-label"><span>Résumé</span><span aria-hidden="true">↗</span></span></a></div>
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
          <Link className="portal-card portal-technical focus-frame" href="/technical#project-zworkflow" prefetch><span>01 / TECHNICAL</span><h3>zWorkFlow</h3><p>An AI-assisted production workflow that turns design intent into reviewable changes, implementation, and traceable project knowledge.</p><strong>OPEN PROJECT ↗</strong></Link>
          <Link className="portal-card portal-design focus-frame" href="/design#project-tactics-design" prefetch><span>02 / DESIGN</span><h3>Tactical Game Design Document</h3><p>An evolving systems-design project exploring preparation, pressure, progression, and consequence in a tactical game structure.</p><strong>OPEN PROJECT ↗</strong></Link>
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
      if (reduceMotion && shellRef.current) {
        shellRef.current.style.setProperty("--pointer-page-x", `${target.x + window.scrollX}px`);
        shellRef.current.style.setProperty("--pointer-page-y", `${target.y + window.scrollY}px`);
      }
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
        shell.style.setProperty("--pointer-page-x", `${(current.x + window.scrollX).toFixed(2)}px`);
        shell.style.setProperty("--pointer-page-y", `${(current.y + window.scrollY).toFixed(2)}px`);
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
    <main ref={shellRef} className={`site-shell page-${page} theme-amber`} style={{ "--pointer-x": "72vw", "--pointer-y": "24vh", "--pointer-page-x": "72vw", "--pointer-page-y": "24vh", "--pointer-rx": ".22", "--pointer-ry": "-.26" } as CSSProperties}>
      <div className="ambient-grid" aria-hidden="true" />
      <div className="ambient-scan" aria-hidden="true" />
      <TopographicField />
      <Navigation page={page} navRef={navRef} />
      {page === "home" ? <HomePage /> : <WorkPage key={page} page={page} />}
      <Footer />
    </main>
  );
}
