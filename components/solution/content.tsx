"use client";

import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Arrow } from "../ui/arrow";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const services = [
    "User Research & Personas",
    "Wireframes & Prototypes",
    "Web & App Design",
    "Brand Identity",
    "Design Systems",
];

const CARD_COUNT = 5;
const STACK_GAP = 12;

export default function SolutionContent() {
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const stackWrapperRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        ScrollTrigger.scrollerProxy(document.body, {
            scrollTop(value?: number) {
                if (typeof value === "number") {
                    lenis.scrollTo(value, { immediate: true });
                } else {
                    return lenis.scroll;
                }
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
        });

        ScrollTrigger.defaults({ scroller: document.body });

        const cards = cardsRef.current;

        const ctx = gsap.context(() => {

            gsap.set(cards, {
                y: window.innerHeight, 
            });

            gsap.set(cards[0], {
                y: 0,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top+=1",
                    end: `+=${window.innerHeight * (CARD_COUNT - 1)}`,
                    scrub: 1.5,
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                },
            });

            cards.forEach((card, i) => {
                if (i === 0) return;

                tl.to(
                    card,
                    {
                        y: i * 12, 
                        ease: "power2.out",
                    },
                    i * 0.9
                );
            });

        }, sectionRef);

        return () => {
            ctx.revert();
            lenis.destroy();
        };
    }, []);

    return (
        <section ref={sectionRef} className="w-full bg-white px-[5.5%] py-[5%]">
            {/* Header */}
            <div className="flex items-end justify-between gap-8 mb-15">
                <div className="flex flex-col gap-4 max-w-4xl">
                    <h2 className="text-[40px] font-bold tracking-tight text-black leading-14">
                        UI/UX Design &amp; Branding
                    </h2>
                    <p className="text-xl leading-7 text-[#404040CC]/80 font-medium">
                        Creating seamless digital experiences that connect with people.
                        From brand identity to user interfaces, we ensure every design
                        speaks clarity, creativity, and purpose.
                    </p>
                </div>
                <div className="flex items-end justify-end">
                    <Button label="Explore Courses" />
                </div>
            </div>

            {/* Stack wrapper — GSAP uses its bottom edge to trigger the exit */}
            <div ref={stackWrapperRef} className="relative h-[60vh]">
                {Array.from({ length: CARD_COUNT }, (_, index) => (
                    <div
                        key={index}
                        ref={(el) => {
                            if (el) cardsRef.current[index] = el;
                        }}
                        style={{
                            transformOrigin: "top center",
                            willChange: "transform",
                            zIndex: index + 1,
                        }}
                        className="absolute top-0 left-0 w-full grid grid-cols-[58%_42%] pt-10 border-b border-[#E6E6E6] min-h-130 bg-white"
                    >
                        {/* Grid lines */}
                        <div className="absolute top-0 h-full w-px bg-[#E6E6E6]" />
                        <div className="absolute left-[58%] top-0 h-full w-px bg-[#E6E6E6]" />
                        <div className="absolute right-0 top-0 h-full w-px bg-[#E6E6E6]" />

                        {/* Left: Image */}
                        <div className="relative overflow-hidden">
                            <img
                                src="/images/pillarimage.png"
                                alt="UI/UX Design & Branding"
                                className="object-cover object-center h-100 w-full"
                            />
                        </div>

                        {/* Right: Services list */}
                        <div className="flex flex-col justify-start px-12 py-10 gap-2">
                            {services.map((service, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 group cursor-pointer"
                                >
                                    <Arrow className={"bg-white"} />
                                    <span className="text-xl font-medium text-tertiary tracking-tight">
                                        {service}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}