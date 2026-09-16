import React from "react";
import Container from "../components/common/Container.jsx";
import Button from "../components/common/Button.jsx";
import SectionLabel from "../components/common/SectionLabel.jsx";
import { useReveal } from "../hooks/useReveal.js";

/**
 * High-Impact Agency CTA Section
 */
export default function CTASection() {
  const containerRef = useReveal({ yOffset: 40, duration: 1 });

  return (
    <section
      id="cta-section"
      className="w-full py-24 sm:py-32 lg:py-40 bg-brand-dark text-white relative overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/20 rounded-full blur-[150px] pointer-events-none" />

      <Container>
        <div
          ref={containerRef}
          className="max-w-4xl mx-auto text-center flex flex-col items-center"
        >
          <SectionLabel accent="diamond" className="text-white/70 mb-6">
            HAVE A PROJECT IN MIND?
          </SectionLabel>

          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.06] mb-8">
            Let’s build something{" "}
            <span className="font-editorial text-brand-orange text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal italic inline-block transform -rotate-1">
              people want to use.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-neutral-400 font-medium max-w-2xl mb-12">
            Whether you are launching a greenfield product or redesigning a
            flagship platform, we bring design authority and engineering rigor.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Button
              variant="primary"
              size="lg"
              withArrow
              onClick={() =>
                window.open("mailto:hello@zeetech.agency", "_blank")
              }
            >
              Start A Conversation
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-white border-white/30 hover:bg-white hover:text-brand-dark hover:border-white"
              onClick={() => {
                document
                  .getElementById("work")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Review Case Studies
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
