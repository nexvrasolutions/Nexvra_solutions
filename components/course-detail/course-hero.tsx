"use client";
import HeroLayout from '../layout/hero-layout'
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useInView } from "framer-motion";
import { EnrollModal } from '../ui/enroll-modal';

gsap.registerPlugin(ScrollTrigger);

const CourseHero = ({ course }: { course: any }) => {
    
    const heroRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    const isInView = useInView(heroRef, {
        once: true,
        margin: "-100px",
    });

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

    const containerVariants: any = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
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

    const innerContainer: any = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.2,
            },
        },
    };

    const splitText = (text: string) =>
        text.split("").map((char, i) => (
            <span key={i} className="inline-block">
                {char === " " ? "\u00A0" : char}
            </span>
        ));
    return (
        <HeroLayout>
            <motion.div
                ref={heroRef}
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="relative z-10 w-full px-5 md:px-10 xl:px-[5.5%] flex items-center"
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-15 xl:gap-20 w-full lg:min-h-[90vh] pt-30 lg:pt-45 pb-[10%] lg:pb-0">
                    {/* LEFT CONTENT */}
                    <div className="flex flex-col lg:col-span-2 pb-10 lg:pb-50">
                        <motion.div variants={itemVariants}>
                            <Badge text={course.level} className="hero-badge" />
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="hero-title text-[#FFFFFF] text-[30px] md:text-[33px] lg:text-[38px] xl:text-[48px] leading-[1.1] font-bold font-primary"
                        >
                            {splitText(course.title)}
                        </motion.h1>
                        <motion.div
                            variants={innerContainer}
                            className='flex justify-between items-center mt-10 w-full md:w-[70%]'
                        >
                            <motion.div variants={itemVariants} className='space-y-3'>
                                <p className='font-medium text-lg text-gray-500'>Duration</p>
                                <h5 className='font-bold text-xl text-white'>{course.duration}</h5>
                            </motion.div>
                            <motion.div variants={itemVariants} className='space-y-3'>
                                <p className='font-medium text-lg text-gray-500'>Batch</p>
                                <h5 className='font-bold text-xl text-white'>{course.batch}</h5>
                            </motion.div>
                            <motion.div variants={itemVariants} className='space-y-3'>
                                <p className='font-medium text-lg text-gray-500'>Mode</p>
                                <h5 className='font-bold text-xl text-white'>{course.mode}</h5>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="flex flex-col justify-center">
                        <p className="hero-text text-secondary text-lg md:text-[20px] font-medium font-secondary leading-relaxed mb-10">
                            {course.description}
                        </p>

                        <div className="flex gap-6 hero-btn">
                            <Button 
                                label="Enroll Course"  
                                onClick={ ()=>{
                                    setSelectedCourse(course.title)
                                    setOpen(true)
                                    }
                                }
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
            <EnrollModal
                isOpen={open}
                onClose={() => setOpen(false)}
                selectedCourse={selectedCourse}
            />
        </HeroLayout >
    )
}

export default CourseHero