"use client";

import React, { useEffect, useRef } from "react";
import { Badge } from "../ui/badge";
import { Arrow } from "../ui/arrow";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


const DetailContent = ({ course }: { course: any }) => {
    const sectionRef = useRef(null);

    const inView = useInView(sectionRef, {
        once: true,
        margin: "-100px",
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
        hidden: {
            y: 100,
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const listVariants: any = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.2,
            },
        },
    };

    useEffect(() => {
        const ctx = gsap.context(() => {

            // scroll parallax on the outer wrapper
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

            // float on the inner wrapper so it doesn't fight the scroll tween's y
            gsap.to(".float-image", {
                y: -20,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            data-theme="light"
            className="w-full bg-white px-5 md:px-10 xl:px-[5.5%] py-8"
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
            >
                {/* TOP GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 py-4 md:py-10">
                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl md:text-3xl font-primary font-semibold text-tertiary">
                            Course Overview
                        </h2>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <p className="text-gray-600 text-xl font-medium leading-relaxed">
                            {course.overview}
                        </p>
                    </motion.div>
                </div>

                {/* WHAT YOU'LL LEARN */}
                <div className="flex items-center flex-col justify-center pt-8 md:pt-15">
                    <motion.div
                        variants={itemVariants}
                        className="space-y-3 flex flex-col items-center"
                    >
                        <Badge text="About Nexvra" className="text-tertiary" />

                        <h1 className="text-3xl md:text-[50px] font-bold leading-[54px] tracking-tight">
                            <span className="text-black">What You'll Learn</span>
                        </h1>
                    </motion.div>

                    <div className="relative w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 pt-0 md:pt-10 gap-2 md:gap-6 lg:gap-0 min-h-auto md:min-h-[500px]">

                            {/* IMAGE */}
                            <motion.div
                                variants={itemVariants}
                                className="relative about-image w-full h-75 md:h-125 order-1 overflow-hidden"
                            >
                                {/* inner wrapper for the float animation — keeps y independent of scroll parallax */}
                                <div className="float-image absolute inset-0">
                                    <img
                                        src="/images/what-learn.png"
                                        alt="What you'll learn illustration"
                                        className="absolute inset-0 w-full h-full object-contain object-center"
                                    />
                                </div>
                                {/* Gradient Overlay */}
                                <div
                                    className="pointer-events-none absolute bottom-0 left-0 w-full h-[55%] z-10"
                                    style={{
                                        background:
                                            "linear-gradient(180deg, rgba(255,255,255,0) 33.55%, #FFFFFF 94.69%)",
                                    }}
                                />
                            </motion.div>

                            {/* LEARN LIST */}
                            <motion.div
                                variants={listVariants}
                                className="flex flex-col justify-center md:justify-start px-2 sm:px-6 md:px-8 lg:px-12 py-4 md:py-10 gap-3 md:gap-4 order-2"
                            >
                                {course.learn.map((item: string, index: number) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        className="flex items-center gap-3 md:gap-4 group cursor-pointer"
                                    >
                                        <Arrow className="bg-[#f5f5f5] size-8 md:size-10" />
                                        <span className="text-base sm:text-lg md:text-xl font-medium text-tertiary tracking-tight">
                                            {item}
                                        </span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default DetailContent;