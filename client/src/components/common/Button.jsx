import React from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * Reusable animated CTA button matching the agency's art direction
 */
export default function Button({
  children,
  variant = "primary", // 'primary' | 'secondary' | 'dark' | 'outline'
  size = "md", // 'sm' | 'md' | 'lg'
  withArrow = false,
  className = "",
  onClick,
  ...props
}) {
  const baseStyles =
    "group relative inline-flex items-center justify-center font-bold tracking-tight rounded-full transition-all duration-300 transform active:scale-95 overflow-hidden";

  const sizeStyles =
    {
      sm: "text-xs px-4 py-2 gap-1.5",
      md: "text-sm px-6 py-3.5 gap-2",
      lg: "text-base px-8 py-4 gap-2.5",
    }[size] || "text-sm px-6 py-3.5 gap-2";

  const variantStyles =
    {
      primary:
        "bg-brand-orange text-white shadow-lg shadow-brand-orange/25 hover:bg-brand-orangeHover hover:shadow-brand-orange/40 hover:-translate-y-0.5",
      secondary:
        "bg-white text-brand-dark border border-neutral-200/80 hover:border-brand-dark/40 hover:bg-neutral-50 shadow-sm hover:-translate-y-0.5",
      dark: "bg-brand-dark text-white hover:bg-neutral-800 shadow-md hover:-translate-y-0.5",
      outline:
        "bg-transparent text-brand-dark border border-brand-dark/20 hover:border-brand-dark hover:bg-brand-dark hover:text-white",
    }[variant] || "";

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10 transition-transform duration-300">
        {children}
      </span>

      {withArrow && (
        <span className="relative z-10 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      )}
    </button>
  );
}
