# -*- coding: utf-8 -*-
"""Разбивает собранную одностраничную главную на многостраничный сайт.

    python3 src/pages.py <собранная tomsk.html> <папка сайта>

Что делает:
  * выносит стили и скрипт в assets/site.css и assets/site.js (один раз скачиваются и кэшируются);
  * собирает страницы: главная, места, события, подборки, деревянный Томск, удиви меня, о проекте;
  * у всех страниц общая шапка, подвал, карточка места, маршрут и форма «нашли ошибку».
Функция shell() используется и генератором страниц заведений (src/venue_pages.py).
"""
import os, re, sys

SITE_URL = os.environ.get('SITE_URL', 'https://t0niske.github.io/tomsk-site/')

NAV = [('kuda-shodit/', 'Куда сходить', 'ideas'), ('mesta/', 'Места', 'places'), ('sobytiya/', 'События', 'events'),
       ('derevyannyj-tomsk/', 'Деревянный Томск', 'wood'), ('map.html', 'Карта', 'map')]

SRC = {}


def load(path):
    s = open(path, encoding='utf-8').read()
    s = re.sub(r'https://claude\.ai/artifact/[A-Za-z0-9]+', 'map.html', s)  # в превью Claude карта — отдельный артефакт
    i = s.index('<style>'); j = s.index('</style>', i)
    SRC['css'] = s[i + 7:j]
    k = s.index('<script>', j); l = s.rindex('</script>')
    SRC['js'] = s[k + 8:l]
    body = s[j + 8:k]
    SRC['header'] = re.search(r'<header class="top">.*?</header>', body, re.S).group(0)
    SRC['footer'] = re.search(r'<footer>.*?</footer>', body, re.S).group(0)
    SRC['sec'] = {m.group(1): m.group(0) for m in re.finditer(r'<section[^>]*id="([^"]+)"[^>]*>.*?</section>', body, re.S)}
    SRC['chips'] = re.search(r'<div class="wrap h2-chips">.*?</div></div>', body, re.S).group(0)
    SRC['nowbar'] = re.search(r'<div class="wrap">\s*<div class="nowbar">.*?</div>\s*</div>\s*</div>', body, re.S).group(0)
    tail = body[body.index('</footer>') + 9:]
    li = tail.index('<div class="live-panel"')  # панель предпросмотра шапки — последний блок страницы
    SRC['live'] = tail[li:].strip()
    SRC['overlays'] = tail[:li].strip()


