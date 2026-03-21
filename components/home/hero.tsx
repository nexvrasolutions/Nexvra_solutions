"use client";

import Link from "next/link";
import HeroLayout from "../layout/hero-layout";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // 🔥 ENTRY ANIMATION (clean + premium)
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.from(".hero-badge", {
                y: 40,
                opacity: 0,
                duration: 0.6,
            })
                .from(".hero-title span", {
                    y: 60,
                    opacity: 0,
                    stagger: 0.03,
                    duration: 0.8,
                    ease: "power4.out",
                }, "-=0.3")
                .from(".hero-text", {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                }, "-=0.4")
                .from(".hero-btn", {
                    y: 20,
                    opacity: 0,
                    stagger: 0.15,
                    duration: 0.5,
                }, "-=0.4");

            gsap.to(".hero-media", {
                y: 100,
                ease: "none",
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                },
            });

        }, heroRef);

        return () => ctx.revert();
    }, []);

    const splitText = (text: string) =>
        text.split("").map((char, i) => (
            <span key={i} className="inline-block">
                {char === " " ? "\u00A0" : char}
            </span>
        ));

    return (
        <HeroLayout>
            <div
                ref={heroRef}
                className="relative z-10 w-full px-[5.5%] flex items-center"
            >
                <div className="grid grid-cols-3 gap-20 w-full  min-h-[90vh] pt-45">
                    {/* LEFT CONTENT */}
                    <div className="flex flex-col col-span-2 pb-50">
                        <Badge
                            text={"Digital Training & Solutions"}
                            className="hero-badge"
                        />

                        <h1 className="hero-title text-[#FFFFFF] text-[70px] leading-[1.1] font-bold font-primary">
                            {splitText("Build Skills.")}
                            <br />
                            {splitText("Build Digital Solutions.")}
                        </h1>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="flex flex-col justify-center">
                        <p className="hero-text text-secondary text-[20px] font-medium font-secondary leading-relaxed mb-10">
                            Nexvra Solutions empowers individuals and businesses through
                            comprehensive digital training programs and innovative
                            technology solutions.
                        </p>

                        <div className="flex gap-6 hero-btn">
                            <Button label="Explore Courses" />

                            <Link
                                href="/solutions"
                                className="border border-secondary text-secondary px-6 py-3 rounded-md hover:border-white transition"
                            >
                                Our Solutions
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* MEDIA */}
            <div className="flex px-[5.5%] relative z-10 pt-20">
                <img
                    src="/images/vido.gif"
                    alt="gif-video"
                    className="hero-media h-[550px] w-full object-cover rounded-xl"
                />
            </div>
        </HeroLayout>
    );
}