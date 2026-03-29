"use client";

import { ArrowUpRight } from "lucide-react";
import { cn } from "@/utils/lib";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { Arrow } from "./arrow";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: ReactNode;
  isIcon?: boolean;
  className?: string;
  onClick?:any
}

export function Button({
  className,
  onClick,
  label = "Explore Components",
  icon = <ArrowUpRight className="w-3.5 h-3.5 text-white" />,
  isIcon = true,
  ...props
}: ButtonProps) {
  return (
      <button
        onClick={onClick}
        className={cn(
          "relative overflow-hidden font-secondary leading-6 text-lg flex justify-center items-center",
          "h-12.5 px-4 rounded-[2px] bg-[#A4FF00]",
          "text-black font-medium cursor-pointer",
          "transition-all duration-200 group",
          className
        )}
        {...props}
      >
        {/* Content */}
        <div className="relative flex items-center justify-center">
          <span className="text-black text-[14px]">
            {label}
          </span>
        </div>
        {isIcon && <Arrow />}
      </button>
  );
}