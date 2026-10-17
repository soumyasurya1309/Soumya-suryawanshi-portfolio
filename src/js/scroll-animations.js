/**
 * scroll-animations.js — Intersection-observer-based reveals + GSAP counters.
 * GSAP + ScrollTrigger used for counter animations and hero parallax.
 * Pure CSS transitions handle the reveal-up / reveal-clip classes.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations(lenis) {
  // Sync Lenis with GSAP ticker
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // ─── Generic reveal observer ───
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-clip');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = el.parentElement?.querySelectorAll('.reveal-up, .reveal-clip');
        let delay = 0;
        if (siblings) {
          let idx = 0;
          siblings.forEach((s, i) => { if (s === el) idx = i; });
          delay = idx * 80;
        }
        setTimeout(() => el.classList.add('visible'), delay);
        revealObs.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObs.observe(el));

  // ─── Hero parallax ───
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: self => {
        const p = self.progress;
        gsap.set(heroContent, {
          y: p * 80,
          opacity: 1 - p * 0.8,
        });
      },
    });
  }

  // ─── Number counters ───
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target || 0);
    const suffix = el.dataset.suffix || '';
    const isDecimal = !Number.isInteger(target);
    const duration = 1.6;

    gsap.fromTo({ val: 0 }, { val: target }, {
      duration,
      ease: 'power2.out',
      onUpdate: function() {
        const v = this.targets()[0].val;
        el.textContent = (isDecimal
          ? v.toFixed(1)
          : Math.round(v).toLocaleString()
        ) + suffix;
      },
      onComplete: () => {
        el.textContent = (isDecimal
          ? target.toFixed(1)
          : target.toLocaleString()
        ) + suffix;
      },
    });
  }

  const counterEls = document.querySelectorAll('.counter[data-target]');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObs.observe(el));

  // ─── Patent copy button ───
  const copyBtn = document.getElementById('patent-copy-btn');
  const copyLabel = document.getElementById('patent-copy-label');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const text = copyBtn.dataset.copy || '';
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.classList.add('copied');
        if (copyLabel) copyLabel.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (copyLabel) copyLabel.textContent = 'Copy Application No.';
        }, 2200);
      } catch {
        if (copyLabel) copyLabel.textContent = 'Copy failed';
        setTimeout(() => {
          if (copyLabel) copyLabel.textContent = 'Copy Application No.';
        }, 2000);
      }
    });
  }

  // ─── Hero badge counters (start on page load after animation) ───
  const badgeVals = document.querySelectorAll('.hero-badge-val[data-count]');
  badgeVals.forEach(el => {
    const target = parseFloat(el.dataset.count || 0);
    const suffix = el.dataset.suffix || '';
    setTimeout(() => {
      gsap.fromTo({ val: 0 }, { val: target }, {
        duration: 1.5,
        ease: 'power2.out',
        delay: 1.0,
        onUpdate: function() {
          el.textContent = Math.round(this.targets()[0].val) + suffix;
        },
        onComplete: () => { el.textContent = target + suffix; },
      });
    }, 200);
  });
}
