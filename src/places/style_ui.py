# -*- coding: utf-8 -*-
"""Стиль «Яркий город»: живая открытка-наклейка в шапке и обновлённое оформление всей главной."""
import sys, re
D = sys.argv[1]
H = open(D + '/tomsk.html').read()
HERO_JS = open(D + '/places/hero2.js').read()

def rep(a, b, cnt=1):
    global H
    assert a in H, a[:100]
    H = H.replace(a, b, cnt)

# шрифты: Unbounded (заголовки) + Golos Text (текст)
H = re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/css2\?[^"]*">',
           '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800;900&family=Golos+Text:wght@400;500;600;700;800&display=swap">', H, count=1)

# логотип-наклейка
H = re.sub(r'<a class="logo" href="#top"([^>]*)>\s*<svg.*?</svg>\s*<span>Куда сходить<br>в Томске\?</span>\s*</a>',
           r'<a class="logo" href="#top"\1><span class="logo-st">КУДА СХОДИТЬ</span><span class="logo-sub">в Томске</span></a>', H, count=1, flags=re.S)

# новая шапка-открытка
i0 = H.index('<section class="hero" style="padding:0">'); i1 = H.index('</section>', i0) + len('</section>')
HERO_HTML = '''<section class="hero2" id="hero2">
  <div class="wrap">
    <div class="h2-head">
      <h1><span id="hGreet">Добрый день</span><br>в Томске <span class="h2-temp" id="hTemp" hidden></span></h1>
      <div class="h2-side">
        <p class="h2-wx" id="hWx">Афиша, места и идеи для выходных</p>
        <form class="search" id="searchForm" role="search">
          <svg class="ico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
          <input id="q" type="search" placeholder="Кафе, музей, улица…" aria-label="Поиск мест, событий или идей">
          <button class="btn" type="submit">Найти</button>
        </form>
      </div>
    </div>
    <div class="h2-card">
      <div class="hero-art" id="heroArt"></div>
      <canvas id="heroFx" aria-hidden="true"></canvas><div id="heroFlash"></div>
      <button class="live-pill" id="livePill" aria-expanded="false" title="Картинка следует за временем, погодой и праздниками Томска"><span class="pulse"></span><span id="liveTxt">Томск</span></button>
      <div class="h2-sticker" id="hand" aria-live="polite"></div>
      <div class="h2-bottom"><button class="h2-go" id="heroGo"><span id="heroGoTxt">Куда пойти сейчас</span> →</button><span class="live-sub" id="liveSub"></span></div>
    </div>
    <div class="chips" id="heroChips"></div>
  </div>
</section>'''
H = H[:i0] + HERO_HTML + H[i1:]

# новый модуль шапки вместо старого
j0 = H.index('const HERO=(()=>{'); j1 = H.index("return{init,suggest:{w:'in'}}})();", j0) + len("return{init,suggest:{w:'in'}}})();")
H = H[:j0] + HERO_JS.strip() + H[j1:]

