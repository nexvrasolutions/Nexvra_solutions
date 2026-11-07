"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

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

    useEffect(() => {
        if (isOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        } else {
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "0px";
        }

        return () => {
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "0px";
        };
    }, [isOpen]);

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        course: selectedCourse?.title || "",
        message: "",
    });

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const formRef = useRef<HTMLFormElement | null>(null);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev: any) => {
            const updated = { ...prev };
            delete updated[name];
            return updated;
        });
    };

    const validateForm = () => {
        const newErrors: any = {};
        const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^[6-9]\d{9}$/;

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.name.trim())) {
            newErrors.name = "Name can only contain letters, spaces, and . ' -";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = "Enter a valid email address";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
            newErrors.phone = "Enter a valid 10-digit Indian mobile number";
        }

        if (!formData.course) newErrors.course = "Please select a course";

        return newErrors;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        const formDataToSend = new FormData(formRef.current!);
        formDataToSend.append("_captcha", "false");
        formDataToSend.append("_template", "table");
        formDataToSend.append("_subject", `New Enrollment - ${formData.course}`);

        try {
            // fetch() only rejects on network errors; treat HTTP errors as failures too.
            const promise = fetch(
                "https://formsubmit.co/contactnexvra@gmail.com",
                {
                    method: "POST",
                    body: formDataToSend,
                }
            ).then((res) => {
                if (!res.ok) throw new Error(`Form service responded with ${res.status}`);
                return res;
            });

            // sonner v2 returns a toast id; unwrap() gives the real promise, so a
            // failed request is caught below instead of clearing and closing the form.
            await toast.promise(promise, {
                loading: "Submitting application...",
                success: "Application submitted successfully!",
                error: "Failed to submit application",
            }).unwrap();

            setFormData({
                name: "",
                email: "",
                phone: "",
                course: "",
                message: "",
            });

            onClose(); // close modal after success
        } catch {
            // toast.promise already showed the error; keep the form open so the user can retry.
        } finally {
            setLoading(false);
        }
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
                        className="w-full max-w-[600px] max-h-[95vh] overflow-y-scroll bg-white rounded-xl p-6 md:p-10 relative"
                    >

                        {/* CLOSE BUTTON */}
                        <button
                            onClick={onClose}
                            className="absolute top-12 right-10 text-gray-500 hover:text-black"
                        >
                            <X size={25} />
                        </button>

                        {/* TITLE */}
                        <h2 className="text-2xl md:text-3xl font-semibold font-primary mb-6">
                            Enroll Now
                        </h2>

                        {/* FORM */}
                        <motion.form
                            ref={formRef}
                            variants={containerVariants}
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-6"
                        >

                            {/* Full Name */}
                            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-tertiary">
                                    Full Name
                                </label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    maxLength={60}
                                    className="border-b pb-3 outline-none"
                                />
                                {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                            </motion.div>

                            {/* Email */}
                            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-tertiary">
                                    Email Address
                                </label>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    type="email"
                                    placeholder="Enter your email"
                                    className="border-b pb-3 outline-none"
                                />
                                {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                            </motion.div>

                            {/* Phone */}
                            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-tertiary">
                                    Phone Number
                                </label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                                        handleChange({ target: { name: "phone", value: digits } } as any);
                                    }}
                                    type="tel"
                                    inputMode="numeric"
                                    placeholder="Enter 10-digit mobile number"
                                    maxLength={10}
                                    className="border-b pb-3 outline-none"
                                />
                                {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}
                            </motion.div>

                            {/* Course Dropdown */}
                            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-tertiary">
                                    Select Course
                                </label>
                                <select
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    className="border-b pb-3 outline-none"
                                >
                                    <option value="">Choose a course</option>
                                    {courses.map((course, i) => (
                                        <option key={i} value={course}>
                                            {course}
                                        </option>
                                    ))}
                                </select>
                                {errors.course && <span className="text-red-500 text-xs">{errors.course}</span>}
                            </motion.div>

                            {/* Message */}
                            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-tertiary">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Tell us anything (optional)"
                                    className="border-b pb-3 outline-none resize-none"
                                />
                            </motion.div>

                            {/* BUTTON */}
                            <motion.div variants={itemVariants} className="mt-4">
                                <Button
                                    type="submit"
                                    label={loading ? "Submitting..." : "Submit Application"}
                                    className="w-full"
                                    disabled={loading}
                                />
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