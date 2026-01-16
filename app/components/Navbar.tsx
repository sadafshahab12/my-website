"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import SearchOverlay from "./SearchOverlay";
import Image from "next/image";

interface NavLink {
  name: string;
  path: string;
}

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const { cartCount, toggleCart } = useCart();
  const pathname = usePathname();

  // Handle scroll for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const menuToggle = () => {
      setMobileMenuOpen(false);
    };
    menuToggle();
  }, [pathname]);

  const navLinks: NavLink[] = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Our Story", path: "/our-story" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];
  // if (pathname === "/studio/structure" || pathname === "/studio/vision")
  //   return null;
  if (pathname.startsWith("/studio")) return null;
  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-pearion-dark"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/website image/pearion logo.png"
              alt="pearion collections logo"
              width={1000}
              height={1000}
              className="h-10 md:h-14 lg:h-16 w-auto rounded-full object-contain"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm tracking-widest uppercase hover:text-pearion-gold transition-colors duration-300 ${
                  pathname === link.path
                    ? "text-pearion-gold font-semibold"
                    : "text-pearion-dark"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-5">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="text-pearion-dark hover:text-pearion-gold transition-colors"
              aria-label="Open search"
            >
              <Search size={20} />
            </button>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative text-pearion-dark hover:text-pearion-gold transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pearion-gold text-white text-xs w-4.5 h-4.5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed w-full left-0 top-0 h-screen bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col items-center justify-center space-y-8 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="text-2xl font-serif text-pearion-dark hover:text-pearion-gold transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <button
            className="absolute top-6 right-6"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close mobile menu"
          >
            <X size={30} />
          </button>
        </div>
      </nav>

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
