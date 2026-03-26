"use client";

import { useState } from "react";
import Image from "next/image";
import Hamburger from "../common/hamburger";
import { StaggeredMenu } from "../ui/StaggeredMenu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about-us' },
    { label: 'Solution', ariaLabel: 'View our solution', link: '/solutions' },
    { label: 'Courses', ariaLabel: 'View our services', link: '/courses' },
    { label: 'Projects', ariaLabel: 'View our services', link: '/projects' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
  ];

  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' }
  ];

  return (
    // <nav className="flex items-center justify-between h-20 px-[5.5%] bg-transparent z-50 relative">

    //   {/* Logo */}
    //   <Image
    //     src="/logo.png"
    //     alt="nexvra-logo"
    //     width={200}
    //     height={50}
    //     className="object-contain"
    //     priority
    //   />

    //   {/* Menu Button */}
    //   {/* <button
    //     onClick={handleOpen}
    //     className="border border-secondary p-2 px-4 flex items-center gap-3 text-secondary"
    //   >
    //     <p className="font-medium text-[18px]">Menu</p>

    //     <Hamburger open={isMenuOpen} />
    //   </button> */}
    //   <StaggeredMenu
    //     position="right"
    //     items={menuItems}
    //     socialItems={socialItems}
    //     displaySocials
    //     displayItemNumbering={true}
    //     menuButtonColor="#ffffff"
    //     openMenuButtonColor="#fff"
    //     changeMenuColorOnOpen={true}
    //     colors={['#0a0a0a', '#A4FF00']}
    //     accentColor="#A4FF00"
    //     isFixed={true}
    //     isHideLogo = {true} 
    //     className="hide-menu-logo" 
    //     onMenuOpen={() => console.log("Menu opened")}
    //     onMenuClose={() => console.log("Menu closed")}
    //   />

    // </nav>
    <nav className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-[5.5%] bg-transparent z-50 relative">

      {/* Logo */}
      <Image
        src="/logo.png"
        alt="nexvra-logo"
        width={160}
        height={40}
        className="object-contain sm:w-[180px] lg:w-[200px]"
        priority
      />

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