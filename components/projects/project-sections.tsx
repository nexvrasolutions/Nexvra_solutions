"use client";

import { useRef, useState } from "react";
import { Arrow } from "../ui/arrow";
import Link from "next/link";

const categories = [
    "All",
    "Website",
    "Mobile App",
    "Digital Marketing",
    "Branding",
];

const projects = [
    {
        id: 1,
        name: "Magic Aisles",
        slug: "magic-aisles",
        category: "Website",
        type: "Website Development",
        image: "/images/projects/magicaisles.webp",
    },
    {
        id: 2,
        name: "Exclusive",
        slug: "exclusive",
        category: "Website",
        type: "E-commerce Website",
        image: "/images/projects/exclusive.webp",
    },
    {
        id: 3,
        name: "Riya Mobiles",
        slug: "riya-mobiles",
        category: "Website",
        type: "Website Design",
        image: "/images/projects/riyamobiles.webp",
    },
    {
        id: 4,
        name: "My Choir",
        slug: "my-choir",
        category: "Mobile App",
        type: "Mobile App",
        image: "/images/projects/mychoir.webp",
    },
    {
        id: 5,
        name: "JE Mobiles",
        slug: "je-mobiles",
        category: "Digital Marketing",
        type: "Digital Marketing",
        image: "/images/projects/jemobiles.webp",
    },
];

export default function ProjectSection() {

    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");

    const filtered =
        activeCategory === "All"
            ? projects
            : projects.filter((p) => p.category === activeCategory);

    return (
        <div className="flex flex-col lg:flex-row bg-white px-4 md:px-8 lg:px-[5.5%] py-10 md:py-[5%]">

            {/* Sidebar / Categories */}
            <aside className="lg:w-[280px] w-full lg:h-full shrink-0 lg:sticky lg:top-[5%] lg:border-b lg:border-b-0 lg:border-r border-gray-100 lg:pr-8 mb-6 lg:mb-0">

                {/* Mobile + Tablet → Horizontal scroll */}
                <nav className="flex lg:flex-col gap-3 lg:gap-4 overflow-x-auto lg:overflow-visible no-scrollbar">
                    <nav className="flex lg:flex-col gap-3 lg:gap-4 overflow-x-auto lg:overflow-visible no-scrollbar">
                        {categories.map((cat, i) => (
                            <button
                                key={cat}
                                ref={(el) => {
                                    buttonRefs.current[i] = el;
                                }}
                                onClick={() => {
                                    setActiveCategory(cat);
                                    const currentEl = buttonRefs.current[i];
                                    if (currentEl) {
                                        currentEl.scrollIntoView({
                                            behavior: "smooth",
                                            inline: "center",
                                            block: "nearest",
                                        });
                                    }
                                }}
                                className={`
        whitespace-nowrap px-4 py-2 rounded-full lg:rounded-none
        text-sm md:text-base lg:text-2xl transition-all duration-200
        ${activeCategory === cat
                                        ? "bg-black text-white lg:bg-transparent lg:text-black lg:font-bold"
                                        : "bg-gray-100 text-gray-500 lg:bg-transparent hover:text-gray-700"
                                    }
      `}
                            >
                                {cat}
                            </button>
                        ))}
                    </nav>
                </nav>
            </aside>

            {/* Content */}
            <main className="flex-1 lg:pl-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 md:gap-y-12">
                    {filtered.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </main>
        </div>
    );
}

function ProjectCard({
    project,
}: {
    project: {
        id: number;
        name: string;
        type: string;
        image: string;
        slug:string;
    };
}) {
    return (
        <Link href={`/project-detail/${project.slug}`} className="block">
            <div className="group cursor-pointer">
                {/* Image */}
                <div className="relative w-full bg-[#f0f0f0] rounded-sm overflow-hidden mb-4">
                    <img
                        src={project.image}
                        alt={project.name}
                        className="object-cover h-[220px] sm:h-[280px] md:h-[320px] lg:h-[380px] w-full transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Arrow className="rounded-full size-12 md:size-16 lg:size-20" imgClassName="size-6 md:size-8 lg:size-10" />
                    </div>
                </div>

                {/* Text */}
                <div>
                    <h3 className="text-xl sm:text-2xl md:text-[26px] lg:text-[32px] font-semibold text-tertiary leading-tight mb-1">
                        {project.name}
                    </h3>

                    <p className="text-sm sm:text-base md:text-lg text-gray-500">
                        {project.type}
                    </p>
                </div>
            </div>
        </Link>    
    );
}