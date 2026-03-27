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
                description="Have an idea, project, or question? Let’s connect and build something meaningful together."
                image="/images/about-bg.jpg"
            />
            <section className="bg-white px-5 md:px-10 xl:px-[5.5%] py-10 lg:py-[6%]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20">
                    {/* Left */}
                    <div className="flex flex-col justify-between pb-10 lg:pb-0">
                        {/* Heading */}
                        <div>
                            <h2 className="text-[40px] lg:text-[50px] 2xl:text-[64px] font-primary font-black text-tertiary leading-[1.1] tracking-tight mb-3 lg:mb-5">
                                Get{" "}
                                <br className='hidden lg:block' />
                                In Touch
                            </h2>
                            <p className="text-[#404040CC]/80 font-primary text-lg leading-7 mb-8 max-w-md">
                                We’re here to help you take the next step. Whether you want to start a project,
                                learn new skills, or just explore ideas — feel free to reach out.
                            </p>

                            {/* Contact Info */}
                            <div className="flex flex-col">
                                {/* Address */}
                                <div className="flex items-start gap-4 py-5 border-b border-gray-200">
                                    <MapPin className="text-tertiary mt-0.5 shrink-0" size={20} />
                                    <span className="text-[#404040CC]/80 font-primary text-lg leading-7">
                                        Marthandam
                                        Kanyakumari District, Tamil Nadu – 629165
                                    </span>
                                </div>

                                {/* Phone */}
                                <div className="flex items-center gap-4 py-5 border-b border-gray-200">
                                    <Phone className="text-tertiary shrink-0" size={20} />
                                    <span className="text-[#404040CC]/80 font-primary text-lg leading-7">+91 93857 08357</span>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-4 py-5 border-b border-gray-200">
                                    <Mail className="text-tertiary shrink-0" size={20} />
                                    <span className="text-[#404040CC]/80 font-primary text-lg leading-7">contactnexvra@gmail.com</span>
                                </div>

                                {/* Hours */}
                                <div className="flex items-start gap-4 py-5 border-b border-gray-200">
                                    <Clock className="text-tertiary mt-0.5 shrink-0" size={20} />
                                    <span className="text-[#404040CC]/80 font-primary text-lg leading-7 leading-relaxed">
                                        Monday – Saturday
                                        <br />
                                        9:00 AM – 6:00 PM
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
                                placeholder="Enter your full name"
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
                                placeholder="Tell us about your requirement"
                                className="border-b border-gray-300 pb-3 text-[#40404099] placeholder:text-[#40404099]/60 text-base bg-transparent outline-none focus:border-tertiary transition-colors duration-200"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className='flex flex-col gap-3'>
                            <div className="mt-2">
                                <Button label='Send Message' />
                            </div>
                            <p className="text-sm text-gray-500">
                                We’ll get back to you within 24 hours.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-16 mb-6">
                    <h3 className="text-2xl font-primary font-semibold mb-2">
                        Visit Our Location
                    </h3>
                    <p className="font-primary text-gray-500">
                        Find us easily and connect with us in person.
                    </p>
                </div>
                <MapEmbed />
            </section>
        </>
    )
}

export default page