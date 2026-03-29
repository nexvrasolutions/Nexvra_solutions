"use client";

import Image from "next/image";
import React, { useRef } from "react";
import HeroLayout from "../layout/hero-layout";
import { GreenArrow } from "../ui/green-arrow";
import { Highlighter } from "@/components/ui/highlighter";
import { motion, useInView } from "framer-motion";

interface ContentSectionProps {
  title: string;
  description: string;
  image: string;
  gifImage?: string;
  accentColor?: string;
  showGif?: boolean
  isProjectDetail?: boolean
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  description,
  image,
  showGif = true,
  gifImage = "/images/vido.gif",
  accentColor = "lime",
  isProjectDetail = false
}) => {

  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, {
    amount: 0,
    once: true,
    margin: "0px 0px -100px 0px",
  });

  // 🌿 Smooth slow-start animation (premium feel)
  const smoothVariants: any = {
    hidden: {
      y: 80,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1], // smooth ease-out
      },
    },
  };

  const delayedVariants: any = {
    hidden: {
      y: 80,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        delay: 0.15,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const imageVariants: any = {
    hidden: {
      y: 100,
      opacity: 0,
      scale: 0.98,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.4,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const formatText = (text: string) => {
    return text
      .split(/(\*\*.*?\*\*|--.*?--)/g)
      .map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Highlighter key={i} action="highlight" color="#A4FF00">
              <span className="text-black">
                {part.replace(/\*\*/g, "")}
              </span>
            </Highlighter>
          );
        }

        if (part.startsWith("--") && part.endsWith("--")) {
          return (
            <Highlighter key={i} action="underline" color="#A4FF00">
              {part.replace(/--/g, "")}
            </Highlighter>
          );
        }

        return part;
      });
  };

  return (
    <HeroLayout isProjectDetail={isProjectDetail}>
      {/* PROJECT DETAIL LAYOUT */}
      {isProjectDetail ? (
        <>
          <div
            ref={sectionRef}
            className="relative z-10 w-full px-5 md:px-10 xl:px-[5.5%] pt-16 xl:pt-24"
          >
            {/* TOP CONTENT */}
            <div className="max-w-[900px] flex flex-col gap-6">
              <motion.h1
                variants={smoothVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="text-white text-[36px] md:text-[60px] lg:text-[80px] font-bold font-primary"
              >
                {title}
              </motion.h1>

              <motion.p
                variants={delayedVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="text-secondary text-lg md:text-xl leading-[30px] font-secondary"
              >
                {formatText(description)}
              </motion.p>
            </div>

            {/* MEDIA */}
            {showGif && (
              <div className="relative mt-10 xl:mt-20 z-50">
                <motion.img
                  variants={imageVariants}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  src={gifImage}
                  alt="project-media"
                  className=" w-full object-cover rounded-xs h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] translate-y-30 md:translate-y-35 xl:translate-y-70 relative z-20
        "
                />
              </div>
            )}
          </div>
          <div className="h-[25vh] xl:h-[40vh] bg-white z-10"></div>
        </>
      ) : (
        /* DEFAULT OLD DESIGN */
        <>
          <div
            ref={sectionRef}
            className="relative z-10 w-full px-5 md:px-10 xl:px-[5.5%] flex items-center"
          >
            <div className="flex flex-col gap-10 xl:gap-20 w-full lg:min-h-[50vh] pt-10 xl:pt-20">
              {/* LEFT CONTENT */}
              <div className="flex items-center justify-between w-full overflow-hidden">
                <motion.h1
                  variants={smoothVariants}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  className="hero-title text-[#FFFFFF] text-[40px] md:text-[80px] lg:text-[100px] xl:text-[140px] font-bold font-primary"
                >
                  {title}
                </motion.h1>

                <motion.div
                  variants={delayedVariants}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  className="size-20 md:size-35 lg:size-45 xl:size-55"
                >
                  <GreenArrow />
                </motion.div>
              </div>

              {/* RIGHT CONTENT */}
              <div className="flex lg:items-end lg:justify-end overflow-hidden">
                <motion.p
                  variants={delayedVariants}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  className="hero-text text-secondary text-lg xs:text-xl lg:w-[38%] font-medium font-secondary leading-[28px] mb-10"
                >
                  {formatText(description)}
                </motion.p>
              </div>
            </div>
          </div>

          {/* MEDIA */}
          {showGif && (
            <div className="flex px-5 md:px-10 xl:px-[5.5%] relative z-10 mb-10 lg:mb-0 pt-10 xl:pt-20 overflow-hidden">
              <motion.img
                variants={imageVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                src={gifImage}
                alt="gif-video"
                className="hero-media w-full object-cover h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px]"
              />
            </div>
          )}
        </>
      )}
    </HeroLayout>
  );

};

export default ContentSection;