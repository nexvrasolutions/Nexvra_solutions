import type { Metadata } from 'next'

import WhyChooseNexvra from '@/components/about/why-choose'
import ContentSection from '@/components/common/content-section'
import SolutionContent from '@/components/solution/content'
import ProcessSection from '@/components/solution/process-section'
import LenisProvider from '../providers/lenis-provider'
import { Arrow } from '@/components/ui/arrow'
import { Button } from '@/components/ui/button'

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
      <LenisProvider>
        <SolutionContent />

        <ProcessSection />
      </LenisProvider>
      <section
        data-theme="dark"
        className="bg-black w-full px-5 md:px-10 xl:px-[5.5%] py-[5%]  flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 sm:gap-12"
      >
        <h2 className="text-white font-secondary font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight max-w-2xl">
          Ready To Move <br />
          From{" "}
          <span className='text-[#A4FF00]'>Ideas To Impact?</span>
        </h2>



        <a
          href="/courses"
          className='cursor-pointer'
        >
         <Button label='Explore Courses' />
        </a>
      </section >
      <WhyChooseNexvra />
    </>
  )
}