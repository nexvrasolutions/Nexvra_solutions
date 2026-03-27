import ContentSection from '@/components/common/content-section'
import ProjectSection from '@/components/projects/project-sections'
import React from 'react'

const page = () => {
    return (
        <>
            <ContentSection
                title="Projects"
                description="Each project reflects our passion for blending creativity, technology, and strategy. Here’s how we help businesses build, grow, and succeed in the digital world."
                image="/images/about-bg.jpg"
            />
            <ProjectSection />
        </>
    )
}

export default page