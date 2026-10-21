# -*- coding: utf-8 -*-
"""Добавляет на главную: часы работы и контакты мест, каталог всех заведений (OSM), форму «Я владелец / ошибка»."""
import json, sys, re
D = sys.argv[1]
H = open(D + '/tomsk.html').read()
CAT = json.load(open(D + '/places/catalog.json'))
PK = {p['name']: p for p in json.load(open(D + '/places/places.json'))}

def rep(a, b, cnt=1):
    global H
    assert a in H, a[:90]
    H = H.replace(a, b, cnt)

# ---- 1. часы/контакты в PLACES (подборка) ----
def js(s): return json.dumps(s, ensure_ascii=False)
m = re.search(r'const PLACES = \[\n(.*?)\n\];', H, re.S)
lines = [l.rstrip().rstrip(',') for l in m.group(1).split('\n') if l.strip()]
out = []
for l in lines:
    nm = re.search(r"name:'((?:[^'\\]|\\.)*)'", l)
    p = PK.get(nm.group(1).replace("\\'", "'")) if nm else None
    if p:
        extra = ''
        for k, f in (('hours', 'hours'), ('phone', 'phone'), ('web', 'web'), ('prices', 'prices'), ('checked', 'checked'), ('src', 'src')):
            if p.get(f): extra += ',%s:%s' % (k, js(p[f]))
        l = l.rstrip(',')
        l = l[:-1] + extra + '}' if l.endswith('}') else l
    out.append(l)
H = H[:m.start()] + 'const PLACES = [\n' + ',\n'.join(out) + '\n];' + H[m.end():]

# ---- 2. разбор часов работы (формат OpenStreetMap) ----
OHJS = r'''
/* часы работы в формате OpenStreetMap: «Mo-Fr 09:00-18:00; Sa 10:00-16:00; Su off» */
const OH=(()=>{const D=['Su','Mo','Tu','We','Th','Fr','Sa'],RU=['вс','пн','вт','ср','чт','пт','сб'],ORD=[1,2,3,4,5,6,0];const cache=new Map();
  function parse(s){if(!s)return null;if(cache.has(s))return cache.get(s);let r=null;try{r=parse0(s)}catch(e){r={raw:s}}cache.set(s,r);return r}
  function parse0(s){s=s.trim();const week=[[],[],[],[],[],[],[]];if(/^24\/7$/.test(s)){for(let d=0;d<7;d++)week[d]=[[0,1440]];return{week,all:true}}
    let any=false;for(let part of s.split(/;|\|\|/)){part=part.trim();if(!part||/^PH\b/.test(part)||/^SH\b/.test(part))continue;
      const m=part.match(/^((?:(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:\s*-\s*(?:Mo|Tu|We|Th|Fr|Sa|Su))?\s*,?\s*)+)?(.*)$/);const days=[];
      if(m[1]){m[1].split(',').forEach(x=>{x=x.trim();if(!x)return;const[a,b]=x.split('-').map(t=>t.trim());const ia=D.indexOf(a),ib=b?D.indexOf(b):ia;if(ia<0||ib<0)return;for(let k=ia;;k=(k+1)%7){days.push(k);if(k===ib)break}})}else for(let k=0;k<7;k++)days.push(k);
      const rest=(m[2]||'').trim();if(/^(off|closed)$/i.test(rest)){days.forEach(d=>week[d]=[]);any=true;continue}
      if(/^24\/7$|^00:00-24:00$/.test(rest)){days.forEach(d=>week[d]=[[0,1440]]);any=true;continue}
      const sp=[];(rest.match(/\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/g)||[]).forEach(t=>{const[a,b]=t.split('-').map(x=>x.trim().split(':').map(Number));let o=a[0]*60+a[1],c=b[0]*60+b[1];if(c<=o)c+=1440;sp.push([o,c])});
      if(!sp.length)return{raw:s};days.forEach(d=>week[d]=sp);any=true}
    return any?{week}:{raw:s}}
  const fm=m=>{m%=1440;return Math.floor(m/60)+':'+String(m%60).padStart(2,'0')};
  function nowT(){const d=new Date(Date.now()+(7*60+new Date().getTimezoneOffset())*60000);return{d:d.getDay(),m:d.getHours()*60+d.getMinutes()}}
  function status(s){const P=parse(s);if(!P||!P.week)return null;if(P.all)return{open:true,txt:'Круглосуточно'};const{d,m}=nowT();
    for(const[o,c]of P.week[d])if(m>=o&&m<c)return{open:true,txt:'Открыто до '+fm(c)};
    const y=(d+6)%7;for(const[o,c]of P.week[y])if(c>1440&&m<c-1440)return{open:true,txt:'Открыто до '+fm(c)};
    for(const[o]of P.week[d])if(o>m)return{open:false,txt:'Закрыто, откроется в '+fm(o)};
    for(let k=1;k<=7;k++){const dd=(d+k)%7;if(P.week[dd].length)return{open:false,txt:'Закрыто, откроется '+(k===1?'завтра':RU[dd])+' в '+fm(P.week[dd][0][0])}}
    return{open:false,txt:'Закрыто'}}
  function human(s){const P=parse(s);if(!P)return'';if(!P.week)return s;if(P.all)return'круглосуточно';const key=d=>P.week[d].map(x=>fm(x[0])+'–'+fm(x[1])).join(', ')||'выходной';
    const g=[];ORD.forEach(d=>{const k=key(d);const L=g[g.length-1];if(L&&L.k===k)L.b=d;else g.push({a:d,b:d,k})});
    if(g.length===1)return'ежедневно '+g[0].k;return g.map(x=>(x.a===x.b?RU[x.a]:RU[x.a]+'–'+RU[x.b])+' '+x.k).join('; ')}
  return{status,human,parse}})();
'''
rep("const byId=id=>PLACES.find(p=>p.id===id);", OHJS + "\nconst byId=id=>PLACES.find(p=>p.id===id);")

