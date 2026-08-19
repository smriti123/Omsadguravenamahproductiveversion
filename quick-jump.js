(() => {
  /*
    Sticky "quick-jump" chip bar for the long classic page. It sits just below the
    fixed header and lets visitors reach a section in one tap instead of a long
    scroll. Horizontally scrollable on phones. It only appears on pages that
    actually have these sections (the classic page) — never on the immersive home.
    Self-contained: to remove, delete this file + its <script> tag.
  */
  const CHIPS = [
    { id: "talks", label: "सत्संग" },
    { id: "quotes", label: "सद्गुरु कैलेंडर" },
    { id: "bhajans", label: "भजन" },
    { id: "excerpts", label: "सत्संग-अंश" },
    { id: "photo-gallery2", label: "चरित्र" },
    { id: "stuti", label: "स्तुति" },
    { id: "shraddanjali", label: "विरह" },
    { id: "hommage", label: "स्मरण" },
    { id: "my-photos", label: "मेरा संग्रह" },
    { id: "about-website", label: "About" },
  ];

  let bar = null;
  let scrollTicking = false;
  let mutTicking = false;

  function navHeight() {
    const nav = document.querySelector("nav.fixed, header.fixed");
    return nav ? Math.round(nav.getBoundingClientRect().height) : 56;
  }

  function presentSections() {
    return CHIPS.map((c) => ({ ...c, el: document.getElementById(c.id) })).filter((c) => c.el);
  }

  function build() {
    // A <div role="navigation"> (not a <nav>) on purpose: excerpts-playlist.js
    // auto-injects a "सत्संग-अंश" link into every <nav> that has a #talks link,
    // which would add a stray duplicate chip here.
    bar = document.createElement("div");
    bar.id = "quick-jump-bar";
    bar.setAttribute("role", "navigation");
    bar.setAttribute("aria-label", "अनुभाग — त्वरित लिंक");
    CHIPS.forEach((c) => {
      const a = document.createElement("a");
      a.className = "qj-chip";
      a.href = "#" + c.id;
      a.dataset.target = c.id;
      a.textContent = c.label;
      a.addEventListener("click", (event) => {
        const el = document.getElementById(c.id);
        if (!el) return;
        event.preventDefault();
        const offset = navHeight() + bar.getBoundingClientRect().height + 10;
        const y = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      });
      bar.appendChild(a);
    });
  }

  function updateActive() {
    if (!bar || !bar.isConnected) return;
    const line = window.scrollY + navHeight() + 90;
    let current = null;
    presentSections().forEach((c) => {
      const rect = c.el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      // Highlight a chip only when the reference line is actually inside its
      // section — so nothing lights up at the very top / between sections.
      if (top <= line && top + rect.height > line) current = c.id;
    });
    bar.querySelectorAll(".qj-chip").forEach((chip) => {
      chip.classList.toggle("is-active", chip.dataset.target === current);
    });
  }

  function ensureBar() {
    const sections = presentSections();
    if (sections.length < 2) {
      // Not the classic page (or sections not rendered) — don't show the bar.
      document.getElementById("quick-jump-bar")?.remove();
      return;
    }
    if (!bar) build();
    if (!bar.isConnected) {
      // Place it at the very TOP of the content — just above the topmost section on
      // the page — so it's visible immediately and (being sticky) reserves its own
      // space rather than covering anything.
      const allSections = Array.from(document.querySelectorAll("section[id]"));
      if (!allSections.length) return;
      const anchor = allSections.reduce((a, b) =>
        b.getBoundingClientRect().top < a.getBoundingClientRect().top ? b : a,
      );
      anchor.parentElement.insertBefore(bar, anchor);
    }
    bar.style.top = navHeight() + "px";
    updateActive();
  }

  function start() {
    ensureBar();

    const observer = new MutationObserver(() => {
      if (mutTicking) return;
      mutTicking = true;
      requestAnimationFrame(() => {
        mutTicking = false;
        ensureBar();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener(
      "scroll",
      () => {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
          scrollTicking = false;
          updateActive();
        });
      },
      { passive: true },
    );
    window.addEventListener("resize", () => {
      if (bar) bar.style.top = navHeight() + "px";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
