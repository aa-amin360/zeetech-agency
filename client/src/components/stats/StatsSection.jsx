import React, { useState, useEffect } from "react";
import Container from "../common/Container.jsx";
import StatCard from "./StatCard.jsx";
import { useCounter } from "../../hooks/useCounter.js";
import { statsService } from "../../services/statsService.js";
import { statisticsData } from "../../data/fallbackTestimonials.js";

/**
 * Full-width vibrant orange statistics strip with count-up animations
 */
export default function StatsSection() {
  const [stats, setStats] = useState(statisticsData);
  const { containerRef, numberRefs } = useCounter(stats);

  useEffect(() => {
    statsService.getStatistics().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setStats(data);
      }
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full bg-brand-orange py-12 sm:py-16 shadow-2xl relative overflow-hidden"
    >
      {/* Subtle background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/30 via-transparent to-orange-400/20 pointer-events-none" />

      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.id || index}
              stat={stat}
              numberRef={(el) => (numberRefs.current[index] = el)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
