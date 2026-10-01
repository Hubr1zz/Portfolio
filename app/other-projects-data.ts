export const sideProjectCategories = [
  { id: "all", label: "sideProjects.category.all" },
  { id: "effects", label: "sideProjects.category.effects" },
  { id: "tools", label: "sideProjects.category.tools" },
  { id: "apps", label: "sideProjects.category.apps" },
] as const;

export type SideProjectCategory = typeof sideProjectCategories[number]["id"];
export type SideProjectMedia = { id: string; kind: "image" | "video"; src: string; label: string; alt: string; poster?: string };
export type SideProject = { id: string; title: string; category: Exclude<SideProjectCategory, "all">; description: string; tags: string[]; media: [SideProjectMedia, ...SideProjectMedia[]] };

export const sideProjects: SideProject[] = [
  {
    id: "unity-market-watch",
    title: "Market Watch, Undercover",
    category: "tools",
    tags: ["Unity"],
    description: "An A-share market viewer inside Unity, with candlestick charts and indicators. One switch disguises it as the Unity Profiler.",
    media: [
      { id: "profiler", kind: "image", src: "/images/other-projects/unity-market-watch-profiler.webp", label: "Profiler disguise", alt: "A-share market data disguised as CPU usage and GC allocation in the Unity Profiler" },
      { id: "chart", kind: "image", src: "/images/other-projects/unity-market-watch-chart.webp", label: "Market view", alt: "Unity market viewer displaying A-share candlesticks, moving averages, volume, MACD, and KDJ" },
      { id: "demo", kind: "video", src: "/videos/unity-market-watch.mp4", label: "Watch demo", alt: "A 32-second demonstration of the Unity market viewer and Profiler disguise", poster: "/images/other-projects/unity-market-watch-profiler.webp" },
    ],
  },
];
