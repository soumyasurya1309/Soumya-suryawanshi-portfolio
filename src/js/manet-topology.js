/**
 * manet-topology.js — Animated MANET node topology simulation.
 * Nodes drift, connections form/dissolve as nodes move in range.
 * Packet animations travel along paths.
 * LABELLED: illustrative — not NS-3 simulation output.
 */
export function initManetTopology() {
  const canvas = document.getElementById('manet-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, raf;

  const NODE_COUNT = 18;
  const COMM_RANGE = 110;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width  = rect.width  * dpr;
    H = canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    // Adjust values to CSS pixels
    W = rect.width;
    H = rect.height;
  }

  // Create nodes
  function makeNodes() {
    return Array.from({ length: NODE_COUNT }, (_, i) => ({
      id: i,
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      r:  3,
      isRouter: i < 4, // first 4 are "routing nodes" (shown slightly differently)
    }));
  }

  const nodes = makeNodes();
  const packets = []; // { from, to, t, speed }

  // Periodically create a "packet" travelling from one node to a neighbour
  setInterval(() => {
    if (document.hidden || prefersReduced) return;
    const a = nodes[Math.floor(Math.random() * nodes.length)];
    const neighbours = nodes.filter(n => {
      if (n === a) return false;
      const dx = n.x - a.x, dy = n.y - a.y;
      return Math.sqrt(dx*dx + dy*dy) < COMM_RANGE;
    });
    if (!neighbours.length) return;
    const b = neighbours[Math.floor(Math.random() * neighbours.length)];
    packets.push({ from: a, to: b, t: 0, speed: 0.018 + Math.random() * 0.012 });
  }, 600);

  function draw() {
    if (document.hidden) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.clearRect(0, 0, W * dpr, H * dpr);
    // Work in logical pixels
    ctx.save();
    ctx.scale(dpr, dpr);

    // Update nodes
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      // Bounce off walls
      if (n.x < n.r || n.x > W - n.r) { n.vx *= -1; n.x = Math.max(n.r, Math.min(W - n.r, n.x)); }
      if (n.y < n.r || n.y > H - n.r) { n.vy *= -1; n.y = Math.max(n.r, Math.min(H - n.r, n.y)); }
    }

    // Draw connections within range
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d > COMM_RANGE) continue;
        const alpha = (1 - d / COMM_RANGE) * 0.4;
        ctx.strokeStyle = `rgba(40,100,65,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);

    // Draw nodes
    for (const n of nodes) {
      const color = n.isRouter ? '#b8f043' : '#4a9a60';
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = n.isRouter ? 8 : 0;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.isRouter ? 4.5 : 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Node ID label for router nodes
      if (n.isRouter) {
        ctx.fillStyle = 'rgba(184,240,67,0.7)';
        ctx.font = '7px JetBrains Mono, monospace';
        ctx.fillText(`R${n.id}`, n.x + 6, n.y + 3);
      }
    }

    // Update + draw packets
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.t += p.speed;
      if (p.t >= 1) { packets.splice(i, 1); continue; }

      const px = p.from.x + (p.to.x - p.from.x) * p.t;
      const py = p.from.y + (p.to.y - p.from.y) * p.t;

      const grd = ctx.createRadialGradient(px, py, 0, px, py, 6);
      grd.addColorStop(0, 'rgba(184,240,67,0.9)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#b8f043';
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    raf = requestAnimationFrame(draw);
  }

  // Handle canvas size
  const resizeObs = new ResizeObserver(() => {
    resize();
  });
  resizeObs.observe(canvas);
  resize();

  if (prefersReduced) {
    // Static frame only
    ctx.save();
    ctx.fillStyle = 'rgba(40,100,65,0.3)';
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 600, Math.random() * 220, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return;
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    }
  });

  // Only start when visible
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      raf = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(raf);
    }
  }, { threshold: 0.1 });
  obs.observe(canvas);
}
