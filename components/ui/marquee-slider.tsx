"use client";

import { motion } from "motion/react";
import Image from "next/image";

export function MarqueeSlider() {
  const items = Array.from({ length: 20 });

  return (
    <div className="relative h-15 md:h-20 bg-[#A4FF00] overflow-hidden flex items-center">
      <motion.div
        className="flex gap-5 md:gap-10 xl:gap-20 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 70,
        }}
      >
        {[...items, ...items].map((_, index) => (
          <div key={index} className="flex gap-2 md:gap-5 items-center px-5">
            <Image
              src="/images/hexagon-dots.png"
              alt="dots"
              width={30}
              height={30}
              className="object-contain"
            />

            <p className="font-primary font-medium text-[21px] md:text-[30px] xl:text-[36px] text-tertiary">
              Nexvra Solutions
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}