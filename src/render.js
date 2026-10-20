/* =========================================================
   Шаблоны страниц. pages() возвращает список {path, html} —
   его записывают на диск tools/build.mjs (Node) или tools/build.html (браузер).
   ========================================================= */
import { SITE, I, D, BIO, NEWS, SERV, SLIDES, CHAMPS, DIR_CARDS, HOME_SERV, LEVELS, PADEL_TOURNAMENT_DAYS, BOOK_OPTIONS, LEGAL, REDIRECTS } from './data.js';
import privacyDoc from './legal/privacy.js';
import consentDoc from './legal/consent.js';
import adsConsentDoc from './legal/ads-consent.js';
const LEGAL_HTML = { privacy: privacyDoc, consent: consentDoc, 'ads-consent': adsConsentDoc };

/* ---------- константы и помощники ---------- */
const DIRS = ['padel', 'football', 'tennis', 'swim', 'gym'];
const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const PGN = 14; // ширина «подгонки» заголовков страниц, в символах
const SLN = Math.max(...SLIDES.flatMap(s => s.h.map(t => t.length)));

const ABS = /^https?:/.test(SITE.uploads);
const img = p => (ABS ? '' : R) + SITE.uploads + encodeURI(p);
const imgAbs = p => ABS ? SITE.uploads + encodeURI(p) : url(SITE.uploads + encodeURI(p));
const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const strip = s => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const pad2 = n => String(n).padStart(2, '0');

const AR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const AL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
const BEAR = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="377.93 119.03 241.94 243.83" aria-hidden="true"><path d="M607.67 180.55 L613.82 174.39 L613.82 148.95 L583.91 119.03 L558.47 119.03 L547.32 130.17 L498.90 130.17 L450.47 130.17 L439.33 119.03 L413.89 119.03 L383.97 148.95 L383.97 174.39 L390.13 180.55 L377.93 241.89 L498.90 362.86 L619.87 241.89 L607.67 180.55 M564.62 133.89 L577.75 133.89 L598.97 155.10 L598.97 168.23 L595.03 172.18 L560.68 137.83 L564.62 133.89 M498.90 145.03 L532.47 145.03 L513.02 164.47 L498.90 164.47 L484.77 164.47 L465.33 145.03 L498.90 145.03 M488.39 257.81 L472.63 273.56 L454.74 255.66 L454.74 224.15 L488.39 257.81 M474.65 223.05 L498.90 223.05 L523.14 223.05 L498.90 247.30 L474.65 223.05 M498.90 268.31 L514.66 284.07 L498.90 299.83 L483.14 284.07 L498.90 268.31 M509.40 257.81 L543.06 224.15 L543.06 255.66 L525.16 273.56 L509.40 257.81 M528.20 208.20 L498.90 208.20 L469.59 208.20 L454.74 223.05 L454.74 209.36 L484.77 179.33 L498.90 179.33 L513.02 179.33 L543.06 209.36 L543.06 223.05 L528.20 208.20 M398.83 155.10 L420.04 133.89 L433.18 133.89 L437.11 137.83 L402.76 172.18 L398.83 168.23 L398.83 155.10 M498.90 341.85 L394.05 237.00 L402.76 193.19 L447.62 148.33 L471.19 171.90 L439.88 203.21 L439.88 261.82 L498.90 320.84 L557.92 261.82 L557.92 203.21 L526.61 171.90 L550.18 148.33 L595.03 193.19 L603.75 237.00 L498.90 341.85" fill="currentColor"/></svg>';
const LOGO = '<svg role="img" aria-label="Вопреки" xmlns="http://www.w3.org/2000/svg" viewBox="317.56 173.39 362.67 112.43"><path d="M356.27 214.55 C356.28 216.17 355.18 217.18 352.97 217.57 L333.36 221.03 L333.34 216.15 L353.01 212.68 C355.22 212.29 356.31 212.91 356.27 214.55 M358.32 231.69 C358.34 233.40 357.23 234.46 354.97 234.86 L333.34 238.67 L333.34 233.58 L354.98 229.76 C357.23 229.37 358.35 230.01 358.32 231.69 M372.08 209.32 C372.07 200.54 366.11 197.20 354.21 199.29 L317.56 205.76 L317.57 218.93 L327.04 217.26 L317.58 230.16 L317.59 254.55 L355.86 247.81 C368.03 245.66 374.10 240.11 374.05 231.14 C374.05 225.38 371.53 221.90 366.49 220.69 C370.19 217.95 372.05 214.16 372.08 209.32 M420.38 219.28 C422.51 217.37 423.56 214.77 423.54 211.47 C423.56 208.17 422.51 205.91 420.39 204.70 C417.91 203.28 413.65 203.11 407.61 204.17 C401.57 205.24 397.31 206.92 394.83 209.21 C392.71 211.17 391.67 213.79 391.69 217.09 C391.71 220.38 392.76 222.62 394.82 223.78 C397.31 225.21 401.56 225.39 407.61 224.32 C413.65 223.25 417.90 221.57 420.38 219.28 M432.22 191.53 C436.98 195.06 439.36 200.78 439.36 208.68 C439.35 216.54 436.97 223.07 432.22 228.28 C426.84 234.15 418.65 238.06 407.65 240.00 C396.61 241.95 388.41 240.93 383.06 236.94 C378.30 233.42 375.93 227.72 375.93 219.86 C375.94 211.96 378.31 205.41 383.07 200.20 C388.41 194.38 396.60 190.49 407.64 188.55 C418.64 186.61 426.83 187.60 432.22 191.53 M443.22 183.60 L501.10 173.39 L501.06 222.20 L485.31 224.98 L485.34 191.16 L459.03 195.80 L459.00 229.62 L443.25 232.40 L443.22 183.60 M552.12 231.63 L552.13 217.82 L501.01 226.84 L501.01 240.59 L510.00 239.01 L501.02 251.24 L501.04 275.63 L552.09 266.63 L552.11 252.90 L516.81 259.12 L516.80 254.73 L550.61 248.77 L550.63 236.21 L516.82 242.17 L516.82 237.85 L552.12 231.63 M600.76 209.25 L620.16 205.83 L599.59 233.86 L620.19 254.62 L600.78 258.05 L586.46 243.63 L574.36 245.76 L574.35 262.71 L558.59 265.49 L558.56 216.69 L574.39 213.90 L574.36 230.77 L586.40 228.65 L600.76 209.25 M638.18 229.14 L666.91 197.58 L680.23 195.23 L680.19 244.04 L664.44 246.82 L664.44 220.33 L635.63 251.90 L622.38 254.24 L622.35 205.44 L638.18 202.65 L638.18 229.14 M474.15 255.00 C478.84 254.17 481.16 252.16 481.11 248.96 C481.14 245.75 478.84 244.55 474.20 245.37 L459.05 248.04 L459.01 257.67 L474.15 255.00 M474.20 231.56 C489.35 228.89 496.90 233.76 496.86 246.18 C496.91 258.58 489.36 266.12 474.21 268.79 L459.00 271.47 L459.02 283.04 L443.26 285.82 L443.23 237.02 L474.20 231.56" fill="currentColor" fill-rule="nonzero"/></svg>';
const TG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.4 4.2 2.9 11.3c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.8.8.4 0 .6-.2.9-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.4-1.5zM9.6 14l8.5-7.7c.4-.3-.1-.5-.6-.2L7.9 13.1"/></svg>';
const WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>';

