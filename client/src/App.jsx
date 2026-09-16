import React from "react";
import { useLenis } from "./hooks/useLenis.js";
import Header from "./components/layout/Header.jsx";
import Hero from "./components/hero/Hero.jsx";
import IntroStatement from "./sections/IntroStatement.jsx";
import BrandSection from "./components/brands/BrandSection.jsx";
import Testimonial from "./components/testimonials/Testimonial.jsx";
import StatsSection from "./components/stats/StatsSection.jsx";
import SelectedWork from "./components/projects/SelectedWork.jsx";
import ClientEndorsements from "./sections/ClientEndorsements.jsx";
import CTASection from "./sections/CTASection.jsx";
import Footer from "./components/layout/Footer.jsx";

/**
 * Root Application Component assembling the complete digital agency portfolio
 */
export default function App() {
  // Mount buttery-smooth Lenis scrolling synchronized with GSAP
  useLenis();

  return (
    <div className="min-h-screen bg-cream text-brand-dark flex flex-col selection:bg-brand-orange selection:text-white">
      {/* 1. Fixed Header Navigation */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero Section with 3D Diagonal Rolling Wall */}
        <Hero />

        {/* 3. Editorial Statement: "Not more software. Better tools for real people." */}
        <IntroStatement />

        {/* 4. Two-Way Infinite Logo Marquee */}
        <BrandSection />

        {/* 5. Featured Client Testimonial (Andrew Baker) */}
        <Testimonial />

        {/* 6. Full-Width Orange Statistics Strip with Live Count-Up */}
        <StatsSection />

        {/* 7. Selected Work: GSAP Stacking Deck of Project Cards */}
        <SelectedWork />

        {/* 8. Verified Client Endorsements Slider */}
        <ClientEndorsements />

        {/* 9. High-Impact Agency CTA */}
        <CTASection />
      </main>

      {/* 10. Agency Footer */}
      <Footer />
    </div>
  );
}
