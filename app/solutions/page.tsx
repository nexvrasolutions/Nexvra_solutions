import WhyChooseNexvra from '@/components/about/why-choose'
import ContentSection from '@/components/common/content-section'
import SolutionContent from '@/components/solution/content'
import ProcessSection from '@/components/solution/process-section'

const page = () => {
    return (
        <>
            <ContentSection
                title="Solutions"
                description="We deliver modern digital solutions that combine creativity, technology, and strategy to help businesses grow, scale, and succeed in the digital world. From design to development, we turn ideas into impactful digital experiences."
                image="/images/about-bg.jpg"
            />
            <SolutionContent />
            <ProcessSection />
            <WhyChooseNexvra />
        </>
    )
}

export default page