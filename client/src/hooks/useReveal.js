import { useEffect, useRef } from "react";
import { initScrollReveal } from "../animations/reveal.js";

/**
 * Hook to trigger smooth entrance reveals on scroll for headings, sections, and containers
 * @param {Object} options - Custom animation configurations
 */
export const useReveal = (options = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const ctx = initScrollReveal(elementRef.current, options);

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return elementRef;
};
