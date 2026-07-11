# 🚀 Deploy Checklist — Cyberduck Upload

**Site:** ॐ श्री सद्गुरवे नमः
**How:** Upload the FRONTEND files below to your website's root folder
(`public_html/` or `www/` or `htdocs/` — wherever the site currently lives).

> This file is just for you — **do NOT upload this checklist itself** to the server.

---

> **This is the single upload checklist.** (The old `UPLOAD-LIST.txt` was removed
> so the two can't disagree.)

## ⚠️ Read first — the safety rules
**Before you start:** make a **zip backup** of this whole folder (right-click →
Send to → Compressed). This work is not in git, so the zip is your only undo.

Your site has a PHP backend and live user photos. Our changes were all **frontend**,
so you only re-upload the frontend and **leave two things on the server alone**:

1. **Do NOT overwrite `api/`** — it holds your server/database settings
   (`config.local.php`). Overwriting can break the "Shared Sadguru-Smaran" sharing.
2. **Do NOT overwrite `uploads/`** — it holds devotees' submitted photos.
   Your local copy is older; overwriting would delete newer submissions.

In Cyberduck, turn on **View → Show Hidden Files** so `.htaccess` is visible.

---

## ✅ UPLOAD — overwrite these (frontend + PWA)

### Folders (upload the whole folder)
- [ ] `assets/`   *(all images + the app bundle + styles — largest, ~17 MB)*
- [ ] `home/`     *(contains home/index.html)*
- [ ] `data/`     *(excerpts fallback list)*

### Root files
- [ ] `index.html`
- [ ] `.htaccess`   ← **important** (needs "Show Hidden Files")
- [ ] `sw.js`
- [ ] `manifest.webmanifest`
- [ ] `registerSW.js`
- [ ] `workbox-9c191d2f.js`
- [ ] `section-banner-overrides.css`
- [ ] `excerpts-playlist.js`
- [ ] `charitra-special.js`
- [ ] `virah-first-avatar.js`
- [ ] `home-scroll-button.js`
- [ ] `satsang-bookmarks.js`
- [ ] `virah-layout.js`
- [ ] `hindi-titles.js`
- [ ] `home-slideshow-overrides.js`
- [ ] `charan-carousel-polish.js`
- [ ] `sadguru-smaran-cta.js`
- [ ] `closing-blessing.js`   ← **new file this round**
- [ ] `image-loading-optimizations.js`
- [ ] `favicon.ico`
- [ ] `apple-touch-icon.png`
- [ ] `pwa-192x192.png`
- [ ] `pwa-512x512.png`
- [ ] `pwa-maskable-512x512.png`
- [ ] `placeholder.svg`
- [ ] `robots.txt`

---

## ⛔ LEAVE ON THE SERVER (do not touch)
- `api/`       — PHP backend + your live settings
- `uploads/`   — devotees' submitted photos

---

## 🚫 NEVER UPLOAD (dev / tooling — not part of the website)
`.git`  `.claude`  `.agents`  `scripts/`  `.editorconfig`  `.local-server.ps1`
`open-local-preview.bat`  `start-local-server.bat`  `pre-deploy-check.bat`
`LAUNCH_CHECKLIST.md`  `DEPLOY-CHECKLIST.md`  `tmp-excerpts-combined.json`

---

## After uploading
- [ ] Open the live site → **hard-refresh** (Ctrl + Shift + R).
      On phone: fully close and reopen the app.
- [ ] **Home page** (scroll straight down): Satsang-Ansh is **NOT** dangling at
      the very bottom anymore.
- [ ] **Classic page:** **सत्संग-अंश** appears **right after सत्संग** (Satsang),
      as a **compact list** with a **"Show all / Show fewer"** button.
- [ ] **Classic page ends** with **Quotes (दिव्य वाणी) → 🌸 श्री सद्गुरुनाथ महाराज
      की जय** (the small "Made for स्वान्तः सुखाय" line is gone).
- [ ] The **nav shows सिद्धबाड़ी रेखाचित्र** (renamed from Sidhbari Leela).
- [ ] Open the **☰ menu** on mobile → सत्संग-अंश appears and closes the menu on tap.

The service-worker version was bumped, so once each visitor hard-refreshes (or
reopens the app) once, everyone auto-updates from then on.

---

## Optional / later
- **Clean stale files on server:** some old images were removed locally. To mirror
  deletions, right-click **`assets/` only** in Cyberduck → **Synchronize**.
  Never Synchronize the site root (it could touch `uploads/`).
- **Back up this folder:** right-click `Omshrisadguravenamah` → *Send to →
  Compressed (zip)* and keep it safe (this work is not in git).
- **Update GitHub later** (optional): the repo `smriti123/omshrisadguravenamah`
  is the old version; refreshing it is a separate task and not needed to deploy.
