(function () {
  /*
    मेरी निजी तस्वीरें — My Private Photos.

    A personal, PRIVATE photo keepsake. Unlike सद्गुरु-स्मरण (which posts to the
    server for everyone), these photos are stored ONLY in this browser, on this
    device, using IndexedDB. They are never uploaded and nobody else can see them.

    Because on-device storage can be cleared (clearing browser data, switching
    phones, iOS evicting storage), a clear note tells the visitor this, and a
    "फ़ोन गैलरी में सहेजें / Save to phone gallery" button lets them keep any photo
    permanently in their real Photos app (via the native share sheet on mobile,
    or a normal download on desktop).

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

  // ---- Save a photo into the real phone gallery --------------------------
  async function saveToGallery(blob) {
    const name = `sadguru-smriti-${Date.now()}.jpg`;
    const file = new File([blob], name, { type: blob.type || "image/jpeg" });

    // On phones this opens the native share sheet → "Save Image" / "Save to
    // Photos", which lands the picture in the real gallery.
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
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  // ---- Lightbox ----------------------------------------------------------
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

  function tileFor(record) {
    const url = URL.createObjectURL(record.blob);
    objectUrls.add(url);

    const figure = document.createElement("figure");
    figure.className = "my-photo";
    figure.innerHTML = `
      <button type="button" class="my-photo__view" aria-label="बड़ा करके देखें / View larger">
        <img src="${url}" alt="मेरी तस्वीर" loading="lazy">
      </button>
      <figcaption class="my-photo__actions">
        <button type="button" class="my-photo__save">📥 गैलरी में सहेजें</button>
        <button type="button" class="my-photo__delete" aria-label="हटाएँ / Delete">🗑</button>
      </figcaption>
    `;
    figure.querySelector(".my-photo__view").addEventListener("click", () => openLightbox(url));
    figure.querySelector(".my-photo__save").addEventListener("click", () => saveToGallery(record.blob));
    figure.querySelector(".my-photo__delete").addEventListener("click", async () => {
      if (!window.confirm("यह तस्वीर हटाएँ? / Delete this photo from this device?")) return;
      await dbDelete(record.id);
      await refreshGrid();
    });
    return figure;
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

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
    for (const file of files) {
      try {
        const blob = await compress(file);
        await dbAdd({ blob, ts: Date.now() });
      } catch (e) {
        /* skip a file that fails; keep going with the rest */
      }
    }
    await refreshGrid();
  }

  function buildSection() {
    const section = document.createElement("section");
    section.id = SECTION_ID;
    section.className = "my-photos-section";
    section.innerHTML = `
      <div class="my-photos-inner">
        <div class="my-photos-head">
          <h2 class="my-photos-title">मेरी निजी तस्वीरें</h2>
          <p class="my-photos-subtitle">My Private Photos · केवल आपके फ़ोन पर</p>
        </div>

        <div class="my-photos-note" role="note">
          <span class="my-photos-note__icon" aria-hidden="true">🔒</span>
          <div class="my-photos-note__text">
            <p><strong>ये तस्वीरें केवल आपके इस फ़ोन में सुरक्षित हैं।</strong> इन्हें आपके अलावा
            कोई नहीं देख सकता और ये कहीं इंटरनेट/सर्वर पर नहीं भेजी जातीं। यदि आप ब्राउज़र का डेटा
            साफ़ करें या दूसरा फ़ोन इस्तेमाल करें तो ये मिट सकती हैं — इसलिए ज़रूरी तस्वीरें
            <strong>“📥 गैलरी में सहेजें”</strong> से अपने फ़ोन की गैलरी में सुरक्षित कर लें।</p>
            <p class="my-photos-note__en">These photos stay only on this device — no one else can
            see them and they are never uploaded. They may be lost if you clear your browser data
            or switch phones, so use <strong>“📥 Save to gallery”</strong> to keep important ones
            permanently in your phone's Photos.</p>
          </div>
        </div>

        <div class="my-photos-actions">
          <button type="button" class="my-photos-add">
            <span aria-hidden="true">＋</span> फ़ोटो जोड़ें / Add photo
          </button>
          <input type="file" accept="image/*" multiple class="my-photos-input" hidden>
        </div>

        <p class="my-photos-empty">अभी तक कोई तस्वीर नहीं जोड़ी गई। ऊपर “फ़ोटो जोड़ें” दबाएँ।<br>
          <span class="my-photos-note__en">No photos yet — tap “Add photo” above.</span></p>
        <div class="my-photos-grid"></div>
      </div>
    `;

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
