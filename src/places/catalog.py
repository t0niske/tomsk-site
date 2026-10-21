# -*- coding: utf-8 -*-
"""Каталог заведений города из OpenStreetMap (данные © участники OSM, ODbL)."""
import json, re, sys, math, collections
RAW, DATA, OUT = sys.argv[1:4]
R = json.load(open(RAW)); J = json.load(open(DATA))

AM = {'cafe': ('food', 'Кафе'), 'restaurant': ('food', 'Ресторан'), 'fast_food': ('food', 'Быстрое питание'), 'ice_cream': ('food', 'Мороженое'),
      'food_court': ('food', 'Фудкорт'), 'bar': ('bar', 'Бар'), 'pub': ('bar', 'Паб'), 'nightclub': ('bar', 'Клуб'), 'biergarten': ('bar', 'Пивной сад'),
      'theatre': ('culture', 'Театр'), 'cinema': ('culture', 'Кинотеатр'), 'arts_centre': ('culture', 'Арт-центр'), 'library': ('culture', 'Библиотека'),
      'planetarium': ('culture', 'Планетарий'), 'concert_hall': ('culture', 'Концертный зал'), 'place_of_worship': ('church', 'Храм'), 'fountain': ('sight', 'Фонтан')}
TO = {'museum': ('culture', 'Музей'), 'gallery': ('culture', 'Галерея'), 'hotel': ('stay', 'Гостиница'), 'hostel': ('stay', 'Хостел'), 'guest_house': ('stay', 'Гостевой дом'),
      'motel': ('stay', 'Мотель'), 'apartment': ('stay', 'Апартаменты'), 'attraction': ('sight', 'Достопримечательность'), 'artwork': ('sight', 'Арт-объект'),
      'viewpoint': ('sight', 'Смотровая'), 'zoo': ('fun', 'Зоопарк'), 'theme_park': ('fun', 'Парк развлечений')}
LE = {'park': ('nature', 'Парк'), 'garden': ('nature', 'Сад'), 'water_park': ('fun', 'Аквапарк'), 'ice_rink': ('fun', 'Каток'), 'bowling_alley': ('fun', 'Боулинг'),
      'escape_game': ('fun', 'Квест'), 'amusement_arcade': ('fun', 'Игровые автоматы'), 'trampoline_park': ('fun', 'Батутный центр'), 'sports_centre': ('fun', 'Спортивный центр'),
      'fitness_centre': ('fun', 'Фитнес'), 'sauna': ('fun', 'Баня, сауна'), 'swimming_pool': ('fun', 'Бассейн'), 'climbing': ('fun', 'Скалодром'), 'stadium': ('fun', 'Стадион'),
      'playground': None, 'pitch': None, 'dance': ('fun', 'Танцы'), 'miniature_golf': ('fun', 'Мини-гольф'), 'adult_gaming_centre': None}
SH = {'books': 'Книжный', 'gift': 'Подарки', 'art': 'Арт-магазин', 'craft': 'Товары для творчества', 'confectionery': 'Кондитерская', 'bakery': 'Пекарня',
      'chocolate': 'Шоколад', 'tea': 'Чай', 'coffee': 'Кофе', 'mall': 'Торговый центр', 'antiques': 'Антиквариат', 'music': 'Музыка', 'souvenir': 'Сувениры',
      'toys': 'Игрушки', 'second_hand': 'Секонд-хенд', 'department_store': 'Универмаг', 'florist': 'Цветы'}
HI = {'memorial': 'Памятник', 'monument': 'Монумент', 'building': 'Историческое здание', 'manor': 'Усадьба', 'castle': 'Замок', 'ruins': 'Руины', 'church': 'Храм'}
FOODSHOP = {'confectionery', 'bakery', 'chocolate', 'tea', 'coffee'}

def classify(t):
    a = t.get('amenity'); o = t.get('tourism'); l = t.get('leisure'); s = t.get('shop'); h = t.get('historic')
    if a in AM: return AM[a]
    if o in TO: return TO[o]
    if l in LE: return LE[l]
    if s in SH: return ('food' if s in FOODSHOP else 'shop', SH[s])
    if h in HI: return ('sight', HI[h])
    return None

