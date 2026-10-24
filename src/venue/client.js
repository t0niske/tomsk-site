/* Страница заведения в браузере: статус «открыто сейчас», избранное и маршрут, «поделиться»
   и перерисовка из свежих данных места data/v/<id>.json (правки из админки видны без пересборки сайта).
   Соседи для блоков «Рядом» и «Похожие» вшиты в страницу (#vRel), вся база не нужна. */
(function () {
  const el = document.getElementById('venue'); if (!el) return;
  const id = el.dataset.id, REL = JSON.parse((document.getElementById('vRel') || {}).textContent || '[]');
  const COLOR = {food:'#FFC9A6',bar:'#FFC9A6',culture:'#D9C8F0',church:'#D9C8F0',nature:'#C9F2D2',fun:'#FFC3D0',shop:'#F2DDC9',sight:'#B9E4FF',stay:'#B9E4FF'};
  const photosOf = v => (v.photos && v.photos.length ? v.photos.map(f => [f.src, f.credit || '', f.license || '', f.link || '']) : (PHOTOS[v.id] || PHOTOS[v.name] ? [PHOTOS[v.id] || PHOTOS[v.name]] : []));
  let fresh = null;
  function update() {
    const hours = fresh ? fresh.hours : (el.dataset.hours || '');
    const st = hours ? OH.status(hours) : null, b = document.getElementById('vStatus');
    if (b) { b.hidden = !st; if (st) { b.textContent = st.txt; b.classList.toggle('open', st.open); b.classList.toggle('closed', !st.open) } }
    const now = new Date(Date.now() + (7 * 60 + new Date().getTimezoneOffset()) * 60000).getDay();
    el.querySelectorAll('.v-hours tr').forEach(tr => tr.classList.toggle('today', +tr.dataset.d === now));
    el.querySelectorAll('.v-fav').forEach(x => { const on = favs.has(id); x.setAttribute('aria-pressed', on); x.lastChild.textContent = on ? 'В списке «Хочу сходить»' : 'Хочу сходить' });
  }
  fetch(ROOT + 'data/v/' + encodeURIComponent(id) + '.json', {cache: 'no-cache'}).then(r => r.ok ? r.json() : null).then(v => {
    if (!v || v.hidden) return;
    fresh = v;
    const m = el.querySelector('.v-map svg');
    el.innerHTML = VENUE.render(v, {...VENUE.relatedX(REL), root: ROOT, site: '', color: COLOR, photos: photosOf, photo: o => photosOf(o)[0] || null, url, mapSvg: m ? m.outerHTML : ''});
    update();
  }).catch(() => {});
  document.addEventListener('click', e => {
    if (e.target.closest('[data-fav]')) setTimeout(update, 0);
    const s = e.target.closest('[data-share]'); if (!s) return;
    const data = {title: document.title, url: location.href};
    if (navigator.share) navigator.share(data).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(() => toast('Ссылка скопирована'), () => {});
  });
  update();
})();
