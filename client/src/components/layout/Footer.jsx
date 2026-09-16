import React from "react";
import { ArrowUp, Heart } from "lucide-react";
import Container from "../common/Container.jsx";

/**
 * Clean editorial agency footer
 */
export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-cream pt-16 pb-12 border-t border-brand-dark/10">
      <Container>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-brand-dark/10">
          <div>
            <div className="flex items-center gap-2 text-2xl font-black tracking-tight text-brand-dark mb-2">
              <span className="w-8 h-8 rounded-lg bg-brand-orange text-white flex items-center justify-center text-base font-black">
                Z
              </span>
              <span>
                ZEE
                <span className="text-brand-orange font-light mx-0.5">//</span>
                TECH
              </span>
            </div>
            <p className="text-sm text-neutral-600 max-w-sm">
              Crafting world-class digital products, applications, and design
              systems for forward-thinking teams.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6 text-sm font-bold text-brand-dark/80">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-orange transition-colors"
            >
              X (Twitter)
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-orange transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://dribbble.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-orange transition-colors"
            >
              Dribbble
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-orange transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* Back to top button */}
          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-xs font-extrabold tracking-widest uppercase text-brand-dark hover:text-brand-orange transition-colors"
          >
            <span>Back to top</span>
            <span className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all">
              <ArrowUp className="w-4 h-4" />
            </span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-neutral-500 font-medium">
          <p>
            © {new Date().getFullYear()} ZeeTech Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span>Built with precision & passion</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
