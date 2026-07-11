(() => {
  /*
    Floating "मुख्य पृष्ठ" (Home) button.
    Appears whenever the visitor scrolls UP on a long page, giving a quick,
    obvious way back to the landing page (/) — helpful when someone is deep in a
    section and wants to return home without opening the menu.
    Self-contained: injects its own styles + element. To remove, delete this file
    and its <script> tag in index.html.
  */
  const HOME_URL = "/";

  function init() {
    if (document.getElementById("home-scroll-fab")) return;

  const style = document.createElement("style");
  style.textContent = `
    #home-scroll-fab {
      position: fixed;
      left: 50%;
      bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
      z-index: 60;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      min-height: 2.9rem;
      padding: 0.6rem 1.2rem;
      border: 1px solid rgba(255, 243, 217, 0.5);
      border-radius: 999px;
      background: linear-gradient(180deg, #c47d24, #915023);
      color: #fff8e8;
      font-family: "Tiro Devanagari Sanskrit", "Noto Serif Devanagari", serif;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1;
      box-shadow: 0 10px 24px rgba(92, 47, 24, 0.28);
      cursor: pointer;
      opacity: 0;
      transform: translate(-50%, 1.4rem);
      pointer-events: none;
      transition: opacity 260ms ease, transform 260ms ease;
    }

    #home-scroll-fab.is-visible {
      opacity: 1;
      transform: translate(-50%, 0);
      pointer-events: auto;
    }

    #home-scroll-fab:hover,
    #home-scroll-fab:focus-visible {
      background: linear-gradient(180deg, #d28b2e, #9b5a28);
      outline: none;
    }

    #home-scroll-fab .home-scroll-fab__icon {
      font-size: 1.15rem;
      line-height: 1;
    }

    @media (min-width: 768px) {
      #home-scroll-fab {
        left: auto;
        right: 1.5rem;
        transform: translate(0, 1.4rem);
      }
      #home-scroll-fab.is-visible {
        transform: translate(0, 0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #home-scroll-fab { transition: opacity 200ms ease; }
    }
  `;
  document.head.appendChild(style);

  const btn = document.createElement("button");
  btn.id = "home-scroll-fab";
  btn.type = "button";
  btn.setAttribute("aria-label", "मुख्य पृष्ठ पर जाएँ");
  btn.innerHTML =
    '<span class="home-scroll-fab__icon" aria-hidden="true">⌂</span><span>मुख्य पृष्ठ</span>';
  btn.addEventListener("click", () => {
    window.location.href = HOME_URL;
  });
  document.body.appendChild(btn);

  const SHOW_AFTER = 320; // only once the visitor has scrolled down this far
  const DELTA = 6; // ignore tiny scroll jitter
  const HIDE_DELAY = 2800; // auto-hide after this much inactivity
  let lastY = window.scrollY || window.pageYOffset || 0;
  let ticking = false;
  let hideTimer = null;

  const hide = () => btn.classList.remove("is-visible");
  const show = () => {
    btn.classList.add("is-visible");
    if (hideTimer) window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(hide, HIDE_DELAY);
  };

  const evaluate = () => {
    ticking = false;
    const y = window.scrollY || window.pageYOffset || 0;
    const diff = y - lastY;
    if (Math.abs(diff) >= DELTA) {
      if (diff < 0 && y > SHOW_AFTER) {
        show(); // scrolling up, and not near the very top
      } else if (diff > 0) {
        hide(); // scrolling down
      }
      lastY = y;
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(evaluate);
      }
    },
    { passive: true },
  );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
