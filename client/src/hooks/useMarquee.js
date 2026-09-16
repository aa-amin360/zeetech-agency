import { useEffect, useRef } from "react";
import { initDualMarquee } from "../animations/marquee.js";

/**
 * Hook to manage the two-direction infinite logo marquees
 * @param {Object} options - Custom speed and behavior settings
 */
export const useMarquee = (options = { speed: 35 }) => {
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  useEffect(() => {
    const cleanup = initDualMarquee(row1Ref.current, row2Ref.current, options);

    return () => {
      if (cleanup) cleanup();
    };
  }, [options.speed]);

  return { row1Ref, row2Ref };
};
