"use client";

import React from "react";
import { Button } from "../ui/button";

export const CTASection = () => {
  return (
    <section className="w-full bg-white px-[5.5%] py-20">
      
      <div className="mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* LEFT */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight font-primary text-black">
          Ready to Start <br />
          Learning?
        </h1>

        {/* RIGHT */}
        <div className="flex flex-col items-start lg:items-start gap-8 max-w-md">
          
          <p className="text-gray-600 text-xl text-left lg:text-left font-medium">
            Join our community of learners and transform your career today
          </p>
          <Button label="Enroll Now" />
        </div>
      </div>

    </section>
  );
};