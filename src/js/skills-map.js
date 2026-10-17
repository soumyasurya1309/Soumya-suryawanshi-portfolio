/**
 * skills-map.js — Interactive skills map.
 * Hovering a technology pill highlights the project cards that use it.
 * No percentages, skill levels, or years.
 */

const PROJECT_NAMES = {
  empflow:  'EmpFlow',
  manet:    'MANET Simulation',
  fakenews: 'Fake News Detection',
  facerecog: 'Face Recognition',
};

export function initSkillsMap() {
  const pills = document.querySelectorAll('.skill-pill[data-projects]');
  const highlight = document.getElementById('skills-highlight');
  const allPills = document.querySelectorAll('.skill-pill');
  const projectCards = {
    empflow:   document.getElementById('proj-empflow'),
    manet:     document.getElementById('proj-manet'),
    fakenews:  document.getElementById('proj-fakenews'),
    facerecog: document.getElementById('proj-facerecog'),
  };

  function activate(pill) {
    const projectIds = (pill.dataset.projects || '').split(' ').filter(Boolean);
    const techName   = pill.textContent.trim();

    // Pill states
    allPills.forEach(p => {
      if (p === pill) p.classList.add('active');
      else if (p.dataset.projects) p.classList.add('dimmed');
      else p.classList.remove('active', 'dimmed');
    });

    // Highlight project cards
    Object.entries(projectCards).forEach(([id, card]) => {
      if (!card) return;
      if (projectIds.includes(id)) {
        card.style.outline = '2px solid rgba(184,240,67,0.4)';
        card.style.boxShadow = '0 0 24px rgba(184,240,67,0.06)';
      } else {
        card.style.outline = '';
        card.style.boxShadow = '';
      }
    });

    // Callout
    if (highlight && projectIds.length) {
      const names = projectIds.map(id => PROJECT_NAMES[id] || id).join(', ');
      highlight.innerHTML = `
        <div class="highlight-callout">
          <span class="mono-label">Used in →</span>
          <span class="highlight-callout-projects">${names}</span>
        </div>
      `;
    } else if (highlight) {
      highlight.innerHTML = `
        <div class="highlight-callout">
          <span class="mono-label">Used across multiple projects</span>
        </div>
      `;
    }
  }

  function deactivate() {
    allPills.forEach(p => p.classList.remove('active', 'dimmed'));
    Object.values(projectCards).forEach(card => {
      if (card) { card.style.outline = ''; card.style.boxShadow = ''; }
    });
    if (highlight) highlight.innerHTML = '';
  }

  pills.forEach(pill => {
    pill.addEventListener('mouseenter', () => activate(pill));
    pill.addEventListener('focus', () => activate(pill));
    pill.addEventListener('mouseleave', deactivate);
    pill.addEventListener('blur', deactivate);

    pill.addEventListener('click', () => {
      if (pill.classList.contains('active')) deactivate();
      else activate(pill);
    });

    pill.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (pill.classList.contains('active')) deactivate();
        else activate(pill);
      }
      if (e.key === 'Escape') deactivate();
    });
  });

  // Pills without projects — simple hover
  document.querySelectorAll('.skill-pill:not([data-projects])').forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      allPills.forEach(p => {
        if (p !== pill) p.classList.add('dimmed');
      });
      pill.classList.add('active');
      if (highlight) highlight.innerHTML = `
        <div class="highlight-callout">
          <span class="mono-label">Core skill — featured in software engineering work</span>
        </div>
      `;
    });
    pill.addEventListener('mouseleave', deactivate);
    pill.addEventListener('focus', () => {
      pill.classList.add('active');
    });
    pill.addEventListener('blur', deactivate);
  });
}
