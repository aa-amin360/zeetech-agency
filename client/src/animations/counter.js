import { gsap, ScrollTrigger } from "./gsapConfig.js";
import { prefersReducedMotion } from "../utils/reducedMotion.js";

/**
 * Animates numerical metrics from 0 to their target value upon entering viewport
 * @param {HTMLElement} containerRef - Outer container of the stats strip
 * @param {Array<{ element: HTMLElement, targetValue: number }>} statElements
 * @returns {ScrollTrigger | null}
 */
export const initStatsCounter = (containerRef, statElements = []) => {
  if (!containerRef || statElements.length === 0) return null;

  if (prefersReducedMotion()) {
    statElements.forEach(({ element, targetValue }) => {
      if (element) element.textContent = targetValue;
    });
    return null;
  }

  const trigger = ScrollTrigger.create({
    trigger: containerRef,
    start: "top 85%",
    once: true,
    onEnter: () => {
      statElements.forEach(({ element, targetValue }) => {
        if (!element) return;

        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: targetValue,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            element.textContent = Math.floor(counterObj.val);
          },
          onComplete: () => {
            element.textContent = targetValue;
          },
        });
      });
    },
  });

  return trigger;
};
