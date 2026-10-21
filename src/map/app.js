/* ================== ПРИЛОЖЕНИЕ ================== */
const MOODCATS={date:['food','bar','nature','culture'],rain:['culture','food','church','shop'],kids:['nature','fun','culture','food'],wood:['sight','culture'],night:['bar','food','culture'],free:['nature','sight','church']};
const APP={mode:'2d',mood:'all',focusId:null,filter:{cats:new Set(),q:''},sel:null,tour:null,visited:new Set(store.get('visited',[])),
  curFiltered(){return CUR.filter(c=>this.mood==='all'||c.moods.includes(this.mood))},
  stopTour(){if(this.tour){clearTimeout(this.tour);this.tour=null;}}};

function hourNow(){return Math.floor(tomskNow()/60)}
function curStatus(c){if(!c.hours)return{cls:'open',txt:'Открыто всегда'};const h=hourNow();const[o,cl]=c.hours;const op=h>=o&&h<cl;return{cls:op?'open':'closed',txt:op?`Открыто до ${cl}:00`:`Сейчас закрыто, откроется в ${o}:00`}}
function osmHours(s){if(!s)return null;if(s==='24/7')return{cls:'open',txt:'Круглосуточно'};
  // простые форматы «Mo-Su 10:00-22:00» и «Mo-Fr 09:00-18:00; Sa 10:00-16:00»
  const D=['Su','Mo','Tu','We','Th','Fr','Sa'];const now=new Date(Date.now()+7*3600e3);const wd=now.getUTCDay(),mins=now.getUTCHours()*60+now.getUTCMinutes();
  for(const part of s.split(';')){const m=part.trim().match(/^([A-Za-z,\- ]+)?\s*(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);if(!m)continue;let days=true;
    if(m[1]){days=false;m[1].split(',').forEach(r=>{const[a,b]=r.trim().split('-');const ia=D.indexOf(a),ib=b?D.indexOf(b):ia;if(ia<0)return;for(let k=ia;;k=(k+1)%7){if(k===wd)days=true;if(k===ib)break}})}
    if(!days)continue;const o=+m[2]*60+ +m[3];let c=+m[4]*60+ +m[5];if(c<=o)c+=1440;const mm=mins<o&&c>1440?mins+1440:mins;const op=mm>=o&&mm<c;
    return{cls:op?'open':'closed',txt:op?`Открыто до ${m[4]}:${m[5]}`:`Закрыто, откроется в ${m[2]}:${m[3]}`}}
  return{cls:'na',txt:s.replace(/Mo/g,'Пн').replace(/Tu/g,'Вт').replace(/We/g,'Ср').replace(/Th/g,'Чт').replace(/Fr/g,'Пт').replace(/Sa/g,'Сб').replace(/Su/g,'Вс').replace(/off/g,'выходной')}}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function yUrl(q){return'https://yandex.ru/maps/?text='+encodeURIComponent('Томск, '+q)}
function gUrl(q){return'https://2gis.ru/tomsk/search/'+encodeURIComponent(q)}

/* ---------- карточки ---------- */
function shade(hex){const n=parseInt(hex.slice(1),16);const f=v=>Math.max(0,Math.round(v*.78));return'#'+[f(n>>16),f(n>>8&255),f(n&255)].map(v=>v.toString(16).padStart(2,'0')).join('')}
function phHead2(f){return`<figure class="c-photo"><img src="${f[0]}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.remove()">${f[1]?`<figcaption>${f[3]?`<a href="${f[3]}" target="_blank" rel="noopener">${esc(f[1])}</a>`:esc(f[1])}${f[2]?' · '+f[2]:''}</figcaption>`:''}</figure>`}
function phHead(...keys){const P=typeof PHOTOS!=='undefined'?PHOTOS:{};const f=keys.map(k=>P[k]).find(Boolean);return f?`<figure class="c-photo"><img src="${f[0]}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.remove()"><figcaption><a href="${f[3]}" target="_blank" rel="noopener">${esc(f[1])}</a> · ${f[2]}</figcaption></figure>`:''}
function cardCur(c){const st=curStatus(c);const near=DATA.pois.filter(p=>Math.hypot(p.x-c.x,p.y-c.y)<450&&['food','bar','culture','sight'].includes(p.cat)).map(p=>({p,d:Math.hypot(p.x-c.x,p.y-c.y)})).sort((a,b)=>a.d-b.d).slice(0,5);
  return`${phHead(c.id,c.name)}<div class="c-head" style="background:linear-gradient(135deg,${c.col},${shade(c.col)})"><button class="x" data-close aria-label="Закрыть">${ico('x')}</button><div class="eyebrow">${c.cat}</div><h2>${c.name}</h2><p class="why">${c.why}</p></div>
  <div class="c-body"><span class="status ${st.cls}"><i></i>${st.txt}</span>
   ${c.cone?`<div class="sun">${ico('sun')}<span>Закат сегодня в <b>${fmtMin(sunMinutes(new Date()).set)}</b><br><small>приходите минут за 20, смотреть на запад, за реку</small></span></div>`:''}
   <p>${c.story}</p>
   <div class="facts"><div>Вход<b>${c.price}</b></div><div>Займёт<b>${c.mins>=60?Math.floor(c.mins/60)+' ч'+(c.mins%60?' '+c.mins%60+' м':''):c.mins+' мин'}</b></div><div>Часы<b>${c.hours?c.hours[0]+':00–'+c.hours[1]+':00':'всегда'}</b></div></div>
   <div class="addr">${ico('pin')}${c.addr}</div>
   <div class="acts">${APP.mode==='2d'?`<button class="b pri" data-dive="${c.id}">${ico('cube')}Погрузиться в 3D</button>`:''}<a class="b ${APP.mode==='3d'?'pri':''}" href="${yUrl(c.addr)}" target="_blank" rel="noopener">${ico('ext')}Яндекс Карты</a><a class="b" href="${gUrl(c.name)}" target="_blank" rel="noopener">${ico('ext')}2ГИС</a>
    <button class="b" data-visit="${c.id}" aria-pressed="${APP.visited.has(c.id)}">${ico('check')}${APP.visited.has(c.id)?'Я здесь был':'Отметить: был'}</button></div>
   ${near.length?`<div><b style="font-size:13px">Рядом, до 6 минут пешком</b><div class="near" style="margin-top:8px">${near.map(o=>`<button data-poi="${DATA.pois.indexOf(o.p)}">${esc(o.p.t.name)}<span>${KIND_RU[o.p.t.amenity||o.p.t.tourism||o.p.t.historic||o.p.t.shop||o.p.t.leisure]||''} · ${Math.max(1,Math.round(o.d/75))} мин</span></button>`).join('')}</div></div>`:''}
  </div>`}
const MAIN_URL='https://claude.ai/artifact/NRBXkQy6oUrTvm3eW1DtuS';
const CUIS={russian:'русская',regional:'местная',italian:'итальянская',georgian:'грузинская',japanese:'японская',sushi:'суши',pizza:'пицца',burger:'бургеры',coffee_shop:'кофе',european:'европейская',asian:'азиатская',chinese:'китайская',turkish:'турецкая',uzbek:'узбекская',caucasian:'кавказская',steak_house:'стейки',grill:'гриль',bbq:'гриль',seafood:'морепродукты',vegetarian:'вегетарианская',cake:'торты',dessert:'десерты',pancake:'блины',sandwich:'сэндвичи',breakfast:'завтраки',international:'интернациональная',french:'французская',korean:'корейская',thai:'тайская',vietnamese:'вьетнамская',indian:'индийская',mexican:'мексиканская',american:'американская',shawarma:'шаурма',kebab:'кебаб',bakery:'выпечка',pie:'пироги',ice_cream:'мороженое',tea:'чай',chicken:'курица',noodle:'лапша',ramen:'рамен',pasta:'паста',fish:'рыба',bubble_tea:'бабл-ти',donut:'пончики'};
function cardPoi(p){const t=p.t,cat=PCAT[p.cat],K=p.pick;const kind=K?K.kind:KIND_RU[t.amenity]||KIND_RU[t.tourism]||KIND_RU[t.historic]||KIND_RU[t.shop]||KIND_RU[t.leisure]||cat.t;const st=osmHours(t.opening_hours);
  const addr=K&&K.addr&&K.addr!=='Томск'?K.addr:t['addr:street']?`${t['addr:street']}${t['addr:housenumber']?', '+t['addr:housenumber']:''}`:'';const web=t.website||t['contact:website']||(K&&K.web);
  const facts=[];if(K&&K.price)facts.push(['Вход',K.price]);if(t.cuisine)facts.push(['Кухня',t.cuisine.split(';').slice(0,2).map(c=>CUIS[c.trim()]||c.trim().replace(/_/g,' ')).join(', ')]);if(t.outdoor_seating==='yes')facts.push(['Летняя веранда','есть']);if(t.internet_access&&t.internet_access!=='no')facts.push(['Wi-Fi','есть']);if(t.wheelchair)facts.push(['Доступность',t.wheelchair==='yes'?'да':t.wheelchair==='limited'?'частично':'нет']);if(t.fee)facts.push(['Вход',t.fee==='no'?'бесплатно':'платно']);if(t.start_date)facts.push(['Год',t.start_date]);
  return`${K&&K.ph?phHead2(K.ph):''}<div class="c-head" style="background:linear-gradient(135deg,${cat.c},${shade(cat.c)})"><button class="x" data-close aria-label="Закрыть">${ico('x')}</button><div class="eyebrow">${K?'Подборка · ':''}${kind}</div><h2>${esc(K?K.name:t.name)}</h2>${K?`<p class="why">${esc(K.why)}</p>`:''}</div>
  <div class="c-body">${st?`<span class="status ${st.cls}"><i></i>${esc(st.txt)}</span>`:''}${K?`<p>${esc(K.desc)}</p>`:t.description?`<p>${esc(t.description)}</p>`:''}
   ${facts.length?`<div class="facts">${facts.slice(0,3).map(f=>`<div>${f[0]}<b>${esc(f[1])}</b></div>`).join('')}</div>`:''}
   ${addr?`<div class="addr">${ico('pin')}${esc(addr)}</div>`:''}
   <div class="acts"><a class="b pri" href="${yUrl((t.name||'')+' '+addr)}" target="_blank" rel="noopener">${ico('ext')}Яндекс Карты</a><a class="b" href="${gUrl(t.name)}" target="_blank" rel="noopener">${ico('ext')}2ГИС</a>${web?`<a class="b" href="${esc(web.startsWith('http')?web:'https://'+web)}" target="_blank" rel="noopener">${ico('ext')}Сайт</a>`:''}${t.phone?`<a class="b" href="tel:${t.phone.replace(/[^+\d]/g,'')}">${esc(t.phone)}</a>`:''}</div>
   <p class="demo">${K?'Описание — редакция «Куда сходить». ':'Данные OpenStreetMap. '}<a href="${MAIN_URL}#report=${encodeURIComponent(K?K.name:t.name||'')}" target="_blank" rel="noopener">Это ваше место или нашли ошибку?</a></p></div>`}
function cardB(b){const MAT={w:'дерево',b:'кирпич',p:'штукатурка',c:'бетон',g:'стекло',m:'металл',s:'камень'};const n=b.name;const lv=Math.max(1,Math.round(b.h/3.1));
  const TY={h:'Жилой дом',a:'Многоквартирный дом',u:'Общественное здание',o:'Офисы и магазины',c:'Храм',g:'Гараж или хозпостройка',i:'Промышленное здание',y:'Здание',x:'Здание',r:'Навес',p:'Часть здания'};
  return`<div class="c-head plain"><button class="x" data-close aria-label="Закрыть">${ico('x')}</button><div class="eyebrow">${n&&n[3]?'Памятник архитектуры':TY[b.ty]||'Здание'}</div><h2>${esc(n&&n[0]||b.addr||'Здание без названия')}</h2></div>
  <div class="c-body"><div class="facts"><div>Высота<b>≈ ${Math.round(b.h)} м</b></div><div>Этажей<b>${lv}</b></div><div>Материал<b>${MAT[b.mat]||'—'}</b></div></div>
   ${n&&(n[1]||b.addr)?`<div class="addr">${ico('pin')}${esc(n?[n[1],n[2]].filter(Boolean).join(', '):b.addr)}</div>`:b.addr?`<div class="addr">${ico('pin')}${esc(b.addr)}</div>`:''}
   ${n&&n[7]?`<p>Построено: ${esc(n[7])}</p>`:''}${n&&n[6]?`<p>Архитектор: ${esc(n[6])}</p>`:''}
   <div class="acts"><a class="b" href="${yUrl(n&&n[0]||b.addr||'')}" target="_blank" rel="noopener">${ico('ext')}Яндекс Карты</a>${n&&n[5]?`<a class="b" href="https://ru.wikipedia.org/wiki/${encodeURIComponent(n[5].replace(/^ru:/,''))}" target="_blank" rel="noopener">${ico('ext')}Википедия</a>`:''}</div></div>`}
function openCard(html){const el=$('#card');el.innerHTML=html;el.classList.add('open');el.scrollTop=0}
function closeCard(){$('#card').classList.remove('open')}
$('#card').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
  if(t.dataset.close!=null){APP.select(null);return}
  if(t.dataset.dive){setMode('3d',()=>APP.select({type:'c',c:CUR.find(c=>c.id===t.dataset.dive)}));return}
  if(t.dataset.visit){const id=t.dataset.visit;APP.visited.has(id)?APP.visited.delete(id):APP.visited.add(id);store.set('visited',[...APP.visited]);APP.select(APP.sel,true);toast(APP.visited.has(id)?`Отмечено · ${APP.visited.size} из ${CUR.length} мест`:'Отметка снята');return}
  if(t.dataset.poi){APP.select({type:'p',p:DATA.pois[+t.dataset.poi]})}});

