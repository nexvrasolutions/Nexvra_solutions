"use client";

import React, { useState } from "react";
import gsap from "gsap";
import { cn } from "../../utils/lib";
import { Arrow } from "../ui/arrow";
import { Badge } from "../ui/badge";

const services = [
  { id: "01", title: "Branding & Graphic Design", slug: "branding-graphic-design" },
  { id: "02", title: "Digital Marketing", slug: "digital-marketing" },
  { id: "03", title: "Website Development", slug: "website-development" },
  { id: "04", title: "Custom Software Development", slug: "custom-software-development" },
];

export default function WhatWeDo() {
  const [hoveredItem, setHoveredItem] = useState("");

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    setHoveredItem(id);

    const row = e.currentTarget;
    const img = row.querySelector(".hover-image");
    const arrow = row.querySelector(".arrow-wrapper");

    gsap.to(row, {
      y: -6,
      duration: 0.3,
      ease: "power2.out",
    });

    if (img) {
      gsap.fromTo(
        img,
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        }
      );
    }

    if (arrow) {
      gsap.to(arrow, {
        rotate: 45,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setHoveredItem("");

    const row = e.currentTarget;
    const arrow = row.querySelector(".arrow-wrapper");

    gsap.to(row, {
      y: 0,
      duration: 0.3,
    });

    if (arrow) {
      gsap.to(arrow, {
        rotate: 0,
        duration: 0.4,
      });
    }
  };

  return (
    <section className="flex flex-col items-center px-5 py-10 md:py-[5%] md:px-10 xl:px-[5.5%] gap-5">
      
      <div className="flex flex-col items-center justify-center">
        <Badge text="Our Services" className="text-tertiary" />
        <h2 className="text-[30px] md:text-[50px] xl:text-[60px] font-bold font-primary text-teritiary leading-tight lg:leading-[1.1] w-full text-center">
          Digital Solutions for
          <br className="hidden lg:flex" />
          Businesses
        </h2>
      </div>

      <div className="w-full flex flex-col relative">
        {services.map((service) => (
          <a
            key={service.id}
            href="/projects"
            onMouseEnter={(e) => handleMouseEnter(e, service.id)}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "flex items-center border-b border-[#F3F3F3] justify-between rounded-sm md:rounded-lg p-0 py-3 md:py-0 md:p-6 relative transition-all duration-500 ease-in-out cursor-pointer",
              hoveredItem === service.id ? "bg-[#F3F3F3]" : ""
            )}
          >
            {/* Left text */}
            <div
              className={cn(
                "w-[90%] flex flex-col gap-4 items-start transition-all duration-500 ease-in-out",
                hoveredItem === service.id
                  ? "text-teritiary"
                  : "text-[#BFBFBF]"
              )}
            >
              <p className="text-lg md:text-[20px] font-primary font-[500] leading-[24px]">
                {service.id}
              </p>

              <h3 className="text-[21px] md:text-[30px] xl:text-[40px] font-primary font-[600] leading-full">
                {service.title}
              </h3>
            </div>

            {/* Arrow */}
            <div className="arrow-wrapper mr-5 md:mr-0">
              <Arrow
                className={cn(
                  "transition-all duration-500 ease-in-out",
                  hoveredItem === service.id ? "bg-[#A4FF00]" : "bg-white"
                )}
                imgClassName={"size-6 md:size-10 xl:size-[50px]"}
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}