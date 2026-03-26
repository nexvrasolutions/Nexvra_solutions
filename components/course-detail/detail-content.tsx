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

const DetailContent = () => {
    return (
        <section className="w-full bg-[#f5f5f5] px-[5%] py-8">
            <div
                className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10"
            >
                <div>
                    <h2 className="text-xl md:text-3xl font-primary font-semibold text-tertiary">
                        Course Overview
                    </h2>
                </div>

                <div>
                    <p className="text-gray-600 text-xl font-medium leading-relaxed">
                        his comprehensive course takes you from design fundamentals to advanced AI-powered design techniques. You'll learn industry-standard tools, best practices, and how to create designs that users love.
                    </p>
                </div>
            </div>
            <div className='flex items-center flex-col justify-center pt-15'>
                <div className="space-y-3 flex flex-col items-center">
                    <Badge text="About Nexvra" className="text-tertiary" />

                    <h1 className="text-3xl md:text-[50px] font-bold leading-[54px] tracking-tight">
                        <span className="text-black">What You'll Learn</span>
                    </h1>
                </div>
                <div className="relative w-full">
                    <div
                        className="top-0 left-0 w-full grid grid-cols-[58%_42%] pt-10 min-h-130"
                    >

                        <div className="relative overflow-hidden flex items-center justify-center">
                            <img
                                src="/images/what-learn.png"
                                alt="UI/UX Design & Branding"
                                className="object-contain object-center h-[500px] w-full"
                            />
                        </div>

                        {/* Right: Services list */}
                        <div  className="flex flex-col justify-start px-12 py-10 gap-2">
                            {
                                services.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 group cursor-pointer"
                                    >
                                        <Arrow className={"bg-[#f5f5f5]"} />
                                        <span className="text-xl font-medium text-tertiary tracking-tight">
                                            {item}
                                        </span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DetailContent