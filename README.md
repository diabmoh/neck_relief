# Neck Relief

An interactive, single‑page web app that guides you through a doctor‑prescribed neck care routine. It includes step navigation, on‑page timers, rep/set counters, light/dark theme, and automatic progress saving in your browser.

## Live site
- Visit: [Neck Relief on GitHub Pages](https://diabmoh.github.io/neck_relief/)

## Features
- Guided routine with clear step titles, categories, and notes
- Built‑in countdown timer for timed steps
- Rep and set counters for exercise blocks
- “Mark complete” tracking across steps
- Progress persistence via localStorage (no backend)
- Light/dark theme toggle with frosted‑glass UI
- Fully static: just HTML, CSS, and JavaScript

## Screenshot
- Add a screenshot to the repo root named `screenshot.png` (optional). Then reference it here:
  - `![App screenshot](screenshot.png)`

## Quick start (local)
- Open `index.html` in a browser, or open `neck-care/index.html` directly
- For a local web server (recommended for some browsers):
  - Python: `python3 -m http.server 8000` then go to `http://localhost:8000`

## Usage
- Select a step from the left list to view details
- Use Start/Pause/Reset for timed steps
- Use `+`/`−` to track reps/sets; click “Mark Complete” to record progress
- Toggle the theme with the moon/sun button in the header

## Accessibility & privacy
- Timer display is screen‑reader friendly (`role="timer"`, `aria-live="polite"`)
- No tracking/analytics. Progress is saved only in your browser (localStorage)

## Tech & structure
- Tech: HTML, CSS, JavaScript (no frameworks)
- Structure:
```
/ (repo root)
├── index.html              # Redirects to the app folder for GitHub Pages
├── README.md               # This file
└── neck-care/
    ├── index.html          # App entry point
    ├── styles.css          # App styles (frosted‑glass design)
    └── script.js           # App logic
```

## Deployment (GitHub Pages)
- Pages is configured to serve from the repo root
- Root `index.html` redirects to `neck-care/`
- Alternatively, move the app files to root and remove the redirect

## License
- MIT — see `LICENSE` for details

## Disclaimer
- Educational resource only and not a substitute for medical care. Follow your provider’s guidance and stop if symptoms worsen.