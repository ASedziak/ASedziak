/**
 * ALEKSANDRA SĘDZIAK — PORTFOLIO AKADEMICKIE
 * script.js
 *
 * Funkcje:
 *  1. Przełącznik motywu: jasny ↔ kontrastowy (z pamięcią w localStorage)
 *  2. Przełącznik języka: PL ↔ EN (z pamięcią w localStorage)
 *  3. Animacje wejścia sekcji (Intersection Observer)
 *  4. Rok w stopce
 */

/* ─── 1. MOTYW ─── */
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const THEME_KEY = 'as-theme';

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    applyTheme(saved);
    return;
  }
  // Fallback: prefers-color-scheme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'contrast' : 'light');
}

themeToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'light' ? 'contrast' : 'light');
});

initTheme();

/* ─── 2. JĘZYK ─── */
const langToggle = document.getElementById('lang-toggle');
const LANG_KEY = 'as-lang';

/**
 * Iteruje po wszystkich elementach posiadających data-pl / data-en
 * i zamienia textContent na odpowiedni wariant.
 * Użycie atrybutów zamiast ukrytych span-ów zapewnia poprawność SEO
 * przy wybranym języku domyślnym (pl).
 */
function applyLang(lang) {
  html.setAttribute('data-lang', lang);
  localStorage.setItem(LANG_KEY, lang);

  // Przełącz etykietę przycisku
  const langLabel = langToggle?.querySelector('.lang-label');
  if (langLabel) langLabel.textContent = lang === 'pl' ? 'EN' : 'PL';

  // Aktualizuj <title>
  if (lang === 'en') {
    document.title = 'Aleksandra Sędziak — Academic Portfolio';
  } else {
    document.title = 'Aleksandra Sędziak — Portfolio Akademickie';
  }

  // Zamień tekst w każdym elemencie z data-pl / data-en
  const translatables = document.querySelectorAll('[data-pl][data-en]');
  translatables.forEach(el => {
    const text = lang === 'pl' ? el.getAttribute('data-pl') : el.getAttribute('data-en');
    if (text !== null) el.textContent = text;
  });
}

function initLang() {
  const saved = localStorage.getItem(LANG_KEY);
  applyLang(saved || 'pl');
}

langToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-lang') || 'pl';
  applyLang(current === 'pl' ? 'en' : 'pl');
});

initLang();

/* ─── 3. ANIMACJE WEJŚCIA ─── */
function addRevealClasses() {
  const targets = [
    '.hero-text',
    '.hero-photo-wrap',
    '.about-bio',
    '.about-meta',
    '.pub-item',
    '.course-card',
    '.contact-info',
    '.contact-links',
  ];
  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      // Kaskadowe opóźnienie dla elementów tego samego typu
      el.style.transitionDelay = `${i * 80}ms`;
    });
  });
}

function initReveal() {
  addRevealClasses();

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animuj tylko raz
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Uruchom po załadowaniu DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReveal);
} else {
  initReveal();
}

/* ─── 4. ROK W STOPCE ─── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── 5. AKTYWNY LINK W NAWIGACJI (opcjonalnie) ─── */
// Jeśli w przyszłości dodasz linki nawigacyjne do sekcji,
// poniższy kod podświetli aktywną sekcję podczas przewijania.
function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!navLinks.length) return;

  const sections = Array.from(navLinks).map(link =>
    document.querySelector(link.getAttribute('href'))
  ).filter(Boolean);

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          active?.classList.add('active');
        }
      });
    },
    { rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '64px'} 0px -60% 0px` }
  );

  sections.forEach(sec => observer.observe(sec));
}

initActiveNav();
