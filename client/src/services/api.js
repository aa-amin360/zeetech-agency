/**
 * Base API Client with Seamless Fallback Handling
 */

const BASE_URL = import.meta.env.VITE_API_URL || "";

export async function fetchWithFallback(endpoint, fallbackData, options = {}) {
  // If no external backend URL is specified, instantly use rich local datasets
  if (!BASE_URL) {
    return fallbackData;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data = await response.json();
    return data.data || data || fallbackData;
  } catch (error) {
    return fallbackData;
  }
}
