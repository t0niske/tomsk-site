# -*- coding: utf-8 -*-
"""Страницы заведений: mesto/<slug>/index.html для мест из src/venue/pages.json.

    python3 src/venue_pages.py <собранная tomsk.html> <папка сайта>

Запускать после src/pages.py (нужен assets/site.js). Текст страницы рисует src/venue/render.js —
тот же код в браузере перерисовывает страницу из свежего data/venues.json.
"""
import json, os, subprocess, sys
from datetime import date
sys.path.insert(0, os.path.dirname(__file__))
import pages

HERE = os.path.dirname(os.path.abspath(__file__))

VENUE_CSS = r'''
/* ===== страница заведения ===== */
.v-head{border-bottom:var(--bd);background:var(--surface-2)}
.v-head .wrap{padding-block:clamp(20px,3.4vw,40px) 24px}
.v-head .tag{display:inline-block;transform:rotate(-2deg);background:var(--yellow);color:#111;border:2px solid #111;border-radius:10px;padding:2px 10px;font-weight:800;font-size:13px;margin-bottom:12px;box-shadow:3px 3px 0 #111}
.v-head h1{font-family:var(--font-display);font-weight:900;font-size:clamp(28px,4.6vw,58px);line-height:.98;letter-spacing:-.03em;text-transform:uppercase;margin:0;max-width:22ch}
.v-why{margin:12px 0 0;font-size:clamp(16px,1.6vw,19px);font-weight:600;max-width:60ch}
.v-badges{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.v-badge{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border:2px solid var(--line);border-radius:999px;background:var(--surface);font-weight:700;font-size:14px}
.v-badge .ico{width:16px;height:16px}
.v-badge[hidden]{display:none}
.v-addr{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin:10px 0 0;font-weight:600}.v-addr .ico{width:18px;height:18px}.v-addr a{color:var(--ink);font-weight:800;font-size:14px}
#how{scroll-margin-top:90px}
.v-badge.v-mood{background:transparent}
.v-status.open{background:#C9F2D2;color:#0F3D25;border-color:#111}.v-status.closed{background:#FFD9D0;color:#5A1A0E;border-color:#111}
.v-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
.v-actions .btn{display:inline-flex;align-items:center;gap:8px;background:var(--surface);color:var(--ink);text-decoration:none}
.v-actions .btn .ico{width:18px;height:18px}
.v-actions .btn[aria-pressed="true"]{background:var(--yellow);color:#111;border-color:#111}
.v-grid{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:32px;align-items:start;padding-block:28px}
.v-photo{margin:0;border:var(--bd);border-radius:24px;overflow:hidden;background:var(--surface-2);box-shadow:var(--pop)}
.v-photo img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover}
.v-photo figcaption{font-size:12px;color:var(--ink-2);padding:8px 14px;border-top:var(--bd);background:var(--surface)}
.v-photo figcaption a{color:inherit}
.v-nophoto{display:flex;flex-direction:column}.v-nophoto>span{display:grid;place-items:center;aspect-ratio:16/8;font-family:var(--font-display);font-weight:900;font-size:clamp(22px,3vw,34px);text-transform:uppercase;color:#111;text-align:center;padding:20px}
.v-thumbs{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px;margin-top:12px}
.v-thumbs img{width:100%;aspect-ratio:1;object-fit:cover;border:2px solid var(--line);border-radius:14px;display:block}
.v-lead{font-size:clamp(17px,1.7vw,20px);line-height:1.5;font-weight:500;margin:24px 0 0;max-width:65ch}
.v-sec{margin-top:30px;max-width:68ch}
.v-sec h2,.v-more h2{font-family:var(--font-display);font-weight:900;text-transform:uppercase;font-size:clamp(20px,2.2vw,26px);letter-spacing:-.01em;margin:0 0 12px}
.v-sec p{font-size:16px;line-height:1.65;margin:0 0 12px}
.v-list{list-style:none;padding:0;margin:0;display:grid;gap:10px}
.v-list li{position:relative;padding:12px 14px 12px 44px;border:2px solid var(--line);border-radius:16px;background:var(--surface);font-weight:600;line-height:1.4}
.v-list li::before{content:'';position:absolute;left:14px;top:13px;width:18px;height:18px;border-radius:50%;background:var(--yellow);border:2px solid #111}
.v-tips ul{margin:0;padding:16px 18px 16px 36px;border:2px dashed var(--line);border-radius:18px;display:grid;gap:8px;line-height:1.45}
.v-side{position:sticky;top:86px}
.v-card{border:var(--bd);border-radius:24px;background:var(--surface);padding:18px;box-shadow:var(--pop)}
.v-card h2{font-family:var(--font-display);font-weight:900;text-transform:uppercase;font-size:18px;margin:0 0 12px}
.v-card h3{display:flex;align-items:center;gap:8px;font-size:15px;margin:18px 0 8px}
.v-card h3 .ico{width:18px;height:18px}
.v-map{position:relative;display:block;border:2px solid var(--line);border-radius:16px;overflow:hidden;text-decoration:none}
.v-map-btn{position:absolute;right:8px;bottom:8px;background:#FFFDF5;color:#111;border:2px solid #111;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:800}
.mm{display:block;width:100%;height:auto}
.mm-land{fill:#F4EFE0}.mm-green{fill:#CDE8C4}.mm-water{fill:#A9D4F5}.mm-river{fill:none;stroke:#A9D4F5;stroke-width:6;stroke-linecap:round}
.mm-casing{fill:none;stroke:#D8CFB8;stroke-linecap:round;stroke-linejoin:round}.mm-road{fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-linejoin:round}
.mm-bld{fill:#E3DCCB;stroke:#C9BFA8;stroke-width:1}.mm-hl{fill:#FFD43B;stroke:#111;stroke-width:2.5}
.mm-lbl{font:700 13px var(--font-body);fill:#6B6355;paint-order:stroke;stroke:#F4EFE0;stroke-width:4px;stroke-linejoin:round}
.mm-pin path{fill:#FF5A36;stroke:#111;stroke-width:2.5}.mm-pin circle{fill:#FFFDF5;stroke:#111;stroke-width:2}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .mm-land{fill:#242733}:root:not([data-theme="light"]) .mm-green{fill:#24402F}:root:not([data-theme="light"]) .mm-water{fill:#24456A}:root:not([data-theme="light"]) .mm-casing{stroke:#1B1D27}:root:not([data-theme="light"]) .mm-road{stroke:#3A3F54}:root:not([data-theme="light"]) .mm-bld{fill:#33374A;stroke:#40455B}:root:not([data-theme="light"]) .mm-lbl{fill:#C9C5B8;stroke:#242733}}
.v-contacts{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:10px}
.v-contacts li{display:flex;gap:10px;align-items:flex-start;font-weight:600;line-height:1.35;word-break:break-word}
.v-contacts .ico{width:20px;height:20px;flex:none;margin-top:1px}
.v-contacts a{color:var(--ink)}
.v-go{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}
.v-go .btn{justify-content:center;text-decoration:none;background:var(--surface);color:var(--ink);height:40px;font-size:14px}
.v-hours{width:100%;border-collapse:collapse;font-size:14px}
.v-hours th{text-align:left;font-weight:600;padding:5px 0;color:var(--ink-2)}
.v-hours td{text-align:right;font-weight:700;padding:5px 0}
.v-hours tr.today th,.v-hours tr.today td{color:var(--ink);background:color-mix(in srgb,var(--yellow) 45%,transparent)}
.v-hours tr.today th{padding-left:8px;border-radius:8px 0 0 8px}.v-hours tr.today td{padding-right:8px;border-radius:0 8px 8px 0}
.v-hours .off{color:#C0442B}
.v-prices,.v-raw{margin:0;font-size:14px;line-height:1.5}
.v-checked{margin:18px 0 0;padding-top:12px;border-top:1.5px dashed var(--soft);font-size:13px;color:var(--ink-2);line-height:1.5}
.v-checked a{color:inherit}
.lnk{background:none;border:0;padding:0;font:inherit;color:var(--ink);font-weight:700;text-decoration:underline;cursor:pointer;display:inline-flex;align-items:center;gap:4px}
.v-checked .lnk{margin-top:6px}.lnk .ico{width:14px;height:14px}
.v-more{padding-block:18px}
.mc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.mc{display:flex;gap:12px;align-items:center;padding:10px;border:2px solid var(--line);border-radius:18px;background:var(--surface);color:var(--ink);text-decoration:none;text-align:left;font:inherit;cursor:pointer;transition:transform .15s}
.mc:hover{transform:translate(-2px,-2px);box-shadow:3px 3px 0 var(--line)}
.mc-ph{flex:none;width:64px;height:64px;border-radius:12px;overflow:hidden;border:2px solid #111;display:grid;place-items:center}
.mc-ph img{width:100%;height:100%;object-fit:cover}.mc-ph b{font-family:var(--font-display);font-size:24px;color:#111}
.mc-t{display:flex;flex-direction:column;gap:2px;min-width:0}.mc-t b{font-size:15px;line-height:1.25}.mc-t small{color:var(--ink-2);font-size:13px}
a.mc .mc-t b::after{content:' →'}
.v-owner{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;margin-block:18px 40px;padding:20px 22px;border:2px solid #111;border-radius:22px;background:#C9F2D2;color:#111}
.v-owner div{display:flex;flex-direction:column;gap:2px}.v-owner b{font-family:var(--font-display);font-size:18px;text-transform:uppercase}
@media (max-width:900px){.v-grid{grid-template-columns:minmax(0,1fr)}.v-side{position:static}}
@media (max-width:640px){.v-actions .btn{height:42px;padding:0 12px;font-size:14px}.v-photo{border-radius:18px}}
'''


