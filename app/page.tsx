import AboutSection from "@/components/home/about-section";
import type { Metadata } from "next";
import CaseStudy from "@/components/home/case-study";
import ClientFeedback from "@/components/home/client-feedback";
import FeaturedCourses from "@/components/home/featured-courses";
import Hero from "@/components/home/hero";
import Pillars from "@/components/home/pillars";
import WhatWeDo from "@/components/home/what-we-do";
import { MarqueeSlider } from "@/components/ui/marquee-slider";

export const metadata: Metadata = {
  title: "Nexvra Solutions | Build Digital Solutions & IT Services",
  description:
    "Nexvra Solutions builds scalable web apps, mobile apps, and provides IT services and professional training.",
};

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