(() => {
  const playlistId = "PLgy41qSqQO42bitLVDIT5sn9EHGtMkrZO";

  function buildVideoSection() {
    const section = document.createElement("section");
    section.id = "bhav-suman-video";
    section.className = "virah-video-section";
    section.innerHTML = `
      <div class="virah-section-divider" aria-hidden="true"></div>
      <div class="virah-video-card">
        <iframe
          src="https://www.youtube.com/embed/videoseries?list=${playlistId}"
          title="भाव-सुमन वीडियो"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          loading="lazy"
        ></iframe>
        <a
          href="https://www.youtube.com/playlist?list=${playlistId}"
          target="_blank"
          rel="noopener noreferrer"
        >YouTube पर देखें</a>
      </div>
    `;
    return section;
  }

  function arrangeVirahSection() {
    const section = document.querySelector("#shraddanjali");
    const container = section?.querySelector(":scope > div");
    if (!container) return;

    const textWalker = document.createTreeWalker(
      section,
      NodeFilter.SHOW_TEXT,
    );
    let textNode;
    while ((textNode = textWalker.nextNode())) {
      if (textNode.nodeValue.includes("भव-सुमन")) {
        textNode.nodeValue = textNode.nodeValue.replaceAll(
          "भव-सुमन",
          "भाव-सुमन",
        );
      }
    }

    const tabBar = Array.from(container.children).find(
      (child) =>
        child.querySelectorAll?.("button").length === 2 &&
        child.textContent.includes("सुमन"),
    );

    if (tabBar) {
      tabBar.remove();
    }

    document.querySelector("#bhav-suman-written-heading")?.remove();

    if (!document.querySelector("#bhav-suman-video")) {
      container.append(buildVideoSection());
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(arrangeVirahSection);
    observer.observe(document.body, { childList: true, subtree: true });
    arrangeVirahSection();
  });
})();
