import Lenis from "@studio-freight/lenis";
import { gsap, ScrollTrigger } from "./gsapConfig.js";
import { prefersReducedMotion } from "../utils/reducedMotion.js";

/**
 * Initializes buttery-smooth scrolling via Lenis synchronized with GSAP ScrollTrigger
 * @returns {{ lenis: Lenis | null, destroy: () => void }}
 */
export const initSmoothScroll = () => {
  if (typeof window === "undefined" || prefersReducedMotion()) {
    return { lenis: null, destroy: () => {} };
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Sync Lenis scroll positions with GSAP ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

  // Bind GSAP ticker to Lenis requestAnimationFrame
  const updateTicker = (time) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(updateTicker);
  gsap.ticker.lagSmoothing(0);

  const destroy = () => {
    gsap.ticker.remove(updateTicker);
    lenis.destroy();
  };

  return { lenis, destroy };
};
