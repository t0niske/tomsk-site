# -*- coding: utf-8 -*-
"""Собирает tomsk-data.json для всего города:
центр (старый экстент) берётся из прежнего tomsk-data.json без изменений,
всё, что снаружи, — из сырого выгруза Overpass (raw: [[id,tags,geom],...])."""
import json, re, sys, math
OLD, RAW, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
J = json.load(open(OLD)); R = json.load(open(RAW))
EXT0 = J['ext']  # центр
def inside0(x, y): return EXT0[0] <= x <= EXT0[2] and EXT0[1] <= y <= EXT0[3]

# ---------- рельеф ----------
AL = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
def dec_elev(s):
    o = json.loads(s); src = o['s']; z = []; i = 0; cur = 0
    while i < len(src):
        c = src[i]
        if c == '!':
            j = src.index('!', i + 1); cur += int(src[i + 1:j]); z.append(cur); i = j + 1
        else:
            cur += AL.index(c) - 30; z.append(cur); i += 1
    n = o['nx'] * o['ny']
    assert len(z) == n, (len(z), n)
    return dict(nx=o['nx'], ny=o['ny'], step=o['step'], x0=o['x0'], y0=o['y0'], z=z)
if R.get('e2'):
    E2 = dec_elev(R['e2'])
    # проверка: совпадает ли старая сетка с декодом
    if R.get('e'):
        E1 = dec_elev(R['e']); assert E1['z'] == J['e']['z'], 'decode mismatch'
    J['e2'] = E2

# ---------- утилиты ----------
def dp(pts, tol):
    if len(pts) < 3: return pts
    keep = [False] * len(pts); keep[0] = keep[-1] = True; st = [(0, len(pts) - 1)]
    while st:
        a, b = st.pop(); ax, ay = pts[a]; bx, by = pts[b]; dx, dy = bx - ax, by - ay; L = math.hypot(dx, dy) or 1e-9
        mi, md = -1, tol
        for k in range(a + 1, b):
            px, py = pts[k]; d = abs(dy * (px - ax) - dx * (py - ay)) / L
            if d > md: md, mi = d, k
        if mi >= 0: keep[mi] = True; st += [(a, mi), (mi, b)]
    return [p for p, k in zip(pts, keep) if k]
def dpring(pts, tol):
    if len(pts) < 5: return pts
    if pts[0] == pts[-1]: pts = pts[:-1]
    far = max(range(len(pts)), key=lambda k: (pts[k][0] - pts[0][0]) ** 2 + (pts[k][1] - pts[0][1]) ** 2)
    a = dp(pts[:far + 1], tol); b = dp(pts[far:] + [pts[0]], tol)
    r = a + b[1:-1]
    return r if len(r) >= 3 else pts
def pairs(f): return [(f[i], f[i + 1]) for i in range(0, len(f) - 1, 2)]
def enc(pts, q):
    o = []; px = py = 0
    for x, y in pts:
        X, Y = round(x * q), round(y * q); o += [X - px, Y - py]; px, py = X, Y
    return ','.join(map(str, o))
