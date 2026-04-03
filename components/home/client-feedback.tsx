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

const leftVariants : any = {
  hidden: { y: 80, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const testimonialVariants : any = {
  hidden: { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ClientFeedback() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const leftInView = useInView(leftRef, { once: true, margin: "-80px" });
  const rightInView = useInView(rightRef, { once: true, margin: "-60px" });

  return (
    <section className="relative bg-white px-5 md:px-10 xl:px-[5.5%] py-10 md:py-[5%]">

      {/* Grid lines */}
      <div className="absolute left-[3%] lg:left-[5%] top-0 h-full w-px bg-[#F3F3F3]" />
      <div className="absolute hidden lg:block left-[51.5%] top-0 h-full w-px bg-[#F3F3F3]" />
      <div className="absolute right-[3%] lg:right-[5%] top-0 h-full w-px bg-[#F3F3F3]" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">

        {/* LEFT */}
        <motion.div
          ref={leftRef}
          variants={leftVariants}
          initial="hidden"
          animate={leftInView ? "visible" : "hidden"}
          className="flex flex-col gap-6"
        >
          <Badge text="Testimonials" className="text-tertiary" />

          <h1 className="font-primary text-tertiary text-[30px] md:text-[40px] lg:text-[50px] xl:text-[64px] font-bold leading-tight">
            What Our Clients Say
          </h1>

          <Image
            src="/images/client.png"
            alt="feedback"
            width={350}
            height={320}
            className="object-contain w-[180px] md:w-[220px]"
          />
        </motion.div>

        {/* RIGHT */}
        <div ref={rightRef} className="flex flex-col gap-4 md:gap-6">

          {testimonials.map((item) => (
            <motion.div
              key={item.id}
              variants={testimonialVariants}
              initial="hidden"
              animate={rightInView ? "visible" : "hidden"}
              className="
                p-4 md:p-6 rounded-md 
                border border-[#F3F3F3] 
                hover:shadow-md hover:border-[#E5E5E5]
                transition-all duration-300
              "
            >
              <p className="text-[#0A0A0ACC] font-secondary leading-relaxed text-base md:text-lg xl:text-xl">
                “{item.text}”
              </p>

              <div className="flex items-center gap-3 mt-4">

                <div className="w-10 h-10 rounded-md overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div>
                  <h4 className="font-medium text-[#404040] text-lg md:text-xl">
                    {item.name}
                  </h4>
                  <p className="text-[#0A0A0ACC]/70 text-sm md:text-base">
                    {item.company}
                  </p>
                </div>

              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}