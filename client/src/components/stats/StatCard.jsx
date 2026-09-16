import React from "react";

/**
 * Individual statistic card displayed on the orange metrics strip
 */
export default function StatCard({ stat, numberRef }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center group">
      {/* Animated Metric Number + Suffix */}
      <div className="flex items-baseline justify-center text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-2 font-display">
        <span ref={numberRef} className="tabular-nums">
          0
        </span>
        <span className="text-white/90 font-light ml-0.5">
          {stat.suffix || "+"}
        </span>
      </div>

      {/* Label */}
      <span className="text-xs sm:text-sm font-extrabold tracking-widest text-white/80 uppercase">
        {stat.label}
      </span>
    </div>
  );
}
