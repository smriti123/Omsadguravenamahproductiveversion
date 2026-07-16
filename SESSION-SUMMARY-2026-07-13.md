# Work Summary — 13 July 2026

Site: ॐ श्री सद्गुरवे नमः. Everything below is **done and verified locally**; nothing
is live until uploaded (see the Deploy List at the end).

---

## 1. iPhone buttons fixed (search ✕, player ×, प्रवचन सूची, etc.)
**Problem:** On iPhone these buttons did nothing; on Android they worked.
**Cause (found by on-device logging):** iOS Safari fired touchstart/touchend on the
buttons but never the follow-up `click`, so their handlers never ran. (The talk
cards are links, which iOS handles fine — that's why the player *opened* but wouldn't
*close*.)
**Fix:** New file **`ios-tap-fix.js`** — iPhone/iPad only (first line is `if (!isIOS) return;`,
so **Android is 100% untouched**). On a clean tap it dispatches the click iOS was
dropping. Wired into both `index.html` and `home/index.html`.

## 2. Satsang — new playlists added (list + search)
- **Bhagwat Geeta:** "Bhagvad Geeta Ch 2 (Jabalpur)", "Bhagvad Geeta Ch 12 (Dehradun 2016)"
- **Ramayana:** "Ram Charitra at Sidhbari Oct 2017"

Added to the category list (`assets/index-wjuQPPKu.js`) **and** to Satsang search
(`data/satsang-talks.json`).

## 3. Satsang-Ansh — new "Playlists" group
Added a **प्रकरण अनुसार सत्संग** group at the top of Satsang-Ansh with 3 cards —
**भक्ति प्रकरण, ईश्वर प्रकरण, जीवन प्रकरण** — each opens in the in-app player.
(File: `excerpts-playlist.js`.)

## 4. Charitra Jhalak — photo changes
- **ॐ स्मित ईक्षणाय नमः:** removed the pic captioned "श्री नन्दनाय नमः…".
- **ॐ दृढ़प्रतिज्ञे नमः:** removed the last pic captioned "Sabhaghar".
- **ॐ अद्वितीयाय नमः:** removed the Arun Gupta ji photo.
- **ॐ आनन्दवर्धकाय नमः:** added the boat/Ganga photo (`assets/anandvardhakaya-boat.jpg`),
  auto-rotated upright. (Diwali pic kept.)

## 5. Sadguru-Smaran — clearer photo attachment
The greyed native "Choose File" button was hard to notice. Replaced it with a clear
underlined **"📎 Attach a photo"** link that opens the picker and shows the chosen
file name. (File: `sadguru-smaran-cta.js`.)

## 6. Divya Vani (सुविचार) — new daily-card carousel
Replaced the month-grid calendar with a **daily card** (`quotes-carousel.js`):
- **Top bar:** Month + Year · **ॐ श्री सद्गुरवे नमः** · Weekday · dd-mm-yyyy
- **Quote photo**
- **‹ Prev / date picker / Next ›**
- **Defaults to today's date.**
- Quotes are keyed to **day-of-month (1–31)** and **reused every month** — you never
  need to re-upload them monthly.
- 3 new quote images added (compressed from ~2 MB PNG to ~250 KB JPG):
  day 1 = श्रद्धा banner, day 2 = धर्म का फल, day 13 = जप महिमा.

**To add more quote days later:** drop the image in `assets/` and add one line to the
top of `quotes-carousel.js`, e.g. `{ day: 14, img: "/assets/quote-xyz.jpg" },`.
No need to touch the compiled app.

## 7. Virah-Smaran — easier reading for seniors
The tribute posts used a slightly dark tan background with faded text (~5.5:1
contrast). Changed the post background to the lighter cream card colour and the
message text to full strength → **~7–10:1 contrast** (comfortable for seniors),
same warm look. Theme-aware and reversible. (File: `section-banner-overrides.css`.)

## 8. Whole-site polish (contrast, quick-jump, bigger text, lighter photos)
- **Softer contrast site-wide:** headings and muted text nudged darker on cream so
  they read cleanly, without losing the devotional feel.
- **Quick-jump chip bar (classic page):** a sticky row of section chips (सत्संग,
  सुविचार, भजन, सत्संग-अंश, चरित्र, स्तुति, विरह, स्मरण) that highlights the section
  you're in and jumps you there; sits clear of the back arrow. (New: `quick-jump.js`.)
- **Bigger default reading size:** text now starts at 110%; the size control still
  adjusts and its Reset returns to 110%. (File: `reading-size.js`.)
- **Lighter photos:** large images recompressed (smaller downloads, same look).

## 9. Tribute wall — consistent photo framing
Every devotee-uploaded Sadguru-Smaran photo now sits in **one uniform portrait
frame** with a cream mat, so the wall reads curated instead of ragged — whatever the
original photo's shape. Photos are **never cropped** (they're fit inside the frame,
so the guru's face/feet stay whole; the mat fills the rest). Card **height still
flexes with the message** — long tributes get tall cards, short ones stay small —
because the masonry layout and the existing text-length classes handle that. (File:
`section-banner-overrides.css`, `.hommage-parchment-card__image`.)

---

## Important note — TWO home files
The site has **two entry files** that must stay in sync: root **`index.html`** and
**`home/index.html`**. You view the classic page at **`/home`**, which uses
`home/index.html`. Both are updated in this batch.

---

## Deploy List (upload via Cyberduck; leave `api/` and `uploads/` untouched)
```
index.html
home/index.html
sw.js
quotes-carousel.js                (new)
ios-tap-fix.js                    (new)
excerpts-playlist.js
sadguru-smaran-cta.js
charitra-special.js
section-banner-overrides.css
assets/index-wjuQPPKu.js
data/satsang-talks.json
assets/anandvardhakaya-boat.jpg   (new)
assets/quote-shraddha.jpg         (new)
assets/quote-dharma-phal.jpg      (new)
assets/quote-jap-mahima.jpg       (new)
```
After uploading: reopen the app / hard-refresh once. The service-worker version was
bumped, so everyone auto-updates after one refresh.

---

## Do NOT upload
This file (`SESSION-SUMMARY-2026-07-13.md`) — it's just your record.
