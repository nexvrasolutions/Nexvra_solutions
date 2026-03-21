"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RotatingText from "../ui/rotating-text";
import { Badge } from "../ui/badge";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Discover & Research",
    description: "We begin by understanding your vision, challenges, and opportunities.",
    align: "right" as const,
  },
  {
    number: "02",
    title: "Strategy & Planning",
    description: "We craft a tailored roadmap that aligns with your business goals.",
    align: "left" as const,
  },
  {
    number: "03",
    title: "Design & Develop",
    description: "Our team builds pixel-perfect, performant solutions with precision.",
    align: "right" as const,
  },
  {
    number: "04",
    title: "Launch & Optimise",
    description: "We deploy, monitor, and continuously improve for lasting impact.",
    align: "left" as const,
  },
  {
    number: "05",
    title: "Test & Review",
    description: "Rigorous QA ensures every detail meets the highest standards.",
    align: "right" as const,
  },
  {
    number: "06",
    title: "Iterate & Improve",
    description: "We listen to feedback and refine until the product is perfect.",
    align: "left" as const,
  },
  {
    number: "07",
    title: "Scale & Grow",
    description: "Infrastructure and strategy to support your growing ambitions.",
    align: "right" as const,
  },
  {
    number: "08",
    title: "Support & Maintain",
    description: "Ongoing care so your product stays fast, secure, and relevant.",
    align: "left" as const,
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const greenLineRef = useRef<HTMLDivElement>(null);
  const scrollSpacerRef = useRef<HTMLDivElement>(null);
  const stickyPanelRef = useRef<HTMLDivElement>(null);
  const innerTrackRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<(HTMLDivElement | null)[]>([]);
  const titlesRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const descsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Apply active styles to a step
  const applyStepState = (i: number, isActive: boolean) => {
    const badge = badgesRef.current[i];
    const title = titlesRef.current[i];
    const desc = descsRef.current[i];
    const icon = iconsRef.current[i];

    if (badge) {
      badge.style.background = isActive
        ? "linear-gradient(180deg, #F3F3F3 0%, #A4FF00 100%)"
        : "linear-gradient(180deg, #FFFFFF 0%, #F3F3F3 100%)";
      badge.style.color = isActive ? "#000" : "#999";
      badge.style.fontWeight = isActive ? "700" : "500";
    }
    if (title) title.style.color = isActive ? "#000000" : "#9ca3af";
    if (desc) desc.style.color = isActive ? "#6b7280" : "#d1d5db";
    if (icon) {
      const img = icon.querySelector("img") as HTMLImageElement | null;
      if (img) {
        img.style.filter = isActive ? "none" : "grayscale(1)";
        img.style.opacity = isActive ? "1" : "0.3";
      }
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- Heading fade in ---
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
          },
        }
      );

      const trackEl = innerTrackRef.current;
      const panelEl = stickyPanelRef.current;
      if (!trackEl || !panelEl) return;

      // Panel = full viewport height — eliminates any bottom clip/overlay
      const panelHeight = window.innerHeight;
      panelEl.style.height = `${panelHeight}px`;

      // How far inner track scrolls to show all steps
      const overflow = Math.max(0, trackEl.scrollHeight - panelHeight);

      // Step 0 active immediately
      gsap.set(greenLineRef.current, { scaleY: 1 / steps.length });
      applyStepState(0, true);

      // scrub: 1 → smooth 1-second lag, feels silky not jumpy
      ScrollTrigger.create({
        trigger: scrollSpacerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: stickyPanelRef.current,
        pinSpacing: false,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // Slide track up — gsap.set inside scrub is perfectly smooth
          gsap.set(innerTrackRef.current, { y: -p * overflow });

          // Green line: starts at 1/n (step 0 already lit), grows to 1.0
          gsap.set(greenLineRef.current, {
            scaleY: (1 / steps.length) + p * (1 - 1 / steps.length),
          });

          // Light up steps progressively
          const activeIndex = Math.floor(p * steps.length);
          steps.forEach((_, i) => applyStepState(i, i <= activeIndex));
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Each "page" of scroll = 1 step. Total = steps.length "pages" worth of scroll height.
  // We use 100vh per step so 8 steps = 800vh spacer.
  const spacerHeight = `${steps.length * 100}vh`;

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#f5f5f5] text-black px-[5.5%] pt-[6%]"
    >
      {/* Heading — scrolls away normally */}
      <div
        ref={headingRef}
        className="pb-20 relative border border-[#E6E6E6] py-20 px-2"
      >
        <div className="grid-line absolute left-[65%] top-0 h-full w-px bg-[#E6E6E6]" />
        <Badge text="Our Process" className="text-tertiary mb-2" />
        <div className="max-w-5xl">
          <h1 className="text-3xl font-primary md:text-[40px] font-bold leading-13 tracking-tight">
            <span className="text-[#BFBFBF] font-bold">
              Our flexible process blends{" "}
            </span>
            <span className="inline-block align-middle">
              <RotatingText
                texts={["Creativity", "Technology", "Strategy"]}
                mainClassName="inline-flex bg-[#A4FF00] text-black px-3 py-1 rounded-md ml-2"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.03}
                splitLevelClassName="overflow-hidden"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </span>
            <span className="font-bold text-black">
              {" "}to deliver impactful, future-ready solutions.{" "}
            </span>
          </h1>
        </div>
      </div>

      {/* Scroll spacer — 100vh × 8 steps so each scroll "page" = 1 step */}
      <div ref={scrollSpacerRef} style={{ height: spacerHeight }}>
        {/* Pinned panel */}
        <div
          ref={stickyPanelRef}
          className="relative max-w-2xl mx-auto"
          // height set dynamically in useEffect
        >
          {/* NO bottom fade — removed to fix the overlay issue */}

          {/* Inner track — slides upward via GSAP */}
          <div ref={innerTrackRef} className="relative">
            {/* Gray base line */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1.5 origin-top"
              style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, #F3F3F3 100%)",
              }}
            />

            {/* Green fill line — starts at scaleY=0, grows per step */}
            <div
              ref={greenLineRef}
              className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1.5 origin-top"
              style={{
                background: "linear-gradient(180deg, #F3F3F3 10%, #A4FF00 100%)",
              }}
            />

            <div className="flex flex-col gap-20">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`step-row relative flex items-center ${
                    step.align === "right" ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Icon half */}
                  <div
                    ref={(el) => {
                      iconsRef.current[i] = el;
                    }}
                    className={`step-icon w-1/2 flex ${
                      step.align === "right"
                        ? "justify-end pr-12"
                        : "justify-start pl-12"
                    }`}
                  >
                    <img
                      src="/images/green-eye.png"
                      alt={step.title}
                      className="object-contain transition-all duration-500 size-[200px]"
                      style={{ filter: "grayscale(1)", opacity: 0.3 }}
                    />
                  </div>

                  {/* Text half */}
                  <div
                    className={`step-text flex flex-col gap-5 w-1/2 ${
                      i === 0 ? "pt-5 " : ""
                    }${
                      step.align === "right"
                        ? "pl-12 text-left"
                        : "pr-12 text-right items-end"
                    }`}
                  >
                    <div
                      ref={(el) => {
                        badgesRef.current[i] = el;
                      }}
                      className="step-badge font-medium z-10 size-16 text-2xl font-primary rounded-full flex items-center justify-center leading-none transition-all duration-500"
                      style={{
                        background:
                          "linear-gradient(180deg, #FFFFFF 0%, #F3F3F3 100%)",
                        color: "#999",
                        fontWeight: 500,
                      }}
                    >
                      {step.number}
                    </div>
                    <div className="flex flex-col gap-3">
                      <h3
                        ref={(el) => {
                          titlesRef.current[i] = el;
                        }}
                        className="text-2xl font-secondary leading-7 font-bold transition-colors duration-500"
                        style={{ color: "#9ca3af" }}
                      >
                        {step.title}
                      </h3>
                      <p
                        ref={(el) => {
                          descsRef.current[i] = el;
                        }}
                        className="text-lg font-medium leading-relaxed transition-colors duration-500"
                        style={{ color: "#d1d5db" }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}