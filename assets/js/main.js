/* Академия «Вопреки» — интерактив. Разметка готова заранее (см. src/render.js),
   здесь только поведение: меню, слайдеры, фильтры, модальные окна, форма. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const todayIdx = () => (new Date().getDay() + 6) % 7; // 0 = Пн

  /* ---------- шапка, «наверх», курсор ---------- */
  const hdr = $('#hdr'), totop = $('#totop'), cursor = $('#cursor');
  const onScroll = () => { hdr.classList.toggle('solid', scrollY > 40); totop.classList.toggle('show', scrollY > 900); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  totop.onclick = () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduced) {
    addEventListener('pointermove', e => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }, { passive: true });
    document.addEventListener('pointerover', e => cursor.classList.toggle('big', !!e.target.closest('a,button,.dir,.card-ch,[data-coach]')));
  }

  /* ---------- мобильное меню ---------- */
  const mnav = $('#mnav'), burger = $('#burger');
  const setMenu = open => { mnav.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); document.body.classList.toggle('lock', open); if (open) $('#mclose').focus(); };
  burger.onclick = () => setMenu(true);
  $('#mclose').onclick = () => { setMenu(false); burger.focus(); };
  $$('a', mnav).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------- появление блоков и счётчики ---------- */
  const count = el => {
    const to = +el.dataset.count; let s = null;
    const step = t => { s = s || t; const p = Math.min((t - s) / 1100, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    el.textContent = '0'; requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
      $$('[data-count]', e.target).forEach(count);
    }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    $$('.rv').forEach(el => io.observe(el));
  } else $$('.rv').forEach(el => el.classList.add('in'));

  /* ---------- главный слайдер ---------- */
  const hero = $('#hero');
  if (hero) {
    const sl = $$('.slide', hero), pg = $$('.pager button', hero), DUR = 7000;
    let cur = 0, timer = null;
    document.documentElement.style.setProperty('--dur', DUR + 'ms');
    const go = n => {
      n = (n + sl.length) % sl.length;
      sl[cur].classList.remove('on'); sl[cur].setAttribute('aria-hidden', 'true');
      sl[n].classList.add('on'); sl[n].removeAttribute('aria-hidden');
      pg.forEach((b, i) => { b.classList.remove('on', 'done'); if (i < n) b.classList.add('done'); });
      void pg[n].offsetWidth; pg[n].classList.add('on');
      cur = n; clearTimeout(timer);
      if (!reduced) timer = setTimeout(() => go(cur + 1), DUR);
    };
    pg.forEach((b, i) => b.onclick = () => go(i));
    $('[data-prev]', hero).onclick = () => go(cur - 1);
    $('[data-next]', hero).onclick = () => go(cur + 1);
    let x0 = null;
    hero.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
    hero.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); x0 = null; });
    // пауза, когда вкладка скрыта
    document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else go(cur); });
    if (!reduced) timer = setTimeout(() => go(1), DUR);
  }

  /* ---------- главная: вкладки услуг ---------- */
  const svcBtns = $$('[data-svc]'), panes = $$('[data-pane]');
  if (svcBtns.length) {
    const set = i => {
      svcBtns.forEach((x, j) => { x.classList.toggle('on', j == i); x.setAttribute('aria-selected', j == i); });
      panes.forEach((x, j) => x.classList.toggle('on', j == i));
    };
    svcBtns.forEach(x => { x.onclick = () => set(x.dataset.svc); x.onmouseenter = () => matchMedia('(hover:hover)').matches && set(x.dataset.svc); });
  }

  /* ---------- главная: лента чемпионов ---------- */
  const track = $('#track');
  if (track) {
    const bar = $('#cbar'), cn = $('#ccount'), cards = [...track.children], n = cards.length;
    const step = () => cards[0].offsetWidth + parseFloat(getComputedStyle(track).gap || 24);
    const upd = () => {
      const max = track.scrollWidth - track.clientWidth, p = max ? track.scrollLeft / max : 0, vis = track.clientWidth / track.scrollWidth;
      bar.style.width = vis * 100 + '%'; bar.style.left = p * (1 - vis) * 100 + '%';
      const i = Math.min(n, Math.round(track.scrollLeft / step()) + 1);
      cn.textContent = String(i).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
    };
    track.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
    const by = d => track.scrollBy({ left: d * step(), behavior: 'smooth' });
    $('#cprev').onclick = () => by(-1); $('#cnext').onclick = () => by(1);
    track.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); by(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); by(-1); } });
    let down = false, sx, sl0, moved = false;
    track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl0 = track.scrollLeft; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) { moved = true; track.classList.add('drag'); } track.scrollLeft = sl0 - dx; });
    addEventListener('pointerup', () => { if (!down) return; down = false; track.classList.remove('drag'); if (moved) track.scrollTo({ left: Math.round(track.scrollLeft / step()) * step(), behavior: 'smooth' }); });
  }

  /* ---------- «сегодня» в расписании и неделе турниров ---------- */
  const t = todayIdx();
  $$('.sch-d[data-day="' + t + '"]').forEach(d => { d.classList.add('today'); $('b', d).insertAdjacentHTML('beforeend', '<small>сегодня</small>'); });
  $$('.wd[data-day="' + t + '"]').forEach(d => d.classList.add('today'));

  /* ---------- ближайший турнир по паделу ---------- */
  const DAYSF = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];
  const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  $$('[data-next-tournament]').forEach(box => {
    const T = box.dataset.days.split(',').map(Number), now = new Date();
    for (let i = 0; i < 8; i++) {
      const d = new Date(now); d.setDate(now.getDate() + i);
      const w = (d.getDay() + 6) % 7;
      if (!T.includes(w)) continue;
      const when = i === 0 ? 'сегодня' : i === 1 ? 'завтра' : `через ${i} ${i < 5 ? 'дня' : 'дней'}`;
      box.lastElementChild.innerHTML = `Ближайший турнир — <b>${when}</b><br><span style="font-weight:500;opacity:.7">${DAYSF[w]}, ${d.getDate()} ${MONTHS[d.getMonth()]}</span>`;
      break;
    }
  });

  /* ---------- фильтры: расписание по тренеру, новости по рубрике ---------- */
  const filterGroup = (group, apply) => {
    const btns = $$('.fbtn', group);
    btns.forEach(b => b.onclick = () => { btns.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); apply(b.dataset.f); });
  };
  const sch = $('#sch'), schF = $('[data-filter]');
  if (sch && schF) filterGroup(schF, f => {
    sch.classList.toggle('filtered', f !== '*');
    $$('.sch-d', sch).forEach(day => {
      let any = false;
      $$('.ev', day).forEach(ev => { const show = f === '*' || ev.dataset.coach === f || ev.dataset.coach === '*'; ev.hidden = !show; any = any || show; });
      $('.sch-empty', day).hidden = any;
    });
  });
  const nf = $('[data-nf]');
  if (nf) filterGroup(nf, f => $$('#nlist .nw').forEach(n => n.hidden = !(f === '*' || n.dataset.cat === f)));

  /* ---------- теннис: уровни ---------- */
  const lvls = $$('.lvl');
  lvls.forEach(b => b.onclick = () => lvls.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }));

  /* ---------- подменю раздела: подсветка текущего блока ---------- */
  const sub = $$('.subnav a[href^="#"]');
  if (sub.length && 'IntersectionObserver' in window) {
    const so = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      sub.forEach(a => {
        const on = a.getAttribute('href') === '#' + e.target.id;
        a.classList.toggle('on', on);
        if (on) a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      });
    }), { rootMargin: '-45% 0px -50% 0px' });
    sub.forEach(a => { const el = document.getElementById(a.getAttribute('href').slice(1)); el && so.observe(el); });
  }

  /* ---------- модальные окна ---------- */
  const modal = $('#modal'), cm = $('#cmodal');
  let lastFocus = null;
  const open = m => { lastFocus = document.activeElement; m.classList.add('open'); document.body.classList.add('lock'); setTimeout(() => ($('.x', m) || m).focus(), 50); };
  const close = m => { if (!m.classList.contains('open')) return; m.classList.remove('open'); if (!$('.modal.open')) document.body.classList.remove('lock'); lastFocus && lastFocus.focus && lastFocus.focus(); };

  const openBook = v => {
    close(cm);
    const f = $('.form', modal), s = $('select', f);
    if (v) { const key = v.toLowerCase().split(' ')[0].slice(0, 5); const o = [...s.options].find(o => o.text.toLowerCase().includes(key)); if (o) s.value = o.text; }
    f.classList.remove('sent');
    open(modal);
  };
  const openCoach = card => {
    $('.cm-slot', cm).replaceChildren($('template', card).content.cloneNode(true));
    open(cm);
    const sc = $('.cm-scroll', cm); if (sc) sc.scrollTop = 0;
  };

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-book]');
    if (b) { e.preventDefault(); openBook(b.dataset.book); return; }
    if (e.target.closest('[data-close]') || e.target === modal) { close(modal); return; }
    if (e.target.closest('[data-cclose]') || e.target === cm) { close(cm); return; }
    const co = e.target.closest('[data-coach]');
    if (co && co.classList.contains('co')) openCoach(co);
  });
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { close(modal); close(cm); if (mnav.classList.contains('open')) setMenu(false); }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.co[data-coach]')) { e.preventDefault(); openCoach(e.target); }
    // удерживаем фокус внутри открытого окна
    if (e.key === 'Tab') {
      const m = $('.modal.open') || (mnav.classList.contains('open') ? mnav : null);
      if (!m) return;
      const f = $$('a[href],button:not([disabled]),input,select,textarea', m).filter(x => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- форма записи ---------- */
  const mask = inp => inp.addEventListener('input', () => {
    let d = inp.value.replace(/\D/g, '');
    if (!d) { inp.value = ''; return; }
    if (d[0] === '8') d = '7' + d.slice(1);
    if (d[0] !== '7') d = '7' + d;
    d = d.slice(0, 11); const p = d.slice(1);
    let o = '+7';
    if (p.length) o += ' (' + p.slice(0, 3);
    if (p.length >= 3) o += ')';
    if (p.length > 3) o += ' ' + p.slice(3, 6);
    if (p.length > 6) o += '-' + p.slice(6, 8);
    if (p.length > 8) o += '-' + p.slice(8, 10);
    inp.value = o;
  });

  /* ---------- cookie-баннер и Яндекс.Метрика (только после согласия) ---------- */
  const KEY = 'vopreki-cookie', banner = $('#cookie');
  const metrikaId = +($('script[data-metrika]')?.dataset.metrika || 0);
  const store = { get() { try { return localStorage.getItem(KEY); } catch { return null; } }, set(v) { try { localStorage.setItem(KEY, v); } catch {} } };
  const loadMetrika = () => {
    if (!metrikaId || window.ym) return;
    (function (m, e, t, r, i, k, a) { m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); }; m[i].l = 1 * new Date(); k = e.createElement(t); a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r; a.parentNode.insertBefore(k, a); })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    window.ym(metrikaId, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true, ecommerce: 'dataLayer' });
  };
  const choice = store.get();
  if (choice === 'all') loadMetrika();
  else if (!choice && banner) banner.hidden = false;
  $$('[data-cookie]').forEach(b => b.onclick = () => {
    store.set(b.dataset.cookie); banner.hidden = true;
    if (b.dataset.cookie === 'all') loadMetrika();
  });

  $$('[data-form]').forEach(f => {
    const phone = f.elements.phone, err = $('.err', f), btn = $('button[type=submit]', f);
    mask(phone);
    const fail = (msg, el) => { err.textContent = msg; err.hidden = false; if (el) { el.classList.add('bad'); el.focus(); } return false; };
    const validate = () => {
      $$('.bad', f).forEach(x => x.classList.remove('bad')); err.hidden = true;
      if (f.elements.name.value.trim().length < 2) return fail('Укажите имя', f.elements.name);
      if (phone.value.replace(/\D/g, '').length !== 11) return fail('Введите номер телефона полностью', phone);
      if (!f.elements.consent.checked) return fail('Нужно согласие на обработку персональных данных', f.elements.consent);
      return true;
    };
    f.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validate()) return;
      const data = { dir: f.elements.dir.value, name: f.elements.name.value.trim(), phone: phone.value, page: location.pathname };
      const endpoint = f.dataset.endpoint;
      if (!endpoint) {
        // Обработчик заявок не настроен — открываем письмо администратору
        const body = `Направление: ${data.dir}\nИмя: ${data.name}\nТелефон: ${data.phone}\nСтраница: ${location.href}`;
        location.href = `mailto:${f.dataset.email}?subject=${encodeURIComponent('Заявка с сайта: ' + data.dir)}&body=${encodeURIComponent(body)}`;
        $('.ok', f).textContent = 'Открыли письмо с заявкой — отправьте его, и мы перезвоним. Или позвоните: +7 918 189-51-17';
        f.classList.add('sent'); f.reset();
        return;
      }
      const label = btn.innerHTML; btn.disabled = true; btn.textContent = 'Отправляем…';
      try {
        const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error(r.status);
        f.classList.add('sent'); f.reset();
      } catch {
        fail('Не получилось отправить заявку. Позвоните нам: +7 918 189-51-17');
      } finally { btn.disabled = false; btn.innerHTML = label; }
    });
  });
})();
