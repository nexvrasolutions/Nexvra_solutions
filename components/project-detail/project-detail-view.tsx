"use client";

import ContentSection from "@/components/common/content-section";
import Challenges from "@/components/project-detail/challenges";
import ServicesSection from "@/components/project-detail/service-section";
import { ShowCase } from "@/components/project-detail/showcase";
import { projects } from "@/data/projects";

export default function ProjectDetailView({ slug }: { slug: string }) {
  const project = projects[slug];
  return (
    <>
      <ContentSection
        title={project.title}
        description={project.description}
        image="/images/about-bg.jpg"
        gifImage={project.image}
        isProjectDetail={true}
      />
      <Challenges project={project} />
      <ServicesSection project={project} />
      {project.showcase && <ShowCase project={project} />}
    </>
  );
}
