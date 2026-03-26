import ContentSection from '@/components/common/content-section'
import Challenges from '@/components/project-detail/challenges'
import ServicesSection from '@/components/project-detail/service-section'
import { ShowCase } from '@/components/project-detail/showcase'
import React from 'react'

const page = () => {
    return (
        <>
            <ContentSection
                title="Project Name"
                description="Each project reflects our passion for blending creativity, technology, and strategy. Here’s how we’ve helped businesses transform and grow."
                image="/images/about-bg.jpg"
            />
            <Challenges />
            <ServicesSection />
            <ShowCase />
        </>
    )
}

export default page