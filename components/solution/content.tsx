"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Arrow } from "../ui/arrow";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const solutions = [
  {
    title: "Branding & Graphic Design",
    description:
      "We create strong and consistent visual identities that make your brand stand out. From logos to marketing creatives, we ensure your brand looks modern, professional, and memorable.",
    includes: [
      "Logo Design",
      "Brand Identity",
      "Social Media Creatives",
      "Marketing Materials",
    ],
    cta: "Build Your Brand",
    image: "/images/solution/branding.webp",
  },
  {
    title: "Digital Marketing",
    description:
      "We help your business grow online using smart and result-driven digital marketing strategies focused on visibility, engagement, and conversions.",
    includes: [
      "Social Media Marketing",
      "Paid Ads (Meta / Google)",
      "Content Strategy",
      "Audience Targeting",
    ],
    cta: "Grow Your Business",
    image: "/images/solution/marketing.webp",
  },
  {
    title: "Website Development",
    description:
      "We design and develop modern, fast, and responsive websites that represent your business professionally and convert visitors into customers.",
    includes: [
      "Business Websites",
      "Landing Pages",
      "Responsive Design",
      "Performance Optimization",
    ],
    cta: "Get Your Website",
    image: "/images/solution/web.webp",
  },
  {
    title: "Mobile App Development",
    description:
      "We build user-friendly and scalable mobile applications that deliver smooth performance and engaging user experiences.",
    includes: [
      "Android App Development",
      "UI-Based Apps",
      "API Integration",
      "App Optimization",
    ],
    cta: "Build Your App",
    image: "/images/solution/app.webp",
  },
  {
    title: "Software Development",
    description:
      "We develop custom software solutions tailored to your business needs, helping you automate processes and improve efficiency.",
    includes: [
      "Custom Applications",
      "Business Tools",
      "Automation Systems",
      "Scalable Solutions",
    ],
    cta: "Start Your Project",
    image: "/images/solution/software.webp",
  },
];

const CARD_COUNT = solutions.length;

export default function SolutionContent() {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value?: number) {
        if (typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        } else {
          return lenis.scroll;
        }
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? "transform" : "fixed", 
    });

    ScrollTrigger.defaults({ scroller: document.body });

    const cards = cardsRef.current;

    let lastIndex = -1; 

    const ctx = gsap.context(() => {
      gsap.set(cards, { y: window.innerHeight });
      gsap.set(cards[0], { y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top+=1",
          end: `+=${window.innerHeight * (CARD_COUNT - 1)}`,
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,

          onUpdate: (self) => {
            const index = Math.round(self.progress * (CARD_COUNT - 1));

            if (index !== lastIndex) {
              lastIndex = index;
              setActiveIndex(index);
            }
          },
        },
      });

      cards.forEach((card, i) => {
        if (i === 0) return;

        tl.to(
          card,
          {
            y: i * 12,
            ease: "power2.out",
          },
          i * 0.9
        );
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      lenis.destroy();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const activeItem = solutions[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white px-5 md:px-10 xl:px-[5.5%] py-[10%]"
    >
      <div className="relative h-screen lg:h-[70vh]">
        {solutions.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) cardsRef.current[index] = el;
            }}
            style={{
              transformOrigin: "top center",
              willChange: "transform",
              zIndex: index + 1,
            }}
            className="absolute top-0 left-0 w-full bg-white"
          >

            {/* SAME HEADER (moved inside) */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 md:gap-8 mb-3 md:mb-5 lg:mb-10 my-3 lg:my-10 px-5 md:px-10 xl:px-[5.5%]">
              <div className="flex flex-col gap-1 md:gap-4 max-w-2xl xl:max-w-4xl">
                <h2 className="text-[26px] md:text-[35px] xl:text-[40px] font-bold tracking-tight">
                  {item.title}
                </h2>

                <p className="text-[16px] md:text-lg lg:text-xl leading-7 text-[#404040CC]/80 font-medium">
                  {item.description}
                </p>
              </div>

              <div className="hidden md:flex items-start lg:items-end lg:justify-end">
                <Button label={item.cta} />
              </div>
            </div>

            {/* ORIGINAL CARD (UNCHANGED UI) */}
            <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] border-b border-[#E6E6E6] bg-white">

              {/* Lines */}
              <div className="absolute top-0 h-full lg:h-[50%] w-px bg-[#E6E6E6]" />
              <div className="absolute top-0 w-full h-px bg-[#E6E6E6]" />
              {/* <div className="hidden lg:block absolute left-[58%] top-0 h-full w-px bg-[#E6E6E6]" /> */}
              <div className="absolute right-0 top-0 h-full w-px bg-[#E6E6E6]" />

              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover w-full h-[220px] lg:h-[380px]"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between px-6 lg:px-10 py-2 lg:py-10 gap-5">
                <div className="flex flex-col gap-2">
                  {item.includes.map((inc, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Arrow className="bg-white size-9" />
                      <span className="text-sm lg:text-base">
                        {inc}
                      </span>
                    </div>
                  ))}
                  <div className="flex md:hidden items-start justify-start ml-3">
                    <Button label={item.cta} />
                  </div>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>
    </section>
  );
}