# Neck Relief

An interactive, single‑page web app that guides you through a doctor‑prescribed neck care routine. It includes step navigation, on‑page timers, rep/set counters, light/dark theme, and automatic progress saving in your browser.

## Live site
- Visit the GitHub Pages site: [Neck Relief (GitHub Pages)](https://diabmoh.github.io/neck_relief/)

## Features
- Guided routine with clear step titles, categories, and notes
- Built‑in countdown timer for timed steps
- Rep and set counters for exercise blocks
- “Mark complete” tracking across steps
- Progress persistence via localStorage (no backend)
- Light/dark theme toggle
- Fully static: just HTML, CSS, and JavaScript

## Quick start (local)
- Open `index.html` in a browser, or open `neck-care/index.html` directly
- For a local web server (recommended for some browsers):
  - Python: `python3 -m http.server 8000` then go to `http://localhost:8000`

## Repository structure
```
/ (repo root)
├── index.html              # Redirects to the app folder for GitHub Pages
├── README.md               # This file
└── neck-care/
    ├── index.html          # App entry point
    ├── styles.css          # App styles
    └── script.js           # App logic
```

## Deployment (GitHub Pages)
- Pages is configured to serve from the repo root
- Root `index.html` redirects to the app in `neck-care/`
- Alternatively, you can move the app files to the root and remove the redirect

## Privacy
- No tracking, analytics, or external storage
- Routine progress is saved only in your browser (localStorage)

## Notes
- Educational resource only and not a substitute for medical care. Follow your provider’s guidance and stop if symptoms worsen.