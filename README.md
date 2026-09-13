# Morning Brief

A personal finance-news brief that runs as a home-screen app on Android.
No build step, no backend, no API keys. All learning happens on the phone.

## Get it on the Nothing 3a

**Option A — GitHub Pages (5 minutes, free forever)**

1. Make a new public repo, e.g. `morning-brief`.
2. Upload `index.html`, `manifest.webmanifest`, `sw.js` and the three PNGs into the root.
3. Settings → Pages → Source: `main` branch, `/ (root)`. Save.
4. Wait ~1 minute, open `https://<you>.github.io/morning-brief/` in Chrome on the phone.
5. Chrome menu → **Add to Home screen**. It installs as a real app: own icon, no address bar.

The `api/` folder is not used on GitHub Pages — ignore it.

**Option B — Vercel (better feed reliability)**

1. `npm i -g vercel`, then `vercel` in this folder. Accept the defaults.
2. Open `index.html` and replace the `PROXIES` array with:
   ```js
   const PROXIES = [ u => "/api/feed?url=" + encodeURIComponent(u) ];
   ```
3. `vercel --prod`. Add to home screen the same way.

This routes feeds through your own serverless function instead of shared public
proxies, which are free but occasionally rate-limit or go down.

## How the ranking works

Each story is matched against a keyword dictionary and gets one or more tags
(`central banks`, `spain`, `bonds`, …). Every tag has a score, starting at zero.

- **More like this** → +1 to each of that story's tags, +0.5 to the source
- **Less** → −1 and −0.5

Tomorrow's order is `sum of tag scores + source score + freshness`. Freshness is
weighted at 2.5 points and decays over 30 hours, so a brand-new story can still
beat a well-liked stale one.

Two low-scoring stories are always injected at random. Without that, a week of
voting collapses the feed into four headlines about the ECB and nothing else.

Open the drawer at the bottom to see the live scores and reset them.

## Editing feeds

Feed URLs change and sometimes die without warning. The drawer has a text box —
one URL per line, Save, and it refetches. Anything that returns RSS or Atom works.

Worth adding if you want more: `https://www.ft.com/rss/home`,
`https://www.bde.es/f/webbde/GAP/Secciones/SalaPrensa/rss_notas_informativas.xml`,
`https://ec.europa.eu/commission/presscorner/api/rss?language=en`.

## The 7am notification

Not included, and worth being straight about why: a PWA can't wake itself up on a
schedule. Android kills it when it's closed. Real timed notifications need a server
pushing to the phone.

Two ways to get the morning habit anyway:

- **Free, works today** — long-press the home screen icon, or set a plain Android
  alarm/routine at 07:00 that opens the app. Same effect, zero infrastructure.
- **Proper push** — a Vercel cron job at 07:00 plus the Web Push API and VAPID keys.
  Maybe 80 lines. Worth doing once the ranking feels right, not before.

## Offline

The service worker caches the app shell, and the last brief is kept for six hours,
so opening it underground shows yesterday's stories instead of a blank screen.
Feed requests themselves are never cached.