def cen(pts):
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]; return (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
def area(pts):
    s = 0
    for i in range(len(pts)): x1, y1 = pts[i]; x2, y2 = pts[(i + 1) % len(pts)]; s += x1 * y2 - x2 * y1
    return abs(s) / 2
def assemble(segs):
    segs = [list(s) for s in segs if len(s) > 1]; rings = []
    while segs:
        cur = segs.pop(0); g = 0
        while cur[0] != cur[-1] and g < 5000:
            g += 1; e = cur[-1]; f = -1; rev = False
            for i, s in enumerate(segs):
                if s[0] == e: f = i; break
                if s[-1] == e: f = i; rev = True; break
            if f < 0: break
            s = segs.pop(f); s = s[::-1] if rev else s; cur += s[1:]
        rings.append(cur)
    return rings
def num(v):
    if v is None: return None
    m = re.match(r'\s*([0-9]+(?:[.,][0-9]+)?)', str(v)); return float(m.group(1).replace(',', '.')) if m else None

NAMES = {n: i for i, n in enumerate(J['n'])}
def nidx(n):
    if not n: return -1
    if n not in NAMES: NAMES[n] = len(J['n']); J['n'].append(n)
    return NAMES[n]
ROOFS = {r: i for i, r in enumerate(J['roofs'])}
def short_street(s):
    if not s: return ''
    for a, b in [('улица', 'ул.'), ('проспект', 'пр.'), ('переулок', 'пер.'), ('площадь', 'пл.'), ('бульвар', 'б-р'), ('набережная', 'наб.'), ('шоссе', 'ш.')]:
        s = re.sub(r'(^|\s)' + a + r'(\s|$)', r'\1' + b + r'\2', s)
    return s.strip()
COLN = {'white': 'f4f2ee', 'red': 'b04a3a', 'brown': '8a5a3c', 'yellow': 'e8cf86', 'grey': '9a9a9a', 'gray': '9a9a9a', 'blue': '6c90b8',
        'green': '6f9a6a', 'beige': 'e2d3b4', 'orange': 'd8884a', 'pink': 'e3b3b0', 'black': '333333', 'maroon': '7a2e2a', 'silver': 'c6c9cc', 'lightblue': '9cc4de'}
def colr(v):
    if not v: return ''
    v = v.strip().lower()
    if re.fullmatch(r'#?[0-9a-f]{6}', v): return v.lstrip('#')
    if re.fullmatch(r'#[0-9a-f]{3}', v): return ''.join(c * 2 for c in v[1:])
    return COLN.get(v, '')
TY = {}
for k in 'apartments dormitory residential terrace'.split(): TY[k] = 'a'
for k in 'house detached semidetached_house bungalow cabin farm'.split(): TY[k] = 'h'
for k in 'garage garages shed carport hut barn'.split(): TY[k] = 'g'
TY['roof'] = 'r'
for k in 'industrial warehouse service manufacture hangar greenhouse transformer_tower storage_tank boathouse'.split(): TY[k] = 'i'
for k in 'university school college kindergarten hospital public civic government train_station sports_hall stadium sports_centre fire_station'.split(): TY[k] = 'u'
for k in 'office commercial retail supermarket hotel kiosk'.split(): TY[k] = 'o'
for k in 'church cathedral chapel mosque temple religious synagogue monastery'.split(): TY[k] = 'c'
for k in 'ruins construction collapsed abandoned'.split(): TY[k] = 'x'
MAT = {'wood': 'w', 'timber_framing': 'w', 'log': 'w', 'brick': 'b', 'plaster': 'p', 'concrete': 'c', 'reinforced_concrete': 'c', 'panel': 'c',
       'metal': 'm', 'steel': 'm', 'glass': 'g', 'stone': 'b'}
HW = {'motorway': 'M', 'motorway_link': 'M', 'trunk': 'T', 'trunk_link': 'T', 'primary': 'P', 'primary_link': 'P', 'secondary': 'S', 'secondary_link': 'S',
      'tertiary': 't', 'tertiary_link': 't', 'residential': 'r', 'unclassified': 'u', 'living_street': 'l', 'service': 's', 'pedestrian': 'p',
      'footway': 'f', 'cycleway': 'c', 'path': 'x', 'steps': 'x', 'bridleway': 'x', 'track': 'k', 'road': 'r'}
KOF = None

def kind_of(t):
    if not t: return None
    if t.get('natural') == 'water' or t.get('waterway') == 'riverbank' or t.get('water'): return 'water'
    if t.get('natural') == 'wood' or t.get('landuse') == 'forest': return 'wood'
    if t.get('natural') == 'scrub': return 'scrub'
    if t.get('natural') == 'wetland': return 'wetland'
    if t.get('natural') in ('sand', 'beach'): return 'sand'
    if t.get('leisure') in ('park', 'garden'): return 'park'
    if t.get('landuse') in ('grass', 'meadow', 'village_green', 'recreation_ground', 'orchard') or t.get('natural') == 'grassland': return 'grass'
    if t.get('landuse') == 'cemetery': return 'cemetery'
    if t.get('landuse') == 'allotments': return 'allot'
    if t.get('landuse') == 'religious': return 'religious'
    if t.get('leisure') in ('pitch', 'stadium', 'track', 'playground'): return 'sport'
    if t.get('amenity') == 'parking': return 'parking'
    if t.get('area:highway') or t.get('place') == 'square' or (t.get('highway') == 'pedestrian' and t.get('area') == 'yes'): return 'square'
    if t.get('man_made') == 'bridge': return 'bridge'
    if t.get('man_made') == 'pier': return 'pier'
    return None

# ---------- разбор ----------
POIK = ('amenity', 'tourism', 'shop', 'leisure', 'historic', 'craft')
KEEP_P = ['name', 'amenity', 'tourism', 'shop', 'leisure', 'historic', 'addr:street', 'addr:housenumber', 'opening_hours', 'cuisine', 'website', 'contact:website',
          'memorial', 'artwork_type', 'outdoor_seating', 'start_date', 'description', 'denomination', 'fee', 'diet:vegetarian', 'wikipedia', 'museum', 'building', 'wheelchair', 'internet_access']
nb = []; parts = []; roads = []; areas = []; pois = []; bn = list(J['bn'])
LIM = 9000  # дальше от центра (м) упрощаем сильнее
for id_, t, g in R['els']:
    t = t or {}
    typ = id_[0]
    if typ == 'n':
        if t.get('name') and any(k in t for k in POIK) and not inside0(*g):
            pois.append([g[0], g[1], {k: t[k] for k in KEEP_P if k in t}])
        continue
    if typ == 'w':
        pts = pairs(g)
        if len(pts) < 2: continue
        rings = [pts]; closed = pts[0] == pts[-1]
    else:
        segs = [pairs(f) for role, f in g if role in ('outer', '')]
        rings = [r for r in assemble(segs) if len(r) > 3 and r[0] == r[-1]]
        if not rings: continue
        closed = True; pts = rings[0]
    cx, cy = cen(pts)
    if inside0(cx, cy): continue
    b = t.get('building'); bp = t.get('building:part')
    if (b and b != 'no') or bp:
        if not closed: continue
        rr = [dpring(r, .5) for r in rings]
        if area(rr[0]) < 6: continue
        lv = num(t.get('building:levels')); h = num(t.get('height'))
        mlv = num(t.get('building:min_level')); mh = num(t.get('min_height'))
        ty = 'p' if bp and not b else TY.get(b, 'y')
        ar = area(rr[0])
        if h is None:
            if lv: h = lv * 3.1 + (num(t.get('roof:levels')) or 0) * 2
            else: h = {'g': 3.1, 'h': 3.1, 'r': 3.1, 'x': 3.1, 'i': 6.2, 'u': 9.3, 'o': 6.2, 'c': 6.2, 'a': 6.2}.get(ty, 6.2 if ar > 160 else 3.1)
        if mh is None: mh = (mlv or 0) * 3.1
        mat = MAT.get((t.get('building:material') or '').lower(), '-')
        roof = ROOFS.get(t.get('roof:shape'), -1) if t.get('roof:shape') in ROOFS else -1
        rh = num(t.get('roof:height'))
        nm = -1
        if t.get('name'):
            nm = len(bn); bn.append([t.get('name'), t.get('addr:street', ''), t.get('addr:housenumber', ''), t.get('historic', ''), t.get('amenity') or b or '', t.get('wikipedia', ''), t.get('architect', ''), t.get('start_date', ''), t.get('denomination', '')])
        addr = (short_street(t.get('addr:street')) + ' ' + t.get('addr:housenumber', '')).strip() if t.get('addr:housenumber') else ''
        rec = [';'.join(enc(r[:-1] if r[0] == r[-1] else r, 2) for r in rr), round(h * 10), round(mh * 10), ty + mat + ('P' if ty == 'p' else '-'), roof, round(rh * 10) if rh else -1,
               colr(t.get('building:colour')), colr(t.get('roof:colour')), nm, addr]
        (parts if ty == 'p' else nb).append((rec, rr[0]))
        if t.get('name') and any(k in t for k in POIK):
            pois.append([round(cx), round(cy), {k: t[k] for k in KEEP_P if k in t}])
        continue
    hw = t.get('highway'); rw = t.get('railway'); ww = t.get('waterway')
    k = kind_of(t)
    if k and closed and (typ == 'r' or t.get('area') != 'no') and not (hw and k != 'square'):
        tol = 1.5 if k not in ('water',) else 1
        rr = [dpring(r, tol) for r in rings]
        if area(rr[0]) < 30: continue
        areas.append([k, ';'.join(enc(r[:-1] if r[0] == r[-1] else r, 1) for r in rr), nidx(t.get('name'))])
        if t.get('name') and any(kk in t for kk in POIK) and k in ('park', 'sport'):
            pois.append([round(cx), round(cy), {kk: t[kk] for kk in KEEP_P if kk in t}])
        continue
    code = None
    if hw in HW and t.get('area') != 'yes': code = HW[hw]
    elif rw in ('rail', 'narrow_gauge', 'light_rail'): code = 'Q'
    elif rw == 'tram': code = 'R'
    elif ww in ('stream', 'canal'): code = 'ws'
    elif ww == 'river': code = 'wr'
    elif ww in ('ditch', 'drain'): code = 'wd'
    if code and typ == 'w':
        p = dp(pts, .8 if code in 'MTPSt' else 1.2)
        fl = (1 if t.get('bridge') and t.get('bridge') != 'no' else 0) | (2 if t.get('tunnel') and t.get('tunnel') != 'no' else 0)
        lay = int(num(t.get('layer')) or 0) if re.fullmatch(r'-?\d+', t.get('layer', '') or '') else 0
        roads.append([code, enc(p, 1), nidx(t.get('name')), fl, lay, int(num(t.get('lanes')) or 0)])

# флаг H: у здания есть части внутри
def pip(x, y, poly):
    c = False; n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]; x2, y2 = poly[(i + 1) % n]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1 + 1e-12) + x1: c = not c
    return c
