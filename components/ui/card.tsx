import React from 'react'
import { Button } from './button'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from "next/link";

export const Card = ({ course, className, isCourse = true }: { course: any, className?: string, isCourse?: boolean }) => {
    return (
        <Link
            href={
                isCourse
                    ? `/course-detail/${course.slug}`
                    : ``
            }
            className="w-full h-full"
        >
            <motion.div
                transition={{
                    staggerChildren: 0.08,
                }}
                className="bg-white rounded-md p-5 lg:p-3 xl:p-6 transition flex flex-col w-full h-full justify-between items-start gap-3 xl:gap-5"
            >
                {/* Icon */}
                <div className="">
                    <img src={ course.img ||"/images/green-eye.png"} alt={`nexvra-solution-${course.slug || course.title}`} className="size-25 object-contain" />
                </div>

                <div className={cn(isCourse ? "2xl:w-[70%] space-y-3" : "space-y-3", className)}>
                    {/* Title */}
                    <h3 className={cn(isCourse ? "text-xl xl:text-2xl font-semibold leading-tight xl:leading-8 font-secondary " : "font-primary text-xl font-semibold leading-tight xl:leading-10")}>
                        {course.title}
                    </h3>
                    {/* Meta */}
                    {
                        isCourse &&
                        <div className="text-sm flex gap-0.5 w-full items-center text-[#404040]">
                            <p>{course.duration}</p>
                            <span className="mx-2 size-1.5 rounded-full bg-[#404040]"></span>
                            <p>{course.difficulty}</p>
                        </div>
                    }
                    {/* Description */}

                    <p className="text-sm text-gray-500 leading-6">
                        {course.description}
                    </p>
                    {
                        !isCourse &&
                        <p className="text-lg font-medium flex gap-0.5 items-center text-gray-500">{course.desc}</p>
                    }
                </div>

                {/* Buttons */}
                {
                    isCourse &&
                    <div className="w-full">
                        <div className="w-full">
                            <Button label="Enroll Now" className="w-full flex items-center justify-center" />
                        </div>
                        <button className="w-full mt-3 text-gray-600 hover:text-black text-sm transition">
                            View Details
                        </button>
                    </div>
                }
            </motion.div>
        </Link>
    )
}
