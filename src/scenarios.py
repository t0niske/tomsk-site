# -*- coding: utf-8 -*-
"""Страницы-ответы на поисковые запросы: /kuda-shodit/ и /kuda-shodit/<сценарий>/.

    python3 src/scenarios.py <собранная tomsk.html> <папка сайта>

Места берутся из data/venues.json по меткам (moods): date, friends, kids, solo, night, free.
Запускать после pages.py и venue_pages.py.
"""
import html, json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
import pages

HERE = os.path.dirname(os.path.abspath(__file__))
E = html.escape
GUESS_EVE = {'food', 'bar'}


def parse_hours(s):
    """Часы OSM → по дням (0=вс) список интервалов в минутах; None, если не разобрать."""
    if not s:
        return None
    D = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    s = s.strip()
    if s == '24/7':
        return [[(0, 1440)]] * 7
    week = [[] for _ in range(7)]
    any_ = False
    for part in re.split(r';|\|\|', s):
        part = part.strip()
        if not part or re.match(r'^(PH|SH)\b', part):
            continue
        m = re.match(r'^((?:(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:\s*-\s*(?:Mo|Tu|We|Th|Fr|Sa|Su))?\s*,?\s*)+)?(.*)$', part)
        days = []
        if m.group(1):
            for x in m.group(1).split(','):
                x = x.strip()
                if not x:
                    continue
                ab = [t.strip() for t in x.split('-')]
                if ab[0] not in D or (len(ab) > 1 and ab[1] not in D):
                    continue
                a = D.index(ab[0]); b = D.index(ab[1]) if len(ab) > 1 else a
                k = a
                while True:
                    days.append(k)
                    if k == b:
                        break
                    k = (k + 1) % 7
        else:
            days = list(range(7))
        rest = (m.group(2) or '').strip()
        if re.match(r'^(off|closed)$', rest, re.I):
            for d in days:
                week[d] = []
            any_ = True
            continue
        sp = []
        for a, b in re.findall(r'(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})', rest):
            o = int(a[:-3]) * 60 + int(a[-2:]); c = int(b[:-3]) * 60 + int(b[-2:])
            if c <= o:
                c += 1440
            sp.append((o, c))
        if not sp:
            return None
        for d in days:
            week[d] = sp
        any_ = True
    return week if any_ else None


def open_at(v, day, m):
    w = parse_hours(v.get('hours'))
    if w is None:
        return None
    if any(o <= m < c for o, c in w[day]):
        return True
    return any(c > 1440 and m < c - 1440 for o, c in w[(day + 6) % 7])


def moods(v):
    return v.get('moods') or []


def eve_ok(v):
    r = open_at(v, 5, 20 * 60)
    if r is not None:
        return bool(r) and (v['cat'] in GUESS_EVE or 'night' in moods(v))
    return 'night' in moods(v) or v['cat'] in GUESS_EVE


def wknd_ok(v):
    r = [open_at(v, 6, 13 * 60), open_at(v, 0, 13 * 60)]
    return True if r == [None, None] else any(r)


