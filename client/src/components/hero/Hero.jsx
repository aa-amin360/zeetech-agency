import React from "react";
import Container from "../common/Container.jsx";
import HeroContent from "./HeroContent.jsx";
import HeroProjectRoll from "./HeroProjectRoll.jsx";

/**
 * Main Hero Section combining editorial typography with the diagonal rolling project wall
 */
export default function Hero() {
  return (
    <section className="relative w-full pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20 overflow-hidden bg-cream">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[620px]">
          {/* Left Column: Editorial Headline & CTAs (Cols 1-6) */}
          <div className="lg:col-span-6 z-10">
            <HeroContent />
          </div>

          {/* Right Column: 3D Diagonal Rolling Wall of Projects (Cols 7-12) */}
          <div className="lg:col-span-6 relative w-full flex items-center justify-center">
            <HeroProjectRoll />
          </div>
        </div>
      </Container>
    </section>
  );
}
