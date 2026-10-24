"""Adapt generated catalogue UI to supplier records; run after the static build."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'assets/site.js'
s=p.read_text(encoding='utf-8')
def rep(a,b):
    global s
    if a not in s: raise ValueError('UI pattern missing: '+a[:100])
    s=s.replace(a,b)
rep("const MCAT={", "CATS.push({id:'other',name:'Организации и услуги'});\nconst MCAT={other:'other',")
rep("const CF={", "CATN.other='Другие организации';\nconst CF={")
rep("hours:v.hours||'',phone:", "origin:v.origin||'',email:v.email||'',social:v.social||{},payment:v.payment||'',hours:v.hours||'',phone:")
rep("const gx=(v.lon-84.957)*61646,gy=(v.lat-56.4755)*111351;", "const hasGeo=Number.isFinite(v.lon)&&Number.isFinite(v.lat),gx=hasGeo?(v.lon-84.957)*61646:null,gy=hasGeo?(v.lat-56.4755)*111351:null;")
rep("(['nature','sight','church'].includes(v.cat)?0:null)", "(v.origin!=='supplier'&&['nature','sight','church'].includes(v.cat)?0:null)")
rep("mins:v.mins||VMINS[v.cat]||60", "mins:v.mins||(v.origin==='supplier'?null:VMINS[v.cat]||60)")
rep("gx:Math.round(gx),gy:Math.round(gy)", "gx:hasGeo?Math.round(gx):null,gy:hasGeo?Math.round(gy):null")
rep("function fmtMins(m){", "function fmtMins(m){if(m==null)return'Уточняется';")
rep('>На карте</a><a href="https://2gis.ru/tomsk/search/', '>На карте</a>`:\'\'}<a href="https://2gis.ru/tomsk/search/')
rep('<a href="${MAP_URL}#poi=${v[3]},${v[4]}"', '${Number.isFinite(v[3])&&Number.isFinite(v[4])?`<a href="${MAP_URL}#poi=${v[3]},${v[4]}"')
s=s.replace("v[7].replace(/[^+\\d]/g,'')", "v[7].split(/[,;]/)[0].replace(/[^+\\d]/g,'')")
s=s.replace("p.phone.replace(/[^+\\d]/g,'')", "p.phone.split(/[,;]/)[0].replace(/[^+\\d]/g,'')")
for field in ('name','addr','desc'):
    s=s.replace('${p.'+field+'}', '${esc(p.'+field+')}')
s=s.replace('${p.tags[0]}','${esc(p.tags[0]||p.kind)}')
s=s.replace('${p.why}.','${esc(p.why)}.')
s=s.replace('${p.phone}</a>', '${esc(p.phone)}</a>')
s=s.replace('${OH.human(p.hours)}','${esc(OH.human(p.hours))}')
s=s.replace('${p.prices}</p>', '${esc(p.prices)}</p>')
old=":p.hours?'Часы по данным OpenStreetMap — лучше уточнить перед визитом. ':''"
new=":p.hours?(p.origin==='supplier'?'Часы из предоставленной базы — уточните перед визитом. ':p.origin==='osm'?'Часы по данным OpenStreetMap — лучше уточнить перед визитом. ':'Часы лучше уточнить перед визитом. '):''"
rep(old,new)
rep("if(L.length)h+=", """if(p.email)L.push('<span class="credit">'+esc(p.email)+'</span>');
  if(p.payment)h+='<p class="credit">Оплата: '+esc(p.payment)+'</p>';
  if(L.length)h+=""")
s=s.replace("$('#drawer').classList","document.querySelector('#drawer')?.classList")
rep('<h3><button class="vname" data-open="${v[10]}">${esc(v[0])}</button></h3>',
    '<h3>${VSLUG[v[10]]?`<a class="vname" href="${ROOT}mesto/${VSLUG[v[10]]}/">${esc(v[0])}</a>`:`<button class="vname" data-open="${v[10]}">${esc(v[0])}</button>`}</h3>')
p.write_text(s,encoding='utf-8')
print('Supplier catalogue UI ready')

from pathlib import Path
import hashlib,re
from concurrent.futures import ThreadPoolExecutor
ROOT=Path(__file__).resolve().parents[1]
versions={name:hashlib.sha256((ROOT/'assets'/name).read_bytes()).hexdigest()[:12] for name in ['site.js','venue.js','site.css']}
def update_document(document):
    content=document.read_text(encoding='utf-8')
    updated=re.sub(r'assets/(site\.js|venue\.js|site\.css)(?:\?v=[a-zA-Z0-9]+)?',
                   lambda m:'assets/'+m[1]+'?v='+versions[m[1]],content)
    if updated!=content:document.write_text(updated,encoding='utf-8')
documents=[p for p in ROOT.rglob('*.html') if 'src' not in p.relative_to(ROOT).parts]
with ThreadPoolExecutor(max_workers=16) as pool:list(pool.map(update_document,documents))
print('Versioned documents:',len(documents))
