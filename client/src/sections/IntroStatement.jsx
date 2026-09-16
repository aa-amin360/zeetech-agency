import React from "react";
import Container from "../components/common/Container.jsx";
import { useReveal } from "../hooks/useReveal.js";

/**
 * Large editorial statement section: "Not more software. Better tools for real people."
 */
export default function IntroStatement() {
  const statementRef = useReveal({ yOffset: 40, duration: 1.1 });

  return (
    <section className="w-full py-20 sm:py-28 lg:py-36 bg-cream border-t border-brand-dark/5">
      <Container>
        <div ref={statementRef} className="max-w-5xl">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-brand-dark leading-[1.05]">
            Not more software.{" "}
            <span className="block mt-2 sm:mt-4">
              Better tools{" "}
              <span className="font-editorial text-brand-orange text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal italic inline-block transform -rotate-1">
                for real people.
              </span>
            </span>
          </h2>
        </div>
      </Container>
    </section>
  );
}
