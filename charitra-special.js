(() => {
  const imageUrl = "/assets/bhakta-vatsalaya-special-v2.jpg";
  const itemId = "bhakta-vatsalaya-special-final";
  const dravinamImageUrl = "/assets/dravinam.jpeg";
  const dravinamItemId = "bhakta-vatsalaya-dravinam";
  const vidyaImages = [
    { id: "bhakta-vatsalaya-vidya-1", src: "/assets/bhakta-vidya-1.jpg" },
    { id: "bhakta-vatsalaya-vidya-2", src: "/assets/bhakta-vidya-2.jpg" },
  ];
  const vidyaCombinedItemId = "bhakta-vatsalaya-vidya-combined";
  const wheelchairImageUrl = "/assets/wheelchairnew.jpg";
  const wheelchairItemId = "sadguru-priya-wheelchair-new";
  const guruparamparaImageUrl = "/assets/guruparampara.jpeg";
  const guruparamparaItemId = "sadguru-priya-guruparampara";
  const guruparamparaCaption =
    "\u0938\u0926\u093E\u0936\u093F\u0935 \u0938\u092E\u093E\u0930\u092E\u094D\u092D\u093E\u092E\u094D \u0936\u0919\u094D\u0915\u0930\u093E\u091A\u093E\u0930\u094D\u092F \u092E\u0927\u094D\u092F\u092E\u093E\u092E\u094D\n\u0905\u0938\u094D\u092E\u0926\u094D \u0906\u091A\u093E\u0930\u094D\u092F \u092A\u0930\u094D\u092F\u0928\u094D\u0924\u093E\u092E\u094D \u0935\u0928\u094D\u0926\u0947 \u0917\u0941\u0930\u0941 \u092A\u0930\u092E\u094D\u092A\u0930\u093E\u092E\u094D II";
  const arunUncleImageUrl = "/assets/arununcle-new.jpeg";
  const arunUncleItemId = "adwitaya-arun-uncle-new";
  const arunUncleCaption = "\u0950 \u0905\u0926\u094D\u0935\u093F\u0924\u0940\u092F\u093E\u092F \u0928\u092E\u0903\u0964";
  const anandvardhakayaPhotos = [
    {
      id: "charitra-anandvardhakaya-2",
      src: "/assets/anandvardhakaya-2.jpeg",
      caption: "\u0924\u094D\u0935\u092E\u0947\u0915\u0902 \u0935\u0930\u0947\u0923\u094D\u092F\u092E\u094D",
      specialCaption: true,
    },
    { id: "charitra-anandvardhakaya-1", src: "/assets/anandvardhakaya-1.jpg" },
    { id: "charitra-anandvardhakaya-3", src: "/assets/anandvardhakaya-3.jpg" },
    { id: "charitra-anandvardhakaya-4", src: "/assets/anandvardhakaya-4.jpg" },
    { id: "charitra-anandvardhakaya-5", src: "/assets/anandvardhakaya-5.jpg" },
    { id: "charitra-anandvardhakaya-6", src: "/assets/anandvardhakaya-6.jpg" },
    { id: "charitra-anandvardhakaya-7", src: "/assets/anandvardhakaya-7.jpeg" },
    { id: "charitra-anandvardhakaya-8", src: "/assets/anandvardhakaya-8.jpeg" },
    { id: "charitra-anandvardhakaya-9", src: "/assets/anandvardhakaya-9.jpeg" },
    { id: "charitra-anandvardhakaya-diwali", src: "/assets/diw-YaPSf2re.jpg" },
  ];
  const anandvardhakayaArticleId = "charitra-anandvardhakaya-category";
  const anandvardhakayaTitle =
    "\u0950 \u0906\u0928\u0928\u094D\u0926\u0935\u0930\u094D\u0927\u0915\u093E\u092F \u0928\u092E\u0903";
  const vedantVedyaBannerId = "vedant-vedya-banner";
  const vedantAmritbhashineImageUrl = "/assets/vedant-bhashyakar-priyaya.jpeg";
  const vedantAmritbhashineItemId = "vedant-amritbhashine-new";
  const vedantAmritbhashineCaption =
    "\u0950 \u0905\u092E\u0943\u0924\u092D\u093E\u0937\u093F\u0923\u0947 \u0928\u092E\u0903\u0964";
  const namamiAnandaCaption =
    "\u091C\u094B \u0906\u0928\u0928\u094D\u0926 \u0938\u093F\u0928\u094D\u0927\u0941 \u0938\u0941\u0916\u0930\u093E\u0938\u0940\u0964\n\u0938\u0940\u0915\u0930 \u0924\u0947\u0902 \u0924\u094D\u0930\u0948\u0932\u094B\u0915 \u0938\u0941\u092A\u093E\u0938\u0940\u0965";
  const wheelchairCaption =
    '"Whenever Pujya Gurudev came to Sidhbari, it was Swami Subodhanandaji who would push his wheelchair — doing so with such devotion and pride."';

  function closeViewer() {
    document.querySelector("#charitra-special-viewer")?.remove();
    document.body.style.overflow = "";
  }

  function openViewer() {
    closeViewer();

    const viewer = document.createElement("div");
    viewer.id = "charitra-special-viewer";
    viewer.setAttribute("role", "dialog");
    viewer.setAttribute("aria-modal", "true");
    viewer.setAttribute("aria-label", "Om Bhakta Vatsalaya Namah");
    viewer.innerHTML = `
      <button type="button" class="charitra-viewer-close" aria-label="Close">×</button>
      <img
        src="${imageUrl}"
        alt="Om Bhakta Vatsalaya Namah — Pujya Swamiji"
      />
    `;
    viewer.addEventListener("click", (event) => {
      if (event.target === viewer || event.target.closest("button")) closeViewer();
    });
    document.body.append(viewer);
    document.body.style.overflow = "hidden";
  }

  function openDravinamViewer() {
    closeViewer();

    const viewer = document.createElement("div");
    viewer.id = "charitra-special-viewer";
    viewer.setAttribute("role", "dialog");
    viewer.setAttribute("aria-modal", "true");
    viewer.setAttribute("aria-label", "\u091A \u0926\u094D\u0930\u0935\u093F\u0923\u0902 \u0924\u094D\u0935\u092E\u0947\u0935");
    viewer.innerHTML = `
      <button type="button" class="charitra-viewer-close" aria-label="Close">×</button>
      <img
        src="${dravinamImageUrl}"
        alt="\u091A \u0926\u094D\u0930\u0935\u093F\u0923\u0902 \u0924\u094D\u0935\u092E\u0947\u0935"
      />
    `;
    viewer.addEventListener("click", (event) => {
      if (event.target === viewer || event.target.closest("button")) closeViewer();
    });
    document.body.append(viewer);
    document.body.style.overflow = "hidden";
  }

  function openInsertedImageViewer(src, alt, caption = "") {
    closeViewer();

    const viewer = document.createElement("div");
    viewer.id = "charitra-special-viewer";
    viewer.setAttribute("role", "dialog");
    viewer.setAttribute("aria-modal", "true");
    viewer.setAttribute("aria-label", alt);
    viewer.innerHTML = `
      <button type="button" class="charitra-viewer-close" aria-label="Close">×</button>
      <img
        src="${src}"
        alt="${alt}"
      />
      ${caption ? `<p class="charitra-viewer-caption">${caption}</p>` : ""}
    `;
    viewer.addEventListener("click", (event) => {
      if (event.target === viewer || event.target.closest("button")) closeViewer();
    });
    document.body.append(viewer);
    document.body.style.overflow = "hidden";
  }

  function createGalleryItem() {
    const item = document.createElement("button");
    item.type = "button";
    item.id = itemId;
    item.className = "charitra-special-item";
    item.setAttribute("aria-label", "View Om Bhakta Vatsalaya Namah image");
    item.innerHTML = `
      <img
        src="${imageUrl}"
        alt="Om Bhakta Vatsalaya Namah — Pujya Swamiji"
        loading="lazy"
      />
    `;
    item.addEventListener("click", openViewer);
    return item;
  }

  function findBhaktaArticle() {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return null;

    return Array.from(gallery.querySelectorAll("article")).find((article) => {
      const text = article.querySelector("h3")?.textContent || "";
      return (
        text.includes("\u092D\u0915\u094D\u0924") ||
        text.toLowerCase().includes("bhakta")
      );
    });
  }

  function findSadguruPriyaArticle() {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return null;

    return Array.from(gallery.querySelectorAll("article")).find((article) => {
      const text = article.querySelector("h3")?.textContent || "";
      return (
        text.includes("\u0938\u0926\u094D\u0917\u0941\u0930\u0941\u092A\u094D\u0930\u093F\u092F\u093E\u092F") ||
        text.toLowerCase().includes("sadguru")
      );
    });
  }

  function addFinalImage() {
    if (document.querySelector(`#${itemId}`)) return;

    {
      const bhaktaArticle = findBhaktaArticle();
      const photoGrid = bhaktaArticle?.querySelector('[role="region"] .columns-1');
      if (photoGrid) {
        photoGrid.append(createGalleryItem());
        return;
      }
    }

    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return;

    const bhaktaArticle = Array.from(gallery.querySelectorAll("article")).find(
      (article) => article.querySelector("h3")?.textContent.includes("भक्त"),
    );
    const photoGrid = bhaktaArticle?.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    photoGrid.append(createGalleryItem());
  }

  function createDravinamItem(photoGrid) {
    const existingSources = Array.from(
      photoGrid?.querySelectorAll("button") || [],
    )
      .filter((button) => {
        const text = button.textContent || "";
        return (
          text.includes("\u0926\u094D\u0930\u0935\u093F\u0923") ||
          text.toLowerCase().includes("dravinam")
        );
      })
      .map((button) => button.querySelector("img")?.getAttribute("src"))
      .filter(Boolean);
    const sources = Array.from(new Set([...existingSources, dravinamImageUrl]));
    const item = document.createElement("button");
    item.type = "button";
    item.id = dravinamItemId;
    item.className = "charitra-inserted-photo charitra-combined-photo";
    item.setAttribute("aria-label", "View \u091A \u0926\u094D\u0930\u0935\u093F\u0923\u0902 \u0924\u094D\u0935\u092E\u0947\u0935 image");
    item.innerHTML = `
      <span class="charitra-combined-photo__media">
        ${sources
          .map(
            (src) => `<img
              src="${src}"
              alt="\u091A \u0926\u094D\u0930\u0935\u093F\u0923\u0902 \u0924\u094D\u0935\u092E\u0947\u0935"
              loading="lazy"
            />`,
          )
          .join("")}
      </span>
      <p>\u091A \u0926\u094D\u0930\u0935\u093F\u0923\u0902 \u0924\u094D\u0935\u092E\u0947\u0935</p>
    `;
    item.addEventListener("click", openDravinamViewer);
    return item;
  }

  function createVidyaItem() {
    const item = document.createElement("button");
    item.type = "button";
    item.id = vidyaCombinedItemId;
    item.className = "charitra-inserted-photo charitra-combined-photo";
    item.setAttribute("aria-label", "View \u0924\u094D\u0935\u092E\u0947\u0935 \u0935\u093F\u0926\u094D\u092F\u093E image");
    item.innerHTML = `
      <span class="charitra-combined-photo__media">
        ${vidyaImages
          .map(
            (photo) => `<img
              src="${photo.src}"
              alt="\u0924\u094D\u0935\u092E\u0947\u0935 \u0935\u093F\u0926\u094D\u092F\u093E"
              loading="lazy"
            />`,
          )
          .join("")}
      </span>
      <p>\u0924\u094D\u0935\u092E\u0947\u0935 \u0935\u093F\u0926\u094D\u092F\u093E</p>
    `;
    item.addEventListener("click", () =>
      openInsertedImageViewer(
        vidyaImages[0].src,
        "\u0924\u094D\u0935\u092E\u0947\u0935 \u0935\u093F\u0926\u094D\u092F\u093E",
      ),
    );
    return item;
  }

  function findSakhaCard(photoGrid) {
    return Array.from(photoGrid.querySelectorAll("button")).find((button) => {
      const text = button.textContent || "";
      return (
        text.includes("\u091A \u0938\u0916\u093E") ||
        text.includes("\u0938\u0916\u093E") ||
        text.toLowerCase().includes("sakha")
      );
    });
  }

  function addVidyaImages() {
    const bhaktaArticle = findBhaktaArticle();
    const photoGrid = bhaktaArticle?.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    vidyaImages.forEach((photo) => document.querySelector(`#${photo.id}`)?.remove());
    if (document.querySelector(`#${vidyaCombinedItemId}`)) return;

    const sakhaCard = findSakhaCard(photoGrid);
    const item = createVidyaItem();
    if (sakhaCard) {
      sakhaCard.insertAdjacentElement("afterend", item);
    } else {
      photoGrid.append(item);
    }
  }

  function addDravinamImage() {
    if (document.querySelector(`#${dravinamItemId}`)) return;

    const bhaktaArticle = findBhaktaArticle();
    const photoGrid = bhaktaArticle?.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    const sakhaCard = findSakhaCard(photoGrid);
    const vidyaAnchor = document.querySelector(`#${vidyaCombinedItemId}`);

    const item = createDravinamItem(photoGrid);
    Array.from(photoGrid.querySelectorAll("button")).forEach((button) => {
      if (button === item) return;
      const text = button.textContent || "";
      if (
        text.includes("\u0926\u094D\u0930\u0935\u093F\u0923") ||
        text.toLowerCase().includes("dravinam")
      ) {
        button.remove();
      }
    });

    if (vidyaAnchor) {
      vidyaAnchor.insertAdjacentElement("afterend", item);
    } else if (sakhaCard) {
      sakhaCard.insertAdjacentElement("afterend", item);
    } else {
      photoGrid.append(item);
    }
  }

  function createWheelchairItem() {
    const item = document.createElement("button");
    item.type = "button";
    item.id = wheelchairItemId;
    item.className = "charitra-inserted-photo";
    item.setAttribute("aria-label", "View Pujya Swamiji serving Gurudev wheelchair photo");
    item.innerHTML = `
      <img
        src="${wheelchairImageUrl}"
        alt="Pujya Swamiji serving Gurudev in wheelchair"
        loading="lazy"
      />
      <p>${wheelchairCaption}</p>
    `;
    item.addEventListener("click", () =>
      openInsertedImageViewer(
        wheelchairImageUrl,
        "Pujya Swamiji serving Gurudev in wheelchair",
      ),
    );
    return item;
  }

  function createGuruparamparaItem() {
    const item = document.createElement("button");
    item.type = "button";
    item.id = guruparamparaItemId;
    item.className = "charitra-inserted-photo";
    item.setAttribute("aria-label", "View Guru Parampara photo");
    item.innerHTML = `
      <img
        src="${guruparamparaImageUrl}"
        alt="Guru Parampara"
        loading="lazy"
      />
      <p>${guruparamparaCaption}</p>
    `;
    item.addEventListener("click", () =>
      openInsertedImageViewer(guruparamparaImageUrl, "Guru Parampara"),
    );
    return item;
  }

  function addGuruparamparaImage() {
    if (document.querySelector(`#${guruparamparaItemId}`)) return;

    const sadguruPriyaArticle = findSadguruPriyaArticle();
    const photoGrid = sadguruPriyaArticle?.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    const item = createGuruparamparaItem();
    const cards = Array.from(photoGrid.children).filter((child) =>
      child.matches?.("button"),
    );
    const anchor = cards[3] || cards[cards.length - 1];

    if (anchor) {
      anchor.insertAdjacentElement("afterend", item);
    } else {
      photoGrid.append(item);
    }
  }

  function addWheelchairImage() {
    if (document.querySelector(`#${wheelchairItemId}`)) return;

    const sadguruPriyaArticle = findSadguruPriyaArticle();
    const photoGrid = sadguruPriyaArticle?.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    const existingWheelchairCard = Array.from(photoGrid.querySelectorAll("button")).find(
      (button) =>
        (button.textContent || "").includes(
          "would push his wheelchair",
        ),
    );

    const item = createWheelchairItem();
    if (existingWheelchairCard) {
      existingWheelchairCard.insertAdjacentElement("afterend", item);
    } else {
      photoGrid.append(item);
    }
  }

  function removeSadguruPetCaption() {
    const sadguruPriyaArticle = findSadguruPriyaArticle();
    const captions = sadguruPriyaArticle?.querySelectorAll('[role="region"] button p');
    if (!captions) return;

    captions.forEach((caption) => {
      const text = (caption.textContent || "").toLowerCase();
      if (
        text.includes("pet of") &&
        text.includes("gurudev")
      ) {
        caption.remove();
      }
    });
  }

  function createArunUncleItem() {
    const item = document.createElement("button");
    item.type = "button";
    item.id = arunUncleItemId;
    item.className = "charitra-inserted-photo";
    item.setAttribute("aria-label", "View Om Adwitayaya Namah photo");
    item.innerHTML = `
      <img
        src="${arunUncleImageUrl}"
        alt="Pujya Swamiji with Arun Uncle"
        loading="lazy"
      />
      <p>${arunUncleCaption}</p>
    `;
    item.addEventListener("click", () =>
      openInsertedImageViewer(arunUncleImageUrl, "Pujya Swamiji with Arun Uncle"),
    );
    return item;
  }

  function findAdwitayaArticle() {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return null;

    return Array.from(gallery.querySelectorAll("article")).find((article) => {
      const text = article.querySelector("h3")?.textContent || "";
      return (
        text.includes("\u0905\u0926\u094D\u0935\u093F\u0924\u0940\u092F\u093E\u092F") ||
        text.toLowerCase().includes("adwitaya")
      );
    });
  }

  function addArunUncleImage() {
    if (document.querySelector(`#${arunUncleItemId}`)) return;

    const adwitayaArticle = findAdwitayaArticle();
    const photoGrid = adwitayaArticle?.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    const item = createArunUncleItem();
    const existingArunCard = Array.from(photoGrid.querySelectorAll("button")).find(
      (button) => (button.textContent || "").toLowerCase().includes("arun"),
    );

    if (existingArunCard) {
      existingArunCard.insertAdjacentElement("afterend", item);
    } else {
      photoGrid.append(item);
    }
  }

  function updateAdwitayaPhotoCaptions() {
    const adwitayaArticle = findAdwitayaArticle();
    const photoGrid = adwitayaArticle?.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    const cards = Array.from(photoGrid.querySelectorAll("button"));
    const captions = cards
      .map((card) => card.querySelector("p"))
      .filter(Boolean);

    captions.forEach((caption) => {
      const text = caption.textContent || "";
      if (text.includes("Kaya")) {
        caption.replaceChildren(document.createTextNode(text.replaceAll("Kaya", "\u0915\u093E\u092F\u093E")));
      }
    });

    const firstCaption = captions[0];
    if (firstCaption && firstCaption.dataset.adwitayaFirstCaptionUpdated !== "true") {
      firstCaption.replaceChildren(
        document.createTextNode(
          "\u0907\u0938 \u092C\u093E\u0932\u0915 \u0915\u0947 \u0938\u093F\u0930 \u092A\u0947, \u0917\u0941\u0930\u0941 \u0939\u093E\u0925 \u0930\u0939\u0947 \u0924\u0947\u0930\u093E",
        ),
      );
      firstCaption.dataset.adwitayaFirstCaptionUpdated = "true";
    }
  }

  function findNamamiChittchorkamArticle() {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return null;

    return Array.from(gallery.querySelectorAll("article")).find((article) => {
      const text = article.querySelector("h3")?.textContent || "";
      return (
        text.includes("\u0938\u094D\u092E\u093F\u0924") ||
        text.includes("\u0908\u0915\u094D\u0937\u0923\u093E\u092F") ||
        text.toLowerCase().includes("chittchorkam")
      );
    });
  }

  function updateNamamiAnandaPhoto() {
    const article = findNamamiChittchorkamArticle();
    const photoGrid = article?.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    const card = Array.from(photoGrid.querySelectorAll("button")).find((button) => {
      const text = button.textContent || "";
      const imageSrc = button.querySelector("img")?.getAttribute("src") || "";
      return (
        (text.includes("\u0906\u0928\u0928\u094D\u0926") &&
          text.includes("\u0938\u094D\u0935\u0930\u0942\u092A")) ||
        imageSrc.includes("g2-replace-4-BTfj1sLt")
      );
    });
    if (!card) return;

    const caption = card.querySelector("p");
    if (caption && caption.textContent !== namamiAnandaCaption) {
      caption.replaceChildren(document.createTextNode(namamiAnandaCaption));
    }

    const cards = Array.from(photoGrid.children).filter((child) =>
      child.matches?.("button"),
    );
    const target = cards[2];
    if (target && target !== card && target.previousElementSibling !== card) {
      photoGrid.insertBefore(card, target);
    }
  }

  function removeNamamiDiwaliPhoto() {
    const article = findNamamiChittchorkamArticle();
    const photoGrid = article?.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    Array.from(photoGrid.querySelectorAll("button")).forEach((button) => {
      const src = button.querySelector("img")?.getAttribute("src") || "";
      if (src.includes("diw-YaPSf2re.jpg")) button.remove();
    });
  }

  function createAnandvardhakayaItem(photo) {
    const item = document.createElement("button");
    item.type = "button";
    item.id = photo.id;
    item.className = "charitra-inserted-photo";
    item.setAttribute("aria-label", "View Om Anandvardhakaya Namah photo");
    item.innerHTML = `
      <img
        src="${photo.src}"
        alt="Om Anandvardhakaya Namah"
        loading="lazy"
      />
      ${
        photo.caption
          ? `<p class="${photo.specialCaption ? "anandvardhakaya-special-caption" : ""}">${photo.caption}</p>`
          : ""
      }
    `;
    item.addEventListener("click", () =>
      openInsertedImageViewer(photo.src, "Om Anandvardhakaya Namah"),
    );
    return item;
  }

  function createAnandvardhakayaArticle(reference) {
    const article = document.createElement("article");
    article.id = anandvardhakayaArticleId;
    article.className =
      reference?.className ||
      "overflow-hidden rounded-2xl border border-gold/30 bg-card shadow-gold";

    const referenceButton = reference?.querySelector("h3 > button");
    const referenceRegion = reference?.querySelector('[role="region"]');
    const referencePanel = reference?.querySelector('[role="region"] > div');
    const referenceGrid = reference?.querySelector('[role="region"] .columns-1');

    article.innerHTML = `
      <h3>
        <button type="button" class="${referenceButton?.className || "flex w-full items-center gap-4 px-6 py-4 text-left"}" aria-expanded="false">
          <span class="${referenceButton?.children?.[0]?.className || "inline-flex h-9 w-9 items-center justify-center rounded-full border"}" aria-hidden="true">\u0950</span>
          <span class="${referenceButton?.children?.[1]?.className || "flex-1 font-display text-xl font-semibold"}">${anandvardhakayaTitle}\u0964</span>
          <span class="${referenceButton?.children?.[2]?.className || "inline-flex h-8 w-8 items-center justify-center"}" aria-hidden="true">\u2726</span>
        </button>
      </h3>
      <div role="region" aria-label="${anandvardhakayaTitle}" class="${referenceRegion?.className || ""}" hidden>
        <div class="${referencePanel?.className || "px-5 pb-5"}">
          <div class="${referenceGrid?.className || "columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3"}"></div>
        </div>
      </div>
    `;

    return article;
  }

  function addAnandvardhakayaCategory() {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return;

    document.querySelector(`#${anandvardhakayaArticleId}`)?.remove();

    const articles = Array.from(gallery.querySelectorAll("article"));
    const reference = findAdwitayaArticle() || articles[articles.length - 1];
    if (!reference) return;

    const photoGrid = reference.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    const currentPhotos = photoGrid.querySelectorAll('[id^="charitra-anandvardhakaya-"]');
    if (
      currentPhotos.length !== anandvardhakayaPhotos.length ||
      currentPhotos[0]?.id !== anandvardhakayaPhotos[0].id
    ) {
      currentPhotos.forEach((photo) => photo.remove());
      photoGrid.append(...anandvardhakayaPhotos.map((photo) => createAnandvardhakayaItem(photo)));
    }
  }

  function findVedantVedyaArticle() {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return null;

    return Array.from(gallery.querySelectorAll("article")).find((article) => {
      const text = article.querySelector("h3")?.textContent || "";
      return (
        text.includes("\u0935\u0947\u0926\u093E\u0928\u094D\u0924 \u0935\u0947\u0926\u094D\u092F\u093E\u092F") ||
        text.includes("\u0935\u0947\u0926\u093E\u0928\u094D\u0924\u0935\u0947\u0926\u094D\u092F\u093E\u092F") ||
        text.toLowerCase().includes("vedant")
      );
    });
  }

  function isGalleryArticleOpen(article) {
    return article?.querySelector("h3 > button")?.getAttribute("aria-expanded") === "true";
  }

  function addVedantVedyaBanner() {
    if (document.querySelector(`#${vedantVedyaBannerId}`)) return;

    const vedantArticle = findVedantVedyaArticle();
    if (!isGalleryArticleOpen(vedantArticle)) return;

    const panel = vedantArticle?.querySelector('[role="region"] > div');
    const photoGrid = vedantArticle?.querySelector('[role="region"] .columns-1');
    if (!panel || !photoGrid) return;

    const banner = document.createElement("div");
    banner.id = vedantVedyaBannerId;
    banner.className = "vedant-vedya-banner";
    banner.innerHTML = `
      <p class="vedant-vedya-banner__quote">भाष्यकार की शैली दीवाना बना देती है</p>
      <p class="vedant-vedya-banner__source">-- परम पूज्य स्वामीजी</p>
      <div class="vedant-vedya-banner__gap" aria-hidden="true"></div>
      <p class="vedant-vedya-banner__reply">और हमें परम पूज्य स्वामीजी की....</p>
    `;

    photoGrid.insertAdjacentElement("beforebegin", banner);
  }

  function updateVedantAmritbhashinePhoto() {
    const vedantArticle = findVedantVedyaArticle();
    if (!isGalleryArticleOpen(vedantArticle)) return;

    const photoGrid = vedantArticle?.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    const existingItem = photoGrid.querySelector(`#${vedantAmritbhashineItemId}`);
    if (existingItem) {
      const existingCaption = existingItem.querySelector("p");
      if (existingCaption) existingCaption.textContent = vedantAmritbhashineCaption;
      return;
    }

    const item = document.createElement("button");
    item.type = "button";
    item.id = vedantAmritbhashineItemId;
    item.className = "charitra-inserted-photo";
    item.setAttribute("aria-label", "View Om Amritbhashine Namah image");
    item.innerHTML = `
      <img
        src="${vedantAmritbhashineImageUrl}"
        alt="Om Amritbhashine Namah"
        loading="lazy"
      />
      <p>${vedantAmritbhashineCaption}</p>
    `;
    item.addEventListener("click", () =>
      openInsertedImageViewer(
        vedantAmritbhashineImageUrl,
        "Om Amritbhashine Namah",
        vedantAmritbhashineCaption,
      ),
    );

    const bhashyakarCaption = Array.from(photoGrid.querySelectorAll("button p, figure p")).find(
      (caption) =>
        (caption.textContent || "").includes("\u092D\u093E\u0937\u094D\u092F\u0915\u093E\u0930") &&
        (caption.textContent || "").includes("\u092A\u094D\u0930\u093F\u092F\u093E\u092F"),
    );
    const anchor = bhashyakarCaption?.closest("button, figure");
    if (anchor?.parentElement === photoGrid) {
      anchor.insertAdjacentElement("afterend", item);
    } else {
      photoGrid.append(item);
    }
  }

  function updateAdwitayaExistingBanner() {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return;

    const adwitayaArticle = Array.from(gallery.querySelectorAll("article")).find(
      (article) => article.querySelector("h3")?.textContent.includes("अद्वितीयाय"),
    );
    const panel = adwitayaArticle?.querySelector('[role="region"] > div');
    const banner = panel?.querySelector(":scope > div.relative.mb-6");
    const content = banner?.querySelector(".relative.z-10");
    if (!content || content.dataset.adwitayaTextUpdated) return;

    const blockquotes = content.querySelectorAll("blockquote");
    const paragraphs = content.querySelectorAll("p");
    const divider = content.querySelector('[aria-hidden="true"]');
    const swamijiQuote = blockquotes[0];
    const devoteeQuote = blockquotes[1];
    const swamijiSource = paragraphs[0];
    const devoteeSource = paragraphs[1];
    const reflection = paragraphs[2];

    if (!swamijiQuote || !devoteeQuote || !swamijiSource || !devoteeSource || !reflection) {
      return;
    }

    swamijiQuote.textContent =
      '"(ज्ञानी में) प्रेम करने की कितनी सामर्थ्य है - Everybody gets his हिस्सा और उस हिस्से पर कोई दूसरा दखल नहीं दे सकता"';
    swamijiSource.textContent = "- परम पूज्य स्वामीजी";
    reflection.textContent = "साक्षात् देखा हमने परम पूज्य स्वामीजी में";
    devoteeSource.textContent = "As a devotee wrote--";
    devoteeQuote.textContent =
      '"One very unique characteristic of His personality was giving attention and Love to everybody who came to him in a style that everyone realized he/she is paid extra care by Poojy Swami Ji!"';

    content.replaceChildren(
      swamijiQuote,
      swamijiSource,
      reflection,
      ...(divider ? [divider] : []),
      devoteeSource,
      devoteeQuote,
    );
    content.dataset.adwitayaTextUpdated = "true";
  }

  function updateSidhbariLeelaBanner() {
    const leela = document.querySelector("#leela");
    if (!leela) return;

    const paragraphs = Array.from(leela.querySelectorAll("p"));
    const aboutLine = paragraphs.find((paragraph) =>
      (paragraph.textContent || "").includes("ABOUT PUJYA SWAMIJI"),
    );
    const leafQuote = paragraphs.find((paragraph) =>
      (paragraph.textContent || "").includes("He lives in every leaf"),
    );
    const devoteeLine = paragraphs.find((paragraph) =>
      (paragraph.textContent || "").includes("As an Amma wrote"),
    );

    aboutLine?.remove();
    leafQuote?.remove();

    if (!devoteeLine || devoteeLine.dataset.sidhbariDevoteeUpdated) return;

    devoteeLine.textContent = "As a devotee writes--";
    devoteeLine.className =
      "mb-4 mx-auto mt-3 max-w-2xl font-display text-lg italic leading-relaxed sm:text-xl";
    devoteeLine.style.color = "#5C2F18";
    devoteeLine.style.removeProperty("letter-spacing");
    devoteeLine.dataset.sidhbariDevoteeUpdated = "true";
  }

  function repairStutiGangeshanandaImages() {
    const stuti = document.querySelector("#stuti");
    if (!stuti) return;

    const portrait = stuti.querySelector(
      'img[alt="Brahmaleen Swami Gangeshanandaji"]',
    );
    const stutiImage = stuti.querySelector(
      'img[alt="Stuti by Brahmaleen Swami Gangeshanandaji"]',
    );

    const repairImage = (image, primarySrc, fallbackSrc) => {
      if (!image || image.dataset.stutiImageRepaired) return;

      image.dataset.stutiImageRepaired = "true";
      image.addEventListener(
        "error",
        () => {
          if (image.dataset.stutiFallbackApplied) return;
          image.dataset.stutiFallbackApplied = "true";
          image.src = fallbackSrc;
        },
        { once: true },
      );

      if (image.complete && image.naturalWidth === 0) {
        image.src = primarySrc;
      }
    };

    repairImage(
      portrait,
      "/assets/stuti-gangeshananda-new-BC36bOaV.jpg?v=2",
      "/assets/stuti-gangeshananda-BlQ4qr1T.jpg?v=2",
    );
    repairImage(
      stutiImage,
      "/assets/subodhananda-stotram-enhanced-color.jpg?v=1",
      "/assets/stuti-gangeshananda-BlQ4qr1T.jpg?v=2",
    );

    updateGangeshanandaStutiText(stutiImage);
  }

  function updateGangeshanandaStutiText(stutiImage) {
    if (!stutiImage || stutiImage.dataset.gangeshanandaTextUpdated) return;

    const stutiText = `॥ श्री सद्गुरुदेवाय नमः ॥
१.
शिवं शान्तं शुद्धं सुमतिविदितार्थं क्षम हरं
परमं पुण्यं अनर्घं, पद्मपत्राभिमं हृद्यम् ।
विभूतिं भूतीनां परमं महनीयं च महात्मं ।
सुबोधानन्दं श्रीगुरुवरमहं, नौमि सततम् ॥१॥

२.
वैदिक-लौकिक-शास्त्रं, ज्ञान-विज्ञान-संयुतम् ।
कथायां पीयूष-प्रवचन-कलायां च पटुला ।
तार्किकं तर्कातीतं तर्कहर्तारं तु तुष्टिदम् ।
सुबोधानन्दं श्रीगुरुवरमहं नौमि सततम् ॥२॥

३.
उद्यद्भानुविलसत् काषाय-वस्त्रावृतम् ।
विभूतिभूषितं कायं प्रणतजनतापोपशमनम् ।
सिद्धवाणी-निवासिन् भक्ताश्रयं भक्तसुखदं ।
सुबोधानन्द श्रीगुरुवरमहं नौमि सततं ॥३॥

४.
यदीयं कारुण्यं पतति शरणागतेऽपि मनुजे ।
यदासगुड्डे डभगुड्डे गलति भवरंगुड्डे रुचिरता,
जनः सेवीधन्यो भवति कृत्पुण्यो नचिरतः ।
सुबोधानन्द गुरुवरमहं नौमि सततम् ॥४॥

५.
यदालोके लोके भवति नहि शोके क्षणतमः ।
पदाम्भोज-ध्यानं दिशति परमानन्द-पदवीम् ।
दयां कृत्वा नाथ स्वपदशरणं देहि शिवदं ।
सुबोधानन्द श्रीगुरुवरमहं नौमि सततम् ॥५॥`;

    const imageCard = stutiImage.closest("button, figure, div");
    let container = imageCard?.parentElement;
    while (
      container &&
      container.id !== "stuti" &&
      !(
        container.textContent?.includes("Brahmaleen Swami Gangeshanandaji") &&
        container.querySelector('img[alt="Brahmaleen Swami Gangeshanandaji"]')
      )
    ) {
      container = container.parentElement;
    }

    const anchor = imageCard || stutiImage;
    if (container && anchor.parentElement === container) {
      let sibling = anchor.nextElementSibling;
      while (sibling) {
        const next = sibling.nextElementSibling;
        if (!sibling.matches?.(".gangeshananda-stuti-text")) sibling.remove();
        sibling = next;
      }
    }

    const block = document.createElement("div");
    block.className = "gangeshananda-stuti-text";
    stutiText.split("\n\n").forEach((verse) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = verse;
      block.append(paragraph);
    });

    anchor.insertAdjacentElement("afterend", block);
    stutiImage.dataset.gangeshanandaTextUpdated = "true";
  }

  function boldOmCaptions() {
    const captions = document.querySelectorAll(
      '#photo-gallery2 [role="region"] button p',
    );
    const mantraPattern =
      /^\s*((?:ॐ|ओम|Om)\s+[\s\S]*?(?:नमः|नम:|namah)\s*[।.!]?)([\s\S]*)$/i;

    captions.forEach((caption) => {
      if (caption.querySelector(".om-caption-lead")) return;

      const match = caption.textContent.match(mantraPattern);
      if (!match) return;

      const lead = document.createElement("strong");
      lead.className = "om-caption-lead";
      lead.textContent = match[1].trim();

      caption.replaceChildren(lead);

      if (match[2].trim()) {
        const remainder = document.createElement("span");
        remainder.className = "om-caption-remainder";
        remainder.textContent = match[2].trim();
        caption.append(remainder);
      }
    });
  }

  function correctCharanVandanCaption() {
    document
      .querySelectorAll("#charan-vandan figcaption p, #photo-gallery2 figcaption p")
      .forEach((caption) => {
        caption.childNodes.forEach((node) => {
          if (node.nodeType !== Node.TEXT_NODE) return;
          node.textContent = node.textContent.replace(
            "\u092A\u0926\u0932\u094B\u091A\u0928\u092E\u094D",
            "\u092A\u0926\u094D\u092F\u0932\u094B\u091A\u0928\u092E\u094D",
          );
        });
      });
  }

  function galleryItemForImage(image) {
    if (!image) return null;
    const item = image.closest("button, figure");
    if (item && item.querySelector("img")) return item;
    return image.parentElement;
  }

  function polishNamamiChittchorkamSection() {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return;

    const removedImage = gallery.querySelector(
      'img[src*="namami-prabhuji-smile-BMTzFt8A"]',
    );
    galleryItemForImage(removedImage)?.remove();

    const mainImage = gallery.querySelector('img[src*="smilemain-CPWM9cCH"]');
    const mainItem = galleryItemForImage(mainImage);
    if (!mainImage || !mainItem) return;

    mainItem.classList.add("namami-sat-sad-main");
    if (!mainItem.querySelector(".namami-sat-sad-title")) {
      const title = document.createElement("span");
      title.className = "namami-sat-sad-title";
      title.textContent = "\u0938\u0924\u094D \u0938\u0926\u094D \u090F\u0935";
      mainItem.append(title);
    }

    const parent = mainItem.parentElement;
    if (parent && parent.lastElementChild !== mainItem) {
      parent.append(mainItem);
    }
  }

  let isEnhancingGallery = false;
  let vedantEnhanceTimer = null;

  function scheduleVedantEnhancements() {
    if (vedantEnhanceTimer !== null) window.clearTimeout(vedantEnhanceTimer);
    vedantEnhanceTimer = window.setTimeout(() => {
      vedantEnhanceTimer = null;
      addVedantVedyaBanner();
      updateVedantAmritbhashinePhoto();
    }, 420);
  }

  function enhanceGallery() {
    if (isEnhancingGallery) return;
    isEnhancingGallery = true;
    try {
      correctCharanVandanCaption();
      addVidyaImages();
      addDravinamImage();
      addGuruparamparaImage();
      addWheelchairImage();
      removeSadguruPetCaption();
      addArunUncleImage();
      updateAdwitayaPhotoCaptions();
      updateNamamiAnandaPhoto();
      removeNamamiDiwaliPhoto();
      addAnandvardhakayaCategory();
      scheduleVedantEnhancements();
      addFinalImage();
      updateAdwitayaExistingBanner();
      updateSidhbariLeelaBanner();
      repairStutiGangeshanandaImages();
      boldOmCaptions();
      polishNamamiChittchorkamSection();
    } finally {
      isEnhancingGallery = false;
    }
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeViewer();
  });

  document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(enhanceGallery);
    observer.observe(document.body, { childList: true, subtree: true });
    enhanceGallery();
  });
})();
