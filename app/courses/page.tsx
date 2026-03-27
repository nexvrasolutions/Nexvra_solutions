"use client";

import ContentSection from "@/components/common/content-section";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const courses = [
    {
        title: "AI-Powered Product Design",
        slug: "ai-powered-product-design",
        category: "UI/UX Design",
        duration: "3 Months",
        difficulty: "Beginner Friendly",
        img: "/images/courses/product_design.webp",
        description:
            "Learn complete product design including UX research, UI design, and AI tools to create modern apps and websites.",
    },
    {
        title: "UX Design",
        slug: "ux-design",
        category: "UI/UX Design",
        duration: "2 Months",
        difficulty: "Beginner Friendly",
        img: "/images/courses/ux_design.webp",
        description:
        "Understand user behavior, research, and wireframing to create better user experiences.",
    },
    {
        title: "UI Design",
        slug: "ui-design",
        category: "UI/UX Design",
        duration: "2 Months",
        difficulty: "Beginner Friendly",
        img: "/images/courses/ui_design.webp",
        description:
        "Learn to design visually appealing interfaces using modern tools and design principles.",
    },
    {
        title: "Digital Marketing Mastery",
        slug: "digital-marketing-mastery",
        category: "Digital Marketing",
        duration: "2 Months",
        difficulty: "Beginner Friendly",
        img: "/images/courses/degital_marketing.webp",
        description:
        "Master social media marketing, ads, and content strategies to grow businesses online.",
    },
    {
        title: "Branding & Graphic Design",
        slug: "branding-graphic-design",
        category: "UI/UX Design",
        duration: "2–3 Months",
        difficulty: "Beginner Friendly",
        img: "/images/courses/branding.webp",
        description:
        "Learn logo design, brand identity, and social media creatives to build strong brands.",
    },
    {
        title: "Front-End Development",
        slug: "front-end-development",
        category: "Development",
        duration: "3 Months",
        difficulty: "Beginner Friendly",
        img: "/images/courses/front_end.webp",
        description:
        "Learn HTML, CSS, and basic JavaScript to build modern and responsive websites.",
    },
    {
        title: "Back-End Development",
        slug: "back-end-development",
        category: "Development",
        duration: "3–4 Months",
        difficulty: "Intermediate",
        img: "/images/courses/back-end.webp",
        description:
        "Learn server-side development, databases, and APIs to build powerful web applications.",
    },
    {
        title: "Mobile App Development",
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

    return (
        <>
            <ContentSection
                title="Courses"
                description="Each project reflects our passion for blending creativity, technology, and strategy."
                image="/images/about-bg.jpg"
            />

            <section className="bg-[#F3F3F3] flex flex-col gap-12 px-[5.5%] py-[5%]">

                <div className="flex gap-8 items-center text-xl font-medium flex-wrap">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`relative pb-1 transition ${activeCategory === cat
                                ? "text-black"
                                : "text-gray-400"
                                }`}
                        >
                            {cat}

                            {activeCategory === cat && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute left-0 -bottom-1 h-0.5 w-full bg-black"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* 🔥 COURSES GRID */}
                <motion.div
                    layout
                    transition={{ duration: 0.35 }}
                >
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 items-stretch"
                    >
                        <AnimatePresence mode="wait">
                            {filteredCourses.map((course, index) => (
                                <motion.div
                                    key={course.title + index}
                                    layout
                                    className="h-full flex"
                                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.85 }}
                                    transition={{
                                        duration: 0.35,
                                        ease: [0.25, 1, 0.5, 1],
                                    }}
                                    whileHover={{ y: -6 }}
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