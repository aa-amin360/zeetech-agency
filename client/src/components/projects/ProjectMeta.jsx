import React from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * Project metadata displaying service scope, timeline, and client badge
 */
export default function ProjectMeta({ project }) {
  return (
    <div className="flex flex-col gap-6 pt-6 border-t border-black/10">
      {/* Service scope & timeline */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="block text-[11px] font-black uppercase tracking-wider text-black/50 mb-1">
            Scope
          </span>
          <p className="text-xs sm:text-sm font-bold text-brand-dark leading-snug">
            {project.services || project.project_type}
          </p>
        </div>

        <div>
          <span className="block text-[11px] font-black uppercase tracking-wider text-black/50 mb-1">
            Timeline
          </span>
          <p className="text-xs sm:text-sm font-bold text-brand-dark">
            {project.timeline || project.duration}
          </p>
        </div>
      </div>

      {/* Client Identity Pill */}
      {project.client && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-black/5 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={project.client.avatar || project.client_avatar}
              alt={project.client.name || project.client_name}
              className="w-10 h-10 rounded-full object-cover border border-white"
            />
            <div>
              <p className="text-xs font-black uppercase tracking-tight text-brand-dark">
                {project.client.name || project.client_name}
              </p>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                {project.client.role || project.client_role}
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-dark shadow-sm">
            <ArrowUpRight className="w-4 h-4 text-brand-orange" />
          </div>
        </div>
      )}
    </div>
  );
}
