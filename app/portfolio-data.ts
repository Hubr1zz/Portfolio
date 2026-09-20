export type TabId = "technical" | "games" | "design";
export type PageId = "home" | TabId;
export type ProjectLink = { label: string; href: string };
export type Project = {
  id: string;
  index: string;
  title: string;
  eyebrow: string;
  year: string;
  description: string;
  details?: string;
  tags: string[];
  links: ProjectLink[];
  articles?: { id: string; title: string; summary: string; href: string; language: string }[];
  image?: string;
  imageAlt?: string;
  gallery?: { src: string; alt: string }[];
  visual?: "workflow" | "interaction" | "editor" | "prototype";
  featured?: boolean;
  tier?: "release" | "study";
};
export type DiagramId = "workflow-lifecycle" | "workflow-knowledge" | "interaction-routing" | "interaction-typed" | "workflow-overview" | "editor-overview" | "editor-navigation" | "editor-scene" | "vault-map" | "vault-loop";
export type BoardItem = {
  id: string;
  title: string;
  description: string;
  details?: string;
  href?: string;
  linkLabel?: string;
  image?: string;
  imageAlt?: string;
  diagram?: DiagramId;
  visual?: boolean;
};

export const tabs: { id: TabId; label: string; count: string; description: string; path: string }[] = [
  {
    id: "technical",
    label: "Technical Projects",
    count: "05",
    description: "Production tools, gameplay architecture, procedural motion, and real-time rendering studies.",
    path: "/technical",
  },
  {
    id: "games",
    label: "Game Projects",
    count: "05",
    description: "Playable prototypes, game-jam productions, and systems-led experiments where design decisions were validated through implementation.",
    path: "/games",
  },
  {
    id: "design",
    label: "Design Projects",
    count: "03",
    description: "System design documents, comparative analysis, and an evolving library of design breakdowns.",
    path: "/design",
  },
];

