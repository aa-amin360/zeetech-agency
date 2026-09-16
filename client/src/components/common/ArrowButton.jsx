import React from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

/**
 * Circular navigation arrow button for sliders and interactive card controls
 */
export default function ArrowButton({
  direction = "right", // 'left' | 'right' | 'up-right'
  variant = "outline", // 'outline' | 'filled' | 'dark'
  size = "md", // 'sm' | 'md' | 'lg'
  disabled = false,
  onClick,
  className = "",
  ariaLabel = "Navigation button",
}) {
  const sizeClasses =
    {
      sm: "w-9 h-9",
      md: "w-12 h-12",
      lg: "w-14 h-14",
    }[size] || "w-12 h-12";

  const iconSizes =
    {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    }[size] || "w-5 h-5";

  const variantClasses =
    {
      outline:
        "border border-neutral-300 bg-white/80 backdrop-blur-sm text-brand-dark hover:bg-brand-orange hover:border-brand-orange hover:text-white",
      filled:
        "bg-brand-orange text-white hover:bg-brand-orangeHover shadow-md shadow-brand-orange/20",
      dark: "bg-brand-dark text-white hover:bg-neutral-800",
    }[variant] || "";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`group relative rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent ${sizeClasses} ${variantClasses} ${className}`}
    >
      {direction === "left" && (
        <ArrowLeft
          className={`${iconSizes} transition-transform duration-300 group-hover:-translate-x-0.5`}
        />
      )}
      {direction === "right" && (
        <ArrowRight
          className={`${iconSizes} transition-transform duration-300 group-hover:translate-x-0.5`}
        />
      )}
      {direction === "up-right" && (
        <ArrowUpRight
          className={`${iconSizes} transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
        />
      )}
    </button>
  );
}
