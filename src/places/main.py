# -*- coding: utf-8 -*-
"""Вписывает подборку в главную страницу tomsk.html: заменяет PLACES, убирает выдуманные рейтинги и демо-заведения."""
import json, re, sys
D = sys.argv[1]  # scratchpad
H = open(D + '/tomsk.html').read()
PK = json.load(open(D + '/places/places.json'))

# 1) старые настоящие места оставляем, демо — убираем
m = re.search(r'const PLACES = \[\n(.*?)\n\];', H, re.S)
old = [l for l in m.group(1).split('\n') if l.strip() and 'demo:true' not in l]
old = [re.sub(r"rating:[0-9.]+,", '', l).rstrip(',') for l in old]
old = [l.replace("{id:", "{feat:true,id:", 1) for l in old]
names_old = [re.search(r"name:'([^']+)'", l).group(1) for l in old]

CAT = {'food': 'food', 'bar': 'food', 'culture': 'culture', 'church': 'culture', 'nature': 'nature', 'fun': 'fun', 'shop': 'shop', 'sight': 'unusual'}
MINS = {'food': 75, 'bar': 90, 'culture': 90, 'church': 20, 'nature': 60, 'sight': 20, 'fun': 120, 'shop': 30}
MOODTAG = {'date': 'Свидание', 'rain': 'Под крышей', 'kids': 'С детьми', 'wood': 'Деревянный Томск', 'night': 'Вечер', 'free': 'Бесплатно'}
def scene(p):
    k = p['kind'].lower(); c = p['cat']
    if c in ('food',):
        return 'coffee' if re.search('коф|кондит|пекар|десерт', k) else 'cafe'
    if c == 'bar': return 'concert' if 'концерт' in k else 'cafe'
    if c == 'culture':
        if re.search('театр|концерт', k): return 'concert'
        if 'галер' in k: return 'gallery'
        return 'museum'
    if c == 'church': return 'church'
    if c == 'nature': return 'river' if re.search('набереж', p['name'].lower()) else 'garden'
    if c == 'fun': return 'climb' if re.search('батут|верёв|скалод|экстрим', k + p['name'].lower()) else 'fair'
    if c == 'shop': return 'market'
    return 'house'
def price(s, c):
    if not s: return 'null'
    if 'Бесплатно' in s: return '0'
    m = re.search(r'(\d[\d ]*)', s); return str(int(m.group(1).replace(' ', ''))) if m else 'null'
def js(s): return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"
rows = []; seen = set(n.lower()[:10] for n in names_old)
for i, p in enumerate(PK):
    if p['cat'] == 'stay': continue
    if p['name'].lower()[:10] in seen: continue
    seen.add(p['name'].lower()[:10])
    c = CAT[p['cat']]; mo = p['moods']
    indoor = 'rain' in mo or p['cat'] in ('food', 'bar', 'culture', 'shop')
    tags = [p['kind']] + [MOODTAG[m] for m in mo if m in MOODTAG and MOODTAG[m] != p['kind']][:1]
    pr = price(p.get('price'), p['cat'])
    if pr == 'null' and p['cat'] in ('nature', 'sight', 'church'): pr = '0'
    rows.append("  {id:'p%d',name:%s,cat:'%s',tags:[%s],scene:'%s',gx:%d,gy:%d,indoor:%s,price:%s,addr:%s,mins:%d%s%s,desc:%s,why:%s}" % (
        i, js(p['name']), c, ','.join(js(t) for t in tags), scene(p), p['x'], p['y'], 'true' if indoor else 'false', pr, js(p['addr']),
        MINS[p['cat']], ',kids:true' if 'kids' in mo else '', ',rom:true' if 'date' in mo else '', js(p['desc']), js(p['why'])))
new = 'const PLACES = [\n' + ',\n'.join(old + rows) + '\n];'
H = H[:m.start()] + new + H[m.end():]

# 2) рейтинги → тип места; цена null → «цены уточняйте»
H = H.replace("const priceTxt=p=>p===0?'Бесплатно':`от ${p} ₽`;", "const priceTxt=p=>p===0?'Бесплатно':p==null?'уточняйте':`от ${p} ₽`;\nconst tint=id=>{let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))%997;return id[0]==='p'?`filter:hue-rotate(${h%70-35}deg) brightness(${.9+(h%7)/30})`:''};")
H = H.replace('<div class="foot"><span><span class="star">★</span> ${p.rating}</span><span class="price">${priceTxt(p.price)}</span>',
              '<div class="foot"><span class="price">${p.price==null?\'\':priceTxt(p.price)}</span>')
H = H.replace('<div class="media">${scene(p.scene)}<button class="fav" data-fav="${p.id}" aria-pressed="${favs.has(p.id)}" aria-label="В избранное">', '<div class="media"><div style="position:absolute;inset:0;${tint(p.id)}">${scene(p.scene)}</div><button class="fav" data-fav="${p.id}" aria-pressed="${favs.has(p.id)}" aria-label="В избранное">')
H = H.replace('<div class="facts"><div>Рейтинг<b>★ ${p.rating}</b></div><div>Вход<b>${priceTxt(p.price)}</b></div>',
              '<div class="facts"><div>Что это<b>${p.tags[0]}</b></div><div>Вход<b>${priceTxt(p.price)}</b></div>')
