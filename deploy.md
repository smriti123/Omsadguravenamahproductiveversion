# Deploy Files

## Tag: bhajan banner

- `bhajan-intro-banner.js`
- `section-banner-overrides.css`
- `index.html`
- `home/index.html`
- `sw.js`

---

## Troubleshooting: every Charitra-Jhalak category suddenly looks old

### Symptom

- Sidhbari Kaalrekha and the other website sections still work.
- Every Charitra-Jhalak category falls back to its original/old appearance.
- New captions, inserted photographs, banners, and category enhancements are
  all missing together.

### Important diagnosis

If **all** Charitra categories revert together, do not assume that each
category is broken and do not immediately deploy cache-reset files. First check
whether `charitra-special.js` has stopped parsing.

This happened on 24 July 2026 because JavaScript strings around line 513 used
typographic quotation marks as delimiters:

```javascript
const example = “text”;
```

Curly quotes are valid inside text, but they cannot replace the normal
JavaScript quote delimiters. The browser reported:

```text
Uncaught SyntaxError: Invalid or unexpected token
```

Because a syntax error prevents the entire file from running, every Charitra
enhancement disappeared at once while unrelated sections continued working.

Use plain JavaScript quotes:

```javascript
const example = "text";
```

Curly apostrophes or quotation marks may remain *inside* a correctly quoted
string:

```javascript
const example = "Pujya Gurudev’s darshan";
```

### Recovery procedure

1. Do **not** deploy while the error is still present.
2. Open the browser developer console and reload Charitra-Jhalak.
3. Look for the first `SyntaxError`, `ReferenceError`, or `TypeError`.
4. Note the filename and line number, especially if it points to
   `charitra-special.js`.
5. Inspect that exact line for curly quotes, damaged encoding, an unclosed
   string/template literal, or mismatched brackets.
6. Repair the first parsing error before investigating individual categories.
7. Validate `charitra-special.js` by loading it on a minimal test page or clean
   browser origin. It must report **zero syntax errors**.
8. Bump the `charitra-special.js?v=...` reference in `index.html` and `sw.js`,
   and bump `CACHE_VERSION` in `sw.js`.
9. Test on a previously unused local port, such as:

   ```text
   http://127.0.0.1:5512/home#photo-gallery2
   ```

   A different port is a different browser origin and rules out an older local
   service worker.
10. Confirm that all existing Charitra categories are restored before
    re-enabling or adding a new gallery transformation.

### Quick interpretation

- **All Charitra categories old, other sections fine:** check for a fatal error
  in `charitra-special.js`.
- **Only one category wrong:** inspect that category’s enhancement function.
- **Correct script works on a clean port but not on the usual port:** clear or
  update the old service worker/cache.
- **Console repeatedly logs or the page becomes slow:** check for a
  `MutationObserver` feedback loop and ensure DOM transformations are
  idempotent.

## Troubleshooting: new ॐ सद्गुरु प्रियाय नमः photos appear after the text or Mahasamadhi

The end of this category has a deliberate fixed sequence:

1. all ordinary gallery photographs;
2. `wheelchairnew.jpg`, `gurudevagya-1.jpg`, and `gurudevagya-2.jpg`;
3. the bilingual remembrance text;
4. the titled **परम पूज्य गुरुदेव की महासमाधि** panel and its four photographs.

The last five items are assembled by `stabilizeSadguruPriyayaClosingOrder()` in
`charitra-special.js` inside `.sadguru-priyaya-closing-sequence`. This dedicated
container is necessary because the original gallery uses CSS multi-columns;
CSS `order` alone does not control multi-column placement.

When adding another ordinary photo to **ॐ सद्गुरु प्रियाय नमः**:

- give its card a unique, stable `id`;
- add that `id` to the `closingPhotos` ID list only if the photo is intended to
  sit directly before the remembrance text;
- keep the required append order exactly
  `closingPhotos → reflection → memorial`;
- keep `.sadguru-priyaya-closing-sequence` as the last child of the open
  category panel;
- do not append anything directly after the Mahasamadhi panel;
- keep the DOM transformation idempotent so the `MutationObserver` does not
  create a feedback loop;
- bump the `charitra-special.js` version in both `index.html` and
  `home/index.html`, update the matching entry in `sw.js`, and bump the service
  worker/cache versions.

After changing the photo list, test on both mobile and desktop and confirm the
visible order is always:

```text
all photos → closing photos → bilingual text → Mahasamadhi
```
