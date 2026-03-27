import { section } from 'framer-motion/client'
import React from 'react'
import { Badge } from '../ui/badge'
import { Arrow } from '../ui/arrow'

const services = [
    "User Research & Personas",
    "Wireframes & Prototypes",
    "Web & App Design",
    "Brand Identity",
    "Design Systems",
    "User Research & Personas",
    "Wireframes & Prototypes",
];

const DetailContent = ({ course }: { course: any }) => {
    return (
        <section className="w-full bg-[#f5f5f5] px-5 md:px-10 xl:px-[5.5%] py-8">
            <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 py-4 md:py-10"
            >
                <div>
                    <h2 className="text-xl md:text-3xl font-primary font-semibold text-tertiary">
                        Course Overview
                    </h2>
                </div>

                <div>
                    <p className="text-gray-600 text-xl font-medium leading-relaxed">
                    {course.overview}
                    </p>
                </div>
            </div>
            <div className='flex items-center flex-col justify-center pt-8 md:pt-15'>
                <div className="space-y-3 flex flex-col items-center">
                    <Badge text="About Nexvra" className="text-tertiary" />

                    <h1 className="text-3xl md:text-[50px] font-bold leading-[54px] tracking-tight">
                        <span className="text-black">What You'll Learn</span>
                    </h1>
                </div>
                <div className="relative w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 pt-0 md:pt-10 gap-2 md:gap-6 lg:gap-0 min-h-auto md:min-h-[500px]">

                        {/* Image */}
                        <div className="relative overflow-hidden flex items-center justify-center order-1">
                            <img
                                src="/images/what-learn.png"
                                alt="UI/UX Design & Branding"
                                className="object-contain object-center h-[250px] sm:h-[320px] md:h-[400px] lg:h-[500px] w-full"
                            />
                        </div>

                        {/* Services */}
                        <div className="flex flex-col justify-center md:justify-start px-2 sm:px-6 md:px-8 lg:px-12 py-4 md:py-10 gap-3 md:gap-4 order-2">
                            {course.learn.map((item: string, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 md:gap-4 group cursor-pointer"
                                >
                                    <Arrow className="bg-[#f5f5f5] size-8 md:size-10" />
                                    <span className="text-base sm:text-lg md:text-xl font-medium text-tertiary tracking-tight">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DetailContent