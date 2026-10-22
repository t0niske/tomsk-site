# -*- coding: utf-8 -*-
"""Главная отвечает на вопрос «куда сходить»: подбор «с кем / когда» в шапке и варианты сразу под ней.
Убирает «Мой маршрут»: избранное становится списком «Хочу сходить».
Запуск после style_ui.py:  python3 places/pick_ui.py <папка с tomsk.html>
"""
import sys
D = sys.argv[1]
H = open(D + '/tomsk.html', encoding='utf-8').read()


def rep(a, b, cnt=1):
    global H
    assert a in H, a[:90]
    H = H.replace(a, b, cnt)


# ---------- шапка: заголовок под поисковый запрос и подбор вместо строки поиска ----------
rep('<h1><span id="hGreet">Добрый день</span><br>в Томске <span class="h2-temp" id="hTemp" hidden></span></h1>',
    '<div class="h2-title"><p class="h2-hello"><span id="hGreet">Добрый день</span><span class="h2-temp" id="hTemp" hidden></span></p>'
    '<h1>Куда сходить<br>в Томске?</h1></div>')
i = H.index('<form class="search" id="searchForm"'); j = H.index('</form>', i) + 7
H = H[:i] + '''<div class="pick" id="pick" role="group" aria-label="Подобрать, куда сходить">
          <div class="pk-row"><b>С кем</b><div class="pk-ch" data-k="who"><button data-v="date">Вдвоём</button><button data-v="friends">С друзьями</button><button data-v="kids">С детьми</button><button data-v="solo">Один</button></div></div>
          <div class="pk-row"><b>Когда</b><div class="pk-ch" data-k="when"><button data-v="now">Сейчас</button><button data-v="eve">Вечером</button><button data-v="wknd">В выходные</button></div></div>
        </div>''' + H[j:]
rep('<span id="heroGoTxt">Куда пойти сейчас</span> →', '<span id="heroGoTxt">Показать варианты</span> ↓')
rep("el('heroGo').addEventListener('click',()=>applyFilter(HERO.suggest,true));",
    "el('heroGo').addEventListener('click',()=>{const r=document.getElementById('pickRes');if(r)r.scrollIntoView({behavior:'smooth'})});")
rep("el('heroGoTxt').textContent=wxp[0];", "")  # кнопка в шапке всегда ведёт к вариантам подбора

# секция с вариантами — сразу после шапки
rep('<div class="wrap h2-chips">', '''<section id="pickRes" aria-live="polite"><div class="wrap">
  <div class="sec-head"><div><h2 id="pkTitle">Куда сходить прямо сейчас</h2><p id="pkSub">Подбираем по погоде, времени и часам работы мест</p></div>
    <div class="pk-acts"><button class="btn btn-ghost" id="pkMore">↻ Другие варианты</button><a class="link-more" id="pkLink" href="kuda-shodit/">Все идеи <svg class="ico" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div></div>
  <div class="grid3" id="pkGrid"><div class="empty">Подбираем места…</div></div>
</div></section>
<div class="wrap h2-chips">''')

# ---------- без маршрута ----------
rep('''<button class="add" data-add="${p.id}" aria-pressed="${inR}">${inR?'✓ В маршруте':'+ Маршрут'}</button></div></div></article>`;''',
    '''<span class="card-st">${p.hours&&OH.status(p.hours)?OH.status(p.hours).txt:''}</span></div></div></article>`;''')
rep('''<button class="btn btn-primary" data-add="${p.id}">${inR?'✓ В маршруте':'Добавить в маршрут'}</button>''',
    '''<button class="btn btn-primary" data-fav="${p.id}">${favs.has(p.id)?'♥ В списке «Хочу сходить»':'♡ Хочу сходить'}</button>''')
