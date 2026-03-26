import React from 'react'
import { Button } from './button'
import { motion } from 'framer-motion'
import { p } from 'framer-motion/client'
import { cn } from '@/lib/utils'

export const Card = ({ course, isCourse=true }: { course: any, isCourse?:boolean }) => {
    return (
        <motion.div
            transition={{
                staggerChildren: 0.08,
            }}
            className="bg-white rounded-md p-5 lg:p-3 xl:p-6 transition flex flex-col w-full h-full justify-between items-start gap-3 xl:gap-5"
        >
            {/* Icon */}
            <div className="">
                <img src="/images/green-eye.png" alt="nexvra-solution-eye" className="size-25 object-contain" />
            </div>

            <div className={cn( isCourse ? "xl:max-w-[70%] space-y-3" : "space-y-3")}>
                {/* Title */}
                <h3 className={cn( isCourse ?"text-xl xl:text-2xl font-semibold leading-8 font-secondary " : "font-primary text-xl font-semibold leading-10")}>
                    {course.title}
                </h3>
                {/* Meta */}
                {
                    isCourse &&
                    <div className="text-sm flex gap-0.5 w-full items-center text-[#404040]">
                        <p>3 Months</p>
                        <span className="mx-2 size-1.5 rounded-full bg-[#404040]"></span>
                        <p>Beginner Friendly</p>
                    </div>
                }
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
    )
}
