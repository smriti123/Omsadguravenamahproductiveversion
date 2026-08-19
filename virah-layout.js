(() => {
  const playlistId = "PLgy41qSqQO42bitLVDIT5sn9EHGtMkrZO";

  function buildVirahIntroBanner() {
    const banner = document.createElement("div");
    banner.id = "virah-intro-banner";
    banner.className = "virah-intro-banner";
    banner.setAttribute("role", "note");
    banner.innerHTML = `
      <span class="virah-intro-banner__ornament" aria-hidden="true">◆</span>
      <p>परम पूज्य स्वामीजी की महासमाधि पर भक्त-हृदयों से अर्पित कुछ भावपूर्ण श्रद्धांजलियाँ<span class="virah-intro-banner__ellipsis" aria-label="...">...</span></p>
    `;
    return banner;
  }

  function buildVideoSection() {
    const section = document.createElement("section");
    section.id = "bhav-suman-video";
    section.className = "virah-video-section";
    section.innerHTML = `
      <div class="virah-section-divider" aria-hidden="true"></div>
      <div class="virah-video-card">
        <iframe
          src="https://www.youtube.com/embed/videoseries?list=${playlistId}"
          title="भाव-सुमन वीडियो"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          loading="lazy"
        ></iframe>
        <a
          href="https://www.youtube.com/playlist?list=${playlistId}"
          target="_blank"
          rel="noopener noreferrer"
        >YouTube पर देखें</a>
      </div>
    `;
    return section;
  }

  function arrangeVirahSection() {
    const section = document.querySelector("#shraddanjali");
    const container = section?.querySelector(":scope > div");
    if (!container) return;

    const textWalker = document.createTreeWalker(
      section,
      NodeFilter.SHOW_TEXT,
    );

    if (!document.querySelector("#virah-intro-banner")) {
      const heading = Array.from(container.children).find(
        (child) => child.querySelector?.("h2"),
      );
      if (heading) {
        heading.querySelectorAll("p").forEach((subtitle) => {
          if (/[A-Za-z]/.test(subtitle.textContent || "")) subtitle.remove();
        });
        heading.insertAdjacentElement("afterend", buildVirahIntroBanner());
      }
    }
    let textNode;
    while ((textNode = textWalker.nextNode())) {
      if (textNode.nodeValue.includes("भव-सुमन")) {
        textNode.nodeValue = textNode.nodeValue.replaceAll(
          "भव-सुमन",
          "भाव-सुमन",
        );
      }
    }

    const tabBar = Array.from(container.children).find(
      (child) =>
        child.querySelectorAll?.("button").length === 2 &&
        child.textContent.includes("सुमन"),
    );

    if (tabBar) {
      tabBar.remove();
    }

    document.querySelector("#bhav-suman-written-heading")?.remove();

    if (!document.querySelector("#bhav-suman-video")) {
      container.append(buildVideoSection());
    }
  }

  // Mirror a real (React) button's disabled state onto our proxy button.
  function setNavDisabled(btn, disabled) {
    if (disabled) {
      btn.setAttribute("disabled", "");
      btn.classList.add("is-disabled");
    } else {
      btn.removeAttribute("disabled");
      btn.classList.remove("is-disabled");
    }
  }

  // The 30 tributes show one at a time. React's own controls put "Previous" at the
  // far left and "Next" at the far right of a 30-number row that WRAPS — so on a
  // phone the two arrows land rows apart and are easy to mix up. Replace them with
  // one clear paired bar — [‹ पिछली]  श्रद्धांजलि N / 30  [अगली ›] — always together,
  // with the 30 numbers kept below for jumping. Our buttons just click React's (now
  // hidden) real ones, so the pagination logic itself is untouched.
  function enhanceVirahPager() {
    const section = document.querySelector("#shraddanjali");
    if (!section) return;

    const realPrev = section.querySelector(
      'button[aria-label="Previous written tribute"]',
    );
    const realNext = section.querySelector(
      'button[aria-label="Next written tribute"]',
    );
    if (!realPrev || !realNext) return;

    const pager = realPrev.parentElement;
    if (!pager) return;

    const pills = pager.querySelectorAll(
      'button[aria-label^="Show written tribute"]',
    );
    const total = pills.length;
    if (!total) return;
    const active = pager.querySelector('[aria-current="page"]');
    const current = active ? parseInt(active.textContent, 10) || 1 : 1;

    // Hide React's own prev/next (we drive them from our paired bar) and the tiny
    // English "N of 30 tributes" line.
    if (realPrev.style.display !== "none") realPrev.style.display = "none";
    if (realNext.style.display !== "none") realNext.style.display = "none";
    Array.from(section.querySelectorAll("p")).forEach((p) => {
      if (/of\s+\d+\s+tributes/i.test(p.textContent) && p.style.display !== "none") {
        p.style.display = "none";
      }
    });

    // Build the paired nav bar once, right above the number row.
    let bar = section.querySelector(".virah-nav-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "virah-nav-bar";
      bar.innerHTML =
        '<button type="button" class="virah-nav-btn virah-nav-btn--prev" aria-label="पिछली श्रद्धांजलि">' +
          '<span aria-hidden="true">‹</span><span class="virah-nav-btn__text">पिछली</span></button>' +
        '<div class="virah-tribute-counter"></div>' +
        '<button type="button" class="virah-nav-btn virah-nav-btn--next" aria-label="अगली श्रद्धांजलि">' +
          '<span class="virah-nav-btn__text">अगली</span><span aria-hidden="true">›</span></button>';
      bar.querySelector(".virah-nav-btn--prev").addEventListener("click", () => {
        const p = section.querySelector('button[aria-label="Previous written tribute"]');
        if (p && !p.disabled) p.click();
      });
      bar.querySelector(".virah-nav-btn--next").addEventListener("click", () => {
        const n = section.querySelector('button[aria-label="Next written tribute"]');
        if (n && !n.disabled) n.click();
      });
      pager.insertAdjacentElement("beforebegin", bar);
    } else if (bar.nextElementSibling !== pager) {
      pager.insertAdjacentElement("beforebegin", bar);
    }

    // React changes the current tribute by updating attributes/text, not by
    // adding/removing nodes — so the page-level (childList) observer does NOT fire
    // on navigation, and the counter/disabled state would go stale. Wire a one-time
    // delegated click listener that re-syncs the bar a moment after any pagination
    // click (our arrows OR a number pill).
    if (!section.dataset.virahNavWired) {
      section.dataset.virahNavWired = "1";
      section.addEventListener("click", (event) => {
        if (
          event.target.closest(
            '.virah-nav-btn, button[aria-label^="Show written tribute"]',
          )
        ) {
          window.setTimeout(enhanceVirahPager, 60);
          window.setTimeout(enhanceVirahPager, 280);
        }
      });
    }

    // Counter text — only rewrite when the numbers change (this observer watches
    // childList, so rewriting every pass would loop).
    const counter = bar.querySelector(".virah-tribute-counter");
    if (counter.dataset.cur !== String(current) || counter.dataset.total !== String(total)) {
      counter.dataset.cur = String(current);
      counter.dataset.total = String(total);
      counter.innerHTML =
        '<span class="virah-tribute-counter__label">श्रद्धांजलि</span>' +
        ` <span class="virah-tribute-counter__num">${current}</span>` +
        ' <span class="virah-tribute-counter__sep">/</span>' +
        ` <span class="virah-tribute-counter__total">${total}</span>`;
    }

    setNavDisabled(bar.querySelector(".virah-nav-btn--prev"), realPrev.disabled);
    setNavDisabled(bar.querySelector(".virah-nav-btn--next"), realNext.disabled);
    addMissingVirahAttributions();
  }

  function addMissingVirahAttributions() {
    const section = document.querySelector("#shraddanjali");
    const active = section?.querySelector(
      'button[aria-label^="Show written tribute"][aria-current="page"]',
    );
    const current = active ? parseInt(active.textContent, 10) : 0;
    if (current !== 6 && current !== 10) return;

    const author = section.querySelector(
      ".max-w-2xl.mx-auto span.font-display.font-semibold",
    );
    if (author && author.textContent.trim() !== "SBS Iyer") {
      author.textContent = "SBS Iyer";
    }
  }

  function runVirahEnhancements() {
    arrangeVirahSection();
    enhanceVirahPager();
    addMissingVirahAttributions();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(runVirahEnhancements);
    observer.observe(document.body, { childList: true, subtree: true });
    runVirahEnhancements();
  });
})();
