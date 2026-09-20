import type { Metadata } from "next";
import { OtherContent } from "../../other-content";

export const metadata: Metadata = {
  title: "Other Projects — Leon Zhou",
  description: "Small tools and side experiments outside Leon Zhou's main practice.",
};

export default function OtherProjectsPage() {
  return <OtherContent section="projects" />;
}
