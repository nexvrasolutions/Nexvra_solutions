"use client";

import React, { useRef } from 'react'
import { Badge } from '../ui/badge'
import { Highlighter } from '../ui/highlighter'
import { motion, useInView } from "framer-motion";

const AboutContent = () => {

    const sectionRef = useRef(null);

    const inView = useInView(sectionRef, {
        once: true,
        margin: "0px 0px -100px 0px",
    });

    const containerVariants : any = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants : any = {
        hidden: {
            y: 60,
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 1.1,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const content = [
        `At Nexvra Solutions, we don’t just build digital products — we build solutions that create real impact.`,
        `We are a modern digital company focused on two core areas: skill development and digital solutions. Our mission is to help individuals gain practical, industry-relevant skills while helping businesses build powerful and effective digital presence.`,
        `We believe that learning should go beyond theory. That’s why our approach is built on real-world experience, hands-on training, and problem-solving. Every project we work on and every skill we teach is designed to deliver meaningful results.`,
        `From UI/UX design and website development to mobile applications and digital marketing, we combine creativity, technology, and strategy to create solutions that are not only visually appealing but also highly functional.`,
        `We work closely with our clients to understand their goals and transform their ideas into scalable digital products. At the same time, we guide students step-by-step to build confidence and become industry-ready.`,
        `At Nexvra, we are more than a solutions provider — we are innovators, creators, and partners in progress. We thrive on pushing boundaries and building future-ready solutions.`,
        `At Nexvra, everything we do is driven by one simple goal — to create value, inspire growth, and build a strong digital future.`
    ];

    return (
        <section
            ref={sectionRef}
            className="relative bg-black text-white px-5 md:px-10 xl:px-[5.5%] py-10 md:py-[5%] overflow-hidden min-h-[50vh]"
        >
            {/* Grid lines */}
            <div className="grid-line absolute left-[4%] md:left-[5%] top-0 h-full w-px bg-grid" />
            <div className="grid-line absolute hidden lg:flex left-[50%] top-0 h-full w-px bg-grid" />
            <div className="grid-line absolute right-[4%] md:right-[5%] top-0 h-full w-px bg-grid" />

            <div className="relative z-10 w-full container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                {/* LEFT SIDE */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="relative flex flex-col justify-start items-start h-full"
                >
                    <motion.div variants={itemVariants}>
                        <Badge text="About Nexvra" />
                    </motion.div>

                    <motion.h2
                        variants={itemVariants}
                        className="about-heading font-primary text-white font-bold text-[26px] md:text-[45px] leading-[1.3] w-full lg:w-[90%]"
                    >
                        Turning Bold Ideas Into
                        Intelligent Solutions
                    </motion.h2>
                </motion.div>

                {/* RIGHT SIDE */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="flex flex-col gap-5 lg:mt-15"
                >
                    {content.map((item, index) => {
                        const parts = item.split(
                            /(\*\*.*?\*\*|__.*?__|~~.*?~~|\+\+.*?\+\+|\(\(.*?\)\)|--.*?--)/g
                        );

                        return (
                            <div key={index} style={{ overflow: "hidden" }}>
                                <motion.p
                                    variants={itemVariants}
                                    className="about-text text-white/80 font-medium text-xl leading-relaxed"
                                >
                                    {parts.map((part, i) => {

                                        if (part.startsWith("**") && part.endsWith("**")) {
                                            return (
                                                <Highlighter key={i} action="highlight" color="#A4FF00">
                                                    <span className="text-black">
                                                        {part.replace(/\*\*/g, "")}
                                                    </span>
                                                </Highlighter>
                                            );
                                        }

                                        if (part.startsWith("__") && part.endsWith("__")) {
                                            return (
                                                <Highlighter key={i} action="underline" color="#A4FF00">
                                                    {part.replace(/__/g, "")}
                                                </Highlighter>
                                            );
                                        }

                                        if (part.startsWith("~~") && part.endsWith("~~")) {
                                            return (
                                                <Highlighter key={i} action="strike-through" color="#A4FF00">
                                                    {part.replace(/~~/g, "")}
                                                </Highlighter>
                                            );
                                        }

                                        if (part.startsWith("++") && part.endsWith("++")) {
                                            return (
                                                <Highlighter key={i} action="box" color="#A4FF00">
                                                    {part.replace(/\+\+/g, "")}
                                                </Highlighter>
                                            );
                                        }

                                        if (part.startsWith("((") && part.endsWith("))")) {
                                            return (
                                                <Highlighter key={i} action="circle" color="#A4FF00">
                                                    {part.replace(/\(\(|\)\)/g, "")}
                                                </Highlighter>
                                            );
                                        }

                                        if (part.startsWith("--") && part.endsWith("--")) {
                                            return (
                                                <Highlighter key={i} action="bracket" color="#A4FF00">
                                                    {part.replace(/--/g, "")}
                                                </Highlighter>
                                            );
                                        }

                                        return part;
                                    })}
                                </motion.p>
                            </div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    )
}

export default AboutContent;
