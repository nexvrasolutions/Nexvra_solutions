"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Badge } from "../ui/badge";

export const ShowCase = ({ project }: { project: any }) => {

  const images = project?.showcase?.images || [];

  const loopImages = [...images, ...images];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [itemWidth, setItemWidth] = useState(300);

  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  //  Calculate width dynamically
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;

      if (window.innerWidth >= 1200) {
        setItemWidth(containerWidth / 4); // 4 items
      } else if (window.innerWidth >= 1024) {
        setItemWidth(containerWidth / 3); // tablet
      } else if (window.innerWidth >= 768) {
        setItemWidth(containerWidth / 2); // tablet
      } else {
        setItemWidth(containerWidth); // mobile
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto scroll
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 2500);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Infinite reset
  useEffect(() => {
    if (!sliderRef.current) return;

    sliderRef.current.style.transition = "transform 0.7s ease-in-out";

    if (currentIndex >= images.length) {
      const timeout = setTimeout(() => {
        if (!sliderRef.current) return;

        sliderRef.current.style.transition = "none";
        setCurrentIndex(0);
      }, 700);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, images.length]);

  return (
    <section className="py-10 px-5 md:px-10 xl:px-[5.5%] bg-[#f5f5f5] flex flex-col gap-6 md:gap-10 items-center justify-center overflow-hidden">
      
      {/* Header */}
      <div className="space-y-3 flex flex-col items-center">
        <Badge text="Visual ShowCase" className="text-tertiary" />

        <h1 className="text-3xl md:text-[50px] font-bold leading-[54px] tracking-tight">
          <span className="text-[#BFBFBF]">Real Work. </span>
          <span className="text-black">Real Impact.</span>
        </h1>
      </div>

      {/* Slider */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={sliderRef}
          className="flex"
          style={{
            transform: `translateX(-${currentIndex * itemWidth}px)`,
            width: `${loopImages.length * itemWidth}px`,
          }}
        >
          {loopImages.map((img, index) => (
            <div
              key={index}
              className="px-3 shrink-0 cursor-pointer"
              style={{ width: itemWidth }}
              onClick={() => setSelectedImage(img)}
            >
              <div className="rounded-xl overflow-hidden group ">
                <Image
                  src={img}
                  alt="showcase"
                  width={400}
                  height={400}
                  className="w-full h-[350px] object-cover group-hover:scale-105 transition duration-500 ease-in-out"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="preview"
              width={800}
              height={1000}
              className="w-full h-auto rounded-lg"
            />

            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-8 bg-white px-3 py-1 rounded-full cursor-pointer hover:rotate-360 transition-all duration-500 ease-in-out"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};