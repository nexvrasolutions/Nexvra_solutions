"use client";

import { MapEmbed } from '@/components/common/map-embed';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import React, { useRef } from 'react'
import { motion, useInView } from "framer-motion";

const ContactClient = () => {
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, {
        once: true,
        margin: "0px 0px -100px 0px",
    });

    const containerVariants: any = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants: any = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <section
            ref={sectionRef}
            className="bg-white px-5 md:px-10 xl:px-[5.5%] py-10 lg:py-[6%]"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20">

                {/* LEFT */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="flex flex-col justify-between pb-10 lg:pb-0"
                >
                    <div>

                        <motion.h2
                            variants={itemVariants}
                            className="text-[40px] lg:text-[50px] 2xl:text-[64px] font-primary font-black text-tertiary leading-[1.1] tracking-tight mb-3 lg:mb-5"
                        >
                            Get{" "}
                            <br className='hidden lg:block' />
                            In Touch
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="text-[#404040CC]/80 font-primary text-lg leading-7 mb-8 max-w-md"
                        >
                            We’re here to help you take the next step. Whether you want to start a project,
                            learn new skills, or just explore ideas — feel free to reach out.
                        </motion.p>

                        {/* Contact Info */}
                        <motion.div variants={containerVariants} className="flex flex-col">

                            {/* Address */}
                            <motion.div variants={itemVariants} className="flex items-start gap-4 py-5 border-b border-gray-100">
                                <MapPin className="text-tertiary mt-0.5 shrink-0" size={20} />
                                <address className="not-italic">
                                    Marthandam<br />
                                    Kanyakumari District, Tamil Nadu – 629165
                                </address>
                            </motion.div>

                            {/* Phone */}
                            <motion.div variants={itemVariants} className="flex items-center gap-4 py-5 border-b border-gray-100">
                                <Phone className="text-tertiary shrink-0" size={20} />
                                <a href="tel:+919385708357">+91 93857 08357</a>
                            </motion.div>

                            {/* Email */}
                            <motion.div variants={itemVariants} className="flex items-center gap-4 py-5 border-b border-gray-100">
                                <Mail className="text-tertiary shrink-0" size={20} />
                                <a href="mailto:contactnexvra@gmail.com">contactnexvra@gmail.com</a>
                            </motion.div>

                            {/* Hours */}
                            <motion.div variants={itemVariants} className="flex items-start gap-4 py-5 border-b border-gray-100">
                                <Clock className="text-tertiary mt-0.5 shrink-0" size={20} />
                                <span className="text-[#404040CC]/80 font-primary text-lg leading-7">
                                    Monday – Saturday
                                    <br />
                                    9:00 AM – 6:00 PM
                                </span>
                            </motion.div>

                        </motion.div>
                    </div>
                </motion.div>

                {/* RIGHT FORM */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="flex flex-col gap-8 justify-center font-primary"
                >

                    {["Full Name", "Phone Number", "Email Address", "Message"].map((label, i) => (
                        <motion.div key={i} variants={itemVariants} className="flex flex-col gap-2">
                            <label className="text-base font-semibold text-tertiary">
                                {label}
                            </label>
                            <input
                                type="text"
                                placeholder={`Enter your ${label.toLowerCase()}`}
                                className="border-b border-gray-300 pb-3 text-[#40404099] placeholder:text-[#40404099]/60 text-base bg-transparent outline-none focus:border-tertiary transition-colors duration-200"
                            />
                        </motion.div>
                    ))}

                    <motion.div variants={itemVariants} className='flex flex-col gap-3'>
                        <div className="mt-2">
                            <Button label='Send Message' />
                        </div>
                        <p className="text-sm text-gray-500">
                            We’ll get back to you within 24 hours.
                        </p>
                    </motion.div>

                </motion.div>

            </div>

            {/* MAP */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="mt-16 mb-6"
            >
                <motion.h3 variants={itemVariants} className="text-2xl font-primary font-semibold mb-2">
                    Visit Our Location
                </motion.h3>

                <motion.p variants={itemVariants} className="font-primary text-gray-500">
                    Find us easily and connect with us in person.
                </motion.p>
            </motion.div>

            <MapEmbed />
        </section>
    )
}

export default ContactClient