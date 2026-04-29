import type { Metadata } from "next";
import ContentSection from "@/components/common/content-section";

export const metadata: Metadata = {
    title: "Terms and Conditions | Nexvra Solutions",
    description:
        "Read the Terms and Conditions of Nexvra Solutions. Understand the rules, obligations, and guidelines for using our website and services.",
};

const sections = [
    {
        heading: "1. Acceptance of Terms",
        body: `By accessing or using the Nexvra Solutions website and services, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please discontinue use of our website immediately.`,
    },
    {
        heading: "2. Use of the Website",
        body: `You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others. You must not:
• Use the site in any way that violates applicable local, national, or international laws or regulations
• Transmit unsolicited or unauthorised advertising or promotional material
• Attempt to gain unauthorised access to any part of the website or its related systems
• Use automated tools (bots, scrapers) to extract content without our written permission`,
    },
    {
        heading: "3. Enrolment and Course Services",
        body: `When you enrol in a course offered by Nexvra Solutions:
• You agree to provide accurate and complete information during the enrolment process
• Access to course materials is granted for personal, non-commercial use only
• Sharing or redistributing course content without permission is strictly prohibited
• Nexvra Solutions reserves the right to modify, pause, or discontinue any course at any time`,
    },
    {
        heading: "4. Payments and Refunds",
        body: `All fees for courses and services are communicated at the time of enrolment. By completing payment, you agree to the pricing and terms presented. Refund eligibility is assessed on a case-by-case basis. Please contact us within 7 days of enrolment if you wish to raise a concern about a payment.`,
    },
    {
        heading: "5. Intellectual Property",
        body: `All content on this website — including text, graphics, logos, icons, images, audio clips, and course materials — is the property of Nexvra Solutions and is protected by applicable copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.`,
    },
    {
        heading: "6. User-Submitted Content",
        body: `If you submit any content to us (such as project work, feedback, or testimonials), you grant Nexvra Solutions a non-exclusive, royalty-free licence to use, display, and share that content for promotional and educational purposes. You confirm that any content you submit does not infringe any third-party rights.`,
    },
    {
        heading: "7. Disclaimer of Warranties",
        body: `The website and its content are provided on an "as is" basis without warranties of any kind, either express or implied. Nexvra Solutions does not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components.`,
    },
    {
        heading: "8. Limitation of Liability",
        body: `To the fullest extent permitted by law, Nexvra Solutions shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of — or inability to use — our website or services. Our total liability in any matter shall not exceed the amount you paid us for the specific service in question.`,
    },
    {
        heading: "9. Third-Party Links",
        body: `Our website may contain links to third-party websites for your convenience. These links do not constitute an endorsement of those sites. Nexvra Solutions is not responsible for the content, accuracy, or practices of any third-party website.`,
    },
    {
        heading: "10. Privacy",
        body: `Your use of this website is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.`,
    },
    {
        heading: "11. Modifications to Terms",
        body: `Nexvra Solutions reserves the right to update or modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to this page. Continued use of the website after any changes constitutes your acceptance of the revised terms.`,
    },
    {
        heading: "12. Governing Law",
        body: `These Terms and Conditions are governed by the laws of India. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in Tamil Nadu, India.`,
    },
    {
        heading: "13. Contact Us",
        body: `If you have any questions about these Terms and Conditions, please contact us:

Nexvra Solutions
Marthandam, Kanyakumari, Tamil Nadu
Email: contactnexvra@gmail.com
Phone: +91 93857 08357`,
    },
];

export default function TermsAndConditionsPage() {
    return (
        <>
            <h1 className="sr-only">Terms and Conditions – Nexvra Solutions</h1>
            <p className="sr-only">
                Terms and Conditions for using Nexvra Solutions website, enrolling in courses, and
                accessing digital services offered by Nexvra Solutions.
            </p>

            <ContentSection
                title="Terms & Conditions"
                description="Please read these terms carefully before using our website or enrolling in any of our courses and services."
                image="/images/about-bg.jpg"
                showGif={false}
            />

            <section className="px-5 md:px-10 xl:px-[5.5%] py-16 md:py-24 bg-white">
                <div className="max-w-4xl mx-auto flex flex-col gap-10">

                    <p className="font-secondary text-tertiary text-lg leading-relaxed">
                        These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the
                        <strong> Nexvra Solutions</strong> website and services. By using our site or enrolling
                        in a course, you agree to these Terms in full.
                    </p>

                    <p className="font-secondary text-tertiary/70 text-sm -mt-6">
                        Last updated: April 2026
                    </p>

                    {sections.map((section, i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <h2 className="font-primary font-semibold text-xl md:text-2xl text-black">
                                {section.heading}
                            </h2>
                            <p className="font-secondary text-tertiary text-base md:text-lg leading-relaxed whitespace-pre-line">
                                {section.body}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
