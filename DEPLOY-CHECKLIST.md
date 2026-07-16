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

## Optional / later
- **Clean stale files on server:** some old images were removed locally. To mirror
  deletions, right-click **`assets/` only** in Cyberduck → **Synchronize**.
  Never Synchronize the site root (it could touch `uploads/`).
- **Back up this folder:** right-click `Omshrisadguravenamah` → *Send to →
  Compressed (zip)* and keep it safe (this work is not in git).
- **Update GitHub later** (optional): the repo `smriti123/omshrisadguravenamah`
  is the old version; refreshing it is a separate task and not needed to deploy.