SCEN = [
    dict(slug='s-devushkoj', tile='С девушкой', emoji='♡', color='#FFC3D0',
         title='Куда сходить в Томске с девушкой — идеи для свидания',
         h1='Куда сходить в Томске с девушкой',
         lead='Идеи для свидания на любой бюджет: где красиво погулять вдвоём, уютно поужинать и чем удивить. Только места, которые мы проверили сами, — без рекламы.',
         flt=lambda v: 'date' in moods(v),
         groups=[('Погулять вдвоём', ['nature', 'sight']), ('Поужинать', ['food']), ('Посидеть в баре', ['bar']),
                 ('Театр, концерт, музей', ['culture', 'church']), ('Что-то активное', ['fun'])],
         faq=[('Куда сходить с девушкой бесплатно?', 'Погулять по набережной Томи на закате, пройтись по Университетской роще и Лагерному саду, посмотреть резные дома — Дом с шатром и Дом с драконами стоят в паре минут друг от друга.'),
              ('Куда пойти на свидание вечером?', 'Поужинать с видом на Томь, сходить на спектакль в театр «Версия» или на концерт в филармонию, а потом прогуляться по вечернему проспекту Ленина.'),
              ('Что делать на свидании в дождь?', 'Выбирайте места под крышей: художественный музей, кофейню-библиотеку Starbooks, ресторан с сибирской кухней или каток в Ледовом дворце «Кристалл».')]),
    dict(slug='s-druzyami', tile='С друзьями', emoji='✌', color='#B9E4FF',
         title='Куда сходить в Томске с друзьями — бары, развлечения, прогулки',
         h1='Куда сходить в Томске с друзьями',
         lead='Где посидеть большой компанией, выпить крафтового пива, поиграть, попрыгать на батутах или просто погулять. Подборка под любое настроение и кошелёк.',
         flt=lambda v: 'friends' in moods(v),
         groups=[('Посидеть компанией', ['food']), ('Бары и пабы', ['bar']), ('Развлечения', ['fun']),
                 ('Погулять', ['nature', 'sight']), ('Что-то необычное', ['culture'])],
         faq=[('Куда сходить с друзьями вечером?', 'В пабы и крафтовые бары центра — многие работают до двух ночи по выходным, — или в гастробистро, где можно засидеться за ужином.'),
              ('Чем заняться компанией днём?', 'Батуты и экстрим-парк, VR-клуб, каток, а в хорошую погоду — набережная, Лагерный сад и аттракционы Городского сада.'),
              ('Где посидеть большой компанией недорого?', 'Пиццерии и грузинские кафе: большие столы, блюда на компанию и спокойные цены.')]),
    dict(slug='s-detmi', tile='С детьми', emoji='☺', color='#C9F2D2',
         title='Куда сходить в Томске с детьми — музеи, развлечения, парки',
         h1='Куда сходить в Томске с ребёнком',
         lead='Музеи, где интересно детям, кукольные театры, батуты, аквапарк и парки для прогулок. Плюс кафе, где детям рады.',
         flt=lambda v: 'kids' in moods(v),
         groups=[('Развлечения', ['fun']), ('Театры и музеи для детей', ['culture']), ('Погулять', ['nature', 'sight']), ('Перекусить', ['food'])],
         faq=[('Куда сходить с ребёнком в выходные?', 'В кукольный театр «Скоморох» или «2+Ку», в планетарий, в научный музей «Точка гравитации», а в тёплую погоду — в Городской сад с аттракционами.'),
              ('Куда пойти с детьми в плохую погоду?', 'Аквапарк «Жасмин», батутные центры, Зоологический музей ТГУ, музей славянской мифологии — всё под крышей.'),
              ('Где погулять с ребёнком бесплатно?', 'Набережная Томи, Лагерный сад, сквер «Басни Крылова» и забавные городские памятники — Чехову, тапочкам, Лягушке-путешественнице.')]),
    dict(slug='vecherom', tile='Вечером', emoji='☾', color='#D9C8F0',
         title='Куда сходить вечером в Томске — ужин, бары, театры, прогулки',
         h1='Куда сходить вечером в Томске',
         lead='Что делать в Томске после работы и в выходные вечером: где поужинать, какие бары открыты допоздна, куда сходить на спектакль и где красиво погулять в огнях.',
         flt=eve_ok,
         groups=[('Поужинать', ['food']), ('Бары допоздна', ['bar']), ('Театры и концерты', ['culture']), ('Вечерняя прогулка', ['nature', 'sight']), ('Развлечения', ['fun'])],
         faq=[('Что работает в Томске поздно вечером?', 'Бары и пабы центра, многие до 1–2 ночи по пятницам и субботам; рестораны на проспекте Ленина обычно до полуночи.'),
              ('Где погулять вечером?', 'Набережная Томи и Лагерный сад с видом на реку, площадь Ленина и Ново-Соборная площадь — в вечерней подсветке.')]),
    dict(slug='na-vyhodnyh', tile='На выходных', emoji='☀', color='#FFD43B',
         title='Куда сходить в Томске на выходных — идеи на субботу и воскресенье',
         h1='Куда сходить в Томске на выходных',
         lead='Чем заняться в субботу и воскресенье: музеи и театры, парки, развлечения и места для неспешного завтрака. Всё, что открыто по выходным.',
         flt=wknd_ok,
         groups=[('Погулять', ['nature', 'sight']), ('Музеи и театры', ['culture']), ('Развлечения', ['fun']), ('Позавтракать и пообедать', ['food']), ('Храмы', ['church'])],
         faq=[('Какие музеи открыты в Томске по выходным?', 'Большинство: краеведческий и художественный музеи, планетарий и музей славянской мифологии работают в субботу и воскресенье. Выходной у многих музеев — понедельник.'),
              ('Где позавтракать в выходные?', 'В кофейнях и пекарнях центра — многие открываются в 8 утра, а некоторые рестораны по выходным подают завтраки с 10.')]),
    dict(slug='besplatno', tile='Бесплатно', emoji='0 ₽', color='#FFFDF5',
         title='Куда сходить в Томске бесплатно — прогулки, памятники, архитектура',
         h1='Куда сходить в Томске бесплатно',
         lead='Томск хорош для прогулок: набережная, сады и рощи, резные деревянные дома, необычные памятники и храмы. Всё это — бесплатно.',
         flt=lambda v: v.get('price') == 0,
         groups=[('Парки и набережная', ['nature']), ('Деревянный Томск', ['wood']), ('Достопримечательности', ['sight']), ('Храмы', ['church'])],
         faq=[('Что посмотреть в Томске бесплатно за один день?', 'Площадь Ленина и набережную, Воскресенскую гору, Дом с шатром и Дом с драконами на Красноармейской, Университетскую рощу и Ново-Соборную площадь.')]),
]


