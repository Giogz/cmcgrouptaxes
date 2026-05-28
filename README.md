# NEXUS — Animated Technology Website

A cutting-edge, production-ready animated website built with **vanilla HTML, CSS, and JavaScript** — no frameworks, no build tools, zero dependencies.

## ✨ Features

| Feature | Tech |
|---|---|
| Particle constellation background | Canvas 2D API |
| Glitch text animation | CSS `clip-path` + `animation` |
| Custom magnetic cursor | JS `mousemove` + CSS transitions |
| Scroll-reveal animations | `IntersectionObserver` API |
| Animated project canvases | Canvas 2D API |
| Counter number animations | `requestAnimationFrame` |
| Typewriter effect | Vanilla JS |
| Responsive mobile menu | CSS + JS overlay |
| Marquee ticker | Pure CSS `animation` |
| Loading screen | CSS animation + JS timeout |

## 🚀 Deploy to GitHub Pages (3 steps)

### Step 1 — Push to GitHub
```bash
# Initialize a git repository in this folder
git init
git add .
git commit -m "Initial commit — NEXUS website"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2 — Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select `Deploy from a branch`
4. Set branch to `main` and folder to `/ (root)`
5. Click **Save**

### Step 3 — Visit your site
Your site will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```
(Takes ~1–2 minutes to deploy)

## 📁 File Structure

```
nexus-website/
├── index.html      ← Main page (all sections)
├── style.css       ← All styles + animations
├── main.js         ← All JavaScript (Canvas, Cursor, etc.)
└── README.md       ← This file
```

## 🎨 Customization

### Change colors (style.css → :root)
```css
:root {
  --bg: #050A14;       /* Main background */
  --cyan: #00F5FF;     /* Accent color 1  */
  --lime: #A8FF3E;     /* Accent color 2  */
  --white: #F0EDE8;    /* Text color      */
}
```

### Change site name
Find/replace `NEXUS` in `index.html` with your studio/company name.

### Add your projects
In `index.html`, find the `.projects-grid` section and update:
- `data-color` attribute (hex color for canvas background)
- `<h3>` title, `<p>` description
- `<span>` tags in `.project-tags`

### Update contact info
Replace placeholder emails and social links in the `#contact` section.

## 🛠 Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid, Flexbox, Animations, `clip-path`
- **Vanilla JS** — Canvas 2D, IntersectionObserver, requestAnimationFrame
- **Google Fonts** — Syne, JetBrains Mono, Outfit
- **Zero npm** — No build step, no node_modules, pure browser code

## 📱 Browser Support

| Browser | Support |
|---|---|
| Chrome 80+ | ✅ Full |
| Firefox 75+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 80+ | ✅ Full |
| Mobile Chrome/Safari | ✅ Full (cursor disabled) |

## 📄 License

MIT — free for personal and commercial use.

---

Built with ♥ and too much caffeine.
