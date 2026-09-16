import { fetchWithFallback } from "./api.js";
import {
  featuredReview,
  verifiedEndorsements,
} from "../data/fallbackTestimonials.js";

export const testimonialService = {
  /**
   * Fetch all testimonials
   * @returns {Promise<Array>}
   */
  async getTestimonials() {
    return await fetchWithFallback("/testimonials", verifiedEndorsements);
  },

  /**
   * Fetch the featured main testimonial (Andrew Baker)
   * @returns {Promise<Object>}
   */
  async getFeatured() {
    return await fetchWithFallback("/testimonials/featured", featuredReview);
  },

  /**
   * Fetch verified client endorsements for the slider
   * @returns {Promise<Array>}
   */
  async getEndorsements() {
    return await fetchWithFallback(
      "/testimonials/endorsements",
      verifiedEndorsements,
    );
  },
};
