"""Import a purchased CSV into the site's venue schema without claiming verification."""
import argparse, csv, hashlib, json, math, re
from pathlib import Path
from collections import Counter
def norm(s):
    return re.sub(r'[^0-9a-zа-я]', '', (s or '').lower().replace('ё','е'))
def web(s):
    for u in re.split(r'[,\s]+', s or ''):
        if not u: continue
        if not re.match(r'^[a-z][a-z0-9+.-]*:',u,re.I): u='https://'+u
        if re.match(r'^https?://[^/\s]+\.[^/\s]+',u,re.I): return u
    return ''
def hours(raw):
    if not raw: return ''
    if raw.lower() in ('круглосуточно','ежедневно, круглосуточно'): return '24/7'
    days={'Пн':'Mo','Вт':'Tu','Ср':'We','Чт':'Th','Пт':'Fr','Сб':'Sa','Вс':'Su'}
    parts=re.split(r',\s*(?=(?:Пн|Вт|Ср|Чт|Пт|Сб|Вс):)',raw)
    out=[]
    for part in parts:
        m=re.fullmatch(r'(Пн|Вт|Ср|Чт|Пт|Сб|Вс):\s*(.*)',part.strip())
        if not m: return raw
        day,text=m.groups()
        if text=='выходной': out.append(days[day]+' off'); continue
        if text=='круглосуточно': out.append(days[day]+' 00:00-24:00'); continue
        spans=re.findall(r'с (\d{2}:\d{2}) до (\d{2}:\d{2})',text)
        if not spans or re.sub(r'с \d{2}:\d{2} до \d{2}:\d{2}|[;\s]','',text): return raw
        if any(int(x[:2])>24 or int(x[3:])>59 or x.startswith('24:') and x!='24:00' for span in spans for x in span): return raw
        out.append(days[day]+' '+','.join(a+'-'+b for a,b in spans))
    return '; '.join(out) if len(out)==7 else raw
RULES=[
 ('church',r'мечет|храм|церк|собор|монастыр|часовн|религиозн'),
 ('stay',r'гостиниц|хостел|отел|мотел|кемпинг|гостевых домов|баз[аы] отдыха|аренда коттедж'),
 ('bar',r'^бары$|пабы|ночные клубы|пивные бары'),
 ('food',r'кафе|кофейн|рестора|питани|столов|кулинар|кондитер|пекар|доставка.*блюд|суши|пицц|морожен|кофейные автоматы'),
 ('culture',r'музе|театр|кинотеатр|библиотек|галере|выставоч|концертн|филармон|дома.*культур|культурн.*центр'),
 ('nature',r'парк|сквер|сад|пляж|лес|набереж|смотров|природ|источник|водо[её]м|озер|озёр|остров|беседк|пикник'),
 ('sight',r'памят|скульптур|стрит.арт|интересные здания|достопримеч|историч|точки интереса|арт.объект|архитектур'),
 ('fun',r'детск|спорт|work out|тренаж|фитнес|аттракцион|развлеч|танц|квест|батут|саун|бани|бань|кальян|паровых коктейлей|боулинг|бильярд|караоке|игров|праздник|конн|каток|катки|турист|экскурс|клуб|йог|бассейн|рыбал|прокат|охот'),
 ('shop',r'магазин|торгов|сувенир|подар|рынок|изделия|цвет|товар')
]
# безымянные городские объекты: тысячи одинаковых «Детская площадка» без адреса — на сайт не берём
SKIP_KINDS={'Детские площадки','Площадки Work Out','Спортивные площадки','Уличные тренажёры','Теннисные столы','Беседки','Стрит-арт'}
# то же для записей без адреса, у которых название — просто вид объекта («Памятная доска», «Сцена»)
# или киоск сети без адреса: на сайте их нечем различить
SKIP_NAMES_NO_ADDR={'Памятная доска','Декоративный объект','Декоративное сооружение','Сцена','Смотровая площадка','Сэлфи-зеркало',
    'Зона барбекю','Мангал','Скульптура','Скейт-парк','Памп-трек','Памятник архитектуры','Памятник','Сад, цветник','Стела','Навес',
    'Сооружение','Информационно-навигационный барельеф','Значимые деревья','Поклонный крест',
    'Едет кофе, киоск по продаже кофе','33 пингвина, киоск мороженого','Ye Dao, точка азиатского стрит-фуда','Rocky boxer, игровой автомат',
    'Otello, сервис бронирования отелей по всему миру','Бугельный подъёмник, Горнолыжные подъёмники'}
# чистка базы: магазины, услуги, госорганы, секции и прочее не про досуг — виды целиком и отдельные записи
SKIP=json.loads((Path(__file__).parent/'import_skip.json').read_text(encoding='utf-8'))
SKIP_KINDS|=set(SKIP['kinds']); SKIP_IDS=set(SKIP['ids'])
def category(text):
    for cat,rule in RULES:
        if re.search(rule,text.lower()): return cat
    return 'other'
