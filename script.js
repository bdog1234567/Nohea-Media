/* ============================================================
   NOHEA MEDIA — script.js
   ============================================================ */

'use strict';

const isTouchDevice = 'ontouchstart' in window;
const reduceMotion  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis;
let scrollNormalizer;

/* === Footer year === */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* === Scroll progress bar === */
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    scrollProgress.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
}

/* === Tap ripple (mobile) === */
if (isTouchDevice && !reduceMotion) {
  document.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    const ripple = document.createElement('div');
    ripple.className = 'tap-ripple';
    ripple.style.left = touch.clientX + 'px';
    ripple.style.top = touch.clientY + 'px';
    ripple.style.width = '52px';
    ripple.style.height = '52px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, { passive: true });
}

/* === Preloader === */
const preloader = document.getElementById('preloader');
if (preloader) {
  const hidePreloader = () => preloader.classList.add('fade-out');
  window.addEventListener('load', () => setTimeout(hidePreloader, 100));
  // Safety net: on a slow connection never hold a black screen for more than 2.5s
  setTimeout(hidePreloader, 2500);
}

/* ============================================================
   GSAP + LENIS SETUP
   ============================================================ */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reduceMotion) {

gsap.registerPlugin(ScrollTrigger);

if (!isTouchDevice && typeof Lenis !== 'undefined') {
  lenis = new Lenis({ anchors: true });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
} else {
  scrollNormalizer = ScrollTrigger.normalizeScroll(true);
}

/* Utility: split element text into word spans for animation.
   Keeps any <br> line breaks written into the title. */
function splitWords(el) {
  const lines = el.innerHTML.split(/<br\s*\/?>/i);
  el.innerHTML = lines.map(line =>
    line.trim().split(/\s+/).filter(Boolean).map(word =>
      `<span style="display:inline-block;overflow:hidden"><span class="word-inner" style="display:inline-block">${word}</span></span>`
    ).join(' ')
  ).join('<br>');
  return el.querySelectorAll('.word-inner');
}

/* ============================================================
   HERO ENTRANCE ANIMATION
   ============================================================ */
const heroTl = gsap.timeline({ delay: 0.3 });

heroTl
  .fromTo('.hero-label',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
  .fromTo('.hero-logo',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.45')
  .fromTo('.hero-title',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.65')
  .fromTo('.hero-divider',
    { opacity: 0, scaleX: 0 },
    { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power3.out' }, '-=0.6')
  .fromTo('.hero-name',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.35')
  .fromTo('.hero-tagline',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.35')
  .fromTo('.hero-actions',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.35')
  .fromTo('.hero-scroll',
    { opacity: 0 },
    { opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.2');

/* ============================================================
   SCROLL-TRIGGERED ANIMATIONS
   ============================================================ */

/* Section titles — word-by-word reveal */
document.querySelectorAll('.section-title').forEach(title => {
  const words = splitWords(title);
  gsap.from(words, {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: title,
      start: 'top 85%',
      once: true,
    },
  });
});

/* Section labels — fade in */
document.querySelectorAll('.section-label').forEach(label => {
  gsap.from(label, {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: label,
      start: 'top 85%',
      once: true,
    },
  });
});

/* Portfolio cards — staggered fade up */
gsap.from('.portfolio-card', {
  y: 40,
  opacity: 0,
  duration: 0.7,
  stagger: 0.1,
  ease: 'power3.out',
  clearProps: 'transform',
  scrollTrigger: {
    trigger: '.portfolio-grid',
    start: 'top 85%',
    once: true,
  },
});

/* Portfolio filters — fade in */
gsap.from('.portfolio-filters', {
  y: 20,
  opacity: 0,
  duration: 0.6,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.portfolio-filters',
    start: 'top 85%',
    once: true,
  },
});

/* About section — sequential reveal */
const aboutElements = document.querySelectorAll('.about-content > *');
gsap.from(aboutElements, {
  y: 30,
  opacity: 0,
  duration: 0.6,
  stagger: 0.15,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.about-content',
    start: 'top 85%',
    once: true,
  },
});

/* About image — fade in */
gsap.from('.about-image', {
  y: 30,
  opacity: 0,
  duration: 0.7,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.about-image',
    start: 'top 85%',
    once: true,
  },
});

/* Contact info — fade up */
gsap.from('.contact-info > *', {
  y: 30,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.contact-info',
    start: 'top 85%',
    once: true,
  },
});

/* Contact form — fade up */
gsap.from('.contact-form-wrapper', {
  y: 30,
  opacity: 0,
  duration: 0.6,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.contact-form-wrapper',
    start: 'top 85%',
    once: true,
  },
});

/* ============================================================
   HERO PARALLAX
   ============================================================ */
/* Video pans from top to bottom as you scroll through the hero */
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  const videoPos = { val: 10 };
  gsap.to(videoPos, {
    val: 90,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    onUpdate() {
      heroVideo.style.objectPosition = `center ${videoPos.val}%`;
    },
  });
}

gsap.to('.hero-content', {
  yPercent: 55,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  });
});

} else {
  /* GSAP not available, or reduced motion is on — just show the hero content */
  document.querySelectorAll('.hero-content > *, .hero-scroll').forEach(el => {
    el.style.opacity = '1';
  });
}

