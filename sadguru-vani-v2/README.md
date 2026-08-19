# Sadguru Vani — सद्गुरु वाणी

An independent installable PWA for the complete Satsang catalogue of Param Pujya Swami Subodhanand Saraswati Ji.

## Local preview

From the website root, start the existing local server and open:

`http://127.0.0.1:5500/sadguru-vani/`

## Included features

- Three-level navigation: scripture category → chapter/series → individual talks
- Senior-friendly full-row navigation with no horizontal category scroller or precision-only controls
- 83 chapters/series plus Satsang-Ansh, grouped for simple navigation
- Full ordered playlist contents loaded through YouTube's embedded-player playlist navigation (the same mechanism used by the main website)
- Search by title, category, location, and year
- YouTube and YouTube-playlist playback
- Dedicated player screen with previous/next catalogue navigation
- Unified Manan notebook with multiple notes per talk, optional playback timestamps, listened state, and continue listening
- Not listened / partial / listened filters
- Automatic listening progress and completion tracking
- Neutral reference design without daily, popular, trending, suggested, or recommendation sections
- Installable PWA with offline interface and offline catalogue

Video playback requires an internet connection because YouTube media is not copied into the PWA cache.

Future transcript support is documented in `TRANSCRIPT-ARCHITECTURE.md`. The limited sample investigation is in `TRANSCRIPT-FEASIBILITY.md`; no transcripts were imported.

## Deployment

Upload the complete `sadguru-vani` folder, the website's canonical `data/satsang-talks.json` and `data/excerpts-playlist-fallback.json` files, and the shared Swamiji portrait. The app reads those shared files instead of maintaining duplicate catalogues. It will be available at `/sadguru-vani/`.

When app files change later, increment `CACHE_NAME` in `sw.js` and the `?v=` values in `index.html` and `sw.js`.
