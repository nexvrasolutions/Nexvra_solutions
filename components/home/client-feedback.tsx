"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";

const testimonials = [
    {
        id: 1,
        text: "Nexvra Solutions did an excellent job with our website. The design is clean, modern, and easy to use. Our customers now find it easier to connect with us online.",
        name: "Arun S",
        company: "Magic Aisles",
        image: "/images/eye.png",
    },
    {
        id: 2,
        text: "I joined Nexvra for UI/UX design, and the training was very practical. I learned how to design real apps and gained confidence in my skills.",
        name: "Abino",
        company: "Student",
        image: "/images/eye.png",
    },
    {
        id: 3,
        text: "Their digital marketing support helped us reach more customers. We saw better engagement and growth in a short time.",
        name: "Vignesh K",
        company: "JE Mobiles",
        image: "/images/eye.png",
    },
];

export default function ClientFeedback() {
    return (
        <section className="relative bg-white min-h-[70vh] overflow-hidden px-7 md:px-10 xl:px-[5.5%] py-10 md:py-[5%]">

            {/* Grid lines */}
            <div className="grid-line absolute left-[3%] lg:left-[5%]  top-0 h-full w-px bg-[#F3F3F3]" />
            <div className="grid-line absolute hidden lg:block left-[51.5%] top-0 h-full w-px bg-[#F3F3F3]" />
            <div className="grid-line right-[3%] lg:right-[5%] top-0 h-full w-px bg-[#F3F3F3]" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-16 items-start">
                {/* LEFT SIDE */}
                <div>
                    <div>
                        <Badge text="Testimonials" className="text-tertiary" />
                        <h1 className="font-primary text-teritiary text-[30px] md:text-[40px] lg:text-[50px] xl:text-[64px] z-10 font-bold leading-tight lg:leading-20">
                            What Our Clients Say
                        </h1>
                    </div>

                    {/* Illustration */}
                    <div className="relative">
                        <Image
                            src="/images/client.png"
                            alt="feedback"
                            width={350}
                            height={320}
                            className="object-contain size-50 md:size-50"
                        />
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="space-y-3 md:space-y-6">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            viewport={{ once: true }}
                            className="group transition-all pb-3 md:pb-6 duration-300 bg-white border-b border-[#F3F3F3]"
                        >
                            <p className="text-[#0A0A0ACC] font-secondary leading-tight xl:leading-[28px] text-lg lg:text-xl">
                                {item.text}
                            </p>

                            <div className="flex items-center gap-3 mt-2 md:mt-5">
                                <div className="w-10 h-10 rounded-md overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={40}
                                        height={40}
                                        className="object-cover "
                                    />
                                </div>

                                <div className="font-secondary">
                                    <h4 className="font-medium text-[#404040] text-xl md:text-2xl leading-8">
                                        {item.name}
                                    </h4>
                                    <p className="text-[#0A0A0ACC]/80 text-[17px] md:text-lg">
                                        {item.company}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}