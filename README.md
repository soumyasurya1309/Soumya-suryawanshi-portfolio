# Soumya Suryawanshi — Portfolio Website

**Design Theme:** Deep Forest Terminal · Vite + Vanilla JS + GSAP + Lenis

Live dev: `http://localhost:5173/` · Preview build: `http://localhost:4173/`

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (hot reload)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## Placing Your Images

Copy your photos into `public/images/` with **exactly** these filenames:

| Filename | What to put there |
|---|---|
| `hero-bg.jpg` | Your wide green cinematic key visual (the one with the code card and light beam) |
| `portrait.jpg` | Your formal studio portrait (grey backdrop) |
| `campus.jpg` | The Jio campus / office building photo |
| `sit-group.jpg` | The SIT group classroom photo |

Also place your resume PDF at:
```
public/resume/soumya-resume.pdf
```

The site works without these files — it uses the generated dev approximation (`hero-bg-dev.jpg`) automatically. Once you place the real images, just refresh the dev server.

---

## Editing Content

All content is in **`index.html`** (no CMS, no data files — intentional for simplicity).

| Section | What to edit |
|---|---|
| Hero name / tagline | `<h1 id="hero-name">` and `.hero-tagline` |
| About summary | `.about-summary` paragraphs |
| Education | `.education-card` |
| Experience bullets | `.timeline-bullets` in each `.timeline-item` |
| Project descriptions | `.project-desc` paragraphs |
| Metrics | `data-target` attributes on `.counter` elements |
| Skills | `.skill-pills` buttons (add `data-projects="..."` to link skills to projects) |
| Contact info | `href` attributes in `#contact` section |

Design tokens (colours, fonts, spacing) are in `src/style.css` at the top under `:root { ... }`.

### Changing the accent colour
Edit `--c-accent: #b8f043;` in `:root` — the whole site responds.

---

## File Structure

```
soumya-portfolio/
├── public/
│   ├── images/          ← Put your photos here
│   │   ├── hero-bg.jpg        (replace with your actual image)
│   │   ├── portrait.jpg
│   │   ├── campus.jpg
│   │   └── sit-group.jpg
│   ├── resume/
│   │   └── soumya-resume.pdf  (place your resume PDF here)
│   ├── favicon.svg
│   ├── og-image.png
│   ├── robots.txt
│   ├── sitemap.xml
│   └── site.webmanifest
├── src/
│   ├── style.css          ← All styles + design tokens
│   ├── main.js            ← Entry point, initialises all modules
│   └── js/
│       ├── canvas-bg.js       ← Live animated node background
│       ├── cursor.js          ← Custom cursor + magnetic buttons
│       ├── nav.js             ← Navigation + scroll progress
│       ├── scroll-animations.js ← GSAP reveals + counters
│       ├── empflow-diagram.js ← Interactive SVG architecture diagram
│       ├── manet-topology.js  ← Animated MANET canvas
│       ├── pipelines.js       ← NLP + Face Recognition pipeline diagrams
│       └── skills-map.js      ← Interactive skill → project highlight
├── index.html             ← All HTML content
├── vite.config.js
├── package.json
├── ASSET_MANIFEST.md
└── README.md
```

---

## Deploy

### Vercel (recommended — zero config)
```bash
npm install -g vercel
vercel --prod
```
Or connect your GitHub repo in the Vercel dashboard. Build command: `npm run build`. Output dir: `dist`.

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```
Or drag the `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop).

### Firebase Hosting
```bash
# One-time setup
npm install -g firebase-tools
firebase login
firebase init hosting
# Choose: dist as public directory, single-page app: yes, don't overwrite index.html

# Deploy
npm run build
firebase deploy
```

`firebase.json` should contain:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

After deploying, update these values to your live URL:
- `<link rel="canonical">` in `index.html`
- `og:url` meta tag
- `sitemap.xml` `<loc>` entry

---

## Adding Screenshots / Recording to EmpFlow

Find the placeholder in `index.html`:
```html
<div class="screenshot-placeholder" aria-label="Screenshot placeholder">
```

Replace it with:
```html
<div class="empflow-media">
  <img src="/images/empflow-screenshots/screen1.jpg" alt="EmpFlow employee list screen" loading="lazy" />
  <!-- OR for a video: -->
  <video src="/images/empflow-demo.mp4" controls muted loop playsinline
    aria-label="EmpFlow app demonstration (screen recording)"></video>
</div>
```

---

## Accessibility Notes
- All interactive elements (nav links, buttons, diagram nodes) are keyboard-operable
- The EmpFlow diagram nodes have `tabindex="0"`, `role="button"`, and `aria-label`
- WCAG AA contrast ratios maintained throughout (dark green bg + warm off-white text)
- `prefers-reduced-motion`: canvas stops animating, CSS transitions disabled, no scroll hijacking
- Focus styles are visible (`outline: 2px solid #b8f043`)

---

## What Was Built vs. What Is a Placeholder

| Item | Status |
|---|---|
| Full HTML structure (all 7 sections) | ✅ Built |
| Deep Forest Terminal CSS design system | ✅ Built |
| Live canvas background with section moods | ✅ Built |
| Custom cursor + magnetic buttons | ✅ Built |
| Navigation + scroll progress + mobile menu | ✅ Built |
| Hero with animated name + CTAs | ✅ Built |
| About section with portrait + education card | ✅ Built |
| Experience timeline (Reliance + iStudio) | ✅ Built |
| EmpFlow interactive SVG diagram | ✅ Built |
| MANET animated topology canvas | ✅ Built |
| Fake News NLP pipeline diagram | ✅ Built |
| Face Recognition pipeline diagram | ✅ Built |
| Patent section + copy-to-clipboard | ✅ Built |
| Interactive skills map | ✅ Built |
| Certifications grid | ✅ Built |
| Contact section (email, LinkedIn, GitHub, phone) | ✅ Built |
| Lenis smooth scroll + GSAP ScrollTrigger | ✅ Built |
| Number counters (IntersectionObserver) | ✅ Built |
| Technology marquee | ✅ Built |
| Self-hosted fonts (Syne, Inter, JetBrains Mono) | ✅ Built |
| Responsive (320–1920px) | ✅ Built |
| `prefers-reduced-motion` support | ✅ Built |
| Production build (Vite, 278ms) | ✅ Verified |
| Hero image (your actual photo) | ⏳ Place at `public/images/hero-bg.jpg` |
| About portrait (your actual photo) | ⏳ Place at `public/images/portrait.jpg` |
| Campus photo | ⏳ Place at `public/images/campus.jpg` |
| SIT group photo | ⏳ Place at `public/images/sit-group.jpg` |
| Resume PDF download | ⏳ Place at `public/resume/soumya-resume.pdf` |
| EmpFlow screenshots/recording | ⏳ Add to screenshot placeholder |
| Live domain (canonical URL) | ⏳ Update before deploying |
| Browser screenshots (Playwright unavailable in this env) | ⚠ Not verified via automation |

---

*No independent benchmarks. All performance metrics are from internal testing as stated on the resume.*
