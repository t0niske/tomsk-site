# -*- coding: utf-8 -*-
"""Главная страница берёт места из data/venues.json (его правит админка); встроенная копия — запасной вариант."""
import json, sys, re
D = sys.argv[1]; VJ = sys.argv[2]
H = open(D + '/tomsk.html').read()
V = json.load(open(VJ))
# схемные координаты мини-карты для первых 10 мест
SCH = {'nab': (455, 265), 'shatr': (655, 300), 'kraev': (600, 345), 'bot': (700, 205), 'lager': (540, 400), 'roshcha': (690, 240), 'dragon': (668, 318),
       'art': (520, 150), 'chekhov': (480, 220), 'gorsad': (640, 170)}
for it in V['items']:
    if it['id'] in SCH: it['mx'], it['my'] = SCH[it['id']]

def rep(a, b, cnt=1):
    global H
    assert a in H, a[:100]
    H = H.replace(a, b, cnt)

m = re.search(r'const PLACES = \[\n(.*?)\n\];', H, re.S)
LOADER = 'const VENUES0=' + json.dumps(V, ensure_ascii=False, separators=(',', ':')) + ''';
let PLACES=[],ALLV=[],CATALOG=[];
const MCAT={food:'food',bar:'food',culture:'culture',church:'culture',nature:'nature',fun:'fun',shop:'shop',sight:'unusual',stay:'unusual'};
const VMINS={food:75,bar:90,culture:90,church:20,nature:60,sight:20,fun:120,shop:30,stay:30};
const VMOOD={date:'Свидание',rain:'Под крышей',kids:'С детьми',wood:'Деревянный Томск',night:'Вечер',free:'Бесплатно'};
function sceneOf(v){const k=((v.kind||'')+' '+v.name).toLowerCase();switch(v.cat){
  case'food':return/коф|кондит|пекар|десерт|морож/.test(k)?'coffee':'cafe';case'bar':return/концерт|клуб/.test(k)?'concert':'cafe';
  case'culture':return/театр|концерт|филармон|кино/.test(k)?(/кино/.test(k)?'cinema':'concert'):/галер/.test(k)?'gallery':'museum';
  case'church':return'church';case'nature':return/набереж/.test(k)?'river':'garden';case'fun':return/батут|верёв|верев|скалод|экстрим|фитнес|спорт/.test(k)?'climb':'fair';
  case'shop':return'market';default:return'house'}}
function toPlace(v){const mo=v.moods||[];const gx=(v.lon-84.957)*61646,gy=(v.lat-56.4755)*111351;
  const tags=v.tags&&v.tags.length?v.tags:[v.kind||'Место'].concat(mo.map(m=>VMOOD[m]).filter(t=>t&&t!==v.kind).slice(0,1));
  const ph=(v.photos||[]).map(f=>[f.src,f.credit||'',f.license||'',f.link||'']);
  // мини-карта: свои координаты у первых мест, остальным — приблизительно
  const mx=v.mx!=null?v.mx:Math.max(30,Math.min(970,611+gx*.0678-gy*.0325)),my=v.my!=null?v.my:Math.max(25,Math.min(415,267+gx*.0315-gy*.0277));
  return{id:v.id,name:v.name,cat:MCAT[v.cat]||'unusual',vcat:v.cat,kind:v.kind||'',tags,scene:v.scene||sceneOf(v),indoor:mo.includes('rain')||['food','bar','culture','shop'].includes(v.cat),
    price:v.price!=null?v.price:(['nature','sight','church'].includes(v.cat)?0:null),addr:v.addr||'',mins:v.mins||VMINS[v.cat]||60,kids:mo.includes('kids'),rom:mo.includes('date'),
    desc:v.desc||'',why:v.why||'',hours:v.hours||'',phone:v.phone||'',web:v.web||'',prices:v.prices||'',checked:v.checked||'',src:v.src||'',cuisine:v.cuisine||'',
    feat:!!v.feat,pick:!!v.pick,ph:ph[0]||null,photos:ph,x:mx,y:my,gx:Math.round(gx),gy:Math.round(gy)}}
function applyVenues(V){ALLV=V.items.filter(v=>!v.hidden).map(toPlace);
  PLACES=ALLV.filter(p=>p.pick).sort((a,b)=>(b.feat?1:0)-(a.feat?1:0));
  CATALOG=ALLV.map(p=>[p.name,p.vcat,p.kind,p.gx,p.gy,p.addr,p.hours,p.phone,p.web,p.cuisine,p.id,p.ph?p.ph[0]:''])}
applyVenues(VENUES0);'''
H = H[:m.start()] + LOADER + H[m.end():]

rep("const byId=id=>PLACES.find(p=>p.id===id);", "const byId=id=>ALLV.find(p=>p.id===id)||PLACES.find(p=>p.id===id);")
rep("const photo=p=>PHOTOS[p.id]||PHOTOS[p.name]||null;", "const photo=p=>p.ph||PHOTOS[p.id]||PHOTOS[p.name]||null;")
# каталог: данные уже в CATALOG
H = re.sub(r'const CATALOG=\[.*?\];\n', '', H, count=1, flags=re.S)
# строка каталога: название открывает карточку, миниатюра фото
rep("return `<article class=\"vrow\"><h3>${esc(v[0])}</h3>",
    "return `<article class=\"vrow\">${v[11]?`<img class=\"vthumb\" src=\"${esc(v[11])}\" alt=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer\" onerror=\"this.remove()\">`:''}<h3><button class=\"vname\" data-open=\"${v[10]}\">${esc(v[0])}</button></h3>")
rep('.vrow h3{', '.vthumb{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:10px;margin-bottom:4px}.vname{background:none;border:0;padding:0;font:inherit;color:inherit;text-align:left;cursor:pointer}.vname:hover{text-decoration:underline}\n.vrow h3{')
# галерея в карточке, если фото несколько
rep("function infoBlock(p){const st=p.hours?OH.status(p.hours):null;let h='';",
    "function infoBlock(p){const st=p.hours?OH.status(p.hours):null;let h='';\n  if(p.photos&&p.photos.length>1)h+=`<div class=\"gal\">${p.photos.slice(1,7).map(f=>`<a href=\"${f[0]}\" target=\"_blank\" rel=\"noopener\"><img src=\"${f[0]}\" alt=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer\" onerror=\"this.parentNode.remove()\"></a>`).join('')}</div>`;")
rep('.vthumb{', '.gal{display:flex;gap:6px;overflow-x:auto}.gal img{height:72px;border-radius:8px;display:block}\n.vthumb{')
# свежая база с сервера — сразу после загрузки страницы
rep("function renderAll(){", """fetch('data/venues.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(V=>{if(!V||!V.items)return;applyVenues(V);renderAll();renderCatalog();renderMap();renderRoute()}).catch(()=>{});
function renderAll(){""")
rep('const phCredit=p=>{const f=photo(p);return f?`<p class="credit">Фото: <a href="${f[3]}" target="_blank" rel="noopener">${f[1]}</a>, ${f[2]} · Wikimedia Commons</p>`:\'\'};',
    'const phCredit=p=>{const f=photo(p);if(!f||!(f[1]||f[3]))return\'\';return`<p class="credit">Фото: ${f[3]?`<a href="${f[3]}" target="_blank" rel="noopener">${f[1]||\'источник\'}</a>`:f[1]}${f[2]?\', \'+f[2]:\'\'}${/wikimedia/.test(f[3]||\'\')?\' · Wikimedia Commons\':\'\'}</p>`};')
open(D + '/tomsk.html', 'w').write(H)
print('ok', len(V['items']))
