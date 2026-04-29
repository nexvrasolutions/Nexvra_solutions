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
    if (!sectionRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context((self) => {
      const q: any = self.selector;

      const mm = gsap.matchMedia();

      // GRID
      gsap.from(q(".bg-grid"), {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      // ROCKET ENTRY
      gsap.from(q(".about-image"), {
        y: 160,
        opacity: 0,
        rotate: -8,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
        onComplete: () => {
          gsap.to(q(".about-image"), {
            y: "-=15",
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      });

      // TEXT
      gsap.from(q(".footer-text"), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: q(".footer-text"),
          start: "top 90%",
          once: true,
        },
      });

      // BUTTON
      gsap.from(q(".footer-btn"), {
        y: 30,
        opacity: 0,
        duration: 0.7,
        scrollTrigger: {
          trigger: q(".footer-btn"),
          start: "top 95%",
          once: true,
        },
      });

      // HEADING
      gsap.from(q(".footer-letter"), {
        y: 80,
        opacity: 0,
        stagger: 0.03,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: q(".footer-heading"),
          start: "top 85%",
          once: true,
        },
      });

      // MAGNETIC BUTTON (CLEANED)
      const button = q(".footer-btn")[0] as HTMLElement;

      if (button) {
        const move = (e: MouseEvent) => {
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(button, {
            x: x * 0.15,
            y: y * 0.15,
            duration: 0.3,
            ease: "power3.out",
          });
        };

        const leave = () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1,0.3)",
          });
        };

        button.addEventListener("mousemove", move);
        button.addEventListener("mouseleave", leave);

        // 🔥 CLEANUP
        return () => {
          button.removeEventListener("mousemove", move);
          button.removeEventListener("mouseleave", leave);
        };
      }

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const router = useRouter();

  const splitText = (text: string) =>
    text.split(" ").map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block mr-2 whitespace-nowrap">
        {word.split("").map((char, charIndex) => (
          <span key={charIndex} className="footer-letter inline-block">
            {char}
          </span>
        ))}
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
      data-theme="dark"
      ref={sectionRef}
      className="px-5 md:px-10 xl:px-[5.5%] min-h-screen bg-black relative overflow-hidden pt-[10%]"
    >
      <h2 className="sr-only">Nexvra Solutions Footer</h2>
      <p className="sr-only">
        Nexvra Solutions is an IT company in Kanyakumari offering web development,
        mobile app development, digital marketing, and professional training courses.
      </p>
      {/* Grid lines */}
      <div className="bg-grid h-full w-px left-[3%] xl:left-[5%] absolute" />
      <div className="bg-grid h-full w-px hidden lg:block lg:left-[50.5%] xl:left-[46%] top-0 absolute" />
      <div className="bg-grid h-full w-px right-[3%] xl:right-[5%] absolute" />

      <div className="flex flex-col gap-5  relative">
        <div className="flex flex-col lg:flex-row pb-5 md:pb-15 gap-5 md:gap-10 lg:gap-0 relative">
          <div className="relative footer-hex mx-auto w-full  lg:w-[50%] xl:w-[46.5%]">
            <div className="relative footer-hex mx-auto w-full md:w-[50%] lg:max-h-[300px]">
              <div className="relative w-full h-full">
                <a href="/">
                  <Image
                    src="/images/rocket.png"
                    alt="Nexvra Solutions rocket illustration representing innovation"
                    width={500}
                    height={400}
                    className="object-contain w-full h-full mx-auto"
                    priority
                  />
                </a>
                {/* Gradient Overlay (adaptive & smooth) */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent"
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-5 pt-2 lg:pt-20 w-full lg:w-[48%] xl:w-[54%]">
            <div className="flex flex-col gap-6 xl:gap-10">
              <div className="overflow-hidden">
                <h4 className="footer-heading font-semibold font-primary text-[32px] lg:text-[34px] xl:text-[47px] 2xl:text-[54px] leading-[1.1] text-white text-balance break-keep">
                  {splitText("Ready to Ride the Next")}
                  <br className="hidden lg:flex" />
                  {splitText("Wave of Innovation")}
                </h4>
              </div>

              <p className="footer-text font-secondary  text-white/80 text-xl leading-[30px] lg:w-[90%]">
                We help individuals learn modern digital skills and help businesses build powerful digital solutions.
              </p>
            </div>

            <div className="footer-btn">
              <a href="/contact">
                <Button label="Let's Talk" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-black text-white pb-6 pt-10 xl:pt-20 font-secondary border-t border-t-grid">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-10 w-full">

          {/* Left */}
          <div className="flex flex-col gap-5 md:gap-10 xl:gap-15 w-full lg:w-[50%] xl:w-[45%]">

            <a href="/">
              <img
                src="/logo.png"
                alt="Nexvra Solutions"
                className="w-full xl:w-[80%] h-full object-contain"
              />
            </a>

            <div className="w-full flex flex-col md:flex-row justify-between gap-3">
              <div className="w-full lg:w-[40%] xl:w-[50%] flex flex-col gap-3">
                <h4 className="text-white text-xl xl:text-[24px] ">Address</h4>
                <a
                  href="https://maps.app.goo.gl/tMWXWiof5fmyHhqh6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-block text-white/80 text-lg hover:text-white transition
                  after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#A4FF00]  hover:after:w-[50%]
                  after:transition-all after:duration-300"
                >
                  Marthandam,  <br />
                  Kanyakumari
                </a>
              </div>

              <div className="w-full lg:w-[60%] xl:w-[50%] flex flex-col gap-3">
                <h4 className="text-white text-xl xl:text-[24px] font-secondary">Contact</h4>
                <div className="flex flex-col gap-1">
                  <a
                    href="tel:+919385708357"
                    target="_blank"
                    className="relative inline-block text-white/80 hover:text-[] text-[16px] md:text-xl cursor-pointer after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#A4FF00] after:transition-all after:duration-300 hover:after:w-[50%]"
                    >
                    +91 93857 08357
                  </a>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=contactnexvra@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-block text-white/80 hover:text-[] text-[16px] md:text-xl cursor-pointer after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#A4FF00] after:transition-all after:duration-300 hover:after:w-[75%]"
                  >
                    contactnexvra@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-6 justify-between font-primary footer-links">
              <a
                href="https://www.instagram.com/nexvra.solutions"
                target="_blank"
                className="relative inline-block text-white/80 hover:text-[] text-[16px] md:text-xl cursor-pointer 
    after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#A4FF00] 
    after:transition-all after:duration-300 hover:after:w-full"
              >
                Instagram
              </a>

              <a
                href="https://www.linkedin.com/company/nexvra-solutions/"
                target="_blank"
                className="relative inline-block text-white/80 hover:text-white text-[16px] md:text-xl cursor-pointer 
    after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#A4FF00] 
    after:transition-all after:duration-300 hover:after:w-full"
              >
                Linkedin
              </a>

              <a
                href="https://wa.me/message/ZWX4OKLWARYXC1"
                className="relative inline-block text-white/80 hover:text-white text-[16px] md:text-xl cursor-pointer 
    after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#A4FF00] 
    after:transition-all after:duration-300 hover:after:w-full"
              >
                Whatsapp
              </a>
            </div>
          </div>

          {/* Right columns */}
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-0 w-full lg:w-[55%]">
            <FooterColumn
              title="Menu"
              className="flex-1"
              items={[
                { label: "Home", link: "/" },
                { label: "About Us", link: "/about-us" },
                { label: "Solutions", link: "/solutions" },
                { label: "Projects", link: "/projects" },
                { label: "Contact", link: "/contact" },
              ]}
              />
            <FooterColumn
              title="Services"
              items={[
                { label: "Branding & Design", link: "/projects" },
                { label: "Digital Marketing", link: "/projects" },
                { label: "Web Development", link: "/projects" },
                { label: "App Development", link: "/projects" },
                { label: "Software Solutions", link: "/projects" },
              ]}
              className="flex-1"
              />
            <FooterColumn
              title="Courses"
              className="flex-1"
              items={[
                { label: "AI Product Design", link: "/course-detail/ai-powered-product-design" },
                { label: "UX Design", link: "/course-detail/ux-design" },
                { label: "UI Design", link: "/course-detail/ui-design" },
                { label: "Digital Marketing", link: "/course-detail/digital-marketing-mastery" },
                { label: "Frontend Dev", link: "/course-detail/front-end-development" },
              ]}
            />
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col-reverse md:flex-col lg:flex-row gap-4 lg:gap-0 items-start font-primary lg:items-center justify-between mt-5 md:mt-10 lg:mt-20 text-white/80">
          <p className="text-center lg:text-left">© 2026 Nexvra Solutions. All rights reserved.</p>

          <div className="flex gap-5 md:gap-20">
            <a
              href="/privacy-policy"
              className="relative inline-block text-white/80 hover:text-white transition text-[16px] md:text-lg cursor-pointer
  after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#A4FF00]
  after:transition-all after:duration-300 hover:after:w-full"
            >
              Privacy Policy
            </a>

            <a
              href="/terms-and-conditions"
              className="relative inline-block text-white/80 hover:text-white transition text-[16px] md:text-lg cursor-pointer
  after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#A4FF00]
  after:transition-all after:duration-300 hover:after:w-full"
            >
              Terms and Conditions
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
};

const FooterColumn = ({ title, items, className }: { title: string; items: any, className?: string }) => {
  return (
    <div className={cn("flex flex-col gap-5 font-secondary", className)}>
      <h3 className="text-white text-xl xl:text-[24px] font-medium">
        {title}
      </h3>

      <div className="flex flex-col gap-3">
        {items.map((item: any, idx: number) => (
          <a
            key={idx}
            href={item.link}
            className="text-white/80 text-[16px] md:text-xl hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Footer;