def site_js():
    js = SRC['js']
    def rep(a, b):
        nonlocal js
        assert a in js, a[:80]
        js = js.replace(a, b, 1)
    # корень сайта и текущая страница — из атрибутов <html>
    js = ("const ROOT=document.documentElement.dataset.root||'',PAGE=document.documentElement.dataset.page||'home';\n"
          "const url=u=>/^(https?:|data:|\\/)/.test(u)?u:ROOT+u;\n") + js
    # данные о заведениях не встраиваем в скрипт: их отдаёт data/venues.json (с проверкой свежести)
    js = re.sub(r'const VENUES0=\{.*?\};\n', 'const VENUES0={"v":1,"items":[]};\n', js, count=1, flags=re.S)
    # на страницах без нужного блока селектор возвращает «пустышку», и код этого блока ничего не делает
    rep("const $=s=>document.querySelector(s);",
        "const NUL=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>'':k==='length'?0:k==='then'||k===Symbol.iterator?undefined:NUL,set:()=>true,apply:()=>NUL});\n"
        "const $=s=>document.querySelector(s)||NUL;")
    # живая шапка — только на главной
    rep("const HERO=(()=>{", "const HERO=!document.getElementById('hero2')?{init(){},suggest:{w:'in'}}:(()=>{")
    # фильтры мест: если на странице нет сетки мест, переходим в раздел «Места» с этим фильтром
    rep("function applyFilter(f,scroll){",
        "function goPlaces(f){location.href=ROOT+'mesta/?f='+encodeURIComponent(JSON.stringify(f||{}))}\n"
        "function applyFilter(f,scroll){if(!document.getElementById('placeGrid')){goPlaces(f);return}")
    rep("$('#searchForm').addEventListener('submit',e=>{e.preventDefault();",
        "$('#searchForm').addEventListener('submit',e=>{e.preventDefault();if(PAGE!=='places'){goPlaces({q:$('#q').value.trim()});return}")
    rep("$('#searchJump').addEventListener('click',()=>{",
        "$('#searchJump').addEventListener('click',()=>{if(!document.getElementById('q')){location.href=ROOT+'mesta/#all';return}")
    rep("fetch('data/venues.json',{cache:'no-store'})", "fetch(ROOT+'data/venues.json',{cache:'no-cache'})")
    rep("renderAll();renderCatalog();renderMap();renderRoute()}).catch(()=>{});",
        "renderAll();renderCatalog();renderMap();renderRoute();safe(renderStamps);if(!plan.length)safe(roll);document.dispatchEvent(new Event('venues'))}).catch(()=>{});")
    rep("const MAP_URL='map.html';", "const MAP_URL=ROOT+'map.html';")
    rep("fetch('report.php',", "fetch(ROOT+'report.php',")
    rep("const photo=p=>p.ph||PHOTOS[p.id]||PHOTOS[p.name]||null;",
        "const photo=p=>{const f=p.ph||PHOTOS[p.id]||PHOTOS[p.name]||null;return f?[url(f[0]),...f.slice(1)]:null};")
    # первый запуск: каждый блок отдельно, чтобы ошибка одного не ломала остальные
    rep("HERO.init();renderDates();renderAll();renderPick();renderRoute();renderMap();renderStamps();roll();",
        "[HERO.init,renderDates,renderAll,renderPick,renderMap,renderStamps].forEach(safe);if(PLACES.length)safe(roll);\n"
        "if(PAGE==='places'){F.showAll=true;const P=new URLSearchParams(location.search);try{const f=JSON.parse(P.get('f')||'null');"
        "if(f){applyFilter(f,false);if(f.q){CF.q=f.q;$('#catQ').value=f.q;renderCatalog()}}}catch(e){}}")
    # страницы заведений: карточка ведёт на страницу места, если она есть (карту id→адрес заполняет venue_pages.py)
    rep("const o=e.target.closest('[data-open]');if(o&&!e.target.closest('.sheet')){",
        "const o=e.target.closest('[data-open]');if(o&&VSLUG[o.dataset.open]&&!e.target.closest('.sheet')){if(!e.target.closest('a'))location.href=ROOT+'mesto/'+VSLUG[o.dataset.open]+'/';return}if(o&&!e.target.closest('.sheet')){")
    rep('<div class="card-body"><h3>${p.name}</h3>',
        '<div class="card-body"><h3>${VSLUG[p.id]?`<a class="card-link" href="${ROOT}mesto/${VSLUG[p.id]}/">${p.name}</a>`:p.name}</h3>')
    rep("<h3>${p.name}</h3>${p.why?",
        "<h3>${p.name}</h3>${VSLUG[p.id]?`<p><a class=\"btn btn-primary\" style=\"text-decoration:none\" href=\"${ROOT}mesto/${VSLUG[p.id]}/\">Страница места →</a></p>`:''}${p.why?")
    rep("then(V=>{if(!V||!V.items)return;applyVenues(V);", "then(V=>{if(!V||!V.items)return;window.VRAW=V;applyVenues(V);")
    js += "\ndocument.querySelectorAll('[data-st]').forEach(e=>{const s=OH.status(e.dataset.st);if(s){e.textContent=s.txt;e.classList.add(s.open?'on':'off')}});\n"
    js = "const safe=f=>{try{f()}catch(e){console.warn(e)}};\nconst VSLUG={};\n" + js
    return js


PAGE_CSS = r'''
/* ===== многостраничность ===== */
.nav a[aria-current="page"]{background:var(--yellow);color:#111;border-color:#111}
.page-head{border-bottom:var(--bd);background:var(--surface-2)}
.page-head .wrap{padding-block:clamp(22px,4vw,44px) clamp(20px,3vw,34px)}
.crumbs{display:flex;flex-wrap:wrap;gap:6px;font-size:13px;font-weight:700;color:var(--ink-2);margin:0 0 12px;padding:0;list-style:none}
.crumbs li+li::before{content:'›';margin-right:6px;color:var(--ink-2)}
.crumbs a{color:var(--ink);text-decoration:none;border-bottom:1.5px solid var(--line)}
.page-head h1{font-family:var(--font-display);font-weight:900;font-size:clamp(28px,4.4vw,56px);line-height:.98;letter-spacing:-.03em;text-transform:uppercase;margin:0}
.page-head .lead{max-width:62ch;margin:12px 0 0;font-size:clamp(15px,1.4vw,17px);color:var(--ink-2)}
.page-head .tag{display:inline-block;transform:rotate(-2deg);background:var(--yellow);color:#111;border:2px solid #111;border-radius:10px;padding:2px 10px;font-weight:800;font-size:13px;margin-bottom:12px;box-shadow:3px 3px 0 #111}
.promo{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}
.promo a{display:flex;flex-direction:column;gap:8px;text-decoration:none;color:#111;border:2px solid #111;border-radius:24px;padding:22px 22px 20px;box-shadow:4px 4px 0 var(--line);transition:transform .15s}
.promo a:hover{transform:translate(-2px,-2px)}
.promo a b{font-family:var(--font-display);font-weight:900;font-size:20px;text-transform:uppercase;letter-spacing:-.01em}
.promo a span{font-size:15px;line-height:1.4}
.promo a i{font-style:normal;font-weight:800;margin-top:auto;padding-top:6px}
.promo .p1{background:#FFD43B}.promo .p2{background:#B9E4FF}.promo .p3{background:#C9F2D2}
.link-more{text-decoration:underline;text-underline-offset:4px}
a.link-more{display:inline-flex;align-items:center;gap:6px}
.card-link{color:inherit;text-decoration:none}.card-link:hover{text-decoration:underline}
.prose{max-width:70ch;font-size:16px;line-height:1.6}
.prose h2{font-family:var(--font-display);font-weight:900;text-transform:uppercase;font-size:clamp(20px,2.4vw,28px);margin:34px 0 10px}
.prose p,.prose li{color:var(--ink)}
.prose a{color:var(--ink);font-weight:700}
.prose .cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:18px}
.foot-nav{display:flex;flex-wrap:wrap;gap:8px 18px}
'''


