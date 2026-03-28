"use client";

import AboutContent from '@/components/about/about-content'
import MissionVisionSection from '@/components/about/mission-vision-section'
import WhyChooseNexvra from '@/components/about/why-choose'
import ContentSection from '@/components/common/content-section'
import Pillars from '@/components/home/pillars'

const page = () => {

    return (
        <>
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

export default page