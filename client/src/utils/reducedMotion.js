/**
 * Accessibility utility to check if the user prefers reduced motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Listens for system changes to the prefers-reduced-motion media query
 * @param {(prefersReduced: boolean) => void} callback
 * @returns {() => void} Cleanup function to remove listener
 */
export const onReducedMotionChange = (callback) => {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const listener = (event) => callback(event.matches);

  mediaQuery.addEventListener("change", listener);
  return () => mediaQuery.removeEventListener("change", listener);
};
