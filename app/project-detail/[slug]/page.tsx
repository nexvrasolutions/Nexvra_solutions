import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailView from "@/components/project-detail/project-detail-view";
import { projects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects[slug];
  return project ? { title: project.title, description: project.description } : {};
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!Object.hasOwn(projects, slug)) notFound();
  return <ProjectDetailView slug={slug} />;
}