const ico = (k, extra = '') => `<span class="ico"${extra}><svg viewBox="0 0 24 24" aria-hidden="true">${I[k]}</svg></span>`;
const chip = ([d, t]) => `<span class="chip">${d ? '<span class="dot"></span>' : ''}${t}</span>`;
const hTitle = (arr, tag = 'h1') => `<${tag} class="h h1 fit" style="--n:${PGN}">${arr.map((t, i) => `<span${i === 1 ? ' class="gtext"' : ''} style="display:block">${t}</span>`).join('')}</${tag}>`;
const secHead = (eyebrow, title, extra = '') => `<div class="sec-head"><div><span class="eyebrow rv">${eyebrow}</span><h2 class="h h2 rv d1" style="margin-top:18px">${title}</h2></div>${extra}</div>`;

/* Ссылки: все относительные, чтобы сайт работал и в корне домена, и в подпапке */
let R = '';
const at = depth => { R = '../'.repeat(depth); };
const u = p => (R + p) || './';
const url = p => SITE.url.replace(/\/$/, '') + '/' + p;

/* ---------- каркас страницы ---------- */
function layout({ path, depth, title, description, image, active = '', body, htmlClass = '', jsonld = '' }) {
  at(depth);
  const navL = DIRS.map(k => `<a href="${u(k + '/')}"${active === k ? ' class="on" aria-current="page"' : ''}>${k === 'gym' ? 'Функц. зал' : D[k].name}${k === 'padel' ? '<span class="new">NEW</span>' : ''}</a>`).join('');
  const navR = [['services', 'Услуги'], ['news', 'Новости'], ['contacts', 'Контакты']]
    .map(([k, t]) => `<a href="${u(k + '/')}"${active === k ? ' class="on" aria-current="page"' : ''}>${t}</a>`).join('');
  const canonical = url(path.replace(/index\.html$/, ''));
  const ogImage = image ? imgAbs(image) : url('assets/img/holo.jpg');
  const legalLinks = LEGAL.map(l => `<a href="${u(l.slug + '/')}">${l.short}</a>`).join('');

  return `<!doctype html>
<html lang="ru"${htmlClass ? ` class="${htmlClass}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${attr(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ru_RU">
<meta property="og:site_name" content="${attr(SITE.name)}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#000000">
<link rel="icon" href="${R}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700;800&family=Unbounded:wght@800;900&display=swap" rel="stylesheet">
<link rel="preload" href="${R}assets/fonts/phonk.ttf" as="font" type="font/ttf" crossorigin>
<link rel="stylesheet" href="${R}assets/css/style.css">
${jsonld ? `<script type="application/ld+json">${jsonld}</script>\n` : ''}</head>
<body>
<a class="skip" href="#main">Перейти к содержанию</a>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="ig" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0891d0"/><stop offset="1" stop-color="#ee3c96"/></linearGradient></defs></svg>
<div class="cursor" id="cursor" aria-hidden="true"></div>

<header class="hdr" id="hdr">
  <div class="wrap">
    <nav class="nav" aria-label="Направления">${navL}</nav>
    <a href="${u('')}" class="logo" aria-label="Вопреки — на главную">${LOGO}</a>
    <div class="hdr-r">
      <nav class="nav r" aria-label="Академия">${navR}</nav>
      <div class="soc"><a href="${SITE.telegram}" target="_blank" rel="noopener" aria-label="Telegram">${TG}</a><a href="${SITE.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${WA}</a></div>
      <button class="btn btn-p" type="button" data-book>Записаться</button>
      <button class="burger" id="burger" type="button" aria-label="Открыть меню" aria-controls="mnav" aria-expanded="false"><span></span></button>
    </div>
  </div>
</header>

<nav class="mnav" id="mnav" aria-label="Меню">
  <button class="x" id="mclose" type="button" aria-label="Закрыть меню">✕</button>
  <a href="${u('')}">Главная</a>${DIRS.map(k => `<a href="${u(k + '/')}">${D[k].name.replace('Функциональный', 'Функцио&shy;нальный')}</a>`).join('')}<a href="${u('services/')}">Услуги</a><a href="${u('news/')}">Новости</a><a href="${u('contacts/')}">Контакты</a>
  <div class="mnav-b"><a class="btn btn-p" href="${SITE.phoneHref}">${SITE.phone}</a><button class="btn btn-o" type="button" data-book>Записаться</button></div>
</nav>

<main id="main">
${body}
</main>

<footer>
  <div class="wrap">
    <div class="g12">
      <div class="c4 t12"><a class="logo" href="${u('')}" style="width:170px" aria-label="Вопреки — на главную">${LOGO}</a><p class="mute" style="margin-top:20px;max-width:320px;font-size:15px">Спортивная академия в Краснодаре: футбол, большой теннис, падел, бассейн и функциональный зал.</p></div>
      <div class="c2 t6"><h5>Направления</h5>${DIRS.map(k => `<a href="${u(k + '/')}">${D[k].name}</a>`).join('')}</div>
      <div class="c3 t6"><h5>Академия</h5><a href="${u('services/')}">Услуги и аренда</a><a href="${u('')}#champs">Наши чемпионы</a><a href="${u('news/')}">Новости</a><a href="${u('contacts/')}">Контакты</a></div>
      <div class="c3 t12"><h5>Связаться</h5><a href="${SITE.phoneHref}">${SITE.phone}</a><a href="mailto:${SITE.email}">${SITE.email}</a><a href="${SITE.mapLink}" target="_blank" rel="noopener">${SITE.address}</a><a href="${SITE.telegram}" target="_blank" rel="noopener">Telegram</a><a href="${SITE.instagram}" target="_blank" rel="noopener">Instagram*</a></div>
    </div>
    <div class="legal"><span>© ${new Date().getFullYear()} Спортивная академия «Вопреки». Все права защищены.</span><span>${legalLinks}</span></div>
    <p class="meta-note">${SITE.metaNote}</p>
  </div>
</footer>

<div class="cookie" id="cookie" role="region" aria-label="Уведомление о cookie" hidden>
  <p>Мы используем cookie для улучшения работы сайта. Продолжая пользоваться сайтом, вы соглашаетесь на обработку файлов cookies и пользовательских данных в соответствии с <a href="${u('privacy/')}">политикой обработки персональных данных</a>.</p>
  <div class="cookie-b"><button class="btn btn-w btn-sm" type="button" data-cookie="all">Принять</button><button class="btn btn-o btn-sm" type="button" data-cookie="necessary">Только необходимые</button></div>
</div>

<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="mt">
  <div class="box">
    <button class="x" type="button" data-close aria-label="Закрыть">✕</button>
    <div class="h h3" id="mt">Записаться на тренировку</div>
    <p>Оставьте контакты — администратор перезвонит, подберёт группу и время.</p>
    ${form('Отправить заявку', 'm')}
  </div>
</div>
<div class="modal cmodal" id="cmodal" role="dialog" aria-modal="true" aria-label="Тренер">
  <div class="cbox">
    <button class="x" type="button" data-cclose aria-label="Закрыть">✕</button>
    <div class="cm-slot"></div>
  </div>
</div>
<button class="totop" id="totop" type="button" aria-label="Наверх">${AR}</button>

<script src="${R}assets/js/main.js" data-metrika="${SITE.metrika || ''}" defer></script>
</body>
</html>
`;
}

/* ---------- форма записи (одна разметка для модального окна и блока контактов) ---------- */
function form(btn, id) {
  return `<form class="form" data-form data-endpoint="${attr(SITE.formEndpoint)}" data-email="${attr(SITE.email)}" novalidate>
      <label class="sr" for="${id}-dir">Направление</label>
      <select class="inp" name="dir" id="${id}-dir">${BOOK_OPTIONS.map(o => `<option>${o}</option>`).join('')}</select>
      <label class="sr" for="${id}-name">Имя</label>
      <input class="inp" name="name" id="${id}-name" placeholder="Имя" autocomplete="name" required>
      <label class="sr" for="${id}-phone">Телефон</label>
      <input class="inp" name="phone" id="${id}-phone" type="tel" placeholder="+7 (___) ___-__-__" autocomplete="tel" inputmode="tel" required>
      <label class="consent"><input type="checkbox" name="consent" required><span>Даю <a href="${u('consent/')}" target="_blank">согласие на обработку персональных данных</a> в соответствии с <a href="${u('privacy/')}" target="_blank">политикой</a></span></label>
      <p class="err" role="alert" hidden></p>
      <button class="btn btn-k" type="submit">${btn} ${AR}</button>
      <div class="ok" role="status">Спасибо! Мы свяжемся с вами в ближайшее время 🙌</div>
    </form>`;
}

/* ---------- блок «Запись + контакты» внизу страниц ---------- */
function contactsSection(withId = true) {
  return `
<section class="sec"${withId ? ' id="contacts"' : ''} style="padding-top:0"><div class="wrap">
 <div class="cta rv"><div class="bearbg">${BEAR}</div><div class="g12" style="position:relative;align-items:center">
  <div class="c6 t12"><h2 class="h h2">Первая<br>тренировка —<br>вопреки всему</h2><p style="margin-top:20px;max-width:440px;font-size:17px;color:rgba(0,0,0,.72)">Подберём направление, группу и удобное время. Перезвоним в течение рабочего дня.</p></div>
  <div class="c5 t12" style="grid-column-end:-1">${form('Записаться', 'c')}</div></div></div>
 <div class="cts">
  <div class="ct-l rv">
   <h2 class="h h2" style="margin:24px 0 18px">Контакты</h2>
   <a class="ct-row" href="${SITE.mapLink}" target="_blank" rel="noopener"><div><small>Адрес</small><span>${SITE.address}</span></div>${AR}</a>
   <a class="ct-row" href="${SITE.phoneHref}"><div><small>Телефон</small><span>${SITE.phone}</span></div>${AR}</a>
   <a class="ct-row" href="mailto:${SITE.email}"><div><small>Почта</small><span>${SITE.email}</span></div>${AR}</a>
   <a class="ct-row" href="${SITE.telegram}" target="_blank" rel="noopener"><div><small>Telegram</small><span>${SITE.telegramName}</span></div>${AR}</a>
   <a class="ct-row" href="${SITE.instagram}" target="_blank" rel="noopener"><div><small>Instagram*</small><span>${SITE.instagramName}</span></div>${AR}</a>
   <p class="meta-note">${SITE.metaNote}</p>
  </div>
  <div class="map rv d1"><iframe loading="lazy" title="Академия «Вопреки» на карте" src="${SITE.mapWidget}"></iframe></div>
 </div>
</div></section>`;
}

/* ---------- падел: неделя турниров ---------- */
const T = PADEL_TOURNAMENT_DAYS;
const weekStrip = () => `<div class="week">${DAYS.map((d, i) => `<div class="wd${T.includes(i) ? ' t' : ''}" data-day="${i}"><b>${d}</b>${T.includes(i) ? 'турнир' : 'аренда'}</div>`).join('')}</div>`;
const nextBox = () => `<div class="next" data-next-tournament data-days="${T.join(',')}">${ico('trophy', ' style="background:#000;border:0"')}<div>Турниры каждую неделю — <b>Вт · Чт · Сб</b></div></div>`;

/* =========================================================
   ГЛАВНАЯ
   ========================================================= */
function home() {
  at(0);
  const latest = NEWS.slice(0, 4);
  const body = `
<section class="hero" id="hero" aria-roledescription="carousel" aria-label="Главные новости академии">
 ${SLIDES.map((s, i) => `<div class="slide${i ? '' : ' on'}" data-i="${i}"${i ? ' aria-hidden="true"' : ''}>
   <div class="bg" style="background-image:url('${img(s.img)}')"></div>
   <div class="wrap in">
     <div class="tags fade">${s.tags.map(chip).join('')}</div>
     <${i ? 'p' : 'h1'} class="h h1 fit" style="--n:${SLN}">${s.h.map((t, j) => `<span><i class="${j === 1 ? 'gtext' : ''}">${t}</i></span>`).join('')}</${i ? 'p' : 'h1'}>
     <p class="lead fade">${s.lead}</p>
     <div class="row fade"><button class="btn btn-p" type="button" data-book="${D[s.k].name}">${s.b} ${AR}</button><a class="btn btn-o" href="${u(s.k + '/')}">Подробнее</a></div>
   </div></div>`).join('')}
 <div class="hero-ctrl"><div class="wrap">
   <div class="pager">${SLIDES.map((s, i) => `<button type="button" data-go-slide="${i}" class="${i ? '' : 'on'}" aria-label="Слайд ${i + 1}: ${s.l}"><i></i><b>0${i + 1}</b><span>${s.l}</span></button>`).join('')}</div>
   <div class="arrows"><button class="arr" type="button" data-prev aria-label="Предыдущий слайд">${AL}</button><button class="arr" type="button" data-next aria-label="Следующий слайд">${AR}</button></div>
 </div></div>
</section>

<div class="marq" aria-hidden="true"><div class="t">${Array(2).fill(['Вопреки усталости', 'Вопреки боли', 'Вопреки погоде', 'Вопреки поражениям']).flat().map(t => `<span>${t}</span>`).join('')}</div></div>

<section class="sec about" id="about"><div class="wrap"><div class="g12" style="align-items:center">
  <div class="c5 t12 txt">
    <span class="eyebrow rv">${SITE.address.replace('Краснодар, ', 'Краснодар · ')}</span>
    <h2 class="h h2 rv d1" style="margin-top:22px;font-size:clamp(34px,3.7vw,56px)">Спортивная<br>академия<br><span class="gtext">«Вопреки»</span></h2>
    <p class="lead rv d2">Рады приветствовать вас в академии «Вопреки». На территории — сертифицированные теннисные корты, корты для падела, две футбольные арены, бассейн, тренажёрный зал, массажный кабинет, кафе с зоной отдыха и магазин спортивной экипировки.</p>
    <div class="stats rv d3"><div class="stat"><b data-count="5">5</b><small>направлений<br>для детей и взрослых</small></div><div class="stat"><b data-count="2">2</b><small>футбольные<br>арены</small></div><div class="stat"><b data-count="4">4</b><small>года — возраст<br>старта занятий</small></div></div>
  </div>
  <div class="c7 t12"><div class="adv">
    <div class="adv-i rv">${ico('pin')}<div><h3 class="h4t">Удобное местоположение</h3><p>${SITE.address}</p></div></div>
    <div class="adv-i rv d1">${ico('balls')}<div><h3 class="h4t">Разнообразные виды спорта</h3><p>Футбол, теннис, падел, плавание, ОФП</p></div></div>
    <div class="adv-i rv d2">${ico('dumb')}<div><h3 class="h4t">Тренажёрный зал</h3><p>Функциональная зона для детей и взрослых</p></div></div>
    <div class="adv-i rv d3">${ico('cup')}<div><h3 class="h4t">Кафе и веранда</h3><p>Кофе, завтраки и обеды — пока ждёте ребёнка</p></div></div>
    <div class="adv-i wide rv d4">${ico('bag')}<div><h3 class="h4t">Магазин спортивных товаров</h3><p>Экипировка и инвентарь, не выходя из клуба — ракетки, мячи, форма «Вопреки»</p></div><a class="btn btn-o btn-sm" href="${u('services/')}" style="margin-left:auto">Все услуги</a></div>
  </div></div>
</div></div></section>

<section class="sec padel" id="padel-spot" style="padding-top:0"><div class="wrap">
 <div class="pad-card">
  <div class="bearbg">${BEAR}</div>
  <div class="g12">
   <div class="c6 t12">
     <span class="eyebrow rv" style="color:#fff">Главная новинка сезона</span>
     <h2 class="h h2 rv d1" style="margin-top:20px">Падел<br><span class="outline">растёт</span><br>вместе с вами</h2>
     <p class="lead rv d2" style="margin-top:22px;max-width:520px">Два корта уже открыты, третий — крытый — в стройке. Тренеры по паделу, пушка для мячей и турниры три раза в неделю.</p>
     <div class="courts rv d3" aria-hidden="true">
       <div class="court"><span class="num">01</span><span class="sl" style="top:28%"></span><span class="sl" style="bottom:28%"></span><span class="ln"></span><span class="ball"></span><span class="lbl"><span>Открыт</span><span class="dot"></span></span></div>
       <div class="court"><span class="num">02</span><span class="sl" style="top:28%"></span><span class="sl" style="bottom:28%"></span><span class="ln"></span><span class="ball" style="animation-delay:-1.3s"></span><span class="lbl"><span>Открыт</span><span class="dot"></span></span></div>
       <div class="court build"><span class="roof"></span><span class="num">03</span><span class="sl" style="top:28%"></span><span class="sl" style="bottom:28%"></span><span class="ln"></span><span class="lbl"><span>Крытый</span><span style="color:var(--lime)">строится</span></span></div>
     </div>
   </div>
   <div class="c6 t12" style="display:flex;flex-direction:column;justify-content:flex-end">
     <div class="pfeat">
       <div class="pf rv">${ico('coach')}<div><h3 class="h4t">Лицензированные тренеры</h3><p>Обучались в Москве у специалистов из Испании</p></div></div>
       <div class="pf rv d1">${ico('cannon')}<div><h3 class="h4t">Пушка для мячей</h3><p>Сотни повторений удара за час</p></div></div>
       <div class="pf rv d2">${ico('glass')}<div><h3 class="h4t">Стеклянные стены</h3><p>Игра от стен — уникальная динамика</p></div></div>
       <div class="pf rv d3">${ico('crane')}<div><h3 class="h4t">3-й корт — крытый</h3><p>Скоро — падел круглый год</p></div></div>
     </div>
     <div class="rv" style="margin-top:28px"><div class="h h4">Турниры каждую неделю</div>${weekStrip()}${nextBox()}</div>
     <div class="row rv" style="display:flex;gap:12px;flex-wrap:wrap;margin-top:22px"><button class="btn btn-p" type="button" data-book="Падел">Забронировать корт ${AR}</button><a class="btn btn-o" href="${u('padel/')}">О паделе</a></div>
   </div>
  </div>
 </div>
</div></section>

<section class="sec" id="dirs" style="padding-top:0"><div class="wrap">
 ${secHead('5 направлений', 'Выбери своё<br><span class="gtext">направление</span>', '<p class="mute rv d2" style="max-width:360px">Наведите на карточку, чтобы узнать больше. Пробная тренировка — по записи.</p>')}
 <div class="dirs">
  ${DIR_CARDS.map(([k, s, im, txt], i) => `<a class="dir ${s} rv d${i % 3}" href="${u(k + '/')}"><img src="${img(im)}" alt="${D[k].name}" loading="lazy"><span class="num">0${i + 1}</span><div class="c"><h3 class="h">${D[k].name.replace('Функциональный', 'Функцио&shy;нальный')}</h3><div class="more"><div><p>${txt}</p><span class="btn btn-w btn-sm">Подробнее ${AR}</span></div></div></div><span class="bord"></span></a>`).join('')}
 </div>
</div></section>

<section class="sec" id="services" style="background:var(--g1)"><div class="wrap">
 ${secHead('Инфраструктура', 'Только качественные<br><span class="gtext">услуги</span>', `<div class="rv d2" style="max-width:420px"><p class="mute">Кафе, магазин, массаж и аренда — всё на одной территории, чтобы тренировка была комфортной от начала до конца.</p><a class="btn btn-o btn-sm" href="${u('services/')}" style="margin-top:18px">Все услуги и цены ${AR}</a></div>`)}
 <div class="svc">
  <div class="svc-list rv" role="tablist" aria-label="Услуги">${HOME_SERV.map(([, t], i) => `<button class="svc-btn${i ? '' : ' on'}" type="button" role="tab" aria-selected="${!i}" data-svc="${i}"><b>0${i + 1}</b><span>${t}</span>${AR}</button>`).join('')}</div>
  <div class="svc-view rv d1">
   ${HOME_SERV.map(([im, t, p, pr], i) => `<div class="svc-pane${i ? '' : ' on'}" data-pane="${i}" role="tabpanel"><div class="bg" style="background-image:url('${img(im)}')"></div><h3 class="h h3">${t}</h3><p>${p}</p><div class="prices">${pr.map(([a, b]) => `<span class="price">${a} · <b>${b}</b></span>`).join('')}</div></div>`).join('')}
  </div>
 </div>
</div></section>

<section class="sec champs" id="champs"><div class="wrap">
 ${secHead('Гордимся', 'Наши<br><span class="outline">чемпионы</span>')}</div>
 <div class="track" id="track" tabindex="0" aria-label="Фото чемпионов, листайте горизонтально">${CHAMPS.map((s, i) => `<div class="card-ch"><img src="${img(s)}" alt="Воспитанники академии «Вопреки» — фото ${i + 1}" loading="lazy" draggable="false"><span class="n">${pad2(i + 1)}</span></div>`).join('')}</div>
 <div class="wrap"><div class="sl-ctrl"><span class="count" id="ccount">01 / ${pad2(CHAMPS.length)}</span><div class="bar"><i id="cbar"></i></div><div class="arrows"><button class="arr" type="button" id="cprev" aria-label="Назад">${AL}</button><button class="arr" type="button" id="cnext" aria-label="Вперёд">${AR}</button></div></div></div>
</section>

<section class="sec" id="news" style="padding-top:0"><div class="wrap">
 ${secHead('Жизнь академии', 'Новости', `<a class="btn btn-o rv" href="${u('news/')}">Все новости ${AR}</a>`)}
 <div class="news">${latest.map((n, k) => newsCard(n, `d${k}`, false)).join('')}</div>
</div></section>
${contactsSection()}`;

  const jsonld = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'SportsActivityLocation', name: 'Спортивная академия «Вопреки»',
    url: SITE.url, telephone: SITE.phone.replace(/[^\d+]/g, ''), email: SITE.email, image: imgAbs(SLIDES[0].img),
    address: { '@type': 'PostalAddress', streetAddress: 'ул. Невкипелого, 24/4', addressLocality: 'Краснодар', addressCountry: 'RU' },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    sameAs: [SITE.telegram, SITE.instagram]
  });

  return layout({
    path: 'index.html', depth: 0, title: 'Академия «Вопреки» — футбол, теннис, падел и бассейн в Краснодаре',
    description: 'Спортивная академия «Вопреки», Краснодар: падел, футбол с 4 лет, большой теннис, бассейн 25 м и функциональный зал. Аренда кортов и полей, запись на тренировку.',
    image: SLIDES[0].img, body, jsonld
  });
}

/* =========================================================
   СТРАНИЦА НАПРАВЛЕНИЯ
   ========================================================= */
function schedule(k) {
  const d = D[k], s = d.sched;
  if (s.type === 'padel') {
    return `<div class="sch">${DAYS.map((day, i) => `<div class="sch-d" data-day="${i}"><b>${day}</b>${T.includes(i) ? '<div class="ev t"><strong>Турнир</strong><span>Падел · каждую неделю</span></div>' : ''}<div class="ev"><strong>Аренда</strong><span>2 корта · по записи</span></div><div class="ev m"><strong>Тренировки</strong><span>с тренером / с пушкой</span></div></div>`).join('')}</div>
<div class="note">${ico('cal')}<span>Время старта турниров и свободные слоты на корты — у администратора: <a href="${SITE.phoneHref}" style="color:#fff;font-weight:700">${SITE.phone}</a></span></div>`;
  }
  if (s.type === 'request') {
    return `<div class="pc hl req">${ico('cal')}<div style="flex:1;min-width:240px"><h3 class="h4t">Подберём удобное время</h3><p class="mute" style="margin-top:6px">Расписание групп и персональных тренировок формируется под набор. Оставьте заявку — администратор предложит свободные слоты.</p></div><button class="btn btn-p" type="button" data-book="${d.name}">Узнать расписание ${AR}</button></div>`;
  }
  const cls = { c: '', m: 'm', t: 't', l: 'l' };
  return `<div class="sch-f" data-filter role="group" aria-label="Фильтр по тренеру"><button class="fbtn on" type="button" data-f="*" aria-pressed="true">Все тренеры</button>${s.coaches.map(c => `<button class="fbtn" type="button" data-f="${attr(c)}" aria-pressed="false">${c}</button>`).join('')}</div>
<div class="sch" id="sch">${DAYS.map((day, i) => {
    const ev = s.ev.filter(e => e[2].includes(i + 1)).sort((a, b) => a[3].localeCompare(b[3]));
    return `<div class="sch-d" data-day="${i}"><b>${day}</b>${ev.map(e => `<div class="ev ${cls[e[4]] ?? ''}" data-coach="${attr(e[0])}"><strong>${e[3]}</strong><span>${e[1]}</span>${e[0] !== '*' ? `<span class="ev-who">${e[0]}</span>` : ''}</div>`).join('')}<span class="sch-empty"${ev.length ? ' hidden' : ''}>—</span></div>`;
  }).join('')}</div>
<div class="note">${ico('cal')}<span>Нажмите на тренера, чтобы увидеть его группы. Расписание может меняться — уточняйте у администратора.</span></div>`;
}

function levels() {
  return `<section class="sec" style="padding-top:0"><div class="wrap">${secHead('Как выбрать уровень', 'Цвет мяча —<br><span class="gtext">ваш уровень</span>')}
 <div class="lvls">${LEVELS.map(([c, t, a, p], i) => `<button class="lvl rv d${i}" type="button" style="--c:${c}" aria-pressed="false"><span class="tb"></span><span class="age">${a}</span><h3 class="h4t">${t}</h3><p>${p}</p></button>`).join('')}</div></div></section>`;
}

function coachCard(c, dirName, i) {
  const b = BIO[c.n];
  const photo = c.ph ? `<div class="ph">${BEAR}</div>` : `<img src="${img(c.i)}" alt="${attr(c.n)}" loading="lazy">`;
  const [first, ...last] = c.n.split(' ');
  const bio = `<div class="cm-im">${b ? `<img src="${img(b.i)}" alt="${attr(c.n)}">` : `<div class="ph">${BEAR}</div>`}</div>
<div class="cm-scroll">
 <div class="cm-role">${c.r} · ${dirName}</div>
 <h3 class="h cm-h">${first}<br><span class="gtext">${last.join(' ')}</span></h3>
 ${b ? `<div><span class="chip"><span class="dot"></span>${b.x}</span></div>` : ''}
 ${c.note ? `<div class="cm-s"><h4 class="cm-t">${dirName}</h4><p>${c.note}</p></div>` : ''}
 ${b ? b.s.map(([h, ps]) => `<div class="cm-s"><h4 class="cm-t">${h}</h4>${ps.map(p => `<p>${p}</p>`).join('')}</div>`).join('') : '<div class="cm-s"><p class="mute">Описание опыта и достижений тренера скоро появится.</p></div>'}
 <button class="btn btn-p" type="button" data-book="${attr(dirName)}">Записаться к тренеру ${AR}</button>
</div>`;
  return `<div class="co rv d${i % 4}" role="button" tabindex="0" data-coach aria-label="${attr(c.n)} — подробнее о тренере"><span class="co-more">Подробнее +</span>${photo}<div class="c"><div class="role">${c.r}</div><h3 class="co-n">${c.n}</h3>${c.note ? `<p class="co-note">${c.note}</p>` : ''}</div><span class="bord"></span><template>${bio}</template></div>`;
}

function directionPage(k) {
  at(1);
  const d = D[k];
  const body = `
<section class="p-hero"><div class="bg" style="background-image:url('${img(d.img)}')"></div>
 <div class="wrap"><div class="g12" style="align-items:end">
  <div class="c12"><nav class="crumbs" aria-label="Хлебные крошки"><a href="${u('')}">Главная</a> / ${d.name}</nav>${hTitle(d.title)}</div>
  <div class="c8 t12">
   <div class="facts">${d.facts.map(chip).join('')}</div>
   <p class="lead">${d.lead}</p>
   <div style="display:flex;gap:12px;flex-wrap:wrap"><button class="btn btn-p" type="button" data-book="${d.name}">${k === 'padel' ? 'Забронировать корт' : 'Записаться'} ${AR}</button><a class="btn btn-o" href="#sched">Расписание</a></div>
  </div>
  <div class="c4 t12 side">${d.kpi.map(([b, s]) => `<div class="kpi"><b>${b}</b><small>${s}</small></div>`).join('')}</div>
 </div></div>
</section>
<nav class="subnav" aria-label="Разделы страницы"><div class="wrap">${[['adv', 'Преимущества'], ...(d.levels ? [['levels', 'Уровни']] : []), ['sched', 'Расписание'], ['price', 'Стоимость'], ['coaches', 'Тренеры']].map(([a, t]) => `<a href="#${a}">${t}</a>`).join('')}<button class="btn btn-p btn-sm" type="button" data-book="${d.name}">Записаться</button></div></nav>

<section class="sec" id="adv"><div class="wrap">
 ${secHead('Почему у нас', 'Преимущества', `<p class="mute rv d2" style="max-width:440px">${d.about}</p>`)}
 <div class="padv">${d.adv.map(([ic, t, p, hot], i) => `<div class="adv-i${hot && k === 'padel' ? ' hot' : ''} rv d${i % 4}">${ico(ic)}<div><h3 class="h4t">${t}</h3><p>${p}</p></div></div>`).join('')}</div>
 <div class="gal" style="margin-top:var(--gap)">${d.gal.map((g, i) => `<div class="rv"><img src="${img(g)}" alt="${d.name} в академии «Вопреки» — фото ${i + 1}" loading="lazy"></div>`).join('')}</div>
</div></section>
${d.levels ? levels().replace('<section class="sec"', '<section class="sec" id="levels"') : ''}
<section class="sec" id="sched" style="background:var(--g1)"><div class="wrap">
 ${secHead(k === 'padel' ? 'Неделя на кортах' : 'Неделя тренировок', 'Расписание', k === 'padel' ? `<div class="rv" style="min-width:min(100%,360px)">${nextBox()}</div>` : '')}
 <div class="rv">${schedule(k)}</div>
</div></section>

<section class="sec" id="price"><div class="wrap">
 ${secHead('Абонементы и аренда', 'Стоимость')}
 <div class="pcards">${d.prices.map((p, i) => `<div class="pc${p.hl ? ' hl' : ''} rv d${i % 3}"><div><h3 class="h4t">${p.t}</h3></div><div class="sub">${p.s}</div><ul>${p.l.map(([a, b]) => `<li><span>${a}</span><b>${b}</b></li>`).join('')}</ul>${p.n ? `<small class="mute">${p.n}</small>` : ''}<button class="btn btn-o btn-sm" type="button" data-book="${d.name}">Записаться ${AR}</button></div>`).join('')}</div>
</div></section>

<section class="sec" id="coaches" style="padding-top:0"><div class="wrap">
 ${secHead('Команда', 'Тренерский<br><span class="gtext">состав</span>')}
 <div class="coaches">${d.coaches.map((c, i) => coachCard(c, d.name, i)).join('')}</div>
</div></section>
${contactsSection()}`;

  const titles = { padel: 'Падел в Краснодаре — корты, тренировки и турниры', football: 'Футбольная секция для детей с 4 лет в Краснодаре', tennis: 'Большой теннис для детей и взрослых в Краснодаре', swim: 'Плавание и бассейн 25 м в Краснодаре', gym: 'Функциональный зал и ОФП в Краснодаре' };
  return layout({
    path: `${k}/index.html`, depth: 1, active: k, htmlClass: 'has-subnav',
    title: `${titles[k]} | Академия «Вопреки»`, description: strip(d.lead), image: d.img, body
  });
}

/* =========================================================
   УСЛУГИ, НОВОСТИ, КОНТАКТЫ
   ========================================================= */
const miniHero = (crumb, title, lead, im) => `<section class="p-hero mini"><div class="bg" style="background-image:url('${img(im)}')"></div><div class="wrap"><nav class="crumbs" aria-label="Хлебные крошки"><a href="${u('')}">Главная</a> / ${crumb}</nav>${hTitle(title)}<p class="lead">${lead}</p></div></section>`;

function servicesPage() {
  at(1);
  const body = miniHero('Услуги', ['Услуги', 'и аренда'], 'Корты, поля, массаж, тейпирование, кафе и магазин — всё на одной территории академии.', '2025/03/IMG_4927-scaled.jpg') + `
<nav class="subnav" aria-label="Услуги"><div class="wrap">${SERV.map(x => `<a href="#sv-${x.id}">${x.t}</a>`).join('')}<button class="btn btn-p btn-sm" type="button" data-book="Аренда">Забронировать</button></div></nav>
<section class="sec"><div class="wrap"><div class="svlist">${SERV.map((x, i) => `
 <article class="sv rv" id="sv-${x.id}">
  <div class="sv-im">${x.img ? `<img src="${img(x.img)}" alt="${x.t}" loading="lazy">` : `<div class="sv-ph">${ico(x.ic)}</div>`}<span class="sv-n">0${i + 1}</span></div>
  <div class="sv-c">
   <h2 class="h h3">${x.t}</h2><p class="mute">${x.p}</p>
   ${x.f ? `<div class="sv-f">${x.f.map(t => `<span class="chip">${t}</span>`).join('')}</div>` : ''}
   ${x.g.map(([h, rows]) => `<div class="sv-g"><h3 class="sv-t">${h}</h3><ul>${rows.map(([a, b]) => `<li><span>${a}</span><b>${b}</b></li>`).join('')}</ul></div>`).join('')}
   ${x.n ? `<small class="mute">${x.n}</small>` : ''}
   <div class="sv-b"><button class="btn btn-p btn-sm" type="button" data-book="${x.l ? D[x.l].name : 'Аренда'}">${x.g.length ? 'Забронировать' : 'Связаться'} ${AR}</button>${x.l ? `<a class="btn btn-o btn-sm" href="${u(x.l + '/')}">О направлении</a>` : ''}</div>
  </div>
 </article>`).join('')}</div></div></section>` + contactsSection();
  return layout({
    path: 'services/index.html', depth: 1, active: 'services', htmlClass: 'has-subnav',
    title: 'Услуги и аренда кортов и полей в Краснодаре | Академия «Вопреки»',
    description: 'Аренда падел-кортов, теннисных кортов и футбольных полей, настольный теннис, спортивный массаж, тейпирование, кафе и магазин экипировки. Цены.',
    image: '2025/03/IMG_4927-scaled.jpg', body
  });
}

function newsCard(n, cls = '', excerpt = true) {
  return `<a class="nw rv ${cls}" href="${u('news/' + n.slug + '/')}" data-cat="${n.cat}"><div class="im"><img src="${img(n.img)}" alt="" loading="lazy"></div><div class="meta"><span class="chip">${n.cat}</span><time datetime="${n.date.split('.').reverse().join('-')}">${n.date}</time></div><h3 class="nw-t">${n.title}</h3>${excerpt ? `<p class="mute" style="font-size:14px">${strip(n.text[0]).slice(0, 110)}…</p>` : ''}</a>`;
}

function newsPage() {
  at(1);
  const cats = [...new Set(NEWS.map(n => n.cat))];
  const body = miniHero('Новости', ['Новости', 'академии'], 'Турниры, победы воспитанников и события «Вопреки».', '2026/06/чемп5.jpg') + `
<section class="sec"><div class="wrap">
 <div class="sch-f" data-nf role="group" aria-label="Фильтр новостей"><button class="fbtn on" type="button" data-f="*" aria-pressed="true">Все</button>${cats.map(c => `<button class="fbtn" type="button" data-f="${c}" aria-pressed="false">${c}</button>`).join('')}</div>
 <div class="news" id="nlist">${NEWS.map(n => newsCard(n)).join('')}</div>
</div></section>` + contactsSection();
  return layout({
    path: 'news/index.html', depth: 1, active: 'news', title: 'Новости | Академия «Вопреки»',
    description: 'Новости спортивной академии «Вопреки»: турниры по паделу и футболу, победы воспитанников, события клуба.', image: '2026/06/чемп5.jpg', body
  });
}

function newsItem(n) {
  at(2);
  const others = NEWS.filter(x => x !== n);
  const body = `
<article class="art"><div class="wrap">
 <nav class="crumbs" aria-label="Хлебные крошки"><a href="${u('')}">Главная</a> / <a href="${u('news/')}">Новости</a> / ${n.cat}</nav>
 <div class="g12" style="align-items:start">
  <div class="c7 t12">
   <div class="meta" style="display:flex;gap:10px;align-items:center;margin-bottom:22px"><span class="chip">${n.cat}</span><time class="mute" datetime="${n.date.split('.').reverse().join('-')}">${n.date}</time></div>
   <h1 class="art-h">${n.title}</h1>
   <div class="art-b">${n.text.map(p => `<p>${p}</p>`).join('')}</div>
   <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:36px"><a class="btn btn-o" href="${u('news/')}">${AL} Все новости</a><button class="btn btn-p" type="button" data-book="${n.cat === 'Теннис' ? 'Большой теннис' : n.cat}">Записаться ${AR}</button></div>
  </div>
  <div class="c5 t12"><div class="art-im"><img src="${img(n.img)}" alt="${attr(n.title)}"></div></div>
 </div>
</div></article>
<section class="sec" style="padding-top:0"><div class="wrap"><div class="sec-head"><h2 class="h h2">Другие новости</h2></div>
 <div class="news">${others.map(x => newsCard(x)).join('')}</div></div></section>` + contactsSection();
  return layout({
    path: `news/${n.slug}/index.html`, depth: 2, active: 'news', title: `${n.title} | Академия «Вопреки»`,
    description: strip(n.text[0]).slice(0, 160), image: n.img, body
  });
}

function contactsPage() {
  at(1);
  const body = miniHero('Контакты', ['Контакты', 'и запись'], `${SITE.address}. Ежедневно ждём на тренировках — звоните, пишите или оставьте заявку.`, '2026/06/футбол8.jpg') + `<div style="height:clamp(56px,7vw,100px)"></div>` + contactsSection(false);
  return layout({
    path: 'contacts/index.html', depth: 1, active: 'contacts', title: 'Контакты и запись на тренировку | Академия «Вопреки»',
    description: `Академия «Вопреки»: ${SITE.address}. Телефон ${SITE.phone}, ${SITE.email}. Запись на пробную тренировку.`, image: '2026/06/футбол8.jpg', body
  });
}

/* ---------- юридические документы ---------- */
function legalPage(l) {
  at(1);
  const others = LEGAL.filter(x => x !== l);
  const body = `
<article class="art legal-page"><div class="wrap">
 <nav class="crumbs" aria-label="Хлебные крошки"><a href="${u('')}">Главная</a> / Документы</nav>
 <h1 class="art-h">${l.title}</h1>
 <div class="legal-meta"><a class="btn btn-o btn-sm" href="${R}assets/docs/${l.docx}" download>Скачать .docx</a>${others.map(x => `<a class="btn btn-o btn-sm" href="${u(x.slug + '/')}">${x.short}</a>`).join('')}</div>
 <div class="doc">${LEGAL_HTML[l.slug]}</div>
</div></article>`;
  return layout({ path: `${l.slug}/index.html`, depth: 1, title: `${l.title} | Академия «Вопреки»`, description: `${l.title} — спортивная академия «Вопреки», ИП Захарова А. В.`, body });
}

/* ---------- переадресация со старых адресов WordPress ---------- */
function redirectPage(from, to) {
  const depth = from.split('/').length;
  const target = '../'.repeat(depth) + to;
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>Страница переехала | Академия «Вопреки»</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${url(to)}">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(target)} + location.hash)</script>
</head>
<body style="background:#000;color:#fff;font:16px system-ui;padding:40px">
<p>Страница переехала: <a href="${target}" style="color:#fff">${url(to)}</a></p>
</body>
</html>
`;
}

