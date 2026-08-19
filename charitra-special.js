(() => {
  const imageUrl = "/assets/bhakta-vatsalaya-special-v2.jpg";
  const itemId = "bhakta-vatsalaya-special-final";
  const dravinamImageUrl =
    "/assets2/charitra-bhaktavatsala-dravinam-20260727.jpg";
  const dravinamItemId = "bhakta-vatsalaya-dravinam";
  const vidyaImages = [
    { id: "bhakta-vatsalaya-vidya-1", src: "/assets/bhakta-vidya-1.jpg" },
    { id: "bhakta-vatsalaya-vidya-2", src: "/assets/bhakta-vidya-2-revised.jpg" },
  ];
  const vidyaCombinedItemId = "bhakta-vatsalaya-vidya-combined";
  const wheelchairImageUrl = "/assets/wheelchairnew.jpg";
  const wheelchairItemId = "sadguru-priya-wheelchair-new";
  const guruparamparaImageUrl = "/assets/guruparampara.jpeg";
  const guruparamparaItemId = "sadguru-priya-guruparampara";
  const sadguruPriyayeImg1Id = "sadguru-priyaye-img1-20260725";
  const sadguruPriyayeImg1Url =
    "/assets2/sadguru-priyaye-img1-20260725.jpeg";
  const smitaIkshanayaImg2Id = "smita-ikshanaya-img2-20260725";
  const smitaIkshanayaImg2Url =
    "/assets2/smita-ikshanaya-img2-20260725.jpeg";
  const smitaIkshanayaSmileNewId =
    "smita-ikshanaya-smilenew-20260807";
  const smitaIkshanayaSmileNewUrl =
    "/assets2/smita-ikshanaya-smilenew-20260807.jpg";
  const guruparamparaCaption =
    "\u0938\u0926\u093E\u0936\u093F\u0935 \u0938\u092E\u093E\u0930\u092E\u094D\u092D\u093E\u092E\u094D \u0936\u0919\u094D\u0915\u0930\u093E\u091A\u093E\u0930\u094D\u092F \u092E\u0927\u094D\u092F\u092E\u093E\u092E\u094D\n\u0905\u0938\u094D\u092E\u0926\u094D \u0906\u091A\u093E\u0930\u094D\u092F \u092A\u0930\u094D\u092F\u0928\u094D\u0924\u093E\u092E\u094D \u0935\u0928\u094D\u0926\u0947 \u0917\u0941\u0930\u0941 \u092A\u0930\u092E\u094D\u092A\u0930\u093E\u092E\u094D II";
  const arunUncleImageUrl = "/assets/arununcle-new.jpeg";
  const arunUncleItemId = "adwitaya-arun-uncle-new";
  const arunUncleCaption = "\u0950 \u0905\u0926\u094D\u0935\u093F\u0924\u0940\u092F\u093E\u092F \u0928\u092E\u0903\u0964";
  const anandvardhakayaPhotos = [
    {
      // Moved here from ॐ स्मित ईक्षणाय (was captioned श्री प्रमोदनाय); re-captioned.
      id: "charitra-anandvardhakaya-sparshviheen",
      src: "/assets/smile3-D8MyYcv9.jpg",
      caption:
        "ॐ स्पर्शविहीनाय नमः।",
    },
    {
      id: "charitra-anandvardhakaya-2",
      src: "/assets/anandvardhakaya-2.jpeg",
      caption: "\u0924\u094D\u0935\u092E\u0947\u0915\u0902 \u0935\u0930\u0947\u0923\u094D\u092F\u092E\u094D",
      specialCaption: true,
    },
    {
      id: "charitra-anandvardhakaya-ganga",
      src: "/assets/anandvardhakaya-ganga.jpg",
      caption: "देखि हिमालय गंग तट रीझे",
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
    { id: "charitra-anandvardhakaya-boat", src: "/assets/anandvardhakaya-boat.jpg" },
    {
      id: "charitra-anandvardhakaya-new-1",
      src: "/assets2/anandvardhakaya-new-1.jpg",
    },
    {
      id: "charitra-anandvardhakaya-new-2",
      src: "/assets2/anandvardhakaya-new-2.jpg",
    },
    {
      id: "charitra-anandvardhakaya-rammandir-20260807",
      src: "/assets2/charitra-anandvardhakaya-rammandir-20260807.jpg",
    },
    {
      id: "charitra-anandvardhakaya-kalash",
      src: "/assets/anandvardhakaya-kalash.jpeg",
      caption:
        "“चित्त को संयमित करके, नियंत्रित करके,\nनिर्मल पवित्र भूमि बना दी जाए\nतो हो गया चित्रकूट।\nउसमें जो राम-स्नेह है, वह अरण्य है।”\n— परम पूज्य स्वामीजी",
      specialCaption: true,
    },
  ];
  const anandvardhakayaMovedPhotoIds = new Set([
    "charitra-anandvardhakaya-3",
    "charitra-anandvardhakaya-5",
    "charitra-anandvardhakaya-kalash",
  ]);
  const anandvardhakayaArticleId = "charitra-anandvardhakaya-category";
  const anandvardhakayaTitle =
    "\u0950 \u0906\u0928\u0928\u094D\u0926\u0935\u0930\u094D\u0927\u0915\u093E\u092F \u0928\u092E\u0903";
  const smitaIkshanSeriesId = "smita-ikshan-akhand-frame";
  const smitaShishyaHitItemId = "smita-shishya-hit-chintak-moved";
  const smitaShishyaHitImageUrl = "/assets/vedant-7-4YgsX_4u.jpg";
  const smitaIkshanSeriesCaption = "नन्दति नन्दति नन्दत्येव।";
  const smitaIkshanAnchorCaption = "अखण्डमजं भानुकोटिप्रकाशम्॥";
  const smitaIkshanSeriesPhotos = [
    {
      thumbnail: "/assets2/smita-ikshan-series-1-mobile.jpg",
      full: "/assets2/smita-ikshan-series-1.jpg",
    },
    {
      thumbnail: "/assets2/smita-ikshan-series-2-mobile.jpg",
      full: "/assets2/smita-ikshan-series-2.jpg",
    },
    {
      thumbnail: "/assets2/smita-ikshan-series-3-mobile.jpg",
      full: "/assets2/smita-ikshan-series-3.jpg",
    },
    {
      thumbnail: "/assets2/smita-ikshan-series-4-mobile.jpg",
      full: "/assets2/smita-ikshan-series-4.jpg",
    },
  ];

  function addCaptionOrnament(caption, variant) {
    if (!caption || caption.querySelector(".charitra-caption-ornament")) return;

    const ornament = document.createElement("span");
    ornament.className =
      `charitra-caption-ornament charitra-caption-ornament--${variant}`;
    ornament.setAttribute("aria-hidden", "true");

    const drawings = {
      smile:
        '<path d="M5 12c2.1 4.2 11.9 4.2 14 0"/><path d="M8 8.8h.01M16 8.8h.01"/><path d="M12 2.5c.7 2.1 2.4 3.8 4.5 4.5-2.1.7-3.8 2.4-4.5 4.5C11.3 9.4 9.6 7.7 7.5 7c2.1-.7 3.8-2.4 4.5-4.5Z"/>',
      sun:
        '<circle cx="12" cy="12" r="4.1"/><circle cx="12" cy="12" r="1.5"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.2 2.2M17.6 17.6l2.2 2.2M19.8 4.2l-2.2 2.2M6.4 17.6l-2.2 2.2"/>',
    };

    ornament.innerHTML =
      `<svg viewBox="0 0 24 24" focusable="false">` +
      drawings[variant] +
      `</svg>`;
    caption.prepend(ornament);
  }
  const vedantAmritbhashiBannerId = "vedant-amritbhashi-banner";
  const vedantAmritbhashineImageUrl = "/assets/vedant-bhashyakar-priyaya.jpeg";
  const vedantAmritbhashineItemId = "vedant-amritbhashine-new";
  const vedantTextDepthImageUrl =
    "/assets2/charitra-vedant-text-depth-20260728.jpg";
  const vedantTextDepthItemId = "vedant-text-depth-20260728";
  const vedantNewPhotos20260807 = [
    {
      id: "charitra-vedantvedaya-20260807-1",
      src: "/assets2/charitra-vedantvedaya-20260807-1.jpg",
      alt: "Pujya Swamiji teaching Vedanta",
    },
    {
      id: "charitra-vedantvedaya-20260807-2",
      src: "/assets2/charitra-vedantvedaya-20260807-2.jpg",
      alt: "Pujya Swamiji delivering a Vedanta discourse",
    },
  ];
  const vedantTextDepthCaption =
    "“He rarely went end-to-end with a text, choosing instead to dive deep into each verse, gently revealing the incredibly complex thought process and layers behind it.”";
  // Caption for the भाष्यकार-प्रियाय photo (moved off the removed second banner).
  const vedantBhashyakarCaption =
    "भाष्यकार की शैली दीवाना बना देती है। — परम पूज्य स्वामीजी";
  const vedantBhashyakarMantra = "ॐ भाष्यकार प्रियाय नमः।";
  const vedantBhashyakarRemembrance =
    "His Himaliyan dedication for Pujya Gurudev, for scriptures, for Motherland, for Hindi and Sanskrit language, Right pronunciation of words and verses, His in-depth knowledge of each word and its etymology, His knowledge of grammar, His Communication skills, His oratory, His unique smile, His facial expressions, gestures and physical movements while delivering discourses, His interaction with seekers, His inspiring style of reflections on Vedantic principles, His tolerance for imperfections and weaknesses of others, His oceanic knowledge of almost all subjects, His in depth analysis of various political, economic, agricultural, defense, sports and other issues, His Hospitality, His Cleanliness, His Self Confidence, His open challenges on Vedantic Declarations were worth INSPIRING.";
  const vedantRemembrancePhotoId = "vedant-himalayan-dedication-remembrance";
  const vedantRemembrancePhotoUrl =
    "/assets2/vedant-himalayan-dedication-remembrance.jpg?v=1";
  const vedantShastraSammatCaption =
    "“कोई शास्त्र-सम्मत बोले तो मुझे बहुत आनन्द आता है। जहाँ शास्त्र से फिसला कि मेरा रस बिगड़ जाता है।” — परम पूज्य स्वामीजी";
  const vedantShastraSammatCaptionHtml =
    `${vedantShastraSammatCaption}` +
    `<span class="vedant-shastra-divider" aria-hidden="true"><i></i><b>✦</b><i></i></span>` +
    `<strong class="vedant-shastra-invocation">ॐ शास्त्रार्थ प्रियाय नमः ।</strong>`;
  const vedantSpiritualKnowledgeCaption =
    "“An epitome of spiritual knowledge, Swamiji imparted Vedantic teachings through very simple methods. He is still with us through his available discourses. It is a joy to receive nourishment from him every day and live through the peaceful journey of life.”";
  const kreedaEnglishCaption =
    "A lot of Volleyball too until early 2005 before valve replacement surgery!\nLater Pujya Swamiji adopted doing regular yogasanas in His cottage instead of outdoor games.\nHe was a very good badminton player in his time.\nDuring my batch (1998), I was blessed enough that he used to play with me in a very well steady manner and also taught me the same.";
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
    viewer.setAttribute("aria-label", "\u0926\u094D\u0930\u0935\u093F\u0923\u0902 \u0924\u094D\u0935\u092E\u0947\u0935");
    viewer.innerHTML = `
      <button type="button" class="charitra-viewer-close" aria-label="Close">×</button>
      <img
        src="${dravinamImageUrl}"
        alt="\u0926\u094D\u0930\u0935\u093F\u0923\u0902 \u0924\u094D\u0935\u092E\u0947\u0935"
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
    if (!gallery) {
      console.log("[charitra-special] photo-gallery2 not found");
      return null;
    }

    const articles = Array.from(gallery.querySelectorAll("article"));
    console.log("[charitra-special] Found " + articles.length + " articles");

    const found = articles.find((article) => {
      const text = article.querySelector("h3")?.textContent || "";
      const match = (
        text.includes("\u0938\u0926\u094D\u0917\u0941\u0930\u0941\u092A\u094D\u0930\u093F\u092F\u093E\u092F") ||
        text.includes("\u0938\u0926\u0917\u0941\u0930\u0941\u092A\u094D\u0930\u093F\u092F\u093E\u092F") ||
        text.toLowerCase().includes("sadguru")
      );
      if (match) {
        console.log("[charitra-special] Found sadguru priya article: " + text.substring(0, 50));
      }
      return match;
    });

    if (!found) {
      console.log("[charitra-special] Sadguru priya article NOT found");
      articles.forEach((article, idx) => {
        const text = article.querySelector("h3")?.textContent || "";
        console.log("[charitra-special] Article " + idx + ": " + text.substring(0, 50));
      });
    }

    return found;
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

  function addBhaktaVatsalayaChildrenMemory() {
    const article = findBhaktaArticle();
    const photoGrid = article?.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    let memory = photoGrid.querySelector(
      "#bhakta-vatsalaya-children-memory",
    );
    if (!memory) {
      memory = document.createElement("blockquote");
      memory.id = "bhakta-vatsalaya-children-memory";
      memory.className = "bhakta-vatsalaya-children-memory";
      memory.setAttribute(
        "aria-label",
        "A devotee remembers Pujya Guruji with children",
      );
      memory.innerHTML = `
        <span class="bhakta-vatsalaya-children-memory__ornament" aria-hidden="true">\u2736</span>
        <p>\u201CDuring the camps in the early 2000s, Guruji used to spend time with a group of children, and we elders were instructed not to encroach upon their time. The children would serve lunch to Guruji and watch television with him.\u201D</p>
        <span class="bhakta-vatsalaya-children-memory__closing" aria-hidden="true">\u2766</span>
      `;
    }

    // Open the section with this remembrance; the devotional photo sequence
    // then begins naturally with "Tvameva Mata..." and continues from there.
    if (photoGrid.firstElementChild !== memory) {
      photoGrid.insertBefore(memory, photoGrid.firstElementChild);
    }
  }

  const blessingSectionId = "bhakta-vatsalaya-blessing-section";
  const blessingImageUrl = "/assets2/special.jpg";

  function addBlessingSection() {
    const bhaktaArticle = findBhaktaArticle();
    const photoGrid = bhaktaArticle?.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    const existing = document.querySelector(`#${blessingSectionId}`);
    if (existing) {
      if (photoGrid.lastElementChild !== existing) photoGrid.append(existing);
      return;
    }

    const section = document.createElement("section");
    section.id = blessingSectionId;
    section.className = "blessing-section";
    section.setAttribute("aria-label", "Handwritten blessing by Param Pujya Swamiji");
    section.innerHTML = `
      <button type="button" class="note-frame" aria-label="Enlarge handwritten blessing">
        <img
          src="${blessingImageUrl}"
          alt="Handwritten blessing by Param Pujya Swamiji"
          class="note-image"
          loading="lazy"
        />
      </button>
      <div class="caption-card">
        <div class="caption-ornament" aria-hidden="true">
          <span class="caption-line"></span>
          <span class="caption-flourish">✦</span>
          <span class="caption-line"></span>
        </div>
        <div class="caption-area">
          <p class="caption-blessing"><strong>माम् अनुस्मर</strong><br /><strong>युध्य च</strong></p>
          <p>As a young girl prepared to step out of the familiar shelter of home and face the wider world, Param Pujya Swamiji lovingly blessed her with these words.</p>
          <p class="caption-prayer">May Param Pujya Swamiji bless us all with these words.</p>
        </div>
        <div class="caption-date">Taken with permission from the recipient — name withheld</div>
      </div>
    `;
    section.querySelector(".note-frame").addEventListener("click", () =>
      openInsertedImageViewer(
        blessingImageUrl,
        "Handwritten blessing by Param Pujya Swamiji",
      ),
    );
    photoGrid.append(section);
  }

  function createDravinamItem(photoGrid) {
    // Keep the earlier solo photograph and add the new one. The old bundle
    // photograph showing another garlanded man is deliberately excluded.
    const sources = [
      "/assets/dravinam.jpeg",
      dravinamImageUrl,
    ];
    const item = document.createElement("button");
    item.type = "button";
    item.id = dravinamItemId;
    item.className = "charitra-inserted-photo charitra-combined-photo";
    item.setAttribute("aria-label", "View \u0926\u094D\u0930\u0935\u093F\u0923\u0902 \u0924\u094D\u0935\u092E\u0947\u0935 image");
    item.innerHTML = `
      <span class="charitra-combined-photo__media">
        ${sources
          .map(
            (src) => `<img
              src="${src}"
              alt="\u0926\u094D\u0930\u0935\u093F\u0923\u0902 \u0924\u094D\u0935\u092E\u0947\u0935"
              loading="lazy"
            />`,
          )
          .join("")}
      </span>
      <p>\u0926\u094D\u0930\u0935\u093F\u0923\u0902 \u0924\u094D\u0935\u092E\u0947\u0935</p>
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

  function addTvamevSakhaImage() {
    const itemId = "bhakta-vatsalaya-tvamev-sakha-20260727";
    if (document.querySelector(`#${itemId}`)) return;

    const bhaktaArticle = findBhaktaArticle();
    const photoGrid = bhaktaArticle?.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    const oldSakhaCard = findSakhaCard(photoGrid);
    const item = document.createElement("button");
    const src =
      "/assets2/charitra-bhaktavatsala-tvamevabandhu-20260727.jpg";
    const caption = "\u091A \u0938\u0916\u093E \u0924\u094D\u0935\u092E\u0947\u0935";
    item.type = "button";
    item.id = itemId;
    item.className = "charitra-inserted-photo charitra-combined-photo";
    item.setAttribute("aria-label", `View ${caption} image`);
    item.innerHTML = `
      <span class="charitra-combined-photo__media">
        <img
          src="/assets/pair-sakha-tight-CkFwrDQh.jpg"
          alt="${caption} — earlier photographs"
          loading="lazy"
        />
        <img src="${src}" alt="${caption}" loading="lazy" />
      </span>
      <p>${caption}</p>
    `;
    item.addEventListener("click", () =>
      openInsertedImageViewer(src, caption, caption),
    );

    if (oldSakhaCard) {
      oldSakhaCard.insertAdjacentElement("beforebegin", item);
      oldSakhaCard.remove();
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

  function createRequestedPhotoItem(id, imageUrl, label) {
    const item = document.createElement("button");
    item.type = "button";
    item.id = id;
    item.className = "charitra-inserted-photo";
    item.setAttribute("aria-label", label);

    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = label;
    image.loading = "lazy";
    item.append(image);

    item.addEventListener("click", () =>
      openInsertedImageViewer(imageUrl, label),
    );
    return item;
  }

  function addRequestedCharitraPhotos() {
    const sadguruPriyaArticle = findSadguruPriyaArticle();
    const sadguruGrid =
      sadguruPriyaArticle?.querySelector('[role="region"] .columns-1');
    if (
      sadguruGrid &&
      !sadguruPriyaArticle.querySelector(`#${sadguruPriyayeImg1Id}`)
    ) {
      sadguruGrid.append(
        createRequestedPhotoItem(
          sadguruPriyayeImg1Id,
          sadguruPriyayeImg1Url,
          "Pujya Gurudev remembrance photograph",
        ),
      );
    }

    const smitaArticle = findGalleryArticleByHeading(["स्मित ईक्षणाय"]);
    const smitaGrid =
      smitaArticle?.querySelector('[role="region"] .columns-1');
    if (
      smitaGrid &&
      !smitaArticle.querySelector(`#${smitaIkshanayaImg2Id}`)
    ) {
      smitaGrid.append(
        createRequestedPhotoItem(
          smitaIkshanayaImg2Id,
          smitaIkshanayaImg2Url,
          "Smita Ikshanaya photograph",
        ),
      );
    }
    if (
      smitaGrid &&
      !smitaArticle.querySelector(`#${smitaIkshanayaSmileNewId}`)
    ) {
      smitaGrid.append(
        createRequestedPhotoItem(
          smitaIkshanayaSmileNewId,
          smitaIkshanayaSmileNewUrl,
          "Pujya Swamiji smiling — Om Smita Ikshanaya Namah",
        ),
      );
    }
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

  function removeOldWheelchairCard() {
    const sadguruPriyaArticle = findSadguruPriyaArticle();
    const cards = sadguruPriyaArticle?.querySelectorAll('[role="region"] button');
    if (!cards) return;

    cards.forEach((card) => {
      if (card.id === wheelchairItemId) return;
      const text = (card.textContent || "").toLowerCase();
      if (text.includes("would push his wheelchair")) card.remove();
    });
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

  const sadguruPriyayeReflectionId = "sadguru-priyaye-reflection";
  const sadguruPriyayeReflection = [
    "“गुरुदेव कहते थे…”—these are words we hear again and again in Param Pujya Swamiji’s satsangs. How deeply Pujya Gurudev’s memories and words were woven into Param Pujya Swamiji’s very being can be felt through his own words:",
    "“It is natural that His memories and His words have become deeply embedded in my very being—so deeply that, while thinking or giving a discourse, they naturally emerge again and again.”",
    "The profound inspiration that Param Pujya Swamiji received from Pujya Gurudev’s words, conduct, and steadfast dedication is continually reflected in his satsangs. With immense love and fondness, Param Pujya Swamiji naturally and spontaneously remembers Pujya Gurudev, quoting His sayings and recounting His anecdotes with such precise relevance that not only does the deeper meaning of the subject become clear, but we also receive glimpses of Gurudev’s greatness—His distinctive oratorical style, remarkable command over words, fearless expression, and exceptionally precise, scripturally grounded, yet effortlessly witty responses—as though Gurudev’s presence itself comes alive before us.",
    "Even in the hearts of those who were not blessed with the opportunity to have Pujya Gurudev’s darshan in person, Pujya Swamiji’s satsangs establish a deep and living connection with Him. The anecdotes, reminiscences, and words shared by Pujya Swamiji have left an indelible impression upon our hearts and minds.",
  ];
  const sadguruPriyayeReflectionHindi = [
    "“गुरुदेव कहते थे…”—ये वे शब्द हैं जिन्हें हम परम पूज्य स्वामीजी के सत्संगों में बार-बार सुनते हैं। गुरुदेव की स्मृतियाँ और उनकी वाणी परम पूज्य स्वामीजी के अन्तर्मन में कितनी गहराई से रच-बस गई थीं, इसे उनके अपने शब्दों में अनुभव किया जा सकता है—",
    "“स्वाभाविक है कि उनकी स्मृतियाँ, उनकी वाणी मेरे स्वयं में रच-बस गई हैं। कुछ इस तरह से रच-बस गई हैं कि सोचते समय और प्रवचन करते समय उनका पुनः-पुनः प्रकट हो जाना स्वाभाविक ही है।”",
    "गुरुदेव की वाणी, व्यवहार और निष्ठा ने परम पूज्य स्वामीजी को कितनी गहराई से उत्प्रेरित किया था, इसकी झलक उनके सत्संगों में निरन्तर मिलती है। अपार प्रेम और आत्मीयता के साथ परम पूज्य स्वामीजी सहज ही पूज्य गुरुदेव का स्मरण करते हैं तथा उनकी सूक्तियों और प्रसंगों को ऐसी सटीक प्रासंगिकता के साथ उद्धृत करते हैं कि न केवल विषय का गहन अर्थ स्पष्ट हो जाता है, बल्कि हमें गुरुदेव की महिमा, उनकी विशिष्ट वक्तृत्व-शैली, शब्दों पर उनके अद्भुत अधिकार, निर्भीक अभिव्यक्ति तथा अत्यन्त सटीक, शास्त्र-सम्मत और सहज विनोदपूर्ण प्रत्युत्तरों की झलकियाँ भी मिलती रहती हैं—और मानो गुरुदेव की उपस्थिति सजीव हो उठती है।",
    "जिन्हें गुरुदेव के साक्षात् दर्शन का सौभाग्य प्राप्त नहीं हुआ, उनके हृदयों में भी परम पूज्य स्वामीजी के सत्संग गुरुदेव के साथ एक गहरा और जीवंत संबंध स्थापित कर देते हैं। उनके द्वारा सुनाए गए ये प्रसंग, संस्मरण और वचन हमारे मन पर अपनी अमिट छाप छोड़ते हैं।",
  ];

  function updateSadguruPriyayeCaption() {
    const sadguruPriyaArticle = findSadguruPriyaArticle();
    if (!sadguruPriyaArticle) return;

    const photoGrid = sadguruPriyaArticle.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    const existingReflection = document.querySelector(
      `#${sadguruPriyayeReflectionId}`,
    );
    if (existingReflection) {
      const memorial = photoGrid.querySelector(
        ":scope > .sadguru-priyaya-mahasamadhi",
      );
      if (memorial) {
        if (memorial.previousElementSibling !== existingReflection) {
          photoGrid.insertBefore(existingReflection, memorial);
        }
      } else if (photoGrid.lastElementChild !== existingReflection) {
        photoGrid.append(existingReflection);
      }
      return;
    }

    const reflection = document.createElement("section");
    reflection.id = sadguruPriyayeReflectionId;
    reflection.className = "sadguru-priyaye-reflection";
    reflection.style.order = "10000";
    reflection.setAttribute("aria-label", "Remembrance of Pujya Gurudev");

    const ornament = document.createElement("div");
    ornament.className = "sadguru-priyaye-reflection__ornament";
    ornament.setAttribute("aria-hidden", "true");
    ornament.textContent = "ॐ श्री चिन्मय सद्गुरवे नमः ॥";

    const translateButton = document.createElement("button");
    translateButton.type = "button";
    translateButton.className = "sadguru-priyaye-reflection__translate";
    translateButton.textContent = "हिन्दी में पढ़ें";
    translateButton.setAttribute("aria-pressed", "false");
    reflection.append(translateButton);

    const copy = document.createElement("div");
    copy.className = "sadguru-priyaye-reflection__copy";
    reflection.append(copy, ornament);

    const renderReflection = (language) => {
      const isHindi = language === "hi";
      copy.replaceChildren();
      copy.lang = isHindi ? "hi" : "en";
      (isHindi ? sadguruPriyayeReflectionHindi : sadguruPriyayeReflection).forEach(
        (text, index) => {
          const paragraph = document.createElement("p");
          if (index === 0) {
            paragraph.className = "sadguru-priyaye-reflection__lead";
            paragraph.textContent = text;
          } else if (index === 1) {
            const swamijiQuote = document.createElement("em");
            swamijiQuote.className = "sadguru-priyaye-reflection__swamiji-quote";
            swamijiQuote.lang = "hi";
            // These are Param Pujya Swamiji's original Hindi words. Preserve
            // them unchanged even when the surrounding reflection is in English.
            swamijiQuote.textContent = sadguruPriyayeReflectionHindi[1];
            paragraph.append(swamijiQuote);

            const source = document.createElement("small");
            source.className = "sadguru-priyaye-reflection__quote-source";
            source.lang = "hi";
            source.textContent = "‘गुरुवरं हृदि भावयामि’ की प्रस्तावना से";
            paragraph.append(source);
          } else {
            paragraph.textContent = text;
          }
          copy.append(paragraph);
        },
      );
      translateButton.textContent = isHindi ? "Read in English" : "हिन्दी में पढ़ें";
      translateButton.setAttribute("aria-pressed", String(isHindi));
      reflection.classList.toggle("sadguru-priyaye-reflection--hindi", isHindi);
    };

    translateButton.addEventListener("click", () => {
      renderReflection(translateButton.getAttribute("aria-pressed") === "true" ? "en" : "hi");
    });
    renderReflection("en");

    // The reflection closes the regular-photo sequence. The Mahasamadhi
    // grouping routine appends its four-photo memorial immediately after it.
    photoGrid.append(reflection);
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
    const firstCaptionText = (firstCaption?.textContent || "")
      .replace(/\u093C/g, "");
    const isProtectedDevotionalCaption =
      firstCaptionText.includes("\u0927\u0947\u0928\u0941 \u092A\u094D\u0930\u093F\u092F\u093E\u092F") ||
      firstCaptionText.includes("\u0915\u094D\u0930\u0940\u0921\u093E \u092A\u094D\u0930\u093F\u092F\u093E\u092F");
    if (
      firstCaption &&
      !isProtectedDevotionalCaption &&
      firstCaption.dataset.adwitayaFirstCaptionUpdated !== "true"
    ) {
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

    const anandaImage = photoGrid.querySelector(
      'img[src*="smile4-B5Kw7PHh"]',
    );
    const anandaCard = galleryItemForImage(anandaImage);
    if (!anandaCard) return;

    let caption = anandaCard.querySelector("p");
    if (!caption) {
      caption = document.createElement("p");
      anandaCard.append(caption);
    }
    if (caption.textContent !== namamiAnandaCaption) {
      caption.replaceChildren(document.createTextNode(namamiAnandaCaption));
    }

    Array.from(photoGrid.querySelectorAll("button p, figure p")).forEach(
      (otherCaption) => {
        if (
          otherCaption !== caption &&
          (otherCaption.textContent || "").trim() === namamiAnandaCaption.trim()
        ) {
          otherCaption.remove();
        }
      },
    );

    const firstPhoto = Array.from(photoGrid.children).find((child) =>
      child.matches?.("button, figure"),
    );
    if (firstPhoto && firstPhoto !== anandaCard) {
      photoGrid.insertBefore(anandaCard, firstPhoto);
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

  function moveShishyaHitChintakPhotoToSmita() {
    const vedantArticle = findVedantVedyaArticle();
    const originalImage = vedantArticle?.querySelector(
      'img[src*="vedant-7-4YgsX_4u"]',
    );
    const originalItem = galleryItemForImage(originalImage);
    if (originalItem) originalItem.remove();

    const smitaArticle = findNamamiChittchorkamArticle();
    const smitaGrid = smitaArticle?.querySelector(
      '[role="region"] .columns-1',
    );
    if (!smitaGrid) return;

    let movedItem = smitaGrid.querySelector(`#${smitaShishyaHitItemId}`);
    if (!movedItem) {
      movedItem = document.createElement("button");
      movedItem.type = "button";
      movedItem.id = smitaShishyaHitItemId;
      movedItem.className = "charitra-inserted-photo";
      movedItem.setAttribute(
        "aria-label",
        "View Pujya Swamiji photograph",
      );
      movedItem.innerHTML = `
        <img
          src="${smitaShishyaHitImageUrl}"
          alt="Pujya Swamiji"
          loading="lazy"
        />
      `;
      movedItem.addEventListener("click", () =>
        openInsertedImageViewer(
          smitaShishyaHitImageUrl,
          "Pujya Swamiji",
        ),
      );
    }
    movedItem.querySelectorAll("p, figcaption").forEach((caption) =>
      caption.remove(),
    );
    if (movedItem.parentElement !== smitaGrid) {
      smitaGrid.append(movedItem);
    }

    document.querySelectorAll('[role="dialog"]').forEach((dialog) => {
      if (
        dialog.querySelector('img[src*="vedant-7-4YgsX_4u"]')
      ) {
        dialog.querySelectorAll("p, figcaption").forEach((caption) =>
          caption.remove(),
        );
      }
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
      openInsertedImageViewer(
        photo.src,
        "Om Anandvardhakaya Namah",
        photo.caption || "",
      ),
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
          <span class="${referenceButton?.children?.[2]?.className || "inline-flex h-8 w-8 items-center justify-center"}" aria-hidden="true"></span>
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

  function addAnandvardhakayaTributeBanner(article) {
    if (!article || article.querySelector(".anandvardhakaya-tribute-banner")) {
      return;
    }

    const panel = article.querySelector('[role="region"] > div');
    if (!panel) return;

    const banner = document.createElement("blockquote");
    banner.className = "anandvardhakaya-tribute-banner";

    const attribution = document.createElement("p");
    attribution.className = "anandvardhakaya-tribute-banner__attribution";
    attribution.textContent =
      "परम पूज्य महामंडलेश्वर स्वामी प्रणव चैतन्य पुरी जी महाराज के उद्गार—";

    const quote = document.createElement("p");
    quote.className = "anandvardhakaya-tribute-banner__quote";
    quote.textContent =
      "“किसी को क्षणभर में अपना बना लेना तो कोई उनसे सीखे।”";

    banner.append(attribution, quote);
    panel.insertAdjacentElement("afterbegin", banner);
  }

  function addAnandvardhakayaCategory() {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return;

    const articles = Array.from(gallery.querySelectorAll("article"));
    const reference = findAdwitayaArticle() || articles[articles.length - 1];
    if (!reference) return;

    // If the standalone category already exists and is up to date, leave it be.
    const existing = document.querySelector(`#${anandvardhakayaArticleId}`);
    if (existing) {
      const grid = existing.querySelector('[role="region"] .columns-1');
      const photos = grid
        ? grid.querySelectorAll('[id^="charitra-anandvardhakaya-"]')
        : [];
      const upToDate =
        grid &&
        photos.length ===
          anandvardhakayaPhotos.length - anandvardhakayaMovedPhotoIds.size &&
        photos[0]?.id === anandvardhakayaPhotos[0].id;
      if (upToDate) {
        addAnandvardhakayaTributeBanner(existing);
        return;
      }
      existing.remove();
    }

    // Clean up any legacy photos that were merged into another category.
    gallery
      .querySelectorAll(
        `article:not(#${anandvardhakayaArticleId}) [id^="charitra-anandvardhakaya-"]`,
      )
      .forEach((el) => el.remove());

    // Build the standalone "ॐ आनन्दवर्धकाय नमः" category (heading + photos).
    const article = createAnandvardhakayaArticle(reference);
    addAnandvardhakayaTributeBanner(article);
    const grid = article.querySelector('[role="region"] .columns-1');
    if (grid) {
      grid.append(
        ...anandvardhakayaPhotos
          .filter((photo) => !anandvardhakayaMovedPhotoIds.has(photo.id))
          .map((photo) => createAnandvardhakayaItem(photo)),
      );
    }

    // Wire its accordion toggle (this article is injected, not React-managed).
    const button = article.querySelector("h3 > button");
    const region = article.querySelector('[role="region"]');
    if (button && region) {
      button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!expanded));
        region.hidden = expanded;
      });
    }

    reference.insertAdjacentElement("afterend", article);
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

  function addVedantTextDepthPhoto() {
    const vedantArticle = findVedantVedyaArticle();
    if (!isGalleryArticleOpen(vedantArticle)) return;

    const photoGrid =
      vedantArticle?.querySelector('[role="region"] .columns-1');
    if (!photoGrid || photoGrid.querySelector(`#${vedantTextDepthItemId}`)) {
      return;
    }

    const item = document.createElement("button");
    item.type = "button";
    item.id = vedantTextDepthItemId;
    item.className = "charitra-inserted-photo vedant-text-depth-photo";
    item.setAttribute(
      "aria-label",
      "View Pujya Swamiji explaining a Vedantic text",
    );
    item.innerHTML = `
      <img
        src="${vedantTextDepthImageUrl}"
        alt="Pujya Swamiji explaining a Vedantic text"
        loading="lazy"
      />
      <p class="vedant-text-depth-caption">${vedantTextDepthCaption}</p>
    `;
    item.addEventListener("click", () =>
      openInsertedImageViewer(
        vedantTextDepthImageUrl,
        "Pujya Swamiji explaining a Vedantic text",
        vedantTextDepthCaption,
      ),
    );
    // Preserve the established rule that the भाष्यकार photograph remains
    // second-last in this category.
    const existingItems = Array.from(
      photoGrid.querySelectorAll(":scope > button, :scope > figure"),
    );
    const secondLast = existingItems[existingItems.length - 2];
    if (secondLast) {
      photoGrid.insertBefore(item, secondLast);
    } else {
      photoGrid.append(item);
    }
  }

  // Hero shloka banner at the very top of ॐ वेदान्तवेद्याय — it replaces the removed
  // "हे शंकर-रूप! हे वेदांत-मूर्ति!" featured photo with a nicely-set अमृतभाषी verse.
  function addVedantAmritbhashiBanner() {
    if (document.querySelector(`#${vedantAmritbhashiBannerId}`)) return;

    const vedantArticle = findVedantVedyaArticle();
    if (!isGalleryArticleOpen(vedantArticle)) return;

    const panel = vedantArticle?.querySelector('[role="region"] > div');
    if (!panel) return;

    const banner = document.createElement("div");
    banner.id = vedantAmritbhashiBannerId;
    banner.className = "vedant-amritbhashi-banner";
    banner.innerHTML = `
      <p class="vedant-amritbhashi-banner__mantra">ॐ अमृतभाषिणे नमः।</p>
      <p class="vedant-amritbhashi-banner__line">जिनकी वाणी से <span class="vedant-amritbhashi-banner__jhar">झर-झर</span> अमृत झरता हो।</p>
    `;

    panel.insertAdjacentElement("afterbegin", banner);
  }

  // Inject the vedant enhancements the instant the section is opened, with a couple
  // of retries. The observer-driven path is debounced (420ms) and, in a real browser
  // where images lazy-load, that debounce can keep resetting so the banner lands late
  // or not at all. This click handler makes opening the section deterministic.
  function wireSadguruPriyaOpenHandler() {
    const sadguruPriyaArticle = findSadguruPriyaArticle();
    const btn = sadguruPriyaArticle?.querySelector("h3 > button");
    if (!btn || btn.dataset.sadguruPriyaWired === "1") return;
    btn.dataset.sadguruPriyaWired = "1";
    btn.addEventListener("click", () => {
      [120, 400, 900].forEach((delay) =>
        window.setTimeout(() => {
          updateSadguruPriyayeCaption();
          groupSadguruPriyayaMahasamadhiPhotos();
          stabilizeSadguruPriyayaClosingOrder();
          watchSadguruPriyayaClosingOrder();
        }, delay),
      );
    });
  }

  function wireVedantOpenHandler() {
    const vedantArticle = findVedantVedyaArticle();
    const btn = vedantArticle?.querySelector("h3 > button");
    if (!btn || btn.dataset.vedantWired === "1") return;
    btn.dataset.vedantWired = "1";
    btn.addEventListener("click", () => {
      [120, 400, 900].forEach((delay) =>
        window.setTimeout(() => {
          addVedantAmritbhashiBanner();
          updateVedantAmritbhashinePhoto();
          addVedantTextDepthPhoto();
          moveAndhraPhotoToVedant();
          enforceCharitraClosingPhotos();
          arrangeVedantRequestedCaptions();
          moveVedantLongestCaptionToEnd();
        }, delay),
      );
    });
  }

  function updateVedantAmritbhashinePhoto() {
    const vedantArticle = findVedantVedyaArticle();
    if (!isGalleryArticleOpen(vedantArticle)) return;

    const photoGrid = vedantArticle?.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    const matchingItems = Array.from(
      photoGrid.querySelectorAll(
        'img[src*="vedant-bhashyakar-priyaya"]',
      ),
    )
      .map((image) => galleryItemForImage(image))
      .filter(
        (item, index, all) =>
          item &&
          item.parentElement === photoGrid &&
          all.indexOf(item) === index,
      );
    let existingItem =
      matchingItems.find((item) => item.id === vedantAmritbhashineItemId) ||
      matchingItems[0] ||
      null;
    matchingItems.forEach((item) => {
      if (item !== existingItem) item.remove();
    });
    if (existingItem) existingItem.id = vedantAmritbhashineItemId;
    if (existingItem) {
      // Ensure this photo carries the भाष्यकार caption (moved off the old banner).
      let existingCaption = existingItem.querySelector("p");
      if (!existingCaption) {
        existingCaption = document.createElement("p");
        existingItem.appendChild(existingCaption);
      }
      if (existingCaption.innerHTML !== vedantShastraSammatCaptionHtml) {
        existingCaption.innerHTML = vedantShastraSammatCaptionHtml;
      }
      existingCaption.className = "vedant-shastra-sammat-caption";
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
      <p class="vedant-shastra-sammat-caption">${vedantShastraSammatCaptionHtml}</p>
    `;
    item.addEventListener("click", () =>
      openInsertedImageViewer(
        vedantAmritbhashineImageUrl,
        "Om Amritbhashine Namah",
        vedantShastraSammatCaption,
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

  function arrangeVedantRequestedCaptions() {
    const article = findVedantVedyaArticle();
    if (!isGalleryArticleOpen(article)) return;

    const grid = article?.querySelector('[role="region"] .columns-1');
    if (!grid) return;

    const itneApneItem = Array.from(
      grid.querySelectorAll(":scope > button, :scope > figure"),
    ).find((item) =>
      (item.querySelector("img")?.getAttribute("src") || "").includes(
        "hommage-itney-apne-DefAF0H8",
      ),
    );
    if (itneApneItem) {
      let remembranceItem = grid.querySelector(`#${vedantRemembrancePhotoId}`);
      if (!remembranceItem) {
        remembranceItem = document.createElement("button");
        remembranceItem.type = "button";
        remembranceItem.id = vedantRemembrancePhotoId;
        remembranceItem.className = "charitra-inserted-photo";
        remembranceItem.setAttribute(
          "aria-label",
          "View remembrance of Pujya Swamiji",
        );
        remembranceItem.innerHTML = `
          <img
            src="${vedantRemembrancePhotoUrl}"
            alt="Pujya Swamiji delivering a discourse"
            loading="lazy"
          />
          <p class="vedant-bhashyakar-remembrance-caption">“${vedantBhashyakarRemembrance}”</p>
        `;
        remembranceItem.addEventListener("click", () =>
          openInsertedImageViewer(
            vedantRemembrancePhotoUrl,
            "Pujya Swamiji delivering a discourse",
            `“${vedantBhashyakarRemembrance}”`,
          ),
        );
      }
      if (remembranceItem.nextElementSibling !== itneApneItem) {
        grid.insertBefore(remembranceItem, itneApneItem);
      }

      let itneApneCaption = itneApneItem.querySelector("p");
      if (!itneApneCaption) {
        itneApneCaption = document.createElement("p");
        itneApneItem.append(itneApneCaption);
      }
      itneApneCaption.className = "vedant-itne-apne-caption";
      if (itneApneCaption.textContent !== "इतने बड़े - इतने अपने") {
        itneApneCaption.textContent = "इतने बड़े - इतने अपने";
      }
    }

    const photoItems = Array.from(
      grid.querySelectorAll(":scope > button, :scope > figure"),
    );
    const itemsBySource = new Map();
    photoItems.forEach((item) => {
      const source = (
        item.querySelector("img")?.getAttribute("src") || ""
      )
        .split("?")[0]
        .trim();
      if (!source) return;
      const matching = itemsBySource.get(source) || [];
      matching.push(item);
      itemsBySource.set(source, matching);
    });
    itemsBySource.forEach((matching) => {
      if (matching.length < 2) return;
      const keeper =
        matching.find((item) =>
          item.querySelector(".vedant-bhashyakar-style-caption"),
        ) ||
        matching.find(
          (item) => item.id === "vedant-bhashyakar-style-second-last",
        ) ||
        matching[matching.length - 1];
      matching.forEach((item) => {
        if (item !== keeper) item.remove();
      });
    });

    const items = Array.from(
      grid.querySelectorAll(":scope > button, :scope > figure"),
    );
    if (items.length < 3) return;

    let secondPhoto = grid.querySelector("#vedant-spiritual-knowledge-photo");
    if (!secondPhoto) {
      secondPhoto = items.find((item) => {
        const text = (item.textContent || "").toLowerCase();
        return (
          (text.includes("\u0936\u093F\u0935") &&
            text.includes("\u092A\u094D\u0930\u093F\u092F")) ||
          (text.includes("shiv") && text.includes("priya"))
        );
      });
      if (!secondPhoto) {
        secondPhoto = items.find(
          (item, index) => index > 0 && item.id !== ANDHRA_MOVED_ID,
        );
      }
      if (!secondPhoto) return;
      secondPhoto.id = "vedant-spiritual-knowledge-photo";
    }
    let secondCaption = secondPhoto.querySelector("p");
    if (!secondCaption) {
      secondCaption = document.createElement("p");
      secondPhoto.append(secondCaption);
    }
    secondCaption.className = "vedant-spiritual-knowledge-caption";
    secondCaption.textContent = vedantSpiritualKnowledgeCaption;

    const shastraItem = grid.querySelector(`#${vedantAmritbhashineItemId}`);
    if (!shastraItem) return;
    let shastraCaption = shastraItem.querySelector("p");
    if (!shastraCaption) {
      shastraCaption = document.createElement("p");
      shastraItem.append(shastraCaption);
    }
    shastraCaption.className = "vedant-shastra-sammat-caption";
    if (shastraCaption.innerHTML !== vedantShastraSammatCaptionHtml) {
      shastraCaption.innerHTML = vedantShastraSammatCaptionHtml;
    }

    const currentItems = Array.from(
      grid.querySelectorAll(":scope > button, :scope > figure"),
    );
    const remembrancePhoto = grid.querySelector(`#${vedantRemembrancePhotoId}`);
    const isNewVedantPhoto = (item) => {
      const source = item?.querySelector("img")?.getAttribute("src") || "";
      return vedantNewPhotos20260807.some(
        (photo) => item?.id === photo.id || source.includes(photo.src),
      );
    };
    const previouslyMarked = grid.querySelector(
      "#vedant-bhashyakar-style-second-last",
    );
    let precedingItem = remembrancePhoto?.previousElementSibling || null;
    while (precedingItem && isNewVedantPhoto(precedingItem)) {
      precedingItem = precedingItem.previousElementSibling;
    }
    const bhashyakarItem =
      (previouslyMarked && !isNewVedantPhoto(previouslyMarked)
        ? previouslyMarked
        : null) ||
      precedingItem ||
      [...currentItems].reverse().find((item) => !isNewVedantPhoto(item));
    if (!bhashyakarItem || bhashyakarItem === shastraItem) return;
    if (previouslyMarked && previouslyMarked !== bhashyakarItem) {
      previouslyMarked.removeAttribute("id");
    }
    bhashyakarItem.id = "vedant-bhashyakar-style-second-last";

    grid
      .querySelectorAll(".vedant-bhashyakar-style-caption")
      .forEach((caption) => {
        if (caption.closest("button, figure") !== bhashyakarItem) {
          caption.remove();
        }
      });

    let bhashyakarCaption = bhashyakarItem.querySelector("p");
    if (!bhashyakarCaption) {
      bhashyakarCaption = document.createElement("p");
      bhashyakarItem.append(bhashyakarCaption);
    }
    bhashyakarCaption.className = "vedant-bhashyakar-style-caption";
    const combinedCaption =
      `“${vedantBhashyakarCaption}”` +
      `<span class="vedant-bhashyakar-divider" aria-hidden="true">✦</span>` +
      `<strong class="vedant-bhashyakar-mantra">${vedantBhashyakarMantra}</strong>`;
    if (bhashyakarCaption.innerHTML !== combinedCaption) {
      bhashyakarCaption.innerHTML = combinedCaption;
    }

    const remembranceItem = grid.querySelector(`#${vedantRemembrancePhotoId}`);
    if (remembranceItem && remembranceItem !== bhashyakarItem) {
      let remembranceCaption = remembranceItem.querySelector("p");
      if (!remembranceCaption) {
        remembranceCaption = document.createElement("p");
        remembranceItem.append(remembranceCaption);
      }
      remembranceCaption.className = "vedant-bhashyakar-remembrance-caption";
      const remembranceText = `“${vedantBhashyakarRemembrance}”`;
      if (remembranceCaption.textContent !== remembranceText) {
        remembranceCaption.textContent = remembranceText;
      }
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

    devoteeLine.textContent = "As a devotee wrote--";
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
      '#photo-gallery2 [role="region"] button p, #photo-gallery2 [role="region"] figcaption p',
    );
    const mantraPattern =
      /^\s*((?:ॐ|ओम|Om)\s+[\s\S]*?(?:नमः|नम:|namah)\s*[।.!॥]*)([\s\S]*)$/i;

    captions.forEach((caption) => {
      const existingLead = caption.querySelector(".om-caption-lead");
      if (existingLead) {
        const normalizedLead =
          existingLead.textContent
            .trim()
            .replace(/[।.!॥]+$/u, "")
            .trimEnd() + "॥";
        if (existingLead.textContent !== normalizedLead) {
          existingLead.textContent = normalizedLead;
        }
        return;
      }

      const match = caption.textContent.match(mantraPattern);
      if (!match) return;

      const lead = document.createElement("strong");
      lead.className = "om-caption-lead";
      lead.textContent =
        match[1].trim().replace(/[।.!॥]+$/u, "").trimEnd() + "॥";

      caption.replaceChildren(lead);

      if (match[2].trim()) {
        const remainder = document.createElement("span");
        remainder.className = "om-caption-remainder";
        remainder.textContent = match[2].trim();
        caption.append(remainder);
      }
    });
  }

  function removeDandaFromCharitraCategoryTitles() {
    document
      .querySelectorAll("#photo-gallery2 article h3 button")
      .forEach((button) => {
        const walker = document.createTreeWalker(
          button,
          NodeFilter.SHOW_TEXT,
        );
        let node = walker.nextNode();
        while (node) {
          if (
            /(?:ॐ|ओम|Om)/i.test(node.textContent || "") &&
            /(?:नमः|नम:|namah)\s*[।॥|]+\s*$/iu.test(
              node.textContent || "",
            )
          ) {
            node.textContent = node.textContent.replace(
              /((?:नमः|नम:|namah))\s*[।॥|]+\s*$/iu,
              "$1",
            );
          }
          node = walker.nextNode();
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

  function groupSadguruPriyayaMahasamadhiPhotos() {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return;

    const images = [1, 4, 2, 3]
      .map((number) =>
        Array.from(
          gallery.querySelectorAll(
            `img[alt="Gurudev Mahasamadhi photo ${number}"]`,
          ),
        ).find(
          (image) => !image.closest(".sadguru-priyaya-mahasamadhi"),
        ),
      )
      .filter(Boolean);

    if (images.length !== 4) return;

    const items = images.map(galleryItemForImage).filter(Boolean);
    if (items.length !== 4) return;

    let memorial = gallery.querySelector(".sadguru-priyaya-mahasamadhi");
    const originalParent = memorial?.parentElement || items[0].parentElement;
    if (!originalParent) return;

    if (!memorial) {
      if (!items.every((item) => item.parentElement === originalParent)) return;

      memorial = document.createElement("section");
      memorial.className = "sadguru-priyaya-mahasamadhi";
      memorial.setAttribute(
        "aria-label",
        "परम पूज्य गुरुदेव की महासमाधि की पावन स्मृतियाँ",
      );
      memorial.innerHTML = `
        <div class="sadguru-priyaya-mahasamadhi__heading">
          <span aria-hidden="true">ॐ</span>
          <div>
            <p>परम पूज्य गुरुदेव की महासमाधि</p>
          </div>
          <span aria-hidden="true">॥</span>
        </div>
        <div class="sadguru-priyaya-mahasamadhi__photos"></div>
        <p class="sadguru-priyaya-mahasamadhi__pranam">
          ॐ श्री चिन्मय सद्गुरवे नमः ॥
        </p>
      `;
      originalParent.append(memorial);
    }

    const photoGrid = memorial.querySelector(
      ".sadguru-priyaya-mahasamadhi__photos",
    );
    if (!photoGrid) return;

    const placeReflectionBeforeMemorial = () => {
      const reflection = gallery.querySelector(
        `#${sadguruPriyayeReflectionId}`,
      );
      if (
        reflection &&
        reflection.parentElement === originalParent &&
        memorial.previousElementSibling !== reflection
      ) {
        originalParent.insertBefore(reflection, memorial);
      }
    };

    if (
      memorial.dataset.mahasamadhiGroupReady === "true" &&
      photoGrid.children.length === 4
    ) {
      if (
        memorial.parentElement === originalParent &&
        originalParent.lastElementChild !== memorial
      ) {
        originalParent.append(memorial);
      }
      placeReflectionBeforeMemorial();
      return;
    }

    photoGrid.replaceChildren();
    items.forEach((item, index) => {
      // Keep React's source card in its original position and use a visual
      // clone in the memorial group. Forward activation to the source so its
      // existing full-screen viewer and caption behavior remain intact.
      const clone = item.cloneNode(true);
      clone.classList.add("sadguru-priyaya-mahasamadhi__photo");
      clone.style.setProperty("--mahasamadhi-photo-order", index + 1);
      clone.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        item.click();
      });
      photoGrid.append(clone);

      // Hide the original in the gallery grid
      item.style.display = "none";
    });
    memorial.dataset.mahasamadhiGroupReady = "true";

    if (
      memorial.parentElement === originalParent &&
      originalParent.lastElementChild !== memorial
    ) {
      originalParent.append(memorial);
    }

    placeReflectionBeforeMemorial();
  }

  function stabilizeSadguruPriyayaClosingOrder() {
    const article = findSadguruPriyaArticle();
    const memorial = article?.querySelector(".sadguru-priyaya-mahasamadhi");
    const reflection = article?.querySelector(`#${sadguruPriyayeReflectionId}`);
    const panel = article?.querySelector('[role="region"] > div');
    if (!reflection || !memorial || !panel) return;

    let closingSequence = article.querySelector(
      ".sadguru-priyaya-closing-sequence",
    );
    if (!closingSequence) {
      closingSequence = document.createElement("section");
      closingSequence.className = "sadguru-priyaya-closing-sequence";
      closingSequence.setAttribute(
        "aria-label",
        "Closing photographs, remembrance and Mahasamadhi",
      );
    }

    const closingPhotos = [
      wheelchairItemId,
      sadguruPriyayeImg1Id,
    ]
      .map((id) => article.querySelector(`#${id}`))
      .filter(Boolean);

    // One explicit container prevents the multi-column gallery from visually
    // placing late-added cards after the Mahasamadhi memorial.
    const samadhiCareGroup = article.querySelector(
      "#sadguru-samadhi-care-photo-group",
    );
    const desiredChildren = [
      ...closingPhotos,
      ...(samadhiCareGroup ? [samadhiCareGroup] : []),
      reflection,
      memorial,
    ];
    const currentChildren = Array.from(closingSequence.children);
    if (
      desiredChildren.length !== currentChildren.length ||
      desiredChildren.some((child, index) => currentChildren[index] !== child)
    ) {
      closingSequence.append(...desiredChildren);
    }
    if (panel.lastElementChild !== closingSequence) {
      panel.append(closingSequence);
    }
  }

  const sadguruAroundGurudevCaption =
    '"He would be always around Gurudev, on his toes, alert, sharp, vigilant and forever thinking ahead, knowing what to do before he is told."';
  const sadguruStrictInstructionsCaption =
    '"Swamiji had given strict instructions for every detail of Gurudev\'s Samadhi Sthal puja care, always serving with total alertness and devotion."';
  const sadguruWithGurudevPhotoId =
    "charitra-sadgurupriyaya-with-gurudev-20260807";
  const sadguruWithGurudevPhotoUrl =
    "/assets2/charitra-sadgurupriyaya-with-gurudev-20260807.jpg";

  function arrangeSadguruAgyaPhotoGroup() {
    const article = findSadguruPriyaArticle();
    const grid = article?.querySelector('[role="region"] .columns-1');
    if (!grid) return;

    const captions = Array.from(grid.querySelectorAll("p"));
    const aroundCaption = captions.find((caption) =>
      (caption.textContent || "").includes(
        "He would be always around Gurudev",
      ),
    );
    const strictCaption = captions.find((caption) =>
      (caption.textContent || "").includes(
        "Swamiji had given strict instructions",
      ),
    );
    const inspiringCaption = captions.find((caption) =>
      (caption.textContent || "").includes("One inspiring quality"),
    );
    const aroundItem = galleryItemForImage(
      aroundCaption?.closest("button, figure")?.querySelector("img"),
    );
    const strictItem = galleryItemForImage(
      strictCaption?.closest("button, figure")?.querySelector("img"),
    );
    const agya1 = article.querySelector("#charitra-extra-gurudevagya-1");
    const agya2 = article.querySelector("#charitra-extra-gurudevagya-2");
    if (!aroundItem || !strictItem || !agya1 || !agya2) return;
    const withGurudevPhoto =
      article.querySelector(`#${sadguruWithGurudevPhotoId}`) ||
      createRequestedPhotoItem(
        sadguruWithGurudevPhotoId,
        sadguruWithGurudevPhotoUrl,
        "Pujya Swamiji with Pujya Gurudev",
      );

    let group = article.querySelector(".sadguru-agya-photo-group");
    if (!group) {
      group = document.createElement("section");
      group.className = "sadguru-agya-photo-group";
      group.setAttribute(
        "aria-label",
        "Pujya Swamiji always attentive around Pujya Gurudev",
      );
      aroundItem.insertAdjacentElement("beforebegin", group);
    }

    aroundCaption?.remove();
    strictCaption?.remove();
    group.append(aroundItem, strictItem, agya1, agya2, withGurudevPhoto);

    let groupCaption = group.querySelector(".sadguru-agya-photo-group__caption");
    if (!groupCaption) {
      groupCaption = document.createElement("p");
      groupCaption.className =
        "sadguru-agya-photo-group__caption charitra-special-quote-caption";
      group.append(groupCaption);
    }
    groupCaption.textContent = sadguruAroundGurudevCaption;
    // Keep the shared remembrance immediately after all five photographs,
    // including when this arranger runs again after a gallery re-render.
    group.append(groupCaption);

    if (inspiringCaption) {
      inspiringCaption.classList.add("charitra-special-quote-caption");
      inspiringCaption.textContent = sadguruStrictInstructionsCaption;
    }
  }

  const sadguruSamadhiCareRemembrance =
    'Swamiji had given strict instructions that the puja asana, the bell and the basket for puja must never be left on the Samadhi Sthal platform. They should be removed immediately after the puja and kept at the appropriate hidden place made for this purpose. Swamiji would also ensure that the flame of the lamp was just right—not too intense and not too dim. During summers, Swamiji would himself set the direction of the fan that he had got placed at the Samadhi Sthal, so that it sent the breeze in the right direction to reach Param Pujya Gurudev. This was required to be done every day, since the workers cleaning the floor would unknowingly change the direction of the fan. Swamiji would look at Gurudev’s vigrah with such concentration, as if taking orders or approvals from Him. Swamiji would guide us that while doing “parikrama,” even from outside the Samadhi hall, Gurudev must always remain on our right-hand side. Swamiji would do parikrama of Gurudev both from inside the Samadhi Sthal and from outside. It is deeply inspiring that Pujya Swamiji also visited Gurudev at the Samadhi Sthal on 26th September 2020 at around 10 p.m.—four hours before his last breath at Siddhbari.';

  function addSadguruSamadhiCareRemembrance() {
    const article = findSadguruPriyaArticle();
    const grid = article?.querySelector('[role="region"] .columns-1');
    if (!grid) return;

    const lastAvailableCaption = Array.from(grid.querySelectorAll("p")).find(
      (caption) =>
        (caption.textContent || "").includes(
          "Last available picture dated 3rd Aug 2020",
        ),
    );
    const targetItem = galleryItemForImage(
      lastAvailableCaption?.closest("button, figure")?.querySelector("img"),
    );
    if (!targetItem) return;

    let remembrance = article.querySelector(
      "#sadguru-samadhi-care-remembrance",
    );
    if (!remembrance) {
      remembrance = document.createElement("blockquote");
      remembrance.id = "sadguru-samadhi-care-remembrance";
      remembrance.className = "sadguru-samadhi-care-remembrance";
      remembrance.setAttribute(
        "aria-label",
        "Pujya Swamiji’s attentive care at Pujya Gurudev’s Samadhi Sthal",
      );
    }
    remembrance.textContent = sadguruSamadhiCareRemembrance;

    let group = article.querySelector("#sadguru-samadhi-care-photo-group");
    if (!group) {
      group = document.createElement("section");
      group.id = "sadguru-samadhi-care-photo-group";
      group.className = "sadguru-samadhi-care-photo-group";
      group.setAttribute(
        "aria-label",
        "Remembrance and last available photograph from 3rd August 2020",
      );
      targetItem.insertAdjacentElement("beforebegin", group);
    }
    if (
      group.firstElementChild !== remembrance ||
      group.lastElementChild !== targetItem
    ) {
      group.append(remembrance, targetItem);
    }
  }

  let observedSadguruClosingArticle = null;
  let sadguruClosingObserver = null;

  function watchSadguruPriyayaClosingOrder() {
    const article = findSadguruPriyaArticle();
    if (!article || article === observedSadguruClosingArticle) return;

    sadguruClosingObserver?.disconnect();
    observedSadguruClosingArticle = article;
    sadguruClosingObserver = new MutationObserver(() => {
      window.setTimeout(stabilizeSadguruPriyayaClosingOrder, 0);
    });
    sadguruClosingObserver.observe(article, { childList: true, subtree: true });
  }

  function polishNamamiChittchorkamSection() {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return;

    const smitaArticle = findGalleryArticleByHeading(["स्मित ईक्षणाय"]);
    const smitaGrid = smitaArticle?.querySelector('[role="region"] .columns-1');
    const turbanImage = smitaGrid?.querySelector(
      'img[src*="namami-new-5-HqCDqbxZ"]',
    );
    const turbanItem = galleryItemForImage(turbanImage);
    const mriduCaption = Array.from(
      smitaGrid?.querySelectorAll("button p, figure p") || [],
    ).find((caption) =>
      (caption.textContent || "").includes("मृदु स्वभावाय"),
    );
    const mriduItem = galleryItemForImage(mriduCaption?.closest("button, figure")?.querySelector("img"));

    if (turbanItem) {
      let caption = turbanItem.querySelector("p");
      if (!caption) {
        caption = document.createElement("p");
        turbanItem.append(caption);
      }
      caption.textContent = "स्मितावलोकसुन्दरम्";
      caption.classList.add("smita-avalok-caption");
      addCaptionOrnament(caption, "smile");

      if (
        mriduItem?.parentElement &&
        turbanItem.parentElement === mriduItem.parentElement &&
        mriduItem.nextElementSibling !== turbanItem
      ) {
        mriduItem.insertAdjacentElement("afterend", turbanItem);
      }

      const prasannaCaption = Array.from(
        smitaGrid?.querySelectorAll("button p, figure p") || [],
      ).find((itemCaption) =>
        (itemCaption.textContent || "").includes("प्रसन्न चित्ताय"),
      );
      const prasannaItem = prasannaCaption?.closest("button, figure");
      if (
        prasannaItem &&
        prasannaItem.parentElement === turbanItem.parentElement &&
        turbanItem.nextElementSibling !== prasannaItem
      ) {
        turbanItem.insertAdjacentElement("afterend", prasannaItem);
      }
    }

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

  function enforceCharitraClosingPhotos() {
    const vedantArticle = findVedantVedyaArticle();
    const vedantGrid =
      vedantArticle?.querySelector('[role="region"] .columns-1');
    if (vedantGrid) {
      const itneApneItem = Array.from(
        vedantGrid.querySelectorAll(":scope > button, :scope > figure"),
      ).find((item) => {
        const text = (item.textContent || "").replace(/\s+/g, " ").trim();
        const src = item.querySelector("img")?.getAttribute("src") || "";
        return (
          src.includes("hommage-itney-apne-DefAF0H8") ||
          (text.includes("इतने बड़े") && text.includes("इतने अपने"))
        );
      });
      if (
        itneApneItem &&
        vedantGrid.lastElementChild !== itneApneItem
      ) {
        vedantGrid.append(itneApneItem);
      }
    }

    const smitaArticle = findGalleryArticleByHeading(["स्मित ईक्षणाय"]);
    const smitaGrid =
      smitaArticle?.querySelector('[role="region"] .columns-1');
    const smitaClosingImage = smitaGrid?.querySelector(
      'img[src*="smilemain-CPWM9cCH"]',
    );
    const smitaClosingItem = galleryItemForImage(smitaClosingImage);
    if (
      smitaGrid &&
      smitaClosingItem &&
      smitaClosingItem.parentElement === smitaGrid &&
      smitaGrid.lastElementChild !== smitaClosingItem
    ) {
      smitaGrid.append(smitaClosingItem);
    }
  }

  function enforceAdwitayaPhotoOrder() {
    const article = findAdwitayaArticle();
    const grid = article?.querySelector('[role="region"] .columns-1');
    if (!grid) return;

    const items = Array.from(
      grid.querySelectorAll(":scope > button, :scope > figure"),
    );
    const dhenuItem = items.find((item) =>
      (item.textContent || "").includes("\u0927\u0947\u0928\u0941 \u092A\u094D\u0930\u093F\u092F\u093E\u092F"),
    );
    const kreedaItem = items.find((item) =>
      (item.textContent || "")
        .replace(/\u093C/g, "")
        .includes("\u0915\u094D\u0930\u0940\u0921\u093E \u092A\u094D\u0930\u093F\u092F\u093E\u092F"),
    );
    const formerLastItem = grid.querySelector(
      "#charitra-extra-adwitaya-bholebaba-20260727",
    );

    if (dhenuItem && grid.firstElementChild !== dhenuItem) {
      grid.prepend(dhenuItem);
    }
    if (
      dhenuItem &&
      formerLastItem &&
      dhenuItem.nextElementSibling !== formerLastItem
    ) {
      dhenuItem.insertAdjacentElement("afterend", formerLastItem);
    }
    if (kreedaItem && grid.lastElementChild !== kreedaItem) {
      grid.append(kreedaItem);
    }
  }

  function swapAnandvardhakayaAndAdwitayaClosingPhotos() {
    const adwitayaArticle = findAdwitayaArticle();
    const adwitayaGrid =
      adwitayaArticle?.querySelector('[role="region"] .columns-1');
    const anandArticle = document.querySelector(
      `#${anandvardhakayaArticleId}`,
    );
    const anandGrid =
      anandArticle?.querySelector('[role="region"] .columns-1');
    if (!adwitayaGrid || !anandGrid) return;

    const kreedaItem =
      anandGrid.querySelector(".anandvardhakaya-kreeda-closing") ||
      Array.from(
        adwitayaGrid.querySelectorAll(":scope > button, :scope > figure"),
      ).find((item) =>
        (item.textContent || "")
          .replace(/\u093C/g, "")
          .includes("\u0915\u094D\u0930\u0940\u0921\u093E \u092A\u094D\u0930\u093F\u092F\u093E\u092F"),
      );
    if (kreedaItem) {
      kreedaItem.classList.add("anandvardhakaya-kreeda-closing");
      if (anandGrid.lastElementChild !== kreedaItem) {
        anandGrid.append(kreedaItem);
      }
    }

    const kalashPhoto = anandvardhakayaPhotos.find(
      (photo) => photo.id === "charitra-anandvardhakaya-kalash",
    );
    let kalashItem =
      adwitayaGrid.querySelector("#charitra-anandvardhakaya-kalash") ||
      anandGrid.querySelector("#charitra-anandvardhakaya-kalash");
    if (!kalashItem && kalashPhoto) {
      kalashItem = createAnandvardhakayaItem(kalashPhoto);
    }
    if (kalashItem) {
      kalashItem.classList.add("adwitaya-chitrakoot-closing");
      const caption = kalashItem.querySelector("p");
      if (caption) caption.className = "adwitaya-chitrakoot-caption";
      if (adwitayaGrid.lastElementChild !== kalashItem) {
        adwitayaGrid.append(kalashItem);
      }
    }
  }

  function moveShivrajPhotosAfterKayakalp() {
    const article = findAdwitayaArticle();
    const grid = article?.querySelector('[role="region"] .columns-1');
    if (!grid) return;

    const shivrajOne = grid.querySelector("#charitra-extra-shivraj-1");
    const shivrajTwo = grid.querySelector("#charitra-extra-shivraj-2");
    const kayakalpItems = Array.from(
      grid.querySelectorAll(":scope > button, :scope > figure"),
    ).filter((item) => {
      const text = (item.textContent || "").toLowerCase();
      const imageSrc = item.querySelector("img")?.getAttribute("src") || "";
      return (
        text.includes("kayakalp") ||
        text.includes("kaya \u0915\u0932\u094D\u092A") ||
        imageSrc.toLowerCase().includes("kayakalp")
      );
    });
    const lastKayakalpItem = kayakalpItems[kayakalpItems.length - 1];

    if (!lastKayakalpItem || !shivrajOne || !shivrajTwo) return;

    lastKayakalpItem.insertAdjacentElement("afterend", shivrajOne);
    shivrajOne.insertAdjacentElement("afterend", shivrajTwo);
  }

  function moveAnandvardhakayaPhotosToAdwitaya() {
    const article = findAdwitayaArticle();
    const grid = article?.querySelector('[role="region"] .columns-1');
    if (!grid) return;

    const items = Array.from(
      grid.querySelectorAll(":scope > button, :scope > figure"),
    );
    const shantaKumarAnchor = items.find((item) => {
      const text = (item.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
      return (
        (text.includes("shanta") && text.includes("kumar")) ||
        ((text.includes("\u0936\u093E\u0902\u0924\u093E") ||
          text.includes("\u0936\u093E\u0928\u094D\u0924\u093E")) &&
          text.includes("\u0915\u0941\u092E\u093E\u0930"))
      );
    });
    const shivrajAnchors = items.filter((item) => {
      const text = (item.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
      return (
        (text.includes("shivraj") && text.includes("chauhan")) ||
        (text.includes("\u0936\u093F\u0935\u0930\u093E\u091C") &&
          text.includes("\u091A\u094C\u0939\u093E\u0928"))
      );
    });
    const shivrajAnchor = shivrajAnchors[shivrajAnchors.length - 1];

    const bouquetPhoto = anandvardhakayaPhotos.find(
      (photo) => photo.id === "charitra-anandvardhakaya-3",
    );
    const bookPhoto = anandvardhakayaPhotos.find(
      (photo) => photo.id === "charitra-anandvardhakaya-5",
    );
    let bouquetItem = document.querySelector(
      "#charitra-anandvardhakaya-3",
    );
    let bookItem = document.querySelector("#charitra-anandvardhakaya-5");
    if (!bouquetItem && bouquetPhoto) {
      bouquetItem = createAnandvardhakayaItem(bouquetPhoto);
    }
    if (!bookItem && bookPhoto) {
      bookItem = createAnandvardhakayaItem(bookPhoto);
    }

    if (shantaKumarAnchor && bouquetItem) {
      shantaKumarAnchor.insertAdjacentElement("afterend", bouquetItem);
    }
    if (shivrajAnchor && bookItem) {
      shivrajAnchor.insertAdjacentElement("afterend", bookItem);
    }
  }

  function removeTwoPhotosAfterSidhbariCottage() {
    const article = findAdwitayaArticle();
    const grid = article?.querySelector('[role="region"] .columns-1');
    const cottageImage = grid?.querySelector(
      'img[alt*="Siddhbari cottage"][alt*="2020"]',
    );
    const cottageItem = galleryItemForImage(cottageImage);
    if (
      !cottageItem ||
      cottageItem.parentElement !== grid ||
      cottageItem.dataset.followingPhotosRemoved === "true"
    ) {
      return;
    }

    const followingItems = [];
    let nextItem = cottageItem.nextElementSibling;
    while (nextItem && followingItems.length < 2) {
      if (nextItem.matches("button, figure")) {
        followingItems.push(nextItem);
      }
      nextItem = nextItem.nextElementSibling;
    }

    if (followingItems.length === 2) {
      followingItems.forEach((item) => item.remove());
      cottageItem.dataset.followingPhotosRemoved = "true";
    }
  }

  function moveLoveReflectionAfterSidhbariCottage() {
    const article = findAdwitayaArticle();
    const grid = article?.querySelector('[role="region"] .columns-1');
    if (!grid) return;

    const cottageImage = grid.querySelector(
      'img[alt*="Siddhbari cottage"][alt*="2020"]',
    );
    const cottageItem = galleryItemForImage(cottageImage);
    if (!cottageItem || cottageItem.parentElement !== grid) return;

    let destinationItem = cottageItem.nextElementSibling;
    while (destinationItem && !destinationItem.matches("button, figure")) {
      destinationItem = destinationItem.nextElementSibling;
    }
    if (!destinationItem) return;

    const reflectionText =
      "Swamiji's love was not at the cost of others; devotees from every ashram felt loved equally.";
    const existingReflection = Array.from(
      grid.querySelectorAll(":scope > button p, :scope > figure p"),
    ).find((caption) =>
      (caption.textContent || "")
        .toLowerCase()
        .includes("swamiji's love was not at the cost of others"),
    );
    const sourceItem = existingReflection?.closest("button, figure");

    let destinationCaption = destinationItem.querySelector("p");
    if (!destinationCaption) {
      destinationCaption = document.createElement("p");
      destinationItem.append(destinationCaption);
    }
    destinationCaption.classList.add("adwitaya-love-reflection");
    destinationCaption.textContent = `\u201C${reflectionText}\u201D`;

    if (sourceItem && sourceItem !== destinationItem) {
      sourceItem.remove();
    }
  }

  function moveTeerthPhotoSequenceBeforeSidhbariCottage() {
    const article = findAdwitayaArticle();
    const grid = article?.querySelector('[role="region"] .columns-1');
    const teerthImage = grid?.querySelector(
      'img[src*="photo-13-IHwCbS_q"]',
    );
    const teerthItem = galleryItemForImage(teerthImage);
    const cottageImage = grid?.querySelector(
      'img[alt*="Siddhbari cottage"][alt*="2020"]',
    );
    const cottageItem = galleryItemForImage(cottageImage);
    if (
      !teerthItem ||
      !cottageItem ||
      teerthItem.parentElement !== grid ||
      cottageItem.parentElement !== grid
    ) {
      return;
    }

    const sequence = [];
    let previousItem = teerthItem.previousElementSibling;
    while (previousItem && !previousItem.matches("button, figure")) {
      previousItem = previousItem.previousElementSibling;
    }
    if (previousItem) sequence.push(previousItem);
    sequence.push(teerthItem);

    let nextItem = teerthItem.nextElementSibling;
    let followingCount = 0;
    while (nextItem && followingCount < 4) {
      if (nextItem.matches("button, figure")) {
        sequence.push(nextItem);
        followingCount += 1;
      }
      nextItem = nextItem.nextElementSibling;
    }

    if (previousItem && followingCount === 4 && !sequence.includes(cottageItem)) {
      sequence.forEach((item) => grid.insertBefore(item, cottageItem));
    }
  }

  function removeThreePhotosAfterTeerthSwaroopaya() {
    const article = findAdwitayaArticle();
    const grid = article?.querySelector('[role="region"] .columns-1');
    const teerthImage = grid?.querySelector(
      'img[src*="photo-13-IHwCbS_q"]',
    );
    const teerthItem = galleryItemForImage(teerthImage);
    if (
      !teerthItem ||
      teerthItem.parentElement !== grid ||
      teerthItem.dataset.followingThreePhotosRemoved === "true"
    ) {
      return;
    }

    const followingItems = [];
    let nextItem = teerthItem.nextElementSibling;
    while (nextItem && followingItems.length < 3) {
      if (nextItem.matches("button, figure")) {
        followingItems.push(nextItem);
      }
      nextItem = nextItem.nextElementSibling;
    }

    if (followingItems.length === 3) {
      followingItems.forEach((item) => item.remove());
      teerthItem.dataset.followingThreePhotosRemoved = "true";
    }
  }

  function removeRoseGarlandPhotoAndFollowingThree() {
    const article = findAdwitayaArticle();
    const grid = article?.querySelector('[role="region"] .columns-1');
    if (!grid || grid.dataset.roseGarlandBlockRemoved === "true") return;

    const garlandImage = Array.from(grid.querySelectorAll("img")).find(
      (image) =>
        (image.getAttribute("alt") || "").trim().toLowerCase() ===
        "pujya swamiji with garland",
    );
    const garlandItem = galleryItemForImage(garlandImage);
    if (!garlandItem || garlandItem.parentElement !== grid) return;

    const itemsToRemove = [garlandItem];
    let nextItem = garlandItem.nextElementSibling;
    while (nextItem && itemsToRemove.length < 4) {
      if (nextItem.matches("button, figure")) {
        itemsToRemove.push(nextItem);
      }
      nextItem = nextItem.nextElementSibling;
    }

    if (itemsToRemove.length === 4) {
      itemsToRemove.forEach((item) => item.remove());
      grid.dataset.roseGarlandBlockRemoved = "true";
    }
  }

  function addCleanlinessStoryToBedPhoto() {
    const article = findAdwitayaArticle();
    const grid = article?.querySelector('[role="region"] .columns-1');
    if (!grid) return;

    const items = Array.from(
      grid.querySelectorAll(":scope > button, :scope > figure"),
    );
    const bedPhotoItem = items[items.length - 5];
    if (!bedPhotoItem) return;

    let caption = bedPhotoItem.querySelector("p");
    if (!caption) {
      caption = document.createElement("p");
      bedPhotoItem.append(caption);
    }

    caption.className = "adwitaya-cleanliness-story";
    caption.textContent =
      "\u201CIn 1999, Pujya Swamiji had gone for a Gyan Yagna on Bhaja Govindam to a very small town in Uttar Pradesh. The room where Swamiji was to stay was on the outskirts of the town, with fields on all sides, and the wind was very strong and dusty.\n\nThe first darshan I had of Pujya Swamiji in that town was with a broom in hand, cleaning the room himself, as Swamiji was so particular about cleanliness. Anyone who visited Pujya Swamiji\u2019s cottage in Sidhbari would vouch for it. His cottage was an epitome of cleanliness\u2014each and every book, paper, pen, and even the pins were always in their proper place. One could never find dust anywhere in the room, bathroom, or kitchen.\n\nOnce, we were sitting in his room along with other sadhaks. Someone had left an empty mineral-water bottle there. He gently told me to pick it up and put it in the dustbin.\u201D";
  }

  function renderBilingualQuoteCaption(caption, title, hindi, english) {
    if (!caption) return;

    const titleLine = document.createElement("strong");
    titleLine.className = "charitra-caption-title";
    titleLine.textContent = title;

    const hindiQuote = document.createElement("span");
    hindiQuote.className = "charitra-caption-quote charitra-caption-quote--hindi";
    hindiQuote.textContent = `\u201C${hindi}\u201D`;

    const englishQuote = document.createElement("span");
    englishQuote.className =
      "charitra-caption-quote charitra-caption-quote--english";
    englishQuote.textContent = `\u201C${english}\u201D`;

    caption.classList.add("charitra-separated-caption");
    caption.replaceChildren(titleLine, hindiQuote, englishQuote);
  }

  function formatAdwitayaSelectedCaptions() {
    const article = findAdwitayaArticle();
    const grid = article?.querySelector('[role="region"] .columns-1');
    if (!grid) return;

    const dhenuItem = Array.from(
      grid.querySelectorAll(":scope > button, :scope > figure"),
    ).find((item) =>
      (item.textContent || "").includes("\u0927\u0947\u0928\u0941 \u092A\u094D\u0930\u093F\u092F\u093E\u092F"),
    );
    renderBilingualQuoteCaption(
      dhenuItem?.querySelector("p"),
      "\u0950 \u0927\u0947\u0928\u0941 \u092A\u094D\u0930\u093F\u092F\u093E\u092F \u0928\u092E\u0903\u0964",
      "\u090F\u0915 \u092C\u093E\u0930 \u092A\u0942\u091C\u094D\u092F \u0917\u0941\u0930\u0941 \u091C\u0940 \u0928\u0947 \u0930\u093E\u092E\u092E\u0928\u094D\u0926\u093F\u0930 \u0915\u0947 \u092C\u093E\u0939\u0930 \u092D\u0940 \u0935\u093F\u0927\u093F\u0935\u0924\u094D \u0917\u0948\u092F\u093E \u092E\u0948\u092F\u093E \u0915\u0940 \u092A\u0942\u091C\u093E \u0915\u0940 \u0925\u0940\u0964",
      "I fondly remember when Swamiji entered the Gaushala how all the cows started getting restless and impatient for Swamiji\u2019s touch, love and cuddle! Swamiji called a few cows so lovingly\u2014Parvati, Nandini and others\u2014and they all poured their love upon Swamiji the moment he came near each one of them. \uD83D\uDC90",
    );

    const secondItem = grid.querySelector(
      "#charitra-extra-adwitaya-bholebaba-20260727",
    );
    if (secondItem) {
      let caption = secondItem.querySelector("p");
      if (!caption) {
        caption = document.createElement("p");
        secondItem.append(caption);
      }
      caption.textContent =
        "\u201CZoom \u0915\u0930 \u0917\u0941\u0930\u0941 \u091C\u0940 \u0915\u0947 \u0928\u0947\u0924\u094D\u0930\u094B\u0902 \u092E\u0947\u0902 \u092C\u093E\u092C\u093E \u0915\u0947 \u092A\u094D\u0930\u0924\u093F \u092A\u094D\u0930\u0947\u092E \u0938\u0947 \u0913\u0924-\u092A\u094D\u0930\u094B\u0924 \u091A\u092E\u0915 \u0926\u0947\u0916\u0947\u0902\u0964\u201D";
      caption.classList.add("charitra-special-quote-caption");
    }

    const kreedaItem = Array.from(
      grid.querySelectorAll(":scope > button, :scope > figure"),
    ).find((item) =>
      (item.textContent || "")
        .replace(/\u093C/g, "")
        .includes("\u0915\u094D\u0930\u0940\u0921\u093E \u092A\u094D\u0930\u093F\u092F\u093E\u092F"),
    );
    const kreedaCaption = kreedaItem?.querySelector("p");
    renderBilingualQuoteCaption(
      kreedaCaption,
      "\u0950 \u0915\u094D\u0930\u0940\u0921\u093E \u092A\u094D\u0930\u093F\u092F\u093E\u092F \u0928\u092E\u0903\u0964",
      "\u090F\u0915\u0926\u092E \u0938\u093E\u0930\u094D\u0925\u0915 \u0939\u0948 \u092F\u0939 \u0928\u093E\u092E\u0964 \u0935\u093F\u0926\u094D\u092F\u093E\u0930\u094D\u0925\u0940 \u0915\u093E\u0932 \u092E\u0947\u0902 \u0915\u094D\u0930\u093F\u0915\u0947\u091F \uD83C\uDFCF \u0915\u0947 \u0932\u093F\u090F \u091C\u092F\u0902\u0924 \u0915\u094D\u0932\u092C \u0915\u0940 \u0938\u094D\u0925\u093E\u092A\u0928\u093E\u0964 \u092C\u094D\u0930\u0939\u094D\u092E\u091A\u093E\u0930\u0940 \u0915\u093E\u0932 \u092E\u0947\u0902 \u0914\u0930 \u0906\u091A\u093E\u0930\u094D\u092F \u0915\u093E\u0932 \u092E\u0947\u0902 \u0938\u093F\u0926\u094D\u0927\u092C\u093E\u0930\u0940 \u092E\u0947\u0902 \uD83C\uDFF8 \u092C\u0948\u0921\u092E\u093F\u0902\u091F\u0928, \u0915\u092C\u094D\u092C\u0921\u0940\u0964",
      kreedaEnglishCaption,
    );
    kreedaCaption?.classList.add("kreeda-priyaya-caption");
  }

  function formatKreedaModalCaption() {
    document.querySelectorAll('[role="dialog"] p').forEach((caption) => {
      const text = (caption.textContent || "").toLowerCase();
      if (!text.includes("a lot of volleyball")) return;

      caption.textContent = `\u201C${kreedaEnglishCaption}\u201D`;
      caption.classList.add("kreeda-priyaya-modal-caption");
    });
  }

  function addSmitaIkshanSeries() {
    const article = findGalleryArticleByHeading(["स्मित ईक्षणाय"]);
    if (!isGalleryArticleOpen(article)) return;

    const photoGrid = article?.querySelector('[role="region"] .columns-1');
    if (!photoGrid) return;

    const nandanatiPhoto = Array.from(
      photoGrid.querySelectorAll(":scope > button, :scope > figure"),
    ).find((item) =>
      ["नन्दति नन्दति नन्दत्येव", "अखण्डमजं भानुकोटिप्रकाशम्"].some(
        (caption) => (item.textContent || "").includes(caption),
      ),
    );
    if (!nandanatiPhoto) return;

    const originalCaption = nandanatiPhoto.querySelector("p");
    if (originalCaption) {
      originalCaption.textContent = smitaIkshanAnchorCaption;
      addCaptionOrnament(originalCaption, "sun");
    }

    const existingGroup = document.querySelector(`#${smitaIkshanSeriesId}`);
    if (existingGroup) {
      const existingCaption = existingGroup.querySelector(
        ".smita-ikshan-series__caption",
      );
      if (existingCaption) {
        existingCaption.textContent = smitaIkshanSeriesCaption;
      }
      if (nandanatiPhoto.nextElementSibling !== existingGroup) {
        nandanatiPhoto.insertAdjacentElement("afterend", existingGroup);
      }
      return;
    }

    const group = document.createElement("section");
    group.id = smitaIkshanSeriesId;
    group.className = "smita-ikshan-series";
    group.setAttribute("aria-label", smitaIkshanSeriesCaption);

    const photos = document.createElement("div");
    photos.className = "smita-ikshan-series__photos";

    smitaIkshanSeriesPhotos.forEach((photo, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "smita-ikshan-series__photo";
      button.setAttribute(
        "aria-label",
        `Enlarge Smita Ikshan photograph ${index + 1}`,
      );
      button.innerHTML = `<img src="${photo.thumbnail}" alt="Pujya Swamiji — Smita Ikshan ${index + 1}" loading="lazy" />`;
      button.addEventListener("click", () =>
        openInsertedImageViewer(
          photo.full,
          `Pujya Swamiji — Smita Ikshan ${index + 1}`,
        ),
      );
      photos.append(button);
    });

    const caption = document.createElement("p");
    caption.className = "smita-ikshan-series__caption";
    caption.textContent = smitaIkshanSeriesCaption;
    group.append(photos, caption);
    nandanatiPhoto.insertAdjacentElement("afterend", group);
  }

  // ॐ शिष्यप्रियाय नमः — a banner of the four gurus (आचार्य · माता · पिता · गुरु),
  // each word parted by a small gold floret. Same insert pattern as the vedant
  // अमृतभाषी banner: it lands at the top of the panel when the section is open.
  const shishyaPriyaBannerId = "shishya-priya-banner";
  const shishyaPriyaWords = ["आचार्य", "माता", "पिता", "गुरु"];
  const shishyaSepSvg =
    '<span class="shishya-priya-banner__sep" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" class="shishya-priya-banner__glyph">' +
    '<path d="M12 1c.9 4.6 4.4 8.1 9 9-4.6.9-8.1 4.4-9 9-.9-4.6-4.4-8.1-9-9 4.6-.9 8.1-4.4 9-9Z"/>' +
    '<circle cx="12" cy="12" r="1.55"/></svg></span>';
  const gangeshanandajiCaption =
    "परम पूज्य गुरुवर के श्रीचरणों में पूरी तरह समर्पित रहे उनके शिष्य स्वामी गंगेशानंद जी।\n\nपूज्य स्वामी गंगेशानंद जी ने १९९२–१९९५ में सांदीपनी हिमालय में परम पूज्य स्वामीजी से वेदांत का अध्ययन किया एवं वाराणसी में संस्कृत अध्ययन भी किया। सन् १९९७ से २००५ तक उन्होंने चिन्मय मिशन कानपुर को आध्यात्मिक सेवाएँ प्रदान कीं।\n\nवेदांत सत्र २००५–२००८ में आपने आत्मबोध, मनीषा पंचकम्, अद्वैत मकरंद और संस्कृत आदि कई ग्रंथों का अध्ययन करवाया एवं अध्ययन-कार्य में परम पूज्य स्वामीजी को सहयोग दिया। वेदांत सत्र २००९–२०११ एवं २०१२–२०१५ के आचार्य भी स्वामीजी रहे।\n\nइसके पश्चात चिन्मय मिशन मंधना में आपने दीर्घकाल तक पुरोहित प्रशिक्षण सत्र एवं अन्य वेदांत प्रशिक्षण सत्रों का आयोजन किया। परम पूज्य स्वामीजी की पुस्तकों के प्रकाशन में भी आपका योगदान चिन्मय मिशन की हिंदी विभाग समिति के माध्यम से रहा।\n\nसन् २००८ में आपने परम पूज्य स्वामी तेजोमयानन्द जी से प्रयागराज में संन्यास दीक्षा प्राप्त की। तीर्थराज में ही आपका देह आपके प्रिय गंगा मैया के क्षेत्र में विलीन हो गया।";
  const gangeshanandajiCaptionWithNaman =
    `${gangeshanandajiCaption}\n\nकोटिशः नमन 🙏`;
  const shishyaPriyaPhotos = [
    { id: "charitra-shishyapriya-1", src: "/assets/shishya-priya-1.jpg" },
    { id: "charitra-shishyapriya-2", src: "/assets/shishya-priya-2.jpg" },
    {
      id: "charitra-shishyapriya-amma-20260727",
      src: "/assets2/charitra-shishyapriya-amma-20260727.jpg",
    },
    {
      id: "charitra-shishyapriya-group-20260807",
      src: "/assets2/charitra-shishyapriya-group-20260807.jpeg",
    },
    {
      id: "charitra-shishyapriya-gangeshanandaji-20260727",
      src: "/assets2/charitra-shishyapriya-gangeshanandaji-20260727.jpeg",
      caption: gangeshanandajiCaptionWithNaman,
    },
  ];

  function createShishyaPriyaItem(photo) {
    const item = document.createElement("button");
    item.type = "button";
    item.id = photo.id;
    item.className = "charitra-inserted-photo";
    item.setAttribute("aria-label", "View Om Shishyapriyaya Namah photo");
    item.innerHTML = `
      <img
        src="${photo.src}"
        alt="Om Shishyapriyaya Namah"
        loading="lazy"
      />
      ${photo.caption ? `<p>${photo.caption}</p>` : ""}
    `;
    item.addEventListener("click", () =>
      openInsertedImageViewer(photo.src, "Om Shishyapriyaya Namah", photo.caption || ""),
    );
    return item;
  }

  function findShishyaPriyaArticle() {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return null;

    return Array.from(gallery.querySelectorAll("article")).find((article) => {
      const text = article.querySelector("h3")?.textContent || "";
      return (
        text.includes("शिष्यप्रियाय") ||
        text.includes("शिष्य") ||
        text.toLowerCase().includes("shishya")
      );
    });
  }

  function addShishyaPriyaBanner() {
    if (document.querySelector(`#${shishyaPriyaBannerId}`)) return;

    const article = findShishyaPriyaArticle();
    if (!isGalleryArticleOpen(article)) return;

    const panel = article?.querySelector('[role="region"] > div');
    if (!panel) return;

    const banner = document.createElement("div");
    banner.id = shishyaPriyaBannerId;
    banner.className = "shishya-priya-banner";
    const row = shishyaPriyaWords
      .map((word) => `<span class="shishya-priya-banner__word">${word}</span>`)
      .join(shishyaSepSvg);
    banner.innerHTML = `<div class="shishya-priya-banner__row">${row}</div>`;

    panel.insertAdjacentElement("afterbegin", banner);
  }

  function addShishyaPriyaImages() {
    if (shishyaPriyaPhotos.every((photo) => document.querySelector(`#${photo.id}`))) return;

    const article = findShishyaPriyaArticle();
    if (!isGalleryArticleOpen(article)) return;

    const panel = article?.querySelector('[role="region"] > div');
    if (!panel) return;

    // Use the existing photo grid; if this category has none, make one and put
    // it right under the आचार्य·माता·पिता·गुरु banner.
    let grid = panel.querySelector(".columns-1");
    if (!grid) {
      grid = document.createElement("div");
      grid.className = "columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3";
      const banner = panel.querySelector(`#${shishyaPriyaBannerId}`);
      if (banner) {
        banner.insertAdjacentElement("afterend", grid);
      } else {
        panel.append(grid);
      }
    }

    shishyaPriyaPhotos.forEach((photo) => {
      if (document.querySelector(`#${photo.id}`)) return;
      grid.append(createShishyaPriyaItem(photo));
    });
  }

  function formatGangeshanandajiCaption() {
    const renderCaption = (caption) => {
      caption.className = "shishya-gangeshanandaji-caption";
      caption.textContent = gangeshanandajiCaption;
      const closing = document.createElement("strong");
      closing.className = "shishya-gangeshanandaji-caption__naman";
      closing.textContent = "कोटिशः नमन 🙏";
      caption.append(document.createTextNode("\n\n"), closing);
    };

    const item = document.querySelector(
      "#charitra-shishyapriya-gangeshanandaji-20260727",
    );
    if (item) {
      let caption = item.querySelector("p");
      if (!caption) {
        caption = document.createElement("p");
        item.append(caption);
      }
      renderCaption(caption);
    }

    document.querySelectorAll('[role="dialog"]').forEach((dialog) => {
      if (
        !dialog.querySelector(
          'img[src*="charitra-shishyapriya-gangeshanandaji-20260727"]',
        )
      ) {
        return;
      }
      const caption = dialog.querySelector("p");
      if (caption) {
        renderCaption(caption);
      }
    });
  }

  function arrangeShishyaPriyaClosingOrder() {
    const article = findShishyaPriyaArticle();
    const grid = article?.querySelector('[role="region"] .columns-1');
    const movablePhoto = article?.querySelector(
      "#charitra-extra-shishyapriya",
    );
    const gangeshanandaji = article?.querySelector(
      "#charitra-shishyapriya-gangeshanandaji-20260727",
    );
    if (!grid || !movablePhoto || !gangeshanandaji) return;

    const otherPhotos = Array.from(
      grid.querySelectorAll(":scope > button, :scope > figure"),
    ).filter(
      (item) => item !== movablePhoto && item !== gangeshanandaji,
    );
    const twoPhotosBeforeClosing = otherPhotos.slice(-2);
    const insertionPoint = twoPhotosBeforeClosing[0];
    if (insertionPoint) {
      grid.insertBefore(movablePhoto, insertionPoint);
    }
    if (grid.lastElementChild !== gangeshanandaji) {
      grid.append(gangeshanandaji);
    }
  }

  // ------------------------------------------------------------------------
  // Extra category photos, served from /assets2/.
  // assets2/ is deliberately separate from the big assets/ folder: new images
  // can then be uploaded on their own instead of re-sending the whole ~17 MB
  // assets/ directory over Cyberduck each time.
  // ------------------------------------------------------------------------
  const extraCategoryPhotos = [
    {
      // "ॐ दृढ़प्रतिज्ञे नमः।" (category id `key-events` in the app bundle).
      match: ["दृढ़प्रतिज्ञे", "दृढप्रतिज्ञे"],
      alt: "Om Drudhpratigye Namah",
      afterCaptionStartsWith: "Sabhaghar",
      photos: [
        { id: "charitra-extra-sabhaghar", src: "/assets2/sabhaghar.jpg" },
      ],
    },
    {
      // "ॐ सद्गुरुप्रियाय नमः" — Gurudev's guidance.
      match: [
        "\u0938\u0926\u094d\u0917\u0941\u0930\u0941\u092a\u094d\u0930\u093f\u092f\u093e\u092f",
        "\u0938\u0926\u0917\u0941\u0930\u0941\u092a\u0930\u093f\u092f\u093e\u092f"
      ],
      alt: "Om Sadgurupriyaya Namah",
      photos: [
        { id: "charitra-extra-gurudevagya-1", src: "/assets2/gurudevagya-1.jpg" },
        { id: "charitra-extra-gurudevagya-2", src: "/assets2/gurudevagya-2.jpg" },
      ],
    },
    {
      // "ॐ शिष्यप्रियाय नमः।" (`batches`) — joins the two shishya-priya photos.
      match: ["शिष्यप्रियाय"],
      alt: "Om Shishyapriyaya Namah",
      photos: [{ id: "charitra-extra-shishyapriya", src: "/assets2/shishya-priya-3.jpg" }],
    },
    {
      // "ॐ वेदान्तवेद्याय नमः।" — two additional Vedanta photos.
      match: ["वेदान्तवेद्याय", "वेदान्त वेद्याय"],
      alt: "Om Vedantavedyaya Namah",
      photos: [
        { id: "charitra-extra-vedantvedaya-1", src: "/assets2/vedantvedaya-new-1.jpg" },
        { id: "charitra-extra-vedantvedaya-2", src: "/assets2/vedantvedaya-new-2.jpg" },
        {
          id: "charitra-extra-vedantvedaya-anandmath-20260727",
          src: "/assets2/charitra-vedantvedaya-anandmath-20260727.jpg",
        },
      ],
    },
    {
      // "ॐ अद्वितीयाय नमः।" (`others`).
      match: ["अद्वितीयाय"],
      alt: "Om Adwitiyaya Namah",
      photos: [
        {
          id: "charitra-extra-shivraj-1",
          src: "/assets2/adwitiya-shivraj-1.jpg",
          caption:
            "\u092A\u094D\u0930\u093E\u0915\u091F\u094D\u092F \u0909\u0924\u094D\u0938\u0935 \u2014 \u0936\u094D\u0930\u0940 \u0936\u093F\u0935\u0930\u093E\u091C \u0938\u093F\u0902\u0939 \u091A\u094C\u0939\u093E\u0928 \u091C\u0940",
        },
        {
          id: "charitra-extra-shivraj-2",
          src: "/assets2/adwitiya-shivraj-2.jpg",
          caption:
            "\u092A\u094D\u0930\u093E\u0915\u091F\u094D\u092F \u0909\u0924\u094D\u0938\u0935 \u2014 \u0936\u094D\u0930\u0940 \u0936\u093F\u0935\u0930\u093E\u091C \u0938\u093F\u0902\u0939 \u091A\u094C\u0939\u093E\u0928 \u091C\u0940",
        },
        { id: "charitra-extra-orga-1", src: "/assets2/orga1.jpg" },
        { id: "charitra-extra-orga-2", src: "/assets2/orga2.jpg" },
        {
          id: "charitra-extra-adwitaya-anandmath-1-20260727",
          src: "/assets2/charitra-adwitaya-anandmath-1-20260727.jpg",
        },
        {
          id: "charitra-extra-adwitaya-anandmath-2-20260727",
          src: "/assets2/charitra-adwitaya-anandmath-2-20260727.jpg",
        },
        {
          id: "charitra-extra-adwitaya-bholebaba-20260727",
          src: "/assets2/charitra-adwitaya-bholebaba-20260727.jpg",
          caption:
            "\u201CZoom \u0915\u0930 \u0917\u0941\u0930\u0941 \u091C\u0940 \u0915\u0947 \u0928\u0947\u0924\u094D\u0930\u094B\u0902 \u092E\u0947\u0902 \u092C\u093E\u092C\u093E \u0915\u0947 \u092A\u094D\u0930\u0924\u093F \u092A\u094D\u0930\u0947\u092E \u0938\u0947 \u0913\u0924-\u092A\u094D\u0930\u094B\u0924 \u091A\u092E\u0915 \u0926\u0947\u0916\u0947\u0902\u0964\u201D",
          specialCaption: true,
        },
      ],
    },
  ];

  function findGalleryArticleByHeading(needles) {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return null;

    return Array.from(gallery.querySelectorAll("article")).find((article) => {
      const text = article.querySelector("h3")?.textContent || "";
      return needles.some((needle) => text.includes(needle));
    });
  }

  function createExtraPhotoItem(photo, alt) {
    const item = document.createElement("button");
    item.type = "button";
    item.id = photo.id;
    item.className = "charitra-inserted-photo";
    item.setAttribute("aria-label", `View ${alt} photo`);
    item.innerHTML = `
      <img src="${photo.src}" alt="${alt}" loading="lazy" />
      ${
        photo.caption
          ? `<p class="${photo.specialCaption ? "charitra-special-quote-caption" : ""}">${photo.caption}</p>`
          : ""
      }
    `;
    item.addEventListener("click", () =>
      openInsertedImageViewer(photo.src, alt, photo.caption || ""),
    );
    return item;
  }

  function updateAdwitayaEventCaptions() {
    const article = findAdwitayaArticle();
    const grid = article?.querySelector('[role="region"] .columns-1');
    if (!grid) return;

    function renderEventCaption(caption, hindi, english) {
      if (!caption) return;
      const hindiLine = document.createElement("span");
      hindiLine.className = "adwitaya-event-caption__hindi";
      hindiLine.textContent = hindi;
      const englishLine = document.createElement("span");
      englishLine.className = "adwitaya-event-caption__english";
      englishLine.textContent = english;
      caption.classList.add("adwitaya-event-caption");
      caption.replaceChildren(hindiLine, englishLine);
    }

    grid
      .querySelectorAll('img[src*="new-kayakalp-"]')
      .forEach((image) => {
        const item = galleryItemForImage(image);
        if (!item) return;
        let caption = item.querySelector("p");
        if (!caption) {
          caption = document.createElement("p");
          item.append(caption);
        }
        renderEventCaption(
          caption,
          "\u0915\u093E\u092F\u093E\u0915\u0932\u094D\u092A \u092A\u093E\u0932\u092E\u092A\u0941\u0930 \u0915\u093E \u0909\u0926\u094D\u0918\u093E\u091F\u0928 \u0938\u092E\u093E\u0930\u094B\u0939",
          "Ex H.P. Chief Minister Shri Shanta Kumarji",
        );
      });

    grid
      .querySelectorAll(
        "#charitra-extra-shivraj-1, #charitra-extra-shivraj-2",
      )
      .forEach((item) => {
        let caption = item.querySelector("p");
        if (!caption) {
          caption = document.createElement("p");
          item.append(caption);
        }
        renderEventCaption(
          caption,
          "\u092A\u094D\u0930\u093E\u0915\u091F\u094D\u092F \u0909\u0924\u094D\u0938\u0935",
          "Then C.M., now Union Minister Shivraj Singh Chouhanji",
        );
      });

    document.querySelectorAll('[role="dialog"]').forEach((dialog) => {
      const kayakalpImage = dialog.querySelector(
        'img[src*="new-kayakalp-"]',
      );
      const shivrajImage = dialog.querySelector(
        'img[src*="adwitiya-shivraj-"]',
      );
      const caption = dialog.querySelector("p");
      if (kayakalpImage) {
        renderEventCaption(
          caption,
          "\u0915\u093E\u092F\u093E\u0915\u0932\u094D\u092A \u092A\u093E\u0932\u092E\u092A\u0941\u0930 \u0915\u093E \u0909\u0926\u094D\u0918\u093E\u091F\u0928 \u0938\u092E\u093E\u0930\u094B\u0939",
          "Ex H.P. Chief Minister Shri Shanta Kumarji",
        );
      } else if (shivrajImage) {
        renderEventCaption(
          caption,
          "\u092A\u094D\u0930\u093E\u0915\u091F\u094D\u092F \u0909\u0924\u094D\u0938\u0935",
          "Then C.M., now Union Minister Shivraj Singh Chouhanji",
        );
      }
    });
  }

  function addExtraCategoryPhotos() {
    extraCategoryPhotos.forEach((group) => {
      // Already placed — nothing to do (this runs on every DOM mutation).
      const article = findGalleryArticleByHeading(group.match);
      if (!isGalleryArticleOpen(article)) return;

      const panel = article?.querySelector('[role="region"] > div');
      if (!panel) return;

      // Append to the category's existing photo grid, or make one if it has none.
      let grid = panel.querySelector(".columns-1");
      if (!grid) {
        grid = document.createElement("div");
        grid.className = "columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3";
        panel.append(grid);
      }

      let insertionAnchor = group.afterCaptionStartsWith
        ? Array.from(grid.children).find((item) =>
            (item.querySelector("p")?.textContent || "")
              .trim()
              .startsWith(group.afterCaptionStartsWith),
          )
        : null;

      group.photos.forEach((photo) => {
        const existing = document.querySelector(`#${photo.id}`);
        const item = existing || createExtraPhotoItem(photo, group.alt);
        if (insertionAnchor) {
          insertionAnchor.insertAdjacentElement("afterend", item);
          insertionAnchor = item;
        } else if (!existing) {
          grid.append(item);
        }
      });
    });
  }

  function placeSabhagharExtraPhoto() {
    const gallery = document.querySelector("#photo-gallery2");
    const sabhagharCaption = Array.from(
      gallery?.querySelectorAll("[role='region'] p") || [],
    ).find((caption) =>
      (caption.textContent || "").trim().startsWith("Sabhaghar"),
    );
    const anchorItem = galleryItemForImage(
      sabhagharCaption?.closest("button, figure")?.querySelector("img"),
    );
    if (!anchorItem) return;

    let item = document.getElementById("charitra-extra-sabhaghar");
    if (!item) {
      item = createExtraPhotoItem(
        {
          id: "charitra-extra-sabhaghar",
          src: "/assets2/sabhaghar.jpg",
        },
        "Om Drudhpratigye Namah",
      );
    }
    if (anchorItem.nextElementSibling !== item) {
      anchorItem.insertAdjacentElement("afterend", item);
    }
  }

  function moveVedantLongestCaptionToEnd() {
    const article = findVedantVedyaArticle();
    const grid = article?.querySelector('[role="region"] .columns-1');
    if (!grid) return;

    const candidates = Array.from(
      grid.querySelectorAll(":scope > button, :scope > figure"),
    )
      .map((item) => ({
        item,
        length: (item.querySelector("p")?.textContent || "").trim().length,
      }))
      .filter(({ length }) => length > 0)
      .sort((a, b) => b.length - a.length);
    const longTextItem = candidates[0]?.item;
    if (longTextItem && grid.lastElementChild !== longTextItem) {
      grid.append(longTextItem);
    }
  }

  function addVedantPhotosBeforeClosingPair() {
    const article = findVedantVedyaArticle();
    if (!isGalleryArticleOpen(article)) return;

    const grid = article?.querySelector('[role="region"] .columns-1');
    if (!grid) return;

    const currentItems = Array.from(
      grid.querySelectorAll(":scope > button, :scope > figure"),
    );
    // The existing final two cards carry the protected closing photographs and
    // caption. Insert the new cards immediately before them, never between them.
    const closingPairStart =
      currentItems.length >= 2 ? currentItems[currentItems.length - 2] : null;

    const newItems = vedantNewPhotos20260807.map((photo) => {
      let item = grid.querySelector(`#${photo.id}`);
      if (!item) {
        item = createRequestedPhotoItem(photo.id, photo.src, photo.alt);
      }
      return item;
    });

    const alreadyPlaced =
      closingPairStart &&
      newItems[0]?.nextElementSibling === newItems[1] &&
      newItems[1]?.nextElementSibling === closingPairStart;
    if (alreadyPlaced) return;

    newItems.forEach((item) => {
      if (closingPairStart) grid.insertBefore(item, closingPairStart);
      else grid.append(item);
    });
  }

  function wireShishyaPriyaOpenHandler() {
    const article = findShishyaPriyaArticle();
    const btn = article?.querySelector("h3 > button");
    if (!btn || btn.dataset.shishyaWired === "1") return;
    btn.dataset.shishyaWired = "1";
    btn.addEventListener("click", () => {
      [120, 400, 900].forEach((delay) =>
        window.setTimeout(() => {
          addShishyaPriyaBanner();
          addShishyaPriyaImages();
          formatGangeshanandajiCaption();
          arrangeShishyaPriyaClosingOrder();
        }, delay),
      );
    });
  }

  // Give every Charitra-Jhalak category quote-banner the framed pull-quote look and
  // the banner display fonts. Two kinds exist:
  //   • the plain #FFF4DE "Iu" boxes — ॐ स्मित ईक्षणाय, ॐ सद्गुरुप्रियाय, ॐ भक्तवत्सलाय
  //     ("He loves…"), with-gurudev; and
  //   • the larger gradient ॐ अद्वितीयाय banner (two blockquotes).
  // Quote text gets a font by script: Devanagari → Rozha One, Latin → Playfair.
  function applyQuoteFont(el) {
    const hasDevanagari = /[ऀ-ॿ]/.test(el.textContent || "");
    el.classList.add(
      "charitra-quote-text",
      hasDevanagari ? "charitra-quote-text--dev" : "charitra-quote-text--latin",
    );
  }

  function styleQuoteBanners() {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return;

    // Plain #FFF4DE category quote boxes.
    gallery.querySelectorAll('[class*="bg-[#FFF4DE]"]').forEach((banner) => {
      banner.classList.add("charitra-quote-banner");
      banner.querySelectorAll(":scope > p").forEach(applyQuoteFont);
    });

    // ॐ अद्वितीयाय gradient banner (matched by its distinctive gradient colour).
    gallery.querySelectorAll('[class*="F8E5C4"]').forEach((banner) => {
      banner.classList.add("charitra-adwitaya-banner");
      banner.querySelectorAll("blockquote").forEach(applyQuoteFont);
    });
  }

  function updateSmitaQuoteAttribution() {
    const article = findGalleryArticleByHeading(["स्मित ईक्षणाय"]);
    if (!article) return;

    article.querySelectorAll("p").forEach((paragraph) => {
      const text = (paragraph.textContent || "").trim();
      if (
        text === "एक पूज्य स्वामीजी" ||
        text === "— एक पूज्य स्वामीजी" ||
        text ===
          "परम पूज्य स्वामीजी के विषय में एक पूज्य स्वामीजी के उद्गार"
      ) {
        paragraph.textContent =
          "परम पूज्य स्वामीजी के विषय में एक पूज्य स्वामीजी के उद्गार";
        paragraph.classList.add("smita-quote-attribution");
      }
    });
  }

  function formatTwoLineDevotionalCaptions() {
    const article = findGalleryArticleByHeading(["स्मित ईक्षणाय"]);
    if (!article) return;

    article.querySelectorAll("button p, figure p").forEach((caption) => {
      const text = (caption.textContent || "").replace(/\s+/g, " ").trim();
      if (
        text.includes("प्रसन्नाननं नीलकण्ठं दयालम्") &&
        text.includes("प्रिय शंकरं सर्वनाथं भजामि")
      ) {
        caption.textContent =
          "प्रसन्नाननं नीलकण्ठं दयालम्‌ ।\nप्रिय शंकरं सर्वनाथं भजामि ॥";
        caption.classList.add("two-line-devotional-caption");
      }
    });
  }

  function styleNarrativePhotoCaptions() {
    document
      .querySelectorAll(
        "#photo-gallery2 [role='region'] button p, #photo-gallery2 [role='region'] figure p",
      )
      .forEach((caption) => {
        if (caption.classList.contains("charitra-separated-caption")) return;
        const text = (caption.textContent || "").replace(/\s+/g, " ").trim();
        if (text.length < 150) return;

        caption.classList.add("charitra-narrative-caption");
        caption.classList.toggle(
          "charitra-narrative-caption--already-quoted",
          text.startsWith("“") || text.startsWith('"'),
        );
      });
  }

  // Give every enlarged-photo modal the SAME prominent close control. The
  // injected viewer (#charitra-special-viewer) is already styled directly; here
  // we just tag the React photo modals' close buttons (aria-label "Close …") so
  // the shared .charitra-modal-close-unified CSS applies to them too.
  function unifyPhotoModalClose() {
    document.querySelectorAll('[role="dialog"]').forEach((dialog) => {
      if (dialog.id === "charitra-special-viewer") return;
      if (!dialog.querySelector("img")) return; // photo modals only
      if (dialog.querySelector(".hommage-parchment-card")) return; // text card
      dialog.querySelectorAll("button").forEach((btn) => {
        const label = (btn.getAttribute("aria-label") || "").toLowerCase();
        if (label.includes("close")) {
          btn.classList.add("charitra-modal-close-unified");
        }
      });
    });
  }

  function formatAkhileshwarCaption(cap) {
    if (!cap || cap.classList.contains("akhileshwar-caption")) return;

    const text = (cap.textContent || "").trim();
    const englishTitle =
      "Akhileshwar Mahadev Mandir — Om Namah Shivaya..";
    if (!text.startsWith(englishTitle)) return;

    const description = text.slice(englishTitle.length).trim();
    const heading = document.createElement("span");
    heading.className = "akhileshwar-caption__heading";
    heading.innerHTML = `
      <svg viewBox="0 0 36 36" aria-hidden="true" focusable="false">
        <path d="M18 27c-4.8-3.1-7.2-7-6.7-11.7 3.3 1.1 5.6 3.9 6.7 8.4 1.1-4.5 3.4-7.3 6.7-8.4.5 4.7-1.9 8.6-6.7 11.7Z" />
        <path d="M18 23.7c-2.6-4.3-2.6-9.1 0-13.7 2.6 4.6 2.6 9.4 0 13.7Z" />
        <path d="M8.5 27c3.3 3.2 15.7 3.2 19 0M11.2 30.2h13.6" />
      </svg>
      <span>अखिलेश्वर महादेव मंदिर — ॐ नमः शिवाय॥</span>
    `;

    const body = document.createElement("span");
    body.className = "akhileshwar-caption__body";
    body.textContent = description;

    cap.classList.add("akhileshwar-caption");
    cap.replaceChildren(heading, body);
  }

  function updateDridhaPratigyaPresentation() {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return;

    const article = Array.from(gallery.querySelectorAll("article")).find(
      (item) => {
        const title = item.querySelector("h3")?.textContent || "";
        return (
          title.includes("दृढप्रतिज्ञे") ||
          title.includes("दृढ़प्रतिज्ञे") ||
          title.includes("दृढ़प्रतिज्ञे")
        );
      },
    );
    article?.classList.add("dridha-pratigya-article");

    document
      .querySelectorAll('[role="dialog"] p')
      .forEach(formatAkhileshwarCaption);
  }

  // ॐ अद्वितीयाय category caption fixes: write the सन्तप्रियाय caption in Devanagari
  // and drop the stray English "Nature walk" label.
  function fixOthersCaptions() {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return;
    gallery.querySelectorAll('[role="region"] button p, [role="region"] figcaption p').forEach((cap) => {
      const text = (cap.textContent || "").trim();
      if (text === "Om santpriyay namah") {
        cap.textContent = "ॐ सन्तप्रियाय नमः";
      } else if (text === "Nature walk") {
        cap.remove();
      } else if (
        text.startsWith("Akhileshwar Mahadev Mandir — Om Namah Shivaya..")
      ) {
        formatAkhileshwarCaption(cap);
      }
    });
  }

  // Move the "Being from Andhra Pradesh…" remembrance photo out of ॐ अद्वितीयाय
  // and into ॐ वेदान्तवेद्याय: hide the original card there and inject a copy into
  // the vedant photo grid (which exists once that panel is opened).
  const ANDHRA_HINT = "Being from Andhra Pradesh";
  const ANDHRA_MOVED_ID = "vedant-andhra-moved";
  const andhraSrc = "/assets2/vedant-andhra-remembrance-20260726.jpg";
  const andhraCaption =
    "“Being from Andhra Pradesh and having not studied Hindi during my school days, I often struggled to understand Hindi. But when I first listened to Pujya Swamiji’s discourses on Ramcharit Manas, something magical happened, everything that Pujya Swamiji was saying was flowing like nectar into my ears!!”";

  function moveAndhraPhotoToVedant() {
    const gallery = document.querySelector("#photo-gallery2");
    if (!gallery) return;

    // Hide only the original card in ॐ अद्वितीयाय. Do not use caption text
    // here: the inserted Vedant card intentionally begins with the same words.
    const originalImage = gallery.querySelector(
      'img[src*="photo-2-BEqXBnFU"]',
    );
    const original = galleryItemForImage(originalImage);
    if (original) original.style.display = "none";

    // Inject the copy into वेदान्तवेद्याय (only once that panel exists / is open).
    const vedant = findVedantVedyaArticle();
    if (!isGalleryArticleOpen(vedant)) return;
    const grid = vedant.querySelector('[role="region"] .columns-1');
    if (!grid) return;

    let item = document.querySelector(`#${ANDHRA_MOVED_ID}`);
    if (!item) {
      item = document.createElement("button");
      item.type = "button";
      item.id = ANDHRA_MOVED_ID;
      item.className = "charitra-inserted-photo";
      item.setAttribute(
        "aria-label",
        "View Pujya Swamiji discourse remembrance photo",
      );
      item.addEventListener("click", () =>
        openInsertedImageViewer(
          andhraSrc,
          "Pujya Swamiji discourse remembrance",
          andhraCaption,
        ),
      );
    }
    item.innerHTML = `
      <img src="${andhraSrc}" alt="Pujya Swamiji discourse remembrance" loading="lazy" />
      <p class="vedant-andhra-caption">${andhraCaption}</p>
    `;
    item.style.removeProperty("display");

    const otherPhotos = Array.from(
      grid.querySelectorAll(":scope > button, :scope > figure"),
    ).filter((photo) => photo !== item);
    const secondPosition = otherPhotos[1];
    if (secondPosition) {
      grid.insertBefore(item, secondPosition);
    } else {
      grid.append(item);
    }
  }

  let isEnhancingGallery = false;
  let vedantEnhanceTimer = null;
  let enhanceGalleryTimer = null;

  function scheduleVedantEnhancements() {
    if (vedantEnhanceTimer !== null) window.clearTimeout(vedantEnhanceTimer);
    vedantEnhanceTimer = window.setTimeout(() => {
      vedantEnhanceTimer = null;
          addVedantAmritbhashiBanner();
          updateVedantAmritbhashinePhoto();
          moveAndhraPhotoToVedant();
          enforceCharitraClosingPhotos();
          arrangeVedantRequestedCaptions();
    }, 420);
  }

  function debounceEnhanceGallery() {
    if (enhanceGalleryTimer !== null) window.clearTimeout(enhanceGalleryTimer);
    enhanceGalleryTimer = window.setTimeout(() => {
      enhanceGalleryTimer = null;
      enhanceGallery();
    }, 100);
  }

  function enhanceGallery() {
    if (isEnhancingGallery) return;
    isEnhancingGallery = true;
    try {
      document.querySelectorAll("#photo-gallery2 p").forEach((paragraph) => {
        const text = (paragraph.textContent || "").trim();
        if (
          text ===
          "Along with fond memories and heartfelt recollections shared by devotees from time to time."
        ) {
          paragraph.textContent =
            "भक्तों द्वारा साझा किए गए चित्रों, मधुर स्मृतियों और छोटे-छोटे प्रसंगों की झलकियाँ।";
        } else if (text === "कृपया एक पावन झलक चुनें") {
          paragraph.textContent = "कृपया नीचे दी गई श्रेणी पर क्लिक करें।";
        }
      });
      correctCharanVandanCaption();
      addVidyaImages();
      addDravinamImage();
      addBhaktaVatsalayaChildrenMemory();
      addTvamevSakhaImage();
      addGuruparamparaImage();
      removeOldWheelchairCard();
      addWheelchairImage();
      removeSadguruPetCaption();
      updateSadguruPriyayeCaption();
      updateAdwitayaPhotoCaptions();
      updateNamamiAnandaPhoto();
      removeNamamiDiwaliPhoto();
      moveShishyaHitChintakPhotoToSmita();
      addAnandvardhakayaCategory();
      wireSadguruPriyaOpenHandler();
      wireVedantOpenHandler();
      addVedantTextDepthPhoto();
      scheduleVedantEnhancements();
      addShishyaPriyaBanner();
      addShishyaPriyaImages();
      formatGangeshanandajiCaption();
      wireShishyaPriyaOpenHandler();
      addExtraCategoryPhotos();
      arrangeShishyaPriyaClosingOrder();
      placeSabhagharExtraPhoto();
      arrangeSadguruAgyaPhotoGroup();
      addSadguruSamadhiCareRemembrance();
      updateAdwitayaEventCaptions();
      moveShivrajPhotosAfterKayakalp();
      moveAnandvardhakayaPhotosToAdwitaya();
      enforceAdwitayaPhotoOrder();
      moveLoveReflectionAfterSidhbariCottage();
      moveTeerthPhotoSequenceBeforeSidhbariCottage();
      removeThreePhotosAfterTeerthSwaroopaya();
      removeRoseGarlandPhotoAndFollowingThree();
      addCleanlinessStoryToBedPhoto();
      formatAdwitayaSelectedCaptions();
      swapAnandvardhakayaAndAdwitayaClosingPhotos();
      formatKreedaModalCaption();
      addRequestedCharitraPhotos();
      addFinalImage();
      addBlessingSection();
      // (ॐ वेदान्तवेद्याय's second "भाष्यकार" banner was removed — its line now
      // rides as the caption on the भाष्यकार-प्रियाय photo, see below.)
      updateAdwitayaExistingBanner();
      updateSidhbariLeelaBanner();
      repairStutiGangeshanandaImages();
      fixOthersCaptions();
      moveAndhraPhotoToVedant();
      removeDandaFromCharitraCategoryTitles();
      boldOmCaptions();
      groupSadguruPriyayaMahasamadhiPhotos();
      stabilizeSadguruPriyayaClosingOrder();
      watchSadguruPriyayaClosingOrder();
      polishNamamiChittchorkamSection();
      addSmitaIkshanSeries();
      enforceCharitraClosingPhotos();
      unifyPhotoModalClose();
      styleQuoteBanners();
      updateSmitaQuoteAttribution();
      formatTwoLineDevotionalCaptions();
      styleNarrativePhotoCaptions();
      updateDridhaPratigyaPresentation();
      moveVedantLongestCaptionToEnd();
      addVedantPhotosBeforeClosingPair();
    } finally {
      isEnhancingGallery = false;
    }
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeViewer();
  });

  document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(debounceEnhanceGallery);
    observer.observe(document.body, { childList: true, subtree: true });
    enhanceGallery();

    // React and lazy-loaded images can replace gallery DOM shortly after the
    // first enhancement pass. Run a small, finite set of settling passes so
    // the final rendered state remains enhanced instead of flashing back to
    // the original gallery.
    [120, 420, 900, 1800, 3200].forEach((delay) => {
      window.setTimeout(enhanceGallery, delay);
    });

    // Apply the same settling passes whenever any Charitra accordion opens.
    // Delegation keeps this reliable even when React recreates the buttons.
    document.addEventListener("click", (event) => {
      const toggle = event.target.closest(
        "#photo-gallery2 article h3 > button",
      );
      if (!toggle) return;
      [80, 240, 600, 1200].forEach((delay) => {
        window.setTimeout(enhanceGallery, delay);
      });
    });
  });
})();