CSS = r'''
/* ===== стиль «Яркий город» ===== */
:root{--bg:#FFFDF5;--surface:#FFFFFF;--surface-2:#F4EFE0;--ink:#111111;--ink-2:#4A4A44;--line:#111111;--soft:#E6E0CF;
  --forest:#111111;--forest-2:#2A2A2A;--on-forest:#FFFDF5;--amber:#FF5A36;--wood:#FF5A36;--yellow:#FFD43B;--coral:#FF5A36;--blue:#3B2BD9;--sky:#B9E4FF;--mint:#C9F2D2;--pink:#FFC3D0;
  --map-land:#F4EFE0;--map-road:#FFFFFF;--map-block:#E6E0CF;--river:#6FB7F2;--shadow:none;--bd:2px solid var(--line);--pop:4px 4px 0 var(--line);
  --font-body:'Golos Text',system-ui,-apple-system,'Segoe UI',sans-serif;--r:22px}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#12131A;--surface:#1B1D27;--surface-2:#242733;--ink:#FFFDF5;--ink-2:#C9C5B8;--line:#FFFDF5;--soft:#33374A;--forest:#FFD43B;--forest-2:#FFE27A;--on-forest:#111111;--map-land:#1B1D27;--map-road:#33374A;--map-block:#242733;--river:#2F5C8A}}
:root[data-theme="dark"]{--bg:#12131A;--surface:#1B1D27;--surface-2:#242733;--ink:#FFFDF5;--ink-2:#C9C5B8;--line:#FFFDF5;--soft:#33374A;--forest:#FFD43B;--forest-2:#FFE27A;--on-forest:#111111;--map-land:#1B1D27;--map-road:#33374A;--map-block:#242733;--river:#2F5C8A}
body{font-family:var(--font-body)}
.top{background:color-mix(in srgb,var(--bg) 92%,transparent);border-bottom:var(--bd)}
.logo{gap:8px;align-items:center}
.logo-st{font-family:var(--font-display);font-weight:900;font-size:16px;letter-spacing:0;background:var(--yellow);color:#111;padding:5px 10px;border-radius:10px;border:2px solid #111;transform:rotate(-2deg);display:inline-block}
.logo-sub{font-family:var(--font-body);font-weight:700;font-size:13px;text-transform:none;letter-spacing:0}
.nav{gap:2px}.nav a{color:var(--ink);font-weight:700;font-size:14px;padding:6px 10px;border-radius:999px;border:2px solid transparent;white-space:nowrap}
@media (max-width:1180px) and (min-width:901px){.nav a{font-size:13px;padding:6px 7px}.logo-sub{display:none}}
.nav a:hover{border-color:var(--line)}
.icon-btn{border:2px solid transparent}.icon-btn:hover{background:var(--yellow);border-color:#111;color:#111}
.btn{border:var(--bd);font-weight:800}.btn-primary{background:var(--forest);color:var(--on-forest)}.btn-primary:hover{background:var(--forest-2)}
.btn-ghost{background:var(--surface);color:var(--ink)}.btn-ghost:hover{background:var(--yellow);color:#111}
.sec-head h2{font-weight:900;font-size:clamp(24px,3vw,36px);letter-spacing:-.02em;text-transform:uppercase}
.link-more{color:var(--ink);font-weight:800;text-decoration:underline;text-underline-offset:4px}

/* шапка-открытка */
.hero2{padding-block:22px 10px}
.h2-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px 32px;flex-wrap:wrap}
.hero2 h1{font-family:var(--font-display);font-weight:900;font-size:clamp(38px,6.4vw,84px);line-height:.92;letter-spacing:-.035em;text-transform:uppercase;max-width:none}
.h2-temp{display:inline-block;background:var(--yellow);color:#111;padding:0 .16em;border-radius:.2em;border:2px solid #111;transform:rotate(2deg);font-size:.86em}
.h2-temp[hidden]{display:none}
.h2-temp[data-cold="1"]{background:var(--blue);color:#FFFDF5}
.h2-side{flex:1 1 300px;min-width:0;max-width:460px;display:flex;flex-direction:column;gap:12px;padding-bottom:6px}
.h2-wx{margin:0;font-weight:700;font-size:16px}
.hero2 .search{background:var(--surface);border:var(--bd);box-shadow:var(--pop);max-width:none;width:100%;min-width:0}
.hero2 .search input{color:var(--ink)}.hero2 .search input::placeholder{color:var(--ink-2)}
.hero2 .search .btn{background:var(--forest);color:var(--on-forest);border-color:var(--line)}.hero2 .search .btn:hover{background:var(--forest-2)}
section[id],main [id]{scroll-margin-top:92px}
.h2-card{position:relative;margin-top:22px;border:var(--bd);border-radius:32px;overflow:hidden;height:clamp(300px,38vw,470px);background:#9FD8FF;box-shadow:var(--pop)}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .h2-card{box-shadow:6px 6px 0 var(--yellow);border-color:#FFFDF5}}
:root[data-theme="dark"] .h2-card{box-shadow:6px 6px 0 var(--yellow);border-color:#FFFDF5}
.h2-card .hero-art{position:absolute;inset:0}.h2-card .hero-art svg{width:100%;height:100%;display:block}
.h2-card .live-pill{position:absolute;left:18px;top:18px;z-index:3;background:#FFFDF5;color:#111;border:2px solid #111;backdrop-filter:none}
.h2-sticker{position:absolute;right:20px;top:20px;z-index:3;max-width:min(320px,60%);transform:rotate(4deg);background:#FFFDF5;color:#111;border:2px solid #111;border-radius:16px;padding:10px 16px;font-family:var(--font-display);font-weight:800;font-size:clamp(14px,1.6vw,19px);line-height:1.15;box-shadow:3px 3px 0 #111}
.h2-sticker:empty{display:none}
.h2-bottom{position:absolute;left:18px;right:18px;bottom:18px;z-index:3;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.h2-go{height:50px;padding:0 22px;border-radius:999px;background:#111;color:#FFFDF5;border:2px solid #111;font-weight:800;font-size:15px}
.h2-go:hover{background:var(--yellow);color:#111}
.h2-bottom .live-sub{background:#FFFDF5;color:#111;border:2px solid #111;border-radius:999px;padding:6px 12px;font-size:13px;font-weight:700;opacity:1}
.h2-bottom .live-sub:empty{display:none}
#heroArt .st{animation:tw 2.6s ease-in-out infinite}
#heroArt svg *{transition:fill 1s,opacity .8s}
.hero2 .chips{max-width:none;margin-top:18px}
.chip{height:40px;padding:0 16px;font-size:14px;font-weight:800;background:var(--surface);color:var(--ink);border:var(--bd)}
.chip:hover,.chip[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
@media (max-width:640px){.h2-card{border-radius:24px;height:340px}.h2-sticker{max-width:58%;right:12px;top:58px}.h2-card .live-pill{left:12px;top:12px;max-width:calc(100% - 24px)}.h2-bottom{left:12px;right:12px;bottom:12px}.h2-bottom .live-sub{display:none}.h2-go{height:42px;font-size:13.5px;padding-inline:14px}.h2-sticker{font-size:13px;padding:7px 12px}}
.live-panel{border:var(--bd);box-shadow:var(--pop)}.lp-row button{border:2px solid var(--line);background:var(--surface)}

/* полоса «сейчас» */
.nowbar{margin-top:14px}.nowbar .pill{border:var(--bd);box-shadow:none;background:var(--surface)}.nowbar .pill b{color:var(--ink)}

/* категории — цветные плитки */
.cat .tile{border:var(--bd);border-radius:20px;color:#111}
.cat:nth-child(5n+1) .tile{background:var(--yellow)}.cat:nth-child(5n+2) .tile{background:var(--sky)}.cat:nth-child(5n+3) .tile{background:var(--mint)}.cat:nth-child(5n+4) .tile{background:var(--pink)}.cat:nth-child(5n+5) .tile{background:#FFB38A}
.cat:hover .tile{transform:translate(-2px,-2px);box-shadow:var(--pop)}
.cat[aria-pressed="true"] .tile{background:#111;color:#FFFDF5}
.cat{font-weight:800}

/* фильтры и переключатели */
.seg{background:var(--surface);border:var(--bd);padding:3px}
.seg button{color:var(--ink);font-weight:800}.seg button[aria-pressed="true"]{background:var(--ink);color:var(--bg);box-shadow:none}
.active-filter{background:var(--yellow);color:#111;border:2px solid #111}
.count{font-weight:700}

/* карточки */
.card{border:var(--bd);border-radius:22px;box-shadow:none;transition:transform .15s,box-shadow .15s}
.card:hover{transform:translate(-3px,-3px);box-shadow:var(--pop)}
.media{border-bottom:var(--bd)}
.card h3{font-family:var(--font-display);font-weight:800;font-size:16px;letter-spacing:-.01em}
.meta{font-weight:600}
.fav{background:#FFFDF5;color:#111;border:2px solid #111;backdrop-filter:none}
.fav[aria-pressed="true"]{background:var(--pink);color:#D2243A}
.add{background:var(--surface);border:2px solid var(--line);height:32px;padding:0 12px}.add:hover{background:var(--yellow);color:#111}.add[aria-pressed="true"]{background:var(--ink);color:var(--bg)}
.empty{border:2px dashed var(--line);border-radius:22px}
.tag{background:var(--surface);border:2px solid var(--line);color:var(--ink)}.tag.free{background:var(--mint);color:#111}

/* события */
.date{border:var(--bd);border-radius:14px}.date[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:var(--bg)}
.date.has::after{background:var(--coral)}.date.weekend small{color:var(--coral)}
.ev-date{border:2px solid #111;background:var(--yellow)}

/* «Удиви меня» */
.surprise{border:var(--bd);border-radius:28px;box-shadow:var(--pop)}
.s-left{background:var(--coral);color:#111;border-right:var(--bd)}
.s-left h2{font-weight:900;text-transform:uppercase}
.opt button{background:#FFFDF5;color:#111;border:2px solid #111}.opt button[aria-pressed="true"]{background:#111;color:#FFFDF5}
.s-left .go{background:#111;color:#FFFDF5}
.plan-step{background:var(--surface);border:var(--bd)}
.plan-thumb{border:2px solid var(--line)}

/* мини-карта */
.mapbox{border:var(--bd);border-radius:28px;box-shadow:var(--pop)}
.map-side{background:var(--blue);color:#FFFDF5;border-right:var(--bd)}
.map-side h2{font-weight:900;text-transform:uppercase}
.map-side .btn{background:var(--yellow)!important;color:#111!important;border:2px solid #111}
.legend button{background:rgba(255,253,245,.16);color:#FFFDF5;border:2px solid rgba(255,253,245,.7)}.legend button[aria-pressed="true"]{background:#FFFDF5;color:#111;border-color:#FFFDF5}
.pin svg.shape path{stroke:#111;stroke-width:2.5}
.pop{border:var(--bd);box-shadow:var(--pop)}

/* паспорт и подборки */
.passport{border:var(--bd);border-radius:28px;box-shadow:none;background:var(--mint);color:#111}
.passport p{color:#2A2A2A}.passport h2{font-weight:900;text-transform:uppercase}
.stamp{border-color:#111;background:#FFFDF5;color:#111}.stamp small{color:#4A4A44}.stamp .seal{color:#B9B3A2}
.stamp[aria-pressed="true"]{border-color:#111;background:var(--yellow)}.stamp[aria-pressed="true"] .seal{color:#111}
.stamp.reward.got{background:#111;color:#FFFDF5}
.meter{background:#FFFDF5;border:2px solid #111;height:14px}.meter i{background:#111}
.coll{border:var(--bd);border-radius:22px}

/* каталог */
.cat-q{border:var(--bd);box-shadow:none}
.cat-chips button{background:var(--surface);border:2px solid var(--line);color:var(--ink);font-weight:800;height:38px}
.cat-chips button[aria-pressed="true"]{background:var(--ink);color:var(--bg)}
.vrow{border:var(--bd);box-shadow:none;border-radius:20px}
.vrow h3{font-family:var(--font-display);font-weight:800;font-size:15px}
.vrow .acts a,.vrow .acts button{border:2px solid var(--line);background:var(--surface)}
.vrow .acts a:hover,.vrow .acts button:hover{background:var(--yellow);color:#111}
.vthumb{border:2px solid var(--line)}

/* окна */
.sheet{border:var(--bd);box-shadow:6px 6px 0 #111;border-radius:24px}
.sheet .media{border-bottom:var(--bd)}
.sheet .x,.pop .x{background:#FFFDF5;color:#111;border:2px solid #111}
.drawer{border-left:var(--bd);box-shadow:none}.r-item{background:var(--surface);border:2px solid var(--line)}.r-num{background:var(--yellow);color:#111;border:2px solid #111}
.route-fab{box-shadow:var(--pop)!important}
.facts>div{border:2px solid var(--line)!important;background:var(--surface)!important}
.oh.on b{color:#1E8A4C}.oh.off b{color:#D2243A}
footer{border-top:var(--bd);background:var(--yellow);color:#111}footer nav{color:#111}.fine{color:#2A2A2A}
'''
rep('</style>', CSS + '</style>')
open(D + '/tomsk.html', 'w').write(H)
print('ok')
