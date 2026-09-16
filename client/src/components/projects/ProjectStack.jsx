import React from "react";
import ProjectCard from "./ProjectCard.jsx";
import { useProjectStack } from "../../hooks/useProjectStack.js";

/**
 * Deck-of-cards overlapping project stack managed by GSAP ScrollTrigger
 */
export default function ProjectStack({ projects = [] }) {
  const { containerRef, cardRefs } = useProjectStack(projects);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col gap-10 sm:gap-16 pb-20"
    >
      {projects.map((project, index) => (
        <div
          key={project.id || index}
          className="sticky top-24 sm:top-28 lg:top-32 w-full transition-all duration-300"
          style={{
            zIndex: index + 1,
          }}
        >
          <ProjectCard
            ref={(el) => (cardRefs.current[index] = el)}
            project={project}
            index={index}
          />
        </div>
      ))}
    </div>
  );
}
