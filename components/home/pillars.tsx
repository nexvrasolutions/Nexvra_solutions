"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "../ui/badge";

gsap.registerPlugin(ScrollTrigger);

export default function Pillars() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context((self) => {
      const q: any = self.selector;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions!;

          const letters = q(".pillar-letter");

          gsap.fromTo(
            letters,
            {
              y: 60,
              opacity: 0,
              color: "#BFBFBF",
            },
            {
              y: 0,
              opacity: 1,
              color: (i, el) =>
                el.classList.contains("pillar-accent")
                  ? "#A4FF00" : "#0A0A0A",
              stagger: 0.05,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=1200",
                scrub: true,
                pin: true,
                anticipatePin: 1,
              },
            }
          );
        }
      );

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const splitText = (text: string) =>
    text.split("").map((char, i) => {
      const isAccent = char === "," || char === ".";

      return (
        <span
          key={i}
          className={`pillar-letter inline-block ${isAccent ? "pillar-accent" : ""}`}
          style={isAccent ? { color: "#A4FF00" } : {}}
        >
          {char}
        </span>
      );
    });

  return (
    <section ref={sectionRef} className="relative bg-gray-50">
      <div className="sticky top-0 h-screen flex flex-col justify-center px-5 md:px-10 xl:px-[5.5%] py-10 xl:py-[5%] gap-4">
        {/* badge */}
        <Badge text="Our Core Pillars" className="absolute top-7 left-5 z-5 md:relative text-tertiary" />

        {/* ── MOBILE: full-screen image with text on top ── */}
        {/* ── MOBILE LAYOUT ── */}
        <div className="md:hidden flex flex-col h-full">

          {/* TOP HALF IMAGE */}
          <div className="relative w-full h-1/2">
            <Image
              src="/images/home/pillarimage.webp"
              alt="nexvra-solutions-pillars"
              fill
              className="object-cover mt-5"
              priority
            />
          </div>

          {/* BOTTOM HALF TEXT */}
          <div className="h-1/2 flex items-center">
            <div className="font-primary font-bold">
              <h1 className="leading-tight text-[clamp(45px,10vw,80px)]">
                {splitText("Creativity,")}
              </h1>
              <h1 className="leading-tight text-[clamp(45px,10vw,80px)]">
                {splitText("Technology,")}
              </h1>
              <h1 className="leading-tight text-[clamp(45px,10vw,80px)]">
                {splitText("Solutions.")}
              </h1>
            </div>
          </div>
        </div>

        {/* ── SHARED CONTENT ROW ── */}
        <div className="hidden md:flex gap-10">
          {/* Image — hidden on mobile, visible on md+ */}
          <div className="hidden md:block md:flex-[30%]">
            <Image
              src="/images/home/pillarimage.webp"
              alt="nexvra-solutions-pillars"
              width={600}
              height={600}
              className="w-full h-full md:h-150 object-contain rounded-sm"
            />
          </div>

          {/* Animated Text */}
          <div className="flex-[100%] md:flex-[70%] relative z-30">
            <div className="absolute left-0 md:-left-10 lg:-left-20 top-6 lg:top-10 font-primary font-bold">
              <h1 className="leading-tight xl:leading-[182px] text-[clamp(50px,9vw,170px)] md:text-[clamp(50px,9vw,170px)]">
                {splitText("Creativity,")}
              </h1>
              <h1 className="leading-tight xl:leading-[182px] text-[clamp(45px,9vw,150px)] md:text-[clamp(45px,9vw,150px)]">
                {splitText("Technology,")}
              </h1>
              <h1 className="leading-tight xl:leading-[182px] text-[clamp(45px,9vw,150px)] md:text-[clamp(45px,9vw,150px)]">
                {splitText("Solutions.")}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}