function fly2(x,y,s){const card=document.getElementById('card');const W=innerWidth,H=innerHeight;let dx=0,dy=0;if(W>760)dx=(card.offsetWidth+12)/2/s;else dy=-Math.min(H*.6,card.offsetHeight||H*.5)/2/s;M2.flyTo(x+dx,y+dy,s)}
APP.select=function(h,keepView){this.sel=h;
  if(!h){closeCard();M2.setSelected(null);if(M3.ready){M3.highlight(null);M3.unfocus()}return}
  if(h.type==='c'){openCard(cardCur(h.c));M2.setSelected(h);if(keepView)return;
    if(this.mode==='2d')fly2(h.c.x,h.c.y,Math.max(M2.cam.s,1.6));else{M3.highlight(null);M3.focusPlace(h.c)}}
  else if(h.type==='p'){openCard(cardPoi(h.p));M2.setSelected(h);if(keepView)return;if(this.mode==='2d')fly2(h.p.x,h.p.y,Math.max(M2.cam.s,1.8));else{M3.unfocus();M3.highlight(null);M3.lookAtWorld(h.p.x,h.p.y,160)}}
  else if(h.type==='b'){openCard(cardB(h.b));M2.setSelected(h);if(this.mode==='3d'){M3.unfocus();M3.highlight(h.b)}}};

