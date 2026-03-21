import AboutContent from '@/components/about/about-content'
import MissionVisionSection from '@/components/about/mission-vision-section'
import WhyChooseNexvra from '@/components/about/why-choose'
import ContentSection from '@/components/common/content-section'
import Pillars from '@/components/home/pillars'
import React from 'react'

const page = () => {
    return (
        <>
            <ContentSection
                title="About us"
                description="Founded with a vision to lead the next wave of digital innovation, -- Nexvra Solutions-- is a forward-thinking company that blends creativity, technology, and strategy to ** build impactful digital experiences **."
                image="/images/about-bg.jpg"
            />
            <AboutContent />
            <MissionVisionSection />
            <WhyChooseNexvra />
            <Pillars />
        </>
    )
}

export default page