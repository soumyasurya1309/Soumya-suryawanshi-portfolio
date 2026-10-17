/**
 * main.js — Portfolio entry point (JS only).
 * Fonts + CSS are loaded via <link> tags in index.html (processed by Vite HTML plugin).
 * This file handles: Lenis smooth scroll, all interactive JS modules.
 */

// ─── Lenis smooth scroll ───
import Lenis from 'lenis';

// ─── Modules ───
import { initCanvasBg }          from './js/canvas-bg.js';
import { initCursor }            from './js/cursor.js';
import { initNav }               from './js/nav.js';
import { initScrollAnimations }  from './js/scroll-animations.js';
import { initEmpflowDiagram }    from './js/empflow-diagram.js';
import { initManetTopology }     from './js/manet-topology.js';
import { initFakenewsPipeline, initFacerecogPipeline } from './js/pipelines.js';
import { initSkillsMap }         from './js/skills-map.js';

// ─── Lenis setup (wrapped so any error doesn't break the page) ───
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;
if (!prefersReducedMotion) {
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
  } catch (e) {
    console.warn('[Lenis] init failed, falling back to native scroll:', e);
  }
}

// ─── Boot all modules after DOM is ready ───
document.addEventListener('DOMContentLoaded', () => {
  initCanvasBg();
  initCursor();
  initNav();
  initScrollAnimations(lenis);

  initEmpflowDiagram();
  initManetTopology();
  initFakenewsPipeline();
  initFacerecogPipeline();
  initSkillsMap();

  // Set hero background — use real image (now exists), dev fallback is in CSS
  const heroSection = document.querySelector('.section-hero');
  if (heroSection) {
    heroSection.style.backgroundImage = "url('/images/hero-bg.jpg')";
  }
});

// Lenis RAF is driven by gsap.ticker inside initScrollAnimations() — no separate loop needed.
