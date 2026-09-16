import { useEffect, useRef } from "react";
import { initHeroRollingCollage } from "../animations/heroRoll.js";

/**
 * Hook to manage the continuous diagonal rolling wall of hero screens
 */
export const useHeroRoll = () => {
  const containerRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const columns = [col1Ref.current, col2Ref.current, col3Ref.current].filter(
      Boolean,
    );
    const ctx = initHeroRollingCollage(containerRef.current, columns);

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return { containerRef, col1Ref, col2Ref, col3Ref };
};
