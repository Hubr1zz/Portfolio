import type { Metadata } from "next";
import { OtherContent } from "../../other-content";

export const metadata: Metadata = {
  title: "Games I Played — Leon Zhou",
  description: "An ongoing record of the games Leon Zhou spends time with.",
};

export default function OtherGamesPage() {
  return <OtherContent section="games" />;
}
