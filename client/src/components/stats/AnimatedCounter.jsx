import React, { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "../../animations/gsapConfig.js";
import { prefersReducedMotion } from "../../utils/reducedMotion.js";

/**
 * Reusable animated counter element
 */
export default function AnimatedCounter({
  targetValue = 100,
  prefix = "",
  suffix = "+",
  duration = 2,
  className = "",
}) {
  const numberRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !numberRef.current) return;

    if (prefersReducedMotion()) {
      numberRef.current.textContent = targetValue;
      return;
    }

    const counterObj = { val: 0 };

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(counterObj, {
          val: targetValue,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            if (numberRef.current) {
              numberRef.current.textContent = Math.floor(counterObj.val);
            }
          },
          onComplete: () => {
            if (numberRef.current) {
              numberRef.current.textContent = targetValue;
            }
          },
        });
      },
    });

    return () => {
      if (trigger) trigger.kill();
    };
  }, [targetValue, duration]);

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-baseline ${className}`}
    >
      {prefix && <span className="mr-0.5">{prefix}</span>}
      <span ref={numberRef} className="tabular-nums">
        0
      </span>
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </div>
  );
}
