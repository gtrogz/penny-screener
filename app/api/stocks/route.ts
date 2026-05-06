import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";
import { NASDAQ_PENNY_TICKERS } from "@/lib/tickers";

export const revalidate = 60; // cache for 60s on Vercel

export type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;       // absolute
  changePercent: number;
  volume: number;
  marketCap: number | null;
  exchange: string | null;
};

// chunk helper – Yahoo's quote endpoint accepts ~50 symbols per call
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function GET() {
  try {
    const batches = chunk(NASDAQ_PENNY_TICKERS, 50);
    const results: Stock[] = [];

    for (const batch of batches) {
      // suppress yahoo-finance2 survey notice + validation noise
      try {
        const quotes = await yahooFinance.quote(batch, {}, { validateResult: false });
        const list = Array.isArray(quotes) ? quotes : [quotes];
        for (const q of list) {
          if (!q || typeof q.regularMarketPrice !== "number") continue;
          results.push({
            symbol: q.symbol ?? "",
            name: q.shortName || q.longName || q.symbol || "",
            price: q.regularMarketPrice,
            change: q.regularMarketChange ?? 0,
            changePercent: q.regularMarketChangePercent ?? 0,
            volume: q.regularMarketVolume ?? 0,
            marketCap: q.marketCap ?? null,
            exchange: q.fullExchangeName ?? q.exchange ?? null,
          });
        }
      } catch (err) {
        // skip bad batch, keep going
        console.error("batch error", err);
      }
    }

    // keep only Nasdaq-listed names that are still penny stocks (price <= 5)
    const filtered = results.filter(
      (s) => s.price > 0 && s.price <= 5 && /Nasdaq|NMS|NCM|NGS/i.test(s.exchange ?? "")
    );

    return NextResponse.json(
      { count: filtered.length, updatedAt: new Date().toISOString(), stocks: filtered },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "fetch failed" }, { status: 500 });
  }
}
