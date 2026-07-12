# SEO upgrade — PARKED (ready to enable)

**Status:** not active. The site's `<head>` is back to its original state.
**To turn on:** tell Claude *"turn on the SEO change"* (it's applied in seconds), or
follow the steps below by hand.

**What it does (nothing visible on the page):** adds the English name
**Swami Subodhananda Saraswati Ji Maharaj** to the page title, description, and
social tags, plus a `Person` structured-data block — so that Google searches for
"Swami Subodhananda" (in English) can find the site even though it's written in
Hindi. Only the browser tab + Google results + share previews change; the page
design does not.

---

## Apply to BOTH `index.html` and `home/index.html`

**1. Title** — replace `<title>ॐ श्री सद्गुरवे नमः</title>` with:
```
<title>ॐ श्री सद्गुरवे नमः · Swami Subodhananda Saraswati Ji Maharaj</title>
```

**2. Description** — replace the `<meta name="description" ...>` with:
```
<meta name="description" content="Param Pujya Swami Subodhananda Saraswati Ji Maharaj — a devotional space for darshan, satsangs, bhajans, stutis and loving remembrance at his lotus feet.">
```

**3. Add keywords + structured data** right after the description:
```
<meta name="keywords" content="Swami Subodhananda, Swami Subodhanand, Subodhananda Saraswati, स्वामी सुबोधानन्द, Param Pujya Swami Subodhananda Ji Maharaj, satsang, bhajan, stuti">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Swami Subodhananda Saraswati",
  "honorificPrefix": "Param Pujya Swami",
  "honorificSuffix": "Ji Maharaj",
  "alternateName": ["स्वामी सुबोधानन्द सरस्वती", "Swami Subodhanand Saraswati", "Swami Subodhananda", "Subodhananda Saraswati"],
  "description": "Param Pujya Swami Subodhananda Saraswati Ji Maharaj — a revered spiritual master; this site offers darshan, satsangs, bhajans, stutis and remembrance at his lotus feet."
}
</script>
```

**4. Social tags** — update the four meta tags to:
```
<meta property="og:title" content="ॐ श्री सद्गुरवे नमः · Swami Subodhananda Saraswati Ji Maharaj">
<meta name="twitter:title" content="ॐ श्री सद्गुरवे नमः · Swami Subodhananda Saraswati Ji Maharaj">
<meta property="og:description" content="Param Pujya Swami Subodhananda Saraswati Ji Maharaj — darshan, satsangs, bhajans and remembrance at his lotus feet.">
<meta name="twitter:description" content="Param Pujya Swami Subodhananda Saraswati Ji Maharaj — darshan, satsangs, bhajans and remembrance at his lotus feet.">
```

**5.** Bump `CACHE_VERSION` in `sw.js`, and (optional) set up Google Search Console
+ a `sitemap.xml` (needs the live domain).

*(This file is a dev note — it is NOT uploaded to the website.)*
