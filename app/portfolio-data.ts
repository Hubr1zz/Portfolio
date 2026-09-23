export type TabId = "technical" | "games" | "design";
export type PageId = "home" | TabId;
export type ProjectLink = { label: string; href: string };
export type ProjectAttribution = { title: string; text: string; links: ProjectLink[] };
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
  attribution?: ProjectAttribution;
  articles?: { id: string; title: string; summary: string; href: string; language: string; status?: "draft" }[];
  image?: string;
  imageAlt?: string;
  gallery?: { src: string; alt: string }[];
  visual?: "workflow" | "interaction" | "editor" | "prototype";
  featured?: boolean;
  tier?: "release" | "study";
};
export type DiagramId = "workflow-bridge" | "workflow-lifecycle" | "workflow-knowledge" | "workflow-governance" | "interaction-routing" | "interaction-state" | "interaction-context" | "workflow-overview" | "editor-overview" | "editor-navigation" | "editor-inspector" | "editor-scene" | "locomotion-search" | "locomotion-gait" | "vault-map" | "vault-loop" | "vault-structure" | "vault-ai-flow" | "action-chain-overview" | "action-chain-lifecycle" | "action-chain-composite" | "action-chain-reactors" | "action-chain-insertion";
export type BoardItem = {
  id: string;
  title: string;
  description: string;
  details?: string;
  bullets?: { title: string; text: string }[];
  layout?: "features" | "prose";
  sources?: ProjectLink[];
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
    count: "06",
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
        "An AI workflow that bridges and manages game design documents and game projects, keeping design decisions, implementation plans, and code evidence connected.",
      details:
        "The system coordinates multiple AI coding tools around one source of truth, keeps design intent separate from implementation, and exposes dependency graphs, blockers, and change history through a Unity-based workbench.",
      tags: ["Unity", "OpenSpec", "Tooling", "Bilingual"],
      links: [{ label: "GitHub repository", href: "https://github.com/Hubr1zz/zWorkFlow" }],
      visual: "workflow",
      featured: true,
      tier: "release",
    },
    {
      id: "action-chain-weaver",
      index: "02",
      title: "ActionChainWeaver",
      eyebrow: "Reactive action orchestration for Unity",
      year: "2026",
      description:
        "A Unity framework for strongly ordered resolution, branching action chains, and runtime injection, modification, or prevention—problems common in card games.",
      details:
        "A root FIFO and per-chain deque replace recursive execution. Composite actions yield children and continuations, while scoped Reactors can observe, modify, prevent, or extend the flow without coupling every effect to the original action.",
      tags: ["Unity", "C#", "Gameplay Architecture", "Card Games"],
      links: [{ label: "GitHub repository", href: "https://github.com/Hubr1zz/ActionChainWeaver" }],
      tier: "release",
    },
    {
      id: "interaction",
      index: "03",
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
      index: "04",
      title: "Unity Editor Tools",
      eyebrow: "Editor extensions & workflow adaptations",
      year: "2026",
      description:
        "I reworked Favorites and extended Inspector workflows in a customized editor workspace, with Scene Tools as an independent companion package.",
      tags: ["Unity 2022.3+", "Editor UX", "UPM"],
      links: [{ label: "GitHub repository", href: "https://github.com/Hubr1zz/UnityEditorTools" }],
      attribution: {
        title: "Built on vSeries",
        text: "My work extends the original vSeries tools: Favorites interaction and interface changes, Inspector workflows, and compatibility updates. The original plugins remain the foundation—please support their author.",
        links: [
          { label: "vFavorites2", href: "https://assetstore.unity.com/packages/tools/utilities/vfavorites-2-263643" },
          { label: "vFolders2", href: "https://assetstore.unity.com/packages/tools/utilities/vfolders-2-255470" },
          { label: "vHierarchy2", href: "https://assetstore.unity.com/packages/tools/utilities/vhierarchy-2-253397" },
          { label: "vInspector2", href: "https://assetstore.unity.com/packages/tools/utilities/vinspector-2-252297" },
          { label: "vTabs2", href: "https://assetstore.unity.com/packages/tools/utilities/vtabs-2-253396" },
        ],
      },
      visual: "editor",
      tier: "study",
    },
    {
      id: "procedural-motion",
      index: "05",
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
      index: "06",
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
      year: "Ongoing",
      description:
        "A long-term independent game project in active development, maintained in Obsidian as a 30,000-word design document.",
      details:
        "The vault develops the game from its pillars and art direction through the hunt, showdown, settlement, and detailed mechanics, while keeping inspirations, references, examples, terminology, and AI-assisted maintenance clearly separated.",
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
      year: "Ongoing",
      description:
        "Short-form essays examining how games position themselves, screen players, and produce different strategic behaviors through small systemic changes.",
      details:
        "A growing essay collection with completed essays and work in progress across comparative game analysis, champion identity, and system design.",
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
        {
          id: "league-of-legends-design",
          title: "League of Legends Design",
          summary: "A critique of champion identity, gameplay fantasy, and passive-ability differentiation, with proposals for clearer synergy between abilities.",
          href: "https://leonzhouziang.notion.site/League-of-Legends-Design-37cca75016908037a9f0de4373febf4f",
          language: "English",
        },
        {
          id: "delta-force-operations",
          title: "Delta Force: improving Operations",
          summary: "A work-in-progress comparison of Delta Force and Escape from Tarkov, examining combat feel, player skill, map flow, and the trade-offs between fighting and looting.",
          href: "https://leonzhouziang.notion.site/3bcca75016908087918ee4822ddd7aed?pvs=73",
          language: "Mandarin",
          status: "draft",
        },
      ],
      links: [
        { label: "Elden Ring essay", href: "https://docs.qq.com/doc/DWkdJTnVvUURTRHpU" },
        { label: "LoL / Dota essay", href: "https://docs.qq.com/doc/DWm5td0ZHUVBDem9v" },
        { label: "League of Legends Design", href: "https://leonzhouziang.notion.site/League-of-Legends-Design-37cca75016908037a9f0de4373febf4f" },
        { label: "Delta Force: improving Operations", href: "https://leonzhouziang.notion.site/3bcca75016908087918ee4822ddd7aed?pvs=73" },
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
        id: "system-bridge",
        title: "One workflow between design documents and the game project",
        description: "In one sentence: zWorkFlow is an AI coordination layer that keeps design intent, implementation plans, and code evidence connected instead of letting each tool build its own version of the project.",
        details: "Design documents remain the creative source, the game repository remains the implementation source, and OpenSpec records the reviewed contract between them. The workflow does not replace Codex, Claude Code, Cursor, or Unity; it gives those tools shared project memory, explicit approval gates, and a common view of what is proposed, implemented, blocked, or stale.",
        diagram: "workflow-bridge",
        sources: [{ label: "Workflow overview", href: "https://github.com/Hubr1zz/zWorkFlow/blob/main/WORKFLOW_OVERVIEW.md" }],
      },
      {
        id: "design-intake",
        title: "Turning a design document into reviewable work",
        description: "A design import reads the relevant documents and nearby code, then separates a broad idea into modules that can be understood, approved, and verified independently.",
        details: "Each module becomes a Draft Change containing its goal, rule deltas, dependencies, gaps, review questions, and expected tasks. Existing records are reused instead of duplicated, ordinary utilities stay out of the graph unless they define a shared contract, and the original design document is never silently rewritten during intake.",
        diagram: "workflow-lifecycle",
      },
      {
        id: "governed-lifecycle",
        title: "Approval, implementation, sync, and archive stay separate",
        description: "The lifecycle deliberately prevents an AI implementation from becoming the project specification merely because code was written.",
        details: "A person first promotes a Draft into an approved Change. Apply modifies code and records validation inside that Change, while sync later performs a three-way comparison between the Change baseline, the current formal Spec, and its delta. Only completed and synchronized work can be archived, preserving the proposal, decisions, implementation evidence, and final contract as one traceable history.",
        diagram: "workflow-governance",
      },
      {
        id: "shared-context",
        title: "Many AI tools, one project context",
        description: "Codex, Claude Code, Cursor, Copilot, Gemini CLI, Windsurf, and Kimi share the same Skills, OpenSpec records, project facts, and code evidence.",
        details: "Tool-specific folders contain only thin adapters rather than copied workflows. A task therefore keeps the same domain rules and project state when another team member or AI tool continues it, while member preferences remain separate from team rules and do not overwrite the project contract.",
        diagram: "workflow-knowledge",
      },
      {
        id: "workbench-evidence",
        title: "The Workbench makes project state inspectable",
        description: "The Unity Workbench turns workflow files into an operational view of imports, Specs, Changes, dependencies, blockers, translations, and implementation evidence.",
        bullets: [
          { title: "Relationship graph", text: "System, Feature, and Change nodes expose dependencies, pending deltas, active implementation, and blocking paths instead of hiding them in separate documents." },
          { title: "Evidence status", text: "Code references are marked valid, modified, missing, or stale so approval and implementation are based on current files rather than remembered claims." },
          { title: "Engineering capabilities", text: "Plugins, reusable Architecture, and project Systems are catalogued with evidence and constraints; locked Architecture requires confirmation before an agent changes it." },
          { title: "Bilingual display", text: "One authoritative Spec keeps stable IDs, while block-level hashes prevent stale translations from being shown after the source changes." },
        ],
        layout: "features",
        diagram: "workflow-governance",
      },
    ];
  }

  if (project.id === "action-chain-weaver") {
    return [
      {
        id: "problem",
        title: "One sentence: turn a growing game flow into an explicit action chain",
        description: "A card-game attack is rarely one function call: it may select a target, perform a check, deal damage, trigger healing or a counterattack, wait for input, and create still more actions.",
        details: "ActionChainWeaver breaks that flow into small GameActions and lets a non-recursive queue resolve them one at a time. A Root Action owns the complete request, a Chain records its causal descendants, Composite Actions describe multi-step control flow, and Reactors observe or alter individual nodes without hard-wiring every possible effect into the original action.",
        diagram: "action-chain-overview",
      },
      {
        id: "lifecycle",
        title: "Exactly when a Reactor can affect an Action",
        description: "Every Action crosses two reaction windows: BeforeExecution runs before gameplay logic and may modify or prevent it; AfterResolved runs only after the Action has an explicit outcome.",
        details: "The Engine first takes an Action.Before work item, collects matching BeforeExecution Reactors, and executes them in deterministic order. A prevented Action skips Execute but still resolves as Prevented and enters AfterResolved. Otherwise a normal Action runs ExecuteAsync, or a Composite emits its next child. After the outcome becomes Succeeded, Failed, Prevented, or Cancelled, AfterResolved Reactors may observe that fact and enqueue follow-up work.",
        diagram: "action-chain-lifecycle",
      },
      {
        id: "composite",
        title: "Composite Actions grow the flow without recursive execution",
        description: "A parent such as AttackAction yields one child at a time and places its own continuation behind that child in the same work deque.",
        details: "For an attack, the queue expands into Check.Before followed by Attack.Continuation. When the check finishes, the continuation reads the child outcome and either emits Damage.Before plus another continuation, or resolves the parent. Nested Composites repeat the same queue protocol, so deep action trees do not add C# call-stack depth and every child remains visible to Reactors and the debugger.",
        diagram: "action-chain-composite",
      },
      {
        id: "reactors",
        title: "Which Reactors are collected for this specific Action",
        description: "Reactor scope answers where a rule comes from; timing, action type, Matches, and ReactionGate decide whether it actually runs now.",
        details: "The registry gathers global rules, Source and Target entity rules, Chain rules, inherited subtree or descendant rules, and local rules. It then filters by Before/After timing and observed Action type, applies gameplay conditions and external suppression, and sorts by type specificity, priority, then registration order. An attack against a Boss therefore collects the Hero’s Source effects and that Boss’s Target effects, while attacking a Slime never triggers the Boss’s Reactors.",
        diagram: "action-chain-reactors",
      },
      {
        id: "insertion",
        title: "A reaction chooses where its derived Action enters the chain",
        description: "Immediate work runs before the parent continuation; bottom work waits behind the chain’s existing nodes.",
        details: "Counterattacks, thorns, and other effects that must resolve now use EnqueueImmediate at the deque head. Deferred cleanup or effects that should wait for the current local flow use EnqueueToBottom at the tail. Both remain inside the same causal Chain, inherit the appropriate subtree Reactors, and are visible in the same deterministic trace.",
        diagram: "action-chain-insertion",
      },
      {
        id: "outcomes",
        title: "Outcomes, presentation, safety, and debugging remain separate",
        description: "The framework keeps gameplay facts, visual projection, infrastructure invariants, and diagnostic recording in distinct layers so none can masquerade as another gameplay response.",
        bullets: [
          { title: "Four outcomes", text: "Succeeded, Failed, Prevented, and Cancelled distinguish rule failure from pre-emptive blocking and player cancellation." },
          { title: "Presentation boundary", text: "Animations, audio, and floating text are requests in a separate PresentationSystem; an action chooses whether to await their real lifecycle." },
          { title: "Infrastructure guards", text: "Non-negotiable engine invariants run before enqueue and cannot be suppressed by a gameplay Buff or ReactionGate." },
          { title: "Loop protection", text: "A per-chain action budget stops direct and indirect response loops, records the recent causal trace, and lets the next Root request continue." },
          { title: "Visual debugger", text: "The Unity Editor window exposes root requests, the work deque, registered Reactors, causal trees, outcomes, breakpoints, and step-through execution." },
        ],
        layout: "features",
        sources: [
          { label: "ActionQueue guide", href: "https://github.com/Hubr1zz/ActionChainWeaver/blob/main/ActionQueue/GETTING_STARTED.md" },
          { label: "PresentationSystem guide", href: "https://github.com/Hubr1zz/ActionChainWeaver/blob/main/Presentation/README.md" },
        ],
      },
    ];
  }

  if (project.id === "interaction") {
    return [
      {
        id: "unified-routing",
        title: "One interaction state machine for 3D objects and UGUI",
        description: "In one sentence: a single InteractionSystem turns Physics and GraphicRaycaster hits into the same Hover, Click, Drag, and Drop lifecycle.",
        details: "The system resolves the top UI Graphic and the nearest valid 3D Collider into an InteractableObject, then evaluates both through one deterministic dispatcher. Scene objects therefore do not need separate input logic merely because one lives in world space and another lives on a Canvas.",
        diagram: "interaction-routing",
      },
      {
        id: "pointer-state",
        title: "Press capture keeps the lifecycle deterministic",
        description: "Once the pointer goes down, the original object owns that press until release or cancellation—even if the cursor leaves a small target.",
        details: "Hover is updated from the current hit, but Pressed stores the captured object and position. Movement beyond the configured threshold promotes the interaction into Dragging; otherwise a release inside the original target becomes Click. Release, disable, destruction, focus loss, pause, and system shutdown each take an explicit path so no object remains stuck in a hovered or dragged state.",
        diagram: "interaction-state",
      },
      {
        id: "behaviour-context",
        title: "Composable Behaviours communicate through one context",
        description: "An InteractableObject contains multiple ordinary serialized Behaviours instead of requiring a new MonoBehaviour for every interaction effect.",
        details: "Each Behaviour opts into focused interfaces such as hover, click, drag, or drop. InteractionContext carries the pointer phase, current hit, captured source, and candidate drop target, so a card slot can query the dragged card’s Behaviour or Component without the dispatcher knowing their game-specific types. Global and per-category switches can disable behaviour without changing the state machine.",
        diagram: "interaction-context",
      },
      {
        id: "targeting-safety",
        title: "Targeting, lifecycle safety, and the hot path",
        description: "The package makes scene dependencies and cancellation behaviour explicit while keeping per-frame targeting predictable.",
        bullets: [
          { title: "Explicit scene references", text: "The interaction camera is assigned in the Inspector or through an API; the package does not silently search for Main Camera." },
          { title: "Intentional dragging", text: "A configurable distance threshold separates click from drag, and drop candidates receive enter, over, exit, acceptance, and final drop callbacks." },
          { title: "Predictable cleanup", text: "Disable, destroy, focus loss, pause, and shutdown generate cancellation or exit callbacks instead of abandoning captured state." },
          { title: "Lean dispatch", text: "The hot path avoids LINQ, generic reflection, and MethodInfo.Invoke; Behaviour lists and interface routing stay explicit." },
        ],
        layout: "features",
        sources: [{ label: "InteractionSystem README", href: "https://github.com/Hubr1zz/InteractionSystem" }],
      },
    ];
  }

  if (project.id === "editor-tools") {
    return [
      {
        id: "editor-navigation",
        title: "Reworking the Favorites workflow",
        description: "I reworked the Favorites interface so the Project overlay and standalone window share the same interaction model.",
        bullets: [
          { title: "Shared interface", text: "Reuse the window UI inside Project, keeping grid/list views and page navigation consistent." },
          { title: "Input and lifecycle", text: "Consume overlay interactions, clean up detached windows, and release the embedded renderer when the overlay closes." },
          { title: "Predictable activation", text: "Choose Space, Alt, or Tab and track key-down/up with focus-loss cleanup." },
        ],
        layout: "features",
        diagram: "editor-navigation",
        sources: [
          { label: "Interface & lifecycle changes", href: "https://github.com/Hubr1zz/UnityEditorTools/commit/f0563d2117b3cbbe425136bd5d7796ac8256423c" },
          { label: "Activation & settings changes", href: "https://github.com/Hubr1zz/UnityEditorTools/commit/34adbd16ee714a5ce6a445630745a17d4171cca4" },
        ],
      },
      {
        id: "inspector-workflow",
        title: "Inspector workflows beyond the default list",
        description: "The Inspector additions change how component-heavy hierarchies are navigated: isolate the active component, then operate on matching components as a group.",
        bullets: [
          { title: "Component tabs", text: "Switch from the traditional list to tabs, keep multiple components active, and toggle their enabled state." },
          { title: "Child Components", text: "Group descendants by type, search or filter Root and Inactive, batch enable or disable, and select or remove components." },
          { title: "Unified settings", text: "One Tools/EditorTools/Settings window organizes the five tools with short option explanations." },
        ],
        layout: "features",
        diagram: "editor-inspector",
        sources: [
          { label: "Inspector component workflows", href: "https://github.com/Hubr1zz/UnityEditorTools/commit/25fdf2390d832edec91f1c1212410ae93c9aea69" },
          { label: "Child Components window", href: "https://github.com/Hubr1zz/UnityEditorTools/commit/19509d329438773b80738290a9306316aaa5c3fc" },
        ],
      },
      {
        id: "compatibility",
        title: "Keeping the workspace usable across Unity versions",
        description: "I adapted newer Unity instance and entityID changes, fixed detached Inspector component windows, stabilized the Unity toolbar preview, and made the model preview background configurable.",
        layout: "prose",
        sources: [
          { label: "Compatibility fixes", href: "https://github.com/Hubr1zz/UnityEditorTools/commit/822e456a848f2955ad9118a60606798d3cb82181" },
          { label: "Version 0.1.5 changelog", href: "https://github.com/Hubr1zz/UnityEditorTools/commit/4b142b6ed2a4d71c6dfc887454562a9b4fef8172" },
        ],
      },
      {
        id: "editor-scene",
        title: "Scene tools as an independent package",
        description: "Scene Tools is a separate companion package for the editor workspace.",
        bullets: [
          { title: "Camera follow & LookAt", text: "SceneView follows the target and looks toward it." },
          { title: "Rotation root", text: "Set an object as a shared pivot, rotate selected objects around it, or orient the selection to face the root." },
          { title: "Saved expansion", text: "Scene, Prefab, and Project folder expansion state is saved and restored." },
        ],
        layout: "features",
        sources: [{ label: "Explore Scene Tools", href: "https://github.com/Hubr1zz/UnityEditorTools/tree/main/SceneTools" }],
      },
    ];
  }

  if (project.id === "tactics-design") {
    const designRoot = "https://github.com/Hubr1zz/GameDesignVault/blob/master/%E8%AE%BE%E8%AE%A1%E6%96%87%E6%A1%A3";
    return [
      {
        id: "game-design",
        title: "The game: from pillars to playable systems",
        description: "The design begins with the experience I want to protect, establishes the world and visual language, then moves from the three-phase loop into the mechanics that shape each decision.",
        bullets: [
          { title: "Pillars and art direction", text: "Difficulty, frequent risk, amplified lucky breaks, and accepting or overcoming weakness anchor the experience. The world is oppressive, primitive, and beautiful, mixing unsettling biological forms with cold environments and warm shafts of light." },
          { title: "The large-scale loop", text: "The Hunt creates preparation and uncertainty, the Showdown concentrates tactical decisions, and the Settlement turns consequences into inventions, relationships, losses, and the next expedition." },
          { title: "Tabletop tactility", text: "Cards, dice, and board-game-like physical interactions shape both mechanics and interface. Three-dimensional scenes support immersion, while bosses can bend the combat rhythm toward different tabletop structures." },
          { title: "Mechanics with emotional consequences", text: "Action order, inter-character effects, internalized traits, conditional events, equipment keywords, named hunters, and persistent camp memories turn restrictions and losses into new strategic possibilities." },
        ],
        layout: "features",
        diagram: "vault-loop",
        sources: [
          { label: "Pillars and design challenges", href: designRoot + "/Design%20Essentials%20%26%20Challenges.md" },
          { label: "World and art direction", href: designRoot + "/World%20settings%20%E4%B8%96%E7%95%8C%E8%A7%82%E8%AE%BE%E5%AE%9A.md" },
          { label: "Hunt phase", href: "https://github.com/Hubr1zz/GameDesignVault/tree/master/%E8%AE%BE%E8%AE%A1%E6%96%87%E6%A1%A3/%E7%8B%A9%E7%8C%8E%E9%98%B6%E6%AE%B5%20Hunt%20Phase" },
          { label: "Combat system", href: "https://github.com/Hubr1zz/GameDesignVault/tree/master/%E8%AE%BE%E8%AE%A1%E6%96%87%E6%A1%A3/%E5%86%B3%E6%88%98%E9%98%B6%E6%AE%B5%20Showdown%20Phase/%E6%88%98%E6%96%97%E7%B3%BB%E7%BB%9F%20Combat%20System" },
          { label: "Settlement phase", href: "https://github.com/Hubr1zz/GameDesignVault/tree/master/%E8%AE%BE%E8%AE%A1%E6%96%87%E6%A1%A3/%E8%90%A5%E5%9C%B0%E9%98%B6%E6%AE%B5%20Settlement%20Phase" },
        ],
      },
      {
        id: "vault-organization",
        title: "Six parts, one source of truth",
        description: "I divide the document repository into six primary areas so accepted rules, unfinished thinking, visual research, and concrete examples do not blur into one another.",
        bullets: [
          { title: "Inspiration library", text: "An inbox for ideas, mechanics, issues, UX notes, and unresolved questions before they become formal rules." },
          { title: "Art references", text: "Image references and visual material remain attached to the design reasoning they support." },
          { title: "Content design examples", text: "Monsters, events, narrative samples, map objects, and resource points test how formal systems behave in authored content." },
          { title: "Design documents", text: "Accepted and semi-formal material covers pillars, world setting, shared rules, and the Hunt, Showdown, and Settlement phases." },
          { title: "Terminology dictionary", text: "Each stable term has one definition and links back to its primary design location, reducing ambiguity across a growing document." },
          { title: "Other maintenance material", text: "Overview pages, history, backlog, Obsidian configuration, and agent-facing guidance keep the vault navigable and maintainable." },
        ],
        layout: "features",
        diagram: "vault-structure",
      },
      {
        id: "ai-workflow",
        title: "A Skills-driven AI maintenance workflow",
        description: "I designed a project Skill that lets AI assist with the vault without flattening tentative ideas into accepted design or losing the reasoning behind a change.",
        bullets: [
          { title: "Review before writing", text: "The workflow evaluates design goals, conflicts, player experience, and implementation impact before meaningful design changes enter the formal documents." },
          { title: "Route information by maturity", text: "Fresh ideas and issues enter the inspiration library; stable terms, concrete examples, and approved rules move to their dedicated homes." },
          { title: "Search and connect", text: "The agent reads nearby material first, finds related concepts, and maintains Obsidian links, lightweight metadata, and curated navigation." },
          { title: "Protect the source of truth", text: "The local vault remains authoritative. Conflicting copies are surfaced for review, while renames and accepted changes update obvious inbound links and maintenance records." },
        ],
        layout: "features",
        diagram: "vault-ai-flow",
        sources: [
          { label: "Vault maintenance Skill", href: "https://github.com/Hubr1zz/GameDesignVault/blob/master/Agent%E7%BB%B4%E6%8A%A4/SKILL.md" },
          { label: "Workspace map", href: "https://github.com/Hubr1zz/GameDesignVault/blob/master/Agent%E7%BB%B4%E6%8A%A4/workspace-map.md" },
        ],
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
    return [
      {
        id: "locomotion-capture",
        title: "A movement target becomes a coordinated body plan",
        description: "In one sentence: the prototype predicts where the body wants to move, searches a safe foothold for each leg, then schedules those legs out of phase so the creature remains readable and supported.",
        details: "The controller combines a desired travel direction, a predicted body target, current foot anchors, and Cinemachine camera feedback. Locomotion is not a canned animation layered over movement—the visible pose is continuously reconstructed from environment queries and the support points that succeeded.",
        image: project.image,
        imageAlt: project.imageAlt,
      },
      {
        id: "foothold-search",
        title: "Foothold search prefers a valid answer over forced motion",
        description: "A sphere cast proposes a landing region, while a fixed raycast verifies that the path and surface are usable around nearby obstacles.",
        details: "When the preferred location fails, the search rotates through alternate angles rather than snapping the foot into blocked geometry. If every candidate fails, the movement request stops; preserving a stable pose is treated as more important than pretending the requested motion succeeded.",
        diagram: "locomotion-search",
      },
      {
        id: "gait-phasing",
        title: "Phase offsets prevent every leg from stepping together",
        description: "Each leg receives a different point in the gait cycle, distributing support and motion across time.",
        details: "A leg only releases its current anchor when its phase and distance threshold allow a new step. Offsetting those phases avoids the mechanical look and instability of simultaneous motion while keeping the rule set independent of one authored animation clip.",
        diagram: "locomotion-gait",
      },
      {
        id: "body-stability",
        title: "The body follows support, prediction, and failure state",
        description: "Body position interpolates between the average planted feet and a predicted movement target instead of following the input vector directly.",
        bullets: [
          { title: "Support average", text: "Planted foot positions provide a stable reference for where the body is currently supported." },
          { title: "Movement prediction", text: "The desired direction biases the body forward so the pose anticipates travel instead of lagging behind every step." },
          { title: "Failure behaviour", text: "When no valid foothold exists, locomotion stops rather than stretching a leg through an obstacle or creating an unstable body pose." },
        ],
        layout: "features",
        diagram: "locomotion-gait",
      },
    ];
  }

  if (project.id === "rendering-studies" && project.gallery) {
    return [
      {
        id: "grass-source",
        title: "Start with the silhouette and lighting target in Blender",
        description: "Geometry Nodes establishes grass density, blade distribution, and the broad lawn silhouette before the effect is rebuilt for real-time use.",
        details: "The study separates authoring questions from runtime questions. Procedural placement makes the source field easy to reshape, while baked normals soften lighting across individual blades so the field reads as one stylized surface rather than a collection of harsh flat cards.",
        image: project.gallery[3].src,
        imageAlt: project.gallery[3].alt,
      },
      {
        id: "grass-runtime",
        title: "Transfer the authored grass language into a real-time shader",
        description: "The Unity version recreates the lighting response in Shader Graph and adds vertex animation so the static source becomes a moving gameplay surface.",
        details: "Baked normal information preserves the unified lighting target, while vertex displacement supplies wind rhythm without moving individual GameObjects. The experiment treats the Blender field as a visual specification: the runtime shader is judged by whether it preserves silhouette, softness, and motion at interactive cost.",
        image: project.gallery[0].src,
        imageAlt: project.gallery[0].alt,
      },
      {
        id: "water-depth",
        title: "Use scene depth to anchor water edges and caustics",
        description: "The water shader compares the surface with scene depth, reconstructs world position, and uses that spatial information to place shoreline treatment and projected light.",
        details: "Because the effect is derived from the geometry behind the water, shallow edges and depth transitions respond to actual scene objects instead of a painted mask. Reconstructed world coordinates also drive the caustic noise, keeping the pattern stable in the world as the camera moves.",
        image: project.gallery[1].src,
        imageAlt: project.gallery[1].alt,
      },
      {
        id: "desert-wind",
        title: "Layer authored dunes, shader motion, and particles into one wind cue",
        description: "The Journey-inspired desert separates three spatial scales: Blender shapes the broad terrain, HLSL animates the surface response, and particles reveal wind direction.",
        details: "No single layer has to carry the entire effect. Large undulation gives composition and silhouette, vertex motion adds local movement, and sparse particles provide temporal rhythm that remains readable from a gameplay camera. Together they imply a moving atmosphere without simulating sand grains.",
        image: project.gallery[2].src,
        imageAlt: project.gallery[2].alt,
      },
    ];
  }

  if (project.gallery) return project.gallery.map((image, index) => ({ id: `image-${index}`, title: image.alt, description: image.alt, image: image.src, imageAlt: image.alt }));
  if (project.image) return [{ id: "image-0", title: project.imageAlt ?? project.title, description: project.imageAlt ?? "", image: project.image, imageAlt: project.imageAlt ?? project.title }];
  return [{ id: "system-visual", title: project.eyebrow, description: project.description, details: project.details, visual: true }];
}
