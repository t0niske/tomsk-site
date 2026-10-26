# -*- coding: utf-8 -*-
"""«Паспорт Томска»: страница /pasport/, данные для отметок data/passport.json и скрипт assets/passport.js.

    python3 src/passport.py <папка сайта>

Серии и сезон — src/passport/series.json. Запускать после venue_pages.py (нужен список страниц мест).
Отметки хранятся в браузере посетителя (localStorage), сервер не нужен.
"""
import html, json, os, sys
from datetime import date
sys.path.insert(0, os.path.dirname(__file__))
import pages

HERE = os.path.dirname(os.path.abspath(__file__))
E = html.escape
MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
day = lambda s: (lambda d: f'{d.day} {MONTHS[d.month - 1]} {d.year}')(date.fromisoformat(s))

CSS = r'''
/* ===== паспорт Томска ===== */
.pp-sec{padding-block:14px}
.pp-sec h2{font-family:var(--font-display);font-weight:900;text-transform:uppercase;font-size:clamp(20px,2.4vw,28px);margin:0}
.pp-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:6px 16px;margin-bottom:6px}
.pp-head p{margin:0;color:var(--ink-2);max-width:60ch}
.pp-lead{margin:0 0 12px;color:var(--ink-2);max-width:62ch}
.pp-sum{display:flex;flex-wrap:wrap;gap:12px 28px;align-items:center;padding:18px 20px;border:var(--bd);border-radius:24px;background:var(--surface);box-shadow:var(--pop)}
.pp-sum b{display:block;font-family:var(--font-display);font-weight:900;font-size:clamp(24px,3vw,34px);line-height:1;font-variant-numeric:tabular-nums}
.pp-sum small{color:var(--ink-2);font-size:13px}
.pp-sum .grow{flex:1}
.pp-note{font-size:13px;color:var(--ink-2);margin:10px 0 0}
.pp-season{padding:20px;border:2px solid #111;border-radius:24px;background:#CFE8FF;color:#111}
.pp-season h2{color:#111}
.pp-season .pp-head p,.pp-season .pp-lead{color:#2B3440}
.pp-dates{display:inline-block;font-weight:800;font-size:13px;background:#FFFDF5;border:2px solid #111;border-radius:999px;padding:2px 10px}
.pp-meter{height:10px;border-radius:99px;background:var(--surface-2);border:2px solid var(--line);overflow:hidden;margin:6px 0 4px}
.pp-meter i{display:block;height:100%;width:0;background:var(--yellow)}
.pp-prog{font-weight:700;font-size:14px;font-variant-numeric:tabular-nums}
.pp-badge{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:800;border-radius:999px;padding:3px 10px;background:var(--surface-2);color:var(--ink-2)}
.pp-badge.on{background:var(--yellow);color:#111}
.pp-list{list-style:none;margin:12px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px}
.pp-item{display:flex;gap:10px;align-items:center;padding:10px 12px;border:2px solid var(--line);border-radius:16px;background:var(--surface);min-width:0}
.pp-season .pp-item{border-color:#111}
.pp-item.done{border-color:#111;background:color-mix(in srgb,var(--yellow) 30%,var(--surface))}
.pp-seal{flex:none;width:34px;height:34px;border-radius:50%;border:2px dashed var(--line);display:grid;place-items:center;font-weight:900;font-size:15px;color:var(--ink-2)}
.pp-item.done .pp-seal{border:2px solid #111;background:var(--yellow);color:#111}
.pp-item div{min-width:0;flex:1}
.pp-item a{color:var(--ink);font-weight:800;text-decoration:none;overflow-wrap:anywhere}
.pp-item a:hover{text-decoration:underline}
.pp-item small{display:block;color:var(--ink-2);font-size:12.5px;overflow-wrap:anywhere}
.pp-here{flex:none;font:inherit;font-size:13px;font-weight:800;padding:6px 10px;border-radius:999px;border:2px solid #111;background:var(--yellow);color:#111;cursor:pointer}
.pp-here[disabled]{opacity:.6;cursor:progress}
.pp-msg{margin:10px 0 0;font-weight:600;min-height:1.4em}
.pp-msg.err{color:#C0442B}
.pp-how{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:0;padding:0;list-style:none}
.pp-how li{padding:14px 16px;border:2px solid var(--line);border-radius:18px;background:var(--surface)}
.pp-how b{display:block;margin-bottom:4px}
.pp-faq details{border-bottom:1.5px dashed var(--line);padding:10px 0}
.pp-faq summary{cursor:pointer;font-weight:700}
.pp-faq p{margin:8px 0 0;color:var(--ink-2)}
/* блок на странице места */
.v-pass{margin-top:16px}
.v-pass h2{display:flex;align-items:center;gap:8px}
.v-pass p{margin:6px 0;font-size:14px;line-height:1.45}
.v-pass .pp-here{margin-top:6px}
.v-pass ul{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:6px;font-size:14px}
.v-pass ul a{color:var(--ink);font-weight:700}
/* режим «Холодно» на главной */
.cold{padding-block:18px}
.cold-box{padding:20px;border:2px solid #111;border-radius:24px;background:#CFE8FF;color:#111}
.cold-box h2{font-family:var(--font-display);font-weight:900;text-transform:uppercase;font-size:clamp(20px,2.6vw,30px);margin:0 0 6px;color:#111}
.cold-box p{margin:0 0 12px;color:#2B3440}
.cold-box .pp-item{border-color:#111}
.cold-box .pp-item a{color:#111}.cold-box .pp-item small{color:#2B3440}
.cold-box .pp-item{background:#FFFDF5}
.cold-more{display:inline-block;margin-top:12px;font-weight:800;color:#111}
@media (max-width:640px){.pp-list{grid-template-columns:minmax(0,1fr)}}
'''


