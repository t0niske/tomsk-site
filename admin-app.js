/* Админка «Куда сходить в Томске» — интерфейс. Сервер: admin.php */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CATS={food:'Кафе и рестораны',bar:'Бары',culture:'Музеи, театры, кино',church:'Храмы',nature:'Парки',fun:'Развлечения и спорт',shop:'Магазины и подарки',sight:'Достопримечательности',stay:'Где жить'};
const MOODS={date:'Свидание',rain:'Под крышей',kids:'С детьми',wood:'Деревянный Томск',night:'Вечер и ночь',free:'Бесплатно'};
const CENTER=[56.4846,84.948];
const S={db:null,reports:[],backups:[],gd:true,tab:'places',sel:null,dirty:false,f:{q:'',cat:'',pick:false,hidden:false,nohours:false,nophoto:false}};

async function api(a,body){const isForm=body instanceof FormData;
  const r=await fetch('admin.php?a='+a,{method:'POST',headers:isForm?{'X-Req':'1'}:{'X-Req':'1','Content-Type':'application/json'},body:isForm?body:JSON.stringify(body||{}),credentials:'same-origin'});
  let j;try{j=await r.json()}catch(e){throw new Error('Сервер ответил странно (код '+r.status+'). Проверьте, что PHP работает.')}
  if(r.status===401){renderLogin();throw new Error('Нужно войти')}if(!j.ok)throw new Error(j.error||'Ошибка');return j}
function toast(t){let el=$('.toast');if(!el){el=document.createElement('div');el.className='toast';document.body.appendChild(el)}el.textContent=t;el.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('on'),2600)}

/* ---------- вход ---------- */
function renderLogin(){$('#app').innerHTML=`<form class="login" id="lf"><h1>Админка</h1><p>«Куда сходить в Томске». Пароль задаётся в файле config.php на хостинге.</p>
  <input class="in" type="password" name="p" placeholder="Пароль" autocomplete="current-password" autofocus><button class="b pri" type="submit">Войти</button><div class="err" id="le"></div></form>`;
  $('#lf').onsubmit=async e=>{e.preventDefault();$('#le').textContent='';try{await api('login',{password:e.target.p.value});await boot()}catch(err){$('#le').textContent=err.message}}}

async function boot(){try{const j=await api('data');S.db=j.db;S.reports=j.reports||[];S.backups=j.backups||[];S.gd=j.gd;renderShell()}catch(e){if(e.message!=='Нужно войти'){$('#app').innerHTML=`<div class="boot">${esc(e.message)}</div>`}}}

/* ---------- каркас ---------- */
function renderShell(){const nrep=S.reports.filter(r=>!r.done).length;
  $('#app').innerHTML=`<header class="top"><h1>Куда сходить · админка</h1>
    <div class="tabs"><button data-tab="places" aria-pressed="${S.tab==='places'}">Места</button><button data-tab="reports" aria-pressed="${S.tab==='reports'}">Заявки${nrep?`<span class="badge">${nrep}</span>`:''}</button><button data-tab="backups" aria-pressed="${S.tab==='backups'}">Резервные копии</button></div>
    <span class="sp"></span><button class="b pri" id="addBtn">+ Добавить место</button><a class="b" href="./" target="_blank">Открыть сайт</a><button class="b" id="outBtn">Выйти</button></header><div id="body"></div>`;
  $$('.tabs button').forEach(b=>b.onclick=()=>{if(!confirmLeave())return;S.tab=b.dataset.tab;S.sel=null;S.dirty=false;renderShell()});
  $('#addBtn').onclick=()=>{if(!confirmLeave())return;S.tab='places';openItem(null)};
  $('#outBtn').onclick=async()=>{if(!confirmLeave())return;try{await api('logout')}catch(e){}renderLogin()};
  if(S.tab==='places')renderPlaces();else if(S.tab==='reports')renderReports();else renderBackups()}
function confirmLeave(){return !S.dirty||confirm('Есть несохранённые изменения. Уйти без сохранения?')}
window.addEventListener('beforeunload',e=>{if(S.dirty){e.preventDefault();e.returnValue=''}});

