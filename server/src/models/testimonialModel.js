import { pool } from "../config/database.js";

export const fallbackTestimonials = [
  {
    id: 1,
    client_name: "Andrew Baker",
    client_role: "Founder & CEO",
    client_company: "Baker Media Tech",
    avatar_url:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    quote:
      "IT'S GREAT THAT I CAN WORK WITH JUST ZEE // TECH TO GET EVERY ASPECT OF WHAT I NEED COMPLETED.",
    rating: 5.0,
    platform: "Fiverr",
    is_featured: true,
    sort_order: 1,
  },
  {
    id: 2,
    client_name: "Marcus Vance",
    client_role: "VP of Engineering",
    client_company: "ThreeSides Logistics",
    avatar_url:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
    quote:
      "ZeeTech Re-Architected Our Entire Telematics Ingestion Pipeline. We Went From Dropping WebSocket Packets During Morning Dispatch Rushes To Handling 50,000 Live Vehicle GPS Streams With 18ms Latency.",
    rating: 5.0,
    platform: "Upwork",
    is_featured: false,
    sort_order: 2,
  },
  {
    id: 3,
    client_name: "Clara Hessel",
    client_role: "Chief Product Officer",
    client_company: "Novis Genomics",
    avatar_url:
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80",
    quote:
      "Their rare combination of bespoke aesthetic direction and rock-solid full-stack architectural discipline made them feel like an integral internal team rather than an agency.",
    rating: 5.0,
    platform: "Direct",
    is_featured: false,
    sort_order: 3,
  },
];

export const TestimonialModel = {
  async getAll() {
    try {
      const result = await pool.query(
        "SELECT * FROM testimonials ORDER BY sort_order ASC",
      );
      return result.rows.length > 0 ? result.rows : fallbackTestimonials;
    } catch (error) {
      return fallbackTestimonials;
    }
  },

  async getFeatured() {
    try {
      const result = await pool.query(
        "SELECT * FROM testimonials WHERE is_featured = TRUE LIMIT 1",
      );
      if (result.rows.length > 0) return result.rows[0];
      return (
        fallbackTestimonials.find((t) => t.is_featured) ||
        fallbackTestimonials[0]
      );
    } catch (error) {
      return (
        fallbackTestimonials.find((t) => t.is_featured) ||
        fallbackTestimonials[0]
      );
    }
  },
};
