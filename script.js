/* ============================================================
   NOHEA MEDIA — script.js
   One small library (Lenis, vendored) for weighted scrolling on desktop.
   Everything here is optional: without it the page shows every film,
   still and line in its finished state.
   ============================================================ */

'use strict';

window.__noheaReady = true;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const desktop = window.matchMedia('(min-width: 900px)');

/* ---------- footer year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- split text so it can arrive like a focus pull ---------- */
function splitChars(el, start) {
  const text = el.textContent;
  el.textContent = '';
  [...text].forEach((ch, i) => {
    const s = document.createElement('span');
    s.className = 'ch';
    s.textContent = ch;
    s.style.setProperty('--c', start + i);
    el.appendChild(s);
  });
  return start + text.length;
}
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  words.forEach((w, i) => {
    const s = document.createElement('span');
    s.className = 'wd';
    s.textContent = w;
    s.style.setProperty('--w', i);
    el.appendChild(s);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
}
if (!reduceMotion) {
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    heroName.setAttribute('aria-label', heroName.textContent.replace(/\s+/g, ' ').trim());
    let n = 0;
    heroName.querySelectorAll('[data-split="chars"]').forEach(line => {
      line.setAttribute('aria-hidden', 'true');
      n = splitChars(line, n);
    });
  }
  document.querySelectorAll('.reveal-head').forEach(h => {
    const line = h.querySelector('.line');
    if (!line) return;
    h.setAttribute('aria-label', line.textContent.trim());
    line.setAttribute('aria-hidden', 'true');
    splitWords(line);
  });
}

/* ---------- load sequence ---------- */
requestAnimationFrame(() => {
  requestAnimationFrame(() => document.body.classList.add('is-loaded'));
});

/* ---------- phone menu ---------- */
const menuBtn = document.getElementById('menuBtn');
const siteNav = document.getElementById('siteNav');

function setMenu(open) {
  siteNav.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? 'Close' : 'Menu';
  document.body.style.overflow = open ? 'hidden' : '';
  if (window.lenis) open ? window.lenis.stop() : window.lenis.start();
}
if (menuBtn && siteNav) {
  menuBtn.addEventListener('click', () => setMenu(!siteNav.classList.contains('is-open')));
  siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && siteNav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  });
}

/* ---------- current section in the nav ---------- */
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => {
      if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => navObserver.observe(s));

/* ---------- entrances: each section's parts arrive in reading order ---------- */
function stagger(selector, step) {
  document.querySelectorAll(selector).forEach(group => {
    group.querySelectorAll(':scope .reveal, :scope .still').forEach((el, i) => {
      el.style.setProperty('--d', `${Math.min(i, 8) * step}ms`);
    });
  });
}
stagger('.films-index', 70);
stagger('.about-text', 90);
stagger('.contact-text', 90);
document.querySelectorAll('.track').forEach((track, t) => {
  track.querySelectorAll('.still').forEach((el, i) => el.style.setProperty('--d', `${t * 120 + i * 60}ms`));
});

const revealTargets = document.querySelectorAll('.reveal, .reveal-head, .reveal-picture, .still, .contact-form-wrap');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach(el => el.classList.add('is-in'));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  revealTargets.forEach(el => revealObserver.observe(el));
}

/* ============================================================
   FILMS
   Desktop: the list is the index and the stage shows the chosen film.
   Phone: every film plays in its own frame.
   ============================================================ */
const films = [...document.querySelectorAll('.film')];
const filmsSection = document.getElementById('films');
const stage = document.getElementById('filmStage');
const stageScreen = stage && stage.querySelector('.stage-screen');
const posterA = stage && stage.querySelector('.stage-poster');
const posterB = stage && stage.querySelector('.stage-poster-next');
const stagePlay = stage && stage.querySelector('.play');
const stageTitle = stage && stage.querySelector('.stage-title');
const stageMeta = stage && stage.querySelector('.stage-meta');
let current = null;
let crossfadeTimer = 0;

function posterFor(film) {
  return film.querySelector('.film-media img').getAttribute('src');
}

