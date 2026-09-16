import React, { useState, useEffect } from "react";
import Container from "../components/common/Container.jsx";
import SectionLabel from "../components/common/SectionLabel.jsx";
import TestimonialSlider from "../components/testimonials/TestimonialSlider.jsx";
import { testimonialService } from "../services/testimonialService.js";
import { verifiedEndorsements } from "../data/fallbackTestimonials.js";
import { useReveal } from "../hooks/useReveal.js";

/**
 * Verified Client Endorsements Section matching the bottom reference section
 */
export default function ClientEndorsements() {
  const [endorsements, setEndorsements] = useState(verifiedEndorsements);
  const headerRef = useReveal({ yOffset: 30, duration: 0.9 });

  useEffect(() => {
    testimonialService.getEndorsements().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setEndorsements(data);
      }
    });
  }, []);

  return (
    <section className="w-full py-20 sm:py-28 lg:py-36 bg-neutral-100/60 border-t border-brand-dark/5">
      <Container>
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
        >
          <div>
            <SectionLabel accent="diamond">CLIENT FEEDBACK</SectionLabel>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-brand-dark leading-[1.05]">
              VERIFIED CLIENT{" "}
              <span className="font-editorial text-brand-orange text-5xl sm:text-7xl md:text-8xl italic font-normal block sm:inline">
                ENDORSEMENTS.
              </span>
            </h2>
          </div>

          <div className="max-w-xs text-xs font-black tracking-widest text-neutral-500 uppercase leading-relaxed self-start md:self-end">
            WE VALUE EACH AND EVERY CLIENT'S FEEDBACK WHICH MOTIVATES US TO
            DELIVER MORE.
          </div>
        </div>

        {/* Interactive Slider */}
        <TestimonialSlider endorsements={endorsements} />
      </Container>
    </section>
  );
}
