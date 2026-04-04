
import ContentSection from "@/components/common/content-section";
import CouresClient from "@/components/common/course-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Courses | Nexvra Solutions",
    description:
        "Explore Nexvra Solutions courses including UI/UX design, development, digital marketing, and AI-powered product design.",
};

const CoursePage = () => {
    return (
        <>
            {/* SEO content */}
            <h1 className="sr-only">Nexvra Solutions Courses</h1>
            <p className="sr-only">
                Nexvra Solutions offers professional courses in UI/UX design, frontend and backend development,
                mobile app development, and digital marketing with practical training.
            </p>
            <ContentSection
                title="Courses"
                description="Each project reflects our passion for blending creativity, technology, and strategy."
                image="/images/about-bg.jpg"
                showGif={false}
            />
            <CouresClient />
        </>
    );
};

export default CoursePage;
