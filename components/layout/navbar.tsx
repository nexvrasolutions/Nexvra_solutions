"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const StaggeredMenu = dynamic(
  () => import("../ui/StaggeredMenu"),
  { ssr: false }
);
export default function Navbar() {
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about-us' },
    { label: 'Solution', ariaLabel: 'View our solution', link: '/solutions' },
    { label: 'Courses', ariaLabel: 'Browse our courses', link: '/courses' },
    { label: 'Projects', ariaLabel: 'See our projects', link: '/projects' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
  ];

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/nexvra.solutions' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/company/nexvra-solutions/' },
    { label: 'WhatsApp', link: 'https://wa.me/message/ZWX4OKLWARYXC1' }
  ];

  return (
    <nav className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-[5.5%] bg-transparent z-50 relative">

      {/* Logo */}
      <Link href="/" aria-label="Nexvra Solutions home">
        <Image
          src="/logo.png"
          alt="nexvra-logo"
          width={160}
          height={40}
          className="object-contain sm:w-[180px] lg:w-[200px]"
          priority
        />
      </Link>

      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering={true}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen={true}
        colors={['#0a0a0a', '#A4FF00']}
        accentColor="#A4FF00"
        isFixed={true}
        isHideLogo={true}
        className="hide-menu-logo"
      />
    </nav>
  );
}