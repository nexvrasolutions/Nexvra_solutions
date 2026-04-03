"use client";

import React, { useRef, useMemo } from "react";
import { Badge } from "../ui/badge";
import { Highlighter } from "../ui/highlighter";
import { motion, useInView, Variants } from "framer-motion";

const AboutContent = () => {
  const sectionRef = useRef(null);

  const inView = useInView(sectionRef, {
    once: true,
    margin: "-100px",
  });

  const animateState = inView ? "visible" : "hidden";

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const content = [
    `At Nexvra Solutions, we don’t just build digital products — we build solutions that create real impact.`,
    `We are a modern digital company focused on two core areas: skill development and digital solutions. Our mission is to help individuals gain practical, industry-relevant skills while helping businesses build powerful and effective digital presence.`,
    `We believe that learning should go beyond theory. That’s why our approach is built on real-world experience, hands-on training, and problem-solving.`,
    `From UI/UX design and website development to mobile applications and digital marketing, we combine creativity, technology, and strategy.`,
    `We work closely with our clients to transform ideas into scalable digital products.`,
    `At Nexvra, we are more than a solutions provider — we are innovators and partners in progress.`,
    `Our goal is simple — to create value, inspire growth, and build a strong digital future.`,
  ];

  // Memoized parsing
  const parsedContent = useMemo(() => {
    return content.map((item) =>
      item.split(/(\*\*.*?\*\*|__.*?__|~~.*?~~|\+\+.*?\+\+|\(\(.*?\)\)|--.*?--)/g)
    );
  }, []);

  const renderPart = (part: string, i: number) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Highlighter key={i} action="highlight" color="#A4FF00">
          <span className="text-black">{part.replace(/\*\*/g, "")}</span>
        </Highlighter>
      );
    }

    if (part.startsWith("__") && part.endsWith("__")) {
      return (
        <Highlighter key={i} action="underline" color="#A4FF00">
          {part.replace(/__/g, "")}
        </Highlighter>
      );
    }

    if (part.startsWith("~~") && part.endsWith("~~")) {
      return (
        <Highlighter key={i} action="strike-through" color="#A4FF00">
          {part.replace(/~~/g, "")}
        </Highlighter>
      );
    }

    if (part.startsWith("++") && part.endsWith("++")) {
      return (
        <Highlighter key={i} action="box" color="#A4FF00">
          {part.replace(/\+\+/g, "")}
        </Highlighter>
      );
    }

    if (part.startsWith("((") && part.endsWith("))")) {
      return (
        <Highlighter key={i} action="circle" color="#A4FF00">
          {part.replace(/\(\(|\)\)/g, "")}
        </Highlighter>
      );
    }

    if (part.startsWith("--") && part.endsWith("--")) {
      return (
        <Highlighter key={i} action="bracket" color="#A4FF00">
          {part.replace(/--/g, "")}
        </Highlighter>
      );
    }

    return part;
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white px-5 md:px-10 xl:px-[5.5%] py-10 md:py-[5%] overflow-hidden"
    >
      {/* Grid lines */}
      <div className="absolute left-[4%] md:left-[5%] top-0 h-full w-px bg-grid" />
      <div className="absolute hidden lg:block left-[50%] top-0 h-full w-px bg-grid" />
      <div className="absolute right-[4%] md:right-[5%] top-0 h-full w-px bg-grid" />

      <div className="relative z-10 w-full container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={animateState}
          className="flex flex-col gap-6"
        >
          <motion.div variants={itemVariants}>
            <Badge text="About Nexvra" />
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="font-primary font-bold text-[26px] md:text-[45px] leading-[1.2] w-full lg:w-[90%]"
          >
            Turning Bold Ideas Into Intelligent Solutions
          </motion.h2>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={animateState}
          className="flex flex-col gap-6 lg:mt-20"
        >
          {parsedContent.map((parts, index) => (
            <motion.p
              key={index}
              variants={itemVariants}
              className="text-white/80 font-medium text-lg md:text-xl leading-relaxed"
            >
              {parts.map(renderPart)}
            </motion.p>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default AboutContent;