/* Страница заведения: одна функция отрисовки для сборки (node) и для обновления в браузере.
   В браузере после загрузки свежего data/venues.json страница перерисовывается — правки из админки видны сразу. */
(function (G) {
  const CATN = {food:'Кафе и рестораны',bar:'Бары',culture:'Музеи и театры',church:'Храмы',nature:'Парки и прогулки',fun:'Развлечения',shop:'Магазины',sight:'Достопримечательности',stay:'Где жить'};
  const CAT1 = {food:'Кафе',bar:'Бар',culture:'Музей',church:'Храм',nature:'Парк',fun:'Развлечения',shop:'Магазин',sight:'Достопримечательность',stay:'Гостиница'};
  // фильтр раздела «Места» для хлебных крошек
  const CATF = {food:{cat:'food'},bar:{cat:'food'},culture:{cat:'culture'},church:{cat:'culture'},nature:{cat:'nature'},fun:{cat:'fun'},shop:{cat:'shop'},sight:{cat:'unusual'},stay:{cat:'unusual'}};
  const LOOK = {food:'Что попробовать',bar:'Что попробовать',culture:'Что посмотреть',church:'Что посмотреть',nature:'Чем заняться',fun:'Чем заняться',shop:'Что купить',sight:'На что обратить внимание',stay:'Что внутри'};
  const MOOD = {date:'Вдвоём',friends:'С друзьями',kids:'С детьми',solo:'Одному',night:'Вечером',rain:'В дождь',wood:'Деревянный Томск',free:'Бесплатно'};
  const SCHEMA = {food:'Restaurant',bar:'BarOrPub',culture:'Museum',church:'PlaceOfWorship',nature:'Park',fun:'EntertainmentBusiness',shop:'Store',sight:'TouristAttraction',stay:'Hotel'};
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const lines = s => (Array.isArray(s) ? s : String(s || '').split('\n')).map(x => String(x).trim().replace(/^[-•]\s*/, '')).filter(Boolean);
  const paras = s => String(s || '').split(/\n\s*\n|\n/).map(x => x.trim()).filter(Boolean);
  const ico = {
    pin:'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    web:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>', rub:'<path d="M8 20V4h5a4 4 0 0 1 0 8H6M6 16h8"/>',
    heart:'<path d="M12 20s-7-4.4-9-8.6C1.6 8.4 3.6 5 7 5c2 0 3.3 1.1 5 3 1.7-1.9 3-3 5-3 3.4 0 5.4 3.4 4 6.4C19 15.6 12 20 12 20z"/>',
    route:'<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>',
    share:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
    flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>', walk:'<circle cx="13" cy="4.5" r="2"/><path d="M10 21l2-6 3 3v3M9 12l2-4 3 1 2 3M11 8l-2 5"/>',
    arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>', time:'<path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9"/>'
  };
  const I = k => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ico[k]}</svg>`;

  /* часы работы в формате OpenStreetMap → по дням недели */
  const D = ['Su','Mo','Tu','We','Th','Fr','Sa'], RU = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'], ORD = [1,2,3,4,5,6,0];
  function parseHours(s) {
    if (!s) return null; s = s.trim(); const week = [[],[],[],[],[],[],[]];
    if (/^24\/7$/.test(s)) return {week: week.map(() => [[0,1440]]), all: true};
    let any = false;
    for (let part of s.split(/;|\|\|/)) {
      part = part.trim(); if (!part || /^(PH|SH)\b/.test(part)) continue;
      const m = part.match(/^((?:(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:\s*-\s*(?:Mo|Tu|We|Th|Fr|Sa|Su))?\s*,?\s*)+)?(.*)$/); const days = [];
      if (m[1]) m[1].split(',').forEach(x => { x = x.trim(); if (!x) return; const [a,b] = x.split('-').map(t => t.trim()); const ia = D.indexOf(a), ib = b ? D.indexOf(b) : ia; if (ia < 0 || ib < 0) return; for (let k = ia;; k = (k+1)%7) { days.push(k); if (k === ib) break } });
      else for (let k = 0; k < 7; k++) days.push(k);
      const rest = (m[2] || '').trim();
      if (/^(off|closed)$/i.test(rest)) { days.forEach(d => week[d] = []); any = true; continue }
      if (/^24\/7$|^00:00-24:00$/.test(rest)) { days.forEach(d => week[d] = [[0,1440]]); any = true; continue }
      const sp = []; (rest.match(/\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/g) || []).forEach(t => { const [a,b] = t.split('-').map(x => x.trim().split(':').map(Number)); let o = a[0]*60+a[1], c = b[0]*60+b[1]; if (c <= o) c += 1440; sp.push([o,c]) });
      if (!sp.length) return {raw: s}; days.forEach(d => week[d] = sp); any = true;
    }
    return any ? {week} : {raw: s};
  }
  const fm = m => { m %= 1440; return String(Math.floor(m/60)).padStart(2,'0') + ':' + String(m%60).padStart(2,'0') };
  function hoursTable(h) {
    const P = parseHours(h); if (!P) return '';
    if (!P.week) return `<p class="v-raw">${esc(P.raw)}</p>`;
    if (P.all) return '<p class="v-raw"><b>Круглосуточно</b></p>';
    return '<table class="v-hours">' + ORD.map(d => `<tr data-d="${d}"><th>${RU[d]}</th><td>${P.week[d].map(x => fm(x[0]) + '–' + fm(x[1])).join(', ') || '<span class="off">выходной</span>'}</td></tr>`).join('') + '</table>';
  }

  /* расстояния */
  const xy = v => [(v.lon - 84.957) * 61646, (v.lat - 56.4755) * 111351];
  const dist = (a, b) => { const p = xy(a), q = xy(b); return Math.hypot(p[0]-q[0], p[1]-q[1]) };
  const walkMin = m => Math.max(1, Math.round(m * 1.3 / 75));   // по улицам ~ в 1,3 раза длиннее прямой, 75 м/мин
  function nearby(v, items, n = 6) {
    return items.filter(o => o.id !== v.id && !o.hidden && o.lat && (o.pick || o.origin === 'editor' || o.pageSlug))
      .map(o => [o, dist(v, o)]).filter(([, d]) => d < 1200).sort((a, b) => a[1] - b[1]).slice(0, n);
  }
  function similar(v, items, n = 4) {
    const group = {food:['food','bar'],bar:['bar','food'],culture:['culture'],church:['church','sight'],sight:['sight','church'],nature:['nature'],fun:['fun'],shop:['shop'],stay:['stay']}[v.cat] || [v.cat];
    return items.filter(o => o.id !== v.id && !o.hidden && group.includes(o.cat) && (o.pick || o.pageSlug))
      .map(o => [o, dist(v, o)]).sort((a, b) => (b[0].pageSlug ? 1 : 0) - (a[0].pageSlug ? 1 : 0) || a[1] - b[1]).slice(0, n).map(x => x[0]);
  }

  const priceLine = v => v.price === 0 ? 'Бесплатно' : v.price != null ? `от ${v.price} ₽` : '';
  const minsTxt = m => { if (!m) return ''; const h = Math.floor(m/60), r = m % 60; return '≈ ' + (h ? h + ' ч' + (r ? ' ' + r + ' мин' : '') : r + ' мин') };
  const telHref = p => 'tel:' + String(p).split(/[;,]/)[0].replace(/[^\d+]/g, '');
  const webLabel = u => { try { return decodeURI(u).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') } catch (e) { return u } };

  /* мини-карточка соседнего места */
  function mini(o, X, extra) {
    const href = o.pageSlug ? `${X.root}mesto/${o.pageSlug}/` : null;
    const ph = X.photo(o);
    const body = `<span class="mc-ph" style="${ph ? '' : 'background:' + (X.color[o.cat] || '#E6E0CF')}">${ph ? `<img src="${esc(X.url(ph[0]))}" alt="" loading="lazy" referrerpolicy="no-referrer">` : `<b>${esc((o.name || '?')[0])}</b>`}</span>
      <span class="mc-t"><b>${esc(o.name)}</b><small>${esc(o.kind || CAT1[o.cat] || '')}${extra ? ' · ' + extra : ''}</small></span>`;
    return href ? `<a class="mc" href="${href}">${body}</a>` : `<button class="mc" data-open="${esc(o.id)}">${body}</button>`;
  }

  function render(v, X) {
    const photos = X.photos(v), look = lines(v.look), tips = lines(v.tips), about = paras(v.about);
    const lookTitle = LOOK[v.cat] || 'Что посмотреть';
    const tags = (v.moods || []).filter(m => !(m === 'free' && v.price === 0)).map(m => MOOD[m]).filter(Boolean);
    const price = priceLine(v), mins = minsTxt(v.mins);
    const yandex = `https://yandex.ru/maps/?rtext=~${v.lat},${v.lon}&rtt=pd`, gis = `https://2gis.ru/routeSearch/rsType/pedestrian/to/${v.lon},${v.lat}`;
    const [mx, my] = xy(v);
    const crumbs = `<ol class="crumbs"><li><a href="${X.root || './'}">Главная</a></li><li><a href="${X.root}mesta/">Места</a></li><li><a href="${X.root}mesta/?f=${encodeURIComponent(JSON.stringify(CATF[v.cat] || {}))}">${CATN[v.cat] || 'Места'}</a></li><li><span>${esc(v.name)}</span></li></ol>`;
    const gallery = photos.length ? `<figure class="v-photo"><img src="${esc(X.url(photos[0][0]))}" alt="${esc(v.name)}" referrerpolicy="no-referrer">${photos[0][1] || photos[0][3] ? `<figcaption>Фото: ${photos[0][3] ? `<a href="${esc(photos[0][3])}" target="_blank" rel="noopener">${esc(photos[0][1] || 'источник')}</a>` : esc(photos[0][1])}${photos[0][2] ? ', ' + esc(photos[0][2]) : ''}</figcaption>` : ''}</figure>
      ${photos.length > 1 ? `<div class="v-thumbs">${photos.slice(1, 7).map(p => `<a href="${esc(p[3] || X.url(p[0]))}" target="_blank" rel="noopener"><img src="${esc(X.url(p[0]))}" alt="" loading="lazy" referrerpolicy="no-referrer"></a>`).join('')}</div>` : ''}`
      : `<figure class="v-photo v-nophoto" style="background:${X.color[v.cat] || '#E6E0CF'}"><span>${esc(v.name)}</span><figcaption>Фото пока нет. Если вы владелец — <button class="lnk" data-report="${esc(v.name)}">пришлите снимки</button>.</figcaption></figure>`;
    const near = nearby(v, X.items);
    const sim = similar(v, X.items).filter(o => !near.some(([n]) => n.id === o.id));
    const contacts = [
      v.addr ? `<li>${I('pin')}<span>${esc(v.addr)}</span></li>` : '',
      v.phone ? `<li>${I('phone')}<span>${String(v.phone).split(/[;,]\s*/).map(p => `<a href="${telHref(p)}">${esc(p)}</a>`).join('<br>')}</span></li>` : '',
      v.web ? `<li>${I('web')}<span><a href="${esc(v.web)}" target="_blank" rel="noopener">${esc(webLabel(v.web))}</a></span></li>` : ''
    ].join('');
    const html = `
<header class="v-head"><div class="wrap">${crumbs}
  <span class="tag">${esc(v.kind || CAT1[v.cat] || 'Место')}</span>
  <h1>${esc(v.name)}</h1>
  ${v.why ? `<p class="v-why">${esc(v.why)}</p>` : ''}
  ${v.addr ? `<p class="v-addr">${I('pin')}<span>${esc(v.addr)}</span><a href="#how">Как попасть ↓</a></p>` : ''}
  <div class="v-badges"><span class="v-badge v-status" id="vStatus" hidden></span>${price ? `<span class="v-badge">${I('rub')}${price}</span>` : ''}${mins ? `<span class="v-badge">${I('time')}${mins}</span>` : ''}${tags.map(t => `<span class="v-badge v-mood">${t}</span>`).join('')}</div>
  <div class="v-actions">
    <button class="btn v-fav" data-fav="${esc(v.id)}" aria-pressed="false">${I('heart')}<span>Хочу сходить</span></button>
    <a class="btn" href="${yandex}" target="_blank" rel="noopener">${I('walk')}<span>Как добраться</span></a>
    <button class="btn v-share" data-share>${I('share')}<span>Поделиться</span></button>
  </div>
</div></header>
<div class="wrap v-grid">
  <div class="v-main">
    ${gallery}
    ${v.desc ? `<p class="v-lead">${esc(v.desc)}</p>` : ''}
    ${about.length ? `<section class="v-sec"><h2>Подробнее</h2>${about.map(p => `<p>${esc(p)}</p>`).join('')}</section>` : ''}
    ${look.length ? `<section class="v-sec"><h2>${lookTitle}</h2><ul class="v-list">${look.map(t => `<li>${esc(t)}</li>`).join('')}</ul></section>` : ''}
    ${tips.length ? `<section class="v-sec v-tips"><h2>Советы</h2><ul>${tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul></section>` : ''}
  </div>
  <aside class="v-side">
    <div class="v-card" id="how">
      <h2>Как попасть</h2>
      <a class="v-map" href="${X.root}map.html#poi=${Math.round(mx)},${Math.round(my)}" aria-label="Открыть на карте Томска">${X.mapSvg || ''}<span class="v-map-btn">Открыть на карте →</span></a>
      <ul class="v-contacts">${contacts}</ul>
      <div class="v-go"><a class="btn" href="${yandex}" target="_blank" rel="noopener">Яндекс Карты</a><a class="btn" href="${gis}" target="_blank" rel="noopener">2ГИС</a></div>
      ${v.hours ? `<h3>${I('clock')}Часы работы</h3>${hoursTable(v.hours)}` : ''}
      ${v.prices ? `<h3>${I('rub')}Цены</h3><p class="v-prices">${esc(v.prices)}</p>` : ''}
      <p class="v-checked">${v.checked ? `Информация проверена ${esc(v.checked.split('-').reverse().join('.'))}${v.src ? ` · источник: <a href="${esc(v.src)}" target="_blank" rel="noopener">${esc(webLabel(v.src).split('/')[0])}</a>` : ''}.` : 'Часы и цены могут меняться — уточняйте перед визитом.'}
        <button class="lnk" data-report="${esc(v.name)}">${I('flag')}Нашли ошибку?</button></p>
    </div>
  </aside>
</div>
${near.length ? `<section class="wrap v-more"><h2>Рядом пешком</h2><div class="mc-grid">${near.map(([o, d]) => mini(o, X, walkMin(d) + ' мин пешком')).join('')}</div></section>` : ''}
${sim.length ? `<section class="wrap v-more"><h2>Похожие места</h2><div class="mc-grid">${sim.map(o => mini(o, X)).join('')}</div></section>` : ''}
<section class="wrap v-owner"><div><b>Это ваше заведение?</b><span>Обновите часы работы, цены и фото — это бесплатно.</span></div><button class="btn btn-primary" data-report="${esc(v.name)}">Обновить информацию</button></section>`;
    return html;
  }

  function jsonld(v, X, pageUrl) {
    const photos = X.photos(v);
    const o = {'@context':'https://schema.org','@type':SCHEMA[v.cat] || 'Place',name:v.name,url:pageUrl,
      address:{'@type':'PostalAddress',addressLocality:'Томск',addressCountry:'RU',...(v.addr ? {streetAddress:v.addr} : {})},
      geo:{'@type':'GeoCoordinates',latitude:v.lat,longitude:v.lon}};
    if (v.desc || v.why) o.description = v.desc || v.why;
    if (v.phone) o.telephone = String(v.phone).split(/[;,]/)[0].trim();
    if (v.web) o.sameAs = v.web;
    if (photos.length) o.image = /^https?:/.test(photos[0][0]) ? photos[0][0] : X.site + photos[0][0];
    if (v.hours && /^[A-Za-z]/.test(v.hours)) o.openingHours = v.hours.split(/\s*;\s*/);
    if (v.price === 0 && ['nature','sight','church','culture'].includes(v.cat)) o.isAccessibleForFree = true;
    return JSON.stringify(o);
  }

  function metaDesc(v) {
    const parts = [v.why, v.desc].filter(Boolean).join('. ').replace(/\.\./g, '.');
    const tail = [v.addr, v.hours ? 'часы работы' : '', 'как добраться'].filter(Boolean).join(', ');
    return (`${v.name} — ${(CAT1[v.cat] || 'место').toLowerCase()} в Томске. ${parts}`.slice(0, 200).replace(/\s+\S*$/, '') + (tail ? `. ${tail}.` : '')).replace(/\s+/g, ' ');
  }

  G.VENUE = {render, jsonld, metaDesc, parseHours, CAT1, CATN, xy};
})(typeof module !== 'undefined' ? module.exports : window);
