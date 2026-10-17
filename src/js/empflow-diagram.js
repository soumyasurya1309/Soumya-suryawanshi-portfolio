/**
 * empflow-diagram.js — Interactive SVG architecture diagram for EmpFlow.
 * Hover / click / touch / keyboard on a node reveals its role description.
 * Signal pulses animate along connections (CSS animation).
 */

const NODES = [
  {
    id: 'flutter',
    label: 'Flutter Client',
    sublabel: 'Dart · Provider · Widgets',
    x: 400, y: 200, w: 140, h: 56,
    color: '#54c5f8',
    role: 'Cross-platform Flutter app (iOS, Android, Web). Uses Provider for state management, widget tree for UI. Consumes all Firebase services through Dart SDKs.',
  },
  {
    id: 'auth',
    label: 'Firebase Auth',
    sublabel: 'Role-based access',
    x: 110, y: 80, w: 130, h: 50,
    color: '#b8f043',
    role: 'Firebase Authentication handles login/logout for Admin and Staff roles. Role assignments are stored in Firestore and enforced on the client through route guards.',
  },
  {
    id: 'guards',
    label: 'Route Guards',
    sublabel: 'Admin / Staff roles',
    x: 110, y: 300, w: 130, h: 50,
    color: '#fbbf24',
    role: 'Client-side route guards check the authenticated user\'s role before allowing navigation to protected screens (admin-only views, staff views, QR scanner).',
  },
  {
    id: 'firestore',
    label: 'Cloud Firestore',
    sublabel: 'Real-time listeners',
    x: 690, y: 80, w: 140, h: 50,
    color: '#f97316',
    role: 'NoSQL document database — stores employee records, QR codes, export logs. Indexed queries and stream caching gave ~85% faster lookup in internal testing. Real-time listeners keep the UI updated without polling.',
  },
  {
    id: 'storage',
    label: 'Firebase Storage',
    sublabel: 'Profile assets',
    x: 690, y: 200, w: 140, h: 50,
    color: '#a78bfa',
    role: 'Firebase Storage hosts employee profile photos and generated PDF exports. Access rules mirror Firestore security rules for consistent permissions.',
  },
  {
    id: 'fcm',
    label: 'Cloud Messaging',
    sublabel: 'FCM push notifications',
    x: 690, y: 320, w: 140, h: 50,
    color: '#f87171',
    role: 'Firebase Cloud Messaging sends push notifications — e.g., when a QR scan is completed or an export is ready. Integrated via background message handlers in Flutter.',
  },
  {
    id: 'qr',
    label: 'QR Workflow',
    sublabel: 'Generate · Scan · Profile',
    x: 160, y: 430, w: 140, h: 50,
    color: '#b8f043',
    role: 'QR codes are generated per employee and stored in Firestore. Scanning a QR code fetches the employee profile in under 1 second (internal test). Implemented with Flutter\'s camera package and a custom QR parser.',
  },
  {
    id: 'export',
    label: 'PDF / Excel Export',
    sublabel: 'Report generation',
    x: 440, y: 430, w: 140, h: 50,
    color: '#34d399',
    role: 'Generates formatted PDF and Excel reports from Firestore query results. Uses Dart packages (pdf, excel). Files are saved to device storage or uploaded to Firebase Storage.',
  },
  {
    id: 'hosting',
    label: 'Firebase Hosting',
    sublabel: 'Web deployment',
    x: 300, y: 530, w: 140, h: 50,
    color: '#60a5fa',
    role: 'The Flutter web build is deployed to Firebase Hosting via the Firebase CLI. Provides CDN delivery, custom domain support, and rollback via deployment history.',
  },
];

const EDGES = [
  ['flutter','auth'],
  ['flutter','guards'],
  ['flutter','firestore'],
  ['flutter','storage'],
  ['flutter','fcm'],
  ['flutter','qr'],
  ['flutter','export'],
  ['flutter','hosting'],
  ['auth','guards'],
  ['qr','firestore'],
  ['export','firestore'],
];

const SVG_NS = 'http://www.w3.org/2000/svg';
const VB_W = 940, VB_H = 620;

