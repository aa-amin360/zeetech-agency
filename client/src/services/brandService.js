import { fetchWithFallback } from "./api.js";
import { fallbackBrandRows } from "../data/fallbackBrands.js";

export const brandService = {
  /**
   * Fetch all brands categorized by marquee row
   * @returns {Promise<{ row1: Array, row2: Array }>}
   */
  async getBrands() {
    return await fetchWithFallback("/brands", fallbackBrandRows);
  },

  /**
   * Fetch brands for a specific marquee row (1 or 2)
   * @param {number} rowNumber
   * @returns {Promise<Array>}
   */
  async getBrandsByRow(rowNumber) {
    const fallback =
      rowNumber === 1 ? fallbackBrandRows.row1 : fallbackBrandRows.row2;
    return await fetchWithFallback(`/brands?row=${rowNumber}`, fallback);
  },
};
