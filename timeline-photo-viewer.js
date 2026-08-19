(() => {
  "use strict";

  // Click-to-enlarge for the Sidhbari Kaalrekha (leela) timeline photos.
  // Opens a full-screen viewer with a close button; click the backdrop, the ×,
  // or press Esc to close. Self-contained — to remove, delete this file + its
  // <script> tag. Styling lives in section-banner-overrides.css.
  const SECTION_ID = "leela";
  const MAHASAMADHI_DATE = "3 August 1993";
  const REGIONAL_HEAD_DATE = "30 October 1991";
  const MAHASAMADHI_SECOND_IMAGE = "/assets/mahasamadhi-2.jpg";
  const SWAMIJI_MAHASAMADHI_DATE = "27 September 2020";
  const SWAMIJI_MAHASAMADHI_TITLE = "Mahasamadhi of Param Pujya Swamiji";
  const SWAMIJI_HOMAGE_IMAGE =
    "/assets2/chinmaya-mission-mahasamadhi-homage.jpg?v=1";
  let overlay = null;
  let lastFocus = null;

  function build() {
    overlay = document.createElement("div");
    overlay.id = "timeline-photo-viewer";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Photo");
    overlay.hidden = true;
    overlay.innerHTML =
      '<button type="button" class="timeline-photo-viewer__close" aria-label="Close">×</button>' +
      '<img class="timeline-photo-viewer__img" alt="" />';
    overlay.addEventListener("click", (event) => {
      if (
        event.target === overlay ||
        event.target.classList.contains("timeline-photo-viewer__close")
      ) {
        close();
      }
    });
    document.body.appendChild(overlay);
  }

  function open(src, alt) {
    if (!overlay) build();
    const img = overlay.querySelector(".timeline-photo-viewer__img");
    img.src = src;
    img.alt = alt || "";
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.documentElement.style.overflow = "hidden";
    overlay.querySelector(".timeline-photo-viewer__close").focus();
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.documentElement.style.overflow = "";
    const img = overlay.querySelector(".timeline-photo-viewer__img");
    if (img) img.src = "";
    if (lastFocus && lastFocus.focus) {
      try { lastFocus.focus(); } catch (e) {}
    }
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  function enhanceMahasamadhiEntry() {
    const section = document.getElementById(SECTION_ID);
    if (!section) return;

    // Keep the timeline chronological: the 1991 appointment must precede
    // Gurudev's 1993 Mahasamadhi entry.
    const dates = Array.from(section.querySelectorAll("time"));
    const regionalHeadDate = dates.find(
      (item) => (item.textContent || "").trim() === REGIONAL_HEAD_DATE,
    );
    const mahasamadhiDate = dates.find(
      (item) => (item.textContent || "").trim() === MAHASAMADHI_DATE,
    );
    const regionalHeadItem = regionalHeadDate?.closest(".timeline-item");
    const mahasamadhiItem = mahasamadhiDate?.closest(".timeline-item");

    if (
      regionalHeadItem &&
      mahasamadhiItem &&
      regionalHeadItem.parentElement === mahasamadhiItem.parentElement &&
      mahasamadhiItem.nextElementSibling === regionalHeadItem
    ) {
      mahasamadhiItem.parentElement.insertBefore(
        regionalHeadItem,
        mahasamadhiItem,
      );
    }

    section.querySelectorAll("p").forEach((paragraph) => {
      if (
        (paragraph.textContent || "").trim() ===
        "फिर भी, कोई भी कालक्रम सबके हृदय-सम्राट की दिव्यता को पूर्णतः प्रस्तुत नहीं कर सकता। यह केवल उनके सिद्धबाड़ी में स्थूल प्रवास की एक विनम्र एवं अनुमानित रूपरेखा प्रस्तुत करने का प्रयास है। उनकी अंतरंग उपस्थिति आज भी असंख्य हृदयों का मार्गदर्शन कर रही है।"
      ) {
        paragraph.textContent =
          "कोई भी कालक्रम सबके हृदय-सम्राट की दिव्यता को पूर्णतः प्रस्तुत नहीं कर सकता। यह केवल उनके सिद्धबाड़ी में स्थूल प्रवास की एक विनम्र एवं अनुमानित रूपरेखा प्रस्तुत करने का प्रयास है। परम पूज्य स्वामीजी की अंतरंग उपस्थिति आज भी असंख्य हृदयों का मार्गदर्शन कर रही है।";
      }
    });

    if (section.querySelector("#mahasamadhi-photo-pair")) return;

    const date = Array.from(section.querySelectorAll("time")).find(
      (item) => (item.textContent || "").trim() === MAHASAMADHI_DATE,
    );
    const card = date?.closest(".timeline-card");
    if (!card) return;

    const title = card.querySelector("h3");
    const firstPhoto = card.querySelector("button:has(img)");
    if (!title || !firstPhoto) return;

    const pair = document.createElement("div");
    pair.id = "mahasamadhi-photo-pair";
    pair.className = "mahasamadhi-photo-pair";
    firstPhoto.insertAdjacentElement("beforebegin", pair);
    pair.append(firstPhoto);

    const secondPhoto = document.createElement("button");
    secondPhoto.type = "button";
    secondPhoto.className = "mahasamadhi-photo-pair__button";
    secondPhoto.setAttribute("aria-label", "Enlarge second Mahasamadhi photo");
    secondPhoto.innerHTML =
      '<img src="' + MAHASAMADHI_SECOND_IMAGE +
      '" alt="Mahasamadhi of Pujya Gurudev — second photo" loading="lazy" />';
    pair.append(secondPhoto);

    pair.insertAdjacentElement("afterend", title);
  }

  function enhanceSwamijiMahasamadhiEntry() {
    const section = document.getElementById(SECTION_ID);
    if (!section) return;

    const date = Array.from(section.querySelectorAll("time")).find(
      (item) => (item.textContent || "").trim() === SWAMIJI_MAHASAMADHI_DATE,
    );
    const card = date?.closest(".timeline-card");
    if (!card) return;

    const title = card.querySelector("h3");
    if (title && title.textContent.trim() !== SWAMIJI_MAHASAMADHI_TITLE) {
      title.textContent = SWAMIJI_MAHASAMADHI_TITLE;
    }

    const description = Array.from(card.querySelectorAll(":scope > p")).find(
      (paragraph) => paragraph.textContent.trim() === "Mahasamadhi",
    );
    if (description) description.remove();

    let homage = card.querySelector("#chinmaya-mission-homage");
    if (!homage) {
      homage = document.createElement("section");
      homage.id = "chinmaya-mission-homage";
      homage.className = "chinmaya-mission-homage";
      homage.innerHTML = `
        <h4>Homage from Chinmaya Mission</h4>
        <button type="button" aria-label="Double-click to enlarge the Chinmaya Mission homage">
          <img
            src="${SWAMIJI_HOMAGE_IMAGE}"
            alt="Homage from Chinmaya Mission on the Mahasamadhi of Param Pujya Swamiji"
            loading="lazy"
          />
        </button>
      `;
      const letter = card.querySelector(".end-of-era-stuti");
      if (letter) card.insertBefore(homage, letter);
      else card.appendChild(homage);

      const trigger = homage.querySelector("button");
      const image = homage.querySelector("img");
      trigger.addEventListener("dblclick", (event) => {
        event.preventDefault();
        open(image.currentSrc || image.src, image.alt);
      });
      trigger.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          open(image.currentSrc || image.src, image.alt);
        }
      });
    } else {
      const letter = card.querySelector(".end-of-era-stuti");
      if (letter && homage.nextElementSibling !== letter) {
        card.insertBefore(homage, letter);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(enhanceMahasamadhiEntry);
    observer.observe(document.body, { childList: true, subtree: true });
    enhanceMahasamadhiEntry();
    const swamijiObserver = new MutationObserver(enhanceSwamijiMahasamadhiEntry);
    swamijiObserver.observe(document.body, { childList: true, subtree: true });
    enhanceSwamijiMahasamadhiEntry();
  });

  // Capture-phase so we open our viewer before the card's own zoom handler runs.
  document.addEventListener(
    "click",
    (event) => {
      const section = document.getElementById(SECTION_ID);
      if (!section || !section.contains(event.target)) return;
      // The tap may land on the <img> itself or on the button/link wrapping it.
      let img = event.target.closest("img");
      if (!img) {
        const trigger = event.target.closest("button, a");
        img = trigger ? trigger.querySelector("img") : null;
      }
      if (!img || !section.contains(img)) return;
      if (img.closest("#chinmaya-mission-homage")) return;
      event.preventDefault();
      event.stopPropagation();
      open(img.currentSrc || img.src, img.alt);
    },
    true,
  );
})();
