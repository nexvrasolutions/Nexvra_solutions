import type { Metadata } from 'next'

import AboutContent from '@/components/about/about-content'
import MissionVisionSection from '@/components/about/mission-vision-section'
import WhyChooseNexvra from '@/components/about/why-choose'
import ContentSection from '@/components/common/content-section'
import Pillars from '@/components/home/pillars'

export const metadata: Metadata = {
  title: "About Nexvra Solutions",
  description:
    "Learn about Nexvra Solutions, a future-focused digital company delivering innovative IT solutions, training, and scalable applications.",
};

export default function Page() {
  return (
    <>
      <h1 className="sr-only">About Nexvra Solutions</h1>
      <p className="sr-only">
        Nexvra Solutions is a modern digital company focused on skill development and digital solutions,
        including web development, mobile apps, and IT services.
      </p>

      <ContentSection
        title="About us"
        description="Nexvra Solutions is a future-focused digital company that blends creativity, technology, and strategy to build impactful digital experiences."
        image="/images/about-bg.jpg"
        gifImage="/images/about/banner.webp"
      />

      <AboutContent />
      <MissionVisionSection />
      <WhyChooseNexvra />
      <Pillars />
    </>
  )
}