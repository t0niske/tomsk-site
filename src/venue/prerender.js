/* Готовит страницы заведений: HTML основной части, описание, JSON-LD и мини-карту квартала.
   node prerender.js <venues.json> <assets/site.js> <tomsk-data.json> <pages.json> <SITE_URL>  → JSON в stdout */
const fs = require('fs');
const VENUE = require('./render.js').VENUE;
const [VJ, SJ, TJ, PJ, SITE] = process.argv.slice(2);
const V = JSON.parse(fs.readFileSync(VJ, 'utf8'));
const siteJs = fs.readFileSync(SJ, 'utf8');
const PHOTOS = JSON.parse(siteJs.match(/const PHOTOS=(\{.*?\});\r?\n/s)[1]);
const PAGES = JSON.parse(fs.readFileSync(PJ, 'utf8'));
const SL = Object.fromEntries(PAGES.map(p => [p.id, p.slug]));
const items = V.items.filter(v => !v.hidden).map(v => ({...v, pageSlug: SL[v.id] || null}));
const COLOR = {food:'#FFC9A6',bar:'#FFC9A6',culture:'#D9C8F0',church:'#D9C8F0',nature:'#C9F2D2',fun:'#FFC3D0',shop:'#F2DDC9',sight:'#B9E4FF',stay:'#B9E4FF'};
const ROOT = '../../';
const photosOf = v => (v.photos && v.photos.length ? v.photos.map(f => [f.src, f.credit || '', f.license || '', f.link || '']) : (PHOTOS[v.id] || PHOTOS[v.name] ? [PHOTOS[v.id] || PHOTOS[v.name]] : []));
const X = {root: ROOT, items, site: SITE, color: COLOR, photos: photosOf, photo: o => photosOf(o)[0] || null,
  url: u => /^(https?:|data:|\/)/.test(u) ? u : ROOT + u};

const eligible=items.filter(v=>v.pick||v.pageSlug),byId=new Map(items.map(v=>[v.id,v]));
const valid=v=>Number.isFinite(v.lat)&&Number.isFinite(v.lon);
const point=v=>VENUE.xy(v),distance=(a,b)=>{if(!valid(a)||!valid(b))return Infinity;const p=point(a),q=point(b);return Math.hypot(p[0]-q[0],p[1]-q[1])};
const placesGrid=new Map(),placesKey=(x,y)=>Math.floor(x/1200)+','+Math.floor(y/1200);
eligible.filter(valid).forEach(v=>{let [x,y]=point(v),k=placesKey(x,y);if(!placesGrid.has(k))placesGrid.set(k,[]);placesGrid.get(k).push(v)});
X.nearby=v=>{if(!valid(v))return[];let[x,y]=point(v),a=Math.floor(x/1200),b=Math.floor(y/1200),near=[];
  for(let i=a-1;i<=a+1;i++)for(let j=b-1;j<=b+1;j++)for(let o of placesGrid.get(i+','+j)||[]){if(o.id!==v.id){let d=distance(v,o);if(d<1200)near.push([o,d])}}
  return near.sort((a,b)=>a[1]-b[1]).slice(0,6)};
const groups={food:['food','bar'],bar:['bar','food'],culture:['culture'],church:['church','sight'],sight:['sight','church'],nature:['nature'],fun:['fun'],shop:['shop'],stay:['stay']};
const categoryItems=new Map();
for(let v of eligible){if(!categoryItems.has(v.cat))categoryItems.set(v.cat,[]);categoryItems.get(v.cat).push(v)}
X.similar=v=>{let best=[];for(let cat of groups[v.cat]||[v.cat])for(let o of categoryItems.get(cat)||[]){
  if(o.id===v.id)continue;let entry=[o,distance(v,o)],i=best.findIndex(x=>entry[1]<x[1]);if(i<0)i=best.length;
  if(i<4){best.splice(i,0,entry);if(best.length>4)best.pop()}}
  return best.map(x=>x[0])};

