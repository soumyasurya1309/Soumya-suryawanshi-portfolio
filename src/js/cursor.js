/**
 * cursor.js — Custom cursor with magnetic effect and hover state
 * Desktop only (hidden on touch devices via CSS).
 */
export function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.querySelector('.cursor');
  const dot    = document.querySelector('.cursor-dot');
  const ring   = document.querySelector('.cursor-ring');
  if (!cursor || !dot || !ring) return;

  let mx = -100, my = -100; // mouse position
  let rx = -100, ry = -100; // ring position (lagged)

  function update() {
    // Dot follows exactly
    dot.style.left  = `${mx}px`;
    dot.style.top   = `${my}px`;

    // Ring lags behind
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = `${rx}px`;
    ring.style.top  = `${ry}px`;

    requestAnimationFrame(update);
  }

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  // Hover state on interactive elements
  const interactiveSelectors = 'a, button, .skill-pill, .empflow-node, .magnetic-btn, input, textarea, [role="button"]';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactiveSelectors)) cursor.classList.add('hovering');
  }, { passive: true });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactiveSelectors)) cursor.classList.remove('hovering');
  }, { passive: true });

  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

  // ─── Magnetic buttons ───
  document.querySelectorAll('.magnetic-btn').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const strength = 0.28;
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  requestAnimationFrame(update);
}
