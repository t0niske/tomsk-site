/* ================== ДАННЫЕ И ОБЩЕЕ ================== */
const $=s=>document.querySelector(s);
const IC={
  house:'M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5',leaf:'M5 19c0-9 6-14 15-14 0 9-5 15-14 15M5 19l8-8',
  col:'M3 9l9-5 9 5M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 20h18',cup:'M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 11h2a2 2 0 0 1 0 4h-2M8 3v3M12 3v3',
  note:'M9 18V5l11-2v13M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',wave:'M2 12q3-3 6 0t6 0 6 0 2 0M2 17q3-3 6 0t6 0 6 0 2 0',
  flag:'M12 2v20M9 22h6M10 6h4v12h-4z',frame:'M3 4h18v16H3zM3 16l5-5 4 4 3-3 6 6',church:'M12 2v4M10 4h4M8 10l4-4 4 4M8 10v11h8V10M5 21h14M11 21v-4h2v4',
  star:'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',fork:'M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 1-3 4-3 8h3',
  beer:'M6 8h10v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zM16 10h2a2 2 0 0 1 0 4h-2M6 8a3 3 0 0 1 5-3 3 3 0 0 1 5 3',bed:'M3 18V7M3 13h18v5M21 18v-5a3 3 0 0 0-3-3h-7v3',
  book:'M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6M20 4v14h-6',mask:'M3 4h9v6a4.5 4.5 0 0 1-9 0zM12 9h9v6a4.5 4.5 0 0 1-9 0',
  bag:'M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2',ball:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18',
  pin:'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',x:'M6 6l12 12M18 6L6 18',
  ext:'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',search:'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  cube:'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5',map:'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
  sun:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5',
  moon:'M20 14A8 8 0 1 1 10 4a6.5 6.5 0 0 0 10 10z',dawn:'M3 18h18M7 18a5 5 0 0 1 10 0M12 6v3M5 10l1.5 1.5M19 10l-1.5 1.5',dusk:'M3 18h18M7 18a5 5 0 0 1 10 0M12 4v4M10 6l2 2 2-2',
  walk:'M13 4a2 2 0 1 0 0-.1M10 21l2-6-3-3 1-5 4 3 3 1M12 15l3 6',check:'M5 12l5 5 9-10',prev:'M15 6l-6 6 6 6',next:'M9 6l6 6-6 6',
  layers:'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5',locate:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3',
  plus:'M12 5v14M5 12h14',minus:'M5 12h14',compass:'M12 3l3 9-3 9-3-9z'
};
const ico=(k,c='ico')=>`<svg class="${c}" viewBox="0 0 24 24"><path d="${IC[k]}"/></svg>`;

/* --- категории POI --- */
const PCAT={other:{t:'Другие организации',c:'#637282',i:'star'},
  sight:{t:'Достопримечательности',c:'#1D5A42',i:'star'},culture:{t:'Музеи и театры',c:'#7A4FA0',i:'col'},church:{t:'Храмы',c:'#B8892E',i:'church'},
  food:{t:'Кафе и рестораны',c:'#DB7F33',i:'cup'},bar:{t:'Бары',c:'#B5462E',i:'beer'},nature:{t:'Парки и скверы',c:'#2E8A5C',i:'leaf'},
  fun:{t:'Развлечения и спорт',c:'#D2456A',i:'ball'},shop:{t:'Магазины и подарки',c:'#8A4B2A',i:'bag'},stay:{t:'Где жить',c:'#2C7DB8',i:'bed'}
};
function poiCat(t){
  if(t.amenity==='place_of_worship')return'church';
  if(t.tourism==='museum'||t.tourism==='gallery'||['theatre','cinema','arts_centre','library','planetarium','community_centre'].includes(t.amenity))return'culture';
  if(['cafe','restaurant','fast_food','ice_cream'].includes(t.amenity)||['bakery','confectionery'].includes(t.shop))return'food';
  if(['bar','pub','nightclub'].includes(t.amenity))return'bar';
  if(t.leisure==='park'||t.leisure==='garden')return'nature';
  if(t.leisure||t.tourism==='theme_park'||t.tourism==='zoo')return'fun';
  if(t.shop)return'shop';
  if(['hotel','hostel','motel','guest_house','apartment'].includes(t.tourism))return'stay';
  if(t.historic||t.tourism==='attraction'||t.tourism==='artwork'||t.tourism==='viewpoint'||t.amenity==='fountain')return'sight';
  return null}
