# -*- coding: utf-8 -*-
"""Список страниц заведений (src/venue/pages.json): места редакции и заведения OpenStreetMap
с адресом и хотя бы одним контактом (часы, телефон или сайт). Записи из сторонних баз страниц не получают.
Уже выданные адреса страниц сохраняются.   python3 src/venue/select_pages.py"""
import json, math, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
V = json.load(open(os.path.join(ROOT, 'data', 'venues.json'), encoding='utf-8'))['items']
P = os.path.join(HERE, 'pages.json')
old = json.load(open(P, encoding='utf-8')) if os.path.exists(P) else []
TR = dict(zip('абвгдеёжзийклмнопрстуфхцчшщъыьэюя', ['a','b','v','g','d','e','e','zh','z','i','j','k','l','m','n','o','p','r','s','t','u','f','h','c','ch','sh','shch','','y','','e','yu','ya']))
def slugify(s):
    s = ''.join(TR.get(c, c) for c in s.lower().replace('«', '').replace('»', ''))
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s)).strip('-')[:60] or 'mesto'
norm = lambda s: re.sub(r'[^0-9a-zа-я]', '', s.lower().replace('ё', 'е'))
dist = lambda a, b: math.hypot((a['lon'] - b['lon']) * 61646, (a['lat'] - b['lat']) * 111351)
# виды, которые не про «куда сходить»
SKIP = {'Цветы', 'Универмаг', 'Секонд-хенд', 'Игрушки', 'Товары для творчества', 'Игровые автоматы', 'Фитнес', 'Спортивный центр'}
ed = [v for v in V if v.get('origin') == 'editor' and not v.get('hidden')]
osm = [v for v in V if v.get('origin') == 'osm' and not v.get('hidden') and v.get('addr') and (v.get('hours') or v.get('phone') or v.get('web'))
       and v['cat'] != 'other' and v.get('kind') not in SKIP and not re.match(r'^\d', v['name']) and not re.search(r'доставк|аренда|\.ru$|пят[её]рочка', v['name'].lower()) and not any(dist(v, e) < 150 and norm(v['name'])[:5] == norm(e['name'])[:5] for e in ed)]
chosen = ed + osm
have = {p['id']: p['slug'] for p in old}
used = set(have.values())
out = []
for v in chosen:
    if v['id'] in have:
        out.append({'id': v['id'], 'slug': have[v['id']]}); continue
    base = slugify(v['name']); s = base
    if s in used and v.get('addr'):
        s = f"{base}-{slugify(v['addr'])}"[:80].strip('-')
    k = 2
    while s in used:
        s = f'{base}-{k}'; k += 1
    used.add(s); out.append({'id': v['id'], 'slug': s})
json.dump(out, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('страниц:', len(out), '| редакция:', len(ed), '| OpenStreetMap:', len(osm))
