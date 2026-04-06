"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "../../utils/lib";
import { Arrow } from "../ui/arrow";
import { Badge } from "../ui/badge";
import { motion, useInView } from "framer-motion";

const services = [
  { id: "01", title: "Branding & Graphic Design", slug: "branding-graphic-design" },
  { id: "02", title: "Digital Marketing", slug: "digital-marketing" },
  { id: "03", title: "Website Development", slug: "website-development" },
  { id: "04", title: "Custom Software Development", slug: "custom-software-development" },
];

const headerVariants: any = {
  hidden: { y: 100 },
  visible: {
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const listVariants: any = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.05 },
  },
};

const rowVariants: any = {
  hidden: { y: 100 },
  visible: {
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function WhatWeDo() {
  const [hoveredItem, setHoveredItem] = useState("");

  const headerRef = useRef(null);
  const listRef = useRef(null);

  const headerInView = useInView(headerRef, { amount: 0, margin: "0px 0px -80px 0px" });
  const listInView = useInView(listRef, { amount: 0, margin: "0px 0px -60px 0px" });

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    setHoveredItem(id);

    const row = e.currentTarget;
    const arrow = row.querySelector(".arrow-wrapper");
    const idText = row.querySelector(".service-id");
    const titleText = row.querySelector(".service-title");

    gsap.to(row, { y: -5, duration: 0.35, ease: "power3.out" });

    if (arrow) {
      gsap.to(arrow, { rotate: 45, scale: 1.1, duration: 0.4, ease: "power3.out" });
    }

    if (idText) {
      gsap.fromTo(
        idText,
        { y: 4, opacity: 0.4 },
        { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }
      );
    }

    if (titleText) {
      gsap.fromTo(
        titleText,
        { x: -8 },
        { x: 0, duration: 0.4, ease: "power3.out" }
      );
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setHoveredItem("");

    const row = e.currentTarget;
    const arrow = row.querySelector(".arrow-wrapper");

    gsap.to(row, { y: 0, duration: 0.4, ease: "power2.inOut" });

    if (arrow) {
      gsap.to(arrow, { rotate: 0, scale: 1, duration: 0.4, ease: "power2.inOut" });
    }
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <section  data-theme="light" className="flex flex-col items-center px-5 py-[10%] md:px-10 xl:px-[5.5%] gap-5">

        {/* Header */}
        <div style={{ overflow: "hidden" }}>
          <div ref={headerRef}>
            <motion.div
              className="flex flex-col items-center justify-center"
              variants={headerVariants}
              initial="hidden"
              animate={headerInView ? "visible" : "hidden"}
            >
              <Badge text="Our Services" className="text-tertiary" />
              <h2 className="text-[30px] md:text-[50px] xl:text-[60px] font-bold font-primary text-teritiary leading-tight lg:leading-[1.1] w-full text-center">
                Digital Solutions for{" "}
                <br className="hidden lg:flex" />
                Businesses
              </h2>
            </motion.div>
          </div>
        </div>

        {/* Service rows */}
        <div className="w-full flex flex-col relative">
          {services.map((service) => (
            <a
              key={service.id}
              href="/solutions"
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
    </div>
  );
}