function embed(film) {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${film.dataset.videoId}?autoplay=1&rel=0&playsinline=1`;
  iframe.title = film.dataset.title;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  return iframe;
}

function stopStage() {
  if (!stageScreen) return;
  stageScreen.querySelectorAll('iframe').forEach(f => f.remove());
  stageScreen.classList.remove('is-playing', 'is-tall-playing');
}

function select(film) {
  if (!stage || film === current) return;
  current = film;
  films.forEach(f => f.classList.toggle('is-current', f === film));
  stopStage();
  stageScreen.dataset.shape = film.dataset.shape;
  stageTitle.textContent = film.dataset.title;
  stageMeta.textContent = film.dataset.meta;
  stagePlay.setAttribute('aria-label', `Play ${film.dataset.title}`);

  const src = posterFor(film);
  if (reduceMotion || !posterA.getAttribute('src')) {
    posterA.src = src;
    return;
  }
  // slow crossfade: the next poster fades in over the current one, then takes its place
  clearTimeout(crossfadeTimer);
  posterB.classList.remove('is-in');
  posterB.src = src;
  const show = () => {
    requestAnimationFrame(() => posterB.classList.add('is-in'));
    crossfadeTimer = setTimeout(() => {
      posterA.src = src;
      posterB.classList.remove('is-in');
    }, 1700);
  };
  if (posterB.complete) show(); else posterB.addEventListener('load', show, { once: true });
}

function playOnStage() {
  if (!current) return;
  stopStage();
  stageScreen.appendChild(embed(current));
  stageScreen.classList.add('is-playing');
  if (current.dataset.shape === 'tall') stageScreen.classList.add('is-tall-playing');
}

function playInline(film) {
  const media = film.querySelector('.film-media');
  if (media.querySelector('iframe')) return;
  films.forEach(f => {
    const fr = f.querySelector('.film-media iframe');
    if (fr && f !== film) { fr.remove(); f.querySelector('.film-media').classList.remove('is-playing'); }
  });
  media.appendChild(embed(film));
  media.classList.add('is-playing');
}

// phone play buttons on every frame
films.forEach(film => {
  const media = film.querySelector('.film-media');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'play';
  btn.setAttribute('aria-label', `Play ${film.dataset.title}`);
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>';
  btn.addEventListener('click', () => playInline(film));
  media.appendChild(btn);

  const pick = film.querySelector('.film-pick');
  pick.addEventListener('click', () => {
    if (desktop.matches && stage) { select(film); playOnStage(); }
    else playInline(film);
  });
  if (finePointer) pick.addEventListener('mouseenter', () => { if (desktop.matches && !stageScreen.classList.contains('is-playing')) select(film); });
  pick.addEventListener('focus', () => { if (desktop.matches && !stageScreen.classList.contains('is-playing')) select(film); });
});

if (stage) {
  stagePlay.addEventListener('click', playOnStage);
  stage.hidden = false;
  filmsSection.classList.add('has-stage');
  select(films[0]);
  desktop.addEventListener('change', () => { stopStage(); films.forEach(f => {
    const fr = f.querySelector('.film-media iframe'); if (fr) fr.remove();
  }); });
}

/* ============================================================
   STILLS: the one light
   The frame under the pointer, or nearest the middle of the screen,
   is lit. Everything else waits in the dark.
   ============================================================ */
const wall = document.querySelector('.wall');
// fix each frame to its picture's shape so the picture can slide inside it
document.querySelectorAll('.still img').forEach(img => {
  const w = +img.getAttribute('width'), h = +img.getAttribute('height');
  if (w && h) img.parentElement.style.setProperty('--ar', `${w} / ${h}`);
});
const stills = [...document.querySelectorAll('.still')];
let hovered = null;
let ticking = false;

function light(target) {
  stills.forEach(s => s.classList.toggle('is-lit', s === target));
}

function lightNearestCentre() {
  ticking = false;
  if (hovered) return;
  const mid = window.innerHeight / 2;
  let best = null, bestDist = Infinity;
  stills.forEach(s => {
    const r = s.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    const d = Math.abs((r.top + r.bottom) / 2 - mid);
    if (d < bestDist) { bestDist = d; best = s; }
  });
  light(best);
}

if (wall && stills.length) {
  wall.classList.add('is-lighting');
  lightNearestCentre();
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(lightNearestCentre); }
  }, { passive: true });
  window.addEventListener('resize', lightNearestCentre, { passive: true });
  stills.forEach(s => {
    s.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hovered = s; light(s); } });
    s.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { hovered = null; lightNearestCentre(); } });
    s.querySelector('.still-open').addEventListener('focus', () => { hovered = s; light(s); });
    s.querySelector('.still-open').addEventListener('blur', () => { hovered = null; lightNearestCentre(); });
  });
}

/* ---------- viewer ---------- */
const viewer = document.getElementById('viewer');
const viewerImg = viewer && viewer.querySelector('.viewer-img');
const viewerCaption = viewer && viewer.querySelector('.viewer-caption');
let viewing = 0;
let opener = null;

function showStill(i) {
  viewing = (i + stills.length) % stills.length;
  const img = stills[viewing].querySelector('img');
  viewerImg.src = img.getAttribute('src');
  viewerImg.alt = img.alt;
  viewerCaption.textContent = stills[viewing].querySelector('figcaption').textContent;
}

if (viewer && typeof viewer.showModal === 'function') {
  stills.forEach((s, i) => {
    s.querySelector('.still-open').addEventListener('click', e => {
      opener = e.currentTarget;
      showStill(i);
      viewer.showModal();
      if (window.lenis) window.lenis.stop();
    });
  });
  viewer.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => showStill(viewing + Number(b.dataset.step))));
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', e => { if (e.target === viewer) viewer.close(); });
  viewer.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') showStill(viewing + 1);
    if (e.key === 'ArrowLeft') showStill(viewing - 1);
  });
  viewer.addEventListener('close', () => {
    if (window.lenis) window.lenis.start();
    if (opener) opener.focus({ preventScroll: true });
  });
  let startX = null;
  viewer.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) showStill(viewing + (dx < 0 ? 1 : -1));
    startX = null;
  });
}

/* ============================================================
   CONTACT FORM (Web3Forms)
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm && formSuccess) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        contactForm.hidden = true;
        formSuccess.hidden = false;
      } else {
        throw new Error(data.message || 'Form submission failed');
      }
    } catch (err) {
      console.error('[Nohea Media] Form error:', err);
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      alert('Message could not be sent. Please email bradendimauro@gmail.com directly.');
    }
  });
}

/* ============================================================
   WEIGHT AND DEPTH
   Weighted scrolling on desktop (phones keep their own momentum),
   parallax driven from one animation frame, magnetic buttons.
   ============================================================ */
if (!reduceMotion) {
  if (finePointer && typeof Lenis !== 'undefined') {
    window.lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, anchors: true, autoRaf: false });
  }

  const vh = () => window.innerHeight;
  const hero = document.querySelector('.hero');
  const heroCopy = document.querySelector('[data-parallax-hero="copy"]');
  const heroReel = document.querySelector('[data-parallax-hero="reel"]');

  // things that drift at their own speed: [element, reference element, speed]
  let layers = [];
  // pictures that slide inside their frames: [img, frame]
  let insets = [];

  function absTop(el) {
    let y = 0;
    for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
    return y;
  }
  function measure() {
    const wide = desktop.matches;
    layers = [...document.querySelectorAll('[data-parallax]')]
      .filter(() => wide)
      .map(el => ({ el, ref: el.parentElement, speed: parseFloat(el.dataset.parallax) || 0 }))
      .filter(l => l.speed !== 0)
      .map(l => ({ ...l, top: absTop(l.ref), h: l.ref.offsetHeight }));
    insets = [...document.querySelectorAll('.still img, .about-portrait img')]
      .map(img => { const f = img.parentElement; return { img, top: absTop(f), h: f.offsetHeight }; });
    document.querySelectorAll('[data-parallax]').forEach(el => { if (!wide) el.style.translate = ''; });
  }

  let lastY = -1;
  function frame(time) {
    if (window.lenis) window.lenis.raf(time);
    const y = window.lenis ? window.lenis.animatedScroll : window.scrollY;
    if (y !== lastY) {
      lastY = y;
      const h = vh();
      // hero: the name lifts away faster than the reel, which lags behind
      if (hero && y < h * 1.4) {
        if (heroCopy) heroCopy.style.translate = `0 ${(-y * 0.18).toFixed(1)}px`;
        if (heroReel && desktop.matches) heroReel.style.translate = `0 ${(y * 0.22).toFixed(1)}px`;
        else if (heroReel) heroReel.style.translate = `0 ${(y * 0.35).toFixed(1)}px`;
      }
      // columns drifting at different speeds
      for (const l of layers) {
        const offset = (l.top + l.h / 2) - (y + h / 2);
        if (Math.abs(offset) > l.h + h) continue;
        l.el.style.translate = `0 ${(-offset * l.speed).toFixed(1)}px`;
      }
      // pictures sliding inside their frames
      for (const p of insets) {
        const offset = (p.top + p.h / 2) - (y + h / 2);
        if (Math.abs(offset) > p.h + h) continue;
        const t = Math.max(-1, Math.min(1, offset / (h * 0.9)));
        p.img.style.translate = `0 ${(t * 4).toFixed(2)}%`;
      }
    }
    requestAnimationFrame(frame);
  }

  measure();
  window.addEventListener('resize', () => { measure(); lastY = -1; }, { passive: true });
  window.addEventListener('load', () => { measure(); lastY = -1; });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); lastY = -1; });
  requestAnimationFrame(frame);

  // magnetic pull on the main actions
  if (finePointer) {
    document.querySelectorAll('.btn, .play').forEach(el => {
      let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
      const tick = () => {
        x += (tx - x) * 0.16;
        y += (ty - y) * 0.16;
        el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
        if (Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05) raf = requestAnimationFrame(tick);
        else raf = 0;
      };
      const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) * 0.28;
        ty = (e.clientY - (r.top + r.height / 2)) * 0.32;
        kick();
      });
      el.addEventListener('pointerleave', () => { tx = 0; ty = 0; kick(); });
    });
  }
}
