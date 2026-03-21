"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../ui/badge";
import HexQuad from "../ui/hex-quad";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sections = [
    {
        id: 0,
        title: "Innovative Approach",
        img: "/images/green-eye.png",
        desc: "To deliver transformative digital solutions that combine creativity, technology, and strategy — empowering businesses to innovate with confidence and achieve meaningful results.",
    },
    {
        id: 1,
        title: "Trusted Expertise",
        img: "/images/green-eye.png",
        desc: "We bring years of industry expertise and proven strategies to deliver reliable and scalable solutions.",
    },
    {
        id: 2,
        title: "Future-Ready Solutions",
        img: "/images/green-eye.png",
        desc: "Our solutions are designed to scale and adapt with emerging technologies and business needs.",
    },
    {
        id: 3,
        title: "Impact-Driven",
        img: "/images/green-eye.png",
        desc: "We focus on measurable outcomes that drive real business impact and growth.",
    },
];

export default function WhyChooseNexvra() {

    const [active, setActive] = useState(0);
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const stickyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const triggers: ScrollTrigger[] = [];

        sectionRefs.current.forEach((el, i) => {
            if (!el) return;

            const trigger = ScrollTrigger.create({
                trigger: el,
                start: "top center",
                end: "bottom center",
                onEnter: () => setActive(i),
                onEnterBack: () => setActive(i),
            });

            triggers.push(trigger);
        });

        return () => triggers.forEach((t) => t.kill());
    }, []);

    return (
        <section className="bg-[#F3F3F3] px-[5.5%] pt-[5%]">

            {/* Heading */}
            <div className="text-center flex flex-col items-center justify-center">
                <Badge text="About nexvra" className="text-teritiary" />
                <h1 className="font-primary text-teritiary text-[64px] font-bold leading-20">
                    <span className="text-[#BFBFBF]">Why Choose</span>
                    <br />
                    <span>Nexvra?</span>
                </h1>
            </div>

            <div className="relative" style={{ height: `${sections.length * 100}vh` }}>
                <div
                    ref={stickyRef}
                    className="sticky top-0 h-screen flex items-center"
                >
                    <div className="grid md:grid-cols-2 w-full gap-10 items-center border border-[#E6E6E6] p-5 relative">
                        <div className="h-full w-full flex items-center justify-center">
                            <HexQuad active={active} setActive={setActive} />
                        </div>
                        <div className="absolute bg-[#E6E6E6] translate-x-1/2 left-1/2 w-px h-full" />
                        <AnimatePresence mode="wait">
                            <div className="flex items-center justify-center">
                                <motion.div
                                    key={active}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -40 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex flex-col gap-5 items-start"
                                >
                                    <motion.img
                                        src={sections[active].img}
                                        alt="icon"
                                        className="size-60 object-cover mx-auto md:mx-0"
                                    />
                                    <h3 className="text-4xl text-tertiary font-secondary font-bold">
                                        {sections[active].title}
                                    </h3>
                                    <p className="font-secondary text-xl leading-7 text-[#BFBFBF] max-w-md">
                                        {sections[active].desc}
                                    </p>
                                </motion.div>
                            </div>
                        </AnimatePresence>
                    </div>
                </div>
                <div className="absolute inset-0 pointer-events-none">
                    {sections.map((_, i) => (
                        <div
                            key={i}
                            ref={(el) => { sectionRefs.current[i] = el; }}
                            style={{ height: `${100 / sections.length}%` }}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}