/* ---------- мини-карта квартала из данных OpenStreetMap (те же, что у большой карты) ---------- */
const D = JSON.parse(fs.readFileSync(TJ, 'utf8'));
function dec(s, q) { const a = s.split(','), out = []; let x = 0, y = 0; for (let i = 0; i < a.length; i += 2) { x += +a[i]; y += +a[i+1]; out.push([x/q, y/q]) } return out }
const bbox = pts => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const [x, y] of pts) { if (x < a) a = x; if (x > c) c = x; if (y < b) b = y; if (y > d) d = y } return [a, b, c, d] };
const B = D.b.map(b => { const r = b[0].split(';').map(s => dec(s, 2)); return {r, bb: bbox(r[0])} });
const RD = D.r.map(r => { const p = dec(r[1], 1); return {t: r[0], p, bb: bbox(p), name: r[2] >= 0 ? D.n[r[2]] : null} });
const AR = D.a.map(a => { const r = a[1].split(';').map(s => dec(s, 1)); return {k: a[0], r, bb: bbox(r[0])} });
const RW = {T:13,P:12,S:10,t:9,Q:8,R:8,r:7,u:7,l:6,p:6,c:5,s:4,f:2.4,x:2.4,k:2.4};
const GREEN = new Set(['park','grass','wood','scrub','square','allot','cemetery','wetland']);
function inPoly(x, y, poly) { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c } return c }
const geoIndexes=new Map();
function geoQuery(features,cx,cy){
  let ix=geoIndexes.get(features);if(!ix){ix={cells:new Map(),wide:[]};geoIndexes.set(features,ix);
    for(let f of features){let[a,b,c,d]=f.bb.map(x=>Math.floor(x/500));
      if((c-a+1)*(d-b+1)>400){ix.wide.push(f);continue}
      for(let x=a;x<=c;x++)for(let y=b;y<=d;y++){let k=x+','+y;if(!ix.cells.has(k))ix.cells.set(k,[]);ix.cells.get(k).push(f)}}}
  const found=new Set(ix.wide);
  for(let x=Math.floor((cx-300)/500);x<=Math.floor((cx+300)/500);x++)for(let y=Math.floor((cy-210)/500);y<=Math.floor((cy+210)/500);y++)for(let f of ix.cells.get(x+','+y)||[])found.add(f);
  return [...found];
}
const rawById = new Map(V.items.map(o => [o.id, o]));
// обрезка по прямоугольнику [xa, ya, xb, yb]: многоугольник — Сазерленд — Ходжмен, линия — по отрезкам (Лян — Барски)
function clipRing(ring, [xa, ya, xb, yb]) {
  const edges = [[p => p[0] >= xa, (p, q) => [xa, p[1] + (q[1]-p[1]) * (xa-p[0]) / (q[0]-p[0])]], [p => p[0] <= xb, (p, q) => [xb, p[1] + (q[1]-p[1]) * (xb-p[0]) / (q[0]-p[0])]],
                 [p => p[1] >= ya, (p, q) => [p[0] + (q[0]-p[0]) * (ya-p[1]) / (q[1]-p[1]), ya]], [p => p[1] <= yb, (p, q) => [p[0] + (q[0]-p[0]) * (yb-p[1]) / (q[1]-p[1]), yb]]];
  let out = ring;
  for (const [inside, cut] of edges) {
    const src = out; out = [];
    for (let i = 0; i < src.length; i++) { const p = src[i], q = src[(i + 1) % src.length];
      if (inside(q)) { if (!inside(p)) out.push(cut(p, q)); out.push(q) } else if (inside(p)) out.push(cut(p, q)) }
    if (!out.length) break;
  }
  return out;
}
function clipLine(pts, [xa, ya, xb, yb]) {
  const parts = []; let cur = null;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i-1], dx = pts[i][0] - px, dy = pts[i][1] - py; let t0 = 0, t1 = 1, ok = true;
    for (const [p, q] of [[-dx, px - xa], [dx, xb - px], [-dy, py - ya], [dy, yb - py]]) {
      if (p === 0) { if (q < 0) { ok = false; break } continue }
      const t = q / p; if (p < 0) { if (t > t1) { ok = false; break } if (t > t0) t0 = t } else { if (t < t0) { ok = false; break } if (t < t1) t1 = t }
    }
    if (!ok) { cur = null; continue }
    const a = [px + t0 * dx, py + t0 * dy], b = [px + t1 * dx, py + t1 * dy];
    if (!cur || t0 > 0) { cur = [a]; parts.push(cur) }
    cur.push(b); if (t1 < 1) cur = null;
  }
  return parts;
}
function miniMap(v) {
  if(!valid(v))return '';
  const [cx, cy] = VENUE.xy(v), W = 560, H = 380, x0 = cx - W/2, y1 = cy + H/2, x1 = cx + W/2, y0 = cy - H/2;
  const hit = bb => bb[2] > x0 - 20 && bb[0] < x1 + 20 && bb[3] > y0 - 20 && bb[1] < y1 + 20;
  const P = pts => 'M' + pts.map(([x, y]) => `${Math.round(x - x0)} ${Math.round(y1 - y)}`).join('L');
  const box = [x0 - 20, y0 - 20, x1 + 20, y1 + 20];
  let s = `<svg viewBox="0 0 ${W} ${H}" class="mm" role="img" aria-label="Карта квартала: ${v.name.replace(/"/g, '')}"><rect class="mm-land" width="${W}" height="${H}"/>`;
  let g = '', w = '';
  // большие площади (река, парки) обрезаем по кадру, иначе в каждую страницу попадает контур всей Томи
  geoQuery(AR,cx,cy).forEach(a => { if (!hit(a.bb)) return; const d = a.r.map(r => clipRing(r, box)).filter(r => r.length > 2).map(P).join('Z'); if (!d) return;
    if (a.k === 'water') w += d + 'Z'; else if (GREEN.has(a.k)) g += d + 'Z' });
  if (g) s += `<path class="mm-green" d="${g}"/>`; if (w) s += `<path class="mm-water" d="${w}"/>`;
  const byW = {}, wl = [];
  geoQuery(RD,cx,cy).forEach(r => { if (!hit(r.bb)) return; const parts = clipLine(r.p, box).map(P); if (!parts.length) return;
    if (/^w/.test(r.t)) { wl.push(...parts); return } if ('fxk'.includes(r.t)) return; const k = RW[r.t] || 4; (byW[k] = byW[k] || []).push(...parts) });
  if (wl.length) s += `<path class="mm-river" d="${wl.join('')}"/>`;
  const ws = Object.keys(byW).map(Number).sort((a, b) => a - b);
  ws.forEach(k => s += `<path class="mm-casing" stroke-width="${k + 2.5}" d="${byW[k].join('')}"/>`);
  ws.forEach(k => s += `<path class="mm-road" stroke-width="${k}" d="${byW[k].join('')}"/>`);
  let bl = '', hl = '', best = null, bd = 30;
  geoQuery(B,cx,cy).forEach(b => { if (!hit(b.bb) || (b.bb[2]-b.bb[0])*(b.bb[3]-b.bb[1]) < 40) return; const d = b.r.map(P).join('Z') + 'Z';
    const inside = inPoly(cx, cy, b.r[0]); const c = [(b.bb[0]+b.bb[2])/2, (b.bb[1]+b.bb[3])/2], dd = Math.hypot(c[0]-cx, c[1]-cy);
    if (inside) { best = {d, dd: -1} } else if (!best || best.dd > 0) { if (dd < bd && (!best || dd < best.dd)) best = {d, dd} }
    bl += d });
  s += `<path class="mm-bld" d="${bl}"/>`;
  if (best) s += `<path class="mm-hl" d="${best.d}"/>`;
  // подписи улиц: самые длинные именованные улицы в кадре
  const named = {};
  geoQuery(RD,cx,cy).forEach(r => { if (!r.name || !hit(r.bb) || !(RW[r.t] >= 6)) return; const pts = r.p.filter(([x, y]) => x > x0 + 10 && x < x1 - 10 && y > y0 + 10 && y < y1 - 10); if (pts.length < 2) return;
    let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]);
    if (!named[r.name] || named[r.name].len < len) named[r.name] = {len, pts} });
  Object.entries(named).sort((a, b) => b[1].len - a[1].len).slice(0, 3).forEach(([n, o], i) => {
    if (o.len < 120) return; let pts = o.pts; if (pts[0][0] > pts[pts.length-1][0]) pts = pts.slice().reverse();
    s += `<path id="mm${v.id}${i}" d="${P(pts)}" fill="none"/><text class="mm-lbl"><textPath href="#mm${v.id}${i}" startOffset="50%" text-anchor="middle">${n.replace(/^улица /, 'ул. ').replace(/^проспект /, 'пр. ').replace(/ улица$/, '')}</textPath></text>` });
  s += `<g class="mm-pin" transform="translate(${W/2} ${H/2})"><path d="M0 0c-12-14-18-22-18-30a18 18 0 0 1 36 0c0 8-6 16-18 30z"/><circle cy="-30" r="6.5"/></g></svg>`;
  return s;
}


for (const {id, slug} of PAGES) {
  const v = byId.get(id); if (!v) { console.error('нет места', id); continue }
  const url = `${SITE}mesto/${slug}/`, mapSvg = miniMap(v);
  const page = {slug, name: v.name, title: VENUE.pageTitle(v, items), desc: VENUE.metaDesc(v, items), body: VENUE.render(v, {...X, mapSvg}),
    jsonld: VENUE.jsonld(v, X, url), image: (photosOf(v)[0] || [])[0] || '', hours: v.hours || '', rel: VENUE.related(v, X), raw: rawById.get(id)};
  fs.writeSync(1,JSON.stringify({id,page})+'\n');
}
