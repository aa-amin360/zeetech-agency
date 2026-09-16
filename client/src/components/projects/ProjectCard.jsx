import React from "react";
import ProjectMeta from "./ProjectMeta.jsx";

/**
 * Individual Large Project Card matching the vibrant colorways and mockup layout from the reference
 */
const ProjectCard = React.forwardRef(({ project, index }, ref) => {
  const bgColor = project.accentColor || project.bg_color || "#FB923C";

  return (
    <div
      ref={ref}
      className="w-full rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 lg:p-14 border border-black/10 shadow-2xl transition-all duration-500 overflow-hidden relative"
      style={{
        backgroundColor: bgColor,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Project Details & Meta (Cols 1-6) */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full">
          <div>
            {/* Category / Project Number */}
            <span className="inline-block text-xs font-black tracking-widest text-black/60 uppercase mb-4">
              {project.category || `PROJECT 0${index + 1}`}
            </span>

            {/* Title */}
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-brand-dark leading-[1.1] mb-4">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-sm sm:text-base font-medium text-black/80 leading-relaxed max-w-lg mb-8">
              {project.description}
            </p>
          </div>

          {/* Metadata Block */}
          <ProjectMeta project={project} />
        </div>

        {/* Right Column: Device UI Mockup Screenshot (Cols 7-12) */}
        <div className="lg:col-span-6 flex items-center justify-center relative">
          <div className="relative w-full max-w-lg rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl border-4 border-neutral-800 transform hover:scale-[1.02] transition-transform duration-500">
            {/* Top Device Header Bar */}
            <div className="h-6 bg-neutral-800 flex items-center px-3 gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
            </div>

            {/* Mockup UI image */}
            <img
              src={project.mockupImage || project.image_url}
              alt={project.title}
              loading="lazy"
              className="w-full h-auto max-h-[360px] object-cover object-top"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = "ProjectCard";
export default ProjectCard;
