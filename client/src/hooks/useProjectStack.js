import { useEffect, useRef } from "react";
import { initProjectCardStacking } from "../animations/projectStack.js";

/**
 * Hook to manage the physical overlapping stack animation of project cards on scroll
 * @param {Array} projectsList
 */
export const useProjectStack = (projectsList = []) => {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    if (!containerRef.current || projectsList.length === 0) return;

    const cards = cardRefs.current.filter(Boolean);
    const ctx = initProjectCardStacking(containerRef.current, cards);

    return () => {
      if (ctx) ctx.revert();
    };
  }, [projectsList]);

  return { containerRef, cardRefs };
};