const KIND_RU={cafe:'Кафе',restaurant:'Ресторан',fast_food:'Быстрое питание',ice_cream:'Мороженое',bakery:'Пекарня',confectionery:'Кондитерская',bar:'Бар',pub:'Паб',nightclub:'Клуб',
  museum:'Музей',gallery:'Галерея',theatre:'Театр',cinema:'Кинотеатр',arts_centre:'Арт-центр',library:'Библиотека',planetarium:'Планетарий',community_centre:'Культурный центр',
  place_of_worship:'Храм',park:'Парк',garden:'Сад',sports_centre:'Спортивный центр',fitness_centre:'Фитнес',ice_rink:'Каток',water_park:'Аквапарк',amusement_arcade:'Игровые автоматы',escape_game:'Квест',bowling_alley:'Боулинг',
  hotel:'Гостиница',hostel:'Хостел',motel:'Мотель',guest_house:'Гостевой дом',memorial:'Памятник',monument:'Монумент',attraction:'Достопримечательность',artwork:'Арт-объект',viewpoint:'Смотровая',
  manor:'Особняк',building:'Историческое здание',books:'Книжный',gift:'Подарки',art:'Арт-магазин',craft:'Мастерская',mall:'Торговый центр',department_store:'Универмаг',fountain:'Фонтан',information:'Инфоцентр'};