def load_data(out):
    V = json.load(open(os.path.join(out, 'data', 'venues.json'), encoding='utf-8'))
    js = open(os.path.join(out, 'assets', 'site.js'), encoding='utf-8').read()
    photos = json.loads(re.search(r'const PHOTOS=(\{.*?\});\n', js, re.S).group(1))
    slugs = {p['id']: p['slug'] for p in json.load(open(os.path.join(HERE, 'venue', 'pages.json'), encoding='utf-8'))}
    items = [v for v in V['items'] if v.get('pick') and not v.get('hidden') and v['cat'] != 'stay']
    return items, photos, slugs


def item_html(v, photos, slugs, root):
    ph = (v.get('photos') or [None])[0]
    src = ph['src'] if ph else (photos.get(v['id']) or photos.get(v['name']) or [None])[0]
    if src and not re.match(r'^(https?:|/)', src):
        src = root + src
    href = f'{root}mesto/{slugs[v["id"]]}/' if v['id'] in slugs else None
    name = f'<a href="{href}">{E(v["name"])}</a>' if href else f'<button class="lnk" data-open="{E(v["id"])}">{E(v["name"])}</button>'
    why = v.get('why') or (v.get('desc') or '').split('. ')[0]
    price = 'Бесплатно' if v.get('price') == 0 else (f'от {v["price"]} ₽' if v.get('price') else '')
    meta = ' · '.join(x for x in [E(v.get('kind', '')), E(v.get('addr', '')), price] if x)
    img = f'<img src="{E(src)}" alt="" loading="lazy" referrerpolicy="no-referrer">' if src else f'<b>{E(v["name"][0])}</b>'
    st = f'<span class="pk-st" data-st="{E(v["hours"])}"></span>' if v.get('hours') else ''
    return (f'<li class="sc-item"><span class="sc-ph">{img}</span><div><h3>{name}</h3>'
            f'{f"<p>{E(why.rstrip(chr(46)))}.</p>" if why else ""}<small>{meta} {st}</small></div>'
            f'<button class="fav" data-fav="{E(v["id"])}" aria-label="Хочу сходить"><svg class="ico" viewBox="0 0 24 24"><path d="M12 20s-7-4.4-9-8.6C1.6 8.4 3.6 5 7 5c2 0 3.3 1.1 5 3 1.7-1.9 3-3 5-3 3.4 0 5.4 3.4 4 6.4C19 15.6 12 20 12 20z"/></svg></button></li>')


