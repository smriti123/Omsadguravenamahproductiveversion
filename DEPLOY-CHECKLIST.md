# 🚀 Deploy Checklist — Cyberduck Upload

**Site:** ॐ श्री सद्गुरवे नमः
**How:** Upload the FRONTEND files below to your website's root folder
(`public_html/` or `www/` or `htdocs/` — wherever the site currently lives).

> This file is just for you — **do NOT upload this checklist itself** to the server.

---

## 📖 HOW-TO — read this if you're on your own (no assistant)

*This section never goes stale — it explains the two things people get wrong.*

### A. The service-worker cache (`sw.js`) — the golden rule

The site is a PWA: phones and browsers **save a copy of the old files** and keep
showing them. If you upload new files but don't tell the app they changed, people
keep seeing the **old** site. `sw.js` is what controls this.

**Every single deploy, no exceptions:**

1. **Bump the cache version** at the top of `sw.js`:
   `const CACHE_VERSION = "2026-07-23-208";` → change it to a **new** value.
   Use today's date + a number, e.g. `"2026-07-24-209"`. Any new value works; it
   just has to be **different from the last one**. This one line is what makes
   every phone throw away the old copy and fetch the new files.
2. **Always upload `sw.js`** (even if you think you only changed an image). If you
   forget it, the version never changes and nobody sees your update.
3. For every code file you changed (`.js` / `.css`), its **`?v=` number must match
   in THREE places**: `index.html`, `home/index.html`, and the list inside `sw.js`.
   If they disagree, the site can load a stale script. (When the assistant bumps a
   file it always does all three — do the same by hand.)
4. Any **brand-new file or image** must also be **added to the list inside `sw.js`**
   (the `APP_SHELL` array), or it won't work offline / on a reopened app.
5. **After uploading:** on your phone, **fully close the app and reopen it**; on a
   computer, hard-refresh with **Ctrl + Shift + R**. Then check your change is there.

> Quick sanity check: did I upload `sw.js`? Did I change `CACHE_VERSION`? If both
> are "yes", the update will reach everyone. If either is "no", it won't.

### B. How to add or replace a सद्गुरु कैलेंडर (Divya Vani) quote

All the quotes are one list in **`quotes-carousel.js`** — the `QUOTES` array near the
top. Each line is: `{ day: 3, img: "/assets2/quote-03-0307.jpg" },`
(the `day` is the day of the month it shows on).

**Steps:**

1. **Shrink the image first.** Photos from WhatsApp/phone are often 2–3 MB, which is
   too heavy. Aim for **under ~350 KB** (roughly 1600 px on the longest side, saved
   as JPEG). *(The assistant does this automatically; by hand, any photo editor's
   "resize + save as JPEG, quality ~85" is fine.)*
2. **Put the image in the `assets2/` folder** (not the big `assets/` folder). Give it
   a clear, **new** name — e.g. `quote-27.jpg`. When **replacing** a day's photo, use
   a **different filename** than the old one (e.g. add a number). Reusing the same
   name can make phones show the old picture from cache.
3. **Edit `quotes-carousel.js`:** add a new `{ day: N, img: "/assets2/your-file.jpg" },`
   line, or change the `img` on an existing day to replace it.
4. **Add the image path to `sw.js`** (the quote-images part of the `APP_SHELL` list),
   so it works offline — e.g. `"/assets2/quote-27.jpg",`.
5. **Bump versions:** raise `quotes-carousel.js?v=` in `index.html`, `home/index.html`
   **and** `sw.js`, and bump `CACHE_VERSION` in `sw.js` (rule A above).
6. **Upload:** `quotes-carousel.js`, `index.html`, `home/index.html`, `sw.js`, and your
   new image(s) into `assets2/`. (`assets2/` already exists on the server — just drop
   the new files in; you never re-upload the whole `assets/` folder.)

**Good to know:** a quote **only appears on and after its own date**. So you can load a
whole month ahead of time and each day unlocks itself — no need to deploy daily.

---