function notFound() {
  at(0);
  // 404 открывается по любому адресу, поэтому ссылки в нём от корня сайта
  const html = layout({
    path: '404.html', depth: 0, title: 'Страница не найдена | Академия «Вопреки»', description: 'Такой страницы нет.',
    body: `<section class="art nf"><div class="wrap"><span class="eyebrow">Ошибка 404</span><h1 class="h h1" style="margin:22px 0">Мяч<br><span class="gtext">в ауте</span></h1><p class="lead" style="max-width:520px">Такой страницы нет. Возможно, она переехала — загляните на главную или выберите направление.</p><div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:32px"><a class="btn btn-p" href="./">На главную ${AR}</a>${DIRS.map(k => `<a class="btn btn-o" href="${k}/">${D[k].name}</a>`).join('')}</div></div></section>`
  });
  return html.replace('<head>\n', '<head>\n<base href="/">\n').replace(/<link rel="canonical"[^>]*>\n/, '<meta name="robots" content="noindex">\n');
}

/* =========================================================
   Сборка: список файлов
   ========================================================= */
export function pages() {
  const out = [
    { path: 'index.html', html: home() },
    ...DIRS.map(k => ({ path: `${k}/index.html`, html: directionPage(k) })),
    { path: 'services/index.html', html: servicesPage() },
    { path: 'news/index.html', html: newsPage() },
    ...NEWS.map(n => ({ path: `news/${n.slug}/index.html`, html: newsItem(n) })),
    { path: 'contacts/index.html', html: contactsPage() },
    ...LEGAL.map(l => ({ path: `${l.slug}/index.html`, html: legalPage(l) })),
    { path: '404.html', html: notFound() },
  ];
  const today = new Date().toISOString().slice(0, 10);
  const locs = out.filter(p => p.path !== '404.html').map(p => url(p.path.replace(/index\.html$/, '')));
  for (const [from, to] of Object.entries(REDIRECTS)) out.push({ path: `${from}/index.html`, html: redirectPage(from, to) });
  out.push({ path: 'sitemap.xml', html: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locs.map(l => `  <url><loc>${l}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n` });
  out.push({ path: 'robots.txt', html: `User-agent: *\nAllow: /\n\nSitemap: ${url('sitemap.xml')}\n` });
  return out;
}
