"use client";

import { cn } from "@/utils/lib";
import Image from "next/image";

export function GreenArrow({className}:{className?:string}) {
  return (
    <Image
      src="/images/greenArrow.png"
      alt="green-arrow"
      width={284}
      height={284}
      className={cn("object-contain", className)}
      priority
    />
  );
}