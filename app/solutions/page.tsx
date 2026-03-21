import WhyChooseNexvra from '@/components/about/why-choose'
import ContentSection from '@/components/common/content-section'
import SolutionContent from '@/components/solution/content'
import ProcessSection from '@/components/solution/process-section'

const page = () => {
    return (
        <>
            <ContentSection
                title="Solutions"
                description="-- At Nexvra Solutions --, we provide future-ready digital services that combine ** creativity, technology, and strategy ** to help businesses grow, adapt, and thrive in a fast-changing world."
                image="/images/about-bg.jpg"
            />
            <SolutionContent />
            <ProcessSection />
            <WhyChooseNexvra />
        </>
    )
}

export default page