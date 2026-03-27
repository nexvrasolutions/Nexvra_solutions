"use client";

import { useEffect, useRef } from "react";
import { cn } from "../../utils/lib";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // GRID LINE DRAW
      gsap.from(".bg-grid", {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          once: true,
          start: "top 80%",
        },
      });

      // ROCKET LAUNCH
      gsap.from(".about-image", {
        y: 200,
        opacity: 0,
        rotate: -10,
        duration: 1.6,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          once: true,
          start: "top 75%",
        },
        onComplete: () => {
          // FLOAT LOOP
          gsap.to(".about-image", {
            y: -20,
            rotate: 2,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      });

      // PARAGRAPH
      gsap.from(".footer-text", {
        y: 60,
        opacity: 0,
        filter: "blur(6px)",
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: ".footer-text",
          start: "top 90%",
          once: true,
        },
      });

      // BUTTON
      gsap.from(".footer-btn", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        delay: 0.4,
        scrollTrigger: {
          trigger: ".footer-btn",
          start: "top 95%",
          once: true,
        },
      });

      // MENU LINKS
      gsap.from(".footer-links a", {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".footer-links",
          start: "top 90%",
          once: true,
        },
      });

      gsap.from(".footer-letter", {
        y: 120,
        opacity: 0,
        filter: "blur(8px)",
        stagger: 0.04,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".footer-heading",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(".footer-heading", {
        yPercent: 120,
        duration: 1.4,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".footer-heading",
          start: "top 85%",
          once: true,
        },
      });

      // BIG TEXT REVEAL
      gsap.from(".footer-big-letter", {
        x: -60,
        opacity: 0,
        filter: "blur(10px)",
        stagger: 0.06,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".footer-big-text",
          start: "top 90%",
          once: true,
        },
      });



      // BUTTON MAGNETIC EFFECT
      const button = document.querySelector(".footer-btn");

      button?.addEventListener("mousemove", (e: any) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(button, {
          x: x * 0.2,
          y: y * 0.2,
          duration: 0.4,
          ease: "power3.out",
        });
      });

      button?.addEventListener("mouseleave", () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1,0.3)",
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const router = useRouter();

  const splitText = (text: string) =>
    text.split("").map((char, i) => (
      <span key={i} className="footer-letter inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  const splitBigText = (text: string) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className="footer-big-letter inline-block bg-clip-text text-transparent"
        style={{
          background: "linear-gradient(180deg, #FFFFFF -68.06%, #0A0A0A 75%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      className="px-5 md:px-10 xl:px-[5.5%] min-h-screen bg-black relative overflow-hidden py-10 xl:py-[5%]"
    >
      {/* Grid lines */}
      <div className="bg-grid h-full w-px left-[3%] xl:left-[5%] absolute" />
      <div className="bg-grid h-full w-px hidden lg:block lg:left-[50.5%] xl:left-[54%] top-0 absolute" />
      <div className="bg-grid h-full w-px right-[3%] xl:right-[5%] absolute" />

      <div className="flex flex-col gap-5 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-4 xl:gap-10 relative">
          <div className="relative footer-hex w-full max-w-[220px] sm:max-w-[300px] md:max-w-[380px] lg:max-w-[450px] xl:max-w-[500px] mx-auto">

            <div className="relative w-full">

              <Image
                src="/images/rocket.png"
                alt="about-image"
                width={500}
                height={400}
                className="object-contain w-full h-auto mx-auto"
                priority
              />

              {/* Gradient Overlay */}
              <div className="pointer-events-none absolute bottom-0 left-0 w-full 
                h-[35%] sm:h-[40%] md:h-[45%] 
                bg-[linear-gradient(180deg,rgba(10,10,10,0)_0%,#0A0A0A_100%)]"
              />

            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-5 pt-2 lg:pt-20">
            <div className="flex flex-col gap-6 xl:gap-10">
              <div className="overflow-hidden">
                <h4 className="footer-heading font-semibold font-primary text-[30px] sm:text-[35px] lg:text-[34px] xl:text-[47px] 2xl:text-[54px] leading-[1.1] text-white">
                  {splitText("Ready to Ride the Next Wave of Innovation")}
                </h4>
              </div>

              <p className="footer-text font-secondary text-white/80 text-xl leading-[30px] lg:w-[90%]">
                We help individuals learn modern digital skills and help businesses build powerful digital solutions.
              </p>
            </div>

            <div className="footer-btn">
              <Button label="Let's Talk" onClick={() => router.push("/contact")} />
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-black text-white pb-6 pt-10 xl:pt-20 font-primary border-t border-t-grid">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-10 w-full">

          {/* Left */}
          <div className="flex flex-col gap-5 md:gap-10 xl:gap-15 w-full lg:w-[50%] xl:w-[55%]">

            <img
              src="/logo.png"
              alt="Nexvra Solutions"
              className="w-full h-full object-contain"
            />

            <div className="w-full flex flex-col md:flex-row justify-between gap-3">
              <div className="w-full lg:w-[40%] xl:w-[50%] flex flex-col gap-7">
                <h4 className="text-white text-xl xl:text-[24px]">Address</h4>
                <p className="text-white/80 text-lg xl:text-[20px]">
                  Marthandam <br /> Kanyakumari, India
                </p>
              </div>

              <div className="w-full lg:w-[60%] xl:w-[50%] flex flex-col gap-7">
                <h4 className="text-white text-xl xl:text-[24px]">Contact</h4>
                <div className="flex flex-col gap-1">
                  <p className="text-white/80 text-lg xl:text-[20px]">
                    +91 93857 08357
                  </p>
                  <p className="text-white/80 text-lg xl:text-[20px]">
                    contactnexvra@gmail.com
                  </p>
                </div>
              </div>
            </div>

            <div className="flex  footer-links">
              <a className="text-white/80 text-[22px] flex-1">Instagram</a>
              <a className="text-white/80 text-[22px] flex-1">Linkedin</a>
            </div>
          </div>

          {/* Right columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-10 w-full lg:w-[50%] xl:w-[45%] mt-0 md:mt-10 xl:mt-15 footer-links">
            <div className="cols-span-1">
              <FooterColumn
                title="Menu"
                items={[
                  "Home",
                  "About Us",
                  "Services",
                  "Testimonials",
                  "Case Studies",
                ]}
              />
            </div>
            {/* <div className="cols-span-1 lg:col-span-2 xl:cols-span-1"> */}
              <FooterColumn
                title="Services"
                items={[
                  "Consulting & Strategy",
                  "Software Development",
                  "UI/UX Design",
                  "Digital Transformation",
                  "Cloud Solutions",
                ]}
              />
            {/* </div> */}
          </div>
        </div>

        {/* Big Text */}
        {/* <div className="overflow-hidden">
          <h1
            className="footer-big-text w-full text-[clamp(40px,9vw,132px)] font-primary font-bold leading-[100%] mt-10 xl:mt-20 text-secondary bg-clip-text"
            style={{
              background: "linear-gradient(180deg, #FFFFFF -68.06%, #0A0A0A 75%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {splitBigText("Next Wave Next")}
          </h1>
        </div> */}

        {/* Bottom */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 items-start lg:items-center justify-between mt-5 md:mt-10 lg:mt-20 text-white/80">
          <p>© 2026 Nexvra Solutions. All rights reserved.</p>

          <div className="flex gap-5 md:gap-20">
            <a className="hover:text-white transition cursor-pointer">Privacy Policy</a>
            <a className="hover:text-white transition cursor-pointer">Terms and Conditions</a>
          </div>
        </div>
      </footer>
    </section>
  );
};

const FooterColumn = ({ title, items, className }: { title: string, items: string[], className?: string }) => (
  <div className="flex flex-col gap-5">
    <h3
      className={cn(
        "text-white text-xl xl:text-[24px] font-medium ",
        className
      )}
    >
      {title}
    </h3>

    <div className="flex flex-col gap-3">
      {items.map((item, idx) => (
        <a key={idx} className="text-white/80 text-lg xl:text-[20px]">
          {item}
        </a>
      ))}
    </div>
  </div>
);

export default Footer;