/* ============================================================
   MARQUEE — repeat the text to fill the screen, loop seamlessly
   ============================================================ */
const marqueeTrack = document.querySelector('.marquee-track');
const marqueeGroup = marqueeTrack?.querySelector('.marquee-group');

if (marqueeTrack && marqueeGroup) {
  const MARQUEE_SPEED = 28; // px per second
  let marqueeAnim;
  let marqueeGroupWidth = 0;

  const buildMarquee = () => {
    const groupWidth = marqueeGroup.getBoundingClientRect().width;
    if (!groupWidth) return;

    // Enough copies to cover the screen plus one to scroll into
    const copies = Math.ceil(window.innerWidth / groupWidth) + 1;
    while (marqueeTrack.children.length < copies) {
      marqueeTrack.appendChild(marqueeGroup.cloneNode(true));
    }

    // Only restart the loop if the text width changed (fonts loaded, etc.)
    if (reduceMotion || !marqueeTrack.animate || groupWidth === marqueeGroupWidth) return;
    marqueeGroupWidth = groupWidth;
    marqueeAnim?.cancel();
    marqueeAnim = marqueeTrack.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(-${groupWidth}px)` }],
      { duration: (groupWidth / MARQUEE_SPEED) * 1000, iterations: Infinity }
    );
  };

  buildMarquee();
  document.fonts?.ready.then(buildMarquee);
  let marqueeResize;
  window.addEventListener('resize', () => {
    clearTimeout(marqueeResize);
    marqueeResize = setTimeout(buildMarquee, 200);
  });
}

/* ============================================================
   NAVBAR — transparent → frosted glass on scroll
   ============================================================ */
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run once on load

/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on any nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ============================================================
   PORTFOLIO — category filter
   ============================================================ */
const filterBtns    = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

// Centre the last card when an odd number are showing
function markOrphanCard() {
  const visible = [...portfolioCards].filter(c => !c.classList.contains('hidden'));
  portfolioCards.forEach(c => c.classList.remove('is-orphan'));
  if (visible.length > 1 && visible.length % 2 === 1) {
    visible[visible.length - 1].classList.add('is-orphan');
  }
  return visible;
}
markOrphanCard();

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-pressed', String(b === btn));
    });

    const filter = btn.dataset.filter;

    portfolioCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });

    const visible = markOrphanCard();
    if (typeof gsap !== 'undefined' && !reduceMotion) {
      gsap.fromTo(visible,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'power3.out', overwrite: true, clearProps: 'transform' });
    }
  });
});

/* ============================================================
   PORTFOLIO — YouTube thumbnails
   ============================================================ */
const hasVideoId = id => id && id !== 'YOUTUBE_VIDEO_ID';

portfolioCards.forEach(card => {
  const videoId  = (card.dataset.videoId || '').trim();
  const thumbImg = card.querySelector('.thumb-img');

  // Load YouTube thumbnail only when videoId is real
  if (hasVideoId(videoId)) {
    // Try maxresdefault, fall back to hqdefault. YouTube answers a missing
    // maxres with a tiny 120px grey placeholder, so check the size too.
    const hq = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const max = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const useHq = () => { if (thumbImg.src !== hq) thumbImg.src = hq; };

    thumbImg.addEventListener('error', () => {
      // Both failed (e.g. YouTube blocked on the viewer's network) — show the plain card
      if (thumbImg.src === hq) thumbImg.style.visibility = 'hidden';
      else useHq();
    });
    thumbImg.addEventListener('load', () => { if (thumbImg.naturalWidth <= 120) useHq(); });
    thumbImg.src = max;
    thumbImg.alt = card.querySelector('.card-title')?.textContent || 'Video';
  }

  // The whole card opens the video (the play button bubbles up to here too)
  card.addEventListener('click', () => openVideo(card));
});

/* ============================================================
   VIDEO LIGHTBOX — plays the YouTube embed large, over the page
   ============================================================ */
const lightbox      = document.getElementById('lightbox');
const lightboxFrame = lightbox?.querySelector('.lightbox-frame');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
const lightboxPanel = lightbox?.querySelector('.lightbox-inner');
let lightboxReturnFocus = null;
let lightboxHideTimer;

function openVideo(card) {
  const videoId = (card.dataset.videoId || '').trim();
  if (!lightbox) return;
  if (!hasVideoId(videoId)) {
    // Guide the user if they haven't set a video ID yet
    console.warn('[Nohea Media] Replace YOUTUBE_VIDEO_ID in index.html with your actual YouTube video ID.');
    return;
  }

  const title = card.querySelector('.card-title')?.textContent || 'Video';
  lightboxReturnFocus = card.querySelector('.play-btn');
  lightboxTitle.textContent = title;
  lightbox.classList.toggle('is-portrait', card.dataset.format === 'portrait');

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&color=white&playsinline=1`;
  iframe.title = title;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  lightboxFrame.replaceChildren(iframe);

  clearTimeout(lightboxHideTimer);
  lightbox.hidden = false;
  void lightbox.offsetWidth; // let the browser paint the start state so the fade-in runs
  lightbox.classList.add('is-open');

  // Freeze the page behind the video
  document.body.style.overflow = 'hidden';
  lenis?.stop();
  scrollNormalizer?.disable();

  // Focus the panel (Escape works, next Tab lands on the close button)
  lightboxPanel.focus({ preventScroll: true });
}

const lightboxIsOpen = () => !!lightbox?.classList.contains('is-open');

function closeVideo() {
  if (!lightboxIsOpen()) return;
  lightbox.classList.remove('is-open');
  lightboxFrame.replaceChildren(); // removing the iframe stops playback
  lightboxHideTimer = setTimeout(() => { lightbox.hidden = true; }, reduceMotion ? 0 : 350);

  document.body.style.overflow = '';
  lenis?.start();
  scrollNormalizer?.enable();

  lightboxReturnFocus?.focus({ preventScroll: true });
}

if (lightbox) {
  lightbox.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeVideo));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightboxIsOpen()) closeVideo();
  });

  // Keep keyboard focus inside the lightbox while it's open
  document.addEventListener('focusin', e => {
    if (lightboxIsOpen() && !lightbox.contains(e.target)) lightboxClose.focus({ preventScroll: true });
  });
}

