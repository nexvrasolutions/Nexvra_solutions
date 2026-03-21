"use client";

import React, { useState } from "react";
import gsap from "gsap";
import { cn } from "../../utils/lib";
import { Arrow } from "../ui/arrow";
import { Badge } from "../ui/badge";

const services = [
  { id: "01", title: "Digital Transformation" },
  { id: "02", title: "Software Development" },
  { id: "03", title: "UI/UX Design" },
  { id: "04", title: "Innovation Labs" },
];

export default function WhatWeDo() {
  const [hoveredItem, setHoveredItem] = useState("");

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    id: string
  ) => {
    setHoveredItem(id);

    const row = e.currentTarget;
    const img = row.querySelector(".hover-image");
    const arrow = row.querySelector(".arrow-wrapper");

    // Row lift
    gsap.to(row, {
      y: -6,
      duration: 0.3,
      ease: "power2.out",
    });

    // Image reveal
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

    // Arrow rotate
    if (arrow) {
      gsap.to(arrow, {
        rotate: 45,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
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
    <section className="py-[5%] flex flex-col items-center px-[5%] gap-5">
      {/* Heading */}
      {/* <p className="text-sm font-primary text-teritiary font-medium">
        (What We Do)
      </p> */}
      <Badge text="Digital Solutions" className="text-tertiary" />

      <h2 className="text-[60px] font-bold font-primary text-teritiary leading-25 w-full text-center">
        What We Do
      </h2>

      <div className="w-full flex flex-col relative">
        {services.map((service) => (
          <div
            key={service.id}
            onMouseEnter={(e) => handleMouseEnter(e, service.id)}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "flex items-center border-b border-[#F3F3F3] justify-between rounded-lg p-6 relative transition-all duration-500 ease-in-out",
              hoveredItem === service.id ? "bg-[#F3F3F3]" : ""
            )}
          >
            {/* Left text */}
            <div
              className={cn(
                "w-[90%] flex flex-col gap-4 items-start transition-all duration-500 ease-in-out",
                hoveredItem === service.id
                  ? "text-teritiary"
                  : "text-secondary"
              )}
            >
              <p className="text-[20px] font-primary font-[500] leading-[24px]">
                {service.id}
              </p>

              <h3 className="text-[40px] font-primary font-[600] leading-full">
                {service.title}
              </h3>
            </div>

            {/* Hover Image */}
            {hoveredItem === service.id && (
              <div className="absolute right-[200px] bottom-8 w-[450px] h-[220px] z-10">
                {/* Green background */}
                <div className="absolute top-5 inset-0 bg-primary translate-x-[20px] -z-10 rounded-sm"></div>

                {/* Image */}
                <img
                  src="/images/pillarimage.png"
                  alt="pillar-image"
                  className="hover-image w-full h-[200px] object-cover rounded-sm"
                />
              </div>
            )}

            {/* Arrow */}
            <div className="arrow-wrapper">
              <Arrow
                className={cn(
                  "transition-all duration-500 ease-in-out",
                  hoveredItem === service.id ? "bg-primary" : "bg-white"
                )}
                imgClassName={"size-[50px]"}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
