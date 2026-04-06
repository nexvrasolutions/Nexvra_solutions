"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { EnrollModal } from "../ui/enroll-modal";

export const CTASection = ({ course }: { course: any }) => {

  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  return (
    <section data-theme="light" className="w-full bg-white px-5 md:px-10 xl:px-[5.5%] py-10 lg:py-20">

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
          <Button
            label="Enroll Now"
            onClick={() => {
              setSelectedCourse(course.title)
              setOpen(true)
            }
            }
          />
        </div>
      </div>
      <EnrollModal
        isOpen={open}
        onClose={() => setOpen(false)}
        selectedCourse={selectedCourse}
      />
    </section>
  );
};