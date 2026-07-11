(() => {
  const optimizedAttribute = "imageOptimized";
  const eagerVisibleLimit = 6;
  const preloadVisibleLimit = 2;
  let eagerCount = 0;
  let preloadCount = 0;

  function isImageUrl(value) {
    return /\.(avif|webp|png|jpe?g|gif|svg)(\?|#|$)/i.test(value || "");
  }

  function isNearViewport(img) {
    const rect = img.getBoundingClientRect();
    const height = window.innerHeight || document.documentElement.clientHeight || 800;
    return rect.top < height * 1.25 && rect.bottom > -height * 0.25;
  }

  function markReady(img) {
    img.classList.add("om-image-ready");
    img.classList.remove("om-image-loading");
  }

  function preloadImage(img) {
    const src = img.currentSrc || img.getAttribute("src");
    if (!src || !isImageUrl(src) || preloadCount >= preloadVisibleLimit) return;
    const absoluteSrc = new URL(src, location.href).href;
    const alreadyPreloaded = Array.from(
      document.querySelectorAll('link[rel="preload"][as="image"]'),
    ).some((link) => link.href === absoluteSrc);
    if (alreadyPreloaded) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = absoluteSrc;
    document.head.append(link);
    preloadCount += 1;
  }

  function enhanceImage(img) {
    if (!(img instanceof HTMLImageElement)) return;
    if (img.dataset[optimizedAttribute] === "true") return;
    img.dataset[optimizedAttribute] = "true";

    if (!img.hasAttribute("decoding")) img.decoding = "async";
    img.classList.add("om-image-loading");

    const nearViewport = isNearViewport(img);
    if (!img.hasAttribute("loading")) {
      if (nearViewport && eagerCount < eagerVisibleLimit) {
        img.loading = "eager";
        img.fetchPriority = "high";
        eagerCount += 1;
      } else {
        img.loading = "lazy";
        img.fetchPriority = "auto";
      }
    }

    if (nearViewport) preloadImage(img);

    if (img.complete && img.naturalWidth > 0) {
      markReady(img);
      return;
    }

    img.addEventListener("load", () => markReady(img), { once: true });
    img.addEventListener(
      "error",
      () => {
        img.classList.remove("om-image-loading");
        img.classList.add("om-image-error");
      },
      { once: true },
    );
  }

  function enhanceTree(root = document) {
    root.querySelectorAll?.("img").forEach(enhanceImage);
  }

  function scheduleEnhance(root) {
    const run = () => enhanceTree(root);
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 800 });
      return;
    }
    window.setTimeout(run, 0);
  }

  document.addEventListener("DOMContentLoaded", () => {
    enhanceTree();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLImageElement) {
            enhanceImage(node);
          } else if (node instanceof Element) {
            scheduleEnhance(node);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
