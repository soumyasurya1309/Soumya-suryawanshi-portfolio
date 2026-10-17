/**
 * canvas-bg.js — Live animated background
 * Nodes drift, connections form/dissolve, signal pulses travel along links.
 * Section-aware mood system, pointer parallax, reduced-motion support.
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => window.innerWidth < 768;

// Section mood config
const MOODS = {
  hero:            { density: 60,  speed: 0.5, opacity: 0.7,  accentFreq: 0.06, pulseSpeed: 1.2 },
  about:           { density: 35,  speed: 0.3, opacity: 0.5,  accentFreq: 0.03, pulseSpeed: 0.8 },
  experience:      { density: 45,  speed: 0.4, opacity: 0.55, accentFreq: 0.04, pulseSpeed: 1.0 },
  projects:        { density: 70,  speed: 0.6, opacity: 0.65, accentFreq: 0.07, pulseSpeed: 1.4 },
  skills:          { density: 80,  speed: 0.45, opacity: 0.6, accentFreq: 0.08, pulseSpeed: 1.1 },
  certifications:  { density: 30,  speed: 0.3, opacity: 0.45, accentFreq: 0.03, pulseSpeed: 0.7 },
  contact:         { density: 25,  speed: 0.25, opacity: 0.4, accentFreq: 0.02, pulseSpeed: 0.6 },
};

const DEFAULT_MOOD = MOODS.hero;

export function initCanvasBg() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  // Bail early with static frame for reduced-motion
  if (prefersReducedMotion) {
    drawStaticFrame(canvas);
    return;
  }

  const ctx = canvas.getContext('2d');
  let W, H;
  let nodes = [];
  let pulses = [];
  let mouse = { x: -9999, y: -9999 };
  let currentMood = { ...DEFAULT_MOOD };
  let targetMood = { ...DEFAULT_MOOD };
  let raf;
  let hidden = false;

  const MAX_DIST = 180;
  const MOBILE_DENSITY_SCALE = 0.45;

  // ─── Setup ───
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildNodes();
  }

  function buildNodes() {
    const count = isMobile()
      ? Math.floor(currentMood.density * MOBILE_DENSITY_SCALE)
      : currentMood.density;

    nodes = Array.from({ length: count }, () => ({
      x:   Math.random() * W,
      y:   Math.random() * H,
      vx:  (Math.random() - 0.5) * currentMood.speed,
      vy:  (Math.random() - 0.5) * currentMood.speed,
      r:   Math.random() * 2 + 1,
      life: 1,
    }));
    pulses = [];
  }

  // ─── Mood lerp ───
  function lerpMood(dt) {
    const t = 1 - Math.exp(-dt * 0.004);
    for (const key of ['density','speed','opacity','accentFreq','pulseSpeed']) {
      currentMood[key] += (targetMood[key] - currentMood[key]) * t;
    }
  }

  // ─── Pulse creation ───
  function maybeAddPulse() {
    if (nodes.length < 2) return;
    if (Math.random() > currentMood.accentFreq) return;
    if (pulses.length > 12) return;

    const a = nodes[Math.floor(Math.random() * nodes.length)];
    // Find a neighbour within range
    const candidates = nodes.filter(n => {
      if (n === a) return false;
      const dx = n.x - a.x, dy = n.y - a.y;
      return Math.sqrt(dx*dx + dy*dy) < MAX_DIST;
    });
    if (!candidates.length) return;
    const b = candidates[Math.floor(Math.random() * candidates.length)];
    pulses.push({ a, b, t: 0, speed: 0.008 * currentMood.pulseSpeed });
  }

  // ─── Draw frame ───
  function draw(ts) {
    if (hidden) return;
    ctx.clearRect(0, 0, W, H);

    lerpMood(16);

    const baseAlpha = currentMood.opacity;

    // Update nodes
    for (const n of nodes) {
      // Drift
      n.x += n.vx;
      n.y += n.vy;

      // Pointer parallax — slight pull toward mouse
      const dx = mouse.x - n.x, dy = mouse.y - n.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.015;
        n.vx += dx * force;
        n.vy += dy * force;
      }

      // Damping
      n.vx *= 0.99;
      n.vy *= 0.99;

      // Wrap around edges
      if (n.x < -20) n.x = W + 20;
      if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20;
      if (n.y > H + 20) n.y = -20;
    }

    // Draw connections
    ctx.lineWidth = 0.5;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d > MAX_DIST) continue;
        const alpha = (1 - d / MAX_DIST) * 0.25 * baseAlpha;
        ctx.strokeStyle = `rgba(40, 100, 60, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }

    // Draw nodes
    for (const n of nodes) {
      const alpha = 0.5 * baseAlpha;
      ctx.fillStyle = `rgba(80, 160, 100, ${alpha})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Update + draw pulses
    maybeAddPulse();
    pulses = pulses.filter(p => {
      p.t += p.speed;
      if (p.t >= 1) return false;

      // Interpolate position along the connection
      const px = p.a.x + (p.b.x - p.a.x) * p.t;
      const py = p.a.y + (p.b.y - p.a.y) * p.t;

      // Glow
      const grd = ctx.createRadialGradient(px, py, 0, px, py, 8);
      grd.addColorStop(0, `rgba(184, 240, 67, ${0.9 * baseAlpha})`);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();

      // Core dot
      ctx.fillStyle = `rgba(184, 240, 67, ${baseAlpha})`;
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();

      return true;
    });

    raf = requestAnimationFrame(draw);
  }

  // ─── Section mood switching ───
  function setMood(sectionId) {
    const mood = MOODS[sectionId] || DEFAULT_MOOD;
    targetMood = { ...mood };
  }

  function initSectionObserver() {
    const sections = document.querySelectorAll('section[id], #hero');
    const observer = new IntersectionObserver(entries => {
      // Find which section is most visible
      let maxRatio = 0, bestId = 'hero';
      for (const entry of entries) {
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          bestId = entry.target.id;
        }
      }
      if (maxRatio > 0.15) setMood(bestId);
    }, { threshold: [0.15, 0.4, 0.7] });

    sections.forEach(s => observer.observe(s));
  }

  // ─── Pointer tracking ───
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('touchmove', e => {
    if (e.touches.length) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  // ─── Visibility / tab focus ───
  document.addEventListener('visibilitychange', () => {
    hidden = document.hidden;
    if (!hidden) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    }
  });

  // ─── Resize (debounced) ───
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  }, { passive: true });

  // ─── Boot ───
  resize();
  initSectionObserver();
  raf = requestAnimationFrame(draw);

  return { setMood };
}

function drawStaticFrame(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const W = canvas.width, H = canvas.height;
  ctx.strokeStyle = 'rgba(40,100,60,0.15)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 30; i++) {
    const x1 = Math.random() * W, y1 = Math.random() * H;
    const x2 = Math.random() * W, y2 = Math.random() * H;
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    ctx.fillStyle = 'rgba(80,160,100,0.3)';
    ctx.beginPath(); ctx.arc(x1,y1,1.5,0,Math.PI*2); ctx.fill();
  }
}
