"use client";

import { useState } from "react";
import { Arrow } from "../ui/arrow";

const categories = [
    "All",
    "Digital Marketing",
    "Software Development",
    "Web Development",
    "App Development",
    "Hosting",
    "AI",
    "Designing",
];

const projects = [
    { id: 1, name: "Project Name", description: "Case study highlighting measurable growth.", category: "Digital Marketing", image: "/images/laptop.png" },
    { id: 2, name: "Project Name", description: "Case study highlighting measurable growth.", category: "Software Development", image: "/images/laptop.png" },
    { id: 3, name: "Project Name", description: "Case study highlighting measurable growth.", category: "Web Development", image: "/images/laptop.png" },
    { id: 4, name: "Project Name", description: "Case study highlighting measurable growth.", category: "App Development", image: "/images/laptop.png" },
    { id: 5, name: "Project Name", description: "Case study highlighting measurable growth.", category: "Hosting", image: "/images/laptop.png" },
    { id: 6, name: "Project Name", description: "Case study highlighting measurable growth.", category: "AI", image: "/images/laptop.png" },
    { id: 7, name: "Project Name", description: "Case study highlighting measurable growth.", category: "Designing", image: "/images/laptop.png" },
    { id: 8, name: "Project Name", description: "Case study highlighting measurable growth.", category: "Digital Marketing", image: "/images/laptop.png" },
];

export default function ProjectSection() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filtered =
        activeCategory === "All"
            ? projects
            : projects.filter((p) => p.category === activeCategory);

    return (
        <div className="flex bg-white px-[5.5%] py-[5%] items-stretch">
            {/* Sticky Sidebar */}
            <aside className="w-100 h-full shrink-0 self-start sticky top-[5%] border-r border-gray-100 pr-8">
                <nav className="flex flex-col gap-4">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`text-left text-2xl transition-colors duration-200 ${activeCategory === cat
                                    ? "font-bold text-black"
                                    : "font-medium text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Scrollable Content */}
            <main className="flex-1 pl-10">
                <div className="grid grid-cols-2 gap-x-6 gap-y-12">
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
        description: string;
        image: string;
    };
}) {
    return (
        <div className="group cursor-pointer">
            {/* Image Container */}
            <div className="relative w-full bg-[#f0f0f0] rounded-sm overflow-hidden mb-4">
                <img
                    src={project.image}
                    alt={project.name}
                    className="object-contain h-[380px] w-full transition-transform duration-500 group-hover:scale-105"
                />

                {/* Black overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Arrow className="rounded-full size-20" imgClassName="size-10" />
                </div>
            </div>

            {/* Text */}
            <div>
                <h3 className="text-[32px] font-semibold text-tertiary leading-tight mb-1">
                    {project.name}
                </h3>
                <p className="text-lg text-gray-500">{project.description}</p>
            </div>
        </div>
    );
}