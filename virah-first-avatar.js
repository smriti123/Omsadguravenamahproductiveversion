(() => {
  /*
    Show Swami Adhyatmananda's photo in the avatar circle for the FIRST
    Virah-Smaran tribute (his letter). The tribute carousel is a single card
    whose content swaps as you navigate, so we can't target "post 1" with CSS
    alone — instead we watch the card and toggle a class only while its author
    is Adhyatmananda. Every other tribute keeps its default avatar.
    Self-contained: to revert, delete this file + its <script> tag and the
    .virah-photo-avatar CSS block.
  */
  const MATCH = /adhyatmananda|brahamleen/i;
  const FULL = "/assets/virah-adhyatmananda-full.jpg?v=1";

  function apply() {
    const card = document.querySelector(
      "#shraddanjali .max-w-2xl.mx-auto.rounded-2xl",
    );
    if (!card) return;
    const header = card.querySelector(".flex.items-center.gap-3");
    const avatar = header && header.querySelector(".w-9.h-9.rounded-full");
    if (!avatar) return;
    if (MATCH.test(header.textContent || "")) {
      avatar.classList.add("virah-photo-avatar");
      avatar.style.cursor = "zoom-in";
      if (!avatar.getAttribute("title")) {
        avatar.setAttribute("title", "फ़ोटो बड़ा देखें");
      }
      if (avatar.dataset.virahEnlarge !== "true") {
        avatar.addEventListener("click", openLightbox);
        avatar.dataset.virahEnlarge = "true";
      }
    } else {
      avatar.classList.remove("virah-photo-avatar");
    }
  }

  function ensureStyle() {
    if (document.getElementById("virah-avatar-lightbox-style")) return;
    const s = document.createElement("style");
    s.id = "virah-avatar-lightbox-style";
    s.textContent = `
      #virah-avatar-lightbox {
        position: fixed;
        inset: 0;
        z-index: 120;
        display: grid;
        place-items: center;
        padding: 1.25rem;
        background: rgba(20, 8, 0, 0.9);
        cursor: zoom-out;
        animation: virah-lb-fade 180ms ease;
      }
      #virah-avatar-lightbox img {
        max-width: min(92vw, 600px);
        max-height: 86vh;
        border-radius: 14px;
        border: 2px solid rgba(216, 176, 106, 0.6);
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
      }
      #virah-avatar-lightbox .virah-lb-close {
        position: absolute;
        top: 1rem;
        right: 1.1rem;
        width: 2.75rem;
        height: 2.75rem;
        border: 1px solid rgba(255, 220, 160, 0.4);
        border-radius: 999px;
        background: rgba(60, 25, 5, 0.8);
        color: #ffe8b0;
        font-size: 1.8rem;
        line-height: 1;
        cursor: pointer;
      }
      @keyframes virah-lb-fade { from { opacity: 0 } to { opacity: 1 } }
    `;
    document.head.appendChild(s);
  }

  function openLightbox(event) {
    event.preventDefault();
    event.stopPropagation();
    if (document.getElementById("virah-avatar-lightbox")) return;
    ensureStyle();
    const overlay = document.createElement("div");
    overlay.id = "virah-avatar-lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Swami Adhyatmananda");
    const img = document.createElement("img");
    img.src = FULL;
    img.alt = "Swami Adhyatmananda";
    const close = document.createElement("button");
    close.className = "virah-lb-close";
    close.type = "button";
    close.setAttribute("aria-label", "बंद करें");
    close.textContent = "×";
    overlay.appendChild(img);
    overlay.appendChild(close);
    const dismiss = () => {
      overlay.remove();
      document.removeEventListener("keydown", onKey);
    };
    function onKey(e) {
      if (e.key === "Escape") dismiss();
    }
    overlay.addEventListener("click", dismiss);
    document.addEventListener("keydown", onKey);
    document.body.appendChild(overlay);
  }

  function init() {
    // Observe document.body (not #shraddanjali): the section is rendered by
    // React after this script runs, so watching body ensures we catch it — and
    // every later carousel navigation. Coalesced into one frame to stay light.
    let scheduled = false;
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        scheduled = false;
        apply();
      });
    };
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    apply();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
