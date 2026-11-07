"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RotatingText from "../ui/rotating-text";
import { Badge } from "../ui/badge";
import { motion, useInView } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Discover",
    image: "/images/solution/Discovery.png",
    description:
      "We understand your business, goals, and requirements to define the right approach.",
    align: "right" as const,
  },
  {
    number: "02",
    title: "Strategy",
    image: "/images/solution/Strategy.png",
    description:
      "We plan the structure, features, and user experience to ensure clarity and direction.",
    align: "left" as const,
  },
  {
    number: "03",
    title: "Design",
    image: "/images/solution/Design.png",
    description:
      "We create clean and intuitive designs focused on user experience and usability.",
    align: "right" as const,
  },
  {
    number: "04",
    title: "Development",
    image: "/images/solution/Development.png",
    description:
      "We build fast, scalable, and high-performance solutions using modern technologies.",
    align: "left" as const,
  },
  {
    number: "05",
    title: "Launch & Support",
    image: "/images/solution/launch-and-support.png",
    description:
      "We launch your product and provide support to ensure smooth performance and growth.",
    align: "right" as const,
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
    let lastIndex = -1;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
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

      const setLayout = () => {
        const panelHeight = window.innerHeight;
        panelEl.style.height = `${panelHeight}px`;
        return Math.max(0, trackEl.scrollHeight - panelHeight);
      };

      let overflow = setLayout();

      gsap.set(greenLineRef.current, { scaleY: 1 / steps.length });
      applyStepState(0, true);

      const trigger = ScrollTrigger.create({
        trigger: scrollSpacerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: stickyPanelRef.current,
        pinSpacing: false,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(trackEl, { y: -p * overflow });
          gsap.set(greenLineRef.current, {
            scaleY: 1 / steps.length + p * (1 - 1 / steps.length),
          });
          const index = Math.min(
            steps.length - 1,
            Math.floor(p * steps.length)
          );
          if (index !== lastIndex) {
            lastIndex = index;
            steps.forEach((_, i) => applyStepState(i, i <= index));
          }
        },
      });

      ScrollTrigger.refresh();

      const handleResize = () => {
        overflow = setLayout();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        trigger.kill();
        window.removeEventListener("resize", handleResize);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 600);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const spacerHeight = `${steps.length * 100}vh`;

  const inView = useInView(headingRef, {
    once: true,
    margin: "0px 0px -100px 0px",
  });

  const containerVariants: any = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      data-theme="light"
      className="w-full text-black px-5 md:px-10 xl:px-[5.5%] py-[5%] pt-0"
    >
      <motion.div
        ref={headingRef}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="pb-5 md:pb-10 lg:pb-20 relative py-5 md:py-20 px-2 overflow-hidden"
      >
        {/* <div className="grid-line absolute hidden lg:flex left-[65%] top-0 h-full w-px bg-[#E6E6E6]" /> */}

        <motion.div variants={itemVariants}>
          <Badge text="Our Process" className="text-tertiary mb-2" />
        </motion.div>

        <div className="max-w-5xl overflow-hidden">
          <motion.h1
            variants={itemVariants}
            className="text-2xl md:text-3xl font-primary md:text-[40px] font-bold leading-13 tracking-tight"
          >
            <span className="text-[#BFBFBF] font-bold">
              Our process blends{" "}
            </span>
            <span className="inline-block align-middle">
              <RotatingText
                texts={["Creativity", "Technology", "Strategy"]}
                mainClassName="inline-flex bg-[#A4FF00] text-black px-3 py-0 md:py-1 rounded-md ml-2"
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
          </motion.h1>
        </div>
      </motion.div>

      <div ref={scrollSpacerRef} style={{ height: spacerHeight }}>
        <div ref={stickyPanelRef} className="relative max-w-2xl mx-auto">
          <div ref={innerTrackRef} className="relative">
            <div
              className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1.5 origin-top"
              style={{
                background:
                  "linear-gradient(180deg, #FFFFFF 0%, #F3F3F3 100%)",
              }}
            />
            <div
              ref={greenLineRef}
              className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1.5 origin-top"
              style={{
                background:
                  "linear-gradient(180deg, #F3F3F3 10%, #A4FF00 100%)",
              }}
            />

            <div className="flex flex-col gap-10 md:gap-20">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`step-row relative flex items-center ${
                    step.align === "right"
                      ? "flex-row-reverse md:flex-row"
                      : "flex-row-reverse"
                  }`}
                >
                  <div
                    ref={(el) => {
                      iconsRef.current[i] = el;
                    }}
                    className={`hidden step-icon w-1/2 md:flex ${
                      step.align === "right"
                        ? "justify-end pr-12"
                        : "justify-start pl-12"
                    }`}
                  >
                    <img
                      src={step.image || "/images/green-eye.png"}
                      alt={step.title}
                      className="object-contain transition-all duration-500 lg:size-[200px]"
                      style={{ filter: "grayscale(1)", opacity: 0.3 }}
                    />
                  </div>

                  <div
                    className={`step-text flex flex-col gap-5 md:w-1/2 ${
                      i === 0 ? "pt-5 " : ""
                    }${
                      step.align === "right"
                        ? "pl-6 text-left"
                        : "pl-6 md:pr-12 text-left md:text-right items-start md:items-end"
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
                        className="text-xl md:text-2xl font-secondary leading-tight md:leading-7 font-bold transition-colors duration-500"
                        style={{ color: "#9ca3af" }}
                      >
                        {step.title}
                      </h3>
                      <p
                        ref={(el) => {
                          descsRef.current[i] = el;
                        }}
                        className="text-[16px] md:text-lg font-medium leading-relaxed transition-colors duration-500"
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