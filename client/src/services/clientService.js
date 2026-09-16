import { fetchWithFallback } from "./api.js";
import { featuredReview } from "../data/fallbackTestimonials.js";

export const clientService = {
  /**
   * Fetch all clients and verified endorsements
   * @returns {Promise<Array>}
   */
  async getClients() {
    return await fetchWithFallback("/clients", [featuredReview]);
  },
};
