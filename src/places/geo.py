# -*- coding: utf-8 -*-
"""Привязка подборки мест к координатам: по названию среди POI OSM, затем по адресу среди зданий."""
import json, re, sys, math
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from src import P
J = json.load(open(sys.argv[1]))
OUT = sys.argv[2]
def norm(s): return re.sub(r'[«»"\'.,№#]', ' ', (s or '').lower().replace('ё', 'е')).split()
def ns(s): return ' '.join(norm(s))
pois = [(p[0], p[1], p[2]) for p in J['p'] if p[2].get('name')]
# центры зданий
def dec(s, q):
    a = list(map(int, s.split(','))); x = y = 0; pts = []
    for i in range(0, len(a) - 1, 2): x += a[i]; y += a[i + 1]; pts.append((x / q, y / q))
    return pts
B = []
for b in J['b']:
    if not b[9] and b[8] < 0: continue
    pts = dec(b[0].split(';')[0], 2); xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    nm = J['bn'][b[8]] if b[8] >= 0 else None
    B.append(((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2, b[9], nm))
ABBR = [('улица', 'ул'), ('проспект', 'пр'), ('переулок', 'пер'), ('площадь', 'пл'), ('набережная', 'наб'), ('тракт', 'тракт')]
def addr_key(a):
    a = a.lower().replace('ё', 'е')
    for f, s in ABBR: a = a.replace(f, s)
    a = re.sub(r'\b(ул|пр|пер|пл|наб|пр-т|просп)\b\.?', ' ', a)
    a = a.replace('пр.', ' ').replace('пер.', ' ').replace('пл.', ' ').replace('ул.', ' ')
    m = re.search(r'([а-яa-z0-9\- ]+?)[, ]+(\d+[а-я]?(?:/\d+)?)', a)
    if not m: return None
    street = ' '.join(w for w in m.group(1).split() if w not in ('томск', 'стр', 'к'))
    return street.strip(), m.group(2).replace(' ', '')
def poi_addr(t):
    s = t.get('addr:street', ''); h = t.get('addr:housenumber', '')
    if not h: return ''
    s = re.sub(r'^(улица|проспект|переулок|площадь)\s+|\s+(улица|проспект|переулок|площадь)$', '', s)
    pre = {'улица': 'ул. ', 'проспект': 'пр. ', 'переулок': 'пер. ', 'площадь': 'пл. '}
    for k, v in pre.items():
        if k in t.get('addr:street', ''): return v + s + ', ' + h
    return s + ', ' + h
MANUAL = {'Площадь Ленина': (-500, 1400), 'Каменный мост': (-376, 1380), 'Набережная Томи': (-847, 1724), 'Улица Кузнецова': (-120, -830), 'Лютеранская церковь Святой Марии': (278, -675), 'Берёзовая роща': (632, 3306)}
res = []; miss = []
for p in P:
    q = ns(p['q']); want = addr_key(p['addr']) if p['addr'] != 'Томск' else None
    cands = []
    for x, y, t in pois:
        n = ns(t['name'])
        if q and (q in n or (len(n) > 3 and n in ns(p['name']))):
            score = 1
            if want:
                k = addr_key(poi_addr(t) or '')
                if k and k[1] == want[1] and k[0].split()[-1][:5] in want[0]: score = 3
            if p['cat'] == 'stay' and t.get('tourism') in ('hotel', 'hostel', 'guest_house'): score += 1
            if p['cat'] in ('food', 'bar') and t.get('amenity') in ('restaurant', 'cafe', 'bar', 'pub', 'fast_food', 'food_court'): score += 1
            if p['cat'] in ('food', 'bar') and not t.get('amenity'): score -= 1
            if n == ns(p['name']) or n == q: score += 1
            cands.append((score, x, y, t))
    hit = None
    if cands:
        cands.sort(key=lambda c: -c[0]); best = cands[0]
        # если несколько с одинаковым счётом и без адреса — берём ближайший к центру
        top = [c for c in cands if c[0] == best[0]]
        best = min(top, key=lambda c: math.hypot(c[1] + 400, c[2] - 500))
        if best[0] >= 1 and (len(top) == 1 or best[0] >= 2 or len(q) > 6):
            hit = dict(x=round(best[1]), y=round(best[2]), via='poi', osm=best[3], sc=best[0])
    if want and (not hit or hit['sc'] < 3):
        ah = None
        for loose in (0, 1):
            cs = []
            for x, y, a, nm in B:
                k = addr_key(a) if a else None
                if not (k and k[0] and want[0] and k[0].split()[0][:5] == want[0].split()[0][:5]): continue
                if k[1] == want[1] or (loose and re.match(r'\d+', k[1]).group() == re.match(r'\d+', want[1]).group()):
                    typ_ok = (('пр' in p['addr'].split(',')[0].split()[0]) == a.startswith('пр.')) if p['addr'][:3] in ('пр.', 'ул.') else True
                    cs.append((0 if typ_ok else 1, math.hypot(x + 400, y), x, y))
            if cs:
                cs.sort(); _, d, x, y = cs[0]; ah = dict(x=round(x), y=round(y), via='addr'); break
        if ah and hit and math.hypot(ah['x'] + 400, ah['y']) > 3500: ah = None
        if ah and (not hit or math.hypot(ah['x'] - hit['x'], ah['y'] - hit['y']) > 250): hit = ah
    if hit and hit['via'] == 'addr' and want and want[0].split()[0] in ('ленина', 'советская', 'кирова') and math.hypot(hit['x'] + 400, hit['y']) > 3500: hit = None
    if not hit and p['name'] in MANUAL: hit = dict(x=MANUAL[p['name']][0], y=MANUAL[p['name']][1], via='manual')
    if hit:
        r = dict(p); r.update(hit)
        o = hit.get('osm') or {}
        if r['addr'] == 'Томск' and poi_addr(o): r['addr'] = poi_addr(o)
        if not r.get('hours') and o.get('opening_hours'): r['hours'] = o['opening_hours']
        r['web'] = o.get('website') or o.get('contact:website') or ''
        r.pop('osm', None); r.pop('sc', None); res.append(r)
    else:
        miss.append(p['name'] + ' | ' + p['addr'])
VER = json.load(open(__file__.rsplit('/', 1)[0] + '/verified.json'))
for r in res:
    v = VER.get(r['name'])
    if v:
        r.update({k: v[k] for k in v if k != 'hours'}); r['hours'] = v.get('hours') or r.get('hours'); r['web'] = r.get('web') or v['src']
json.dump(res, open(OUT, 'w'), ensure_ascii=False, indent=0)
print('found', len(res), 'of', len(P)); print('MISS:', *miss, sep='\n  ')
