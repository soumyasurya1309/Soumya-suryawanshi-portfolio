/**
 * nav.js — Navigation: scroll behaviour, section-aware active state,
 *           mobile hamburger menu, scroll progress indicator.
 */
export function initNav() {
  const header    = document.querySelector('.site-header');
  const navLinks  = document.querySelectorAll('.nav-link');
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu   = document.getElementById('nav-menu');
  const progress  = document.querySelector('.scroll-progress');
  const sections  = document.querySelectorAll('section[id]');

  if (!header) return;

  // ─── Scroll: header background + progress bar ───
  function onScroll() {
    const sy = window.scrollY;

    // Header scroll state
    if (sy > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll progress
    if (progress) {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (sy / total) * 100 : 0;
      progress.style.width = `${pct}%`;
    }

    // Active section detection
    let currentSection = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 0) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(link => {
      const target = link.dataset.section;
      link.classList.toggle('active', target === currentSection);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial call

  // ─── Mobile hamburger ───
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on nav link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!header.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ─── Smooth nav link scrolling ───
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
