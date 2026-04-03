"use client";

import { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Memoized split
  const splitText = useMemo(
    () => (text: string) =>
      text.split("").map((char, i) => (
        <span key={i} className="inline-block">
          {char === " " ? "\u00A0" : char}
        </span>
      )),
    []
  );

  useEffect(() => {
    if (!sectionRef.current) return;

    // Accessibility
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context((self) => {
      const q : any = self.selector;

      // GRID LINES
      gsap.from(q(".grid-line"), {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      // HEADING
      gsap.from(q(".about-heading span"), {
        y: 100,
        opacity: 0,
        rotateX: -70,
        transformOrigin: "top",
        stagger: 0.035,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: q(".about-heading"),
          start: "top 75%",
        },
      });

      // TEXT
      gsap.from(q(".about-text"), {
        y: 40,
        opacity: 0,
        // ⚠️ blur is expensive → reduce
        filter: "blur(4px)",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: q(".about-text"),
          start: "top 80%",
        },
      });

      // BUTTON
      gsap.from(q(".about-button"), {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: q(".about-button"),
          start: "top 85%",
        },
      });

      // IMAGE SCROLL (main animation)
      gsap.to(q(".about-image"), {
        y: -60,
        rotate: 2,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      // FLOAT (only AFTER scroll ends → no conflict)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "bottom center",
        onEnter: () => {
          gsap.to(q(".about-image"), {
            y: "-=15",
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white px-5 md:px-10 xl:px-[5.5%] py-[10%] md:pt-14 lg:pt-28 pb-5 overflow-hidden"
    >
      {/* Grid lines */}
      <div className="grid-line absolute left-[3%] lg:left-[5%] top-0 h-full w-px bg-grid" />
      <div className="grid-line absolute hidden lg:flex left-[50%] top-0 h-full w-px bg-grid" />
      <div className="grid-line absolute right-[3%] lg:right-[5%] top-0 h-full w-px bg-grid" />

      <div className="relative z-10 w-full container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 xl:gap-8 items-center">
        
        {/* LEFT */}
        <div className="flex flex-col gap-4 justify-center">
          <Badge text="About Nexvra" />

          <div className="relative mx-auto about-image w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[550px] will-change-transform">
            <Image
              src="/images/rocket.png"
              alt="about-image"
              width={550}
              height={600}
              className="object-contain w-full h-auto 
              max-h-[250px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[600px]"
              priority
            />

            {/* Gradient */}
            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[20%] bg-[linear-gradient(180deg,rgba(10,10,10,0)_0%,#0A0A0A_100%)]" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4 md:gap-6 xl:gap-8">
          
          <h2 className="about-heading font-primary font-bold text-[21px] sm:text-[26px] md:text-[34px] xl:text-[48px] 2xl:text-[54px] leading-tight md:leading-[1.1]">
            {splitText("Turning Ideas Into")}{" "}
            <br className="hidden lg:flex" />
            {splitText("Digital Reality")}
          </h2>

          <p className="about-text text-white/80 font-medium text-sm md:text-lg xl:text-xl leading-relaxed">
            Nexvra Solutions is a modern digital training and technology company focused on building real skills and real solutions.
            We help individuals learn practical digital skills and support businesses in building impactful digital products.
          </p>

          <div className="about-button w-full pb-5 md:pb-0">
            <Button
              label="More About Us"
              onClick={() => router.push("/about-us")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}