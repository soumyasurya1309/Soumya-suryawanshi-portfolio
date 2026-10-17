/**
 * fakenews-pipeline.js — Animated NLP pipeline diagram for Fake News Detection.
 * Illustrative only — not a live model inference.
 */

const PIPELINE_STEPS = [
  { icon: '📄', label: 'Article\nInput',        id: 'input' },
  { icon: '✂️', label: 'Tokenisation\n& Cleaning', id: 'tokenise' },
  { icon: '🚫', label: 'Stopword\nRemoval',     id: 'stopword' },
  { icon: '📊', label: 'TF-IDF\nVectorisation', id: 'tfidf' },
  { icon: '🧮', label: 'Logistic\nRegression', id: 'logreg' },
  { icon: '🔍', label: 'Prediction\n(Illustrative)', id: 'output' },
];

export function initFakenewsPipeline() {
  const container = document.getElementById('fakenews-pipeline');
  if (!container) return;

  renderPipeline(container, PIPELINE_STEPS, '#b8f043');

  // Auto-cycle active step
  let activeIdx = 0;
  const steps = container.querySelectorAll('.pipeline-step');

  function cycle() {
    steps.forEach((s, i) => s.classList.toggle('active', i === activeIdx));
    activeIdx = (activeIdx + 1) % steps.length;
  }
  cycle();

  // Only animate when visible
  let timer;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      timer = setInterval(cycle, 900);
    } else {
      clearInterval(timer);
    }
  }, { threshold: 0.3 });
  obs.observe(container);
}

/**
 * facerecog-pipeline.js — Animated face recognition pipeline.
 */
const FACERECOG_STEPS = [
  { icon: '🖼️', label: 'Image\nInput',        id: 'img' },
  { icon: '⚙️', label: 'Preprocessing\n(OpenCV)', id: 'preproc' },
  { icon: '📉', label: 'PCA\nDimensionality', id: 'pca' },
  { icon: '🧠', label: 'ANN\nClassifier',     id: 'ann' },
  { icon: '✅', label: 'Identity\nOutput (Illustrative)', id: 'out' },
];

export function initFacerecogPipeline() {
  const container = document.getElementById('facerecog-pipeline');
  if (!container) return;

  renderPipeline(container, FACERECOG_STEPS, '#a78bfa');

  let activeIdx = 0;
  const steps = container.querySelectorAll('.pipeline-step');

  function cycle() {
    steps.forEach((s, i) => s.classList.toggle('active', i === activeIdx));
    activeIdx = (activeIdx + 1) % steps.length;
  }
  cycle();

  let timer;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      timer = setInterval(cycle, 1000);
    } else {
      clearInterval(timer);
    }
  }, { threshold: 0.3 });
  obs.observe(container);
}

function renderPipeline(container, steps, accentColor) {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display:flex;align-items:center;gap:8px;flex-wrap:nowrap;overflow-x:auto;padding:8px 0;';

  steps.forEach((step, i) => {
    const el = document.createElement('div');
    el.className = 'pipeline-step';
    el.dataset.id = step.id;

    const icon = document.createElement('div');
    icon.className = 'pipeline-step-icon';
    icon.textContent = step.icon;
    icon.style.fontSize = '1.4rem';

    const label = document.createElement('div');
    label.className = 'pipeline-step-label';
    label.textContent = step.label;

    el.appendChild(icon);
    el.appendChild(label);
    wrapper.appendChild(el);

    if (i < steps.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'pipeline-arrow';
      arrow.textContent = '→';
      arrow.style.color = accentColor;
      arrow.style.flexShrink = '0';
      arrow.style.fontSize = '1rem';
      arrow.style.opacity = '0.5';
      wrapper.appendChild(arrow);
    }
  });

  container.appendChild(wrapper);
}
