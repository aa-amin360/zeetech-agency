import { gsap } from "./gsapConfig.js";
import { prefersReducedMotion } from "../utils/reducedMotion.js";

/**
 * Initializes the dual-direction infinite seamless logo marquees
 * @param {HTMLElement} row1Ref - Track moving Right -> Left
 * @param {HTMLElement} row2Ref - Track moving Left -> Right
 * @param {Object} options - Custom speed & hover settings
 * @returns {() => void} Cleanup function
 */
export const initDualMarquee = (row1Ref, row2Ref, options = {}) => {
  if (prefersReducedMotion()) return () => {};

  const { speed = 35 } = options;
  const tweens = [];

  // ROW 1: Infinite Scroll Right -> Left
  if (row1Ref) {
    const tween1 = gsap.to(row1Ref, {
      xPercent: -50,
      ease: "none",
      duration: speed,
      repeat: -1,
    });
    tweens.push(tween1);

    // Pause / Slow down on hover
    row1Ref.addEventListener("mouseenter", () =>
      gsap.to(tween1, { timeScale: 0.2, duration: 0.4 }),
    );
    row1Ref.addEventListener("mouseleave", () =>
      gsap.to(tween1, { timeScale: 1, duration: 0.4 }),
    );
  }

  // ROW 2: Infinite Scroll Left -> Right
  if (row2Ref) {
    // Start at -50% and move to 0% for reverse direction
    gsap.set(row2Ref, { xPercent: -50 });
    const tween2 = gsap.to(row2Ref, {
      xPercent: 0,
      ease: "none",
      duration: speed * 1.1, // Slight variation for organic visual rhythm
      repeat: -1,
    });
    tweens.push(tween2);

    row2Ref.addEventListener("mouseenter", () =>
      gsap.to(tween2, { timeScale: 0.2, duration: 0.4 }),
    );
    row2Ref.addEventListener("mouseleave", () =>
      gsap.to(tween2, { timeScale: 1, duration: 0.4 }),
    );
  }

  return () => {
    tweens.forEach((t) => t.kill());
  };
};