> **This is the single upload checklist.** (The old `UPLOAD-LIST.txt` was removed
> so the two can't disagree.)

## ⚠️ Read first — the safety rules
**Before you start:** make a **zip backup** of this whole folder (right-click →
Send to → Compressed). This work is not in git, so the zip is your only undo.

This batch is mostly frontend, **plus a small backend fix** (admin-delete for
Sadguru-Smaran). So this time you DO upload two files inside `api/` — but you must
still **never touch two things**:

1. **NEVER overwrite `api/config.local.php`** — it holds your live database + admin
   passwords. (You will upload `api/index.php` and `api/.htaccess`, but **not** this file.)
2. **NEVER overwrite `uploads/`** — devotees' submitted photos. Your local copy is
   older; overwriting would delete newer submissions.

In Cyberduck, turn on **View → Show Hidden Files** so `.htaccess` is visible.

---

## ✅ UPLOAD — overwrite these (frontend + PWA)

### Folders (upload the whole folder)
- [x] `assets/`   *(all images + the app bundle + styles — largest, ~17 MB)*
- [x] `home/`     *(contains home/index.html)*
- [x] `data/`     *(excerpts fallback + Satsang search list)*

### Root files
- [x] `index.html`
- [x] `.htaccess`   ← **important** (needs "Show Hidden Files")
- [x] `sw.js`
- [x] `manifest.webmanifest`
- [x] `registerSW.js`
- [x] `workbox-9c191d2f.js`
- [x] `section-banner-overrides.css`
- [x] `excerpts-playlist.js`
- [x] `charitra-special.js`
- [x] `virah-first-avatar.js`
- [x] `home-scroll-button.js`
- [x] `satsang-bookmarks.js`
- [x] `virah-layout.js`
- [x] `hindi-titles.js`
- [x] `home-slideshow-overrides.js`
- [x] `charan-carousel-polish.js`
- [x] `sadguru-smaran-cta.js`
- [x] `my-photos.js`   ← **new file (private on-device photo section — "मेरी निजी तस्वीरें")**
- [x] `quotes-carousel.js`   ← **new file (Divya Vani daily quote card)**
- [x] `quick-jump.js`   ← **new file (sticky section chip-bar on the classic page)**
- [x] `ios-tap-fix.js`   ← **new file (iPhone button fix; no-op on Android)**
- [x] `closing-blessing.js`
- [x] `reading-size.js`
- [x] `satsang-search.js`
- [x] `image-loading-optimizations.js`
- [x] `favicon.ico`
- [x] `apple-touch-icon.png`
- [x] `pwa-192x192.png`
- [x] `pwa-512x512.png`
- [x] `pwa-maskable-512x512.png`
- [x] `placeholder.svg`
- [x] `robots.txt`

### Backend — this batch's admin-delete fix (inside `api/`)
- [x] `api/index.php`
- [x] `api/.htaccess`   ← needs "Show Hidden Files"

---

## ⛔ LEAVE ON THE SERVER (do not touch)
- `api/config.local.php`   — your live DB + admin passwords (**never** overwrite)
- `uploads/`               — devotees' submitted photos

---

## 🚫 NEVER UPLOAD (dev / tooling — not part of the website)
`.git`  `.claude`  `.agents`  `scripts/`  `.editorconfig`  `.local-server.ps1`
`open-local-preview.bat`  `start-local-server.bat`  `pre-deploy-check.bat`
`LAUNCH_CHECKLIST.md`  `DEPLOY-CHECKLIST.md`  `tmp-excerpts-combined.json`

---

## After uploading
- [x] Open the live site → **hard-refresh** (Ctrl + Shift + R).
      On phone: fully close and reopen the app.
- [x] **Home page** (scroll straight down): Satsang-Ansh is **NOT** dangling at
      the very bottom anymore.
- [x] **Classic page:** **सत्संग-अंश** appears **right after सत्संग** (Satsang),
      as a **compact list** with a **"Show all / Show fewer"** button.
- [x] **Classic page ends** with **Quotes (दिव्य वाणी) → 🌸 श्री सद्गुरुनाथ महाराज
      की जय** (the small "Made for स्वान्तः सुखाय" line is gone).
- [x] The **nav shows सिद्धबाड़ी कालरेखा** (renamed from Sidhbari Leela).
- [x] Open the **☰ menu** on mobile → सत्संग-अंश appears and closes the menu on tap.

### 🔼 NEXT DEPLOY — PENDING (last deployed 17 Jul; includes 18–21 Jul changes):
**Upload these 13 frontend files + 1 data file + 1 backend file (`api/index.php`):**
`index.html`, `home/index.html`, `assets/index-wjuQPPKu.js` (the app bundle),
`section-banner-overrides.css`, `sw.js`, `quotes-carousel.js`, `home-scroll-button.js`,
`satsang-bookmarks.js`, `charitra-special.js`, `excerpts-playlist.js`,
`sadguru-smaran-cta.js`, `pwa-home-on-open.js` (**new file**),
`timeline-photo-viewer.js` (**new file**),
and `data/satsang-talks.json` (drop into the `data/` folder — powers Satsang search).
*(SW cache → `2026-07-23-208`. **PLUS 3 new images** into `assets/`:
`assets/brahmachari-with-gurudev.jpg`, `assets/return-to-sidhbari-1988.jpg`, and
`assets/gurudev-mahasamadhi-timeline.jpg` — just drop these into the server's `assets/`.)*

> ⚠️ Both **new files** must be uploaded or the features silently do nothing:
> `timeline-photo-viewer.js` (timeline photo enlarge) and `pwa-home-on-open.js`.

> 🆕 **Plus the `assets2/` folder** (now holds the Charitra-Jhalak photos AND the new
> सद्गुरु कैलेंडर quote images — see 23 Jul below). Upload the **whole folder** to the site
> root, next to `assets/`. It exists so new photos can be sent on their own — you never
> need to re-upload the ~17 MB `assets/` folder for them.

> 🔧 **Plus one backend file this time: `api/index.php`** (brings back the सद्गुरु-स्मरण
> posts that were being hidden after 30 days). Uploading it is safe — but as always
> **never overwrite `api/config.local.php`** (your DB + admin passwords) or `uploads/`.

---

### ⭐ 23 July 2026 — today's changes (NOT yet deployed)
*Files touched today: `quotes-carousel.js` (v9), `index.html`, `home/index.html`,
`sw.js` (cache `2026-07-23-208`), plus **7 new quote images in `assets2/`**.*

- [ ] **सद्गुरु कैलेंडर — new quote images added / replaced.** The **3 July** quote is
      replaced with the new one (0307), and **21–26 July** now have their own quotes
      (they were missing — the calendar stopped at the 20th). Each still unlocks only on
      its own date. New images live in `assets2/` (`quote-03-0307.jpg`,
      `quote-21.jpg` … `quote-26.jpg`), converted from the big originals down to
      ~130–310 KB each. (`quotes-carousel.js` + `assets2/`)
- [ ] **सद्गुरु कैलेंडर — back/forward arrows are smooth now.** Tapping the ‹ back (or ›)
      arrow used to rebuild the whole card, so it blinked, the photo box briefly
      collapsed, and the arrow "lost" your press. Now only the photo and date change —
      the new photo cross-fades in and the arrow keeps focus, so paging through days is
      smooth. (`quotes-carousel.js`)

---

### ⭐ 21 July 2026 — earlier changes (NOT yet deployed)
*Files touched today: `excerpts-playlist.js` (v30), `sadguru-smaran-cta.js` (v10),
`charitra-special.js` (v50), `section-banner-overrides.css` (v131), `index.html`,
`home/index.html`, `sw.js` (cache `2026-07-21-207`), **`api/index.php`**,
plus the **new `assets2/` folder**.*

- [ ] **Charitra-Jhalak — 4 new photos added.** `सभागार` (Sabhaghar) into
      **ॐ दृढ़प्रतिज्ञे नमः**; one more group photo into **ॐ शिष्यप्रियाय नमः**; and the two
      Shivraj Singh Chouhan photos into **ॐ अद्वितीयाय नमः**. They appear in each
      category's photo grid when you open that category, and enlarge on tap like the
      others. (`charitra-special.js` + new `assets2/` folder)

- [ ] **सद्गुरु-स्मरण posts no longer disappear after 30 days.** Two posts seemed to have
      been "deleted" — they were **not**. Nothing on the site ever auto-deletes: there is
      no cleanup job, and no code that removes photos. What the backend had was a
      **30-day display filter** (`api/index.php`) that quietly **hid** approved posts once
      they turned 30 days old. The rows stayed in the database and the photos stayed in
      `uploads/` the whole time. That filter is now **removed**, so approved posts stay on
      the wall permanently and come down **only** when you delete them yourself from the
      admin panel. **The two missing posts should reappear as soon as `api/index.php` is
      uploaded** — nothing needs restoring. (`api/index.php`)

- [ ] **सत्संग-अंश "Resume last excerpt" now really resumes.** It used to reopen the
      excerpt from the **beginning** — it only remembered *which* excerpt you tapped, not
      where you were. It now saves your position (every 10 seconds while playing, and on
      pause / finish / closing the app) and starts from there, exactly like Satsang
      already did. Saved on this device only. (`excerpts-playlist.js`)
- [ ] **सद्गुरु-स्मरण wall — "पुराने संस्मरण देखें" (show older).** Now that posts stay
      forever, the wall shows the **newest 6** and collapses the rest behind a gold
      **"पुराने संस्मरण देखें (N)"** button, where N is how many are hidden. Tapping it
      opens them all; the button then reads **"कम दिखाएँ"** and collapses again. With 6
      posts or fewer the button doesn't appear at all. Nothing is hidden permanently —
      every post is always one tap away. (`sadguru-smaran-cta.js` +
      `section-banner-overrides.css`)
- [ ] **सद्गुरु-स्मरण card — devotees' message text is bigger.** The message was the
      smallest text on the card (14px) even though it's the heart of the post; now 1rem,
      easier for older devotees. The ruled lines behind it are unchanged and still line
      up. (`section-banner-overrides.css`)
- [ ] **सद्गुरु-स्मरण card — photo can be opened without a mouse.** Tapping a card photo
      opened it full-screen, but only by mouse/touch — keyboard users couldn't reach it
      at all. The photo is now properly focusable and labelled, opens with Enter or
      Space, shows a gold focus ring, and when you close the viewer the focus returns to
      the photo you came from (it used to be left behind the dialog).
      (`sadguru-smaran-cta.js` + `section-banner-overrides.css`)
- [ ] **Resume buttons now truly identical.** Satsang's "▶ Resume last talk" and
      Satsang-Ansh's "▶ Resume last excerpt" were *nearly* matched before but differed in
      three ways, now all fixed: same **width** (both capped and centred at 34rem — the
      Satsang-Ansh one used to stretch the full width on desktop), same **wording**
      ("…title — from 3:24"), and both now stay hidden **until you're at least 5 seconds
      in** (Satsang already did this; Satsang-Ansh would have shown "from 0:02").
      (`section-banner-overrides.css` + `excerpts-playlist.js`)
- [ ] **Finished excerpts restart from the beginning** rather than dropping you at the
      last second — anything within 15 seconds of the end resets to 0.

**Check after deploy:** play an excerpt past ~30s → leave → the Resume button shows
"— from 0:34" and starts there. Play one to the very end → Resume shows no timestamp and
starts over. Compare the two Resume buttons side by side on a wide screen — same width.
**And check the सद्गुरु-स्मरण wall: the 2 older posts should be back**, and if there are
more than 6 posts, the **"पुराने संस्मरण देखें"** button appears and opens them.
**Then open the 3 Charitra-Jhalak categories** (ॐ दृढ़प्रतिज्ञे, ॐ शिष्यप्रियाय, ॐ अद्वितीयाय)
and confirm the new photos show — if a photo box is blank, `assets2/` didn't upload.

---

### 🗓 18–20 July 2026 — also pending (not yet deployed)

- [ ] **Sidhbari timeline — new Gurudev Mahasamadhi card:** added a card dated
      3 August 1993 with the mantra **ॐ श्री चिन्मय सद्गुरवे नमः ।।** shown big & bold,
      plus the Mahasamadhi photo, placed after "Sanyasa Deeksha (1990)". (bundle + image)
- [ ] **Sidhbari timeline — swapped two cards:** "President of CTT (1994)" now comes
      before "Regional Head, North India (1991)". (bundle)
- [ ] **Sidhbari timeline — removed photo** from "Appointed Trustee & Acharya
      (19 Sept 1988)". (bundle)
- [ ] **Sidhbari Kaalrekha timeline — two photos:** the **Brahmachari Deeksha**
      (11 Sept 1983) box now shows Swamiji-as-Brahmachari-with-Gurudev (replacing the
      shared portrait); the **Return to Sidhbari** (14 Sept 1988) box now shows the
      Br2 group-walking photo (it had no photo before). (app bundle + 2 new images)

- [ ] **Sidhbari Kaalrekha (सिद्धबाड़ी कालरेखा) banner:** added a highlighted first line
      **🌸 सिद्धबाड़ी आश्रम मन राता 🌸** (larger font, flower emoji) above the existing
      banner text. Also in the intro: "हमारे हृदय-सम्राट" → **"सबके हृदय-सम्राट"**, and
      "पूर्णतः समेट नहीं सकता" → **"पूर्णतः प्रस्तुत नहीं कर सकता"**. (app bundle)
- [ ] **ॐ वेदान्तवेद्याय banner (Charitra-Jhalak):** now reads
      **"जिनकी वाणी से झर-झर अमृत झरता हो — अमृतभाषणः।"** — "जिसकी"→"जिनकी", ending
      "अमृतभाषी"→"अमृतभाषणः", the **whole verse line** set in a clear serif (the display
      font made letters ambiguous, e.g. झर→दर), and **झर-झर** kept in a gold accent.
      (`charitra-special.js` + `section-banner-overrides.css`)
- [ ] **ॐ वेदान्तवेद्याय — photo order:** the podium/discourse photo (`vedant-5`, the one
      with the mic + Radha-Krishna backdrop + अज्ञानतिमिरान्धस्य shloka on the image) is
      now the **first** photo in that category. (app bundle)
- [ ] **Sidhbari Kaalrekha timeline — tap a photo to enlarge:** the timeline photos now
      open full-screen when tapped, with the same big round × close button used
      elsewhere (backdrop tap or Esc also closes). (`timeline-photo-viewer.js` **new file**
      + `section-banner-overrides.css`)
- [ ] **Sidhbari Kaalrekha timeline — date readability:** the dates on the timeline
      cards were faint gold (hard for seniors); now a darker rich-brown, slightly
      bolder and larger, still warm/elegant. (`section-banner-overrides.css`)
- [ ] **Charan-Vandan 5th photo caption** corrected/completed to the Sanskrit shloka
      **प्रणतदेहिनां पापकर्षणं तव चरणम्** (was the incomplete "प्रणतदेहिनां पापकर्शनंः").
      (in the app bundle `assets/index-wjuQPPKu.js`)

- [ ] **Removed the sticky section chip-bar** (सत्संग · सद्गुरु कैलेंडर · भजन …) on the
      classic page — it overlapped the "मुख्य पृष्ठ" button and was confusing.
      Navigation is still available via the ☰ menu. (`quick-jump.js` is no longer
      loaded; the file stays on the server, just unused — nothing to delete.)
- [ ] **Charan-Vandan carousel — uniform frame:** all 8 photos now show in one
      fixed-size frame (sized to the largest) so it no longer jumps between slides.
      Each photo is shown in full (no cropping); differently-shaped photos get a
      little soft cream space around them. (`section-banner-overrides.css`)

- [ ] **Satsang → Bhagwatam — 3 more playlists + city/year pills:** added
      "Bhagvat 1st Skandh" (Ghaziabad 2018), "Bhagvad katha 1st Canto" (Jabalpur 2019)
      and "Bhagvad katha 1st Canto" (Prayagraj 2020) — all now also **findable in
      Satsang search**. The existing "Bhagvad 6th Skandh/Canto" no longer has
      "Sidhbari May 2010" in its title — the place/year shows in the oval pill below.
- [ ] **City/year moved out of titles:** "Ram Charitra" (was "…at Sidhbari Oct 2017"),
      "Sadhna Panchkam" (Dehradun / Bhavnagar), and "Brahmasutra" (year 1989-1991)
      now show a clean title with the place/year in the pill below.
      (`satsang-bookmarks.js` + `data/satsang-talks.json`)
- [ ] **Installed app opens at मुख्य पृष्ठ:** when you open the app after it's been
      in the background a little while (~1 min), it returns to मुख्य पृष्ठ (home, top)
      instead of resuming mid-page. Quick switches (a few seconds) keep your place.
      Only affects the installed app — the website is unchanged. (`pwa-home-on-open.js`)
- [ ] **Satsang shloka banner:** the तव कथामृतं… shloka is larger, in a Charitra-style
      gold-framed panel (no mandala), with less empty space; stays 2 lines on phones.
- [ ] **Resume buttons match:** the Satsang "▶ Resume last talk" button was restyled to
      look like the Satsang-Ansh "▶ Resume last excerpt" button. *(Finished off on 21 Jul
      — see today's section above.)*
- [ ] **Satsang search icon:** blue 🔍 emoji → theme-gold magnifier.

- [ ] **पावन स्मृतियाँ slideshow — reordered:** the first slide is now the Shivji
      altar photo, then Saraswatiji, then the next two (old 2→1, 3→2, 4→3, 1→4).
- [ ] **Shivji altar photo — full on mobile:** the slideshow was overflowing the
      right edge of the phone screen, cutting off the right-hand photo. It now fits
      the viewport, so **both** side photos (left sepia frame + right standing photo)
      stay fully visible on phones.
- [ ] **Hindi text repaired:** fixed garbled Devanagari (mojibake) in `index.html`,
      `home/index.html`, and the app bundle — the title/labels show correct Hindi again.
- [ ] **home/index.html versions aligned** with index.html (7 scripts + banner-fonts.css)
      so the two pages can't serve mismatched/stale scripts.

- [ ] **सद्गुरु कैलेंडर — photo spacing:** the big empty gaps above and below each quote
      photo are gone. The card now **hugs each photo**, so the space is **minimal and
      consistent** for every quote, whatever its shape (portrait or landscape). The photo
      now loads **eagerly** (it was collapsing to nothing with the tighter frame).
- [ ] **Back-to-home button — labelled + fixed destination:** the bare round ← button
      (fixed top-left) is now a prominent gold **"← मुख्य पृष्ठ"** pill, and it now goes to the
      **first/landing page (`/`)** instead of the section card grid (`/#explore`).

*(Everything below here is already deployed.)*

---

### ⭐ 16 July 2026 — today's changes:
*(These are also detailed further down; this is just today's quick list.)*
- [x] **Nav renamed:** सिद्धबाड़ी रेखाचित्र → **सिद्धबाड़ी कालरेखा**.
- [x] **Satsang list — more title space:** the big empty gap between the round play
      button and the title is gone; titles truncate far less.
- [x] **Satsang list — buttons labelled:** ◐ / ✓ / ✎ now show a word under each icon —
      **◐ आंशिक · ✓ सुना · ✎ मनन** (clear on phones, not just desktop hover).
- [x] **Satsang — "▶ Resume last talk" card:** short English & prominent, with the note
      **"Saved on this device only."** (appears once you've played a talk in-app).
- [x] **Satsang-Ansh — "▶ Resume last excerpt" card (new):** after you play an excerpt,
      a prominent card appears above the duration tabs; tapping it reopens that excerpt.

---

### ✅ 17 July 2026 — DEPLOYED (batch 1):
**Uploaded 9 files:** `index.html`, `sw.js`, `section-banner-overrides.css`,
`sadguru-smaran-cta.js`, `my-photos.js`, `charitra-special.js`, `quotes-carousel.js`,
`hindi-titles.js`, `quick-jump.js`.
**Plus 5 NEW images into `assets/`:** `assets/shishya-priya-1.jpg`,
`assets/shishya-priya-2.jpg`, `assets/quote-16-revised.jpg`, `assets/quote-03-revised.jpg`,
`assets/bhakta-vidya-2-revised.jpg`
(just drop these into the server's `assets/` — no need to re-upload the whole 17 MB
folder).
**Plus a NEW folder `assets/fonts/`** (5 files: `banner-fonts.css` + `bf-3.woff2`,
`bf-7.woff2`, `bf-8.woff2`, `bf-10.woff2`) — the self-hosted banner fonts.
*(SW cache → `2026-07-17-193`.)*

- [x] **Section backgrounds:** every section now has its own soft warm tint + gentle
      shading (Satsang, Quotes, Charitra-Jhalak, Stuti, Charan-Vandan, Sidhbari,
      Sadguru-Smaran, Virah) — no two neighbours the same, and none dull.
- [x] **Sadguru-Smaran shloka plaque:** the opening shloka (यस्य स्मरणमात्रेण…) now sits
      in a framed parchment plaque (faint ॐ + gold rule, larger serif verse); the heading
      **कोई सद्गुरु की बात सुनाए…** no longer clips the top matra of "कोई".
- [x] **Tribute cards (सद्गुरु-स्मरण wall):** **ॐ श्री सद्गुरवे नमः** now at the **top-centre**;
      photo shown at its **natural size** (no empty mat/free space); the ruled "notebook"
      lines appear **only behind the message text**, not under the photo.
- [x] **My Private Photos → now also PDF notes:** section renamed **मेरी निजी तस्वीरें व नोट्स**;
      the button (**Add photo or note**) accepts PDFs — a 📄 card you can Open / 📥 Save /
      🗑 Delete. Still fully on-device/private (never uploaded).
- [x] **Charitra-Jhalak — ॐ शिष्यप्रियाय नमः:** a new banner **आचार्य ✦ माता ✦ पिता ✦ गुरु**
      (stays on one line on phones) **plus two new photos** added to that category.
- [x] **Charitra-Jhalak — enlarge/close:** every photo enlarges on tap, and the close
      button on the enlarged view is now a uniform, prominent ~48px dark circle (×).
- [x] **Divya Vani (सुविचार) — replaced quotes:** the **03-07** and **16-07** pictures are
      updated to the new images (optimized for phones).
- [x] **सद्गुरु कैलेंडर — Share card:** a **📤 कार्ड शेयर करें** button under the card exports the
      whole card (date bar + quote) as one image → phone share sheet (Facebook / Save to
      Photos) or desktop download. **Test on a real phone.**
- [x] **Charitra-Jhalak — banner fonts:** ALL category banners (वेदान्तवेद्याय, शिष्यप्रियाय,
      स्मित ईक्षणाय, सद्गुरुप्रियाय, अद्वितीयाय, भक्तवत्सलाय "He loves…") reframed; Devanagari in
      **Rozha One**, English quotes in **Playfair Display italic**. Fonts are now
      **self-hosted** (`assets/fonts/`) — they work **offline** too. Nothing else changes.
- [x] **सुविचार renamed → सद्गुरु कैलेंडर** in the nav menu and quick-jump chip bar; the section
      header now shows **only "सद्गुरु कैलेंडर"** (the old "Divya Vani · दिव्य वाणी" eyebrow and the
      "हर दिन एक प्रेरणा…" subtitle are hidden). The **ॐ श्री सद्गुरवे नमः** in the card's top bar is enlarged.
- [x] **नमामि स्नेहमूर्तिम् charan divider:** a **नमामि स्नेहमूर्तिम्** heading + lotus, over a
      feet-circle with **ॐ श्री सद्गुरवे नमः** slowly orbiting it (matching the home motif),
      now sits between **सद्गुरु-स्मरण** and **मेरी निजी तस्वीरें**.
- [x] **Tribute photos enlarge on tap** (सद्गुरु-स्मरण) → full-screen with a big × close.
      *(Server-loaded cards — verify on the LIVE site, not local preview.)*
- [x] **Charitra-Jhalak:** "Om santpriyay namah" caption → **ॐ सन्तप्रियाय नमः**; "Nature walk"
      caption removed; the "Being from Andhra Pradesh…" photo **moved** from ॐ अद्वितीयाय to
      ॐ वेदान्तवेद्याय; the shloka card in सद्गुरु-स्मरण is now a wide banner (2-line verse, no ॐ
      watermark, bigger text); सद्गुरु कैलेंडर mantra enlarged.
- [x] **Charitra-Jhalak — त्वमेव विद्या:** the **second** photo in that card (ॐ भक्तवत्सलाय)
      is replaced with the new `vidya` photo.
- [x] **Whole-page centering (mobile):** the site no longer slides off-centre when you
      zoom in/out on a phone (accidental horizontal overflow is clipped at the root).
- [x] **Offline improvements:** the current month's **सद्गुरु कैलेंडर quote images are precached**
      (the calendar works fully offline), and the **banner fonts are self-hosted**
      (no Google dependency; banners keep their fonts offline).

---

### Earlier in this batch (13–15 Jul 2026) — check:
- [x] **iPhone buttons:** on an iPhone, the Satsang search ✕, the player ×, and the
      प्रवचन सूची buttons now respond to taps. (Android unchanged.)
- [x] **Satsang list:** new playlists appear — Bhagwat Geeta "Ch 2 (Jabalpur)" &
      "Ch 12 (Dehradun 2016)", Ramayana "Ram Charitra at Sidhbari Oct 2017" — and
      they're findable in Satsang search.
- [x] **Satsang-Ansh:** a **"Playlists (7)"** tab sits at the END of the duration
      tabs; clicking it shows the 7 प्रकरण playlists (भक्ति, ईश्वर, जीवन, साधना,
      कर्म, वेद-वेदांत, कृपणता).
- [x] **Satsang-Ansh — cleaner cards:** the **"☆ Listen later" / Saved-for-later**
      button is gone from every excerpt card (and the "Saved for later" box is gone);
      each card now shows just the play title + a **YouTube** link.
- [x] **Satsang list — more title space:** the big empty gap between the round play
      button and the talk title is gone (mobile column was reserving 5.8rem for a
      removed preview); titles now use that space and truncate far less.
- [x] **Satsang list — action buttons labelled:** the ◐ / ✓ / ✎ buttons now show a
      small word under each icon — **◐ आंशिक · ✓ सुना · ✎ मनन** — so their meaning is
      clear on phones (not just a desktop hover tooltip). The **▶ सुनें** play button
      is unchanged.
- [x] **Satsang — "Resume last talk" card:** the recently-listened card is now short
      English & prominent — **▶ Resume last talk**, detail "… — from M:SS", small note
      **"Saved on this device only."** (Shows once you've played a talk in-app.)
- [x] **Satsang-Ansh — "Resume last excerpt":** after you play an excerpt, a matching
      prominent card appears above the duration tabs (**▶ Resume last excerpt** + the
      excerpt name); tapping it reopens that excerpt. Private to this device.
- [x] **Charitra Jhalak:** the नन्दनाय photo (ॐ स्मित ईक्षणाय), the "Sabhaghar" photo
      (ॐ दृढ़प्रतिज्ञे) and the Arun-uncle photo (ॐ अद्वितीयाय) are gone; the boat/Ganga
      photo is added to ॐ आनन्दवर्धकाय.
- [x] **Charitra — ॐ स्मित ईक्षणाय captions:** the "He loves out of joy…" photo now
      reads **गुर कर कोमल सील सुभाऊ॥**; the "ॐ स्वयं तेजस्विने" photo now reads
      **नन्दति नन्दति नन्दत्येव।**; the smiling close-up now carries **श्री प्रमोदनाय नमः**.
- [x] **Charitra — photo moved:** the श्री प्रमोदनाय photo left ॐ स्मित ईक्षणाय and now
      appears in **ॐ आनन्दवर्धकाय** with the caption **ॐ स्पर्शविहीनाय नमः।**
- [x] **Charitra — ॐ आनन्दवर्धकाय new photo:** the Ganga/Himalaya photo appears with
      caption **देखि हिमालय गंग तट रीझे**.
- [x] **Charitra — ॐ वेदान्तवेद्याय:** the first "हे शंकर-रूप! हे वेदांत-मूर्ति!" photo
      is gone; a **hero shloka banner** now sits at the top —
      *जिसकी वाणी से झर-झर अमृत झरता हो — अमृतभाषी।* / **ॐ अमृतभाषिणे नमः।**
      The old second "भाष्यकार" quote banner is **removed**; its line now shows as a
      **caption on the भाष्यकार-प्रियाय photo** — *भाष्यकार की शैली दीवाना बना देती है। — परम पूज्य स्वामीजी*.
- [x] **मेरी निजी तस्वीरें (My Private Photos):** a new section appears right after
      सद्गुरु-स्मरण. Test **on a real phone**: tap **फ़ोटो जोड़ें / Add photo** → pick a
      photo → it shows in the grid (stored only on that phone). Tap **📥 गैलरी में सहेजें**
      → the phone's share sheet opens with **Save Image / Save to Photos**. Tap 🗑 to
      delete. Photos are **private** (never on the server) — open the site on another
      device and the grid is empty there. The 🔒 note explains all this to visitors.
- [x] **Divya Vani (सुविचार):** quotes for **16, 17, 18 July** are loaded; each stays
      hidden until its own date, then unlocks automatically (16th → q16, etc.).
- [x] **Sadguru-Smaran form:** the greyed file button is now a clear
      **"📎 Attach a photo"** link that shows the chosen file name.
- [x] **Divya Vani (सुविचार):** now a **daily card** — top bar shows Month · ॐ श्री
      सद्गुरवे नमः · Weekday · dd-mm-yyyy, opens on today's date, with ‹ Prev / date
      picker / Next ›. Future dates stay hidden until their day.
- [x] **Virah-Smaran posts:** lighter cream background + darker text (easier for seniors).
- [x] **Virah-Smaran navigation (30 tributes):** one clear bar above the number grid —
      **[‹ पिछली]  श्रद्धांजलि N / 30  [अगली ›]** — with पिछली & अगली **together** (left/right)
      and the count in the middle (current number in a gold pill). पिछली is greyed on #1,
      अगली greyed on #30. Tapping पिछली/अगली or any number moves through all 30 and the
      counter updates. The old tiny “N of 30 tributes” line is hidden.
- [x] **Admin delete:** at **/admin/hommages**, the admin password now logs in (the
      "Unauthorized" bug is fixed) and you can delete submissions.
- [x] **Quick-jump bar (classic page):** a sticky row of section chips (सत्संग,
      सुविचार, भजन, सत्संग-अंश, चरित्र, स्तुति, विरह, स्मरण) rides at the top and
      highlights the section you're in; the back arrow stays clear of it.
- [x] **Bigger default reading size:** text starts a touch larger (110%); the
      size control still adjusts and resets to this.
- [x] **Softer contrast:** headings/muted text are a little darker on cream for
      easier reading, without losing the devotional look.
- [x] **Tribute wall framing:** every uploaded Sadguru-Smaran photo now sits in
      the **same portrait frame** with a cream mat (photos are never cropped);
      cards are still tall for long messages and short for brief ones.

The service-worker version was bumped, so once each visitor hard-refreshes (or
reopens the app) once, everyone auto-updates from then on.

---

## 📅 How to add or replace a Divya Vani (सुविचार) quote yourself

**Quotes repeat every month automatically** — each is tied to the day-of-month
(the day-1 quote shows on the 1st of *every* month, day-16 on the 16th, etc.), so
you never *have* to re-upload; a month with no changes just replays the same daily
quotes. A quote whose date hasn't arrived yet stays hidden until that day.

To add or replace one:
1. **Put the image in `assets/`.** Give it a **new name** each time (e.g.
   `quote-21.jpg`) so phones don't show a stale cached copy. Keep it a small,
   phone-friendly JPG (not a 2 MB photo).
2. **Edit `quotes-carousel.js`** — the `QUOTES` list near the top:
   - change a day: `{ day: 16, img: "/assets/quote-16-revised.jpg" },`
   - add a new day: `{ day: 21, img: "/assets/quote-21.jpg" },`
   (`day` = date of month, 1–31.)
3. **Make it work OFFLINE (recommended).** In `sw.js`, find the **`APP_SHELL`** list —
   the block that already lists the quote pictures (`"/assets/q17.jpg"`,
   `"/assets/q18.jpg"`, `"/assets/quote-16-revised.jpg"`, …). Add one line for your
   new image, keeping the same style (leading `/assets/`, quotes, trailing comma):
   `  "/assets/quote-21.jpg",`
   This precaches the picture so the सुविचार card shows it **even with no internet**.
   *(If you skip this, the quote still works online; offline it just won't appear
   until it's been viewed once.)*
4. **Bump the version in 3 places** (increase each number by 1) so visitors get it:
   - `index.html`: `/quotes-carousel.js?v=6` → `?v=7`
   - `sw.js`: `"/quotes-carousel.js?v=6"` → `"?v=7"` (must match index.html)
   - `sw.js`: `CACHE_VERSION = "2026-07-17-190"` → bump the last number
     (**always** bump this when you touch `sw.js`, including the APP_SHELL edit in step 3)
5. **Upload:** the new image (into `assets/`), plus `quotes-carousel.js`,
   `index.html`, `sw.js`. Then hard-refresh once.

---

## 🔐 Admin — delete visitor-uploaded Sadguru-Smaran photos
- **URL:** **https://omshrisadguravenamah.in/admin/hommages**
- **Password:** the `HOMMAGE_ADMIN_PASSWORD` value inside **`api/config.local.php`
  on the server** (never in the public frontend).
- Log in → moderation queue → **Delete** any submission (removes it **and** its
  photo). Only this page asks for a password; the rest of the site never does — so
  only you can delete.
- ⚠️ Requires this batch's **`api/index.php` + `api/.htaccess`** to be deployed —
  they fix the "Unauthorized" login bug (the server was stripping the auth header).

---

## ⚠️ TROUBLESHOOTING — Service Worker Cache & Observer Loop Issues

**This problem occurred twice (took long to diagnose). Watch for it:**

### Issue 1: Service Worker Cache Version Mismatch
**Symptom:** New code changes don't appear on the site. A feature you added just shows blank / doesn't run.

**Root cause:** The `sw.js` file controls what files the service worker precaches. **Every JavaScript file that changes MUST have its version number updated in THREE places:**
1. `index.html` — e.g., `<script src="/charitra-special.js?v=69"></script>`
2. `home/index.html` — e.g., `<script src="/charitra-special.js?v=69"></script>`
3. `sw.js` — e.g., `"/charitra-special.js?v=69",` in the `APP_SHELL` array

**If they disagree** (one says v=69, another says v=68), the service worker serves the **old cached version** and your new code never runs.

**Fix:**
1. Bump the version (e.g., v=68 → v=69) in **all three** places.
2. Also bump `CACHE_VERSION` at the top of `sw.js` (e.g., `"2026-07-24-225"` → `"2026-07-24-226"`).
3. Hard-refresh the browser: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac).
4. On phones, fully close and reopen the app.

### Issue 2: MutationObserver Feedback Loop (Repeated Console Logs)
**Symptom:** When you click an accordion to expand a section, the browser console spam repeats the same log message over and over (`[charitra-special] Found sadguru priya article: …`). The section works but something keeps firing repeatedly.

**Root cause:** The `charitra-special.js` uses a `MutationObserver` to watch the entire `<body>` for DOM changes and run `enhanceGallery()`. When you click the accordion button:
1. The toggle changes `aria-expanded` and removes `hidden` attribute → DOM mutations
2. Observer fires → `enhanceGallery()` runs and inserts memorial sections
3. Inserting elements → more DOM mutations
4. Observer fires again → repeat (infinite loop)

**Fix:** Add **debouncing** to the observer callback instead of firing immediately on every mutation:
```javascript
let enhanceGalleryTimer = null;

function debounceEnhanceGallery() {
  if (enhanceGalleryTimer !== null) window.clearTimeout(enhanceGalleryTimer);
  enhanceGalleryTimer = window.setTimeout(() => {
    enhanceGalleryTimer = null;
    enhanceGallery();
  }, 100);  // Wait 100ms after mutations stop, then run once
}

// In DOMContentLoaded:
const observer = new MutationObserver(debounceEnhanceGallery);  // Use debounced version
observer.observe(document.body, { childList: true, subtree: true });
```

This way, all DOM mutations pile up during 100ms, then `enhanceGallery()` runs **once** instead of repeatedly.

**Testing after fix:**
- Hard-refresh and click to expand the section → no console spam, section opens cleanly
- Check that memorial features still render (mahasamadhi photos, reflections, etc.)

---

### 2026-07-24 — Om Sadguru Priyaye Namah Memorial Panel (Mahasamadhi Photos)

**What:** Implemented memorial section for Gurudev Mahasamadhi photographs in Charitra-Jhalak → ॐ सद्गुरु प्रियाय नमः.
- Four Mahasamadhi photos grouped together at end of category
- Dedicated memorial frame with warm sacred styling
- Special heading and closing mantra
- 1 column on mobile, 2×2 arrangement on desktop

**Files changed:** `charitra-special.js` (v69→v70), `section-banner-overrides.css` (v146), `index.html`, `home/index.html`, `sw.js` (CACHE_VERSION 225→226)

**Deploy:** Upload `charitra-special.js`, `section-banner-overrides.css`, `index.html`, `home/index.html`, `sw.js`

**Testing:** Hard-refresh → navigate to Charitra-Jhalak → click "ॐ सद्गुरु प्रियाय नमः" to expand → memorial section appears with 4 photos in grid, no console spam when expanding

---

## Optional / later
- **Clean stale files on server:** some old images were removed locally. To mirror
  deletions, right-click **`assets/` only** in Cyberduck → **Synchronize**.
  Never Synchronize the site root (it could touch `uploads/`).
- **Back up this folder:** right-click `Omshrisadguravenamah` → *Send to →
  Compressed (zip)* and keep it safe (this work is not in git).
- **Update GitHub later** (optional): the repo `smriti123/omshrisadguravenamah`
  is the old version; refreshing it is a separate task and not needed to deploy.
