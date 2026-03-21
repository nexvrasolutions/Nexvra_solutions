"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "../ui/badge";

gsap.registerPlugin(ScrollTrigger);

export default function CaseStudy() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current!;
      const container = scrollContainerRef.current!;

      const sections = gsap.utils.toArray<HTMLDivElement>(".case-card");

      // Horizontal scroll animation
      const horizontalTween = gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + container.offsetWidth,
          pin: true,
          scrub: 2, 
          anticipatePin: 1,
        },
      });

      // Image parallax
      const images = gsap.utils.toArray<HTMLImageElement>(".case-img");

      images.forEach((img) => {
        gsap.to(img, {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            containerAnimation: horizontalTween,
            scrub: 1,
          },
        });
      });

      // Card fade animation
      gsap.from(".case-card", {
        opacity: 0,
        y: 120,
        duration: 1.2,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#F3F3F3] min-h-screen overflow-hidden px-[5.5%] py-[5%]"
    >
      {/* Title */}
      <div className="sticky top-0 left-0 z-10 py-10 bg-[#F3F3F3]">
        <Badge text="Our Works" className="text-tertiary" />

        <h1 className="font-primary text-teritiary text-[64px] font-bold leading-[80px]">
          Our Impact
        </h1>
      </div>

      {/* Horizontal container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-12 py-10"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="case-card flex flex-col gap-8 flex-shrink-0 w-[900px]"
          >
            <div className="w-[900px] h-[500px] overflow-hidden rounded-sm">
              <Image
                src="/images/case-study.png"
                alt="case-study"
                width={900}
                height={500}
                className="case-img w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-[#404040] font-primary text-[36px] font-bold">
                Project Name {index + 1}
              </h4>

              <p className="text-[#404040]/80 font-primary text-[20px] leading-[28px]">
                Case study highlighting measurable growth.
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
