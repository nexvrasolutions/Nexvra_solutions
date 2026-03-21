"use client";

import Image from "next/image";
import RotatingText from "../ui/rotating-text";

export default function MissionVisionSection() {

    const content = [
        {
            title : "Mission",
            content : `To deliver transformative digital solutions that combine creativity,
            technology, and strategy — empowering businesses to innovate with
            confidence and achieve meaningful results.`
        },
        {
            title : "Vision",
            content : `To deliver transformative digital solutions that combine creativity, technology, and strategy — empowering businesses to innovate with confidence and achieve meaningful results.`
        },
    ]
    return (
        <section className="w-full bg-[#f5f5f5] text-black px-[5.5%] py-[5%] ">

            {/* TOP HEADING */}
            <div className="max-w-7xl">
                <h1 className="text-3xl font-primary md:text-[40px] font-bold leading-[54px] tracking-tight">

                    <span className="text-[#BFBFBF] font-bold">
                        Founded with a vision to lead{" "}
                    </span>

                    <span className="font-bold text-black">
                        “The Next Wave of True Innovation,” Nexvra Solutions is a future-
                        focused company that blends{" "}
                        {/* Highlight */}
                        <span className="inline-block align-middle">
                            <RotatingText
                                texts={["Creativity", "Technology", "Solutions"]}
                                mainClassName="inline-flex bg-[#A4FF00] text-black px-3 py-1 rounded-md ml-2"
                                staggerFrom="last"
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "-120%" }}
                                staggerDuration={0.03}
                                splitLevelClassName="overflow-hidden"
                                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                rotationInterval={2000}
                            />
                        </span>
                    </span>
                </h1>
            </div>

            {/* CONTENT */}
            <div className="mt-20 grid md:grid-cols-4 gap-5 items-start">

                {/* LEFT - IMAGE */}
                <div className="flex justify-center md:justify-start">
                    <Image
                        src="/images/green-eye.png"
                        alt="eye"
                        width={350}
                        height={350}
                        className="object-cover"
                    />
                </div>

                {/* RIGHT - TEXT */}
                <div className="flex flex-col justify-center items-center gap-5 col-span-3 h-full">
                    {/* Mission && Vision */}
                    {
                        content.map((item,index)=>(
                            <div key={index}>
                                <h2 className="font-primary text-4xl md:text-3xl font-bold text-[#404040]">
                                    {item.title}
                                </h2>
                                <p className="font-medium text-xl leading-8 mt-3 text-[#404040CC]/80">
                                   {item.content}
                                </p>
                                {
                                    index === 0 &&
                                    <div className="mt-6 border-b border-gray-300" />
                                }
                            </div>
                        ))
                    }

                </div>
            </div>
        </section>
    );
}