# ---- 3. карточка места: часы, телефон, сайт, цены, кнопка «исправить» ----
rep('<div class="where">${ico(\'pin\')}${p.addr}</div>${phCredit(p)}',
    '<div class="where">${ico(\'pin\')}${p.addr}</div>${infoBlock(p)}${phCredit(p)}')
rep("function closeSheet(){",
    r"""function infoBlock(p){const st=p.hours?OH.status(p.hours):null;let h='';
  if(p.hours)h+=`<div class="oh ${st?(st.open?'on':'off'):''}">${st?`<b>${st.txt}</b> · `:''}${OH.human(p.hours)}</div>`;
  if(p.prices)h+=`<p class="desc" style="font-size:14px">Цены: ${p.prices}</p>`;
  const L=[];if(p.phone)L.push(`<a class="btn btn-ghost" href="tel:${p.phone.replace(/[^+\d]/g,'')}">${p.phone}</a>`);if(p.web)L.push(`<a class="btn btn-ghost" href="${p.web}" target="_blank" rel="noopener">${ico('ext')}Сайт</a>`);
  if(L.length)h+=`<div class="plan-actions" style="margin-top:0">${L.join('')}</div>`;
  h+=`<p class="credit">${p.checked?`Часы проверены ${p.checked.split('-').reverse().join('.')} по <a href="${p.src}" target="_blank" rel="noopener">сайту заведения</a>. `:p.hours?'Часы по данным OpenStreetMap — лучше уточнить перед визитом. ':''}<button class="linkbtn" data-report="${p.name.replace(/"/g,'&quot;')}">Это ваше место или нашли ошибку?</button></p>`;return h}
function closeSheet(){""")

