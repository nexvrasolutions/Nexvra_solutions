"use client";

import ContentSection from "@/components/common/content-section";
import { Card } from "@/components/ui/card";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const courses = [
    {
      title: ["AI-Powered Product", "Design"],
      slug: "ai-powered-product-design",
      category: "UI/UX Design",
      duration: "3 Months",
      difficulty: "Beginner Friendly",
      img: "/images/courses/product_design.webp",
      description:
        "Learn complete product design including UX research, UI design, and AI tools to create modern apps and websites.",
    },
    {
      title: ["UX", "Design"],
      slug: "ux-design",
      category: "UI/UX Design",
      duration: "2 Months",
      difficulty: "Beginner Friendly",
      img: "/images/courses/ux_design.webp",
      description:
        "Understand user behavior, research, and wireframing to create better user experiences.",
    },
    {
      title: ["UI", "Design"],
      slug: "ui-design",
      category: "UI/UX Design",
      duration: "2 Months",
      difficulty: "Beginner Friendly",
      img: "/images/courses/ui_design.webp",
      description:
        "Learn to design visually appealing interfaces using modern tools and design principles.",
    },
    {
      title: ["Digital Marketing", "Mastery"],
      slug: "digital-marketing-mastery",
      category: "Digital Marketing",
      duration: "2 Months",
      difficulty: "Beginner Friendly",
      img: "/images/courses/degital_marketing.webp",
      description:
        "Master social media marketing, ads, and content strategies to grow businesses online.",
    },
    {
      title: ["Branding & Graphic", "Design"],
      slug: "branding-graphic-design",
      category: "UI/UX Design",
      duration: "2–3 Months",
      difficulty: "Beginner Friendly",
      img: "/images/courses/branding.webp",
      description:
        "Learn logo design, brand identity, and social media creatives to build strong brands.",
    },
    {
      title: ["Front-End", "Development"],
      slug: "front-end-development",
      category: "Development",
      duration: "3 Months",
      difficulty: "Beginner Friendly",
      img: "/images/courses/front_end.webp",
      description:
        "Learn HTML, CSS, and basic JavaScript to build modern and responsive websites.",
    },
    {
      title: ["Back-End", "Development"],
      slug: "back-end-development",
      category: "Development",
      duration: "3–4 Months",
      difficulty: "Intermediate",
      img: "/images/courses/back-end.webp",
      description:
        "Learn server-side development, databases, and APIs to build powerful web applications.",
    },
    {
      title: ["Mobile App", "Development"],
      slug: "mobile-app-development",
      category: "Development",
      duration: "3 Months",
      difficulty: "Beginner Friendly",
      img: "/images/courses/app.webp",
      description:
        "Build mobile applications with smooth performance and real-world functionality.",
    },
  ];

const CoursePage = () => {

    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, {
        once: true,
        margin: "0px 0px -100px 0px",
    });

    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = [
        "All",
        "UI/UX Design",
        "Digital Marketing",
        "Development",
    ];

    const filteredCourses =
        activeCategory === "All"
            ? courses
            : courses.filter((course) => course.category === activeCategory);

    const containerVariants : any = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.5,
            },
        },
    };

    const itemVariants : any = {
        hidden: {
            y: 60,
            opacity: 0,
            scale: 0.95,
        },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <>
            <ContentSection
                title="Courses"
                description="Each project reflects our passion for blending creativity, technology, and strategy."
                image="/images/about-bg.jpg"
            />

            <section
                ref={sectionRef}
                className="bg-[#F3F3F3] flex flex-col gap-12 px-[5.5%] py-[5%]"
            >

                {/* FILTER */}
                <div className="w-full overflow-hidden">
                    <nav className="flex lg:flex-wrap gap-3 lg:gap-8 overflow-x-auto lg:overflow-visible no-scrollbar">
                        {categories.map((cat, i) => (
                            <button
                                key={cat}
                                ref={(el) => {
                                    buttonRefs.current[i] = el;
                                }}
                                onClick={() => {
                                    setActiveCategory(cat);

                                    const currentEl = buttonRefs.current[i];
                                    if (currentEl) {
                                        currentEl.scrollIntoView({
                                            behavior: "smooth",
                                            inline: "center",
                                            block: "nearest",
                                        });
                                    }
                                }}
                                className={` whitespace-nowrap px-4 py-2 rounded-xs lg:rounded-none text-sm md:text-base lg:text-xl transition-all duration-200
          ${activeCategory === cat
                                        ? "bg-black text-white lg:bg-transparent lg:text-black lg:font-semibold"
                                        : "bg-gray-200 text-gray-500 lg:bg-transparent hover:text-gray-700"
                                    }
        `}
                            >
                                {cat}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* COURSES GRID */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 items-stretch"
                    >
                        <AnimatePresence mode="wait">
                            {filteredCourses.map((course, index) => (
                                <motion.div
                                    key={course.slug + index}
                                    layout
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{
                                        opacity: 0,
                                        y: 20,
                                        scale: 0.9,
                                        transition: { duration: 0.25 },
                                    }}
                                    whileHover={{ y: -6 }}
                                    className="h-full flex"
                                >
                                    <Card course={course} className="2xl:w-full" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </section>
        </>
    );
};

export default CoursePage;
