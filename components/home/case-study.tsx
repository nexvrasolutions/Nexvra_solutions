"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "../ui/badge";
import { Arrow } from "../ui/arrow";

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
    if (!sectionRef.current) return;

    const ctx = gsap.context((self) => {
      const q: any = self.selector;

      const section = sectionRef.current!;
      const container = scrollContainerRef.current!;
      const sections = q(".case-card");

      const mm = gsap.matchMedia();

      // ───────── DESKTOP ─────────
      mm.add("(min-width: 1024px)", () => {
        const horizontalTween = gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + container.offsetWidth,
            pin: true,
            scrub: 1.5,
            anticipatePin: 1,
          },
        });

        const images = q(".case-img");

        images.forEach((img: any) => {
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
      });

      // ───────── MOBILE / TABLET ─────────
      mm.add("(max-width: 1023px)", () => {
        gsap.set(sections, { clearProps: "transform" });

        gsap.from(sections, {
          opacity: 0,
          y: 60,
          scale: 0.96,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          },
        });

      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      data-theme="light"
      ref={sectionRef}
      className="relative bg-[#F3F3F3] min-h-screen overflow-hidden px-5 md:px-10 xl:px-[5.5%] py-10 2xl:py-[5%]"
    >
      {/* Title */}
      <div className="sticky top-0 left-0 z-10 py-5 bg-[#F3F3F3]">
        <Badge text="Our Works" className="text-tertiary mb-3 md:mb-0" />
        <h1 className="font-primary text-tertiary text-[32px] md:text-[48px] xl:text-[64px] font-bold leading-[40px] md:leading-[60px] xl:leading-[80px]">
          Our Impact
        </h1>
      </div>

      {/* Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-8 xl:gap-12 py-5 md:py-7 xl:py-0 max-lg:flex-col"
      >
        {projects.map((project) => {
          return (
            <a
              key={project.id}
              href={`/project-detail/${project.slug}`}
              className="group case-card flex flex-col gap-2 md:gap-3 flex-shrink-0 w-full md:w-[70vw] xl:w-[900px]"
            >
              {/* Image */}
              <div className="relative w-full h-[250px] md:h-[320px] lg:h-[400px] xl:h-[450px] 2xl:h-[500px] overflow-hidden rounded-sm group">

                {/* Wrapper that scales EVERYTHING */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">

                  {/* Image */}
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="case-img object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Arrow
                      className="rounded-full size-12 md:size-16 lg:size-20 transform scale-75 group-hover:scale-100 transition-all duration-300"
                      imgClassName="size-6 md:size-8 lg:size-10"
                    />
                  </div>

                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1">
                <h4 className="text-[#404040] font-primary font-bold text-[22px] md:text-[28px] xl:text-[36px] group-hover:text-black transition">
                  {project.name}
                </h4>

                <p className="text-[#404040]/70 font-primary text-[14px] md:text-[16px] xl:text-[20px]">
                  {project.type}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}