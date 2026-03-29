"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "../ui/badge";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    name: "Magic Aisles",
    slug: "magic-aisles",
    type: "Website Development",
    image: "/images/projects/magicaisles.webp",
  },
  {
    id: 2,
    name: "Exclusive",
    slug: "exclusive",
    type: "E-commerce Website",
    image: "/images/projects/exclusive.webp",
  },
  {
    id: 3,
    name: "Riya Mobiles",
    slug: "riya-mobiles",
    type: "Website Design",
    image: "/images/projects/riyamobiles.webp",
  },
  {
    id: 4,
    name: "My Choir",
    slug: "my-choir",
    type: "Mobile App",
    image: "/images/projects/mychoir.webp",
  },
  {
    id: 5,
    name: "JE Mobiles",
    slug: "je-mobiles",
    type: "Digital Marketing",
    image: "/images/projects/jemobiles.webp",
  },
];

export default function CaseStudy() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current!;
      const container = scrollContainerRef.current!;
      const sections = gsap.utils.toArray<HTMLDivElement>(".case-card");

      ScrollTrigger.matchMedia({
        // ✅ DESKTOP (UNCHANGED)
        "(min-width: 1024px)": () => {
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
        },

        "(max-width: 1023px)": () => {
          gsap.set(sections, { clearProps: "transform" });

          gsap.from(".case-card", {
            opacity: 0,
            y: 80,
            scale: 0.95,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
            },
          });

          // subtle image parallax
          const images = gsap.utils.toArray<HTMLImageElement>(".case-img");

          images.forEach((img) => {
            gsap.to(img, {
              y: -30,
              scrollTrigger: {
                trigger: img,
                scrub: 1,
              },
            });
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#F3F3F3] min-h-screen overflow-hidden px-5 md:px-10 xl:px-[5.5%] py-10 xl:py-[5%]"
    >
      {/* Title */}
      <div className="sticky top-0 left-0 z-10 py-5 bg-[#F3F3F3]">
        <Badge text="Our Works" className="text-tertiary mb-3 md:mb-0" />
        <h1 className="font-primary text-teritiary text-[32px] md:text-[48px] xl:text-[64px] font-bold leading-[40px] md:leading-[60px] xl:leading-[80px]">
          Our Impact
        </h1>
      </div>

      {/* Container */}
      <div
        ref={scrollContainerRef}
        className="
          flex items-center gap-4 md:gap-8 xl:gap-12 py-5 md:py-7
          max-lg:flex-col
        "
      >
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/project-detail/${project.slug}`}
            className="
              case-card flex flex-col gap-0 md:gap-8 flex-shrink-0
              w-full h-full md:w-[70vw] xl:w-[900px]
            "
          >
            {/* Image */}
            <div className="w-full h-full md:h-[320px] xl:h-[500px] overflow-hidden rounded-xs">
              <img
                src={project.image}
                alt={project.name}
                className="case-img w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-0 md:gap-2">
              <h4 className="text-[#404040] font-primary font-bold text-[22px] md:text-[28px] xl:text-[36px]">
                {project.name}
              </h4>

              <p className="text-[#404040]/80 font-primary text-[14px] md:text-[16px] xl:text-[20px] leading-[22px] md:leading-[24px] xl:leading-[28px]">
                {project.type}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}