/* ============================================================
   CONTACT FORM
   Uses Web3Forms (https://web3forms.com — free, emails directly)
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

if (contactForm && formSuccess) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.form-submit');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    if (formError) formError.hidden = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' },
      });

      const data = await response.json();

      if (data.success) {
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
      } else {
        throw new Error(data.message || 'Form submission failed');
      }
    } catch (err) {
      console.error('[Nohea Media] Form error:', err);
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      if (formError) formError.hidden = false;
    }
  });
}

/* ============================================================
   SMOOTH ACTIVE SECTION HIGHLIGHT (optional nav highlight)
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0, rootMargin: '-30% 0px -30% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const cursorRing = document.getElementById('cursor-ring');
const hoverTargets = 'a, button, [role="button"], .portfolio-card, .filter-btn';

if (cursorRing && typeof gsap !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0;

  // Only now hide the native cursor (see style.css)
  document.documentElement.classList.add('has-custom-cursor');

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursorRing, {
      x: mouseX,
      y: mouseY,
      duration: 0.12,
      ease: 'power2.out',
      opacity: 1,
    });
  });

  // Delegated, so it also covers elements added later (e.g. the lightbox)
  document.addEventListener('mouseover', e => {
    // Over a YouTube player the video shows its own cursor — hide the ring
    if (e.target.tagName === 'IFRAME') {
      gsap.to(cursorRing, { opacity: 0, duration: 0.2 });
      return;
    }
    cursorRing.classList.toggle('is-hovering', !!e.target.closest(hoverTargets));
  });

  document.addEventListener('mouseleave', () => {
    gsap.to(cursorRing, { opacity: 0, duration: 0.2 });
  });
  document.addEventListener('mouseenter', () => {
    gsap.to(cursorRing, { opacity: 1, duration: 0.2 });
  });
}
