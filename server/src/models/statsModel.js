import { pool } from "../config/database.js";

export const fallbackStatistics = [
  {
    id: 1,
    value: 150,
    prefix: "",
    suffix: "+",
    label: "COUNTRIES SERVED",
    sort_order: 1,
  },
  {
    id: 2,
    value: 14,
    prefix: "",
    suffix: "+",
    label: "PROJECTS SHIPPED",
    sort_order: 2,
  },
  {
    id: 3,
    value: 98,
    prefix: "",
    suffix: "%",
    label: "CLIENT RETENTION",
    sort_order: 3,
  },
  {
    id: 4,
    value: 5,
    prefix: "",
    suffix: "+",
    label: "YEARS BUILDING",
    sort_order: 4,
  },
];

export const StatsModel = {
  async getAll() {
    try {
      const result = await pool.query(
        "SELECT * FROM statistics ORDER BY sort_order ASC",
      );
      return result.rows.length > 0 ? result.rows : fallbackStatistics;
    } catch (error) {
      return fallbackStatistics;
    }
  },
};
