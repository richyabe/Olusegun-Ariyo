# Olusegun Ariyo — Premium Portfolio Website
**Multi-page, fully-linked, production-ready website**

---

## 📁 Folder Structure

```
olusegun-ariyo/
├── index.html              ← Home page
├── about.html              ← About page
├── career.html             ← Career & Experience
├── publications.html       ← Publications & Articles
├── advocacy.html           ← Advocacy & Impact
├── gallery.html            ← Photo Gallery
├── contact.html            ← Contact page
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/
│   │   └── main.css        ← All styles (design tokens, glass, animations)
│   ├── js/
│   │   └── site.js         ← All JS (cursor, navbar, GSAP, counters, forms)
│   └── images/
│       ├── portrait.jpg    ← Add your portrait here
│       └── gallery/        ← Add gallery photos here
│           ├── journalism-1.jpg
│           ├── urban-1.jpg
│           ├── speaking-1.jpg
│           └── ... (match filenames in gallery.html data-src attrs)
```

---

## 🚀 Quick Start

1. **Open with a local server** (required for best results):
   - VS Code: Install "Live Server" extension → right-click `index.html` → "Open with Live Server"
   - Terminal: `python3 -m http.server 8000` then visit `http://localhost:8000`
   - Or simply open `index.html` directly in your browser — everything works without a server too.

2. **Add your photos**:
   - Portrait photo → `assets/images/portrait.jpg`
   - Gallery photos → `assets/images/gallery/` (filenames match `data-src` in gallery.html)
   - Logo image → `assets/images/logo.png` (optional — text placeholder currently shown)

3. **Update contact details** in all pages:
   - Email: `hello@olusegunariyo.com`
   - Phone: Update in `contact.html`
   - Social links: Search for `twitter.com/olusegunariyo` and update all handles

---

## 🎨 Customization

### Colors (edit `assets/css/main.css` `:root` block)
```css
--red:        #b30000;   /* Primary red */
--red-bright: #e00000;   /* Hover red */
--black:      #0a0a0a;   /* Backgrounds */
--white:      #ffffff;   /* Page background */
```

### Fonts
Currently uses **Inter** (body) + **Playfair Display** (headings) from Google Fonts. Change the `@import` in each HTML `<head>`.

### Adding the Real Urban Express Logo
Replace the `nav-logo-placeholder` div in every navbar with:
```html
<img src="assets/images/urban-express-logo.png" alt="Urban Express News" class="nav-logo-img"/>
```

---

## ✅ Features

| Feature | Status |
|---------|--------|
| 7 fully-linked HTML pages | ✅ |
| Shared CSS design system | ✅ |
| Shared JS (cursor, navbar, GSAP, counters) | ✅ |
| GSAP hero animations | ✅ |
| Scroll reveal (IntersectionObserver) | ✅ |
| Animated counters | ✅ |
| Custom glowing cursor (desktop) | ✅ |
| Scroll progress bar | ✅ |
| Dark mode toggle | ✅ |
| Masonry gallery + lightbox + prev/next | ✅ |
| Gallery & publication category filters | ✅ |
| Animated loading screen | ✅ |
| Contact form with validation | ✅ |
| Newsletter form | ✅ |
| Mobile responsive (hamburger menu) | ✅ |
| Red glowing particle hero background | ✅ |
| Red light streak animations | ✅ |
| Glassmorphism cards | ✅ |
| Marquee scrolling strip | ✅ |
| Back-to-top FAB button | ✅ |
| SEO meta tags + Open Graph | ✅ |
| sitemap.xml + robots.txt | ✅ |
| All News links → urbanexpresslive.com | ✅ |
| Urban Express logo placeholder | ✅ |
| Fully accessible (ARIA labels) | ✅ |
| Print stylesheet | ✅ |
| Reduced motion support | ✅ |

---

## 🔗 All Internal Links

Every page links to every other page. The "News" nav item and all news-related links point directly to **https://urbanexpresslive.com**.

---

## 🌐 Deployment

Upload the entire `olusegun-ariyo/` folder to any web host:
- **Netlify**: Drag & drop the folder at netlify.com/drop
- **GitHub Pages**: Push to a repo, enable Pages in Settings
- **cPanel / FTP**: Upload to `public_html/`
- **Vercel**: `vercel deploy` from the folder

Update `sitemap.xml` and `robots.txt` with the real domain after deployment.

---

Built with HTML5 · Tailwind CSS · Vanilla JS · GSAP 3
