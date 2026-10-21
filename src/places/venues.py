# -*- coding: utf-8 -*-
"""Единая база заведений data/venues.json: подборка редакции + все места из OpenStreetMap + фото.
Координаты храним в градусах (lat/lon), сайт и карта сами переводят их в свои метры."""
import json, re, sys, math, hashlib, datetime
D = sys.argv[1]; OUT = sys.argv[2]
LON0, LAT0, KX, KY = 84.957, 56.4755, 61646, 111351
ll = lambda x, y: (round(LAT0 + y / KY, 6), round(LON0 + x / KX, 6))
PK = json.load(open(D + '/places/places.json'))
CAT = json.load(open(D + '/places/catalog.json'))
PH = json.load(open(D + '/places/photos.json'))
norm = lambda s: re.sub(r'[^0-9a-zа-я]', '', (s or '').lower().replace('ё', 'е'))

def photo(key):
    f = PH.get(key)
    return [{'src': f[0], 'credit': f[1], 'license': f[2], 'link': f[3]}] if f else []

items = []
# 1) главные места первой версии (с их текстами) — «на главной»
H = open(D + '/tomsk.pre-places.html').read()
m = re.search(r'const PLACES = \[\n(.*?)\n\];', H, re.S)
FEAT_XY = {'nab': (-847, 1724), 'shatr': (486, -634), 'kraev': (-381, 115), 'bot': (-627, -1010), 'lager': (-351, -2440), 'roshcha': (-585, -671),
           'dragon': (559, -359), 'art': (-596, 796), 'chekhov': (-741, 1098), 'gorsad': (-107, -237)}
MAINCAT = {'nature': 'nature', 'unusual': 'sight', 'culture': 'culture', 'fun': 'fun'}
for l in m.group(1).split('\n'):
    if 'demo:true' in l or not l.strip(): continue
    g = lambda k: (re.search(k + r":'((?:[^'\\]|\\.)*)'", l) or [None, ''])[1].replace("\\'", "'")
    pid = g('id'); x, y = FEAT_XY[pid]; lat, lon = ll(x, y)
    tags = re.findall(r"'([^']*)'", re.search(r'tags:\[([^\]]*)\]', l).group(1))
    price = re.search(r'price:(\d+)', l); mins = re.search(r'mins:(\d+)', l)
    moods = (['kids'] if 'kids:true' in l else []) + (['date'] if 'rom:true' in l else []) + (['rain'] if 'indoor:true' in l else [])
    if price and price.group(1) == '0': moods.append('free')
    items.append(dict(id=pid, name=g('name'), cat=MAINCAT.get(g('cat'), 'sight'), kind=tags[0] if tags else '', addr=g('addr'), lat=lat, lon=lon,
                      hours='', prices='', price=int(price.group(1)) if price else None, mins=int(mins.group(1)) if mins else 60, phone='', web='',
                      why='', desc=g('desc'), moods=moods, cuisine='', pick=True, feat=True, hidden=False, scene=g('scene'), tags=tags,
                      photos=photo(pid), checked='', src='', origin='editor'))
# 2) подборка редакции
for i, p in enumerate(PK):
    if any(norm(it['name'])[:10] == norm(p['name'])[:10] for it in items): continue
    lat, lon = ll(p['x'], p['y'])
    pr = None
    if p.get('price'):
        mm = re.search(r'(\d[\d ]*)', p['price']); pr = 0 if 'Бесплатно' in p['price'] else (int(mm.group(1).replace(' ', '')) if mm else None)
    items.append(dict(id='p%d' % i, name=p['name'], cat=p['cat'], kind=p['kind'], addr=p['addr'] if p['addr'] != 'Томск' else '', lat=lat, lon=lon,
                      hours=p.get('hours') or '', prices=p.get('prices', ''), price=pr, mins=None, phone=p.get('phone', ''), web=p.get('web', ''),
                      why=p['why'], desc=p['desc'], moods=p['moods'], cuisine='', pick=True, feat=False, hidden=False, photos=photo(p['name']),
                      checked=p.get('checked', ''), src=p.get('src', ''), origin='editor'))
# 3) все заведения из OpenStreetMap; совпадения с подборкой — дополняем
def near(a, lat, lon, r=70):
    return math.hypot((a['lat'] - lat) * KY, (a['lon'] - lon) * KX) < r
n_osm = 0
for v in CAT:
    lat, lon = ll(v['x'], v['y'])
    dup = next((it for it in items if near(it, lat, lon) and (norm(it['name'])[:6] == norm(v['n'])[:6] or norm(v['n'])[:6] in norm(it['name']))), None)
    if dup:
        for a, b in (('hours', 'h'), ('phone', 'ph'), ('web', 'w'), ('cuisine', 'cu')):
            if not dup.get(a) and v.get(b): dup[a] = v[b]
        if not dup['web'] and v.get('vk'): dup['web'] = v['vk']
        if not dup['addr'] and v['a']: dup['addr'] = v['a']
        continue
    oid = 'o' + hashlib.md5((v['n'] + str(v['x']) + str(v['y'])).encode()).hexdigest()[:8]
    items.append(dict(id=oid, name=v['n'], cat=v['c'], kind=v['k'], addr=v['a'], lat=lat, lon=lon, hours=v['h'], prices='', price=None, mins=None,
                      phone=v['ph'], web=v['w'] or v.get('vk', ''), why='', desc='', moods=[], cuisine=v['cu'], pick=False, feat=False, hidden=False,
                      photos=[], checked='', src='', origin='osm'))
    n_osm += 1
items = [{k: v for k, v in it.items() if not (v is None or v is False or v == '' or v == []) or k in ('id', 'name', 'cat', 'lat', 'lon')} for it in items]
out = {'v': 1, 'updated': datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S'), 'items': items}
json.dump(out, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
print('всего', len(items), 'подборка', sum(1 for i in items if i.get('pick')), 'из OSM', n_osm, 'с фото', sum(1 for i in items if i.get('photos')), 'КБ', len(json.dumps(out, ensure_ascii=False).encode()) // 1024)
