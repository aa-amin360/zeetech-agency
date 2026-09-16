import React, { useState, useEffect } from "react";
import Container from "../common/Container.jsx";
import TestimonialCard from "./TestimonialCard.jsx";
import { testimonialService } from "../../services/testimonialService.js";
import { featuredReview } from "../../data/fallbackTestimonials.js";
import { useReveal } from "../../hooks/useReveal.js";

/**
 * Featured Client Testimonial Section
 */
export default function Testimonial() {
  const [review, setReview] = useState(featuredReview);
  const sectionRef = useReveal({ yOffset: 30, duration: 1 });

  useEffect(() => {
    testimonialService.getFeatured().then((data) => {
      if (data) setReview(data);
    });
  }, []);

  return (
    <section id="testimonials" className="w-full py-16 sm:py-24 bg-cream">
      <Container>
        <div ref={sectionRef}>
          <TestimonialCard review={review} />
        </div>
      </Container>
    </section>
  );
}