/* ---------- список мест ---------- */
function renderPlaces(){$('#body').innerHTML=`<div class="main" id="main"><aside class="side"><div class="filters">
    <input class="in" id="q" type="search" placeholder="Поиск: название, адрес, тип" value="${esc(S.f.q)}">
    <select class="in" id="fc"><option value="">Все категории</option>${Object.entries(CATS).map(([k,v])=>`<option value="${k}" ${S.f.cat===k?'selected':''}>${v}</option>`).join('')}</select>
    <div class="frow"><label class="chk"><input type="checkbox" id="fp" ${S.f.pick?'checked':''}>в подборке</label><label class="chk"><input type="checkbox" id="fnh" ${S.f.nohours?'checked':''}>без часов</label>
    <label class="chk"><input type="checkbox" id="fnp" ${S.f.nophoto?'checked':''}>без фото</label><label class="chk"><input type="checkbox" id="fh" ${S.f.hidden?'checked':''}>скрытые</label></div></div>
    <div class="count" id="cnt"></div><div class="list" id="list"></div></aside><section class="ed" id="ed"><div class="empty">Выберите место слева или нажмите «+ Добавить место».</div></section></div>`;
  let t;$('#q').oninput=e=>{clearTimeout(t);t=setTimeout(()=>{S.f.q=e.target.value;renderList()},150)};
  $('#fc').onchange=e=>{S.f.cat=e.target.value;renderList()};
  [['fp','pick'],['fnh','nohours'],['fnp','nophoto'],['fh','hidden']].forEach(([id,k])=>$('#'+id).onchange=e=>{S.f[k]=e.target.checked;renderList()});
  renderList();if(S.sel)renderEditor()}
function filtered(){const q=S.f.q.toLowerCase().replace(/ё/g,'е').split(/\s+/).filter(Boolean);
  return S.db.items.filter(v=>{if(!!v.hidden!==S.f.hidden)return false;if(S.f.cat&&v.cat!==S.f.cat)return false;if(S.f.pick&&!v.pick)return false;
    if(S.f.nohours&&v.hours)return false;if(S.f.nophoto&&v.photos&&v.photos.length)return false;
    if(q.length){const s=(v.name+' '+(v.addr||'')+' '+(v.kind||'')).toLowerCase().replace(/ё/g,'е');if(!q.every(w=>s.includes(w)))return false}return true})
   .sort((a,b)=>(b.feat?2:b.pick?1:0)-(a.feat?2:a.pick?1:0)||a.name.localeCompare(b.name,'ru'))}
function renderList(){const L=filtered();$('#cnt').textContent=`Найдено: ${L.length} из ${S.db.items.length}`;
  $('#list').innerHTML=L.slice(0,400).map(v=>{const ph=v.photos&&v.photos[0];return`<div class="item ${S.sel&&S.sel.id===v.id?'on':''} ${v.hidden?'hid':''}" data-id="${esc(v.id)}">
    <div class="th" style="${ph?`background-image:url('${esc(ph.src)}')`:''}"></div><div style="min-width:0"><div class="n">${esc(v.name)}</div>
    <div class="m">${v.feat?'<span class="flag f">главная</span>':''}${v.pick?'<span class="flag p">подборка</span>':''}${esc(v.kind||CATS[v.cat]||'')}${v.addr?' · '+esc(v.addr):''}</div></div></div>`}).join('')+(L.length>400?`<div class="count">Показаны первые 400 — уточните поиск.</div>`:'');
  $$('.item').forEach(el=>el.onclick=()=>{if(S.sel&&S.sel.id===el.dataset.id)return;if(!confirmLeave())return;openItem(S.db.items.find(v=>v.id===el.dataset.id))})}

/* ---------- редактор ---------- */
function openItem(v,prefill){S.sel=v?JSON.parse(JSON.stringify(v)):{id:'',name:'',cat:'food',lat:CENTER[0],lon:CENTER[1],photos:[],moods:[],pick:false,isNew:true};
  if(prefill)Object.assign(S.sel,prefill);S.dirty=!!prefill;
  if(!$('#ed'))renderPlaces();else{renderList();renderEditor()}}
