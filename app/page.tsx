import AboutSection from "@/components/home/about-section";
import CaseStudy from "@/components/home/case-study";
import ClientFeedback from "@/components/home/client-feedback";
import FeaturedCourses from "@/components/home/featured-courses";
import Hero from "@/components/home/hero";
import Pillars from "@/components/home/pillars";
import WhatWeDo from "@/components/home/what-we-do";
import { MarqueeSlider } from "@/components/ui/marquee-slider";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <MarqueeSlider />
      <Pillars />
      <FeaturedCourses />
      <WhatWeDo />
      <CaseStudy />
      <ClientFeedback />
    </>
  );
}