/* ---------- настроения и слои ---------- */
$('#moods').innerHTML=MOODS.map(m=>`<button data-m="${m.id}" aria-pressed="${m.id==='all'}">${m.t}</button>`).join('');
$('#moods').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;APP.mood=b.dataset.m;$('#moods').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  APP.filter.cats=new Set(MOODCATS[APP.mood]||[]);renderLayers();M2.redraw();const n=APP.curFiltered().length;toast(APP.mood==='all'?'Показываем всё интересное':`«${b.textContent}»: ${n} ${plural(n,['избранное место','избранных места','избранных мест'])} и подходящие заведения`)});
function renderLayers(){const cnt={};DATA.pois.forEach(p=>cnt[p.cat]=(cnt[p.cat]||0)+1);const f=APP.filter.cats;
  $('#layers').innerHTML=`<h3>Что показать</h3>${Object.entries(PCAT).map(([k,c])=>`<button class="cat" data-cat="${k}" aria-pressed="${!f.size||f.has(k)}"><span class="sw" style="background:${c.c}">${ico(c.i)}</span>${c.t}<span class="n">${cnt[k]||0}</span></button>`).join('')}
   ${f.size?'<button class="all" data-all>Показать все слои</button>':''}`}
$('#layers').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const f=APP.filter.cats;if(b.dataset.all!=null){f.clear()}else{const k=b.dataset.cat;if(!f.size){Object.keys(PCAT).forEach(c=>{if(c!==k)f.add(c)})}else if(f.has(k))f.delete(k);else f.add(k);if(f.size===Object.keys(PCAT).length)f.clear();
  // клик по единственной категории — только она
  if(!e.shiftKey&&f.size===Object.keys(PCAT).length-1&&!f.has(k)){f.clear();f.add(k)}}renderLayers();M2.redraw()});
