import React, { useEffect } from "react";
import { X } from "lucide-react";
import Button from "../common/Button.jsx";

/**
 * Animated mobile navigation menu overlay
 */
export default function MobileMenu({ isOpen, onClose, navLinks = [] }) {
  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-cream/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-10 md:hidden animate-fadeIn">
      {/* Top Bar with Brand & Close Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-brand-dark">
          <span className="w-7 h-7 rounded-lg bg-brand-orange text-white flex items-center justify-center text-sm font-black">
            Z
          </span>
          <span className="tracking-tighter">
            ZEE<span className="text-brand-orange font-light mx-0.5">//</span>
            TECH
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full border border-neutral-300 bg-white text-brand-dark"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-6 my-auto">
        {navLinks.map((link, index) => (
          <a
            key={link.label}
            href={link.href}
            onClick={onClose}
            className="text-4xl font-extrabold tracking-tight text-brand-dark hover:text-brand-orange transition-colors"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Footer CTA in Mobile Drawer */}
      <div className="flex flex-col gap-4">
        <Button
          variant="primary"
          size="lg"
          withArrow
          className="w-full"
          onClick={() => {
            onClose();
            document
              .getElementById("cta-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Start A Project
        </Button>
        <p className="text-center text-xs text-neutral-500 font-medium">
          hello@zeetech.agency • San Francisco, CA
        </p>
      </div>
    </div>
  );
}
