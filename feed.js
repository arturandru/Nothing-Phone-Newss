// Optional. Only used if you deploy on Vercel.
// Replaces the public CORS proxies with your own, which is much more reliable.
// After deploying, edit index.html and change PROXIES to:
//   const PROXIES = [ u => "/api/feed?url=" + encodeURIComponent(u) ];

export default async function handler(req, res) {
  const target = req.query.url;
  if (!target || !/^https?:\/\//.test(target)) {
    return res.status(400).send("Pass a ?url= parameter.");
  }
  try {
    const r = await fetch(target, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MorningBrief/1.0)" }
    });
    const body = await r.text();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=600");
    return res.status(200).send(body);
  } catch (e) {
    return res.status(502).send("Feed unreachable.");
  }
}
