"use client";

import React, { useRef } from "react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Card } from "../ui/card";
import { motion, useInView } from "framer-motion";

const courses = [
  {
    title: ["AI-Powered Product", "Design"],
    duration: "3 Months",
    slug: "ai-powered-product-design",
    difficulty: "Beginner Friendly",
    img: "/images/courses/product_design.webp",
  },
  {
    title: ["Digital Marketing", "Mastery"],
    slug: "digital-marketing-mastery",
    duration: "2 Months",
    img: "/images/courses/degital_marketing.webp",
    difficulty: "Beginner Friendly",
  },
  {
    title: ["Branding & Graphic", "Design"],
    slug: "branding-graphic-design",
    duration: "2-3 Months",
    img: "/images/courses/branding.webp",
    difficulty: "Beginner Friendly",
  },
  {
    title: ["Front-End", "Development"],
    slug: "front-end-development",
    duration: "3 Months",
    img: "/images/courses/front_end.webp",
    difficulty: "Beginner Friendly",
  },
];

const headerVariants: any = {
  hidden: { y: 100 },
  visible: {
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const linkVariants: any = {
  hidden: { y: 100 },
  visible: {
    y: 0,
    transition: { duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardContainerVariants: any = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: any = {
  hidden: { y: 100 },
  visible: {
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function FeaturedCourses() {
  const headerRef = useRef(null);
  const cardsRef = useRef(null);

  // No once: true — re-triggers every time user visits the section
  const headerInView = useInView(headerRef, { amount: 0, margin: "0px 0px -100px 0px" });
  const cardsInView = useInView(cardsRef, { amount: 0, margin: "0px 0px -50px 0px" });

  return (
    <div style={{ overflow: "hidden" }}>
      <section className="relative bg-[#F3F3F3] min-h-[70vh] px-5 md:px-10 lg:px-[3%] 2xl:px-[5.5%] py-[10%]">

        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row items-start gap-3 md:gap-0 md:items-center justify-between mb-5 md:mb-10 lg:mb-15">

          {/* Badge + Title */}
          <div style={{ overflow: "hidden" }}>
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate={headerInView ? "visible" : "hidden"}
            >
              <Badge text="Our Courses" className="text-tertiary mb-3 lg:mb-5" />
              <h1 className="font-primary text-teritiary text-[30px] lg:text-[50px] 2xl:text-[64px] font-bold leading-tight xl:leading-[80px]">
                Start Your Tech Career
              </h1>
            </motion.div>
          </div>

          {/* Link */}
          <div style={{ overflow: "hidden" }}>
            <motion.div
              variants={linkVariants}
              initial="hidden"
              animate={headerInView ? "visible" : "hidden"}
            >
              <Link
                href="/courses"
                className="border border-tertiary text-tertiary px-2 md:px-6 py-1.5 font-semibold md:py-3 rounded-md transition hover:bg-[#A4FF00] hover:border-[#A4FF00] duration-500 ease-in-out inline-block"
              >
                View All Courses
              </Link>
            </motion.div>
          </div>

        </div>

        {/* Cards */}
        <motion.div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 pt-10 items-stretch"
          variants={cardContainerVariants}
          initial="hidden"
          animate={cardsInView ? "visible" : "hidden"}
        >
          {courses.map((course, index) => (
            <div key={index} style={{ overflow: "hidden" }}>
              <motion.div variants={cardVariants}>
                <Card course={course} />
              </motion.div>
            </div>
          ))}
        </motion.div>

      </section>
    </div>
  );
}