/* --- избранные места: живые истории --- */
const CUR=[
 {id:'shatr',name:'Дом с шатром',cat:'Деревянное зодчество',ic:'house',col:'#2C7DB8',x:486,y:-634,b:696,addr:'ул. Красноармейская, 71',theme:'lace',moods:['date','wood','free'],
  why:'Восьмигранная башня с шатром и шпилем',story:'Особняк купца Георгия Голованова (1904) стоит на высоком кирпичном цоколе, поэтому кажется лёгким. Главная деталь — восьмигранная башня под шатром со шпилем, резьба с солнечными знаками. Дом восстановил Российско-немецкий дом, который работает здесь сейчас.',
  hours:null,price:'Снаружи бесплатно',mins:20,hist:'Красноармейская тогда называлась Миллионной: здесь строились самые богатые томичи.'},
 {id:'dragon',name:'Дом с драконами',cat:'Деревянное зодчество',ic:'house',col:'#3E5A7A',x:559,y:-359,b:2892,addr:'ул. Красноармейская, 68',theme:'dragon',moods:['wood','free'],
  why:'Семь резных драконов на фронтонах',story:'Дом построен в 1917 году для учителя гимназии Бронислава Быстржицкого, архитектор Викентий Оржешко. Тёмные бревенчатые стены, белые окна, угловая башня с острым шатром. Драконы смотрят попарно на север, юг и запад, седьмой — на восход.',
  hours:null,price:'Снаружи бесплатно',mins:15,hist:'Северный модерн со скандинавскими мотивами: резьба только там, где она держит конструкцию.'},
 {id:'firebird',name:'Дом с жар-птицами',cat:'Деревянное зодчество',ic:'house',col:'#B5462E',x:481,y:-495,b:2951,addr:'ул. Красноармейская, 67/1',theme:'lace',moods:['wood','free','date'],
  why:'Свадебный торт из дерева',story:'Дом 1903 года из усадьбы, где каждый из четырёх домов не похож на соседа. Два эркера, башенки со шпилями и объёмная накладная резьба. Главный мотив — жар-птицы вместо привычных узоров.',
  hours:null,price:'Снаружи бесплатно',mins:15,hist:'Усадьбу строили с 1896 по 1907 год, и каждый следующий дом был нарядней предыдущего.'},
 {id:'khomich',name:'Особняк Хомича',cat:'Деревянное зодчество',ic:'house',col:'#2E8A7A',x:41,y:-489,b:2968,addr:'ул. Белинского, 19',theme:'green',moods:['wood','free','date'],
  why:'«Дом волшебника Изумрудного города»',story:'Деревянный «замок» 1904 года на кирпичном фундаменте: гранёные выступы, веранды, балконы и фронтоны треугольной и арочной формы. По городской легенде здесь мог бывать автор «Волшебника Изумрудного города».',
  hours:null,price:'Снаружи бесплатно',mins:15,hist:'Резьба здесь имитирует вышивку и кружево.'},
 {id:'kraev',name:'Краеведческий музей',cat:'Музей',ic:'col',col:'#7A4FA0',x:-381,y:115,b:1846,addr:'пр. Ленина, 75',theme:'vintage',moods:['rain','kids'],
  why:'Весь Томский край в особняке золотопромышленника',story:'Музей занимает особняк Ивана Асташева 1840-х годов. Археология, купеческий быт, природа края и сменные выставки.',
  hours:[10,18],price:'от 300 ₽',mins:90,hist:'По городу ходили слухи, что под особняком начинаются подземные ходы. Это легенда, но очень живучая.'},
 {id:'art',name:'Художественный музей',cat:'Музей',ic:'frame',col:'#C6795A',x:-596,y:796,addr:'пер. Нахановича, 3',theme:'gallery',moods:['rain','date'],
  why:'От икон до авангарда за один вечер',story:'Русское искусство от иконописи до XX века и выставки современных художников.',hours:[10,18],price:'от 300 ₽',mins:90,hist:'Рядом была Базарная площадь, нынешняя площадь Ленина.'},
 {id:'tsu',name:'Главный корпус ТГУ',cat:'Университет',ic:'col',col:'#1D5A42',x:-585,y:-671,b:3976,dist:230,addr:'пр. Ленина, 36',theme:'green',moods:['date','free','kids'],
  why:'Первый университет Сибири',story:'Главное здание Томского университета, открытого в 1888 году, и Университетская роща перед ним. Студенты, белки и аллеи — самое «томское» место города.',
  hours:null,price:'Роща бесплатно',mins:45,hist:'Рощу высаживали вместе со строительством университета; ботаник Порфирий Крылов привозил сюда растения со всей России.'},
 {id:'bot',name:'Сибирский ботанический сад',cat:'Природа · оранжерея',ic:'leaf',col:'#2E8A5C',x:-627,y:-1010,addr:'пр. Ленина, 36',theme:'green',moods:['rain','kids','date'],
  why:'Тропики, когда в Томске +3 и дождь',story:'Оранжереи с пальмами и орхидеями. Тёплое место для прогулки в любую погоду.',hours:[10,17],price:'от 350 ₽',mins:90,hist:'Сад основан вместе с университетом.'},
 {id:'lager',name:'Лагерный сад',cat:'Парк · смотровая',ic:'flag',col:'#1D5A42',x:-351,y:-2440,addr:'пр. Ленина, 1',theme:'dusk',moods:['date','kids','free'],cone:true,
  why:'Высокий берег Томи и вид на заречье',story:'Парк на высоком берегу Томи с мемориалом «Родина-мать» 1979 года. Отсюда видно реку и леса на многие километры.',hours:null,price:'Бесплатно',mins:60,hist:'Название осталось от военных лагерей, которые стояли здесь в XIX веке.'},
 {id:'chekhov',name:'Памятник Чехову',cat:'Набережная Томи',ic:'wave',col:'#2C7DB8',x:-741,y:1098,addr:'набережная реки Томи',theme:'sunset',moods:['date','free','kids','night'],cone:true,
  why:'Самый ироничный памятник города',story:'Скульптор Леонтий Усов изобразил Чехова маленьким, с огромными ступнями, в шляпе и с зонтиком за спиной: так томичи ответили на нелестный отзыв писателя о городе. Рядом набережная и закаты над Томью.',hours:null,price:'Бесплатно',mins:20,hist:'У берега стояли пристани: пароходы уходили по Томи на Обь.'},
 {id:'bogo',name:'Богоявленский собор',cat:'Храм',ic:'church',col:'#B8892E',x:-606,y:1460,b:1395,addr:'пл. Ленина, 7',theme:'vintage',moods:['free'],
  why:'Барокко XVIII века на главной площади',story:'Каменный двухэтажный собор в стиле барокко, заложенный в 1777 году на месте деревянной церкви 1630 года. Купола вернули после реставрации.',hours:[8,19],price:'Бесплатно',mins:20,hist:'Первая деревянная церковь стояла здесь уже через 26 лет после основания города.'},
 {id:'voskr',name:'Воскресенская церковь',cat:'Храм',ic:'church',col:'#B8892E',x:-145,y:2053,b:2184,addr:'ул. Октябрьский взвоз, 10',theme:'vintage',moods:['free','date'],
  why:'Сибирское барокко на Воскресенской горе',story:'Каменная церковь в стиле сибирского барокко на горе, где в 1604 году заложили Томск. Пять глав, колокольня и вид на город.',hours:[8,19],price:'Бесплатно',mins:25,hist:'Именно здесь, на Воскресенской горе, стоял первый томский острог.'},
 {id:'drama',name:'Театр драмы',cat:'Театр',ic:'mask',col:'#D2456A',x:-594,y:1358,b:301,addr:'пл. Ленина, 4',theme:'neon',moods:['night','rain','date'],
  why:'Вечер в главном театре города',story:'Областной драматический театр на площади Ленина: классика, современные постановки и гастроли.',hours:[11,21],price:'от 500 ₽',mins:150,hist:'Площадь вокруг была Базарной.'},
 {id:'woodmus',name:'Музей деревянного зодчества',cat:'Музей',ic:'house',col:'#8A4B2A',x:-41,y:-1038,addr:'ул. Кузнецова',theme:'lace',moods:['wood','rain','kids'],
  why:'Резьба вблизи и как её делали',story:'Музей посвящён томской деревянной архитектуре: наличники, детали фасадов и истории домов.',hours:[10,18],price:'уточняйте',mins:60,hist:'В Томске сохранилось одно из крупнейших в России собраний деревянной застройки.'},
 {id:'kalancha',name:'Музей истории Томска',cat:'Музей · смотровая',ic:'flag',col:'#B8892E',x:-260,y:1489,b:9451,addr:'ул. Бакунина, 3',theme:'vintage',moods:['kids','rain','date'],
  why:'Деревянная каланча и вид на весь город',story:'Музей в бывшей пожарной части на Воскресенской горе, где начинался Томск. Наверху деревянная каланча со смотровой площадкой, рядом фрагмент деревянной крепости.',hours:[10,18],price:'уточняйте',mins:60,hist:'С каланчи пожарные высматривали дым над деревянным городом и поднимали сигнальные шары.'},
 {id:'redmosque',name:'Красная мечеть',cat:'Мечеть',ic:'church',col:'#A3442E',x:-716,y:335,b:3085,addr:'ул. Татарская, 22',theme:'vintage',moods:['free'],
  why:'Красный кирпич и зелёные купола в Татарской слободе',story:'Соборная мечеть из красного кирпича с зелёными куполами и высоким минаретом. Рядом деревянные дома Татарской слободы с кружевной резьбой.',hours:[9,19],price:'Бесплатно',mins:20,hist:'Татарская слобода у реки Томи — один из старейших районов города.'},
 {id:'passazh',name:'Пассаж Второва',cat:'Архитектура',ic:'star',col:'#7C8C93',x:-458,y:965,b:363,addr:'пр. Ленина, 111',theme:'gallery',moods:['date','rain'],
  why:'Модерн купца Второва на главном проспекте',story:'Здание 1903–1904 годов для купца А. Ф. Второва: светлый фасад, аттик с аркой и угловые купола. По легенде стоит на лиственничных плотах над подземной Ушайкой.',hours:null,price:'Снаружи бесплатно',mins:15,hist:'Пассаж был первым в Томске магазином-универмагом под одной крышей.'},
 {id:'beloe',name:'Белое озеро',cat:'Парк · озеро',ic:'wave',col:'#2C7DB8',x:400,y:2251,addr:'Белое озеро',theme:'dusk',moods:['date','kids','free'],
  why:'Озеро посреди старого города',story:'Небольшое озеро с прогулочной зоной и детскими площадками. Летом здесь кормят уток, зимой заливают каток.',hours:null,price:'Бесплатно',mins:45,hist:'По легенде, вода озера никогда не замерзала до конца, отсюда и название.'},
 {id:'gorsad',name:'Городской сад',cat:'Развлечения',ic:'ball',col:'#D2456A',x:-107,y:-237,addr:'пр. Ленина',theme:'green',moods:['kids','date'],
  why:'Колесо обозрения и аттракционы',story:'Парк аттракционов в центре города: колесо обозрения, карусели и зимой каток.',hours:[10,22],price:'от 200 ₽',mins:90,hist:'Сад разбит ещё в XIX веке.'}
];
const MOODS=[{id:'all',t:'Всё интересное'},{id:'date',t:'Свидание'},{id:'rain',t:'Дождливый день'},{id:'kids',t:'С детьми'},{id:'wood',t:'Деревянный Томск'},{id:'night',t:'Вечер и ночь'},{id:'free',t:'Бесплатно'}];

