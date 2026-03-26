import CourseHero from '@/components/course-detail/course-hero'
import { CTASection } from '@/components/course-detail/cta-section'
import DetailContent from '@/components/course-detail/detail-content'
import WhyLearn from '@/components/course-detail/why-learn'
import React from 'react'

const page = () => {
  return (
    <>
        <CourseHero />
        <DetailContent />
        <WhyLearn />
        <CTASection />
    </>
  )
}

export default page