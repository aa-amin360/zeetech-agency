import React, { useState, useEffect } from "react";
import Container from "../common/Container.jsx";
import SectionLabel from "../common/SectionLabel.jsx";
import ProjectStack from "./ProjectStack.jsx";
import { projectService } from "../../services/projectService.js";
import { fallbackProjects } from "../../data/fallbackProjects.js";
import { ArrowUpRight } from "lucide-react";

/**
 * Main Selected Work Section with Editorial Header and Stacking Cards Deck
 */
export default function SelectedWork() {
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    projectService.getProjects().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data);
      }
    });
  }, []);

  return (
    <section id="work" className="w-full py-20 sm:py-28 lg:py-36 bg-cream">
      <Container>
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 gap-8">
          <div>
            <SectionLabel accent="diamond">SELECTED WORK</SectionLabel>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">
              SAMPLE CASES — CLIENT NAMES PENDING APPROVAL
            </p>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-brand-dark leading-[1.08]">
              Work that solves{" "}
              <span className="font-editorial text-brand-orange text-5xl sm:text-7xl md:text-8xl italic font-normal inline-block transform -rotate-1">
                real problems.
              </span>
            </h2>
          </div>

          {/* Right side all projects link */}
          <a
            href="#work"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-xs font-extrabold tracking-wider uppercase hover:bg-neutral-800 transition-all self-start md:self-end"
          >
            <span>All Case Studies</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Physical Stacking Deck of Project Cards */}
        <ProjectStack projects={projects} />
      </Container>
    </section>
  );
}
