(function () {
  "use strict";

  const ARTICLE_TITLE = "ज्ञाननिष्ठ की महासमाधि";
  const DESTINATION_DATE = "27 September 2020";
  const ORIGINAL_ARTICLE_DATE = "दिनाँक 12 अक्टूबर, 2020";
  const MAHASAMADHI_ARTICLE_DATE = "दिनाँक 27 सितम्बर, 2020";

  function updateArticleDate(root = document) {
    root.querySelectorAll("p").forEach((paragraph) => {
      if (paragraph.textContent.trim() === ORIGINAL_ARTICLE_DATE) {
        paragraph.textContent = MAHASAMADHI_ARTICLE_DATE;
      }
    });
  }

  function moveArticleToEndOfEra() {
    const heading = Array.from(document.querySelectorAll("h3")).find(
      (element) => element.textContent.trim() === ARTICLE_TITLE,
    );
    const card = heading?.closest(".rounded-xl");
    if (!card) return;

    const timelineDate = Array.from(
      document.querySelectorAll("#leela .timeline-card time"),
    ).find((element) => element.textContent.trim() === DESTINATION_DATE);
    const timelineCard = timelineDate?.closest(".timeline-card");
    if (!timelineCard || timelineCard.contains(card)) return;

    card.classList.add("end-of-era-stuti");
    card.dataset.movedFromStuti = "true";
    updateArticleDate(card);
    timelineCard.appendChild(card);
  }

  function enhanceArticle() {
    const heading = Array.from(document.querySelectorAll("#stuti h3")).find(
      (element) => element.textContent.trim() === ARTICLE_TITLE,
    );

    if (!heading) return;

    const card = heading.closest(".rounded-xl");
    if (!card || card.dataset.articleReaderEnhanced === "true") return;

    const sourceGrid = card.querySelector(".grid.grid-cols-4");
    if (!sourceGrid) return;

    const sourceButtons = Array.from(sourceGrid.querySelectorAll("button"));
    const pages = sourceButtons
      .map((button, index) => {
        const image = button.querySelector("img");
        if (!image) return null;
        return {
          src: image.currentSrc || image.src,
          label: image.alt || `पृष्ठ ${index + 1}`,
          open: () => button.click(),
        };
      })
      .filter(Boolean);

    if (pages.length !== 4) return;

    card.dataset.articleReaderEnhanced = "true";
    sourceGrid.classList.add("stuti-article-source-pages");

    const oldInstruction = Array.from(card.querySelectorAll("p")).find((p) =>
      p.textContent.includes("4 पृष्ठों का लेख"),
    );
    if (oldInstruction) {
      oldInstruction.textContent =
        "पृष्ठ क्रम से पढ़ें · बड़े और स्पष्ट दृश्य के लिए पृष्ठ पर स्पर्श करें";
      oldInstruction.classList.add("stuti-article-reader__instruction");
    }

    const reader = document.createElement("section");
    reader.className = "stuti-article-reader";
    reader.setAttribute("aria-label", `${ARTICLE_TITLE} — चार पृष्ठों का लेख`);

    reader.innerHTML = `
      <div class="stuti-article-reader__toolbar">
        <button type="button" class="stuti-article-reader__nav stuti-article-reader__prev"
          aria-label="पिछला पृष्ठ">← <span>पिछला</span></button>
        <p class="stuti-article-reader__status" aria-live="polite"></p>
        <button type="button" class="stuti-article-reader__nav stuti-article-reader__next"
          aria-label="अगला पृष्ठ"><span>अगला</span> →</button>
      </div>
      <div class="stuti-article-reader__stage"></div>
      <p class="stuti-article-reader__hint">स्पर्श करें — पूर्ण स्क्रीन में पढ़ें और ज़ूम करें</p>
      <div class="stuti-article-reader__thumbnails" aria-label="लेख के पृष्ठ"></div>
    `;

    sourceGrid.insertAdjacentElement("afterend", reader);

    const stage = reader.querySelector(".stuti-article-reader__stage");
    const status = reader.querySelector(".stuti-article-reader__status");
    const previous = reader.querySelector(".stuti-article-reader__prev");
    const next = reader.querySelector(".stuti-article-reader__next");
    const thumbnails = reader.querySelector(".stuti-article-reader__thumbnails");
    let currentPage = 0;

    pages.forEach((page, index) => {
      const thumbnail = document.createElement("button");
      thumbnail.type = "button";
      thumbnail.className = "stuti-article-reader__thumbnail";
      thumbnail.setAttribute("aria-label", `${page.label} दिखाएँ`);
      thumbnail.innerHTML = `
        <img src="${page.src}" alt="" loading="lazy">
        <span>${page.label}</span>
      `;
      thumbnail.addEventListener("click", () => {
        currentPage = index;
        render();
      });
      thumbnails.appendChild(thumbnail);
    });

    function pageButton(page, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "stuti-article-reader__page";
      button.setAttribute("aria-label", `${page.label} पूर्ण स्क्रीन में खोलें`);
      button.innerHTML = `
        <img src="${page.src}" alt="${ARTICLE_TITLE}, ${page.label}" loading="lazy">
        <span>${page.label}</span>
      `;
      button.addEventListener("click", page.open);
      return button;
    }

    function render() {
      stage.replaceChildren();
      stage.appendChild(pageButton(pages[currentPage], currentPage));

      const companionIndex = currentPage % 2 === 0 ? currentPage + 1 : currentPage - 1;
      if (pages[companionIndex]) {
        const companion = pageButton(pages[companionIndex], companionIndex);
        companion.classList.add("stuti-article-reader__page--companion");
        if (companionIndex < currentPage) {
          companion.classList.add("stuti-article-reader__page--before");
        }
        stage.appendChild(companion);
      }

      status.textContent = `पृष्ठ ${currentPage + 1} / ${pages.length}`;
      previous.disabled = currentPage === 0;
      next.disabled = currentPage === pages.length - 1;

      Array.from(thumbnails.children).forEach((thumbnail, index) => {
        const active = index === currentPage;
        thumbnail.classList.toggle("is-active", active);
        if (active) thumbnail.setAttribute("aria-current", "page");
        else thumbnail.removeAttribute("aria-current");
      });
    }

    previous.addEventListener("click", () => {
      if (currentPage > 0) {
        currentPage -= 1;
        render();
      }
    });

    next.addEventListener("click", () => {
      if (currentPage < pages.length - 1) {
        currentPage += 1;
        render();
      }
    });

    reader.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") previous.click();
      if (event.key === "ArrowRight") next.click();
    });

    const oldOpenButton = Array.from(card.querySelectorAll(":scope > button")).find(
      (button) => button.textContent.includes("पूरा लेख पढ़ें"),
    );
    if (oldOpenButton) {
      oldOpenButton.textContent = "पूर्ण स्क्रीन में पढ़ना आरम्भ करें ↗";
      oldOpenButton.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          pages[currentPage].open();
        },
        true,
      );
    }

    render();
  }

  function enhanceShukraVideo() {
    const iframe = document.querySelector(
      '#stuti iframe[src*="AoDsVbLaVfA"]',
    );
    if (!iframe) return;

    const videoFrame = iframe.parentElement;
    if (
      !videoFrame ||
      videoFrame.previousElementSibling?.classList.contains(
        "stuti-video-attribution",
      )
    ) {
      return;
    }

    const attribution = document.createElement("p");
    attribution.className = "stuti-video-attribution";
    attribution.textContent = "प्रस्तुति — कुमारी आरुषि (विभु) शर्मा";
    videoFrame.insertAdjacentElement("beforebegin", attribution);
  }

  function ensureThirdAndFourthStutiOrder() {
    const headings = Array.from(document.querySelectorAll("#stuti h3"));
    if (headings.length < 4) return;

    const originalThirdHeading = headings.find(
      (heading) => (heading.textContent || "").trim() === "श्रद्धांजलि काव्य",
    );
    const originalFourthHeading = headings.find(
      (heading) =>
        (heading.textContent || "").replace(/\s+/g, " ").trim() ===
        "।। श्री सद्गुरुवे देवाय नमः ।।",
    );
    const thirdCard = originalThirdHeading?.closest(".rounded-xl");
    const fourthCard = originalFourthHeading?.closest(".rounded-xl");
    if (
      !thirdCard ||
      !fourthCard ||
      thirdCard.parentElement !== fourthCard.parentElement
    ) {
      return;
    }

    // Keep the original third stuti after the original fourth stuti.
    if (
      thirdCard.compareDocumentPosition(fourthCard) &
      Node.DOCUMENT_POSITION_FOLLOWING
    ) {
      thirdCard.parentElement.insertBefore(fourthCard, thirdCard);
    }
  }

  function enhanceGangeshanandaAttribution() {
    const section = document.querySelector("#stuti");
    if (!section) return;

    section.querySelectorAll("p").forEach((line) => {
      if (
        (line.textContent || "").trim() ===
        "by Brahmaleen Swami Gangeshanandaji"
      ) {
        line.textContent = "by Brahmaleen Pujya Swami Gangeshanandaji";
      }
    });

    section.querySelectorAll("[alt], [aria-label]").forEach((element) => {
      ["alt", "aria-label"].forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (value?.includes("Brahmaleen Swami Gangeshanandaji")) {
          element.setAttribute(
            attribute,
            value.replace(
              "Brahmaleen Swami Gangeshanandaji",
              "Brahmaleen Pujya Swami Gangeshanandaji",
            ),
          );
        }
      });
    });
  }

  function updateThirdStutiAuthor() {
    const cards = Array.from(
      document.querySelectorAll("#stuti .grid.grid-cols-1 > .rounded-xl"),
    );
    if (cards.length < 3) return;

    const secondCard = cards[1];
    const thirdCard = cards[2];
    const thirdHeading = thirdCard.querySelector("h3");
    if (
      !thirdHeading ||
      thirdHeading.textContent.replace(/\s+/g, " ").trim() !==
        "।। श्री सद्गुरुवे देवाय नमः ।।"
    ) {
      return;
    }

    const secondAuthor = Array.from(secondCard.querySelectorAll("p")).find(
      (line) => {
        const text = (line.textContent || "").trim();
        return text.startsWith("~") || text.startsWith("—");
      },
    );
    if (!secondAuthor) return;

    const portrait = thirdCard.querySelector(
      'button[aria-label*="Gangeshanandaji"]',
    );
    const portraitBlock = portrait?.parentElement;
    if (portraitBlock) portraitBlock.remove();

    const stutiArtwork = Array.from(thirdCard.querySelectorAll("img")).find(
      (image) => image.alt.includes("Gangeshanandaji"),
    );
    if (stutiArtwork) {
      stutiArtwork.alt = "।। श्री सद्गुरुवे देवाय नमः ।।";
      const artworkBlock = stutiArtwork.parentElement;
      const typedVerses = artworkBlock?.nextElementSibling;
      if (
        typedVerses &&
        typedVerses.classList.contains("space-y-4") &&
        !typedVerses.classList.contains("stuti-third-author")
      ) {
        typedVerses.remove();
      }
    }

    let author = thirdCard.querySelector(".stuti-third-author");
    if (!author) {
      author = document.createElement("p");
      author.className =
        "stuti-third-author text-right text-xs text-muted-foreground mt-6 italic";
      thirdCard.appendChild(author);
    }
    const authorText = secondAuthor.textContent.trim();
    if (author.textContent.trim() !== authorText) {
      author.textContent = authorText;
    }
  }

  function enhanceStuti() {
    ensureThirdAndFourthStutiOrder();
    updateThirdStutiAuthor();
    enhanceArticle();
    moveArticleToEndOfEra();
    updateArticleDate();
    enhanceShukraVideo();
  }

  const observer = new MutationObserver(enhanceStuti);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceStuti, { once: true });
  } else {
    enhanceStuti();
  }
})();
