import type { Metadata } from "next";
import { Portfolio } from "../portfolio";

export const metadata: Metadata = {
  title: "Design Projects — Leon Zhou",
  description: "System design documents, comparative analysis, and design research by Leon Zhou.",
  openGraph: { title: "Design Projects — Leon Zhou", description: "System design documents, comparative analysis, and design research by Leon Zhou.", images: [] },
  twitter: { title: "Design Projects — Leon Zhou", description: "System design documents, comparative analysis, and design research by Leon Zhou.", images: [] },
};

export default function DesignPage() {
  return <Portfolio page="design" />;
}
