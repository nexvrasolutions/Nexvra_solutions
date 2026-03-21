"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // 🧩 GRID LINES (MORE PREMIUM)
            gsap.from(".grid-line", {
                scaleY: 0,
                transformOrigin: "top",
                duration: 1.2,
                stagger: 0.15,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                },
            });

            // 🧩 HEADING (3D WAVE EFFECT)
            gsap.from(".about-heading span", {
                y: 120,
                opacity: 0,
                rotateX: -90,
                transformOrigin: "top",
                stagger: 0.04,
                duration: 1.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: ".about-heading",
                    start: "top 75%",
                },
            });

            // 🧩 PARAGRAPH (LINE REVEAL STYLE)
            gsap.from(".about-text", {
                y: 60,
                opacity: 0,
                filter: "blur(8px)",
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".about-text",
                    start: "top 80%",
                },
            });

            // 🧩 BUTTON POP
            gsap.from(".about-button", {
                scale: 0.8,
                opacity: 0,
                duration: 0.8,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: ".about-button",
                    start: "top 85%",
                },
            });

            // 🧩 IMAGE SCROLL INTERACTION (SCRUB MAGIC)
            gsap.to(".about-image", {
                y: -80,
                rotate: 3,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true, // 🔥 THIS MAKES IT FEEL ALIVE
                },
            });

            // 🧩 FLOAT LOOP (after scroll effect)
            gsap.to(".about-image", {
                y: "-=20",
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const splitText = (text: string) =>
        text.split("").map((char, i) => (
            <span key={i} className="inline-block">
                {char}
            </span>
        ));

    return (
        <section
            ref={sectionRef}
            className="relative bg-black text-white px-[5.5%] pt-28 overflow-hidden"
        >
            {/* Grid lines */}
            <div className="grid-line absolute left-[5%] top-0 h-full w-px bg-grid" />
            <div className="grid-line absolute left-[50%] top-0 h-full w-px bg-grid" />
            <div className="grid-line absolute right-[5%] top-0 h-full w-px bg-grid" />

            <div className="relative z-10 w-full container mx-auto grid grid-cols-2 gap-8 items-center">
                {/* LEFT IMAGE */}
                <div className="relative flex flex-col gap-4 justify-center">
                    <Badge text="About Nexvra" />
                    <div className="relative mx-auto about-image">
                        <Image
                            src="/images/rocket.png"
                            alt="about-image"
                            width={550}
                            height={600}
                            className="object-contain"
                            priority
                        />
                        {/* Gradient Overlay */}
                        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[20%] bg-[linear-gradient(180deg,rgba(10,10,10,0)_0%,#0A0A0A_100%)]" />
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="flex flex-col gap-8">
                    {/* Heading */}
                    <h2 className="about-heading font-primary text-white font-bold text-[54px] leading-[1.1]">
                        {splitText("Turning Bold Ideas Into")}
                        <br />
                        {splitText(" Intelligent Solutions")}
                    </h2>

                    {/* Description */}
                    <p className="about-text text-white/80 font-medium text-xl leading-relaxed">
                        Nexvra Solutions is a forward-thinking technology company dedicated
                        to creating impactful innovations. With a unique blend of creativity
                        and cutting-edge technology, we help businesses adapt, grow, and
                        lead in the digital era.
                    </p>

                    {/* Button */}
                    <div className="about-button">
                        <Button title="Explore Courses" />
                    </div>
                </div>
            </div>
        </section>
    );
}
