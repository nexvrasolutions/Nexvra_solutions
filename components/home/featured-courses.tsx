"use client";

import React from "react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const courses = [
    {
        title: "AI-Powered UXUI Design",
    },
    {
        title: "Web Development",
    },
    {
        title: "Mobile App Development",
    },
    {
        title: "Digital Marketing Design",
    },
];

export default function FeaturedCourses() {
    return (
        <section className="relative bg-[#F3F3F3] min-h-[70vh] overflow-hidden px-5 md:px-10 lg:px-[3%] 2xl:px-[5.5%] py-5 md:py-10 xl:py-[10%]">
            {/* Header */}
            <div className="flex flex-col md:flex-row  items-start gap-5 md:gap-0 md:items-center justify-between">
                <div>
                    <Badge text="Learning Programs" className="text-tertiary mb-3 lg:mb-5" />
                    <h1 className="font-primary text-teritiary text-[30px] lg:text-[50px] 2xl:text-[64px] font-bold leading-tight xl:leading-[80px]">
                        Featured Courses
                    </h1>
                </div>

                <Link
                    href="/solutions"
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