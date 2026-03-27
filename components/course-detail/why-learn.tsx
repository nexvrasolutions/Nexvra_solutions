"use client";

import React from 'react'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card';

const courses = [
    {
        title: "AI-Powered UXUI Design",
        desc : "Learn skills that employers are actively looking for in today's job market."
    },
    {
        title: "Web Development",
        desc : "Learn skills that employers are actively looking for in today's job market."
    },
    {
        title: "Mobile App Development",
        desc : "Learn skills that employers are actively looking for in today's job market."
    },
    {
        title: "Digital Marketing Design",
        desc : "Learn skills that employers are actively looking for in today's job market."
    },
];

const WhyLearn = ({ course }: { course: any }) => {
    return (
        <section className="relative bg-[#F3F3F3] min-h-[70vh] overflow-hidden px-[5.5%] py-[10%]">
            {/* Header */}
            <div className="flex items-center justify-center flex-col">
                    <Badge text="Learning Programs" className="text-tertiary" />
                    <h1 className="font-primary text-teritiary text-[35px] lg:text-[50px] 2xl:text-[64px] font-bold leading-tight xl:leading-[80px]">
                        Featured Courses
                    </h1>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-15">
                {course.why.map((course:any, index:number) => (
                    <Card key={index} course={course} isCourse={false} />
                ))}
            </div>
        </section>
    )
}

export default WhyLearn