def shell(*, title, desc, root, page, active, body, head_extra='', live=False):
    nav = ''.join(f'<a href="{root}{h}"{" aria-current=\"page\"" if k == active else ""}>{t}</a>' for h, t, k in NAV)
    header = re.sub(r'<nav class="nav" id="nav">.*?</nav>', f'<nav class="nav" id="nav">\n      {nav}\n    </nav>', SRC['header'], flags=re.S)
    header = header.replace('<a class="logo" href="#top"', f'<a class="logo" href="{root or "./"}"')
    foot_links = (f'<a href="{root}o-proekte/">О проекте</a><a href="{root}kuda-shodit/">Куда сходить</a>'
                  f'<a href="{root}o-proekte/#owners">Добавить место</a><a href="{root}mesta/#all">Все заведения</a><a href="{root}map.html">Карта</a>')
    footer = re.sub(r'<nav>.*?</nav>', f'<nav class="foot-nav">{foot_links}</nav>', SRC['footer'], flags=re.S)
    footer = footer.replace('<a class="logo" href="#top">', f'<a class="logo" href="{root or "./"}">')
    full = f'{SITE_URL}{page}'
    return f'''<!doctype html>
<html lang="ru" data-root="{root}" data-page="{active}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{full}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Куда сходить в Томске">
<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:url" content="{full}">
<meta name="theme-color" content="#FFD43B">
<link rel="icon" href="{root}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800;900&family=Golos+Text:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="{root}assets/site.css">
{head_extra}</head>
<body>
{header}
<main id="top">
{body}
</main>
{footer}
{SRC['overlays']}
{SRC['live'] if live else ''}
<script src="{root}assets/site.js" defer></script>
</body>
</html>
'''


def page_head(root, crumbs, h1, lead='', tag=''):
    cr = ''.join(f'<li><a href="{root}{h}">{t}</a></li>' if h is not None else f'<li><span>{t}</span></li>' for h, t in crumbs)
    return (f'<header class="page-head"><div class="wrap"><ol class="crumbs">{cr}</ol>'
            f'{f"<span class=tag>{tag}</span>" if tag else ""}<h1>{h1}</h1>{f"<p class=lead>{lead}</p>" if lead else ""}</div></header>')


def drop_head(sec):
    """Убирает заголовок раздела, когда его заменяет заголовок страницы."""
    return re.sub(r'<div class="sec-head">.*?</div></div>', '', sec, count=1, flags=re.S)