H = H.replace('<div class="foot"><span><span class="star">★</span> ${p.rating}</span><button class="add" data-open',
              '<div class="foot"><span class="price">${p.tags[0]}</span><button class="add" data-open')
H = H.replace("function fitBudget(p){return S.budget==='free'?p.price===0:S.budget==='mid'?p.price<=1000:true}",
              "function fitBudget(p){return S.budget==='free'?p.price===0:S.budget==='mid'?(p.price==null||p.price<=1000):true}")
# описание в карточке: «почему» отдельной строкой
H = H.replace('<h3>${p.name}</h3><p class="desc">${p.desc}</p>', '<h3>${p.name}</h3>${p.why?`<p class="desc"><b>${p.why}.</b></p>`:\'\'}<p class="desc">${p.desc}</p>')
# сетка: при поиске/фильтре — до 24, кнопка «все»
H = H.replace("const shown=F.showAll?list:list.slice(0,10);", "const shown=F.showAll?list:list.slice(0,12);")
H = H.replace("$('#morePlaces').hidden=list.length<=10;", "$('#morePlaces').hidden=list.length<=12;")
# мини-карта: только «избранные» места с координатами схемы
H = H.replace("${PLACES.map(p=>{const dim=mapCat&&p.cat!==mapCat;", "${PLACES.filter(p=>p.feat).map(p=>{const dim=mapCat&&p.cat!==mapCat;")
H = H.replace("const rpts=route.map(byId).filter(Boolean);", "const rpts=route.map(byId).filter(p=>p&&p.feat);")
# Яндекс-ссылка для всех настоящих мест
# демо-события, привязанные к выдуманным местам, — убрать
H = re.sub(r"\n  \{id:'e5'[^\n]*", '', H); H = re.sub(r"\n  \{id:'e7'[^\n]*", '', H)
H = H.replace("{id:'e3',d:17,title:'Маркет локальных брендов',place:'Томская филармония, фойе'", "{id:'e3',d:17,title:'Маркет локальных брендов',place:'Томская филармония, фойе'")
open(D + '/tomsk.html', 'w').write(H)
print('places', len(old), '+', len(rows))

# 3) фото с Wikimedia Commons (свободные лицензии, с указанием автора)
PH = json.load(open(D + '/places/photos.json'))
H = open(D + '/tomsk.html').read()
H = H.replace("const byId=id=>PLACES.find(p=>p.id===id);", "const byId=id=>PLACES.find(p=>p.id===id);\nconst PHOTOS=" + json.dumps(PH, ensure_ascii=False) + ";\nconst photo=p=>PHOTOS[p.id]||PHOTOS[p.name]||null;\nconst phImg=p=>{const f=photo(p);return f?`<img class=\"ph\" src=\"${f[0]}\" alt=\"${p.name}\" loading=\"lazy\" referrerpolicy=\"no-referrer\" onerror=\"this.remove()\">`:''};\nconst phCredit=p=>{const f=photo(p);return f?`<p class=\"credit\">Фото: <a href=\"${f[3]}\" target=\"_blank\" rel=\"noopener\">${f[1]}</a>, ${f[2]} · Wikimedia Commons</p>`:''};", 1)
H = H.replace('<div class="media"><div style="position:absolute;inset:0;${tint(p.id)}">${scene(p.scene)}</div>', '<div class="media"><div style="position:absolute;inset:0;${tint(p.id)}">${scene(p.scene)}</div>${phImg(p)}')
H = H.replace('<button class="x" id="sheetX" aria-label="Закрыть">${ico(\'x\')}</button><div class="media">${scene(p.scene)}', '<button class="x" id="sheetX" aria-label="Закрыть">${ico(\'x\')}</button><div class="media">${scene(p.scene)}${phImg(p)}')
H = H.replace('<div class="where">${ico(\'pin\')}${p.addr}</div>\n  <div class="plan-actions">', '<div class="where">${ico(\'pin\')}${p.addr}</div>${phCredit(p)}\n  <div class="plan-actions">')
H = H.replace('.media svg{position:absolute;inset:0;width:100%;height:100%;display:block}', '.media svg{position:absolute;inset:0;width:100%;height:100%;display:block}\nimg.ph{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}\n.credit{font-size:11.5px;color:var(--ink-2);margin:6px 0 0}.credit a{color:inherit}')
H = H.replace('<div class="plan-thumb">${scene(p?p.scene:s.scene)}</div>', '<div class="plan-thumb">${scene(p?p.scene:s.scene)}${p?phImg(p):\'\'}</div>')
H = H.replace('<div class="pop" style="left:${left}px;top:${top}px"><button class="x" aria-label="Закрыть">${ico(\'x\')}</button><div class="media">${scene(p.scene)}', '<div class="pop" style="left:${left}px;top:${top}px"><button class="x" aria-label="Закрыть">${ico(\'x\')}</button><div class="media">${scene(p.scene)}${phImg(p)}')
open(D + '/tomsk.html', 'w').write(H)
print('photos', sum(1 for k in PH))
