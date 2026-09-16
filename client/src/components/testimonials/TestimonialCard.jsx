import React from "react";
import { Star, CheckCircle2 } from "lucide-react";

/**
 * Editorial Client Review Card matching the reference layout
 */
export default function TestimonialCard({ review }) {
  if (!review) return null;

  return (
    <div className="w-full bg-white rounded-3xl p-8 sm:p-12 border border-brand-dark/10 shadow-xl shadow-black/5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Left Column: Client Avatar & Identity */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="relative mb-4">
            <img
              src={review.avatar}
              alt={review.clientName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-md border-2 border-white"
            />
            <span className="absolute -bottom-2 -right-2 bg-brand-orange text-white p-1 rounded-full shadow-md">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          <h3 className="text-xl font-extrabold tracking-tight text-brand-dark uppercase">
            {review.clientName}
          </h3>
          <p className="text-xs text-neutral-500 font-semibold tracking-wide uppercase mt-1">
            {review.clientRole}
          </p>
        </div>

        {/* Right Column: Large Quote & Proof Badges */}
        <div className="md:col-span-8 flex flex-col justify-between">
          {/* Quote */}
          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-brand-dark leading-snug mb-8">
            <span className="text-brand-orange font-editorial text-4xl mr-1 font-normal">
              “
            </span>
            {review.quote}
          </blockquote>

          {/* Badges & Stars */}
          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-neutral-100">
            {/* Star Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex text-brand-orange">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-orange" />
                ))}
              </div>
              <span className="text-xs font-black tracking-wider text-brand-dark ml-1">
                5.0 / 5.0
              </span>
            </div>

            {/* Fiverr Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black tracking-wide border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Fiverr Top Rated Plus
            </div>

            {/* Upwork Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black tracking-wide border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              100% Job Success
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
