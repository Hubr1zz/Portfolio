import type { Metadata } from "next";
import { Portfolio } from "./portfolio";

export const metadata: Metadata = {
  title: "Leon Zhou — Technical Designer",
  description: "Technical design, gameplay programming, and real-time graphics by Leon Zhou.",
};

export default function Home() {
  return <Portfolio page="home" />;
}
