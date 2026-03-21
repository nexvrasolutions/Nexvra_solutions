"use client";

import { useState } from "react";
import Image from "next/image";
import Hamburger from "../common/hamburger";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex items-center justify-between h-20 px-[5.5%] bg-transparent z-50 relative">

      {/* Logo */}
      <Image
        src="/logo.png"
        alt="nexvra-logo"
        width={200}
        height={50}
        className="object-contain"
        priority
      />

      {/* Menu Button */}
      <button
        onClick={handleOpen}
        className="border border-secondary p-2 px-4 flex items-center gap-3 text-secondary"
      >
        <p className="font-medium text-[18px]">Menu</p>

        <Hamburger open={isMenuOpen} />
      </button>

    </nav>
  );
}