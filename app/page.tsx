"use client";

import { useEffect, useMemo, useState } from "react";

type Category = "ai" | "biotech" | "ev";

type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number | null;
  exchange: string | null;
  category: Category;
  subtheme: string;
};

type SortKey = "symbol" | "price" | "changePercent" | "volume" | "marketCap";
type SortDir = "asc" | "desc";

const CATS: Record<Category, { label: string; thesis: string; badge: string; ring: string; chip: string; bar: string; text: string; dot: string }> = {
  ai: {
    label: "AI Infrastructure",
    thesis: "Technology-based · chip & AI-platform startups",
    badge: "AI",
    ring: "ring-violet-400/30",
    chip: "bg-violet-500/15 text-violet-300 border-violet-400/30",
    bar: "bg-violet-400",
    text: "text-violet-300",
    dot: "bg-violet-400",
  },
  biotech: {
    label: "Healthcare",
    thesis: "Demographic tailwind · mRNA, genomics, biotech",
    badge: "BIO",
    ring: "ring-emerald-400/30",
    chip: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    bar: "bg-emerald-400",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
  },
  ev: {
    label: "Clean Energy",
    thesis: "Policy locked-in · EV, battery, charging",
    badge: "EV",
    ring: "ring-amber-400/30",
    chip: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    bar: "bg-amber-400",
    text: "text-amber-300",
    dot: "bg-amber-400",
  },
};

const fmtNum = (n: number) =>
  !isFinite(n) ? "—" :
  n >= 1e9 ? (n / 1e9).toFixed(2) + "B" :
  n >= 1e6 ? (n / 1e6).toFixed(2) + "M" :
  n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : n.toFixed(0);

const fmtPrice = (n: number) => "$" + n.toFixed(n < 0.01 ? 4 : 3);

export default function Page() {
  const [data, setData] = useState<Stock[] | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalScanned, setTotalScanned] = useState(0);

  const [activeCats, setActiveCats] = useState<Set<Category>>(new Set(["ai", "biotech", "ev"]));
  const [search, setSearch] = useState("");
  const [minVolume, setMinVolume] = useState(0);
  const [minChange, setMinChange] = useState(-100);
  const [sortKey, setSortKey] = useState<SortKey>("changePercent");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/stocks", { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Failed");
      setData(j.stocks ?? []);
      setUpdatedAt(j.updatedAt);
      setTotalScanned(j.total ?? 0);
    } catch (e: any) {
      setError(e.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const rows = useMemo(() => {
    if (!data) return [];
    const filtered = data.filter((s) => {
      if (!activeCats.has(s.category)) return false;
      if (s.volume < minVolume) return false;
      if (s.changePercent < minChange) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !s.symbol.toLowerCase().includes(q) &&
          !s.name.toLowerCase().includes(q) &&
          !s.subtheme.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * dir;
      return ((av as number) - (bv as number)) * dir;
    });
  }, [data, activeCats, search, minVolume, minChange, sortKey, sortDir]);

  // Stats by category
  const statsByCat = useMemo(() => {
    const out: Record<Category, { count: number; gainers: number; avgChange: number }> = {
      ai: { count: 0, gainers: 0, avgChange: 0 },
      biotech: { count: 0, gainers: 0, avgChange: 0 },
      ev: { count: 0, gainers: 0, avgChange: 0 },
    };
    if (!data) return out;
    for (const cat of ["ai", "biotech", "ev"] as Category[]) {
      const items = data.filter((s) => s.category === cat);
      out[cat].count = items.length;
      out[cat].gainers = items.filter((s) => s.changePercent > 0).length;
      out[cat].avgChange =
        items.length === 0 ? 0 : items.reduce((a, b) => a + b.changePercent, 0) / items.length;
    }
    return out;
  }, [data]);

  // Top 3 movers (any category)
  const topMovers = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  }, [data]);

  function toggleCat(c: Category) {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(c)) {
        if (next.size === 1) return prev; // never zero
        next.delete(c);
      } else next.add(c);
      return next;
    });
  }
  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("desc"); }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted mb-2">
            <span className="live-dot" />
            <span>Live · Yahoo Finance</span>
            {updatedAt && <span className="text-zinc-500">· Updated {new Date(updatedAt).toLocaleTimeString()}</span>}
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
            Deep-Penny Screener
          </h1>
          <p className="mt-2 text-zinc-400 max-w-2xl">
            Nasdaq names trading <span className="text-white font-medium">under $1.50</span> across three high-conviction themes:
            <span className="ml-1 text-violet-300">AI infrastructure</span>,
            <span className="ml-1 text-emerald-300">healthcare</span>,
            and <span className="text-amber-300">clean energy</span>.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="glass px-4 py-2 rounded-lg text-sm hover:bg-white/5 transition disabled:opacity-50 flex items-center gap-2"
        >
          <span className={loading ? "animate-spin inline-block" : "inline-block"}>↻</span>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* CATEGORY THESIS CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {(["ai", "biotech", "ev"] as Category[]).map((c) => {
          const meta = CATS[c];
          const stats = statsByCat[c];
          const active = activeCats.has(c);
          return (
            <button
              key={c}
              onClick={() => toggleCat(c)}
              className={`glass rounded-2xl p-5 text-left transition relative overflow-hidden group ${
                active ? `ring-1 ${meta.ring}` : "opacity-60 hover:opacity-90"
              }`}
            >
              <div className={`absolute -top-px left-0 h-px w-full ${meta.bar} opacity-50`} />
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                  <span className={`text-[11px] font-mono uppercase tracking-wider ${meta.text}`}>
                    {meta.badge}
                  </span>
                </div>
                <span className={`text-xs ${active ? "text-zinc-300" : "text-zinc-500"}`}>
                  {active ? "● shown" : "○ hidden"}
                </span>
              </div>
              <div className="text-lg font-semibold text-white mb-1">{meta.label}</div>
   