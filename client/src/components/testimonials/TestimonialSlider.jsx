import React, { useState } from "react";
import ArrowButton from "../common/ArrowButton.jsx";
import { ShieldCheck } from "lucide-react";

/**
 * Interactive testimonial slider for verified endorsements
 */
export default function TestimonialSlider({ endorsements = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!endorsements.length) return null;

  const current = endorsements[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? endorsements.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === endorsements.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className="w-full">
      {/* Slider Controls Header */}
      <div className="flex items-center justify-end gap-3 mb-8">
        <ArrowButton
          direction="left"
          size="md"
          variant="outline"
          onClick={handlePrev}
          ariaLabel="Previous endorsement"
        />
        <ArrowButton
          direction="right"
          size="md"
          variant="outline"
          onClick={handleNext}
          ariaLabel="Next endorsement"
        />
      </div>

      {/* Main Endorsement Card */}
      <div className="w-full bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-brand-dark/10 shadow-xl shadow-black/5 transition-all duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Client Avatar (Cols 1-4) */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="relative mb-6">
              <img
                src={current.avatar}
                alt={current.clientName}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover shadow-lg border-4 border-white"
              />
              <div className="absolute -bottom-3 left-1/2 lg:left-4 -translate-x-1/2 lg:translate-x-0 bg-brand-dark text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md whitespace-nowrap">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{current.verifiedTag || "VERIFIED CLIENT"}</span>
              </div>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-brand-dark">
              {current.clientName}
            </h3>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mt-1">
              {current.clientRole}
            </p>
          </div>

          {/* Testimonial Quote (Cols 5-12) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-brand-dark leading-snug mb-8">
              <span className="text-brand-orange font-editorial text-4xl mr-1 font-normal">
                “
              </span>
              {current.quote}
              <span className="text-brand-orange font-editorial text-4xl ml-1 font-normal">
                ”
              </span>
            </blockquote>

            {/* Pagination dots */}
            <div className="flex items-center gap-2 pt-6 border-t border-neutral-100">
              {endorsements.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? "w-8 bg-brand-orange"
                      : "w-2 bg-neutral-300 hover:bg-neutral-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