function renderEditor(){const v=S.sel;$('#main').classList.add('editing');
  const kinds=[...new Set(S.db.items.map(x=>x.kind).filter(Boolean))].sort();
  $('#ed').innerHTML=`<button class="b sm back" id="back">← К списку</button>
  <h2>${v.id?esc(v.name):'Новое место'}</h2><div class="sub">${v.origin==='osm'?'Из OpenStreetMap':v.origin==='editor'?'Подборка редакции':v.id?'Добавлено в админке':''}${v.hidden?' · <b style="color:var(--red)">скрыто с сайта</b>':''}</div>
  <div class="card"><h3>Основное</h3><div class="grid">
    <label class="f full">Название<input class="in" data-k="name" value="${esc(v.name)}" maxlength="160"></label>
    <label class="f">Категория<select class="in" data-k="cat">${Object.entries(CATS).map(([k,t])=>`<option value="${k}" ${v.cat===k?'selected':''}>${t}</option>`).join('')}</select></label>
    <label class="f">Тип <small>(кафе, музей, бар…)</small><input class="in" data-k="kind" list="kinds" value="${esc(v.kind)}" maxlength="80"><datalist id="kinds">${kinds.map(k=>`<option value="${esc(k)}">`).join('')}</datalist></label>
    <label class="f full">Адрес<input class="in" data-k="addr" value="${esc(v.addr)}" placeholder="пр. Ленина, 84" maxlength="200"></label>
    <div class="full"><div class="frow" style="margin-bottom:6px;align-items:center"><button class="b sm" id="geo">Найти адрес на карте</button><span class="help">или нажмите на карту / перетащите метку</span><span class="sp" style="flex:1"></span><span class="help" id="ll"></span></div><div class="map" id="map"></div><div class="frow" style="margin-top:6px"><label class="f" style="flex:1">Широта<input class="in" id="lat" type="number" step="0.000001" value="${v.lat}"></label><label class="f" style="flex:1">Долгота<input class="in" id="lon" type="number" step="0.000001" value="${v.lon}"></label></div></div>
  </div></div>
  <div class="card"><h3>Часы работы</h3><div class="frow" style="margin-bottom:10px"><label class="chk"><input type="checkbox" id="h247">Круглосуточно</label><label class="chk"><input type="checkbox" id="hnone">Не указывать (парк, памятник)</label>
    <button class="b sm" id="hcopy" type="button">Как в понедельник → на все дни</button><button class="b sm" id="hwork" type="button">Пн → на будни</button></div>
    <div class="hrs" id="hrs"></div>
    <label class="f" style="margin-top:10px">Строка для сайта <small>(заполняется сама; можно править вручную)</small><input class="in" data-k="hours" id="hraw" value="${esc(v.hours)}" maxlength="300" placeholder="Mo-Fr 09:00-18:00; Sa-Su 10:00-16:00"></label>
    <div class="help" id="hprev"></div></div>
  <div class="card"><h3>Цены и контакты</h3><div class="grid">
    <label class="f">Цены, средний чек <small>(текст на сайте)</small><input class="in" data-k="prices" value="${esc(v.prices)}" placeholder="средний чек 800–1200 ₽" maxlength="300"></label>
    <label class="f">Вход или чек от, ₽ <small>(число — для фильтров, 0 = бесплатно)</small><input class="in" data-k="price" type="number" min="0" step="10" value="${v.price??''}"></label>
    <label class="f">Телефон<input class="in" data-k="phone" value="${esc(v.phone)}" placeholder="+7 (3822) 00-00-00" maxlength="60"></label>
    <label class="f">Сайт или соцсеть<input class="in" data-k="web" value="${esc(v.web)}" placeholder="https://…" maxlength="300"></label>
    <label class="f">Кухня <small>(для кафе)</small><input class="in" data-k="cuisine" value="${esc(v.cuisine)}" maxlength="120"></label>
    <label class="f">Сколько времени займёт, мин<input class="in" data-k="mins" type="number" min="5" step="5" value="${v.mins??''}"></label>
    <label class="f">Данные проверены<span class="frow"><input class="in" data-k="checked" type="date" value="${esc(v.checked)}" style="flex:1"><button class="b sm" type="button" id="today">Сегодня</button></span></label>
    <label class="f">Где проверяли <small>(ссылка на сайт места)</small><input class="in" data-k="src" value="${esc(v.src)}" maxlength="300"></label>
  </div></div>
  <div class="card"><h3>Описание</h3><div class="grid">
    <label class="f full">Чем интересно — одной строкой<input class="in" data-k="why" value="${esc(v.why)}" maxlength="300" placeholder="Сибирская кухня из рыбы, дичи и дикоросов"></label>
    <label class="f full">Описание<textarea class="in" data-k="desc" maxlength="4000">${esc(v.desc)}</textarea></label>
    <div class="full"><div class="help" style="margin-bottom:6px">Настроения — по ним работают кнопки «Свидание», «С детьми» и др.</div><div class="frow">${Object.entries(MOODS).map(([k,t])=>`<label class="chk"><input type="checkbox" data-mood="${k}" ${(v.moods||[]).includes(k)?'checked':''}>${t}</label>`).join('')}</div></div>
    <div class="full frow"><label class="chk"><input type="checkbox" data-flag="pick" ${v.pick?'checked':''}><b>В подборке</b> — карточка в «Популярных местах» и золотая метка на карте</label></div>
    <div class="full frow"><label class="chk"><input type="checkbox" data-flag="feat" ${v.feat?'checked':''}><b>На главной первым</b> — и на мини-карте</label></div>
  </div></div>
  <div class="card"><h3>Страница места <span class="help">для отдельной страницы заведения на сайте</span></h3><div class="grid">
    <label class="f full">Подробно <small>(абзацы через пустую строку)</small><textarea class="in" data-k="about" maxlength="6000" rows="6">${esc(v.about)}</textarea></label>
    <label class="f full">Что посмотреть / попробовать <small>(каждый пункт с новой строки)</small><textarea class="in" data-k="look" maxlength="1500" rows="4">${esc(v.look)}</textarea></label>
    <label class="f full">Советы <small>(каждый совет с новой строки)</small><textarea class="in" data-k="tips" maxlength="1500" rows="3">${esc(v.tips)}</textarea></label>
  </div></div>
  <div class="card"><h3>Фото <span class="help">первое — главное; ${S.gd?'большие снимки сжимаются автоматически':'сжатие недоступно на хостинге — загружайте фото до 2 МБ'}</span></h3>
    <div class="photos" id="photos"></div></div>
  <div class="bar"><span class="st" id="st"></span>${v.id?`<button class="b red" id="del">${v.hidden?'Удалено':(v.origin==='admin'?'Удалить':'Скрыть с сайта')}</button>`:''}${v.hidden?'<button class="b" id="restore">Вернуть на сайт</button>':''}<button class="b pri" id="save">Сохранить</button></div>`;
  $('#back').onclick=()=>{if(!confirmLeave())return;S.sel=null;S.dirty=false;$('#main').classList.remove('editing');$('#ed').innerHTML='<div class="empty">Выберите место слева.</div>';renderList()};
  $$('#ed [data-k]').forEach(el=>el.addEventListener('input',()=>{const k=el.dataset.k;let val=el.value;if(el.type==='number')val=val===''?null:+val;S.sel[k]=val;markDirty();if(k==='hours'){hoursFromRaw();}}));
  $$('#ed [data-mood]').forEach(el=>el.onchange=()=>{const s=new Set(S.sel.moods||[]);el.checked?s.add(el.dataset.mood):s.delete(el.dataset.mood);S.sel.moods=[...s];markDirty()});
  $$('#ed [data-flag]').forEach(el=>el.onchange=()=>{S.sel[el.dataset.flag]=el.checked;markDirty()});
  $('#today').onclick=()=>{const d=new Date();const s=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');$('[data-k=checked]').value=s;S.sel.checked=s;markDirty()};
  $('#save').onclick=save;if($('#del'))$('#del').onclick=del;if($('#restore'))$('#restore').onclick=()=>{S.sel.hidden=false;save()};
  ['lat','lon'].forEach(k=>$('#'+k).oninput=e=>{const x=parseFloat(e.target.value);if(isNaN(x))return;S.sel[k]=x;if(mk){mk.setLatLng([S.sel.lat,S.sel.lon]);map.panTo([S.sel.lat,S.sel.lon])}markDirty()});
  if(v.hint)renderHint();
  initMap();initHours();renderPhotos();markDirty(S.dirty)}
function renderHint(){const h=S.sel.hint;const box=document.createElement('div');box.className='card';box.style.background='#FFF6E5';
  const F={hours:'Часы',prices:'Цены',phone:'Телефон',web:'Сайт',text:'Комментарий'};
  box.innerHTML=`<h3>Из заявки</h3>${Object.keys(F).filter(k=>h[k]).map(k=>`<div class="frow" style="align-items:center;margin-bottom:6px"><span style="flex:1"><b>${F[k]}:</b> ${esc(h[k])}</span>${k!=='text'?`<button class="b sm" data-put="${k}">Подставить</button>`:''}</div>`).join('')}<div class="help">Часы удобнее внести в сетку по дням ниже — тогда сайт покажет «Открыто до …».</div>`;
  $('#ed .sub').after(box);
  $$('[data-put]',box).forEach(b=>b.onclick=()=>{const k=b.dataset.put;S.sel[k]=h[k];const el=$(`#ed [data-k=${k}]`);if(el)el.value=h[k];if(k==='hours')hoursFromRaw();markDirty();b.textContent='✓'})}
function markDirty(d=true){S.dirty=d;const st=$('#st');if(st){st.textContent=d?'Есть несохранённые изменения':'Все изменения сохранены';st.classList.toggle('dirty',d)}}
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'&&S.sel){e.preventDefault();save()}});

async function save(){const v=S.sel;if(!v.name||!v.name.trim()){toast('Укажите название');return}
  $('#save').disabled=true;try{const it=Object.assign({},v);delete it.isNew;delete it.hint;const j=await api('save',{item:it});
    const i=S.db.items.findIndex(x=>x.id===j.item.id);if(i>=0)S.db.items[i]=j.item;else S.db.items.unshift(j.item);
    S.sel=JSON.parse(JSON.stringify(j.item));S.dirty=false;renderList();renderEditor();toast('Сохранено — на сайте уже видно')}
  catch(e){toast(e.message)}finally{const b=$('#save');if(b)b.disabled=false}}
async function del(){const v=S.sel;const hard=v.origin==='admin';
  if(!confirm(hard?`Удалить «${v.name}» насовсем?`:`Скрыть «${v.name}» с сайта и карты? Вернуть можно в любой момент: фильтр «скрытые».`))return;
  try{const j=await api('delete',{id:v.id});if(j.result==='deleted'){S.db.items=S.db.items.filter(x=>x.id!==v.id);S.sel=null;S.dirty=false;$('#ed').innerHTML='<div class="empty">Место удалено.</div>'}
    else{const it=S.db.items.find(x=>x.id===v.id);it.hidden=true;S.sel=JSON.parse(JSON.stringify(it));S.dirty=false;renderEditor()}renderList();toast(j.result==='deleted'?'Удалено':'Скрыто с сайта')}catch(e){toast(e.message)}}

/* ---------- карта для координат ---------- */
let map=null,mk=null;
function initMap(){const v=S.sel;const el=$('#map');if(typeof L==='undefined'){el.innerHTML='<div class="help" style="padding:12px">Карта не загрузилась. Координаты можно ввести вручную.</div>';return}
  map=L.map(el,{scrollWheelZoom:false}).setView([v.lat,v.lon],v.isNew?13:17);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© участники OpenStreetMap'}).addTo(map);
  mk=L.marker([v.lat,v.lon],{draggable:true}).addTo(map);const upd=ll=>{S.sel.lat=+ll.lat.toFixed(6);S.sel.lon=+ll.lng.toFixed(6);$('#ll').textContent=S.sel.lat+', '+S.sel.lon};
  $('#ll').textContent=v.lat+', '+v.lon;mk.on('dragend',()=>{upd(mk.getLatLng());markDirty()});map.on('click',e=>{mk.setLatLng(e.latlng);upd(e.latlng);markDirty()});
  setTimeout(()=>map.invalidateSize(),50);
  $('#geo').onclick=async()=>{const a=(S.sel.addr||S.sel.name||'').trim();if(!a){toast('Сначала впишите адрес');return}
    try{const r=await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ru&viewbox=84.80,56.58,85.15,56.38&bounded=1&q='+encodeURIComponent('Томск, '+a));const j=await r.json();
      if(!j.length){toast('Адрес не найден — поставьте метку вручную');return}const ll=L.latLng(+j[0].lat,+j[0].lon);mk.setLatLng(ll);map.setView(ll,17);upd(ll);markDirty()}catch(e){toast('Поиск адреса недоступен — поставьте метку вручную')}}}

/* ---------- часы работы ---------- */
const DN=['Mo','Tu','We','Th','Fr','Sa','Su'],DR=['пн','вт','ср','чт','пт','сб','вс'];
let week=null;
function parseOH(s){const w=DN.map(()=>null);if(!s)return{w:DN.map(()=>[]),empty:true};s=s.trim();if(s==='24/7')return{w:DN.map(()=>[[0,1440]]),all:true};
  for(let part of s.split(';')){part=part.trim();if(!part)continue;if(/^PH\b/.test(part))continue;
    const m=part.match(/^((?:(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:\s*-\s*(?:Mo|Tu|We|Th|Fr|Sa|Su))?\s*,?\s*)+)?(.*)$/);const days=[];
    if(m[1])m[1].split(',').forEach(x=>{x=x.trim();if(!x)return;const[a,b]=x.split('-').map(t=>t.trim());const ia=DN.indexOf(a),ib=b?DN.indexOf(b):ia;if(ia<0||ib<0)return;for(let k=ia;;k=(k+1)%7){days.push(k);if(k===ib)break}});else for(let k=0;k<7;k++)days.push(k);
    const rest=(m[2]||'').trim();if(/^(off|closed)$/i.test(rest)){days.forEach(d=>w[d]=[]);continue}
    const sp=[];(rest.match(/\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/g)||[]).forEach(t=>{const[a,b]=t.split('-').map(x=>x.trim().split(':').map(Number));sp.push([a[0]*60+a[1],b[0]*60+b[1]])});
    if(!sp.length)return null;days.forEach(d=>w[d]=sp)}
  return{w:w.map(x=>x||[])}}
const tm=m=>String(Math.floor(m/60)%25).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
function buildOH(w){if(w.every(d=>d.length===1&&d[0][0]===0&&d[0][1]>=1440))return'24/7';const key=d=>w[d].length?w[d].map(s=>tm(s[0])+'-'+tm(s[1]===1440?1440:s[1])).join(','):'off';
  const g=[];for(let d=0;d<7;d++){const k=key(d),L=g[g.length-1];if(L&&L.k===k)L.b=d;else g.push({a:d,b:d,k})}
  return g.map(x=>(x.a===x.b?DN[x.a]:DN[x.a]+'-'+DN[x.b])+' '+x.k).join('; ').replace(/24:00/g,'24:00')}
function humanOH(s){const p=parseOH(s);if(!s)return'';if(!p)return'Сайт покажет эту строку как есть: «'+s+'»';if(p.all)return'На сайте: круглосуточно';
  const key=d=>p.w[d].map(x=>tm(x[0])+'–'+tm(x[1])).join(', ')||'выходной';const g=[];for(let d=0;d<7;d++){const k=key(d),L=g[g.length-1];if(L&&L.k===k)L.b=d;else g.push({a:d,b:d,k})}
  return'На сайте: '+g.map(x=>(x.a===x.b?DR[x.a]:DR[x.a]+'–'+DR[x.b])+' '+x.k).join('; ')}
function initHours(){hoursFromRaw();
  $('#h247').onchange=e=>{if(e.target.checked){$('#hnone').checked=false;week=DN.map(()=>[[0,1440]]);}else week=DN.map(()=>[[600,1320]]);hoursToRaw()};
  $('#hnone').onchange=e=>{if(e.target.checked){$('#h247').checked=false;week=null;S.sel.hours='';$('#hraw').value='';renderHrs();markDirty();$('#hprev').textContent=''}else{week=DN.map(()=>[[600,1320]]);hoursToRaw()}};
  $('#hcopy').onclick=()=>{if(!week)return;week=DN.map(()=>JSON.parse(JSON.stringify(week[0])));hoursToRaw()};
  $('#hwork').onclick=()=>{if(!week)return;for(let d=1;d<5;d++)week[d]=JSON.parse(JSON.stringify(week[0]));hoursToRaw()}}
function hoursFromRaw(){const s=S.sel.hours||'';const p=parseOH(s);
  if(!s){week=null;$('#hnone').checked=true;$('#h247').checked=false}else if(p){week=p.w;$('#hnone').checked=false;$('#h247').checked=!!p.all}else{week=null;$('#hnone').checked=false}
  renderHrs();$('#hprev').textContent=humanOH(s)}
function hoursToRaw(){const s=buildOH(week);S.sel.hours=s;$('#hraw').value=s;$('#hprev').textContent=humanOH(s);renderHrs();markDirty()}
function renderHrs(){const el=$('#hrs');if(!week){el.innerHTML=S.sel.hours?'<div class="help" style="grid-column:1/-1">Строка ниже в свободной форме — сетка по дням недоступна. Нажмите «Как в понедельник», чтобы начать заново.</div>':'';return}
  const all=$('#h247').checked;el.classList.toggle('off-all',all);
  el.innerHTML=DR.map((d,i)=>{const sp=week[i][0];const off=!week[i].length;return`<span class="d">${d}</span>
    <input class="in" type="time" data-d="${i}" data-e="0" value="${off?'':tm(sp[0])}" ${off?'disabled':''}><input class="in" type="time" data-d="${i}" data-e="1" value="${off?'':tm(sp[1]%1440)}" ${off?'disabled':''}>
    <label class="chk"><input type="checkbox" data-off="${i}" ${off?'checked':''}>выходной</label>`}).join('');
  $$('#hrs input[type=time]').forEach(el=>el.onchange=()=>{const d=+el.dataset.d,e=+el.dataset.e;const[h,m]=el.value.split(':').map(Number);if(isNaN(h))return;let v=h*60+m;
    const sp=week[d][0]||[600,1320];if(e===1&&v===0)v=1440;sp[e]=v;week[d]=[sp];hoursToRaw()});
  $$('#hrs [data-off]').forEach(el=>el.onchange=()=>{const d=+el.dataset.off;week[d]=el.checked?[]:[[600,1320]];hoursToRaw()})}

/* ---------- фото ---------- */
function renderPhotos(){const P=S.sel.photos||(S.sel.photos=[]);
  $('#photos').innerHTML=P.map((p,i)=>`<div class="ph ${i===0?'main':''}"><img src="${esc(p.src)}" alt="" referrerpolicy="no-referrer"><div class="pc">
    <button data-mv="${i},-1" title="Левее">←</button><button data-main="${i}" title="Сделать главным">★</button><button data-mv="${i},1" title="Правее">→</button><button data-rm="${i}" title="Удалить">✕</button></div>
    <input data-cr="${i}" value="${esc(p.credit||'')}" placeholder="Автор фото (необязательно)"></div>`).join('')+
    `<label class="drop" id="drop"><input type="file" accept="image/*" multiple hidden id="fi"><span>Перетащите фото сюда<br>или нажмите, чтобы выбрать</span></label>`;
  $$('#photos [data-mv]').forEach(b=>b.onclick=()=>{const[i,d]=b.dataset.mv.split(',').map(Number),j=i+d;if(j<0||j>=P.length)return;[P[i],P[j]]=[P[j],P[i]];renderPhotos();markDirty()});
  $$('#photos [data-main]').forEach(b=>b.onclick=()=>{const i=+b.dataset.main;P.unshift(P.splice(i,1)[0]);renderPhotos();markDirty()});
  $$('#photos [data-rm]').forEach(b=>b.onclick=()=>{if(!confirm('Убрать это фото из карточки?'))return;P.splice(+b.dataset.rm,1);renderPhotos();markDirty()});
  $$('#photos [data-cr]').forEach(el=>el.oninput=()=>{P[+el.dataset.cr].credit=el.value;markDirty()});
  const dr=$('#drop');$('#fi').onchange=e=>upload([...e.target.files]);
  dr.ondragover=e=>{e.preventDefault();dr.classList.add('over')};dr.ondragleave=()=>dr.classList.remove('over');
  dr.ondrop=e=>{e.preventDefault();dr.classList.remove('over');upload([...e.dataTransfer.files].filter(f=>f.type.startsWith('image/')))}}
async function upload(files){if(!files.length)return;let n=0;
  for(const f of files){toast(`Загружаем фото ${++n} из ${files.length}…`);const fd=new FormData();fd.append('photo',f);fd.append('id',S.sel.id||'new');
    try{const j=await api('upload',fd);S.sel.photos.push({src:j.src,credit:''});renderPhotos();markDirty()}catch(e){toast(f.name+': '+e.message);await new Promise(r=>setTimeout(r,1500))}}
  toast('Фото добавлены — нажмите «Сохранить»')}

/* ---------- заявки ---------- */
const nn=s=>(s||'').toLowerCase().replace(/ё/g,'е').replace(/[^0-9a-zа-я]/g,'');
function findVenue(name){const k=nn(name);if(!k)return null;return S.db.items.find(v=>nn(v.name)===k)||S.db.items.find(v=>nn(v.name).startsWith(k)||k.startsWith(nn(v.name)))||null}
function renderReports(){const R=S.reports;
  $('#body').innerHTML=`<div class="reps">${R.length?'':'<div class="empty">Заявок пока нет. Они приходят из формы «Это ваше место или нашли ошибку?» на сайте.</div>'}${R.map((r,i)=>{const v=findVenue(r.place);return`<div class="rep ${r.done?'done':''}">
    <b>${esc(r.place)}</b> <span class="help">${new Date(r.time).toLocaleString('ru-RU')} · ${r.who==='owner'?'владелец':'посетитель'}${v?' · место есть в базе':' · <b>нового места нет в базе</b>'}</span>
    <dl>${[['hours','Часы'],['prices','Цены'],['phone','Телефон'],['web','Сайт'],['text','Комментарий'],['contact','Контакт']].filter(([k])=>r[k]).map(([k,t])=>`<dt>${t}</dt><dd>${esc(r[k])}</dd>`).join('')}</dl>
    ${(r.photos||[]).length?`<div class="imgs">${r.photos.map(p=>`<figure><a href="admin.php?rphoto=${encodeURIComponent(p)}" target="_blank"><img src="admin.php?rphoto=${encodeURIComponent(p)}" alt=""></a></figure>`).join('')}</div>`:''}
    <div class="frow"><button class="b sm pri" data-apply="${i}">${v?'Открыть место и подставить данные':'Создать место из заявки'}</button><button class="b sm" data-done="${i}">${r.done?'Вернуть в работу':'Отметить обработанной'}</button></div></div>`}).join('')}</div>`;
  $$('[data-done]').forEach(b=>b.onclick=async()=>{const r=R[+b.dataset.done];try{await api('report_done',{id:r.id,done:!r.done});r.done=!r.done;renderShell()}catch(e){toast(e.message)}});
  $$('[data-apply]').forEach(b=>b.onclick=async()=>{const r=R[+b.dataset.apply];const v=findVenue(r.place);const pre={};
    pre.hint={hours:r.hours,prices:r.prices,phone:r.phone,web:r.web,text:r.text};if(!v){pre.name=r.place;['prices','phone','web'].forEach(k=>{if(r[k])pre[k]=r[k]});if(r.text)pre.desc=r.text}
    const photos=[];for(const p of r.photos||[]){try{toast('Переносим фото из заявки…');const j=await api('report_photo_import',{name:p});photos.push({src:j.src,credit:r.who==='owner'?'фото заведения':''})}catch(e){toast(e.message)}}
    S.tab='places';renderShell();openItem(v,pre);if(photos.length){S.sel.photos=(S.sel.photos||[]).concat(photos);renderPhotos();markDirty()}
    toast('Заявка открыта: подставьте нужное и нажмите «Сохранить»')})}

/* ---------- резервные копии ---------- */
function renderBackups(){$('#body').innerHTML=`<div class="reps"><p class="help">Перед каждым сохранением база копируется. Хранятся 40 последних копий. Восстановление заменит текущие данные выбранной копией (текущие тоже сохранятся копией).</p>
  ${S.backups.length?S.backups.map(f=>{const m=f.match(/(\d{4})(\d\d)(\d\d)-(\d\d)(\d\d)(\d\d)/);return`<div class="rep frow" style="align-items:center"><span style="flex:1">${m?`${m[3]}.${m[2]}.${m[1]} ${m[4]}:${m[5]}:${m[6]}`:esc(f)}</span><button class="b sm" data-rs="${esc(f)}">Восстановить</button></div>`}).join(''):'<div class="empty">Копий пока нет — они появятся после первого сохранения.</div>'}</div>`;
  $$('[data-rs]').forEach(b=>b.onclick=async()=>{if(!confirm('Восстановить базу из этой копии?'))return;try{await api('restore',{file:b.dataset.rs});toast('Восстановлено');await boot()}catch(e){toast(e.message)}})}

if(window.ADMIN_AUTHED)boot();else renderLogin();
})();
