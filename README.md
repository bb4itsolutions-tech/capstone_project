# Seismic.Live — Global Earthquake Analytics Dashboard

A live analytics dashboard for real-time earthquake activity worldwide:
event counts, magnitude/severity trends, a live-updating magnitude gauge, a
severity breakdown, and the full recent-events table — refreshed on a timer,
exportable to CSV.

Built from a Node.js API (data-fetching + analytics) and a React + TypeScript
+ Recharts frontend.

## Why this data source

This project originally targeted NSE (India) option chain data, ported from
a reference desktop Tkinter app. NSE's API sits behind Akamai bot-detection
that intermittently blocks even correctly-authenticated requests — inconsistent
enough (works, then blocks, then works again) that it wasn't a reliable
foundation to build and demo a capstone project against.

We switched to the **USGS Earthquake Hazards Program** live feed instead:
a public, static, cache-friendly GeoJSON API with `Access-Control-Allow-Origin: *`
on every endpoint, no API key, no cookies, and no bot-fingerprint gating —
built specifically for exactly this kind of polling. It trades "financial
options chain" for "global seismic activity," but keeps the same shape of
problem: live-updating events, magnitude/severity analytics, trend charts,
and a filterable table — which is what Option B of the capstone actually
asks for.

## Project structure

```
nse-analytics-dashboard/
├── backend/            Node.js + Express API (USGS proxy + analytics engine)
│   └── src/
│       ├── server.js       Express app entry point
│       ├── usgsClient.js   Feed fetching, caching, input whitelisting
│       ├── analytics.js    Summary stats / severity / time-bucketed trend
│       └── routes/quakes.js
└── frontend/           React + TypeScript + Vite + Recharts
    └── src/
        ├── App.tsx
        ├── api.ts
        ├── types.ts
        ├── severity.ts      Shared magnitude → severity classification
        ├── theme.css        Design tokens
        ├── components/
        └── hooks/useQuakeFeed.ts
```

## Running locally

Requires Node.js 18+.

### Option A — one command for both (recommended)

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm install       # installs both workspaces from the root
npm run dev       # starts backend on :8787 and frontend on :5173 together
```

### Option B — two separate terminals

```bash
# Terminal 1 — backend
cd backend
cp .env.example .env
npm install
npm run dev          # http://localhost:8787

# Terminal 2 — frontend
cd frontend
cp .env.example .env
npm install
npm run dev           # http://localhost:5173
```

**The backend must stay running the whole time you use the app** — it's a
live proxy every request goes through, not a one-time setup step.

Open http://localhost:5173. Pick a time window (past hour/day/week) and a
minimum magnitude, then press **Start**.

## Environment variables

**backend/.env**
| Variable | Purpose |
|---|---|
| `PORT` | Port the API listens on (default `8787`) |
| `CORS_ORIGIN` | Comma-separated list of allowed frontend origins |
| `CACHE_TTL_MS` | How long a fetched USGS feed is cached before re-fetching (default 30s — USGS feeds themselves only update ~once/minute, so this is just being a polite consumer) |
| `USGS_TIMEOUT_MS` | Per-request timeout before giving up (default 8000ms) |

**frontend/.env**
| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | URL of the deployed backend API |

## Deployment

- **Backend → Railway (or Render/Fly.io):** point it at `backend/`, set
  `CORS_ORIGIN` to your deployed frontend URL, deploy.
- **Frontend → Vercel (or Netlify):** point it at `frontend/`, set
  `VITE_API_BASE_URL` to your deployed backend URL, deploy.

Because USGS doesn't block cloud/datacenter IPs (unlike NSE), this is a much
safer bet to deploy on a free-tier PaaS without hitting the same class of
issue we ran into before.

## API reference

### `GET /api/health`
Liveness check. `200 { ok: true, time }`.

### `GET /api/quakes?period=day&minMagnitude=2.5`
Returns the analyzed earthquake feed for one refresh cycle.

| Query param | Required | Values |
|---|---|---|
| `period` | no (default `day`) | `hour`, `day`, `week` |
| `minMagnitude` | no (default `all`) | `all`, `1.0`, `2.5`, `4.5`, `significant` |

`200`
```json
{
  "fetchedAt": "2026-07-20T10:53:22.000Z",
  "feedGeneratedAt": 1784544802000,
  "period": "day",
  "minMagnitude": "2.5",
  "analytics": {
    "count": 42,
    "strongest": { "id": "us001", "magnitude": 5.8, "place": "...", "...": "..." },
    "averageMagnitude": 3.4,
    "averageDepth": 28.7,
    "tsunamiCount": 1,
    "significantCount": 2,
    "severity": { "minor": 30, "moderate": 10, "strong": 2 },
    "rows": [ { "id": "...", "time": 1784544802000, "place": "...", "magnitude": 4.1, "...": "..." } ]
  },
  "trend": [ { "time": 1784541600000, "label": "10:00 AM", "count": 3, "avgMagnitude": 3.1, "maxMagnitude": 4.2 } ]
}
```
`400` invalid `period`/`minMagnitude` · `502` USGS fetch/network failed

Error responses share the shape `{ "error": "human-readable message" }`. The
frontend never shows raw error text to end users — it shows a plain-language
banner with a retry button instead.

## Analytics methodology

- **Severity bands:** Minor `< M4`, Moderate `M4–6`, Strong `M6+` — a
  simplified, display-friendly banding, not an official USGS classification.
- **Significant events:** USGS's own `sig` (significance) score `≥ 600`,
  which blends magnitude, felt reports, and PAGER loss estimates — a
  different signal from magnitude alone.
- **Trend buckets:** grouped into 5-minute buckets for the "past hour" view,
  60-minute buckets for "past day," and 6-hour buckets for "past week," so
  the chart stays readable regardless of window size.
- **Tsunami flag:** USGS sets this when an event meets regional
  tsunami-warning-center notification criteria (typically M≥7.0, shallow,
  offshore) — it is not a tsunami forecast or confirmation. We surface the
  flag as-is; do not treat it as authoritative tsunami information (that
  comes from NOAA/PTWC/NTWC).

## Known limitations / next steps

- No persistent database — each refresh reflects USGS's current feed window;
  nothing is stored between sessions. Use **Export CSV** before closing the
  tab if you want to keep a snapshot.
- No authentication — fine for a personal/demo tool.
- Single in-memory feed cache per backend instance — if scaled horizontally,
  each instance caches independently (harmless, just slightly less efficient).
