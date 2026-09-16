import { pool } from "../config/database.js";

export const fallbackBrands = [
  // Row 1 (Right to Left Marquee)
  { id: 1, name: "Mastlink", logo_svg: "mastlink", row: 1, sort_order: 1 },
  { id: 2, name: "inDebted", logo_svg: "indebted", row: 1, sort_order: 2 },
  { id: 3, name: "Pentair", logo_svg: "pentair", row: 1, sort_order: 3 },
  { id: 4, name: "Telr", logo_svg: "telr", row: 1, sort_order: 4 },
  { id: 5, name: "Boon", logo_svg: "boon", row: 1, sort_order: 5 },
  {
    id: 6,
    name: "MergePoint.ai",
    logo_svg: "mergepoint",
    row: 1,
    sort_order: 6,
  },

  // Row 2 (Left to Right Marquee)
  { id: 7, name: "Axis Solutions", logo_svg: "axis", row: 2, sort_order: 1 },
  { id: 8, name: "Goldmark", logo_svg: "goldmark", row: 2, sort_order: 2 },
  { id: 9, name: "AeroPulse", logo_svg: "aeropulse", row: 2, sort_order: 3 },
  { id: 10, name: "HyperTrack", logo_svg: "hypertrack", row: 2, sort_order: 4 },
  { id: 11, name: "Apex Flow", logo_svg: "apexflow", row: 2, sort_order: 5 },
  {
    id: 12,
    name: "MergePoint Enterprise",
    logo_svg: "mergepoint",
    row: 2,
    sort_order: 6,
  },
];

export const BrandModel = {
  async getAll() {
    try {
      const result = await pool.query(
        "SELECT * FROM brands ORDER BY row ASC, sort_order ASC",
      );
      return result.rows.length > 0 ? result.rows : fallbackBrands;
    } catch (error) {
      return fallbackBrands;
    }
  },

  async getByRow(rowNumber) {
    try {
      const result = await pool.query(
        "SELECT * FROM brands WHERE row = $1 ORDER BY sort_order ASC",
        [rowNumber],
      );
      if (result.rows.length > 0) return result.rows;
      return fallbackBrands.filter((b) => b.row === parseInt(rowNumber, 10));
    } catch (error) {
      return fallbackBrands.filter((b) => b.row === parseInt(rowNumber, 10));
    }
  },
};