export function initEmpflowDiagram() {
  const container = document.getElementById('empflow-diagram');
  if (!container) return;

  // Build SVG
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${VB_W} ${VB_H}`);
  svg.setAttribute('class', 'empflow-svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'EmpFlow architecture diagram');

  // Defs — arrow marker + gradient
  const defs = document.createElementNS(SVG_NS, 'defs');
  defs.innerHTML = `
    <marker id="arrow" viewBox="0 0 8 8" refX="8" refY="4"
      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L8,4 L0,8 Z" fill="rgba(80,120,90,0.6)" />
    </marker>
    <filter id="node-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  `;
  svg.appendChild(defs);

  // Edge layer
  const edgeGroup = document.createElementNS(SVG_NS, 'g');
  edgeGroup.setAttribute('class', 'edges');
  svg.appendChild(edgeGroup);

  // Node lookup
  const nodeMap = {};
  NODES.forEach(n => { nodeMap[n.id] = n; });

  // Draw edges
  const edgeEls = {};
  EDGES.forEach(([aid, bid]) => {
    const a = nodeMap[aid], b = nodeMap[bid];
    if (!a || !b) return;
    const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
    const bx = b.x + b.w / 2, by = b.y + b.h / 2;

    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', ax); line.setAttribute('y1', ay);
    line.setAttribute('x2', bx); line.setAttribute('y2', by);
    line.setAttribute('stroke', 'rgba(60,110,75,0.35)');
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('stroke-dasharray', '4 4');
    line.setAttribute('marker-end', 'url(#arrow)');
    edgeGroup.appendChild(line);
    edgeEls[`${aid}-${bid}`] = line;
  });

  // Node layer
  const nodeGroup = document.createElementNS(SVG_NS, 'g');
  nodeGroup.setAttribute('class', 'nodes');
  svg.appendChild(nodeGroup);

  // Tooltip div
  const tooltip = document.createElement('div');
  tooltip.className = 'empflow-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.setAttribute('aria-live', 'polite');
  container.style.position = 'relative';
  container.appendChild(tooltip);

  let activeNode = null;

  function showTooltip(node, svgRect, nodeEl) {
    tooltip.innerHTML = `
      <div class="empflow-tooltip-title">${node.label}</div>
      <div>${node.role}</div>
    `;

    // Position: below node in SVG coordinates → convert to container space
    const scaleX = container.clientWidth / VB_W;
    const scaleY = (container.clientHeight || 400) / VB_H;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (container.clientWidth  - VB_W * scale) / 2;
    const offsetY = (container.clientHeight - VB_H * scale) / 2;

    let tx = (node.x + node.w / 2) * scale + offsetX;
    let ty = (node.y + node.h + 8) * scale + offsetY;

    // Clamp to container
    tx = Math.max(8, Math.min(tx, container.clientWidth - 236));
    if (ty + 140 > container.clientHeight) {
      ty = (node.y - 8) * scale + offsetY - 140;
    }

    tooltip.style.left = `${tx}px`;
    tooltip.style.top  = `${ty}px`;
    tooltip.classList.add('visible');
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
    if (activeNode) {
      activeNode.classList.remove('active');
      activeNode = null;
    }
  }

  // Draw nodes
  NODES.forEach(node => {
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', 'empflow-node');
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', `${node.label}: ${node.role}`);
    g.setAttribute('data-node', node.id);

    // Background rect
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', node.x); rect.setAttribute('y', node.y);
    rect.setAttribute('width', node.w); rect.setAttribute('height', node.h);
    rect.setAttribute('rx', '8');
    rect.setAttribute('fill', 'rgba(10,23,16,0.9)');
    rect.setAttribute('stroke', node.color);
    rect.setAttribute('stroke-width', '1.5');

    // Label
    const text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', node.x + node.w / 2);
    text.setAttribute('y', node.y + 20);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', 'Syne, sans-serif');
    text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', '700');
    text.setAttribute('fill', node.color);
    text.textContent = node.label;

    // Sublabel
    const sub = document.createElementNS(SVG_NS, 'text');
    sub.setAttribute('x', node.x + node.w / 2);
    sub.setAttribute('y', node.y + 36);
    sub.setAttribute('text-anchor', 'middle');
    sub.setAttribute('font-family', 'JetBrains Mono, monospace');
    sub.setAttribute('font-size', '8');
    sub.setAttribute('fill', 'rgba(138,170,142,0.8)');
    sub.textContent = node.sublabel;

    g.appendChild(rect); g.appendChild(text); g.appendChild(sub);
    nodeGroup.appendChild(g);

    // Events
    function activate(e) {
      e.preventDefault();
      if (activeNode === g) { hideTooltip(); return; }
      if (activeNode) activeNode.querySelector('rect')?.setAttribute('stroke-width', '1.5');
      activeNode = g;
      rect.setAttribute('stroke-width', '3');

      // Highlight connected edges
      EDGES.forEach(([aid, bid]) => {
        const key = `${aid}-${bid}`;
        const connected = aid === node.id || bid === node.id;
        if (edgeEls[key]) {
          edgeEls[key].setAttribute('stroke', connected
            ? node.color.replace(')', ',0.7)').replace('rgb','rgba')
            : 'rgba(60,110,75,0.1)'
          );
          edgeEls[key].setAttribute('stroke-width', connected ? '2' : '1');
        }
      });

      showTooltip(node, null, g);
    }

    g.addEventListener('click', activate);
    g.addEventListener('touchend', activate, { passive: false });
    g.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') activate(e);
      if (e.key === 'Escape') hideTooltip();
    });
  });

  // Click outside to close
  container.addEventListener('click', e => {
    if (!e.target.closest('.empflow-node, .empflow-tooltip')) hideTooltip();
  });

  // Animate pulses along connections
  animatePulses(svg, EDGES, nodeMap, edgeGroup);

  container.appendChild(svg);
}

function animatePulses(svg, edges, nodeMap, edgeGroup) {
  // Add animated circles along each edge periodically
  setInterval(() => {
    if (document.hidden) return;
    if (edges.length === 0) return;
    const [aid, bid] = edges[Math.floor(Math.random() * edges.length)];
    const a = nodeMap[aid], b = nodeMap[bid];
    if (!a || !b) return;

    const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
    const bx = b.x + b.w / 2, by = b.y + b.h / 2;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '3');
    circle.setAttribute('fill', '#b8f043');
    circle.setAttribute('opacity', '0.9');
    edgeGroup.appendChild(circle);

    const dur = 1200 + Math.random() * 800;
    let start = null;

    function step(ts) {
      if (!start) start = ts;
      const t = Math.min((ts - start) / dur, 1);
      circle.setAttribute('cx', ax + (bx - ax) * t);
      circle.setAttribute('cy', ay + (by - ay) * t);
      circle.setAttribute('opacity', String(t < 0.1 ? t * 10 : t > 0.9 ? (1 - t) * 10 : 0.9));
      if (t < 1) requestAnimationFrame(step);
      else circle.remove();
    }
    requestAnimationFrame(step);
  }, 800);
}