export const projects: Record<TabId, Project[]> = {
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
        "A composable Unity interaction layer that routes focus, click, and drag across 3D objects and UGUI through one target contract.",
      details:
        "Reusable Behaviour classes separate interaction logic from scene containers. Typed target callbacks, configurable input phases, UI pointer arbitration, and drag thresholds keep the input paths explicit.",
      tags: ["Unity", "C#", "UGUI", "Architecture"],
      links: [{ label: "GitHub repository", href: "https://github.com/Hubr1zz/InteractionSystem" }],
      visual: "interaction",
      tier: "release",
    },
    {
      id: "editor-tools",
      index: "03",
      title: "Unity Editor Tools",
      eyebrow: "Editor extensions & workflow adaptations",
      year: "2026",
      description:
        "Two installable Unity packages: a customized editor workspace and optional tools for Scene View navigation and saved hierarchy state.",
      details:
        "My focus is reducing context switching through shared settings, component tabs, and scene navigation. The zEditor package adapts vFavorites, vFolders, vHierarchy, vInspector, and vTabs; those foundations are credited to their original author.",
      tags: ["Unity 2022.3+", "Editor UX", "UPM"],
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
        "A living Obsidian design vault connecting the hunt, showdown, and settlement into a game about risk, preparation, and lasting consequences.",
      details:
        "I maintain this evolving game design as a local Obsidian vault, with linked Markdown rules, a terminology index, reference collections, and a visible revision history. The repository documents design intent and open questions; the separate playable prototype is one experiment around it.",
      tags: ["Systems Design", "Obsidian", "Linked Documentation", "Card & dice"],
      links: [
        { label: "GitHub design document", href: "https://github.com/Hubr1zz/GameDesignVault" },
        { label: "Legacy Notion document", href: "https://www.notion.so/leonzhouziang/KDM-inspired-tactic-game-design-63affac2d3d843b5bad6e01835a1fba1?p=2a0ca75016908091a97ac2a359c6e375&pm=s" },
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
      articles: [
        {
          id: "elden-ring",
          title: "Elden Ring and the Souls-like formula",
          summary: "A comparative essay on how Elden Ring changes the relationship between challenge, exploration, and the players a Souls-like game invites.",
          href: "https://docs.qq.com/doc/DWkdJTnVvUURTRHpU",
          language: "Mandarin",
        },
        {
          id: "lol-dota",
          title: "League of Legends / Dota: systems and strategy",
          summary: "A side-by-side reading of how differences in rules and constraints shape strategic decisions, player behavior, and each game’s identity.",
          href: "https://docs.qq.com/doc/DWm5td0ZHUVBDem9v",
          language: "Mandarin",
        },
      ],
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

export const flatProjects = (Object.entries(projects) as [TabId, Project[]][]).flatMap(([category, categoryProjects]) => categoryProjects.map((project) => ({ ...project, category })));

export function getProjectBySlug(slug: string) {
  return flatProjects.find((project) => project.id === slug);
}
export function getBoardItems(project: Project): BoardItem[] {
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
        details: "Generic interface mappings are discovered and cached at startup, so target relationships do not need to be rediscovered for each interaction. The current dispatcher invokes those cached methods to deliver typed callbacks.",
        diagram: "interaction-typed",
      },
      {
        id: "input-control",
        title: "Input, targeting, and control",
        description: "Pressed, Held, and Released bindings make input phases explicit across 3D targets and the Unity EventSystem for UI.",
        details: "Configurable drag thresholds keep movement intentional. A nonalloc raycast runs first, with a spherecast fallback; the currently dragged object is skipped, and global or per-object behaviours can be toggled as needed.",
      },
      {
        id: "integration-status",
        title: "Integration notes",
        description: "The upstream project describes the basic functions as working while broader testing continues.",
        details: "The author prefers Odin for configuration. The repository provides useful implementation evidence, but this portfolio does not claim the system is production-hardened.",
      },
    ];
  }

  if (project.id === "editor-tools") {
    return [
      {
        id: "editor-navigation",
        title: "A workspace that stays within reach",
        description: "Favorites open a quick popup from a configurable Space, Alt, or Tab shortcut, while folders and hierarchy colors and icons keep projects legible.",
        details: "Inspector component tabs, multiselect support, and floating panels keep related work visible. The unified Tools/EditorTools/Settings menu provides the configuration surface, and the model preview background is configurable. Version 0.1.5 includes the September 16 toolbar fix, and the adaptations are based on the vSeries tools.",
        diagram: "editor-navigation",
        href: "https://github.com/Hubr1zz/UnityEditorTools/blob/main/zEditor%28vSeries%29/readme.txt",
        linkLabel: "Features & original-tool credits",
      },
      {
        id: "editor-scene",
        title: "Scene tools as an independent package",
        description: "CameraFollow and LookAt Scene View overlays provide focused navigation, with the selected object available as the rotation root.",
        details: "The package also saves and loads expansion state for Scene, Prefab, and Project folders. Scene Tools can be installed independently from the zEditor workspace package in the same repository.",
        diagram: "editor-scene",
        href: "https://github.com/Hubr1zz/UnityEditorTools/tree/main/SceneTools",
        linkLabel: "Explore Scene Tools",
      },
    ];
  }

  if (project.id === "tactics-design") {
    const repositoryUrl = "https://github.com/Hubr1zz/GameDesignVault";
    const historyUrl = "https://github.com/Hubr1zz/GameDesignVault/blob/master/%E4%BF%AE%E6%94%B9%E5%8E%86%E5%8F%B2.md";
    return [
      {
        id: "vault-structure",
        title: "A navigable design vault",
        description: "I organize the vault around three playable phases—Hunt, Showdown, and Settlement—supported by shared rules for hunters, events, items, and keywords.",
        details: "Design principles and world settings establish the premise. A separate glossary, inspiration library, art references, content examples, to-do list, and edit history make the surrounding reasoning easy to find.",
        diagram: "vault-map",
        href: repositoryUrl,
        linkLabel: "Browse the Obsidian vault",
      },
      {
        id: "phase-loop",
        title: "Three phases, one consequence loop",
        description: "I use the hunt to frame preparation and uncertainty, the showdown to concentrate tactical decisions, and the settlement to carry consequences into the next expedition.",
        details: "The document gives maps, combat and monster behavior, action cards, timelines, inventions, and the workshop their own homes. This separation lets me develop each system while keeping its connection to the wider loop visible.",
        diagram: "vault-loop",
      },
      {
        id: "design-principles",
        title: "Make weakness part of the strategy",
        description: "I want setbacks to change how a hunter is played. The design principles explore both overcoming a negative trait and internalizing it, preserving its drawback while opening a new advantage.",
        details: "For example, a timid hunter could lose strength but gain evasion. Conditional event options and equipment keywords extend that thinking: the interesting question is what a limitation makes possible. These are design proposals, not claims of a finished balance model.",
        href: "https://github.com/Hubr1zz/GameDesignVault/blob/master/%E8%AE%BE%E8%AE%A1%E6%96%87%E6%A1%A3/Design%20Essentials%20%26%20Challenges.md",
        linkLabel: "Read the design principles",
      },
      {
        id: "decisions",
        title: "Commitment, coordination, and uncertainty",
        description: "I am exploring card-and-dice combat where the order of hunters’ actions matters to the group. The June design history also records a limited thought-area resource, three colors of combat inspiration, and choices about replacing or expanding that resource.",
        details: "I keep alternatives and unresolved questions visible in the inspiration collection. Ideas such as passing actions between hunters or giving bosses distinct timing patterns stay recognizable as proposals until they are resolved into formal rules.",
        href: historyUrl,
        linkLabel: "Follow the design history",
      },
      {
        id: "continuity",
        title: "A settlement with a memory",
        description: "I want players to care about a camp beyond the strength of one character. The principles explore relationships, named hunters, disappearances, and later discoveries that turn loss into a continuing story.",
        details: "They also identify a hard design problem: frequent death can create a downward spiral. Recruitment pacing and benefits for survivors are candidate responses; documenting both the intended emotion and the risk keeps that trade-off explicit.",
      },
      {
        id: "maintenance",
        title: "From scattered references to linked knowledge",
        description: "I maintain formal rules, inspirations, and content examples separately. A glossary gives recurring terms one definition, while Obsidian links and the overview canvas help me move between related systems.",
        details: "The June and July revision entries show the maintenance work: rebuilding system entry points, completing terminology, and standardizing inspiration types and related links. This makes the vault easier to revise as the design grows.",
        href: historyUrl,
        linkLabel: "View revisions",
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
