"use client";
import React from "react";

import { Mail } from "lucide-react";
import Link from "next/link";
import { BsFacebook, BsInstagram, BsPinterest, BsTiktok } from "react-icons/bs";

const Footer: React.FC = () => {
  return (
    <footer className="bg-pearion-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold tracking-wider">
              PEARION<span className="text-pearion-gold">.</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Crafting timeless elegance for the modern woman. Designed for you,
              crafted to shine in every moment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif mb-6 text-pearion-gold">
              Explore
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-pearion-gold transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-pearion-gold transition-colors"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-pearion-gold transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-pearion-gold transition-colors"
                >
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-serif mb-6 text-pearion-gold">
              Customer Care
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-pearion-gold transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping-return">
                  <span className="cursor-pointer hover:text-pearion-gold transition-colors">
                    Shipping & Returns
                  </span>
                </Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-pearion-gold transition-colors">
                  Jewellery Care
                </span>
              </li>
              <li>
                <Link href="/privacy-policy">
                  <span className="cursor-pointer hover:text-pearion-gold transition-colors">
                    Privacy Policy
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-serif mb-6 text-pearion-gold">
              Stay in the Glow
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe for exclusive offers and new launches.
            </p>
            <form
              className="flex flex-col space-y-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 border border-gray-700 text-white px-4 py-2 text-sm focus:outline-none focus:border-pearion-gold"
              />
              <button className="bg-pearion-gold text-pearion-dark px-4 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-white transition-colors duration-300">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs mb-4 md:mb-0">
            &copy; 2023 Pearion Collections. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="https://www.instagram.com/pearioncollections"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsInstagram
                size={20}
                className="text-gray-400 hover:text-pearion-gold cursor-pointer transition-colors"
              />
            </Link>

            <Link
              href="https://www.facebook.com/pearioncollections"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsFacebook
                size={20}
                className="text-gray-400 hover:text-pearion-gold cursor-pointer transition-colors"
              />
            </Link>

            <Link
              href="https://www.pinterest.com/pearioncollections"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsPinterest
                size={20}
                className="text-gray-400 hover:text-pearion-gold cursor-pointer transition-colors"
              />
            </Link>

            <Link
              href="https://www.tiktok.com/@pearioncollections"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsTiktok
                size={20}
                className="text-gray-400 hover:text-pearion-gold cursor-pointer transition-colors"
              />
            </Link>

            <Link href="mailto:pearioncollections@gmail.com">
              <Mail
                size={20}
                className="text-gray-400 hover:text-pearion-gold cursor-pointer transition-colors"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
