import React from 'react'
import { Badge } from '../ui/badge'
import { Highlight } from '../ui/hero-highlight'
import { Highlighter } from '../ui/highlighter'

const AboutContent = () => {

    const content = [
        `**At Nexvra Solutions**, we are driven by a simple belief — the future belongs to those who innovate. Founded with the vision to lead The Next Wave of True Innovation, we combine creativity, technology, and strategy to help businesses grow, adapt, and stay ahead in an ever-changing digital world.`,
      
        `We don’t just build software or deliver projects — we craft __transformative experiences__. Every solution we design is powered by imagination, engineered with cutting-edge technology, and aligned with our clients’ goals to ensure meaningful impact.`,
      
        `From concept to execution, we walk side by side with businesses, turning challenges into ~~opportunities~~ and ideas into reality.`,
      
        `Our expertise spans across ++digital transformation++, UI/UX design, software development, and innovation consulting, but our true strength lies in our approach.`,
      
        `We see every collaboration as a partnership, working closely with our clients to understand their vision and bring it to life with ((precision and creativity)).`,
      
        `At Nexvra, we are more than a solutions provider — we are --innovators--, creators, and partners in progress. We thrive on pushing boundaries and building future-ready solutions.`,
      
        `When you work with us, you don’t just get a service provider — you gain a team committed to helping you **innovate with confidence** and achieve measurable results.`
      ];

    return (
        <section
            className="relative bg-black text-white px-5 md:px-10 xl:px-[5.5%] py-10 md:py-[5%] overflow-hidden min-h-[50vh]"
        >
            {/* Grid lines */}
            <div className="grid-line absolute left-[4%] md:left-[5%] top-0 h-full w-px bg-grid" />
            <div className="grid-line absolute hidden lg:flex left-[50%] top-0 h-full w-px bg-grid" />
            <div className="grid-line absolute right-[4%] md:right-[5%] top-0 h-full w-px bg-grid" />

            <div className="relative z-10 w-full container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* LEFT IMAGE */}
                <div className="relative flex flex-col justify-start items-start h-full">
                    <Badge text="About Nexvra" />
                    <h2 className="about-heading font-primary text-white font-bold text-[40px] md:text-[54px] leading-[1.1] w-[90%]">
                        Turning Bold Ideas Into
                        Intelligent Solutions
                    </h2>
                </div>

                {/* RIGHT CONTENT */}
                {/* Description */}
                <div className="flex flex-col gap-3">
                    {content.map((item, index) => {
                        const parts = item.split(
                            /(\*\*.*?\*\*|__.*?__|~~.*?~~|\+\+.*?\+\+|\(\(.*?\)\)|--.*?--)/g
                        );

                        return (
                            <p
                                key={index}
                                className="about-text text-white/80 font-medium text-xl leading-relaxed"
                            >
                                {parts.map((part, i) => {
                                    // highlight
                                    if (part.startsWith("**") && part.endsWith("**")) {
                                        return (
                                            <Highlighter key={i} action="highlight" color="#A4FF00">
                                                <span className="text-black">
                                                    {part.replace(/\*\*/g, "")}
                                                </span>
                                            </Highlighter>
                                        );
                                    }

                                    // underline
                                    if (part.startsWith("__") && part.endsWith("__")) {
                                        return (
                                            <Highlighter key={i} action="underline" color="#A4FF00">
                                                {part.replace(/__/g, "")}
                                            </Highlighter>
                                        );
                                    }

                                    // strike-through
                                    if (part.startsWith("~~") && part.endsWith("~~")) {
                                        return (
                                            <Highlighter key={i} action="strike-through" color="#A4FF00">
                                                {part.replace(/~~/g, "")}
                                            </Highlighter>
                                        );
                                    }

                                    // box
                                    if (part.startsWith("++") && part.endsWith("++")) {
                                        return (
                                            <Highlighter key={i} action="box" color="#A4FF00">
                                                {part.replace(/\+\+/g, "")}
                                            </Highlighter>
                                        );
                                    }

                                    // circle
                                    if (part.startsWith("((") && part.endsWith("))")) {
                                        return (
                                            <Highlighter key={i} action="circle" color="#A4FF00">
                                                {part.replace(/\(\(|\)\)/g, "")}
                                            </Highlighter>
                                        );
                                    }

                                    // bracket
                                    if (part.startsWith("--") && part.endsWith("--")) {
                                        return (
                                            <Highlighter key={i} action="bracket" color="#A4FF00">
                                                {part.replace(/--/g, "")}
                                            </Highlighter>
                                        );
                                    }

                                    return part;
                                })}
                            </p>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}

export default AboutContent