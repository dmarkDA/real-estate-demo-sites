// Run: DDF_CLIENT_ID=... DDF_CLIENT_SECRET=... node server/realtor-proxy.mjs  (no creds = demo mode)
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.env.PORT) || 3000;
const { DDF_CLIENT_ID, DDF_CLIENT_SECRET } = process.env;
const LIVE = Boolean(DDF_CLIENT_ID && DDF_CLIENT_SECRET);

const TOKEN_URL = process.env.DDF_TOKEN_URL || 'https://identity.crea.ca/connect/token';
const PROPERTY_URL = process.env.DDF_PROPERTY_URL || 'https://ddfapi.realtor.ca/odata/v1/Property';
const CACHE_MS = 60_000;

let token = null;
let tokenExpiresAt = 0;
const cache = new Map();

async function getToken() {
  if (token && Date.now() < tokenExpiresAt) return token;
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: DDF_CLIENT_ID,
      client_secret: DDF_CLIENT_SECRET,
      scope: 'DDFApi_Read',
    }),
  });
  if (!res.ok) throw new Error(`DDF token request failed (${res.status})`);
  const data = await res.json();
  token = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;
  return token;
}

const odataString = (s) => `'${s.replace(/'/g, "''")}'`;
const clampInt = (v, max) => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n > 0 ? Math.min(n, max) : 0;
};

function buildFilter(query) {
  const q = (query.get('q') || '').trim().slice(0, 80);
  const maxPrice = clampInt(query.get('maxPrice'), 1_000_000_000);
  const minBeds = clampInt(query.get('minBeds'), 20);
  const parts = [];
  if (q) parts.push(`contains(UnparsedAddress,${odataString(q)})`);
  if (maxPrice) parts.push(`ListPrice le ${maxPrice}`);
  if (minBeds) parts.push(`BedroomsTotal ge ${minBeds}`);
  return parts.join(' and ');
}

function normalizeType(raw = '') {
  const t = raw.toLowerCase();
  if (t.includes('condo') || t.includes('apartment')) return 'Condo';
  if (t.includes('town') || t.includes('row')) return 'Townhouse';
  return 'House';
}

function normalize(p) {
  const photo = Array.isArray(p.Media) ? p.Media.find((m) => m.MediaURL)?.MediaURL : undefined;
  return {
    id: p.ListingKey,
    mls: p.ListingId,
    title: p.UnparsedAddress,
    address: p.UnparsedAddress,
    city: p.City,
    type: normalizeType(p.PropertySubType || p.PropertyType),
    price: p.ListPrice,
    beds: p.BedroomsTotal,
    baths: p.BathroomsTotalInteger,
    sqft: p.LivingArea,
    img: photo,
    status: 'For Sale',
    desc: p.PublicRemarks || '',
    features: [],
  };
}

async function searchListings(query) {
  const params = new URLSearchParams({ $top: '24' });
  const filter = buildFilter(query);
  if (filter) params.set('$filter', filter);
  const key = params.toString();

  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.listings;

  const res = await fetch(`${PROPERTY_URL}?${params}`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
  if (!res.ok) throw new Error(`DDF property request failed (${res.status})`);
  const data = await res.json();
  const listings = (data.value || []).map(normalize);
  cache.set(key, { at: Date.now(), listings });
  return listings;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/listings') {
    if (!LIVE) return sendJson(res, 501, { error: 'DDF credentials not configured' });
    try {
      return sendJson(res, 200, { source: 'realtor.ca', listings: await searchListings(url.searchParams) });
    } catch (err) {
      console.error(err.message);
      return sendJson(res, 502, { error: 'Listing service unavailable' });
    }
  }

  const rel = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const file = resolve(join(ROOT, rel));
  const allowed = file.startsWith(ROOT + sep) && !file.startsWith(join(ROOT, 'server') + sep);
  if (!allowed || !MIME[extname(file)]) {
    res.writeHead(404);
    return res.end('Not found');
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}  (${LIVE ? 'live REALTOR.ca DDF' : 'demo mode — no DDF credentials'})`);
});