# ---- 4. каталог всех заведений ----
CATJS = 'const CATALOG=' + json.dumps([[r['n'], r['c'], r['k'], r['x'], r['y'], r['a'], r['h'], r['ph'], r['w'] or r['vk'], r['cu']] for r in CAT], ensure_ascii=False, separators=(',', ':')) + ';'
SECTION = '''
<section id="all"><div class="wrap">
  <div class="sec-head"><div><h2>Все заведения Томска</h2><p>Кафе, бары, музеи, гостиницы и другие места из открытой базы OpenStreetMap. Фото и отзывы смотрите по ссылкам в 2ГИС и Яндекс Картах.</p></div><span class="count" id="catCount"></span></div>
  <div class="fbar cat-bar">
    <label class="cat-q"><svg class="ico" viewBox="0 0 24 24"><path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4"/></svg><input id="catQ" type="search" placeholder="Название, кухня или улица" autocomplete="off"></label>
    <div class="seg" id="catOpen" role="group" aria-label="Время"><button data-o="" aria-pressed="true">Любое время</button><button data-o="1" aria-pressed="false">Открыто сейчас</button></div>
  </div>
  <div class="cat-chips" id="catChips"></div>
  <div class="cat-list" id="catList"></div>
  <div style="text-align:center;margin-top:16px"><button class="btn btn-ghost" id="catMore">Показать ещё</button></div>
  <p class="credit" style="margin-top:14px">Данные © участники <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>, лицензия ODbL. Нет вашего заведения или данные устарели? <button class="linkbtn" data-report="">Напишите нам</button></p>
</div></section>
'''
rep('<section id="events">', SECTION + '\n<section id="events">')
rep('<a href="#places">Места</a>', '<a href="#places">Места</a><a href="#all">Все заведения</a>')

CSS = '''
.oh{font-size:14px;color:var(--ink-2)}.oh b{color:var(--ink)}.oh.on b{color:#2E8A5C}.oh.off b{color:#B5462E}
.linkbtn{background:none;border:0;padding:0;color:var(--forest);font:inherit;font-weight:700;text-decoration:underline;cursor:pointer}
.cat-bar{gap:10px}.cat-q{flex:1 1 260px;display:flex;align-items:center;gap:8px;height:42px;padding:0 14px;border-radius:999px;background:var(--surface);box-shadow:var(--shadow)}
.cat-q input{border:0;outline:0;background:none;font:inherit;font-size:15px;width:100%;color:var(--ink)}
.cat-chips{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 14px}.cat-chips button{height:34px;padding:0 14px;border-radius:999px;background:var(--surface-2);font-size:13px;font-weight:700;color:var(--ink-2)}
.cat-chips button[aria-pressed="true"]{background:var(--forest);color:var(--on-forest)}.cat-chips small{opacity:.7;font-weight:600;margin-left:4px}
.cat-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}
.vrow{background:var(--surface);border-radius:14px;box-shadow:var(--shadow);padding:14px 16px;display:flex;flex-direction:column;gap:6px;min-width:0}
.vrow h3{margin:0;font-size:15.5px;font-weight:800;line-height:1.25;overflow-wrap:anywhere}.vrow .k{font-size:12.5px;color:var(--ink-2)}
.vrow .a{font-size:13px;color:var(--ink-2)}.vrow .s{font-size:12.5px;font-weight:700}.vrow .s.on{color:#2E8A5C}.vrow .s.off{color:#B5462E}
.vrow .acts{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}.vrow .acts a,.vrow .acts button{height:30px;display:inline-flex;align-items:center;padding:0 11px;border-radius:999px;background:var(--surface-2);font-size:12.5px;font-weight:700;color:var(--ink);text-decoration:none;border:0;cursor:pointer}
.rep .card-body{padding:22px}.rep h3{margin:0 0 4px}.rep label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:700;color:var(--ink-2)}
.rep input,.rep textarea,.rep select{box-sizing:border-box;width:100%;min-width:0;font:inherit;font-size:15px;padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:var(--bg);color:var(--ink);font-weight:500}
.rep textarea{min-height:90px;resize:vertical}.rep .row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:520px){.rep .row2{grid-template-columns:1fr}}
.rep .ok{padding:14px;border-radius:12px;background:color-mix(in srgb,var(--forest) 12%,transparent);color:var(--forest);font-weight:700}
.rep .chk{flex-direction:row;align-items:flex-start;gap:8px;font-weight:600}.rep .chk input{width:auto;margin-top:3px}
'''
rep('img.ph{', CSS + 'img.ph{')

