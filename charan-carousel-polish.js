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

  const polishFirstCaption = () => {
    const root = document.querySelector("#charan-vandan");
    if (!root) return;

    const oldCaption = "\u0928\u092E\u093E\u092E\u093F \u092A\u0926\u0932\u094B\u091A\u0928\u092E\u094D\u0964";
    const newCaption =
      "\u0936\u094D\u0930\u0940 \u0917\u0941\u0930\u0941 \u092A\u0926 \u0928\u0916 \u092E\u0923\u093F \u0917\u0928 \u091C\u094B\u0924\u0940\u0964\n" +
      "\u0938\u0941\u092E\u093F\u0930\u0924 \u0926\u093F\u0935\u094D\u092F \u0926\u0943\u0937\u094D\u091F\u093F \u0939\u093F\u092F\u0901 \u0939\u094B\u0924\u0940\u0965";

    root.querySelectorAll("figcaption p").forEach((element) => {
      if ((element.textContent || "").trim() === oldCaption) {
        element.replaceChildren(document.createTextNode(newCaption));
      }
      element.classList.remove("charan-first-caption");
    });
  };

  const polishSeventhCaption = () => {
    const root = document.querySelector("#charan-vandan");
    if (!root) return;

    const oldCaption =
      "\u0936\u094D\u0930\u0940 \u0917\u0941\u0930 \u092A\u0926 \u0928\u0916 \u092E\u0928\u093F \u0917\u0928 \u091C\u094B\u0924\u0940\u0964 " +
      "\u0938\u0941\u092E\u093F\u0930\u0924 \u0926\u093F\u092C\u094D\u092F \u0926\u0943\u0937\u094D\u091F\u093F \u0939\u093F\u092F\u0901 \u0939\u094B\u0924\u0940\u0965";
    const newCaption =
      "\u0917\u0941\u0930\u0941 \u092A\u0926 \u0930\u091C \u092E\u0943\u0926\u0941 \u092E\u0902\u091C\u0941\u0932 \u0905\u0902\u091C\u0928\u0964\n" +
      "\u0928\u092F\u0928 \u0905\u092E\u093F\u0905 \u0926\u0943\u0917 \u0926\u094B\u0937 \u092C\u093F\u092D\u0902\u091C\u0928\u0965";

    root.querySelectorAll("figcaption p").forEach((element) => {
      if (
        (element.textContent || "").replace(/\s+/g, " ").trim() === oldCaption
      ) {
        element.replaceChildren(document.createTextNode(newCaption));
      }
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
      polishFirstCaption();
      polishSeventhCaption();
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
