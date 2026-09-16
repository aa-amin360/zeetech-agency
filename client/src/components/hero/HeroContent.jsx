import React from "react";
import Button from "../common/Button.jsx";
import SectionLabel from "../common/SectionLabel.jsx";

/**
 * Left-side hero editorial typography and action triggers
 */
export default function HeroContent() {
  const scrollToWork = () => {
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToCTA = () => {
    document
      .getElementById("cta-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-start justify-center max-w-2xl py-8 sm:py-12 lg:py-16">
      {/* Label */}
      <SectionLabel accent="diamond" className="mb-4">
        PREMIUM DIGITAL PRODUCT STUDIO
      </SectionLabel>

      {/* Main Editorial Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-dark leading-[1.08] mb-6">
        We design & build <span className="block">digital products</span>
        <span className="inline-block relative mt-1">
          <span className="relative z-10 font-editorial text-brand-orange text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal italic tracking-tight">
            want to use.
          </span>
          {/* Subtle warm orange highlight pill */}
          <span className="absolute -inset-x-2.5 bottom-1.5 top-2 bg-orange-100/70 -rotate-1 rounded-lg -z-0" />
        </span>
      </h1>

      {/* Short Agency Description */}
      <p className="text-base sm:text-lg md:text-xl text-neutral-600 font-normal leading-relaxed max-w-xl mb-8 sm:mb-10">
        Strategy, product architecture, and full-stack development. We engineer
        scalable web applications, mobile platforms, and design systems for
        category leaders.
      </p>

      {/* Action CTA Buttons */}
      <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
        <Button variant="primary" size="lg" withArrow onClick={scrollToCTA}>
          Book Discovery Call
        </Button>

        <Button variant="secondary" size="lg" onClick={scrollToWork}>
          Explore Our Work ↓
        </Button>
      </div>

      {/* Micro social proof under buttons */}
      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-brand-dark/10 w-full sm:w-auto">
        <div className="flex -space-x-2">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Client"
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
            alt="Client"
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
            alt="Client"
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
          />
        </div>
        <p className="text-xs font-bold text-neutral-600">
          <span className="text-brand-orange">★ 5.0</span> Rating across 40+
          client engagements
        </p>
      </div>
    </div>
  );
}