def build(single, out):
    pages.load(single)
    site_js = os.path.join(out, 'assets', 'site.js')
    css_path = os.path.join(out, 'assets', 'site.css')
    css = open(css_path, encoding='utf-8').read()
    if '/* ===== страница заведения' not in css:
        open(css_path, 'a', encoding='utf-8').write(VENUE_CSS)
    # скрипт страницы заведения: отрисовка + поведение в браузере
    open(os.path.join(out, 'assets', 'venue.js'), 'w', encoding='utf-8').write(
        open(os.path.join(HERE, 'venue', 'render.js'), encoding='utf-8').read() + '\n' +
        open(os.path.join(HERE, 'venue', 'client.js'), encoding='utf-8').read())
    plist = os.path.join(HERE, 'venue', 'pages.json')
    PL = json.load(open(plist, encoding='utf-8'))
    js = open(site_js, encoding='utf-8').read()
    js = js.replace('const VSLUG={};', 'const VSLUG=' + json.dumps({p['id']: p['slug'] for p in PL}, ensure_ascii=False) + ';', 1)
    open(site_js, 'w', encoding='utf-8').write(js)
    res = subprocess.run(['node', os.path.join(HERE, 'venue', 'prerender.js'), os.path.join(out, 'data', 'venues.json'), site_js,
                          os.path.join(out, 'tomsk-data.json'), plist, pages.SITE_URL], capture_output=True, text=True, check=True)
    if res.stderr: print(res.stderr, file=sys.stderr)
    R = json.loads(res.stdout)
    slugs = json.dumps({k: v['slug'] for k, v in R.items()}, ensure_ascii=False)
    for vid, p in R.items():
        root = '../../'
        head = (f'<script type="application/ld+json">{p["jsonld"]}</script>\n'
                + (f'<meta property="og:image" content="{p["image"] if p["image"].startswith("http") else pages.SITE_URL + p["image"]}">\n' if p['image'] else ''))
        body = (f'<article id="venue" data-id="{vid}">{p["body"]}</article>\n'
                f'<script type="application/json" id="vSlugs">{slugs}</script>')
        html = pages.shell(title=p['title'], desc=p['desc'].replace('"', '&quot;'), root=root, page=f'mesto/{p["slug"]}/', active='places', body=body, head_extra=head)
        html = html.replace(f'<script src="{root}assets/site.js" defer></script>',
                            f'<script src="{root}assets/site.js" defer></script>\n<script src="{root}assets/venue.js" defer></script>')
        d = os.path.join(out, 'mesto', p['slug'])
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(html)
    # карта сайта для поисковиков
    urls = ['', 'mesta/', 'sobytiya/', 'podborki/', 'derevyannyj-tomsk/', 'udivi-menya/', 'o-proekte/', 'map.html'] + [f'mesto/{p["slug"]}/' for p in R.values()]
    today = date.today().isoformat()
    open(os.path.join(out, 'sitemap.xml'), 'w', encoding='utf-8').write(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + ''.join(f'  <url><loc>{pages.SITE_URL}{u}</loc><lastmod>{today}</lastmod></url>\n' for u in urls) + '</urlset>\n')
    return [p['slug'] for p in R.values()]


if __name__ == '__main__':
    print('venue pages:', build(sys.argv[1], sys.argv[2]))
