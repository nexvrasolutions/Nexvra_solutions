"use client";

import { useEffect, useRef } from "react";
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

    useEffect(() => {
        const ctx = gsap.context(() => {

            // GRID LINES (MORE PREMIUM)
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

            // HEADING (3D WAVE EFFECT)
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

            // PARAGRAPH (LINE REVEAL STYLE)
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

            // BUTTON POP
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

            // IMAGE SCROLL INTERACTION (SCRUB MAGIC)
            gsap.to(".about-image", {
                y: -80,
                rotate: 3,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });

            // FLOAT LOOP (after scroll effect)
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
                {char === " " ? "\u00A0" : char}
            </span>
        ));

    return (
        <section
            ref={sectionRef}
            className="relative bg-black text-white px-5 md:px-10 xl:px-[5.5%] md:pt-14 lg:pt-28 pb-5 overflow-hidden"
        >
            {/* Grid lines */}
            <div className="grid-line absolute left-[3%] lg:left-[5%] top-0 h-full w-px bg-grid" />
            <div className="grid-line absolute hidden lg:flex left-[50%] top-0 h-full w-px bg-grid" />
            <div className="grid-line absolute right-[3%] lg:right-[5%] top-0 h-full w-px bg-grid" />

            <div className="relative z-10 w-full container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 xl:gap-8 items-center">
                {/* LEFT IMAGE */}
                <div className="relative flex flex-col gap-4 justify-center">
                    <Badge text="About Nexvra" />
                    <div className="relative mx-auto about-image w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[550px]">

                        <Image
                            src="/images/rocket.png"
                            alt="about-image"
                            width={550}
                            height={600}
                            className="object-contain w-full h-auto 
                            max-h-[250px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[600px]"
                            priority
                        />

                        {/* Gradient Overlay */}
                        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[20%] bg-[linear-gradient(180deg,rgba(10,10,10,0)_0%,#0A0A0A_100%)]" />
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="flex flex-col gap-4 md:gap-6 xl:gap-8">
                    {/* Heading */}
                    <h2 className="about-heading font-primary text-white font-bold text-[21px] sm:text-[26px] md:text-[34px] xl:text-[48px] 2xl:text-[54px] leading-tight md:leading-[1.1]">
                        {splitText("Turning Ideas Into")}{" "}
                        <br className="hidden lg:flex" />
                        {splitText("Digital Reality")}
                    </h2>

                    {/* Description */}
                    <p className="about-text text-white/80 font-medium text-sm md:text-lg xl:text-xl leading-relaxed">
                        Nexvra Solutions is a modern digital training and technology company focused on building real skills and real solutions.
                        We help individuals learn practical digital skills and support businesses in building impactful digital products.
                    </p>

                    {/* Button */}
                    <div className="about-button w-full">
                        <Button label="More About Us" onClick={()=>router.push("/about-us")} />
                    </div>
                </div>
            </div>
        </section>
    );
}
