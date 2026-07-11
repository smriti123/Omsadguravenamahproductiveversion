(() => {
  const titleMap = new Map([
    ["Charan-Vandan", "चरण-वंदन"],
    ["Sidhbari Leela", "सिद्धबाड़ी रेखाचित्र"],
    ["Charitra-Jhalak", "चरित्र-झलक"],
    ["Stuti-Vandan", "स्तुति-वंदन"],
    ["Virah-Smaran", "विरह-स्मरण"],
    ["Satsangs", "सत्संग"],
    ["Satsangs & Discourses", "सत्संग-प्रवचन"],
    ["SATSANGS & DISCOURSES", "सत्संग-प्रवचन"],
    ["Bhajan", "भजन"],
    ["Bhajans & Samkeertan", "भजन एवं संकीर्तन"],
    ["Quotes", "सुविचार"],
    ["Sadguru-Smaran", "सद्गुरु-स्मरण"],
  ]);

  const skipTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT"]);
  let scheduled = false;

  function translateTextNode(node) {
    const original = node.nodeValue;
    const trimmed = original.trim();
    const translated = titleMap.get(trimmed);
    if (!translated) return;

    node.nodeValue = original.replace(trimmed, translated);
  }

  function translateAttributes(root) {
    root.querySelectorAll("[aria-label], [title]").forEach((element) => {
      ["aria-label", "title"].forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (!value) return;
        const translated = titleMap.get(value.trim());
        if (translated) element.setAttribute(attribute, translated);
      });
    });
  }

  function translateTitles() {
    const root = document.body;
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || skipTags.has(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return titleMap.has(node.nodeValue.trim())
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(translateTextNode);
    translateAttributes(root);
  }

  function scheduleTranslate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      translateTitles();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(scheduleTranslate);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    scheduleTranslate();
  });
})();
