"use client";

import { motion } from "motion/react";
import Image from "next/image";

export function MarqueeSlider() {
  const items = Array.from({ length: 20 });

  return (
    <div className="relative h-20 bg-primary overflow-hidden flex items-center">
      <motion.div
        className="flex gap-20 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 70,
        }}
      >
        {[...items, ...items].map((_, index) => (
          <div key={index} className="flex gap-5 items-center px-5">
            <Image
              src="/images/hexagon-dots.png"
              alt="dots"
              width={28}
              height={28}
              className="object-contain"
            />

            <p className="font-primary font-medium text-[36px] text-tertiary">
              Nexvra Solutions
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}