(function () {
  /*
    मेरी निजी तस्वीरें व नोट्स — My Private Photos & Notes.

    A personal, PRIVATE keepsake. Unlike सद्गुरु-स्मरण (which posts to the server
    for everyone), these items are stored ONLY in this browser, on this device,
    using IndexedDB. They are never uploaded and nobody else can see them.

    Holds two kinds of items:
      • Photos — downscaled and shown as picture thumbnails.
      • Notes (PDF) — spiritual notes etc., shown as a 📄 card you can open, and
        stored as-is (PDFs aren't downscaled).

    Because on-device storage can be cleared (clearing browser data, switching
    phones, iOS evicting storage), a clear note tells the visitor this, and a
    "सहेजें / Save" button lets them keep any item permanently on their phone
    (via the native share sheet on mobile, or a normal download on desktop).

    Injected right after the सद्गुरु-स्मरण (#hommage) section and kept alive with a
    debounced MutationObserver, matching the other enhancement scripts.
  */

  const SECTION_ID = "my-photos";
  const DB_NAME = "omsmriti-my-photos";
  const STORE = "photos";
  const MAX_DIM = 1600; // downscale long edge before saving, to spare phone storage
  const JPEG_QUALITY = 0.82;

  // ---- IndexedDB (on-device, private) -----------------------------------
  let dbPromise = null;
  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  async function dbAdd(record) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const req = tx.objectStore(STORE).add(record);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function dbGetAll() {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async function dbDelete(id) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const req = tx.objectStore(STORE).delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // ---- Image compression -------------------------------------------------
  function compress(file) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        canvas.toBlob(
          (blob) => resolve(blob || file),
          "image/jpeg",
          JPEG_QUALITY,
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file); // fall back to the original if it can't be decoded
      };
      img.src = url;
    });
  }

  // ---- Save an item permanently to the phone -----------------------------
  async function saveBlob(blob, filename) {
    const file = new File([blob], filename, {
      type: blob.type || "application/octet-stream",
    });

    // On phones this opens the native share sheet → "Save Image" / "Save to
    // Files", which keeps the item permanently outside the browser.
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return; // user cancelled
      }
    }

    // Desktop / browsers without file-share: a normal download.
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  // ---- Open a PDF note in a new tab / the phone's PDF viewer --------------
  function openDoc(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Keep the URL alive long enough for the new tab to load the PDF.
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  // ---- Lightbox (photos) -------------------------------------------------
  function openLightbox(objectUrl) {
    const overlay = document.createElement("div");
    overlay.className = "my-photos-lightbox";
    overlay.innerHTML = `
      <button type="button" class="my-photos-lightbox__close" aria-label="बंद करें / Close">×</button>
      <img src="${objectUrl}" alt="">
    `;
    const close = () => overlay.remove();
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.classList.contains("my-photos-lightbox__close")) close();
    });
    document.addEventListener(
      "keydown",
      function esc(e) {
        if (e.key === "Escape") {
          close();
          document.removeEventListener("keydown", esc);
        }
      },
    );
    document.body.appendChild(overlay);
  }

  // ---- Rendering ---------------------------------------------------------
  const objectUrls = new Set();
  function freeUrls() {
    objectUrls.forEach((u) => URL.revokeObjectURL(u));
    objectUrls.clear();
  }

  function photoTileFor(record) {
    const url = URL.createObjectURL(record.blob);
    objectUrls.add(url);

    const figure = document.createElement("figure");
    figure.className = "my-photo";
    figure.innerHTML = `
      <button type="button" class="my-photo__view" aria-label="बड़ा करके देखें / View larger">
        <img src="${url}" alt="मेरी तस्वीर" loading="lazy">
      </button>
      <figcaption class="my-photo__actions">
        <button type="button" class="my-photo__save">📥 Save करें</button>
        <button type="button" class="my-photo__delete" aria-label="हटाएँ / Delete">🗑</button>
      </figcaption>
    `;
    figure.querySelector(".my-photo__view").addEventListener("click", () => openLightbox(url));
    figure.querySelector(".my-photo__save").addEventListener("click", () =>
      saveBlob(record.blob, `sadguru-smriti-${record.ts || Date.now()}.jpg`),
    );
    figure.querySelector(".my-photo__delete").addEventListener("click", async () => {
      if (!window.confirm("यह तस्वीर हटाएँ? / Delete this photo from this device?")) return;
      await dbDelete(record.id);
      await refreshGrid();
    });
    return figure;
  }

  function docTileFor(record) {
    const name = record.name || "note.pdf";

    const figure = document.createElement("figure");
    figure.className = "my-photo my-photo--doc";
    figure.innerHTML = `
      <button type="button" class="my-photo__view my-photo__view--doc" aria-label="नोट खोलें / Open note">
        <span class="my-photo__doc-icon" aria-hidden="true">📄</span>
        <span class="my-photo__doc-name"></span>
      </button>
      <figcaption class="my-photo__actions">
        <button type="button" class="my-photo__save">📥 Save करें</button>
        <button type="button" class="my-photo__delete" aria-label="हटाएँ / Delete">🗑</button>
      </figcaption>
    `;
    // Use textContent for the filename so it can never be treated as HTML.
    figure.querySelector(".my-photo__doc-name").textContent = name;
    figure.querySelector(".my-photo__view").addEventListener("click", () => openDoc(record.blob));
    figure.querySelector(".my-photo__save").addEventListener("click", () =>
      saveBlob(record.blob, name),
    );
    figure.querySelector(".my-photo__delete").addEventListener("click", async () => {
      if (!window.confirm("यह नोट हटाएँ? / Delete this note from this device?")) return;
      await dbDelete(record.id);
      await refreshGrid();
    });
    return figure;
  }

  function tileFor(record) {
    return record.kind === "pdf" ? docTileFor(record) : photoTileFor(record);
  }

  async function refreshGrid() {
    const grid = document.querySelector(`#${SECTION_ID} .my-photos-grid`);
    const empty = document.querySelector(`#${SECTION_ID} .my-photos-empty`);
    if (!grid) return;

    freeUrls();
    let records = [];
    try {
      records = await dbGetAll();
    } catch (e) {
      records = [];
    }
    records.sort((a, b) => (b.ts || 0) - (a.ts || 0)); // newest first

    grid.replaceChildren(...records.map(tileFor));
    if (empty) empty.hidden = records.length > 0;
  }

  function isPdf(file) {
    return file.type === "application/pdf" || /\.pdf$/i.test(file.name || "");
  }

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    for (const file of files) {
      try {
        if (isPdf(file)) {
          // Store the PDF as-is (not downscaled), tagged as a note.
          await dbAdd({ blob: file, ts: Date.now(), kind: "pdf", name: file.name || "note.pdf" });
        } else if (file.type.startsWith("image/")) {
          const blob = await compress(file);
          await dbAdd({ blob, ts: Date.now(), kind: "image" });
        }
        // anything else is ignored
      } catch (e) {
        /* skip a file that fails; keep going with the rest */
      }
    }
    await refreshGrid();
  }

  // The "नमामि स्नेहमूर्तिम्" text orbits a circle via an SVG <textPath>. Building
  // it in JS (with the correct SVG namespace + both href and xlink:href) makes the
  // curved text render reliably — inline SVG in innerHTML often fails to link the
  // path in some browsers, so the ring shows no text.
  const SVG_NS = "http://www.w3.org/2000/svg";
  const XLINK_NS = "http://www.w3.org/1999/xlink";
  function buildNamamiOrbitSvg() {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 320 320");

    const defs = document.createElementNS(SVG_NS, "defs");
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("id", "namami-sneh-orbit");
    path.setAttribute("d", "M 160,160 m -128,0 a 128,128 0 1,1 256,0 a 128,128 0 1,1 -256,0");
    defs.appendChild(path);

    const text = document.createElementNS(SVG_NS, "text");
    const textPath = document.createElementNS(SVG_NS, "textPath");
    textPath.setAttribute("href", "#namami-sneh-orbit");
    textPath.setAttributeNS(XLINK_NS, "xlink:href", "#namami-sneh-orbit");
    textPath.textContent = "ॐ श्री सद्गुरवे नमः • ".repeat(7);
    text.appendChild(textPath);

    svg.appendChild(defs);
    svg.appendChild(text);
    return svg;
  }

  function buildSection() {
    const section = document.createElement("section");
    section.id = SECTION_ID;
    section.className = "my-photos-section";
    section.innerHTML = `
      <div class="namami-divider">
        <div class="namami-block">
          <span class="namami-line namami-line--sneh"><span class="namami-text">नमामि स्नेहमूर्तये</span></span>
          <div class="devotional-line-divider namami-divider__rule" aria-hidden="true">
            <span class="divider-symbol"><svg viewBox="0 0 34 18" role="presentation" focusable="false"><path d="M17 15.4C12.8 12.9 10.7 9.5 11.2 5.4C14 6.5 16.1 9.5 17 15.4Z"></path><path d="M17 15.4C21.2 12.9 23.3 9.5 22.8 5.4C20 6.5 17.9 9.5 17 15.4Z"></path><path d="M17 15.4C14.8 11.3 14.8 6.5 17 2.6C19.2 6.5 19.2 11.3 17 15.4Z"></path><path d="M8.8 15.3H25.2" class="divider-symbol__base"></path></svg></span>
          </div>
        </div>
        <div class="namami-divider__area">
          <div class="namami-divider__orbit" aria-hidden="true"></div>
          <img class="namami-divider__feet" src="/assets/charan-vandan-feet-DRcPUe7y.jpg" alt="" loading="lazy">
        </div>
      </div>

      <div class="my-photos-inner">
        <div class="my-photos-head">
          <h2 class="my-photos-title">Personal Photos and Files</h2>
        </div>

        <div class="my-photos-note" role="note">
          <span class="my-photos-note__icon" aria-hidden="true">🔒</span>
          <div class="my-photos-note__text">
            <p>Photos and files added to this section are never uploaded to the website.
            This private space can serve as a single place for personal spiritual photos,
            PDF, notes etc.</p>
            <p>These items are stored only in the browser on the current device. They may be
            lost if the browser data is cleared, app is reinstalled or device is changed.
            Please download important items to the phone for safekeeping.</p>
          </div>
        </div>

        <div class="my-photos-actions">
          <button type="button" class="my-photos-add">
            <span aria-hidden="true">＋</span> Add Photo or PDF
          </button>
          <input type="file" accept="image/*,application/pdf" multiple class="my-photos-input" hidden>
        </div>

        <p class="my-photos-empty">Nothing added yet.</p>
        <div class="my-photos-grid"></div>
      </div>
    `;

    const orbit = section.querySelector(".namami-divider__orbit");
    if (orbit) orbit.appendChild(buildNamamiOrbitSvg());

    const input = section.querySelector(".my-photos-input");
    section.querySelector(".my-photos-add").addEventListener("click", () => input.click());
    input.addEventListener("change", () => {
      handleFiles(input.files);
      input.value = ""; // allow re-adding the same file later
    });

    return section;
  }

  function ensureSection() {
    const host = document.getElementById("hommage");
    if (!host) return;

    let section = document.getElementById(SECTION_ID);
    if (section && section.isConnected) return; // already in place

    section = buildSection();
    host.insertAdjacentElement("afterend", section);

    // Ask the browser to keep our storage (reduces the chance the OS evicts it).
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {});
    }
    refreshGrid();
  }

  function start() {
    ensureSection();
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        scheduled = false;
        ensureSection();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