$('#layersBtn').addEventListener('click',()=>$('#layers').classList.toggle('open'));

/* ---------- поиск ---------- */
let suggItems=[],suggI=0;
function streetPoint(name){for(const r of DATA.roads)if(r.name===name){const k=Math.floor(r.p.length/4)*2;return[r.p[k],r.p[k+1]]}return null}
$('#q').addEventListener('input',()=>{const q=$('#q').value.trim().toLowerCase();if(q.length<2){$('#sugg').hidden=true;suggItems=[];return}
  const out=[];CUR.forEach(c=>{if((c.name+' '+c.cat).toLowerCase().includes(q))out.push({t:'c',c,n:c.name,s:c.cat,col:c.col,ic:c.ic})});
  DATA.pois.forEach(p=>{if(out.length>40)return;const n=(p.pick?p.pick.name:p.t.name||'');if(n.toLowerCase().includes(q))out.push({t:'p',p,n,s:(KIND_RU[p.t.amenity||p.t.tourism||p.t.historic||p.t.shop||p.t.leisure]||PCAT[p.cat].t)+(p.t['addr:street']?' · '+p.t['addr:street']+' '+(p.t['addr:housenumber']||''):''),col:PCAT[p.cat].c,ic:PCAT[p.cat].i})});
  const seen=new Set();DATA.n.forEach(n=>{if(seen.size>4||!n.toLowerCase().includes(q))return;if(!seen.has(n)&&streetPoint(n)){seen.add(n);out.push({t:'s',n,s:'Улица или место',col:'#7A7A74',ic:'map'})}});
  suggItems=out.slice(0,9);suggI=0;$('#sugg').hidden=!suggItems.length;$('#sugg').innerHTML=suggItems.map((o,i)=>`<button data-i="${i}" class="${i===0?'on':''}"><span class="sd" style="background:${o.col}">${ico(o.ic)}</span><span>${esc(o.n)}<small>${esc(o.s)}</small></span></button>`).join('')});