def plural(n, a, b, c):
    m, h = n % 10, n % 100
    return a if m == 1 and h != 11 else b if 2 <= m <= 4 and not 12 <= h <= 14 else c


def build(out):
    S = json.load(open(os.path.join(HERE, 'passport', 'series.json'), encoding='utf-8'))
    V = {v['id']: v for v in json.load(open(os.path.join(out, 'data', 'venues.json'), encoding='utf-8'))['items'] if not v.get('hidden')}
    slugs = {p['id']: p['slug'] for p in json.load(open(os.path.join(HERE, 'venue', 'pages.json'), encoding='utf-8'))}
    groups = S['series'] + [dict(S['season'], season=True)]
    for g in groups:
        bad = [i for i in g['ids'] if i not in V or i not in slugs or V[i].get('lat') is None]
        if bad:
            raise SystemExit(f'passport: в серии {g["id"]} нет места, страницы или координат: {bad}')
    used = {i for g in groups for i in g['ids']}
    places = {i: {'n': V[i]['name'], 'k': V[i].get('kind', ''), 'a': V[i].get('addr', ''), 'lat': V[i]['lat'], 'lon': V[i]['lon'],
                  'h': V[i].get('hours', ''), 's': slugs[i]} for i in sorted(used)}
    data = {'series': S['series'], 'season': S['season'], 'cold': S['cold'], 'places': places}
    open(os.path.join(out, 'data', 'passport.json'), 'w', encoding='utf-8').write(json.dumps(data, ensure_ascii=False, separators=(',', ':')))
    open(os.path.join(out, 'assets', 'passport.js'), 'w', encoding='utf-8').write(open(os.path.join(HERE, 'passport', 'client.js'), encoding='utf-8').read())
    css = os.path.join(out, 'assets', 'site.css')
    if '/* ===== паспорт Томска' not in open(css, encoding='utf-8').read():
        open(css, 'a', encoding='utf-8').write(CSS)

    root = '../'

    def group_html(g):
        items = ''.join(
            f'<li class="pp-item" data-pid="{E(i)}"><span class="pp-seal" aria-hidden="true">{E(V[i]["name"][0])}</span>'
            f'<div><a href="{root}mesto/{slugs[i]}/">{E(V[i]["name"])}</a><small>{E(" · ".join(x for x in [V[i].get("kind", ""), V[i].get("addr", "")] if x))}</small></div></li>'
            for i in g['ids'])
        n = len(g['ids'])
        dates = f'<span class="pp-dates">{day(g["from"])} — {day(g["to"])}</span>' if g.get('season') else ''
        return (f'<section class="pp-sec" id="{E(g["id"])}"><div class="wrap"><div class="{"pp-season" if g.get("season") else ""}">'
                f'<div class="pp-head"><h2>{E(g["title"])}</h2>{dates}</div><p class="pp-lead">{E(g["lead"])}</p>'
                f'<div class="pp-meter"><i data-meter="{E(g["id"])}"></i></div>'
                f'<span class="pp-prog" data-prog="{E(g["id"])}">{n} {plural(n, "место", "места", "мест")}</span> '
                f'<span class="pp-badge" data-badge="{E(g["id"])}">Звание: {E(g["badge"])}</span>'
                f'<ul class="pp-list">{items}</ul></div></div></section>')

    total = len(used)
    faq = [('Как поставить отметку?', 'Откройте паспорт или страницу места, когда будете рядом, и нажмите «Я здесь». Сайт попросит доступ к геолокации и поставит штамп, если вы не дальше 150 метров от места.'),
           ('Нужна ли регистрация?', 'Нет. Паспорт хранится в вашем браузере на этом устройстве. Если очистить данные сайта или открыть его на другом телефоне, отметок там не будет. Вход и синхронизация появятся позже.'),
           ('Можно отметиться в закрытом месте?', 'Нет: если у места указаны часы работы и оно сейчас закрыто, отметка не поставится. Парки, улицы и памятники открыты всегда.'),
           ('Что такое сезон?', f'Сезонная серия действует ограниченное время. «{S["season"]["title"]}» идёт с {day(S["season"]["from"])} по {day(S["season"]["to"])}: соберите её, пока сезон не закончился.'),
           ('Можно ли отметить любое место?', 'Да, кнопка «Я здесь» есть на странице каждого места с координатами. Такие отметки попадают в общий счёт открытых мест, даже если место не входит ни в одну серию.')]
    ld = json.dumps({'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
        {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in faq]}, ensure_ascii=False)
    summary = (f'<section class="pp-sec"><div class="wrap"><div class="pp-sum" id="ppSum">'
               f'<div><b id="ppPlaces">0</b><small>мест открыто</small></div>'
               f'<div><b id="ppSeries">0 из {len(groups)}</b><small>серий собрано</small></div>'
               f'<div class="grow"></div><button class="btn btn-primary" id="ppNear" type="button">Что неотмечено рядом со мной</button></div>'
               f'<p class="pp-msg" id="ppMsg" role="status" aria-live="polite"></p>'
               f'<p class="pp-note">Отметки хранятся в этом браузере, регистрация не нужна.</p></div></section>')
    how = ('<section class="pp-sec"><div class="wrap"><div class="pp-head"><h2>Как это работает</h2></div><ol class="pp-how">'
           '<li><b>Придите в место</b>Из любой серии ниже или любое другое со страницей на сайте.</li>'
           '<li><b>Нажмите «Я здесь»</b>Сайт проверит, что вы рядом (до 150 метров) и место сейчас открыто.</li>'
           '<li><b>Соберите серию</b>Все места серии — и вы получаете её звание.</li>'
           f'<li><b>Успейте за сезон</b>«{E(S["season"]["title"])}» действует до {day(S["season"]["to"])}.</li></ol></div></section>')
    body = (pages.page_head(root, [('', 'Главная'), (None, 'Паспорт Томска')], 'Паспорт Томска',
                            f'Коллекция вашего города: {total} {plural(total, "место", "места", "мест")} в {len(groups)} сериях. Приходите, нажимайте «Я здесь» и собирайте штампы и звания.')
            + summary + group_html(dict(S['season'], season=True)) + ''.join(group_html(g) for g in S['series']) + how
            + '<section class="pp-sec"><div class="wrap pp-faq"><div class="pp-head"><h2>Частые вопросы</h2></div>'
            + ''.join(f'<details><summary>{E(q)}</summary><p>{E(a)}</p></details>' for q, a in faq) + '</div></section>')
    doc = pages.shell(title='Паспорт Томска: собирайте места города и получайте звания', root=root, page='pasport/', active='passport', body=body,
                      desc=f'Паспорт Томска — коллекция мест города: кофейни, музеи, парки, бары, памятники и сезон «{S["season"]["title"]}». Отмечайтесь по геолокации и собирайте серии.',
                      head_extra=f'<script type="application/ld+json">{ld}</script>\n')
    os.makedirs(os.path.join(out, 'pasport'), exist_ok=True)
    open(os.path.join(out, 'pasport', 'index.html'), 'w', encoding='utf-8').write(doc)
    sm = os.path.join(out, 'sitemap.xml')
    x = open(sm, encoding='utf-8').read()
    if f'{pages.SITE_URL}pasport/<' not in x:
        open(sm, 'w', encoding='utf-8').write(x.replace('</urlset>', f'  <url><loc>{pages.SITE_URL}pasport/</loc></url>\n</urlset>'))
    return {g['id']: len(g['ids']) for g in groups}


if __name__ == '__main__':
    pages.load(os.path.join(HERE, 'tomsk.html'))
    print('passport:', build(sys.argv[1]))
