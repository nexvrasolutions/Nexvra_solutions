"use client";

import React from "react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";

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
        <section className="relative bg-[#F3F3F3] min-h-[70vh] overflow-hidden px-[5.5%] py-[10%]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Badge text="Learning Programs" className="text-tertiary" />
                    <h1 className="font-primary text-teritiary text-[64px] font-bold leading-[80px]">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
                {courses.map((course, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-md p-6 transition flex flex-col justify-between items-start gap-5"
                    >
                        {/* Icon */}
                        <div className="">
                            <img src="/images/eye.png" alt="nexvra-solution-eye" className="size-25 object-contain" />
                        </div>

                        <div className="max-w-[70%] space-y-3">
                            {/* Title */}
                            <h3 className="text-2xl font-semibold leading-8 font-secondary ">
                                {course.title}
                            </h3>
                            {/* Meta */}
                            <div className="text-sm flex gap-0.5 items-center text-[#404040">
                                <p>3 Months</p>
                                <span className="mx-2 size-1.5 rounded-full bg-[#404040]"></span>
                                <p>Beginner Friendly</p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="w-full">
                            <div className="w-full">
                                <Button label="Enroll Now" className="w-full flex items-center justify-center" />
                            </div>
                            <button className="w-full mt-3 text-gray-600 hover:text-black text-sm transition">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}