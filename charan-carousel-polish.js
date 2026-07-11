(() => {
  const devDigits = {
    "0": "०",
    "1": "१",
    "2": "२",
    "3": "३",
    "4": "४",
    "5": "५",
    "6": "६",
    "7": "७",
    "8": "८",
    "9": "९",
  };

  const toDevanagari = (value) =>
    String(value).replace(/\d/g, (digit) => devDigits[digit] || digit);

  const polishCounter = () => {
    const root = document.querySelector("#charan-vandan");
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (walker.nextNode()) {
      const text = walker.currentNode.nodeValue.trim();
      if (/^\d+\s*\/\s*\d+$/.test(text)) {
        nodes.push(walker.currentNode);
      }
    }

    nodes.forEach((node) => {
      const original = node.nodeValue.trim();
      const polished = toDevanagari(original);
      node.nodeValue = node.nodeValue.replace(original, polished);
      node.parentElement?.classList.add("charan-carousel-counter");
    });
  };

  const polishDots = () => {
    const root = document.querySelector("#charan-vandan");
    if (!root) return;

    root
      .querySelectorAll('[aria-label="Charan-Vandan photo position"] button')
      .forEach((button) => {
        const className = String(button.getAttribute("class") || "");
        const isActive =
          button.getAttribute("aria-current") === "true" ||
          button.getAttribute("aria-current") === "page" ||
          className.includes("B76A20");

        button.classList.toggle("charan-carousel-dot-active", isActive);
      });
  };

  let scheduled = false;
  const schedulePolish = () => {
    if (scheduled) return;
    scheduled = true;
    window.setTimeout(() => {
      scheduled = false;
      polishCounter();
      polishDots();
    }, 0);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedulePolish, { once: true });
  } else {
    schedulePolish();
  }

  new MutationObserver(schedulePolish).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  [100, 350, 800, 1600, 3000].forEach((delay) => {
    window.setTimeout(schedulePolish, delay);
  });
})();
