import React from "react";

/**
 * Standard responsive content container with consistent agency padding and max-widths
 */
export default function Container({
  children,
  className = "",
  size = "default", // 'default' | 'wide' | 'narrow'
  ...props
}) {
  const maxWidths =
    {
      narrow: "max-w-4xl",
      default: "max-w-7xl",
      wide: "max-w-[1440px]",
    }[size] || "max-w-7xl";

  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 ${maxWidths} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
