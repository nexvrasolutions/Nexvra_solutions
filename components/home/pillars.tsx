"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GreenArrow } from "../ui/green-arrow";
import { Badge } from "../ui/badge";

gsap.registerPlugin(ScrollTrigger);

export default function Pillars() {
    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const letters = gsap.utils.toArray(".pillar-letter");

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
                color: "#0A0A0A",
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
    }, []);

    const splitText = (text: string) =>
        text.split("").map((char, i) => (
            <span key={i} className="pillar-letter inline-block">
                {char}
            </span>
        ));

    return (
        <section ref={sectionRef} className="relative bg-gray-50">
            <div className="sticky top-0 h-screen flex flex-col justify-center px-[5%] py-[5%] gap-4">
                {/* badge */}
                <Badge text="Our Core Pillars" className="text-tertiary" />
                <div className="flex gap-10">
                    {/* Image */}
                    <div className="flex-[30%]">
                        <Image
                            src="/images/pillarimage.png"
                            alt="nexvra-solutions-pillars"
                            width={600}
                            height={600}
                            className="w-full h-150 object-contain rounded-sm"
                        />
                    </div>
                    {/* Animated Text */}
                    <div className="flex-[70%] relative">
                        <div className="absolute -left-21 top-10 font-primary font-bold">
                            <h1 className="text-[170px] leading-[182px]">
                                {splitText("Creativity,")}
                            </h1>
                            <h1 className="text-[150px] leading-[182px]">
                                {splitText("Technology,")}
                            </h1>
                            <h1 className="text-[170px] leading-[182px]">
                                {splitText("Solutions.")}
                            </h1>
                        </div>
                    </div>
                </div>
                {/* Arrow */}
                <div className="absolute top-5 right-0">
                    <GreenArrow />
                </div>
            </div>
        </section>
    );
}