def build(out):
    S = SRC['sec']
    os.makedirs(out + '/assets', exist_ok=True)
    open(out + '/assets/site.css', 'w', encoding='utf-8').write(SRC['css'] + PAGE_CSS)
    open(out + '/assets/site.js', 'w', encoding='utf-8').write(site_js())
    home_crumb = [('', 'Главная')]
    pages = []

    # главная: живая шапка с подбором «с кем / когда», варианты, сценарии, афиша, деревянный Томск и карта
    import scenarios
    more = lambda h, t: f'<a class="link-more" href="{h}">{t} <svg class="ico" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>'
    events_home = S['events'].replace('</p></div></div>', '</p></div>' + more('sobytiya/', 'Вся афиша') + '</div>', 1)
    ideas = ('<section id="ideas"><div class="wrap"><div class="sec-head"><div><h2>Идеи на любой случай</h2></div>'
             + more('kuda-shodit/', 'Все идеи') + '</div>' + scenarios.tiles('') + '</div></section>')
    promo = '''<section id="promo"><div class="wrap"><div class="promo">
  <a class="p2" href="derevyannyj-tomsk/"><b>Деревянный Томск</b><span>Резные дома, терема и наличники. Найдите все и соберите штампы в паспорт.</span><i>Открыть паспорт →</i></a>
  <a class="p3" href="mesta/"><b>Выбор редакции</b><span>Все места, которые мы проверили и описали сами, и полная база заведений города.</span><i>Смотреть места →</i></a>
  <a class="p1" href="map.html"><b>Карта 2D и 3D</b><span>Весь город с домами, рельефом и заведениями. Можно облететь центр в 3D.</span><i>Открыть карту →</i></a>
</div></div></section>'''
    home = '\n'.join([S['hero2'], S['pickRes'], ideas, events_home, promo])
    pages.append(('', shell(title='Куда сходить в Томске — идеи на сегодня, вечер и выходные', root='', page='', active='home', live=True,
                            desc='Куда сходить в Томске сегодня: подберём места под компанию и время — вдвоём, с друзьями, с детьми, вечером или в выходные. Без рекламы.', body=home)))

    def inner(slug, active, title, desc, h1, lead, body, crumbs_extra=(), tag=''):
        r = '../'
        b = page_head(r, home_crumb + list(crumbs_extra) + [(None, h1)], h1, lead, tag) + '\n' + body
        pages.append((slug, shell(title=title, desc=desc, root=r, page=slug, active=active, body=b)))

    no_more = re.sub(r'<button class="link-more" id="morePlaces">.*?</button>', '', S['places'], flags=re.S)
    no_more = no_more.replace('<h2>Популярные места</h2>', '<h2>Выбор редакции</h2>')
    inner('mesta/', 'places', 'Места Томска: кафе, музеи, парки, достопримечательности — Куда сходить в Томске',
          'Все места Томска в одном каталоге: выбор редакции и полная база заведений с часами работы, адресами и фильтрами.',
          'Места Томска', 'Выбор редакции — места, которые мы проверили и описали сами. Ниже — полная база заведений города с поиском и часами работы.',
          '\n'.join([S['cats-sec'], no_more, S['all']]))
    inner('sobytiya/', 'events', 'Афиша событий Томска — Куда сходить в Томске', 'Концерты, спектакли, выставки и прогулки в Томске по дням.',
          'Афиша событий', 'Выберите день: точки под датами отмечают дни, когда что-то происходит. Афиша пока демонстрационная — скоро подключим настоящую.',
          drop_head(S['events']))
    inner('derevyannyj-tomsk/', 'wood', 'Деревянный Томск: резные дома и паспорт прогулки — Куда сходить в Томске',
          'Деревянное зодчество Томска: Дом с шатром, Дом с драконами, Дом с жар-птицами и другие резные дома. Паспорт со штампами.',
          'Деревянный Томск', 'В Томске сохранилось одно из лучших в России собраний деревянного зодчества. Пройдитесь по резным домам и соберите штампы.',
          S['passport'] + '\n<section><div class="wrap"><a class="btn btn-primary" href="../mesta/?f=%7B%22q%22%3A%22%D0%B4%D0%B5%D1%80%D0%B5%D0%B2%22%7D">Показать деревянные дома в каталоге →</a></div></section>')
    about = '''<section><div class="wrap prose">
  <p><b>«Куда сходить в Томске»</b> — некоммерческий городской гид. Без рекламы и платных мест в выдаче: мы показываем то, что сами считаем интересным.</p>
  <h2>Откуда данные</h2>
  <ul>
    <li><b>Описания мест</b> пишет редакция сайта.</li>
    <li><b>Адреса, часы работы и контакты</b> — с официальных сайтов заведений и из открытой базы <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> (лицензия ODbL).</li>
    <li><b>Фото</b> — Wikimedia Commons (авторы и лицензии подписаны под каждым снимком) и сами заведения.</li>
    <li><b>Карта</b> — здания и улицы OpenStreetMap, рельеф SRTM.</li>
  </ul>
  <h2 id="owners">Владельцам заведений</h2>
  <p>Если вы владелец места, а у нас устарели часы работы, цены или нет фото, — напишите, и мы обновим карточку. Добавление бесплатно.</p>
  <div class="cta"><button class="btn btn-primary" data-report="">Добавить место или исправить данные</button><a class="btn btn-ghost" href="../mesta/#all">Найти своё место в каталоге</a></div>
  <h2>Нашли ошибку?</h2>
  <p>На карточке каждого места есть кнопка «Нашли ошибку». Сообщение придёт редакции, после проверки мы исправим данные.</p>
</div></section>'''
    inner('o-proekte/', 'about', 'О проекте — Куда сходить в Томске', 'Некоммерческий гид по Томску без рекламы: откуда данные и как добавить своё место.',
          'О проекте', 'Городской гид по Томску, сделанный с любовью к городу.', about)

    for slug, html in pages:
        d = os.path.join(out, slug)
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(html)
    return [p for p, _ in pages]


if __name__ == '__main__':
    load(sys.argv[1])
    print('pages:', build(sys.argv[2]))
