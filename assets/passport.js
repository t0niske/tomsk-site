/* «Паспорт Томска» в браузере: отметки по геолокации, прогресс серий, блок на странице места
   и режим «Холодно» на главной. Отметки хранятся в localStorage («tomsk:passport»), данные серий — data/passport.json. */
(function () {
  const ROOT = document.documentElement.dataset.root || '';
  const KEY = 'tomsk:passport', NEAR = 150;   // метров до места, чтобы отметиться
  const onPassport = !!document.getElementById('ppSum'), venueEl = document.getElementById('venue'), hero = document.getElementById('hero2');
  if (!onPassport && !venueEl && !hero) return;

  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}').stamps || {} } catch (e) { return {} } };
  let stamps = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({v: 1, stamps})) } catch (e) {} };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c };
  const meters = (a, b) => Math.hypot((a.lat - b.lat) * 111351, (a.lon - b.lon) * 111351 * Math.cos(a.lat * Math.PI / 180));
  const tomskDay = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
  const seasonOn = s => s && tomskDay() >= s.from && tomskDay() <= s.to;
  const openNow = h => { if (!h || typeof OH === 'undefined') return null; try { const st = OH.status(h); return st ? st.open : null } catch (e) { return null } };
  const say = (msg, err) => { if (typeof toast === 'function') toast(msg) };

  let DATA = null;
  const data = () => DATA ? Promise.resolve(DATA) : fetch(ROOT + 'data/passport.json').then(r => r.json()).then(d => (DATA = d));
  const groupsOf = d => [Object.assign({season: true}, d.season)].concat(d.series);

  /* отметка: геолокация → расстояние → часы работы → штамп */
  function locate() {
    return new Promise((res, rej) => {
      if (!navigator.geolocation) return rej('Этот браузер не умеет определять местоположение.');
      navigator.geolocation.getCurrentPosition(p => res({lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy}),
        e => rej(e.code === 1 ? 'Разрешите сайту доступ к геолокации в настройках браузера, иначе отметка не поставится.'
          : e.code === 3 ? 'Не удалось определить местоположение за 15 секунд. Попробуйте ещё раз на улице.' : 'Не удалось определить местоположение.'),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 30000});
    });
  }
  async function checkIn(id, place) {
    if (stamps[id]) return {ok: true, msg: 'Уже отмечено'};
    const open = openNow(place.h);
    if (open === false) return {ok: false, msg: 'Сейчас закрыто. Отметиться можно в часы работы.'};
    const me = await locate();
    const d = meters(me, place), slack = Math.min(me.acc || 0, 100);
    if (d - slack > NEAR) return {ok: false, msg: `Вы в ${d >= 1000 ? (d / 1000).toFixed(1).replace('.', ',') + ' км' : Math.round(d) + ' м'} от места. Подойдите ближе, нужно не дальше ${NEAR} м.`};
    stamps[id] = new Date().toISOString(); save();
    return {ok: true, msg: `Штамп «${place.n}» в паспорте!`, fresh: true};
  }
  async function press(btn, id, place, msgEl) {
    btn.disabled = true; const t = btn.textContent; btn.textContent = 'Проверяю…';
    let r; try { r = await checkIn(id, place) } catch (e) { r = {ok: false, msg: String(e)} }
    btn.disabled = false; btn.textContent = t;
    if (msgEl) { msgEl.textContent = r.msg; msgEl.classList.toggle('err', !r.ok) }
    say(r.msg);
    if (r.fresh && DATA) groupsOf(DATA).forEach(g => { if (g.ids.includes(id) && g.ids.every(i => stamps[i])) say(`Серия «${g.title}» собрана! Звание: ${g.badge}`) });
    paint();
  }
  const fmtDate = iso => new Date(iso).toLocaleDateString('ru-RU', {day: 'numeric', month: 'long'});

  /* страница паспорта */
  function paintPassport(d) {
    const groups = groupsOf(d);
    for (const g of groups) {
      const n = g.ids.filter(i => stamps[i]).length, all = n === g.ids.length;
      const m = document.querySelector(`[data-meter="${g.id}"]`); if (m) m.style.width = (n / g.ids.length * 100) + '%';
      const p = document.querySelector(`[data-prog="${g.id}"]`); if (p) p.textContent = `${n} из ${g.ids.length}` + (g.season && !seasonOn(g) ? (tomskDay() < g.from ? ' · сезон ещё не начался' : ' · сезон завершён') : '');
      const b = document.querySelector(`[data-badge="${g.id}"]`); if (b) { b.classList.toggle('on', all); b.textContent = (all ? '★ ' : 'Звание: ') + g.badge }
    }
    document.querySelectorAll('.pp-item[data-pid]').forEach(li => {
      const id = li.dataset.pid, place = d.places[id], done = !!stamps[id];
      li.classList.toggle('done', done);
      li.querySelector('.pp-seal').textContent = done ? '✓' : place.n[0];
      let act = li.querySelector('.pp-here, .pp-when');
      const want = done ? 'pp-when' : 'pp-here';
      if (!act || !act.classList.contains(want)) {
        act?.remove();
        if (done) { act = document.createElement('small'); act.className = 'pp-when'; act.textContent = fmtDate(stamps[id]) }
        else { act = document.createElement('button'); act.type = 'button'; act.className = 'pp-here'; act.textContent = 'Я здесь';
          act.addEventListener('click', () => press(act, id, place, document.getElementById('ppMsg'))) }
        li.append(act);
      }
    });
    const total = Object.keys(stamps).length, full = groups.filter(g => g.ids.every(i => stamps[i])).length;
    document.getElementById('ppPlaces').textContent = total;
    document.getElementById('ppSeries').textContent = `${full} из ${groups.length}`;
  }
  async function nearest() {
    const msg = document.getElementById('ppMsg'), btn = document.getElementById('ppNear');
    btn.disabled = true; msg.textContent = 'Определяю, где вы…'; msg.classList.remove('err');
    try {
      const [d, me] = await Promise.all([data(), locate()]);
      const list = Object.entries(d.places).filter(([id]) => !stamps[id]).map(([id, p]) => [id, p, meters(me, p)]).sort((a, b) => a[2] - b[2]).slice(0, 3);
      msg.innerHTML = list.length ? 'Ближе всего: ' + list.map(([id, p, m]) => `<a href="${ROOT}mesto/${p.s}/">${esc(p.n)}</a> (${m >= 1000 ? (m / 1000).toFixed(1).replace('.', ',') + ' км' : Math.round(m) + ' м'})`).join(', ') : 'Вы отметили все места паспорта!';
    } catch (e) { msg.textContent = String(e); msg.classList.add('err') }
    btn.disabled = false;
  }

  /* страница места: блок «Паспорт Томска» в боковой колонке */
  function venuePlace() {
    const id = venueEl.dataset.id, p = DATA && DATA.places[id];
    if (p) return p;
    try {
      const ld = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
      if (!ld.geo) return null;
      return {n: ld.name, lat: +ld.geo.latitude, lon: +ld.geo.longitude, h: venueEl.dataset.hours || ''};
    } catch (e) { return null }
  }
  function paintVenue() {
    const box = document.getElementById('vPass'); if (!box) return;
    const id = venueEl.dataset.id, place = venuePlace(); if (!place) { box.hidden = true; return }
    const inG = DATA ? groupsOf(DATA).filter(g => g.ids.includes(id) && (!g.season || seasonOn(g))) : [];
    const done = stamps[id];
    box.innerHTML = `<h2>Паспорт Томска</h2>
      <p>${done ? `Отмечено ${esc(fmtDate(done))} ✓` : 'Вы здесь? Отметьтесь и получите штамп в паспорт.'}</p>
      ${done ? '' : '<button class="pp-here" type="button">Я здесь</button>'}
      ${inG.length ? '<ul>' + inG.map(g => `<li>Серия <a href="${ROOT}pasport/#${g.id}">«${esc(g.title)}»</a>: ${g.ids.filter(i => stamps[i]).length} из ${g.ids.length}</li>`).join('') + '</ul>' : ''}
      <p><a href="${ROOT}pasport/">Мой паспорт →</a></p>`;
    box.hidden = false;
    const b = box.querySelector('.pp-here'); if (b) b.addEventListener('click', () => press(b, id, place, null));
  }

  /* главная: режим «Холодно», когда на улице ниже порога (или ?holodno для проверки) */
  async function coldMode(d) {
    let t = null;
    if (/[?&]holodno\b/.test(location.search)) t = d.cold.below - 10;
    else try {
      const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=56.4846&longitude=84.9476&current=temperature_2m&timezone=Asia%2FTomsk');
      t = Math.round((await r.json()).current.temperature_2m);
    } catch (e) { return }
    if (t == null || t > d.cold.below) return;
    const g = d.season.id === d.cold.series ? d.season : d.series.find(s => s.id === d.cold.series); if (!g) return;
    const list = g.ids.map(id => [id, d.places[id], openNow(d.places[id].h)]).sort((a, b) => (b[2] === true) - (a[2] === true)).slice(0, 6);
    const sec = document.createElement('section'); sec.className = 'cold'; sec.id = 'cold';
    sec.innerHTML = `<div class="wrap"><div class="cold-box"><h2>На улице ${t < 0 ? '−' + Math.abs(t) : t}°. Куда пойти в тепле</h2>
      <p>Катки под крышей, аквапарк, батуты, музеи и планетарий. Сначала те, что открыты сейчас.</p>
      <ul class="pp-list">${list.map(([id, p, open]) => `<li class="pp-item"><span class="pp-seal" aria-hidden="true">${esc(p.n[0])}</span><div><a href="${ROOT}mesto/${p.s}/">${esc(p.n)}</a><small>${esc([p.k, open === true ? 'открыто сейчас' : open === false ? 'сейчас закрыто' : ''].filter(Boolean).join(' · '))}</small></div></li>`).join('')}</ul>
      <a class="cold-more" href="${ROOT}pasport/#${g.id}">Все места сезона «${esc(g.title)}» →</a></div></div>`;
    hero.insertAdjacentElement('afterend', sec);
  }

  function paint() {
    if (onPassport && DATA) paintPassport(DATA);
    if (venueEl) paintVenue();
  }
  window.addEventListener('storage', e => { if (e.key === KEY) { stamps = load(); paint() } });
  if (onPassport) document.getElementById('ppNear').addEventListener('click', nearest);
  if (venueEl) new MutationObserver(() => { const b = document.getElementById('vPass'); if (b && !b.childElementCount) paintVenue() }).observe(venueEl, {childList: true});
  data().then(d => { paint(); if (hero) coldMode(d) }).catch(() => { if (venueEl) paintVenue() });
})();
