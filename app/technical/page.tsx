import type { Metadata } from "next";
import { Portfolio } from "../portfolio";

export const metadata: Metadata = {
  title: "Technical Projects — Leon Zhou",
  description: "Published production tools, Unity systems, and focused technical studies by Leon Zhou.",
  openGraph: { title: "Technical Projects — Leon Zhou", description: "Published production tools, Unity systems, and focused technical studies by Leon Zhou.", images: [] },
  twitter: { title: "Technical Projects — Leon Zhou", description: "Published production tools, Unity systems, and focused technical studies by Leon Zhou.", images: [] },
};

export default function TechnicalPage() {
  return <Portfolio page="technical" />;
}
