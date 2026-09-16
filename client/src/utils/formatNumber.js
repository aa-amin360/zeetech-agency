/**
 * Formats numbers cleanly for stat animations and currency values
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  return new Intl.NumberFormat("en-US").format(Math.floor(num));
};

/**
 * Parses numeric strings with prefixes/suffixes safely
 * @param {string|number} rawValue
 * @returns {{ prefix: string, number: number, suffix: string }}
 */
export const parseMetric = (rawValue) => {
  if (typeof rawValue === "number") {
    return { prefix: "", number: rawValue, suffix: "" };
  }

  const stringValue = String(rawValue).trim();
  const match = stringValue.match(/^([^0-9]*)([0-9,.]+)([^0-9]*)$/);

  if (!match) {
    return { prefix: "", number: 0, suffix: stringValue };
  }

  const prefix = match[1] || "";
  const number = parseFloat(match[2].replace(/,/g, "")) || 0;
  const suffix = match[3] || "";

  return { prefix, number, suffix };
};
