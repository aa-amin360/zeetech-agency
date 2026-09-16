import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS } from "../../utils/constants.js";
import Button from "../common/Button.jsx";
import MobileMenu from "./MobileMenu.jsx";

/**
 * Premium editorial navigation bar with blur effect and mobile menu
 */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-cream/90 backdrop-blur-md py-4 border-b border-brand-dark/5 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between">
          {/* Logo / Wordmark */}
          <a
            href="#"
            className="group flex items-center gap-2 text-xl font-extrabold tracking-tight text-brand-dark"
          >
            <span className="w-7 h-7 rounded-lg bg-brand-orange text-white flex items-center justify-center text-sm font-black transform group-hover:rotate-6 transition-transform">
              Z
            </span>
            <span className="tracking-tighter">
              ZEE<span className="text-brand-orange font-light mx-0.5">//</span>
              TECH
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-neutral-600">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative py-1 transition-colors hover:text-brand-dark group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-orange transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              withArrow
              className="hidden sm:inline-flex"
              onClick={() => {
                document
                  .getElementById("cta-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Start A Project
            </Button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full border border-neutral-300/80 text-brand-dark hover:bg-neutral-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={NAV_LINKS}
      />
    </>
  );
}
