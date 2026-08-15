import type { Metadata } from "next";
import { Portfolio } from "../portfolio";

export const metadata: Metadata = {
  title: "Game Works — Leon Zhou",
  description: "Playable prototypes and small games designed and implemented by Leon Zhou.",
  openGraph: { title: "Game Works — Leon Zhou", description: "Playable prototypes and small games designed and implemented by Leon Zhou.", images: [] },
  twitter: { title: "Game Works — Leon Zhou", description: "Playable prototypes and small games designed and implemented by Leon Zhou.", images: [] },
};

export default function GamesPage() {
  return <Portfolio page="games" />;
}
