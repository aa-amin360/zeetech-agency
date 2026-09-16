import { gsap } from "./gsapConfig.js";
import { prefersReducedMotion } from "../utils/reducedMotion.js";

/**
 * Creates the continuous, infinite diagonal rolling wall of project mockups in the Hero section.
 * @param {HTMLElement} containerRef - Outer container holding the columns
 * @param {HTMLElement[]} columnRefs - Array of column DOM elements
 * @param {HTMLElement[]} cardRefs - Array of individual mockup cards for depth
 * @returns {gsap.core.Timeline | gsap.core.Tween | null}
 */
export const initHeroRollingCollage = (
  containerRef,
  columnRefs = [],
  cardRefs = [],
) => {
  if (!containerRef || prefersReducedMotion()) return null;

  const ctx = gsap.context(() => {
    // 1. Initial entrance reveal for the whole collage
    gsap.fromTo(
      containerRef,
      {
        opacity: 0,
        scale: 0.92,
        rotateZ: -6,
        rotateX: 10,
        y: 40,
      },
      {
        opacity: 1,
        scale: 1,
        rotateZ: -8, // Elegant diagonal tilt matching the reference
        rotateX: 8,
        y: 0,
        duration: 1.4,
        ease: "power3.out",
        delay: 0.2,
      },
    );

    // 2. Continuous infinite rolling motion across columns
    columnRefs.forEach((col, index) => {
      if (!col) return;

      const isEven = index % 2 === 0;
      const speed = isEven ? 45 : 38; // Asynchronous natural motion
      const direction = isEven ? -50 : 50;

      // Duplicate inner children for seamless loop
      gsap.to(col, {
        yPercent: direction,
        ease: "none",
        duration: speed,
        repeat: -1,
      });
    });

    // 3. Subtle floating parallax response to mouse cursor
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const xPercent = (e.clientX / innerWidth - 0.5) * 15;
      const yPercent = (e.clientY / innerHeight - 0.5) * 15;

      gsap.to(containerRef, {
        x: xPercent,
        y: yPercent,
        duration: 1.2,
        ease: "power1.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, containerRef);

  return ctx;
};
