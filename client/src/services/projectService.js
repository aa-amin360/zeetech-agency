import { fetchWithFallback } from "./api.js";
import { fallbackProjects } from "../data/fallbackProjects.js";

export const projectService = {
  /**
   * Fetch all portfolio projects
   * @returns {Promise<Array>}
   */
  async getProjects() {
    return await fetchWithFallback("/projects", fallbackProjects);
  },

  /**
   * Fetch single project by ID
   * @param {number|string} id
   * @returns {Promise<Object>}
   */
  async getProjectById(id) {
    const fallback =
      fallbackProjects.find((p) => String(p.id) === String(id)) ||
      fallbackProjects[0];
    return await fetchWithFallback(`/projects/${id}`, fallback);
  },
};