/* --- загрузка и декодирование данных --- */
const DATA={};
function decFlat(s,q){const a=s.split(',');const n=a.length;const out=new Float32Array(n);let x=0,y=0;for(let i=0;i<n;i+=2){x+=+a[i];y+=+a[i+1];out[i]=x/q;out[i+1]=y/q}return out}
async function loadData(onProgress){
  const r=await fetch('tomsk-data.json');if(!r.ok)throw new Error('нет файла данных');
  const total=+r.headers.get('content-length')||0;let txt='';
  if(r.body&&total&&onProgress){const rd=r.body.getReader();const dec=new TextDecoder();let got=0;for(;;){const{done,value}=await rd.read();if(done)break;got+=value.length;txt+=dec.decode(value,{stream:true});onProgress(got/total)}txt+=dec.decode()}
  else txt=await r.text();
  const J=JSON.parse(txt);Object.assign(DATA,J);
  DATA.buildings=J.b.map((b,i)=>{const rings=b[0].split(';').map(s=>decFlat(s,2));let minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9;const o=rings[0];
    for(let k=0;k<o.length;k+=2){const x=o[k],y=o[k+1];if(x<minx)minx=x;if(x>maxx)maxx=x;if(y<miny)miny=y;if(y>maxy)maxy=y}
    const f=b[3];return{i,rings,h:b[1]/10,mh:b[2]/10,ty:f[0],mat:f[1],part:f[2]==='P',hasParts:f[2]==='H',roof:J.roofs[b[4]]||null,rh:b[5]>=0?b[5]/10:null,col:b[6],rcol:b[7],name:b[8]>=0?J.bn[b[8]]:null,addr:b[9]||'',bb:[minx,miny,maxx,maxy],cx:(minx+maxx)/2,cy:(miny+maxy)/2}});
  DATA.roads=J.r.map(r=>({t:r[0],p:decFlat(r[1],1),name:r[2]>=0?J.n[r[2]]:null,bridge:!!(r[3]&1),tunnel:!!(r[3]&2),layer:r[4]}));
  DATA.areas=J.a.map(a=>({k:a[0],rings:a[1].split(';').map(s=>decFlat(s,1)),name:a[2]>=0?J.n[a[2]]:null}));
  DATA.pois=J.p.map(p=>({x:p[0],y:p[1],t:p[2],cat:poiCat(p[2])})).filter(p=>p.cat);
  // убрать дубли POI с избранными местами
  DATA.pois=DATA.pois.filter(p=>!CUR.some(c=>Math.hypot(c.x-p.x,c.y-p.y)<40&&(p.t.name||'').slice(0,6)===c.name.slice(0,6)));
  // база заведений (data/venues.json — её правит админка); если файла нет — встроенная копия
  let V=null;try{const r2=await fetch('data/venues.json',{cache:'no-store'});if(r2.ok)V=await r2.json()}catch(e){}
  if(!V||!V.items)V=typeof VENUES0!=='undefined'?VENUES0:{items:[]};applyVenues(V);
  DATA.elev=J.e;DATA.elev2=J.e2||null;
  return DATA}

