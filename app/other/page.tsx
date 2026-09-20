import type { Metadata } from "next";
import { OtherContent } from "../other-content";

export const metadata: Metadata = {
  title: "Other — Leon Zhou",
  description: "Games, small tools, and side experiments by Leon Zhou.",
};

export default function OtherPage() {
  return <OtherContent section="games" />;
}
