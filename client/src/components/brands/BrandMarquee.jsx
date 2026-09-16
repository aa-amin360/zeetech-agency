import React from "react";
import { useMarquee } from "../../hooks/useMarquee.js";
import BrandLogo from "./BrandLogo.jsx";

/**
 * Two-way infinite seamless marquee system
 */
export default function BrandMarquee({ row1 = [], row2 = [] }) {
  const { row1Ref, row2Ref } = useMarquee({ speed: 28 });

  // Triple arrays to ensure continuous uninterrupted loop across ultra-wide monitors
  const infiniteRow1 = [...row1, ...row1, ...row1, ...row1];
  const infiniteRow2 = [...row2, ...row2, ...row2, ...row2];

  return (
    <div className="w-full flex flex-col gap-5 overflow-hidden py-4 select-none">
      {/* ROW 1: Right to Left */}
      <div className="relative w-full overflow-hidden flex items-center">
        <div
          ref={row1Ref}
          className="flex items-center gap-6 whitespace-nowrap will-change-transform"
        >
          {infiniteRow1.map((brand, idx) => (
            <BrandLogo key={`row1-${brand.id || idx}-${idx}`} brand={brand} />
          ))}
        </div>
      </div>

      {/* ROW 2: Left to Right */}
      <div className="relative w-full overflow-hidden flex items-center">
        <div
          ref={row2Ref}
          className="flex items-center gap-6 whitespace-nowrap will-change-transform"
        >
          {infiniteRow2.map((brand, idx) => (
            <BrandLogo key={`row2-${brand.id || idx}-${idx}`} brand={brand} />
          ))}
        </div>
      </div>
    </div>
  );
}
