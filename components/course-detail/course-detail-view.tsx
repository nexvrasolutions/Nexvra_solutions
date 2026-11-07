"use client";

import CourseHero from "@/components/course-detail/course-hero";
import DetailContent from "@/components/course-detail/detail-content";
import WhyLearn from "@/components/course-detail/why-learn";
import { CTASection } from "@/components/course-detail/cta-section";
import { courses } from "@/data/courses";

export default function CourseDetailView({ slug }: { slug: string }) {
  const course = courses[slug];
  return (
    <>
      <CourseHero course={course} />
      <DetailContent course={course} />
      <WhyLearn course={course} />
      <CTASection course={course} />
    </>
  );
}