MAPURL = 'https://claude.ai/artifact/AVrRw6cBgvUKi1BpGhGENZ'
CATUI = CATJS + r'''
const CATN={food:'Кафе и рестораны',bar:'Бары',culture:'Музеи, театры, кино',fun:'Развлечения и спорт',nature:'Парки',sight:'Достопримечательности',church:'Храмы',stay:'Где жить',shop:'Магазины и подарки'};
const CF={q:'',c:'',open:false,n:30};
function vStatus(v){return v[6]?OH.status(v[6]):null}
function catFilter(){const q=CF.q.toLowerCase().replace(/ё/g,'е').split(/\s+/).filter(Boolean);
  return CATALOG.filter(v=>{if(CF.c&&v[1]!==CF.c)return false;if(q.length){const s=(v[0]+' '+v[2]+' '+v[5]+' '+v[9]).toLowerCase().replace(/ё/g,'е');if(!q.every(t=>s.includes(t)))return false}
    if(CF.open){const st=vStatus(v);if(!st||!st.open)return false}return true})}
function vRow(v,i){const st=vStatus(v);const q=encodeURIComponent(v[0]+(v[5]?', '+v[5]:''));
  return `<article class="vrow"><h3>${esc(v[0])}</h3><div class="k">${esc(v[2])}${v[9]?' · '+esc(v[9].split(';').slice(0,2).join(', ').replace(/_/g,' ')):''}</div>
  ${v[5]?`<div class="a">${esc(v[5])}</div>`:''}${st?`<div class="s ${st.open?'on':'off'}">${st.txt}</div>`:v[6]?`<div class="a">${esc(v[6])}</div>`:''}
  <div class="acts"><a href="${MAP_URL}#poi=${v[3]},${v[4]}" target="_blank" rel="noopener">На карте</a><a href="https://2gis.ru/tomsk/search/${q}" target="_blank" rel="noopener">2ГИС</a><a href="https://yandex.ru/maps/?text=${encodeURIComponent('Томск, ')}${q}" target="_blank" rel="noopener">Яндекс</a>
  ${v[8]?`<a href="${esc(v[8])}" target="_blank" rel="noopener">Сайт</a>`:''}${v[7]?`<a href="tel:${v[7].replace(/[^+\d]/g,'')}">Позвонить</a>`:''}<button data-report="${esc(v[0])}">Исправить</button></div></article>`}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderCatalog(){const L=catFilter();
  // сначала места с часами и контактами — они полезнее
  L.sort((a,b)=>((b[6]?2:0)+(b[8]||b[7]?1:0))-((a[6]?2:0)+(a[8]||a[7]?1:0))||a[0].localeCompare(b[0],'ru'));
  $('#catList').innerHTML=L.length?L.slice(0,CF.n).map(vRow).join(''):`<div class="empty">Ничего не нашли. Попробуйте другое слово или снимите фильтр «Открыто сейчас».</div>`;
  $('#catCount').textContent=`${L.length} ${plural(L.length,['место','места','мест'])}`;$('#catMore').hidden=L.length<=CF.n;
  const cnt={};CATALOG.forEach(v=>cnt[v[1]]=(cnt[v[1]]||0)+1);
  $('#catChips').innerHTML=`<button data-c="" aria-pressed="${!CF.c}">Все<small>${CATALOG.length}</small></button>`+Object.keys(CATN).filter(k=>cnt[k]).map(k=>`<button data-c="${k}" aria-pressed="${CF.c===k}">${CATN[k]}<small>${cnt[k]}</small></button>`).join('')}
let catT=0;$('#catQ').addEventListener('input',e=>{clearTimeout(catT);catT=setTimeout(()=>{CF.q=e.target.value.trim();CF.n=30;renderCatalog()},150)});
$('#catChips').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;CF.c=b.dataset.c;CF.n=30;renderCatalog()});
$('#catOpen').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;CF.open=!!b.dataset.o;$('#catOpen').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));CF.n=30;renderCatalog()});
$('#catMore').addEventListener('click',()=>{CF.n+=30;renderCatalog()});
renderCatalog();

/* ---------- форма «Я владелец / нашли ошибку / добавить место» ---------- */
function openReport(name){const el=$('#rep');el.innerHTML=`<button class="x" id="repX" aria-label="Закрыть">${ico('x')}</button><form class="card-body" id="repForm" enctype="multipart/form-data">
  <h3>${name?'Обновить данные о месте':'Добавить место'}</h3><p class="desc" style="font-size:14px;color:var(--ink-2)">Мы проверим и обновим карточку. Если вы владелец — пришлите актуальные часы, цены и фото, это бесплатно.</p>
  <label>Кто вы<select name="who"><option value="owner">Владелец или сотрудник заведения</option><option value="guest">Посетитель — нашёл ошибку</option></select></label>
  <label>Название места<input name="place" required value="${esc(name||'')}" maxlength="120"></label>
  <div class="row2"><label>Часы работы<input name="hours" placeholder="пн–пт 9–21, сб–вс 10–22" maxlength="200"></label><label>Средний чек или цены<input name="prices" placeholder="например, 600–900 ₽" maxlength="200"></label></div>
  <div class="row2"><label>Телефон заведения<input name="phone" maxlength="40"></label><label>Сайт или соцсети<input name="web" maxlength="200"></label></div>
  <label>Что ещё исправить или рассказать<textarea name="text" maxlength="3000" placeholder="Например: переехали, новое меню, есть детская комната…"></textarea></label>
  <label>Фото (до 5 штук, до 8 МБ каждое)<input type="file" name="photos[]" accept="image/jpeg,image/png,image/webp" multiple></label>
  <label>Как с вами связаться (не публикуется)<input name="contact" maxlength="120" placeholder="телефон, почта или Telegram"></label>
  <label class="chk"><input type="checkbox" name="consent" value="1" required>Фото и данные мои или я вправе ими распоряжаться; разрешаю опубликовать их на сайте</label>
  <input name="website2" style="display:none" tabindex="-1" autocomplete="off">
  <div class="plan-actions"><button class="btn btn-primary" type="submit">Отправить</button></div><div id="repMsg"></div></form>`;
  el.classList.add('open');$('#scrim').classList.add('open');$('#repX').onclick=closeReport;
  $('#repForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.target;const files=f.querySelector('input[type=file]').files;
    if(files.length>5){$('#repMsg').innerHTML='<p class="desc">Не больше 5 фото.</p>';return}for(const x of files)if(x.size>8e6){$('#repMsg').innerHTML='<p class="desc">Фото «'+esc(x.name)+'» больше 8 МБ.</p>';return}
    const btn=f.querySelector('button[type=submit]');btn.disabled=true;btn.textContent='Отправляем…';
    try{const r=await fetch('report.php',{method:'POST',body:new FormData(f)});const j=await r.json();if(!j.ok)throw new Error(j.error||'ошибка');
      f.innerHTML='<div class="ok">Спасибо! Мы получили данные и обновим карточку после проверки.</div>'}
    catch(err){btn.disabled=false;btn.textContent='Отправить';$('#repMsg').innerHTML='<p class="desc" style="color:#B5462E">Не получилось отправить. Форма работает, когда сайт размещён на хостинге; попробуйте позже.</p>'}})}
function closeReport(){$('#rep').classList.remove('open');if(!$('#sheet').classList.contains('open')&&!$('#drawer').classList.contains('open'))$('#scrim').classList.remove('open')}
document.addEventListener('click',e=>{const b=e.target.closest('[data-report]');if(!b)return;e.preventDefault();e.stopPropagation();closeSheet();openReport(b.dataset.report)},true);
$('#scrim').addEventListener('click',closeReport);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeReport()});
{const m=location.hash.match(/^#report=(.*)$/);if(m)setTimeout(()=>openReport(decodeURIComponent(m[1])),300)}
'''
rep("function renderAll(){", "const MAP_URL='" + MAPURL + "';\n" + CATUI + "\nfunction renderAll(){")
rep('<div class="scrim" id="scrim"></div>', '<div class="scrim" id="scrim"></div>\n<div class="sheet rep" id="rep" role="dialog" aria-label="Обновить данные о месте"></div>')
rep('<a href="#top">Добавить место</a>', '<a href="#report=" data-report="">Добавить место</a>')
H = re.sub(r'<p class="fine">Первая версия\.[^<]*</p>', '<p class="fine">Данные о заведениях: OpenStreetMap и официальные сайты мест. Фото — Wikimedia Commons и сами заведения. Афиша событий пока демонстрационная.</p>', H, 1)
open(D + '/tomsk.html', 'w').write(H)
print('ok catalog', len(CAT))