const PHOTOS={};
function applyVenues(V){
  const nn=s=>(s||'').toLowerCase().replace(/ё/g,'е').replace(/[^0-9a-zа-я]/g,'');
  const bins=new Map(),cell=100,key=(x,y)=>Math.floor(x/cell)+','+Math.floor(y/cell);
  const put=p=>{const k=key(p.x,p.y);if(!bins.has(k))bins.set(k,[]);bins.get(k).push(p)};
  DATA.pois.forEach(put);
  const around=(x,y)=>{const out=[];let a=Math.floor(x/cell),b=Math.floor(y/cell);
    for(let i=a-1;i<=a+1;i++)for(let j=b-1;j<=b+1;j++)out.push(...(bins.get(i+','+j)||[]));return out};
  const removed=new Set();
  V.items.forEach(v=>{
    if(!Number.isFinite(v.lon)||!Number.isFinite(v.lat))return;
    const x=(v.lon-84.957)*61646,y=(v.lat-56.4755)*111351;
    const ph=v.photos&&v.photos[0]?[v.photos[0].src,v.photos[0].credit||'',v.photos[0].license||'',v.photos[0].link||'']:null;
    if(ph){PHOTOS[v.id]=ph;PHOTOS[v.name]=ph}
    const candidates=around(x,y).filter(p=>!removed.has(p));
    const same=p=>Math.hypot(p.x-x,p.y-y)<45&&nn(p.t.name)===nn(v.name);
    if(v.hidden){candidates.filter(same).forEach(p=>removed.add(p));return}
    if(CUR.some(c=>Math.hypot(c.x-x,c.y-y)<60&&nn(c.name)===nn(v.name)))return;
    let p=candidates.find(same);
    if(!p){p={x,y,t:{},cat:PCAT[v.cat]?v.cat:'other'};DATA.pois.push(p);put(p)}
    p.x=x;p.y=y;p.cat=PCAT[v.cat]?v.cat:'other';p.vid=v.id;p.origin=v.origin||'osm';p.kind=v.kind||'';
    p.t=Object.assign({},p.t,{name:v.name});
    if(v.hours)p.t.opening_hours=v.hours;if(v.phone)p.t.phone=v.phone;if(v.web)p.t.website=v.web;if(v.cuisine)p.t.cuisine=v.cuisine;
    if(v.addr){p.t['addr:street']=v.addr;delete p.t['addr:housenumber']}
    if(v.pick||v.desc||ph)p.pick={name:v.name,kind:v.kind||'',addr:v.addr||'',why:v.why||'',desc:v.desc||'',moods:v.moods||[],price:v.prices||(v.price===0?'Бесплатно':v.price?'от '+v.price+' ₽':''),web:v.web||'',ph};
    else delete p.pick;
  });
  DATA.pois=DATA.pois.filter(p=>!removed.has(p));
}

