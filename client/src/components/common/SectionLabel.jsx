import React from "react";

/**
 * Tiny uppercase section label with orange diamond/dot accent
 */
export default function SectionLabel({
  children,
  accent = "diamond", // 'diamond' | 'dot' | 'none'
  className = "",
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 text-[11px] md:text-xs font-extrabold tracking-widest text-brand-dark/70 uppercase mb-3 select-none ${className}`}
    >
      {accent === "diamond" && (
        <span className="text-brand-orange text-xs">✦</span>
      )}
      {accent === "dot" && (
        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span>
      )}
      <span>{children}</span>
    </div>
  );
}