function pickSugg(i){const o=suggItems[i];if(!o)return;$('#sugg').hidden=true;$('#q').blur();
  if(o.t==='c')APP.select({type:'c',c:o.c});else if(o.t==='p')APP.select({type:'p',p:o.p});else{const pt=streetPoint(o.n);APP.select(null);if(APP.mode==='2d')M2.flyTo(pt[0],pt[1],1.3);else M3.lookAtWorld(pt[0],pt[1],380);toast(o.n)}}
$('#sugg').addEventListener('click',e=>{const b=e.target.closest('button');if(b)pickSugg(+b.dataset.i)});
$('#q').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();pickSugg(suggI)}else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();suggI=(suggI+(e.key==='ArrowDown'?1:-1)+suggItems.length)%Math.max(1,suggItems.length);$('#sugg').querySelectorAll('button').forEach((b,i)=>b.classList.toggle('on',i===suggI))}else if(e.key==='Escape'){$('#sugg').hidden=true}});
document.addEventListener('click',e=>{if(!e.target.closest('.search'))$('#sugg').hidden=true});

/* ---------- режимы ---------- */
function setMode(m,after){if(m===APP.mode){after&&after();return}APP.stopTour();
  if(m==='3d'){const go=()=>{APP.mode='3d';document.body.classList.add('m3d');$('#m3').setAttribute('aria-pressed','true');$('#m2').setAttribute('aria-pressed','false');M3.sync();after&&after();if(APP.sel&&!after)APP.select(APP.sel,true)};
    if(!M3.ready){$('#loading').classList.remove('done');$('#loadTxt').textContent='Строим 3D: рельеф, здания, деревья…';$('#loadBar').style.width='70%';
      setTimeout(()=>{try{document.body.classList.add('m3d');M3.init();go()}catch(e){console.error(e);document.body.classList.remove('m3d');toast(e.soft?'В этом браузере 3D рисуется без видеокарты и будет тормозить. Откройте карту в Chrome или Edge — там 3D работает быстро':e.webgl?'В этом браузере выключена 3D-графика (WebGL). Откройте карту в Chrome или Edge либо перезапустите браузер':'Не получилось построить 3D: '+String(e&&e.message||e).slice(0,90))}$('#loading').classList.add('done')},60)}else go()}
  else{const c=M3.center();if(c){M2.cam.x=c[0];M2.cam.y=c[1];M2.cam.s=Math.max(.12,Math.min(3,700/c[2]))}APP.mode='2d';document.body.classList.remove('m3d');$('#m2').setAttribute('aria-pressed','true');$('#m3').setAttribute('aria-pressed','false');if(M3.ready)M3.unfocus();$('#frame').className='';M2.redraw();if(APP.sel)APP.select(APP.sel,true)}
  try{history.replaceState(null,'','#'+m)}catch(e){}}
