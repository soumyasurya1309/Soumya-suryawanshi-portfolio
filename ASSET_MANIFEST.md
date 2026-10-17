# ASSET MANIFEST — Soumya Suryawanshi Portfolio
**Generated:** 2026-10-17 | **Build:** Deep Forest Terminal

---

## Image Classification (by visual content)

| File | Visual Content | Role | Used In |
|------|---------------|------|---------|
| `hero-bg.jpg` | Wide 16:9 cinematic image — dark forest-green atmosphere, person in black suit on the right, floating code card panel ("const developer = {…}") center-left, skills icon panel lower-left, plants, MacBook on desk, dramatic warm light beam from upper right | **HERO BACKGROUND** — primary key visual | Hero section as full-viewport parallax background |
| `portrait.jpg` | Formal studio portrait — person in dark blazer + white shirt, plain charcoal-grey backdrop, professional three-quarter-length pose | **ABOUT / CONTACT PORTRAIT** | About section (main portrait), Contact section |
| `campus.jpg` | Outdoor campus photo — modern glass-and-steel towers, Jio-branded building signage visible, blue sky, landscape path | **EXPERIENCE — ATMOSPHERE** | Reliance experience card (supporting atmosphere only; not captioned with internal claims) |
| `sit-group.jpg` | Group photo — students in navy blazers with SIT (Symbiosis Institute of Technology) red lanyards seated at conference table, laptops on table | **EDUCATION** | About / Education sub-section, used sparingly as a secondary visual |
| Resume image | Text document: name, summary, education, experience, projects, patent, skills, certifications — white background | **SOURCE OF TRUTH** | Content reference only — never displayed as an image |

---

## Company Logos
No logo image files were attached. Typographic wordmarks will be used instead:
- **Reliance Industries Limited** — Clean typographic wordmark
- **iStudio Training Program** — Clean sans-serif label
- **Symbiosis Institute of Technology** — "SIT" abbreviated with full name below
- **Google / Coursera / Deloitte / Forage / Red Hat** — Text labels only

> Rule: ONLY use logos actually provided. No SVG redraws, no hotlinks, no invented logos.

---

## Hero Approach Decision
**Choice: (a) — Image as background with strategic gradient overlay**

The green cinematic image has baked-in text in the center and center-left area. I apply a left-weighted dark gradient overlay that fades the baked-in text into the dark background, keeps the right side (person) fully visible, and provides a clear canvas for HTML text on the left.

`object-position: 70% center` ensures the person remains visible on narrow viewports.

---

## User Action Required

Copy your original photos to `public/images/` with these exact filenames:
- `hero-bg.jpg` — green cinematic key visual
- `portrait.jpg` — formal grey-backdrop portrait
- `campus.jpg` — Jio campus photo
- `sit-group.jpg` — SIT group photo
- `public/resume/soumya-resume.pdf` — your resume PDF (for download link)
