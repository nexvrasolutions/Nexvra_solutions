"use client";

import ContentSection from "@/components/common/content-section";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CoursePage = () => {
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Designing", "Development", "Marketing"];

    const courses = [
        { title: "AI UX/UI Design", category: "Designing" },
        { title: "Figma Mastery", category: "Designing" },

        { title: "React Development", category: "Development" },
        { title: "Next.js Fullstack", category: "Development" },

        { title: "SEO Mastery", category: "Marketing" },
        { title: "Social Media Marketing", category: "Marketing" },
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
                    transition={{ duration: 0.5, ease: "easeInOut" }}
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
                                        duration: 0.4,
                                        ease: [0.25, 1, 0.5, 1],
                                    }}
                                    whileHover={{ y: -6 }}
                                >
                                    <Card course={course} />
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