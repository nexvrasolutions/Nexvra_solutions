
import ContactClient from '@/components/common/contact-client';
import ContentSection from '@/components/common/content-section'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Contact Nexvra Solutions",
    description:
      "Get in touch with Nexvra Solutions for web development, mobile apps, and IT services. Contact us via phone, email, or visit our location.",
  };
  

const page = () => {
    return (
        <>
            {/* SEO content */}
            <h1 className="sr-only">Contact Nexvra Solutions</h1>
            <p className="sr-only">
                Contact Nexvra Solutions located in Kanyakumari, Tamil Nadu. Reach us via phone,
                email, or visit our office for web development, mobile app development, and IT services.
            </p>

            <ContentSection
                title="Contact"
                description="Have an idea, project, or question? Let’s connect and build something meaningful together."
                image="/images/about-bg.jpg"
                showGif={false}
            />
            <ContactClient />
        </>
    )
}

export default page;
