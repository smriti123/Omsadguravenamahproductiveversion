(() => {
  const oldSaraswatiSrc = "/assets/c3-2wHXGCs-.jpg";
  const newSaraswatiSrc = "/assets/saraswatiiji.jpg?v=1";

  let scheduled = false;

  function replaceSaraswatiSlide() {
    document
      .querySelectorAll('.home-new__mobile-slideshow img[src*="c3-2wHXGCs-.jpg"]')
      .forEach((image) => {
        image.src = newSaraswatiSrc;
        image.alt = image.alt || "Saraswatiji";
      });

    document.querySelectorAll(".home-new__guru-lines .namami-text").forEach((line) => {
      if ((line.textContent || "").trim() === "नमामि वाङ्मयीं मूर्तिम्॥") {
        line.textContent = "नमामि ज्ञानमूर्तये॥";
      }
    });

    document.querySelectorAll(".home-new__card-grid a").forEach((card) => {
      card.querySelector("small")?.remove();
      card.querySelector("em")?.remove();
    });
  }

  function scheduleReplace() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      replaceSaraswatiSlide();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(scheduleReplace);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "class"],
    });
    scheduleReplace();
  });
})();