rep('''<button class="add" data-add="${p.id}" aria-pressed="${inR}" style="margin-left:0">${inR?'✓':'+ Маршрут'}</button>''', '')
i = H.index('<button class="btn btn-primary route-fab" id="routeFab">'); j = H.index('</button>', i) + 9
H = H[:i] + H[j:]
i = H.index('<aside class="drawer" id="drawer"'); j = H.index('</aside>', i) + 8
H = H[:i] + H[j:]
rep("toast(favs.has(id)?'Добавлено в избранное':'Убрано из избранного')", "toast(favs.has(id)?'Сохранили в «Хочу сходить»':'Убрали из «Хочу сходить»')")
rep('aria-label="Показать избранное"', 'aria-label="Хочу сходить" title="Хочу сходить"')
H = H.replace('aria-label="В избранное"', 'aria-label="Хочу сходить"')
rep("if(!favs.size){toast('Нажмите ♡ на карточке, чтобы сохранить место');return}",
    "if(!favs.size){toast('Нажмите ♡ на карточке — место попадёт в список «Хочу сходить»');return}")

# часы в формате 00:00
rep("const fm=m=>{m%=1440;return Math.floor(m/60)+':'+String(m%60).padStart(2,'0')};",
    "const fm=m=>{m%=1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')};")

