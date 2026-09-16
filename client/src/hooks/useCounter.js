import { useEffect, useRef } from "react";
import { initStatsCounter } from "../animations/counter.js";

/**
 * Hook to trigger count-up animations for statistics upon scrolling into view
 * @param {Array<{ id: string|number, value: number }>} statsList
 */
export const useCounter = (statsList = []) => {
  const containerRef = useRef(null);
  const numberRefs = useRef([]);

  useEffect(() => {
    if (!containerRef.current || statsList.length === 0) return;

    const elementsToAnimate = statsList
      .map((item, index) => ({
        element: numberRefs.current[index],
        targetValue: item.value,
      }))
      .filter((item) => item.element);

    const trigger = initStatsCounter(containerRef.current, elementsToAnimate);

    return () => {
      if (trigger) trigger.kill();
    };
  }, [statsList]);

  return { containerRef, numberRefs };
};
