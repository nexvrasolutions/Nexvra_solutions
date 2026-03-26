"use client";
import HeroLayout from '../layout/hero-layout'
import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CourseHero = () => {
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

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
                            text={"Beginner to Advanced "}
                            className="hero-badge"
                        />

                        <h1 className="hero-title text-[#FFFFFF] text-[55px] leading-[1.1] font-bold font-primary">
                            {splitText("AI-Powered UX & UI ")}
                            <br />
                            {splitText("Design")}
                        </h1>
                        <div className='flex justify-between items-center mt-10 w-[70%]'>
                            <div className='space-y-3'>
                                <p className='font-medium text-lg text-gray-500'>Duration</p>
                                <h5 className='font-bold text-xl text-white'>3 Months</h5>
                            </div>
                            <div className='space-y-3'>
                                <p className='font-medium text-lg text-gray-500'>Duration</p>
                                <h5 className='font-bold text-xl text-white'>3 Months</h5>
                            </div>
                            <div className='space-y-3'>
                                <p className='font-medium text-lg text-gray-500'>Duration</p>
                                <h5 className='font-bold text-xl text-white'>3 Months</h5>
                            </div>
                        </div>
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
                        </div>
                    </div>
                </div>
            </div>
           
        </HeroLayout>
    )
}

export default CourseHero