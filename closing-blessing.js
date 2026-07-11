(() => {
  // The devotional closing — "ॐ श्री सद्गुरवे नमः … श्री सद्गुरुनाथ महाराज की जय।"
  // — lives inside the immersive home-new experience (served at "/" and
  // "/home-new"), which is why it shows in the installed app. The classic
  // content page (M0, served at "/home" and "/old-home") ends at the small
  // "Made for स्वान्तः सुखाय" footer and never had this blessing. This overlay
  // adds the same closing to the end of the classic page so the site ends the
  // same way everywhere. It is idempotent and never touches the home-new page.
  const BLOCK_ID = "site-closing-blessing";

  function buildClosing() {
    const section = document.createElement("section");
    section.id = BLOCK_ID;
    section.className = "home-new__about";
    section.setAttribute("aria-labelledby", "site-closing-title");

    const heading = document.createElement("h2");
    heading.id = "site-closing-title";
    heading.textContent = "ॐ श्री सद्गुरवे नमः";

    const intro = document.createElement("p");
    intro.textContent =
      "A peaceful digital space created for darshan, remembrance and gratitude at the lotus feet of Pujya Swamiji.";

    const namamiWrap = document.createElement("div");
    namamiWrap.className = "home-new__guru-lines home-new__guru-lines--closing";
    namamiWrap.setAttribute("aria-label", "Namami devotional line");
    const namamiLine = document.createElement("span");
    namamiLine.className = "namami-line sant-durlabham";
    const namamiText = document.createElement("span");
    namamiText.className = "namami-text";
    namamiText.textContent = "नमामि सन्तदुर्लभम्॥";
    namamiLine.append(namamiText);
    namamiWrap.append(namamiLine);

    const om = document.createElement("span");
    om.className = "devotional-om-small namami-om";
    om.setAttribute("aria-hidden", "true");
    om.textContent = "ॐ";

    const jai = document.createElement("div");
    jai.className = "home-new__closing-jai";
    jai.setAttribute("aria-label", "श्री सद्गुरुनाथ महाराज की जय।");
    const flower = document.createElement("span");
    flower.setAttribute("aria-hidden", "true");
    flower.textContent = "🌸";
    const jaiText = document.createElement("strong");
    jaiText.textContent = "श्री सद्गुरुनाथ महाराज की जय।";
    const hands = document.createElement("span");
    hands.setAttribute("aria-hidden", "true");
    hands.textContent = "🙏";
    jai.append(flower, jaiText, hands);

    section.append(heading, intro, namamiWrap, om, jai);
    return section;
  }

  function ensureClosing() {
    // The home-new experience already ends with this blessing — leave it alone.
    if (document.querySelector(".home-new")) return;
    // Already added (and still attached)? Nothing to do.
    if (document.getElementById(BLOCK_ID)) return;

    // Anchor: the classic page's footer ("Made for स्वान्तः सुखाय"). Place the
    // blessing just before it so it reads as the closing, with the small credit
    // line as the final sign-off.
    const footer = document.querySelector(
      ".min-h-screen footer.border-t, .min-h-screen > footer, footer.border-t",
    );
    const block = buildClosing();

    if (footer && footer.parentElement) {
      footer.insertAdjacentElement("beforebegin", block);
      return;
    }

    // No footer yet (still rendering) — retry on the next observer pass rather
    // than dropping the blessing in the wrong place.
  }

  function start() {
    ensureClosing();

    // The classic page is a React app and can re-render (e.g. on navigation),
    // discarding our injected node. A persistent, debounced observer re-adds it
    // whenever it is missing. ensureClosing() is a no-op once present, so this
    // does not loop.
    let scheduled = false;
    const run = () => {
      scheduled = false;
      ensureClosing();
    };
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(run);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
