import { pool } from "../config/database.js";

export const fallbackClients = [
  {
    id: 1,
    name: "Andrew Baker",
    company: "Baker Media Tech",
    role: "Founder & CEO",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    testimonial:
      "IT'S GREAT THAT I CAN WORK WITH JUST ZEE // TECH TO GET EVERY ASPECT OF WHAT I NEED COMPLETED.",
    rating: 5.0,
  },
  {
    id: 2,
    name: "Marcus Vance",
    company: "ThreeSides Logistics",
    role: "VP of Engineering",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
    testimonial:
      "ZeeTech Re-Architected Our Entire Telematics Ingestion Pipeline. We Went From Dropping WebSocket Packets During Morning Dispatch Rushes To Handling 50,000 Live Vehicle GPS Streams With 18ms Latency.",
    rating: 5.0,
  },
  {
    id: 3,
    name: "Clara Hessel",
    company: "Novis Genomics",
    role: "Chief Product Officer",
    image:
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80",
    testimonial:
      "Their rare combination of bespoke aesthetic direction and rock-solid full-stack architectural discipline made them feel like an integral internal team rather than an agency.",
    rating: 5.0,
  },
];

export const ClientModel = {
  async getAll() {
    try {
      const result = await pool.query("SELECT * FROM clients ORDER BY id ASC");
      return result.rows.length > 0 ? result.rows : fallbackClients;
    } catch (error) {
      return fallbackClients;
    }
  },
};
