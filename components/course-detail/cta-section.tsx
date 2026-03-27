"use client";

import React from "react";
import { Button } from "../ui/button";

export const CTASection = ({ course }: { course: any }) => {
  return (
    <section className="w-full bg-white px-5 md:px-10 xl:px-[5.5%] py-10 lg:py-20">
      
      <div className="mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-10">
        
        {/* LEFT */}
        <h1 className="text-[35px] md:text-[45px] lg:text-6xl font-bold leading-tight font-primary text-black">
          Ready to Start {" "}<br className="hidden lg:flex" />
          Learning?
        </h1>

        {/* RIGHT */}
        <div className="flex flex-col items-start lg:items-start gap-4 md:gap-8 max-w-md">
          
          <p className="text-gray-600 text-lg md:text-xl text-left lg:text-left font-medium">
            {course.ctaText}
          </p>
          <Button label="Enroll Now" />
        </div>
      </div>

    </section>
  );
};