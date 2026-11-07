import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetailView from "@/components/course-detail/course-detail-view";
import { courses } from "@/data/courses";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(courses).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = courses[slug];
  return course ? { title: course.title } : {};
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!Object.hasOwn(courses, slug)) notFound();
  return <CourseDetailView slug={slug} />;
}
