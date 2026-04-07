"use client";

import HeroLayout from "../layout/hero-layout";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);

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
        if (!heroRef.current) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const ctx = gsap.context((self) => {
            const q: any = self.selector;

            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
            });

            tl.from(q(".hero-badge"), {
                y: 40,
                opacity: 0,
                duration: 0.6,
            })
                .from(
                    q(".hero-title span"),
                    {
                        y: 60,
                        opacity: 0,
                        stagger: 0.025,
                        duration: 0.7,
                        willChange: "transform",
                    },
                    "-=0.3"
                )
                .from(
                    q(".hero-text"),
                    {
                        y: 30,
                        opacity: 0,
                        duration: 0.5,
                    },
                    "-=0.4"
                )
                .fromTo(
                    q(".hero-btn > *"),
                    { y: 20, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.12,
                        duration: 0.4,
                    },
                    "-=0.4"
                );

            gsap.to(q(".hero-media"), {
                y: 80,
                ease: "none",
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.8,
                },
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <HeroLayout hero={true}>
            <div
                ref={heroRef}
                className="relative z-10 w-full px-4 sm:px-10 xl:px-[5.5%] flex items-center"
            >
                <div className="grid grid-cols-1 lg:grid-cols-5 w-full lg:min-h-[70vh] xl:min-h-[90vh] pt-20 xl:pt-45">

                    {/* LEFT */}
                    <div className="flex flex-col lg:col-span-3 lg:pb-40 w-full lg:w-[90%]">
                        <Badge
                            text="Digital Training & Solutions"
                            className="hero-badge"
                        />

                        <h1
                            className="
                hero-title text-white font-bold font-primary
                text-[26px] md:text-[38px] xl:text-[46px] 2xl:text-[60px]
                leading-tight md:leading-[1.2] mb-5
              "
                        >
                            {splitText("Build Skills.")}
                            <br />
                            {splitText("Build Digital Solutions.")}
                        </h1>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col justify-center col-span-2 lg:ml-6 xl:ml-8">
                        <p
                            className="
                hero-text text-secondary font-medium font-secondary
                text-[16px] xl:text-lg
                leading-relaxed mb-6 lg:mb-10
              "
                        >
                            Learn industry-ready digital skills and build real-world projects with Nexvra Solutions.
                            We help students start careers and help businesses create powerful digital experiences.
                        </p>

                        <div className="flex flex-col w-full md:flex-row lg:flex-col xl:flex-row gap-4 sm:gap-6 hero-btn">
                            <a href="/courses" className="w-full md:w-auto ">
                                <Button label="Explore Courses" className="w-full" />
                            </a>
                            <a href="/solutions" className="hero-btn-item border border-secondary text-secondary px-6 py-3 rounded-xs font-medium hover:bg-white transition text-center duration-500 hover:text-black ease-in-out" >
                                Our Solutions
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* MEDIA */}
            <div className="relative w-full pt-10 lg:pt-20 px-5 md:px-10 xl:px-[5.5%]">

                {/* Video Container */}
                <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] overflow-hidden rounded-sm">

                    {/* Video */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="/video/video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    {/* Overlay (dark gradient for readability) */}
                    <div className="absolute inset-0 bg-black/40" />
                    
                </div>
            </div>
            {/* <div className="flex px-5 md:px-10 xl:px-[5.5%] relative z-10 pt-10 lg:pt-20">
                <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px]">
                    <Image
                        src="/images/vido.gif"
                        alt="hero-media"
                        fill
                        priority
                        className="hero-media object-cover"
                    />
                </div>
            </div> */}
        </HeroLayout>
    );
}