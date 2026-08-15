import type { Metadata } from "next";
import { Portfolio } from "../portfolio";

export const metadata: Metadata = {
  title: "Design Experience — Leon Zhou",
  description: "System design documents, comparative analysis, and design research by Leon Zhou.",
  openGraph: { title: "Design Experience — Leon Zhou", description: "System design documents, comparative analysis, and design research by Leon Zhou.", images: [] },
  twitter: { title: "Design Experience — Leon Zhou", description: "System design documents, comparative analysis, and design research by Leon Zhou.", images: [] },
};

export default function DesignPage() {
  return <Portfolio page="design" />;
}
