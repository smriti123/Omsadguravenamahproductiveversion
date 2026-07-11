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
