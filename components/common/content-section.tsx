"use client";

import Image from "next/image";
import React from "react";
import HeroLayout from "../layout/hero-layout";
import { GreenArrow } from "../ui/green-arrow";
import { Highlighter } from "@/components/ui/highlighter"

interface ContentSectionProps {
    title: string;
    description: string;
    image: string;
    accentColor?: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({
    title,
    description,
    image,
    accentColor = "lime",
}) => {
    const splitText = (text: string) =>
        text.split("").map((char, i) => (
            <span key={i} className="inline-block">
                {char === " " ? "\u00A0" : char}
            </span>
        ));

    const formatText = (text: string) => {
        return text
            .split(/(\*\*.*?\*\*|--.*?--)/g)
            .map((part, i) => {
                // **highlight**
                if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                        <Highlighter
                            key={i}
                            action="highlight"
                            color="#A4FF00"
                        >
                            <span className="text-black">
                                {part.replace(/\*\*/g, "")}
                            </span>
                        </Highlighter>
                    );
                }

                // --underline--
                if (part.startsWith("--") && part.endsWith("--")) {
                    return (
                        <Highlighter
                            key={i}
                            action="underline"
                            color="#A4FF00"
                        >
                            {part.replace(/--/g, "")}
                        </Highlighter>
                    );
                }

                return part;
            });
    };
    return (
        <HeroLayout>
            <div
                className="relative z-10 w-full px-[5.5%] flex items-center"
            >
                <div className="flex flex-col gap-20 w-full min-h-[50vh] pt-20">
                    {/* LEFT CONTENT */}
                    <div className="flex items-center justify-between w-full">
                        <h1 className="hero-title text-[#FFFFFF] text-[140px] font-bold font-primary">
                            {title}
                        </h1>
                        <div className="size-55">
                            <GreenArrow />
                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="flex items-end justify-end">
                        <p className="hero-text text-secondary text-xl w-[38%] font-medium font-secondary leading-[28px] mb-10">
                            {formatText(description)}
                        </p>
                    </div>
                </div>
            </div>

            {/* MEDIA */}
            <div className="flex px-[5.5%] relative z-10 pt-20">
                <img
                    src="/images/vido.gif"
                    alt="gif-video"
                    className="hero-media h-[550px] w-full object-cover rounded-xl"
                />
            </div>
        </HeroLayout>
    );
};

export default ContentSection;