"use client";

import { useRef, useState } from "react";
import { Arrow } from "../ui/arrow";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";

const categories = [
    "All",
    "Website",
    "Mobile App",
    "Digital Marketing",
    // "Branding",
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

    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, {
        once: true,
        margin: "0px 0px -100px 0px",
    });

    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");

    const filtered =
        activeCategory === "All"
            ? projects
            : projects.filter((p) => p.category === activeCategory);

    const containerVariants : any= {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants : any = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <div
            ref={sectionRef}
            className="flex flex-col lg:flex-row bg-white px-4 md:px-8 lg:px-[5.5%] py-[10%]"
        >

            {/* Sidebar */}
            <motion.aside
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="lg:w-[280px] w-full lg:h-full shrink-0 lg:sticky lg:top-[5%] lg:pr-8 mb-6 lg:mb-0"
            >
                <nav className="flex lg:flex-col gap-3 lg:gap-4 overflow-x-auto lg:overflow-visible no-scrollbar items-start">
                    {categories.map((cat, i) => (
                        <motion.button
                            variants={itemVariants}
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
                                whitespace-nowrap rounded-full lg:rounded-none
                                text-sm md:text-base lg:text-2xl transition-all duration-200
                                ${activeCategory === cat
                                    ? "bg-black text-white lg:bg-transparent lg:text-black lg:font-bold"
                                    : "bg-gray-100 text-gray-500 lg:bg-transparent hover:text-gray-700"
                                }
                            `}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </nav>
            </motion.aside>

            {/* Content */}
            <main className="flex-1 lg:pl-10 lg:border-l border-gray-100">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 md:gap-y-12"
                >
                    <AnimatePresence mode="wait">
                        {filtered.map((project) => (
                            <motion.div
                                key={project.id}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: 20 }}
                                layout
                            >
                                <ProjectCard project={project} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
}

function ProjectCard({ project }: any) {
    return (
        <a  href={`/project-detail/${project.slug}`} className="block">
            <div className="group cursor-pointer">

                {/* Image */}
                <div className="relative w-full bg-[#f0f0f0] rounded-sm overflow-hidden mb-4">
                    <img
                        src={project.image}
                        alt={project.name}
                        className="object-cover h-[220px] sm:h-[280px] md:h-[320px] lg:h-[380px] w-full transition-transform duration-500 group-hover:scale-105"
                    />

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
        </a >
    );
}
