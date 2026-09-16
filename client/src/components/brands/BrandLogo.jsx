import React from "react";

/**
 * Clean SVG Brand Logo item with subtle grayscale hover transitions
 */
export default function BrandLogo({ brand }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/60 border border-neutral-200/60 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-md cursor-pointer select-none group">
      {/* Brand Logo Symbol */}
      <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-xs font-black text-neutral-700 group-hover:bg-brand-orange group-hover:text-white transition-colors">
        {brand.name.charAt(0)}
      </div>

      {/* Brand Name */}
      <span className="text-sm sm:text-base font-extrabold tracking-tight text-neutral-800 uppercase">
        {brand.name}
      </span>
    </div>
  );
}
