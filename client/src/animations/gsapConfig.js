import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins safely in browser environment
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Global default animation configurations
gsap.defaults({
  ease: "power3.out",
  duration: 0.8,
});

export { gsap, ScrollTrigger };
