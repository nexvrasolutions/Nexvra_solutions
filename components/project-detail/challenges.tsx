"use client";
import { Card } from '../ui/card';

const courses = [
    {
        title: "AI-Powered UXUI Design",
        desc : "SmartRetail needed a scalable digital platform to improve product discovery and drive higher conversion rates, while providing a modern, user-friendly experience.",
    },
    {
        title: "Web Development",
        desc : "SmartRetail needed a scalable digital platform to improve product discovery and drive higher conversion rates, while providing a modern, user-friendly experience.",
    },
    {
        title: "Mobile App Development",
        desc : "SmartRetail needed a scalable digital platform to improve product discovery and drive higher conversion rates, while providing a modern, user-friendly experience.",
    },
    {
        title: "Digital Marketing Design",
        desc : "SmartRetail needed a scalable digital platform to improve product discovery and drive higher conversion rates, while providing a modern, user-friendly experience.",
    },
];

const Challenges = () => {
    return (
        <section className="w-full bg-[#f5f5f5] text-black px-[5.5%] py-[5%] ">
            <div className="space-y-10">
                <h1 className="max-w-6xl text-3xl font-primary md:text-[38px] font-bold leading-[54px] tracking-tight">
                    <span className="text-[#BFBFBF] font-bold">
                        SmartRetail is an AI-powered e-commerce{" "}
                    </span>

                    <span className="font-bold text-black">
                        platform that helps customers discover products faster through personalized recommendations and a seamless shopping experience.
                    </span>
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
                    {courses.map((course, index) => (
                        <Card key={index} course={course} isCourse={false} />
                    ))}
                </div>
            </div>
            {/* MEDIA */}
            <div className="flex relative z-10 pt-20">
                <img
                    src="/images/vido.gif"
                    alt="gif-video"
                    className="hero-media h-137 w-full object-cover rounded-xl"
                />
            </div>
        </section>
    )
}

export default Challenges