$('#m2').addEventListener('click',()=>setMode('2d'));$('#m3').addEventListener('click',()=>setMode('3d'));
$('#zin').addEventListener('click',()=>{if(APP.mode==='2d')M2.zoom(1.6);else M3.zoomBy&&M3.zoomBy(.6)});
$('#zout').addEventListener('click',()=>{if(APP.mode==='2d')M2.zoom(1/1.6);else M3.zoomBy&&M3.zoomBy(1.6)});
$('#home').addEventListener('click',()=>{APP.select(null);if(APP.mode==='2d')M2.flyTo(-250,0,.32);else M3.lookAtWorld(-250,0,1500)});

/* ---------- пульт 3D ---------- */
const TIMES=[['now','Сейчас','sun'],['dawn','Рассвет','dawn'],['day','День','sun'],['eve','Закат','dusk'],['night','Ночь','moon']];
$('#timeBar').innerHTML=TIMES.map(([k,t,i])=>`<button data-t="${k}" aria-pressed="${k==='now'}">${ico(i)}<span class="lng">${t}</span></button>`).join('');
$('#timeBar').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$('#timeBar').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));M3.setTime(b.dataset.t);
  if(b.dataset.t==='now')toast(`В Томске сейчас ${fmtMin(tomskNow())}`)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!e.target.closest('input')){APP.stopTour();APP.select(null)}});

/* тема 2D-карты следует теме страницы */
function syncDark(){const t=document.documentElement.dataset.theme;const dark=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.mapdark=dark?'1':'0';M2.redraw()}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',syncDark);new MutationObserver(syncDark).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

/* ---------- старт ---------- */
(async()=>{try{await loadData(p=>{$('#loadBar').style.width=Math.round(p*100)+'%'});}catch(e){$('#loadTxt').textContent='Не удалось загрузить данные карты. Обновите страницу.';return}
  syncDark();M2.init();renderLayers();$('#loading').classList.add('done');
  const h=(location.hash||'').slice(1);const pm=h.match(/^poi=(-?\d+),(-?\d+)/);
  if(pm){const x=+pm[1],y=+pm[2];let best=null,bd=60;DATA.pois.forEach(p=>{const d=Math.hypot(p.x-x,p.y-y);if(d<bd){bd=d;best=p}});M2.flyTo(x,y,1.6);if(best)setTimeout(()=>APP.select({type:'p',p:best}),400)}
  else if(h==='3d')setMode('3d');else{const c=CUR.find(c=>c.id===h);if(c)APP.select({type:'c',c})}})();