def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('csv');ap.add_argument('--venues',default='data/venues.json');ap.add_argument('--report',default='data/import-summary.json')
    a=ap.parse_args()
    db=json.loads(Path(a.venues).read_text(encoding='utf-8'))
    rows=list(csv.DictReader(Path(a.csv).open(encoding='utf-8-sig',newline=''),delimiter=';'))
    index={}
    for v in db['items']: index.setdefault(norm(v['name']),[]).append(v)
    report=Counter(input_rows=len(rows)); cats=Counter()
    by_id={v['id']:v for v in db['items']}
    for rownum,r in enumerate(rows,2):
        name=r['Название'].strip()
        city=r['Город'].strip(); address=r['Адрес'].strip()
        addr=address if not city or city=='Томск' else city+(', '+address if address else '')
        try:
            lat,lon=float(r['Широта']),float(r['Долгота'])
            if not(math.isfinite(lat) and math.isfinite(lon) and -90<=lat<=90 and -180<=lon<=180): raise ValueError()
        except (ValueError,TypeError):lat=lon=None
        if not name: raise ValueError('Empty name at CSV row '+str(rownum))
        kind=r['Подрубрика'].split(',')[0].strip() or r['Рубрика'].split(',')[0].strip()
        if kind in SKIP_KINDS or (name in SKIP_NAMES_NO_ADDR and not address): report['skipped_rows']+=1;continue
        tags=[x.strip() for x in r['Подрубрика'].split(',') if x.strip()]
        cat=category(kind or r['Рубрика'])
        rawhours=r['Время работы'].strip()
        v=dict(name=name,cat=cat,kind=kind,addr=addr,lat=lat,lon=lon,origin='supplier',checked='',pick=False,
               phone=re.sub(r'[‐‑‒–—−]','-',r['Телефон'] or r['Мобильный телефон']).strip(),
               web=web(r['Сайт']) or web(r['vkontakte']) or web(r['telegram']),
               hours=hours(rawhours),hoursRaw=rawhours,tags=tags,
               importSource='purchased-csv',importRows=[rownum],city=city,
               email=r['Email'].strip(),mobile=r['Мобильный телефон'].strip(),payment=r['Способы оплаты'].strip(),
               categories=r['Рубрика'].strip(),subcategories=r['Подрубрика'].strip(),
               social={k:r[k].strip() for k in ['whatsapp','viber','telegram','facebook','instagram','vkontakte','odnoklassniki','youtube','twitter','skype','icq','googleplus','linkedin','pinterest'] if r[k].strip()})
        stable='|'.join([name,addr,str(lat),str(lon)])
        source_id='s'+hashlib.sha256(stable.encode()).hexdigest()[:16]
        if source_id in SKIP_IDS: report['skipped_rows']+=1;continue
        dup=by_id.get(source_id)
        for old in index.get(norm(name),[]):
            if dup is not None: break
            if norm(old.get('addr'))==norm(addr) and norm(addr): dup=old;break
            if lat is not None and old.get('lat') is not None and old.get('lon') is not None and math.hypot((old['lat']-lat)*111351,(old['lon']-lon)*61646)<60:
                dup=old;break
        if dup:
            # Keep editorial text, verified fields, photos, IDs and publication choices.
            # Supplier details remain attributable separately when filling missing fields.
            dup.setdefault('importRows',[])
            if rownum not in dup['importRows']:dup['importRows'].append(rownum)
            if dup.get('origin')=='supplier':
                for k,val in v.items():
                    if k!='importRows' and val and not dup.get(k):dup[k]=val
            else:
                dup['supplierDetails']={k:val for k,val in v.items() if k not in ['name','pick','checked','origin','importRows'] and val}
            report['matched_rows']+=1;continue
        stable='|'.join([name,addr,str(lat),str(lon)])
        v['id']=source_id
        v={k:val for k,val in v.items() if val not in ('',[],{}) or k in ('lat','lon','name','id','cat')}
        if any(old['id']==v['id'] for old in db['items']): raise ValueError('ID collision')
        db['items'].append(v);index.setdefault(norm(name),[]).append(v);by_id[v['id']]=v
        report['added']+=1;cats[cat]+=1
        if lat is None:report['added_without_coordinates']+=1
    db['updated']='2026-10-24'
    report['total_venues']=len(db['items'])
    report['categories']=dict(cats)
    report['source_sha256']=hashlib.sha256(Path(a.csv).read_bytes()).hexdigest()
    Path(a.venues).write_text(json.dumps(db,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    Path(a.report).parent.mkdir(parents=True,exist_ok=True)
    Path(a.report).write_text(json.dumps(dict(report),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(dict(report),ensure_ascii=False))
if __name__=='__main__':main()