def pairs(f): return [(f[i], f[i + 1]) for i in range(0, len(f) - 1, 2)]
def centroid(id_, g):
    if id_[0] == 'n': return g
    if id_[0] == 'w':
        p = pairs(g)
    else:
        p = [q for role, f in g for q in pairs(f)]
    if not p: return None
    return [sum(x for x, y in p) / len(p), sum(y for x, y in p) / len(p)]

# адреса из зданий (для точек без собственного адреса)
def dec(s, q):
    a = list(map(int, s.split(','))); x = y = 0; o = []
    for i in range(0, len(a) - 1, 2): x += a[i]; y += a[i + 1]; o.append((x / q, y / q))
    return o
grid = collections.defaultdict(list)
for b in J['b']:
    if not b[9]: continue
    r = dec(b[0].split(';')[0], 2); xs = [p[0] for p in r]; ys = [p[1] for p in r]
    for gx in range(int(min(xs) // 100), int(max(xs) // 100) + 1):
        for gy in range(int(min(ys) // 100), int(max(ys) // 100) + 1): grid[(gx, gy)].append((r, b[9], (min(xs), min(ys), max(xs), max(ys))))
def pip(x, y, poly):
    c = False; n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]; x2, y2 = poly[(i + 1) % n]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1 + 1e-12) + x1: c = not c
    return c
def addr_at(x, y):
    for r, a, bb in grid.get((int(x // 100), int(y // 100)), []):
        if bb[0] <= x <= bb[2] and bb[1] <= y <= bb[3] and pip(x, y, r): return a
    return ''
def short_street(s):
    for a, b in [('улица', 'ул.'), ('проспект', 'пр.'), ('переулок', 'пер.'), ('площадь', 'пл.'), ('бульвар', 'б-р'), ('набережная', 'наб.'), ('шоссе', 'ш.')]:
        s = re.sub(r'(^|\s)' + a + r'(\s|$)', r'\1' + b + r'\2', s)
    return s.strip()
def clean_web(u):
    if not u: return ''
    u = u.split(';')[0].strip()
    if not re.match(r'https?://', u): u = 'https://' + u
    return u
def clean_phone(p):
    if not p: return ''
    return p.split(';')[0].strip()

out = []; seen = {}
for id_, t, g in R['els']:
    if not t or not t.get('name'): continue
    c = classify(t)
    if not c: continue
    if t.get('disused') or t.get('abandoned') or t.get('disused:amenity'): continue
    p = centroid(id_, g)
    if not p: continue
    x, y = round(p[0]), round(p[1])
    cat, kind = c
    if cat == 'sight' and kind == 'Памятник' and t.get('memorial') in ('plaque', 'stolperstein', 'blue_plaque'): continue
    name = t['name'].strip()
    key = (name.lower(), cat)
    if key in seen and any(math.hypot(x - q[0], y - q[1]) < 80 for q in seen[key]): continue
    seen.setdefault(key, []).append((x, y))
    addr = ''
    if t.get('addr:housenumber'): addr = (short_street(t.get('addr:street', '')) + ', ' + t['addr:housenumber']).strip(', ')
    if not addr: addr = addr_at(x, y)
    vk = t.get('contact:vk') or ''
    out.append(dict(n=name, c=cat, k=kind, x=x, y=y, a=addr, h=t.get('opening_hours', ''), ph=clean_phone(t.get('contact:phone') or t.get('phone')),
                    w=clean_web(t.get('contact:website') or t.get('website')), vk=clean_web(vk) if vk else '', cu=t.get('cuisine', ''),
                    br=t.get('brand', '')))
out.sort(key=lambda r: (r['c'], r['n'].lower()))
json.dump(out, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
cnt = collections.Counter(r['c'] for r in out)
print(len(out), dict(cnt), 'с часами', sum(1 for r in out if r['h']), 'с адресом', sum(1 for r in out if r['a']), 'с телефоном', sum(1 for r in out if r['ph']), 'с сайтом', sum(1 for r in out if r['w'] or r['vk']))
print('КБ', round(len(json.dumps(out, ensure_ascii=False, separators=(',', ':')).encode()) / 1024))
