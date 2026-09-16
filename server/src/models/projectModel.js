import { pool } from "../config/database.js";

// Built-in fallback projects in case PostgreSQL is not connected
export const fallbackProjects = [
  {
    id: 1,
    title: "Real-Time Dispatch & Telematics Platform",
    category: "PROJECT 01 // FLEETPULSE GLOBAL",
    description:
      "High-throughput real-time telemetry processing interface serving fleet managers across 40+ countries with sub-20ms WebSocket sync.",
    client_name: "Avneet Chadha",
    client_role: "VP of Product",
    client_avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    project_type: "Product Strategy, UI/UX Design & Distributed Systems",
    duration: "3 Months",
    bg_color: "#FB923C", // Warm vivid Orange
    text_color: "#0D0D0D",
    image_url:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
    sort_order: 1,
  },
  {
    id: 2,
    title: "Design A Lawyer's Second Brain",
    category: "PROJECT 02 // LEXICON INTELLIGENCE",
    description:
      "AI-powered case law synthesizer and legal knowledge vault transforming 500-page brief discovery into instantaneous contextual answers.",
    client_name: "David Miller",
    client_role: "Head of Product AI, Lexicon",
    client_avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    project_type: "Full Product Architecture & Design System",
    duration: "4 Months",
    bg_color: "#A3E635", // Electric Lime
    text_color: "#0D0D0D",
    image_url:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80",
    sort_order: 2,
  },
  {
    id: 3,
    title: "FinTech Multi-Tenant Banking Console",
    category: "PROJECT 03 // VERTEX PROTOCOL",
    description:
      "Enterprise multi-currency ledger dashboard managing $1.2B quarterly transaction flows with biometric hardware authentication.",
    client_name: "Sarah Jenkins",
    client_role: "Chief Operating Officer",
    client_avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    project_type: "Design System & React Dashboard Engineering",
    duration: "2.5 Months",
    bg_color: "#38BDF8", // Cyan Blue
    text_color: "#0D0D0D",
    image_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    sort_order: 3,
  },
  {
    id: 4,
    title: "AI Clinical Decision Support Engine",
    category: "PROJECT 04 // BIOMED SYNAPSE",
    description:
      "Contextual clinical assistant integrating diagnostic imagery, medical histories, and drug-interaction models for acute care doctors.",
    client_name: "Dr. Aris Thorne",
    client_role: "Clinical Director",
    client_avatar:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    project_type: "Interactive Diagnostics UI & Data Viz",
    duration: "5 Months",
    bg_color: "#C084FC", // Purple
    text_color: "#0D0D0D",
    image_url:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80",
    sort_order: 4,
  },
  {
    id: 5,
    title: "Autonomous EV Fleet Operations Hub",
    category: "PROJECT 05 // AEROPULSE MOBILITY",
    description:
      "Dynamic route telemetry, state-of-charge scheduling, and predictive maintenance platform for commercial electric van fleets.",
    client_name: "Elena Rostova",
    client_role: "Head of Fleet Technology",
    client_avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    project_type: "Mapbox Integration & Mobile Companion App",
    duration: "3.5 Months",
    bg_color: "#F472B6", // Pink
    text_color: "#0D0D0D",
    image_url:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    sort_order: 5,
  },
];

export const ProjectModel = {
  async getAll() {
    try {
      const result = await pool.query(
        "SELECT * FROM projects ORDER BY sort_order ASC",
      );
      return result.rows.length > 0 ? result.rows : fallbackProjects;
    } catch (error) {
      return fallbackProjects;
    }
  },

  async getById(id) {
    try {
      const result = await pool.query("SELECT * FROM projects WHERE id = $1", [
        id,
      ]);
      if (result.rows.length > 0) return result.rows[0];
      return fallbackProjects.find((p) => p.id === parseInt(id, 10)) || null;
    } catch (error) {
      return fallbackProjects.find((p) => p.id === parseInt(id, 10)) || null;
    }
  },
};
