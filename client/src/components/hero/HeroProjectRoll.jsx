import React from "react";
import { HERO_SCREENS } from "../../utils/constants.js";
import { useHeroRoll } from "../../hooks/useHeroRoll.js";
import HeroProjectItem from "./HeroProjectItem.jsx";

/**
 * Large diagonal infinite rolling collage of digital product UI mockups
 */
export default function HeroProjectRoll() {
  const { containerRef, col1Ref, col2Ref, col3Ref } = useHeroRoll();

  // Create infinite loops by duplicating screen sets for each column
  const col1Screens = [...HERO_SCREENS, ...HERO_SCREENS];
  const col2Screens = [
    ...HERO_SCREENS.slice(2),
    ...HERO_SCREENS,
    ...HERO_SCREENS.slice(0, 2),
  ];
  const col3Screens = [
    ...HERO_SCREENS.slice(4),
    ...HERO_SCREENS,
    ...HERO_SCREENS.slice(0, 4),
  ];

  return (
    <div className="relative w-full h-[480px] sm:h-[580px] lg:h-[720px] overflow-hidden select-none pointer-events-none sm:pointer-events-auto">
      {/* Top & Bottom gradient fades for seamless edge blending */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cream via-cream/70 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-cream via-cream/80 to-transparent z-20 pointer-events-none" />

      {/* 3D Rotated / Diagonal Canvas */}
      <div
        ref={containerRef}
        className="relative w-[130%] -left-[15%] -top-[20%] h-[150%] grid grid-cols-3 gap-4 sm:gap-6 will-change-transform"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Column 1: Moves upward */}
        <div
          ref={col1Ref}
          className="flex flex-col gap-4 sm:gap-6 will-change-transform"
        >
          {col1Screens.map((screen, idx) => (
            <HeroProjectItem key={`col1-${screen.id}-${idx}`} screen={screen} />
          ))}
        </div>

        {/* Column 2: Moves downward (staggered speed) */}
        <div
          ref={col2Ref}
          className="flex flex-col gap-4 sm:gap-6 pt-12 will-change-transform"
        >
          {col2Screens.map((screen, idx) => (
            <HeroProjectItem key={`col2-${screen.id}-${idx}`} screen={screen} />
          ))}
        </div>

        {/* Column 3: Moves upward */}
        <div
          ref={col3Ref}
          className="hidden sm:flex flex-col gap-4 sm:gap-6 will-change-transform"
        >
          {col3Screens.map((screen, idx) => (
            <HeroProjectItem key={`col3-${screen.id}-${idx}`} screen={screen} />
          ))}
        </div>
      </div>
    </div>
  );
}