# ---------- логика подбора ----------
PICK_JS = r'''
/* ===== подбор: с кем и когда ===== */
const PK={who:null,when:'now',seed:0};
try{const s=JSON.parse(localStorage.getItem('tomsk:pick')||'null');if(s){PK.who=s.who||null;PK.when=s.when||'now'}}catch(e){}
const PK_WHO={date:'вдвоём',friends:'с друзьями',kids:'с детьми',solo:'одному'};
const PK_WHEN={now:'прямо сейчас',eve:'вечером',wknd:'в выходные'};
const PK_PAGE={date:'s-devushkoj',friends:'s-druzyami',kids:'s-detmi',eve:'vecherom',wknd:'na-vyhodnyh'};
const PK_GROUP=p=>['food','bar'].includes(p.vcat)?'eat':['nature','sight','church'].includes(p.vcat)?'walk':'do';
function tomskNow(){const d=new Date(Date.now()+(7*60+new Date().getTimezoneOffset())*60000);return{d:d.getDay(),m:d.getHours()*60+d.getMinutes()}}
function openAt(h,day,m){const P=OH.parse(h);if(!P||!P.week)return null;if(P.all)return true;
  for(const[o,c]of P.week[day])if(m>=o&&m<c)return true;const y=(day+6)%7;for(const[o,c]of P.week[y])if(c>1440&&m<c-1440)return true;return false}
// без часов работы: примерные рамки по типу места
const PK_GUESS={food:[600,1320],bar:[960,1560],nature:[420,1380],sight:[420,1380],church:[480,1140],culture:[600,1140],fun:[600,1260],shop:[600,1200]};
function fitsWhen(p,when){
  const night=(p.moods||[]).includes('night');
  const at=(d,m)=>{const r=p.hours?openAt(p.hours,d,m):null;if(r!==null)return r;const g=PK_GUESS[p.vcat];if(!g)return false;
    if(['nature','sight'].includes(p.vcat)&&m>=1140&&!night)return false;return m>=g[0]&&m<g[1]};
  if(when==='now'){const t=tomskNow();return at(t.d,t.m)&&at(t.d,(t.m+45)%1440)}
  if(when==='eve'){const t=tomskNow();if(['culture','fun','church','sight','nature','shop'].includes(p.vcat)&&!night)return false;return at(t.d,1200)}
  return at(6,780)||at(0,780)}
function rnd(seed,s){let h=seed*2654435761>>>0;for(const c of s)h=Math.imul(h^c.charCodeAt(0),2246822519)>>>0;h^=h>>>15;return(h>>>0)/4294967296}
function pickList(){
  const bad=HERO.suggest&&HERO.suggest.w==='in'&&PK.when!=='wknd';
  const pool=PLACES.filter(p=>p.vcat!=='stay'&&(p.vcat!=='shop'||(p.moods||[]).some(m=>m==='solo'||m==='date'))&&(!PK.who||(p.moods||[]).includes(PK.who)));
  let ok=pool.filter(p=>fitsWhen(p,PK.when));
  if(bad){const dry=ok.filter(p=>p.indoor);if(dry.length>=4)ok=dry}
  const sc=p=>rnd(PK.seed+1,p.id)*1.4+(p.feat?.15:0)+(p.photos&&p.photos.length?.1:0)+(p.why?.1:0)+(bad&&p.indoor?.5:0)+(PK.when==='eve'&&(p.moods||[]).includes('night')?.4:0);
  const by={eat:[],walk:[],do:[]};ok.map(p=>[p,sc(p)]).sort((a,b)=>b[1]-a[1]).forEach(([p])=>by[PK_GROUP(p)].push(p));
  const order=PK.when==='eve'?['eat','do','walk']:bad?['do','eat','walk']:['walk','eat','do'];
  const out=[];for(let r=0;out.length<6&&r<6;r++)for(const g of order){if(by[g][r]&&out.length<6)out.push(by[g][r])}
  return{list:out,total:ok.length}}
function pickCard(p){const st=p.hours?OH.status(p.hours):null;const href=VSLUG[p.id]?`${ROOT}mesto/${VSLUG[p.id]}/`:null;
  return `<article class="card pk-card" data-open="${p.id}" tabindex="0">
    <div class="media"><div style="position:absolute;inset:0;${tint(p.id)}">${scene(p.scene)}</div>${phImg(p)}<button class="fav" data-fav="${p.id}" aria-pressed="${favs.has(p.id)}" aria-label="Хочу сходить">${ico('heart')}</button>
      <span class="pk-kind">${p.kind||p.tags[0]||''}</span></div>
    <div class="card-body"><h3>${href?`<a class="card-link" href="${href}">${p.name}</a>`:p.name}</h3>${p.why||p.desc?`<p class="pk-why">${(p.why||p.desc.split('. ')[0]).replace(/\.$/,'')}</p>`:''}
    <div class="foot"><span class="price">${p.price==null?'':priceTxt(p.price)}</span>${st?`<span class="pk-st ${st.open?'on':'off'}">${st.txt}</span>`:''}</div></div></article>`}
function renderPick(){
  document.querySelectorAll('#pick [data-k]').forEach(g=>g.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(PK[g.dataset.k]===b.dataset.v))));
  const grid=document.getElementById('pkGrid');if(!grid)return;
  if(!PLACES.length){grid.innerHTML='<div class="empty">Подбираем места…</div>';return}
  const{list,total}=pickList();
  const who=PK.who?PK_WHO[PK.who]+' ':'',when=PK_WHEN[PK.when];
  $('#pkTitle').textContent=(who?'Куда сходить '+who:'Куда сходить ')+when;
  const t=tomskNow();
  $('#pkSub').textContent=!list.length?'':PK.when==='now'?`Открыто сейчас и подходит по погоде · ${total} ${plural(total,['вариант','варианта','вариантов'])}`:
    PK.when==='eve'?`Работает вечером, после 20:00 · ${total} ${plural(total,['вариант','варианта','вариантов'])}`:`Открыто в субботу или воскресенье днём · ${total} ${plural(total,['вариант','варианта','вариантов'])}`;
  const pg=PK_PAGE[PK.who]||PK_PAGE[PK.when];const l=$('#pkLink');l.href=ROOT+'kuda-shodit/'+(pg?pg+'/':'');
  l.firstChild.textContent=PK_PAGE[PK.who]?`Все идеи: куда сходить ${PK_WHO[PK.who].replace('вдвоём','с девушкой')} `:pg?`Все идеи: куда сходить ${when} `:'Все идеи ';
  $('#pkMore').hidden=total<=6;
  grid.innerHTML=list.length?list.map(pickCard).join(''):`<div class="empty">${PK.when==='now'&&(t.m<420||t.m>1380)?'Ночью почти всё закрыто. Посмотрите, что можно запланировать на вечер или выходные.':'Под эти условия ничего не нашлось. Попробуйте другой вариант.'}
    <div style="margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn btn-ghost" data-pk="eve">Вечером</button><button class="btn btn-ghost" data-pk="wknd">В выходные</button></div></div>`}
document.addEventListener('click',e=>{
  const b=e.target.closest('#pick [data-k] button');
  const q=e.target.closest('[data-pk]');
  if(b){const k=b.parentNode.dataset.k;PK[k]=k==='who'&&PK.who===b.dataset.v?null:b.dataset.v}else if(q){PK.when=q.dataset.pk}else if(e.target.closest('#pkMore')){PK.seed++}else return;
  try{localStorage.setItem('tomsk:pick',JSON.stringify({who:PK.who,when:PK.when}))}catch(e){}
  renderPick();
  if(b||q){const r=document.getElementById('pickRes');if(r&&r.getBoundingClientRect().top>innerHeight-160)r.scrollIntoView({behavior:'smooth'})}
});
document.addEventListener('venues',renderPick);
'''
rep("function renderAll(){", PICK_JS + "\nfunction renderAll(){")
rep("function toPlace(v){const mo=v.moods||[];", "function toPlace(v){const mo=v.moods||[];/* moods нужны подбору */")
rep("feat:!!v.feat,pick:!!v.pick,", "feat:!!v.feat,pick:!!v.pick,moods:mo,")
rep("HERO.init();renderDates();renderAll();", "HERO.init();renderDates();renderAll();renderPick();")

