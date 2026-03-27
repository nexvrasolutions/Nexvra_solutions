"use client";

import React from "react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Card } from "../ui/card";

const courses = [
    {
        title: "AI-Powered Product Design",
        duration:"3 Months",
        slug: "ai-powered-product-design",
        difficulty:"Beginner Friendly",
        img: "/images/courses/product_design.webp",
    },
    {
        title: "Digital Marketing Mastery",
        slug: "digital-marketing-mastery",
        duration:"2 Months",
        img: "/images/courses/degital_marketing.webp",
        difficulty:"Beginner Friendly"
    },
    {
        title: "Branding & Graphic Design",
        slug: "branding-graphic-design",
        duration:"2-3 Months",
        img: "/images/courses/branding.webp",
        difficulty:"Beginner Friendly"
    },
    {
        title: "Front-End Development",
        slug: "front-end-development",
        duration:"3 Months",
        img: "/images/courses/front_end.webp",
        difficulty:"Beginner Friendly"
    },
];

export default function FeaturedCourses() {
    return (
        <section className="relative bg-[#F3F3F3] min-h-[70vh] overflow-hidden px-5 md:px-10 lg:px-[3%] 2xl:px-[5.5%] py-5 md:py-10 xl:py-[10%]">
            {/* Header */}
            <div className="flex flex-col md:flex-row  items-start gap-5 md:gap-0 md:items-center justify-between">
                <div>
                    <Badge text="Our Courses" className="text-tertiary mb-3 lg:mb-5" />
                    <h1 className="font-primary text-teritiary text-[30px] lg:text-[50px] 2xl:text-[64px] font-bold leading-tight xl:leading-[80px]">
                        Start Your Tech Career
                    </h1>
                </div>

                <Link
                    href="/courses"
                    className="border border-tertiary text-tertiary px-6 py-3 rounded-md hover:border-tertiary transition"
                >
                    View All Courses
                </Link>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 pt-10">
                {courses.map((course, index) => (
                   <Card key={index} course={course} />
                ))}
            </div>
        </section>
    );
}