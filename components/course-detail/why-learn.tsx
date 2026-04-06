"use client";

import React, { useRef } from "react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { motion, useInView } from "framer-motion";

const WhyLearn = ({ course }: { course: any }) => {
  const sectionRef = useRef(null);

  const inView = useInView(sectionRef, {
    once: true,
    margin: "-100px",
  });

  const containerVariants : any = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants : any = {
    hidden: {
      y: 100,
      opacity: 0,
    },
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
    <section
      ref={sectionRef}
      data-theme="light"
      className="relative bg-[#F3F3F3] min-h-[70vh] overflow-hidden px-[5.5%] py-[10%]"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {/* Header */}
        <div className="flex items-center justify-center flex-col mb-10">
          <motion.div variants={itemVariants}>
            <Badge text="Learning Programs" className="text-tertiary" />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-primary text-teritiary text-center text-[35px] lg:text-[50px] 2xl:text-[64px] font-bold leading-tight xl:leading-[80px]"
          >
            Featured Courses
          </motion.h1>
        </div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-0 lg:pt-10"
        >
          {course.why.map((course: any, index: number) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                course={course}
                isCourse={false}
                className="space-y-0"
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WhyLearn;