def score(v):
    return (2 if v.get('feat') else 0) + (1 if v.get('photos') else 0) + (1 if v.get('why') else 0) + (0.5 if v.get('about') else 0)


def tiles(root, current=None):
    return '<div class="sc-tiles">' + ''.join(
        f'<a class="sc-tile" href="{root}kuda-shodit/{s["slug"]}/" style="--c:{s["color"]}"{" aria-current=page" if s["slug"] == current else ""}>'
        f'<i>{s["emoji"]}</i><b>{s["tile"]}</b></a>' for s in SCEN) + '</div>'


CSS = r'''
/* ===== страницы «куда сходить …» ===== */
.sc-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
.sc-tile{display:flex;flex-direction:column;gap:10px;padding:16px;border:2px solid #111;border-radius:20px;background:var(--c);color:#111;text-decoration:none;box-shadow:3px 3px 0 var(--line);transition:transform .15s}
.sc-tile:hover{transform:translate(-2px,-2px)}
.sc-tile i{font-style:normal;font-family:var(--font-display);font-weight:900;font-size:22px}
.sc-tile b{font-family:var(--font-display);font-weight:900;text-transform:uppercase;font-size:16px;line-height:1.1}
.sc-tile[aria-current]{outline:3px solid var(--ink);outline-offset:3px}
.sc-sec{padding-block:14px}
.sc-sec h2{font-family:var(--font-display);font-weight:900;text-transform:uppercase;font-size:clamp(20px,2.4vw,28px);margin:0 0 14px}
.sc-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}
.sc-item{position:relative;display:flex;gap:14px;align-items:flex-start;padding:12px 48px 12px 12px;border:2px solid var(--line);border-radius:20px;background:var(--surface)}
.sc-ph{flex:none;width:96px;height:96px;border-radius:14px;overflow:hidden;border:2px solid #111;background:var(--surface-2);display:grid;place-items:center}
.sc-ph img{width:100%;height:100%;object-fit:cover}.sc-ph b{font-family:var(--font-display);font-size:30px}
.sc-item h3{margin:2px 0 4px;font-size:17px;line-height:1.25}
.sc-item h3 a,.sc-item h3 .lnk{color:var(--ink);text-decoration:none;font-weight:800;text-align:left}
.sc-item h3 a::after{content:' →'}
.sc-item p{margin:0 0 6px;font-size:14px;line-height:1.4}
.sc-item small{display:flex;flex-wrap:wrap;align-items:center;gap:6px;color:var(--ink-2);font-size:12.5px;line-height:1.4}
.sc-item .fav{position:absolute;right:10px;top:10px}
.sc-faq{max-width:72ch}.sc-faq details{border:2px solid var(--line);border-radius:16px;padding:12px 16px;margin-bottom:10px;background:var(--surface)}
.sc-faq summary{font-weight:800;cursor:pointer}.sc-faq p{margin:10px 0 0;line-height:1.55}
@media (max-width:640px){.sc-list{grid-template-columns:minmax(0,1fr)}.sc-ph{width:76px;height:76px}}
'''


