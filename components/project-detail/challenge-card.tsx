"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  { rotate: -8, delay: 0, x: -60 },
  { rotate: -3, delay: 0.1, x: -20 },
  { rotate: 3, delay: 0.2, x: 20 },
  { rotate: 9, delay: 0.3, x: 60 },
];

export default function ChallengeCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards entrance animation on scroll
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        // Initial state
        gsap.set(card, {
          y: 120,
          opacity: 0,
          rotate: cards[i].rotate - 5,
          scale: 0.85,
        });

        // Scroll-triggered entrance
        gsap.to(card, {
          y: 0,
          opacity: 1,
          rotate: cards[i].rotate,
          scale: 1,
          duration: 1.1,
          delay: cards[i].delay,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Image parallax + float animation for each card
      imageRefs.current.forEach((imgEl, i) => {
        if (!imgEl) return;

        // Continuous floating animation
        gsap.to(imgEl, {
          y: -12,
          duration: 2 + i * 0.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.3,
        });

        // Image scroll parallax
        gsap.fromTo(
          imgEl,
          { y: 30, scale: 0.8, opacity: 0, rotate: -10 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 1.2,
            delay: cards[i].delay + 0.15,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (i: number) => {
    const card = cardsRef.current[i];
    if (!card) return;
    gsap.to(card, {
      scale: 1.06,
      rotate: cards[i].rotate * 0.4,
      y: -12,
      duration: 0.4,
      ease: "power2.out",
      zIndex: 10,
    });
  };

  const handleMouseLeave = (i: number) => {
    const card = cardsRef.current[i];
    if (!card) return;
    gsap.to(card, {
      scale: 1,
      rotate: cards[i].rotate,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.6)",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center py-24 px-6 overflow-hidden"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
       
      />

      {/* Cards row */}
      <div className="relative flex items-end justify-center gap-4 md:gap-6 w-full max-w-5xl">
        {cards.map((card, i) => (
          <div
            key={i}
            ref={(el) => { cardsRef.current[i] = el; }}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={() => handleMouseLeave(i)}
            className="relative cursor-pointer"
            style={{
              transform: `rotate(${card.rotate}deg)`,
              zIndex: i === 1 || i === 2 ? 2 : 1,
            }}
          >
            <div
              className="bg-[#f0f0ee] rounded-2xl p-5 w-52 md:w-60 shadow-[4px_8px_32px_rgba(0,0,0,0.10)]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {/* Image area */}
              <div
                ref={(el) => { imageRefs.current[i] = el; }}
                className="relative w-full h-36 mb-4 flex items-center justify-center"
              >
                <Image
                  src="/images/green-eye.png"
                  alt="Green Eye Icon"
                  fill
                  className="object-contain drop-shadow-md"
                  sizes="(max-width: 768px) 180px, 220px"
                />
              </div>

              {/* Text */}
              <p
                className="text-base mb-1 text-neutral-700 font-normal"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                The{" "}
                <span className="font-extrabold text-neutral-900">
                  Challenge
                </span>
              </p>
              <p className="text-[11px] leading-snug text-neutral-500">
                SmartRetail needed a scalable digital platform to improve
                product discovery and drive higher conversion rates, while
                providing a modern, user-friendly experience.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}