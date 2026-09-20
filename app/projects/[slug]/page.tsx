import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, flatProjects, type TabId } from "../../portfolio-data";
import { ProjectDetail } from "../../portfolio";

export const dynamicParams = false;

export function generateStaticParams() {
  return flatProjects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project)
    return {};
  return { title: project.title + " — Leon Zhou", description: project.description };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project)
    notFound();
  return <ProjectDetail project={project} category={project.category as TabId} />;
}
