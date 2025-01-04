"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    return pathname === path
      ? "text-blue-600 font-stapelBold"
      : "text-black hover:text-gray-500";
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-[#E4FDFF] font-stapel my-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">
        {/* Logo */}
        <div>
          <span className="font-stapelBold text-xl text-black">
            <Link href="/">Dekstix</Link>
          </span>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-black hover:text-gray-500 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Navbar Links for Desktop */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className={getLinkClass("/")}>
            Home
          </Link>
          <Link href="/Ticket/Ticket" className={getLinkClass("/Ticket/Ticket")}>
            Ticket
          </Link>
          <Link
            href="/Validation/Validation"
            className={getLinkClass("/Validation/Validation")}
          >
            Validation
          </Link>
          <Link href="/Profile/Profile" className={getLinkClass("/Profile/Profile")}>
            Profile
          </Link>
        </nav>

        {/* Connect Button */}
        <div className="hidden md:flex">
          <ConnectButton />
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="bg-white shadow-lg md:hidden">
          <nav className="space-y-4 px-4 py-6">
            <Link
              href="/"
              className={`block ${getLinkClass("/")}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/Ticket/Ticket"
              className={`block ${getLinkClass("/Ticket/Ticket")}`}
              onClick={() => setIsOpen(false)}
            >
              Ticket
            </Link>
            <Link
              href="/Validation/Validation"
              className={`block ${getLinkClass("/Validation/Validation")}`}
              onClick={() => setIsOpen(false)}
            >
              Validation
            </Link>
            <Link
              href="/Profile/Profile"
              className={`block ${getLinkClass("/Profile/Profile")}`}
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <div className="mt-4">
              <ConnectButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
