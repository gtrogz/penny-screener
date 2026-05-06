// Curated Nasdaq tickers in three thematic baskets.
// All historically trade as deep-penny names (often < $1.50).
// Yahoo Finance has no native screener, so we maintain this watchlist.

export type Category = "ai" | "biotech" | "ev";

export type CategoryMeta = {
  id: Category;
  label: string;
  thesis: string;
  badge: string;          // short chip text
  color: string;          // tailwind base color
  accent: string;         // hex for charts/highlights
};

export const CATEGORIES: Record<Category, CategoryMeta> = {
  ai: {
    id: "ai",
    label: "AI Infrastructure",
    thesis: "Technology-based · chip & AI-platform startups",
    badge: "AI",
    color: "violet",
    accent: "#8b5cf6",
  },
  biotech: {
    id: "biotech",
    label: "Healthcare",
    thesis: "Demographic tailwind · mRNA platforms, genomics, biotech",
    badge: "BIO",
    color: "emerald",
    accent: "#10b981",
  },
  ev: {
    id: "ev",
    label: "Clean Energy",
    thesis: "Policy locked-in · EV, battery, charging infrastructure",
    badge: "EV",
    color: "amber",
    accent: "#f59e0b",
  },
};

export type CategorizedTicker = {
  symbol: string;
  category: Category;
  subtheme: string;
};

export const TICKERS: CategorizedTicker[] = [
  // ─── AI INFRASTRUCTURE / CHIP STARTUPS ───────────────────────────
  { symbol: "BBAI",   category: "ai", subtheme: "AI analytics platform" },
  { symbol: "GFAI",   category: "ai", subtheme: "Computer vision AI" },
  { symbol: "AGFY",   category: "ai", subtheme: "AI ag-tech" },
  { symbol: "AISP",   category: "ai", subtheme: "Edge AI / video" },
  { symbol: "HOLO",   category: "ai", subtheme: "Holographic AI" },
  { symbol: "WIMI",   category: "ai", subtheme: "Holographic AI / China" },
  { symbol: "MARK",   category: "ai", subtheme: "AI media / data" },
  { symbol: "DATS",   category: "ai", subtheme: "AI messaging" },
  { symbol: "INM",    category: "ai", subtheme: "AI bio computing" },
  { symbol: "VERB",   category: "ai", subtheme: "AI commerce" },
  { symbol: "MGRX",   category: "ai", subtheme: "AI healthtech" },
  { symbol: "MLGO",   category: "ai", subtheme: "Big-data analytics" },
  { symbol: "MDAI",   category: "ai", subtheme: "Medical AI" },
  { symbol: "QMCO",   category: "ai", subtheme: "AI data infrastructure" },
  { symbol: "SOUN",   category: "ai", subtheme: "Voice AI" },
  { symbol: "LASE",   category: "ai", subtheme: "Photonics / chip mfg" },
  { symbol: "RGTI",   category: "ai", subtheme: "Quantum computing" },
  { symbol: "QUBT",   category: "ai", subtheme: "Quantum tech" },
  { symbol: "MRAI",   category: "ai", subtheme: "AI vision" },
  { symbol: "POAI",   category: "ai", subtheme: "Predictive oncology AI" },
  { symbol: "MOBX",   category: "ai", subtheme: "AI mobility" },
  { symbol: "CXAI",   category: "ai", subtheme: "Workplace AI" },
  { symbol: "CETX",   category: "ai", subtheme: "AI hardware" },
  { symbol: "DRCT",   category: "ai", subtheme: "AI ad-tech" },
  { symbol: "GROM",   category: "ai", subtheme: "AI media" },
  { symbol: "BTBT",   category: "ai", subtheme: "Crypto / AI compute" },
  { symbol: "KOPN",   category: "ai", subtheme: "AR / micro-displays" },
  { symbol: "KULR",   category: "ai", subtheme: "Battery + AI thermal" },
  { symbol: "PRSO",   category: "ai", subtheme: "5G + AI silicon" },
  { symbol: "RCAT",   category: "ai", subtheme: "Drone AI" },
  { symbol: "SISI",   category: "ai", subtheme: "AI software" },
  { symbol: "ZJYL",   category: "ai", subtheme: "AI medical" },

  // ─── HEALTHCARE / mRNA · GENOMICS · BIOTECH ──────────────────────
  { symbol: "OCGN",   category: "biotech", subtheme: "Gene therapy" },
  { symbol: "INO",    category: "biotech", subtheme: "DNA medicine" },
  { symbol: "MRNS",   category: "biotech", subtheme: "Neurology biotech" },
  { symbol: "PHIO",   category: "biotech", subtheme: "RNAi platform" },
  { symbol: "NRBO",   category: "biotech", subtheme: "Neurology / metabolic" },
  { symbol: "ENVB",   category: "biotech", subtheme: "Psychedelic biotech" },
  { symbol: "VYNE",   category: "biotech", subtheme: "Dermatology" },
  { symbol: "CYCC",   category: "biotech", subtheme: "Oncology" },
  { symbol: "DRMA",   category: "biotech", subtheme: "Acne / dermatology" },
  { symbol: "KALA",   category: "biotech", subtheme: "Eye disease" },
  { symbol: "KPRX",   category: "biotech", subtheme: "Allergy biotech" },
  { symbol: "PALI",   category: "biotech", subtheme: "Hormone therapy" },
  { symbol: "ELYM",   category: "biotech", subtheme: "Neurology biotech" },
  { symbol: "HEPA",   category: "biotech", subtheme: "Liver disease" },
  { symbol: "IMNN",   category: "biotech", subtheme: "Cancer immunotherapy" },
  { symbol: "IMRX",   category: "biotech", subtheme: "Genomic medicine" },
  { symbol: "JAGX",   category: "biotech", subtheme: "GI biotech" },
  { symbol: "ONCY",   category: "biotech", subtheme: "Oncolytic virus" },
  { symbol: "ONCS",   category: "biotech", subtheme: "Cancer immunotherapy" },
  { symbol: "ONCO",   category: "biotech", subtheme: "Oncology" },
  { symbol: "AGEN",   category: "biotech", subtheme: "Cancer immunotherapy" },
  { symbol: "ATAI",   category: "biot