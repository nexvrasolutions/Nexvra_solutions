"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Badge } from "../ui/badge";
import { useRef } from "react";

const testimonials = [
  {
    id: 1,
    text: "Nexvra Solutions did an excellent job with our website. The design is clean, modern, and easy to use. Our customers now find it easier to connect with us online.",
    name: "Arun S",
    company: "Magic Aisles",
    image: "/images/eye.png",
  },
  {
    id: 2,
    text: "I joined Nexvra for UI/UX design, and the training was very practical. I learned how to design real apps and gained confidence in my skills.",
    name: "Abino",
    company: "Student",
    image: "/images/eye.png",
  },
  {
    id: 3,
    text: "Their digital marketing support helped us reach more customers. We saw better engagement and growth in a short time.",
    name: "Vignesh K",
    company: "JE Mobiles",
    image: "/images/eye.png",
  },
];

const leftVariants: any = {
  hidden: { y: 100 },
  visible: {
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const illustrationVariants: any = {
  hidden: { y: 120 },
  visible: {
    y: 0,
    transition: { duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
  },
};

const testimonialsContainerVariants: any = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.05,
    },
  },
};

const testimonialVariants: any = {
  hidden: { y: 100 },
  visible: {
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const avatarVariants: any = {
  hidden: { y: 60 },
  visible: {
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const nameVariants: any = {
  hidden: { y: 60 },
  visible: {
    y: 0,
    transition: {
      duration: 0.7,
      delay: 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ClientFeedback() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const leftInView = useInView(leftRef, { amount: 0, margin: "0px 0px -80px 0px" });
  const rightInView = useInView(rightRef, { amount: 0, margin: "0px 0px -60px 0px" });

  return (
    <div style={{ overflow: "hidden" }}>
      <section className="relative bg-white min-h-[70vh] px-7 md:px-10 xl:px-[5.5%] py-10 md:py-[5%]">

        {/* Grid lines */}
        <div className="grid-line absolute left-[3%] lg:left-[5%] top-0 h-full w-px bg-[#F3F3F3]" />
        <div className="grid-line absolute hidden lg:block left-[51.5%] top-0 h-full w-px bg-[#F3F3F3]" />
        <div className="grid-line right-[3%] lg:right-[5%] top-0 h-full w-px bg-[#F3F3F3]" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-16 items-start">

          {/* LEFT SIDE */}
          <div style={{ overflow: "hidden" }}>
            <div ref={leftRef}>

              <div style={{ overflow: "hidden" }}>
                <motion.div
                  variants={leftVariants}
                  initial="hidden"
                  animate={leftInView ? "visible" : "hidden"}
                >
                  <Badge text="Testimonials" className="text-tertiary" />
                  <h1 className="font-primary text-teritiary text-[30px] md:text-[40px] lg:text-[50px] xl:text-[64px] z-10 font-bold leading-tight lg:leading-20">
                    What Our Clients Say
                  </h1>
                </motion.div>
              </div>

              <div style={{ overflow: "hidden" }}>
                <motion.div
                  className="relative"
                  variants={illustrationVariants}
                  initial="hidden"
                  animate={leftInView ? "visible" : "hidden"}
                >
                  <Image
                    src="/images/client.png"
                    alt="feedback"
                    width={350}
                    height={320}
                    className="object-contain size-50 md:size-50"
                  />
                </motion.div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <motion.div
            ref={rightRef}
            className="space-y-3 md:space-y-6"
            variants={testimonialsContainerVariants}
            initial="hidden"
            animate={rightInView ? "visible" : "hidden"}
          >
            {testimonials.map((item) => (
              <div
                key={item.id}
                style={{ overflow: "hidden" }}
                className="border-b border-[#F3F3F3]"
              >
                <motion.div
                  variants={testimonialVariants}
                  className="pb-3 md:pb-6 bg-white"
                >
                  <p className="text-[#0A0A0ACC] font-secondary leading-tight xl:leading-[28px] text-lg lg:text-xl">
                    {item.text}
                  </p>

                  <div className="flex items-center gap-3 mt-2 md:mt-5">

                    {/* Avatar */}
                    <div style={{ overflow: "hidden" }} className="w-10 h-10 rounded-md">
                      <motion.div variants={avatarVariants} className="w-full h-full">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </motion.div>
                    </div>

                    {/* Name + company */}
                    <div style={{ overflow: "hidden" }}>
                      <motion.div className="font-secondary" variants={nameVariants}>
                        <h4 className="font-medium text-[#404040] text-xl md:text-2xl leading-8">
                          {item.name}
                        </h4>
                        <p className="text-[#0A0A0ACC]/80 text-[17px] md:text-lg">
                          {item.company}
                        </p>
                      </motion.div>
                    </div>

                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>

        </div>
      </section>
    </div>
  );
}