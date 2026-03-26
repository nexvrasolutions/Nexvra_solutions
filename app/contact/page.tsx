import ContentSection from '@/components/common/content-section'
import { MapEmbed } from '@/components/common/map-embed';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import React from 'react'

const page = () => {
    return (
        <>
            <ContentSection
                title="Contact"
                description="Each project reflects our passion for blending ** creativity, technology, and strategy **. Here’s how we’ve helped businesses transform and grow."
                image="/images/about-bg.jpg"
            />
            <section className="bg-white px-[5.5%] py-[6%]">
                <div className="grid grid-cols-2 gap-x-20">
                    {/* Left */}
                    <div className="flex flex-col justify-between">
                        {/* Heading */}
                        <div>
                            <h2 className="text-[62px] font-primary font-black text-tertiary leading-[1.1] tracking-tight mb-16">
                                Get
                                <br />
                                In Touch
                            </h2>

                            {/* Contact Info */}
                            <div className="flex flex-col">
                                {/* Address */}
                                <div className="flex items-start gap-4 py-5 border-b border-gray-200">
                                    <MapPin className="text-tertiary mt-0.5 shrink-0" size={20} />
                                    <span className="text-[#404040CC]/80 font-primary text-lg leading-7">
                                        Marthandam, Nagercoil, Kanyakumari District
                                    </span>
                                </div>

                                {/* Phone */}
                                <div className="flex items-center gap-4 py-5 border-b border-gray-200">
                                    <Phone className="text-tertiary shrink-0" size={20} />
                                    <span className="text-[#404040CC]/80 font-primary text-lg leading-7">+91 94943 76545</span>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-4 py-5 border-b border-gray-200">
                                    <Mail className="text-tertiary shrink-0" size={20} />
                                    <span className="text-[#404040CC]/80 font-primary text-lg leading-7">nexvra@gmail.com</span>
                                </div>

                                {/* Hours */}
                                <div className="flex items-start gap-4 py-5 border-b border-gray-200">
                                    <Clock className="text-tertiary mt-0.5 shrink-0" size={20} />
                                    <span className="text-[#404040CC]/80 font-primary text-lg leading-7 leading-relaxed">
                                        Monday - Saturday
                                        <br />
                                        9:00 AM - 6:00 PM
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div className="flex flex-col gap-8 justify-center font-primary">
                        {/* Full Name */}
                        <div className="flex flex-col gap-2">
                            <label className="text-base font-semibold text-tertiary">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your phone number"
                                className="border-b border-gray-300 pb-3 text-[#38383899] placeholder:text-[#40404099]/60 text-base bg-transparent outline-none focus:border-tertiary transition-colors duration-200"
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="flex flex-col gap-2">
                            <label className="text-base font-semibold text-tertiary">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                className="border-b border-gray-300 pb-3 text-[#40404099] placeholder:text-[#40404099]/60 text-base bg-transparent outline-none focus:border-tertiary transition-colors duration-200"
                            />
                        </div>

                        {/* Email Address */}
                        <div className="flex flex-col gap-2">
                            <label className="text-base font-semibold text-tertiary">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="border-b border-gray-300 pb-3 text-[#39393999] placeholder:text-[#40404099]/60 text-base bg-transparent outline-none focus:border-tertiary transition-colors duration-200"
                            />
                        </div>

                        {/* Message */}
                        <div className="flex flex-col gap-2">
                            <label className="text-base font-semibold text-tertiary">
                                Message
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your message"
                                className="border-b border-gray-300 pb-3 text-[#40404099] placeholder:text-[#40404099]/60 text-base bg-transparent outline-none focus:border-tertiary transition-colors duration-200"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="mt-2">
                            <Button label='Send Message' />
                        </div>
                    </div>
                </div>
                <MapEmbed />
            </section>
        </>
    )
}

export default page