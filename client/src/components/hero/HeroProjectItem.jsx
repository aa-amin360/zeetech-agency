import React from "react";

/**
 * Individual high-fidelity product mockup card for the diagonal rolling wall
 */
export default function HeroProjectItem({ screen, className = "" }) {
  return (
    <div
      className={`group relative rounded-2xl overflow-hidden bg-white shadow-xl shadow-black/10 border border-neutral-200/80 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${className}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <img
          src={screen.img}
          alt={screen.title}
          loading="eager"
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Subtle glass gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Tiny card footer tag */}
      <div className="p-3 bg-white flex items-center justify-between border-t border-neutral-100">
        <div>
          <span className="block text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
            {screen.category}
          </span>
          <p className="text-xs font-bold text-brand-dark tracking-tight truncate">
            {screen.title}
          </p>
        </div>
        <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
      </div>
    </div>
  );
}
