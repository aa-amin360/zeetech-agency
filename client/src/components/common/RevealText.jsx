import React from "react";
import { useReveal } from "../../hooks/useReveal.js";

/**
 * Text container with automated scroll-triggered entrance animation
 */
export default function RevealText({
  children,
  as: Component = "div",
  className = "",
  yOffset = 30,
  duration = 0.9,
  delay = 0,
}) {
  const ref = useReveal({ yOffset, duration, delay });

  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
