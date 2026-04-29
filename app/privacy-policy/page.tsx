import type { Metadata } from "next";
import ContentSection from "@/components/common/content-section";

export const metadata: Metadata = {
    title: "Privacy Policy | Nexvra Solutions",
    description:
        "Read Nexvra Solutions' Privacy Policy to understand how we collect, use, and protect your personal information.",
};

const sections = [
    {
        heading: "1. Information We Collect",
        body: `When you use our website, enroll in a course, or contact us, we may collect the following information:
• Full name and contact details (email address, phone number)
• Academic or professional background (when provided)
• Messages or inquiries submitted through our forms
• Device and browser information collected automatically via cookies and analytics tools`,
    },
    {
        heading: "2. How We Use Your Information",
        body: `We use the information we collect to:
• Process course enrollments and respond to inquiries
• Send you updates about your enrollment, schedules, or new courses
• Improve our website, services, and user experience
• Comply with legal obligations

We do not sell, rent, or trade your personal information to third parties.`,
    },
    {
        heading: "3. Cookies & Tracking",
        body: `Our website uses cookies and similar technologies to enhance your browsing experience, remember preferences, and gather analytics. You can control cookie settings through your browser. Disabling cookies may affect some functionality of the site.`,
    },
    {
        heading: "4. Data Security",
        body: `We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or misuse. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
    },
    {
        heading: "5. Third-Party Services",
        body: `We may use trusted third-party services (such as email delivery providers and analytics platforms) that process data on our behalf. These providers are bound by their own privacy policies and are not permitted to use your data for their own purposes.`,
    },
    {
        heading: "6. Data Retention",
        body: `We retain your personal information only for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. When data is no longer needed, it is securely deleted.`,
    },
    {
        heading: "7. Your Rights",
        body: `You have the right to:
• Access the personal data we hold about you
• Request correction of inaccurate data
• Request deletion of your data (subject to legal obligations)
• Withdraw consent for marketing communications at any time

To exercise any of these rights, contact us at contactnexvra@gmail.com.`,
    },
    {
        heading: "8. Children's Privacy",
        body: `Our services are not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.`,
    },
    {
        heading: "9. Changes to This Policy",
        body: `We may update this Privacy Policy from time to time. The updated version will be posted on this page with the revised date. We encourage you to review this page periodically.`,
    },
    {
        heading: "10. Contact Us",
        body: `If you have any questions or concerns about this Privacy Policy, please reach out to us:

Nexvra Solutions
Marthandam, Kanyakumari, Tamil Nadu
Email: contactnexvra@gmail.com
Phone: +91 93857 08357`,
    },
];

export default function PrivacyPolicyPage() {
    return (
        <>
            <h1 className="sr-only">Privacy Policy – Nexvra Solutions</h1>
            <p className="sr-only">
                Nexvra Solutions privacy policy explains how we collect, use, and safeguard personal
                information submitted through our website and enrollment forms.
            </p>

            <ContentSection
                title="Privacy Policy"
                description="Your privacy matters to us. Learn how Nexvra Solutions collects, uses, and protects your personal information."
                image="/images/about-bg.jpg"
                showGif={false}
            />

            <section className="px-5 md:px-10 xl:px-[5.5%] py-16 md:py-24 bg-white">
                <div className="max-w-4xl mx-auto flex flex-col gap-10">

                    <p className="font-secondary text-tertiary text-lg leading-relaxed">
                        This Privacy Policy describes how <strong>Nexvra Solutions</strong> (&quot;we&quot;, &quot;us&quot;,
                        or &quot;our&quot;) handles personal information collected through our website and services.
                        By using our website or enrolling in our courses, you agree to the practices described below.
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
