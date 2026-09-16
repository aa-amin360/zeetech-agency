import { gsap, ScrollTrigger } from "./gsapConfig.js";
import { prefersReducedMotion } from "../utils/reducedMotion.js";

/**
 * Editorial text & section reveal animations on scroll
 * @param {HTMLElement} element - Target DOM element or container
 * @param {Object} [options] - Custom animation overrides
 * @returns {gsap.Context | null}
 */
export const initScrollReveal = (element, options = {}) => {
  if (!element) return null;

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0 });
    return null;
  }

  const {
    yOffset = 40,
    duration = 1,
    delay = 0,
    start = "top 85%",
    stagger = 0.12,
  } = options;

  const ctx = gsap.context(() => {
    const targets =
      element.children.length > 0 && options.staggerChildren
        ? element.children
        : element;

    gsap.fromTo(
      targets,
      {
        opacity: 0,
        y: yOffset,
      },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger: options.staggerChildren ? stagger : 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start,
          toggleActions: "play none none reverse",
        },
      },
    );
  }, element);

  return ctx;
};
