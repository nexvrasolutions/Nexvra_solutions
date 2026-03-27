"use client";

import CourseHero from "@/components/course-detail/course-hero";
import DetailContent from "@/components/course-detail/detail-content";
import WhyLearn from "@/components/course-detail/why-learn";
import { CTASection } from "@/components/course-detail/cta-section";
import { courses } from "@/data/courses";
import { useParams } from "next/navigation";

const Page = () => {
  
  const params = useParams();
  const slug = params.slug ?? "";
  const course = courses[slug];

  if (!course) return <div>Course not found</div>;

  return (
    <>
      <CourseHero course={course} />
      <DetailContent course={course} />
      <WhyLearn course={course} />
      <CTASection course={course} />
    </>
  );
};

export default Page;