if parts:
    grid = {}
    for i, (rec, r) in enumerate(nb):
        x0 = min(p[0] for p in r); x1 = max(p[0] for p in r); y0 = min(p[1] for p in r); y1 = max(p[1] for p in r)
        for gx in range(int(x0 // 200), int(x1 // 200) + 1):
            for gy in range(int(y0 // 200), int(y1 // 200) + 1): grid.setdefault((gx, gy), []).append(i)
    for rec, r in parts:
        cx, cy = cen(r)
        for i in grid.get((int(cx // 200), int(cy // 200)), []):
            if pip(cx, cy, nb[i][1]):
                f = nb[i][0][3]; nb[i][0][3] = f[:2] + 'H'; break

J['b'] += [r for r, _ in nb] + [r for r, _ in parts]
J['bn'] = bn; J['r'] += roads; J['a'] += areas; J['p'] += pois
# экстент — по всем данным
xs = []; ys = []
for e in R['els']:
    if e[0][0] == 'n': continue
    g = e[2]
    if e[0][0] == 'w':
        xs += g[0::2]; ys += g[1::2]
xs.sort(); ys.sort(); k = len(xs) // 500
J['ext'] = [-7213, -8964, 9432, 9966]
J['ext0'] = EXT0
J['date'] = R.get('date', J['date'])
s = json.dumps(J, ensure_ascii=False, separators=(',', ':'))
open(OUT, 'w').write(s)
print('buildings', len(J['b']), '+', len(nb), 'parts', len(parts), 'roads +', len(roads), 'areas +', len(areas), 'pois +', len(pois), 'ext', J['ext'], 'MB', round(len(s.encode()) / 1e6, 1))