def build(single, out):
    pages.load(single)
    items, photos, slugs = load_data(out)
    css = os.path.join(out, 'assets', 'site.css')
    if '/* ===== страницы «куда сходить' not in open(css, encoding='utf-8').read():
        open(css, 'a', encoding='utf-8').write(CSS)
    made = []
    for s in SCEN:
        root = '../../'
        L = [v for v in items if s['flt'](v)]
        used, secs = set(), []
        for title, cats in s['groups']:
            g = [v for v in L if v['id'] not in used and (v['cat'] in cats or ('wood' in cats and 'wood' in moods(v)))]
            g.sort(key=score, reverse=True)
            g = g[:8]
            if len(g) < 2:
                continue
            used.update(v['id'] for v in g)
            secs.append(f'<section class="sc-sec"><div class="wrap"><h2>{title}</h2><ul class="sc-list">'
                        + ''.join(item_html(v, photos, slugs, root) for v in g) + '</ul></div></section>')
        n = len(used)
        faq = ''.join(f'<details><summary>{E(q)}</summary><p>{E(a)}</p></details>' for q, a in s['faq'])
        ld = json.dumps({'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
            {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in s['faq']]}, ensure_ascii=False)
        body = (pages.page_head(root, [('', 'Главная'), ('kuda-shodit/', 'Куда сходить'), (None, s['tile'])], s['h1'], s['lead'], f'{n} {"идея" if n % 10 == 1 and n % 100 != 11 else "идеи" if 2 <= n % 10 <= 4 and not 12 <= n % 100 <= 14 else "идей"}')
                + '\n'.join(secs)
                + f'<section class="sc-sec"><div class="wrap"><div class="sc-faq"><h2>Частые вопросы</h2>{faq}</div></div></section>'
                + f'<section class="sc-sec"><div class="wrap"><h2>Ещё идеи</h2>{tiles(root, s["slug"])}</div></section>')
        html_ = pages.shell(title=s['title'], desc=s['lead'], root=root, page=f'kuda-shodit/{s["slug"]}/', active='ideas', body=body,
                            head_extra=f'<script type="application/ld+json">{ld}</script>\n')
        d = os.path.join(out, 'kuda-shodit', s['slug'])
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(html_)
        made.append((s['slug'], n))
    # хаб
    root = '../'
    hub = (pages.page_head(root, [('', 'Главная'), (None, 'Куда сходить')], 'Куда сходить в Томске', 'Выберите, с кем и когда, — и получите готовые идеи: только проверенные места, без рекламы.')
           + f'<section class="sc-sec"><div class="wrap">{tiles(root)}</div></section>'
           + '<section class="sc-sec"><div class="wrap promo"><a class="p2" href="../pasport/"><b>Паспорт Томска</b><span>Собирайте кофейни, музеи, парки и бары города. Сезон «Зима в Томске» — до 31 марта.</span><i>Открыть →</i></a>'
             '<a class="p3" href="../mesta/"><b>Выбор редакции</b><span>Все места, которые мы проверили и описали сами.</span><i>Смотреть →</i></a>'
             '<a class="p1" href="../sobytiya/"><b>Афиша</b><span>Что происходит в городе по дням.</span><i>Смотреть →</i></a></div></section>')
    os.makedirs(os.path.join(out, 'kuda-shodit'), exist_ok=True)
    open(os.path.join(out, 'kuda-shodit', 'index.html'), 'w', encoding='utf-8').write(
        pages.shell(title='Куда сходить в Томске: идеи с девушкой, с друзьями, с детьми, вечером и бесплатно', root=root, page='kuda-shodit/', active='ideas', body=hub,
                    desc='Куда сходить в Томске: готовые идеи для свидания, компании друзей, отдыха с детьми, на вечер и выходные. Только проверенные места.'))
    # добавить в карту сайта
    sm = os.path.join(out, 'sitemap.xml')
    if os.path.exists(sm):
        x = open(sm, encoding='utf-8').read()
        add = ''.join(f'  <url><loc>{pages.SITE_URL}{u}</loc></url>\n' for u in ['kuda-shodit/'] + [f'kuda-shodit/{s["slug"]}/' for s in SCEN] if u not in x)
        open(sm, 'w', encoding='utf-8').write(x.replace('</urlset>', add + '</urlset>'))
    return made


if __name__ == '__main__':
    print('scenarios:', build(sys.argv[1], sys.argv[2]))
