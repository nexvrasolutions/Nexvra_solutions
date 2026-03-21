"use client";

import Image from "next/image";
import { cn } from "@/utils/lib";

interface ArrowProps {
  className?: string;
  imgClassName?: string;
}

export const Arrow = ({ className, imgClassName }: ArrowProps) => {
  return (
    <div
      className={cn(
        "h-12.5 p-2 px-2 rounded-sm bg-[#A4FF00] flex items-center justify-center group-hover:translate-x-1 transition duration-200 ease-in-out",
        className
      )}
    >
      <Image
        src="/images/arrow.png"
        alt="arrow"
        width={25}
        height={25}
        className={cn("object-contain", imgClassName)}
      />
    </div>
  );
};