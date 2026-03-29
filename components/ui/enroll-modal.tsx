"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { X } from "lucide-react";

interface EnrollModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCourse?: any;
}

const courses = [
    "AI-Powered Product Design",
    "UX Design",
    "UI Design",
    "Digital Marketing Mastery",
    "Branding & Graphic Design",
    "Front-End Development",
    "Back-End Development",
    "Mobile App Development",
];

export const EnrollModal = ({ isOpen, onClose, selectedCourse }: EnrollModalProps) => {
    const containerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.08, delayChildren: 0.05 },
        },
        exit: { opacity: 0, y: 40 },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

                    {/* MODAL */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full max-w-[600px] bg-white rounded-xl p-6 md:p-10 relative"
                    >

                        {/* CLOSE BUTTON */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black"
                        >
                            <X size={20} />
                        </button>

                        {/* TITLE */}
                        <h2 className="text-2xl md:text-3xl font-semibold font-primary mb-6">
                            Enroll Now
                        </h2>

                        {/* FORM */}
                        <motion.form
                            variants={containerVariants}
                            className="flex flex-col gap-6"
                        >

                            {/* Full Name */}
                            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-tertiary">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="border-b border-gray-300 pb-3 text-[#404040] placeholder:text-[#404040]/60 bg-transparent outline-none focus:border-tertiary"
                                />
                            </motion.div>

                            {/* Email */}
                            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-tertiary">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="border-b border-gray-300 pb-3 text-[#404040] placeholder:text-[#404040]/60 bg-transparent outline-none focus:border-tertiary"
                                />
                            </motion.div>

                            {/* Phone */}
                            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-tertiary">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    className="border-b border-gray-300 pb-3 text-[#404040] placeholder:text-[#404040]/60 bg-transparent outline-none focus:border-tertiary"
                                />
                            </motion.div>

                            {/* Course Dropdown */}
                            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-tertiary">
                                    Select Course
                                </label>
                                <select
                                    defaultValue={
                                        selectedCourse
                                            ? Array.isArray(selectedCourse.title)
                                                ? selectedCourse.title.join(" ")
                                                : selectedCourse.title
                                            : ""
                                    }
                                    className="border-b border-gray-300 pb-3 bg-transparent outline-none focus:border-tertiary text-[#404040]"
                                >
                                    <option value="">Choose a course</option>
                                    {courses.map((course, i) => (
                                        <option key={i} value={course}>
                                            {course}
                                        </option>
                                    ))}
                                </select>
                            </motion.div>

                            {/* Message */}
                            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-tertiary">
                                    Message
                                </label>
                                <textarea
                                    placeholder="Tell us anything (optional)"
                                    rows={3}
                                    className="border-b border-gray-300 pb-3 bg-transparent outline-none focus:border-tertiary resize-none text-[#404040]"
                                />
                            </motion.div>

                            {/* BUTTON */}
                            <motion.div variants={itemVariants} className="mt-4">
                                <Button label="Submit Application" className="w-full" />
                            </motion.div>

                            <p className="text-xs text-gray-500 text-center">
                                We’ll contact you within 24 hours.
                            </p>
                        </motion.form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};