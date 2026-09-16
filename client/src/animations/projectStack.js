import { gsap, ScrollTrigger } from "./gsapConfig.js";
import { prefersReducedMotion } from "../utils/reducedMotion.js";

/**
 * Initializes the physical deck-of-cards overlapping scroll animation
 * @param {HTMLElement} sectionRef - Outer pinned section container
 * @param {HTMLElement[]} cardRefs - Array of project card elements
 * @returns {gsap.Context | null}
 */
export const initProjectCardStacking = (sectionRef, cardRefs = []) => {
  if (!sectionRef || cardRefs.length === 0) return null;

  if (prefersReducedMotion()) {
    return null;
  }

  const ctx = gsap.context(() => {
    // Loop through cards starting from index 1 (since Card 0 starts as base)
    cardRefs.forEach((card, index) => {
      if (index === 0 || !card) return;

      const prevCard = cardRefs[index - 1];

      // ScrollTrigger timeline for overlapping cards
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "top 20%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // 1. Current card slides up over previous card
      tl.fromTo(
        card,
        {
          y: 80,
          opacity: 0.9,
          boxShadow: "0 0 0 rgba(0,0,0,0)",
        },
        {
          y: 0,
          opacity: 1,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          ease: "power2.out",
        },
      );

      // 2. Previous card subtly recedes into the background stack
      if (prevCard) {
        tl.to(
          prevCard,
          {
            scale: 0.94 - index * 0.015,
            y: -15 * index,
            filter: "brightness(0.92)",
            ease: "power2.out",
          },
          0, // sync with the incoming card
        );
      }
    });
  }, sectionRef);

  return ctx;
};