/* высота рельефа: билинейная интерполяция (мелкая сетка в центре, грубая — по всему городу) */
function elevAt(x,y){const E=DATA.elev,E2=DATA.elev2;
  if(E2&&E&&(x<E.x0||y<E.y0||x>E.x0+(E.nx-1)*E.step||y>E.y0+(E.ny-1)*E.step))return elevGrid(E2,x,y);
  return E?elevGrid(E,x,y):0}
function elevGrid(E,x,y){let fx=(x-E.x0)/E.step,fy=(y-E.y0)/E.step;fx=Math.max(0,Math.min(E.nx-1.001,fx));fy=Math.max(0,Math.min(E.ny-1.001,fy));
  const ix=Math.floor(fx),iy=Math.floor(fy),tx=fx-ix,ty=fy-iy,z=E.z,n=E.nx;
  const a=z[iy*n+ix],b=z[iy*n+ix+1],c=z[(iy+1)*n+ix],d=z[(iy+1)*n+ix+1];return(a*(1-tx)+b*tx)*(1-ty)+(c*(1-tx)+d*tx)*ty}

/* солнце для Томска */
function sunMinutes(date){const LAT=56.4977,LNG=84.9744,TZ=7,rad=Math.PI/180,J1970=2440588,J2000=2451545,dayMs=864e5,e=rad*23.4397,J0=.0009;
  const d=date.valueOf()/dayMs-.5+J1970-J2000,lw=rad*-LNG,phi=rad*LAT;const n=Math.round(d-J0-lw/(2*Math.PI)),ds=J0+lw/(2*Math.PI)+n;
  const M=rad*(357.5291+.98560028*ds),C=rad*(1.9148*Math.sin(M)+.02*Math.sin(2*M)+.0003*Math.sin(3*M)),L=M+C+rad*102.9372+Math.PI;
  const dec=Math.asin(Math.sin(e)*Math.sin(L));const w=Math.acos((Math.sin(-.833*rad)-Math.sin(phi)*Math.sin(dec))/(Math.cos(phi)*Math.cos(dec)));
  const noon=J2000+ds+.0053*Math.sin(M)-.0069*Math.sin(2*L),set=noon+(w)/(2*Math.PI),rise=noon-(w)/(2*Math.PI);
  const toMin=J=>{const ms=(J+.5-J1970)*dayMs+TZ*3600e3;return((ms/6e4)%1440+1440)%1440};return{rise:toMin(rise),set:toMin(set)}}
const fmtMin=m=>String(Math.floor(m/60)%24).padStart(2,'0')+':'+String(Math.floor(m%60)).padStart(2,'0');
const tomskNow=()=>{const d=new Date(Date.now()+7*3600e3);return d.getUTCHours()*60+d.getUTCMinutes()};
function plural(n,f){const a=n%100,b=n%10;return f[a>10&&a<20?2:b===1?0:b>=2&&b<=4?1:2]}
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),Math.max(2600,t.length*60))}
const store={get(k,d){try{const v=localStorage.getItem('tomskmap:'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('tomskmap:'+k,JSON.stringify(v))}catch(e){}}};
