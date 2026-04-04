import type { Metadata } from 'next'

import WhyChooseNexvra from '@/components/about/why-choose'
import ContentSection from '@/components/common/content-section'
import SolutionContent from '@/components/solution/content'
import ProcessSection from '@/components/solution/process-section'

export const metadata: Metadata = {
  title: "Our Solutions | Nexvra Solutions",
  description:
    "Explore Nexvra Solutions services including web development, mobile app development, UI/UX design, and scalable digital solutions for modern businesses.",
};

export default function Page() {
  return (
    <>
      {/* SEO content (server-rendered) */}
      <h1 className="sr-only">Nexvra Solutions Services</h1>
      <p className="sr-only">
        Nexvra Solutions provides web development, mobile app development,
        UI/UX design, and digital solutions to help businesses grow and scale efficiently.
      </p>

      <ContentSection
        title="Solutions"
        showGif={false}
        description="We deliver modern digital solutions that combine creativity, technology, and strategy to help businesses grow, scale, and succeed in the digital world. From design to development, we turn ideas into impactful digital experiences."
        image="/images/about-bg.jpg"
      />

      <SolutionContent />
      <ProcessSection />
      <WhyChooseNexvra />
    </>
  )
}