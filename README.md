# Nasdaq Penny Stock Screener

Live screener for Nasdaq-listed stocks trading under $5. Quotes pulled from Yahoo Finance via [`yahoo-finance2`](https://github.com/gadicc/node-yahoo-finance2). No API key required.

## Features

- Live prices for ~600 Nasdaq penny tickers (curated list in `lib/tickers.ts`)
- Filters: price range, minimum volume, minimum % change, free-text search
- Sortable columns: symbol, price, % change, volume, market cap
- Auto-cached for 60s on Vercel edge

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy to Vercel (one command)

```bash
npm i -g vercel
vercel login         # one-time
vercel               # follow prompts → done
```

Or push this folder to a GitHub repo and click **Import Project** at https://vercel.com/new.

## Deploy to Netlify

1. Push to GitHub
2. https://app.netlify.com → Add new site → Import from Git → pick the repo
3. Build command: `npm run build`  ·  Publish directory: `.next`
4. Install the **Next.js Runtime** plugin (Netlify suggests it automatically)

## Customize the watchlist

Yahoo Finance has no "all Nasdaq under $5" endpoint, so we maintain a curated list at
`lib/tickers.ts`. Add/remove symbols freely; the API filters out anything that isn't
listed on Nasdaq or has moved above $5.

## Disclaimer

Data is delayed and informational only. Not investment advice.
