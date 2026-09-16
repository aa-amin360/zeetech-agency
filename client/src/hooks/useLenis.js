import { useEffect } from "react";
import { initSmoothScroll } from "../animations/smoothScroll.js";

/**
 * Custom hook to mount Lenis smooth scrolling globally
 */
export const useLenis = () => {
  useEffect(() => {
    const { destroy } = initSmoothScroll();

    return () => {
      if (destroy) destroy();
    };
  }, []);
};
