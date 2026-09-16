import { fetchWithFallback } from "./api.js";
import { statisticsData } from "../data/fallbackTestimonials.js";

export const statsService = {
  /**
   * Fetch agency statistics metrics for the count-up strip
   * @returns {Promise<Array>}
   */
  async getStatistics() {
    return await fetchWithFallback("/stats", statisticsData);
  },
};