CSS = r'''
/* ===== подбор «с кем / когда» ===== */
.h2-hello{display:flex;align-items:center;gap:10px;margin:0 0 6px;font-family:var(--font-display);font-weight:800;font-size:clamp(16px,1.6vw,22px);text-transform:uppercase;letter-spacing:-.01em;color:inherit}
.h2-hello .h2-temp{font-size:.9em}
.pick{display:flex;flex-direction:column;gap:12px;background:#FFFDF5;color:#111;border:2px solid #111;border-radius:22px;padding:14px 16px 16px;box-shadow:4px 4px 0 #111}
.pk-row{display:flex;flex-direction:column;gap:7px}
.pk-row b{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#55554D}
.pk-ch{display:flex;flex-wrap:wrap;gap:6px}
.pk-ch button{height:38px;padding:0 14px;border-radius:999px;border:2px solid #111;background:#FFFDF5;color:#111;font:inherit;font-weight:800;font-size:14px;cursor:pointer;transition:transform .12s}
.pk-ch button:hover{transform:translateY(-1px)}
.pk-ch button[aria-pressed="true"]{background:var(--yellow);box-shadow:2px 2px 0 #111}
#pickRes{padding-top:30px}
.pk-acts{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.pk-acts .btn{height:40px}
.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.pk-card .media{aspect-ratio:16/10}
.pk-kind{position:absolute;left:10px;bottom:10px;background:#FFFDF5;color:#111;border:2px solid #111;border-radius:999px;padding:2px 10px;font-size:12px;font-weight:800}
.pk-why{margin:6px 0 0;font-size:14px;line-height:1.4;color:var(--ink-2)}
.pk-st{font-size:12px;font-weight:800;padding:3px 9px;border-radius:999px;border:1.5px solid var(--line)}
.pk-st.on{background:#C9F2D2;color:#0F3D25}.pk-st.off{background:#FFD9D0;color:#5A1A0E}
.card-st{font-size:12px;font-weight:700;color:var(--ink-2)}
@media (max-width:1000px){.grid3{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:640px){.grid3{grid-template-columns:minmax(0,1fr)}.pk-card .media{aspect-ratio:16/8}.pick{padding:12px;gap:10px}.pk-ch button{height:36px;padding:0 12px;font-size:13.5px}.h2-hello{font-size:15px}}
'''
rep('</style>', CSS + '</style>')
open(D + '/tomsk.html', 'w', encoding='utf-8').write(H)
print('ok')
