"use client";

import { useEffect, useMemo, useState } from "react";

type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number | null;
  exchange: string | null;
};

type SortKey = "symbol" | "price" | "changePercent" | "volume" | "marketCap";
type SortDir = "asc" | "desc";

const fmtNum = (n: number) =>
  n >= 1e9 ? (n / 1e9).toFixed(2) + "B" :
  n >= 1e6 ? (n / 1e6).toFixed(2) + "M" :
  n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : n.toFixed(0);

export default function Page() {
  const [data, setData] = useState<Stock[] | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5);
  const [minVolume, setMinVolume] = useState(0);
  const [minChange, setMinChange] = useState(-100);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("changePercent");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/stocks", { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Failed");
      setData(j.stocks);
      setUpdatedAt(j.updatedAt);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const rows = useMemo(() => {
    if (!data) return [];
    const filtered = data.filter((s) => {
      if (s.price < minPrice || s.price > maxPrice) return false;
      if (s.volume < minVolume) return false;
      if (s.changePercent < minChange) return false;
      if (search && !`${s.symbol} ${s.name}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * dir;
      return ((av as number) - (bv as number)) * dir;
    });
  }, [data, minPrice, maxPrice, minVolume, minChange, search, sortKey, sortDir]);

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("desc"); }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nasdaq Penny Stock Screener</h1>
          <p className="text-sm text-muted">Live quotes from Yahoo Finance · stocks under $5 listed on Nasdaq</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          {updatedAt && <span>Updated {new Date(updatedAt).toLocaleTimeString()}</span>}
          <button
            onClick={load}
            className="px-3 py-1.5 rounded-md border border-border bg-panel hover:bg-zinc-800 transition"
            disabled={loading}
          >
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5 p-4 rounded-xl bg-panel border border-border">
        <Field label="Search">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Symbol or name"
            className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
          />
        </Field>
        <Field label={`Min Price ($${minPrice.toFixed(2)})`}>
          <input type="range" min={0} max={5} step={0.05} value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full" />
        </Field>
        <Field label={`Max Price ($${maxPrice.toFixed(2)})`}>
          <input type="range" min={0} max={5} step={0.05} value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full" />
        </Field>
        <Field label={`Min Volume (${fmtNum(minVolume)})`}>
          <input type="range" min={0} max={5_000_000} step={50_000} value={minVolume}
            onChange={(e) => setMinVolume(Number(e.target.value))} className="w-full" />
        </Field>
        <Field label={`Min % Change (${minChange.toFixed(0)}%)`}>
          <input type="range" min={-50} max={50} step={1} value={minChange}
            onChange={(e) => setMinChange(Number(e.target.value))} className="w-full" />
        </Field>
      </section>

      {error && (
        <div className="mb-4 p-3 rounded-md border border-danger/30 bg-danger/10 text-danger text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-panel text-muted">
            <tr>
              <Th onClick={() => toggleSort("symbol")} active={sortKey === "symbol"} dir={sortDir}>Symbol</Th>
              <th className="px-3 py-2 text-left font-medium">Name</th>
              <Th onClick={() => toggleSort("price")} active={sortKey === "price"} dir={sortDir} align="right">Price</Th>
              <Th onClick={() => toggleSort("changePercent")} active={sortKey === "changePercent"} dir={sortDir} align="right">% Change</Th>
              <Th onClick={() => toggleSort("volume")} active={sortKey === "volume"} dir={sortDir} align="right">Volume</Th>
              <Th onClick={() => toggleSort("marketCap")} active={sortKey === "marketCap"} dir={sortDir} align="right">Market Cap</Th>
            </tr>
          </thead>
          <tbody>
            {loading && !data && (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-muted">Loading market data…</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-muted">No matches for your filters.</td></tr>
            )}
            {rows.map((s) => (
              <tr key={s.symbol} className="border-t border-border hover:bg-panel/60">
                <td className="px-3 py-2 font-semibold">{s.symbol}</td>
                <td className="px-3 py-2 text-zinc-300 truncate max-w-[220px]">{s.name}</td>
                <td className="px-3 py-2 text-right tabular-nums">${s.price.toFixed(2)}</td>
                <td className={`px-3 py-2 text-right tabular-nums ${s.changePercent >= 0 ? "text-accent" : "text-danger"}`}>
                  {s.changePercent >= 0 ? "+" : ""}{s.changePercent.toFixed(2)}%
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtNum(s.volume)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{s.marketCap ? "$" + fmtNum(s.marketCap) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="mt-6 text-xs text-muted">
        <p>Data delayed and provided by Yahoo Finance for informational purposes only — not investment advice.</p>
      </footer>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-muted mb-1">{label}</span>
      {children}
    </label>
  );
}

function Th({ children, onClick, active, dir, align = "left" }:
  { children: React.ReactNode; onClick: () => void; active: boolean; dir: SortDir; align?: "left" | "right" }) {
  return (
    <th
      onClick={onClick}
      className={`px-3 py-2 font-medium select-none cursor-pointer ${align === "right" ? "text-right" : "text-left"} ${active ? "text-zinc-100" : ""}`}
    >
      {children}{active ? (dir === "asc" ? " ↑" : " ↓") : ""}
    </th>
  );
}
