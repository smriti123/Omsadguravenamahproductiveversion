(() => {
  const storageKey = "satsang-local-library-v1";
  const progressStorageKey = "satsang-listening-progress-v1";
  const playlistThumbnailStorageKey = "satsang-playlist-thumbnails-v1";
  const recentLimit = 5;
  const progressSaveIntervalMs = 10000;
  let renderScheduled = false;
  let youtubeApiPromise = null;
  let activePlayer = null;
  let activeSession = null;
  let activeSaveTimer = null;
  const defaultDevotionalImage = "/assets/swamiji-new-portrait-PXN53uw1.jpg";
  const customRamayanaPlaylistId = "PLgy41qSqQO41ofxQ1igZ2JjJNNsX96B2n";
  const customRamayanaPlaylistUrl =
    `https://www.youtube.com/playlist?list=${customRamayanaPlaylistId}`;
  const customBhagwatamPlaylistId = "PLgy41qSqQO43D930r7EMtCfqS60nzT1FB";
  const customBhagwatamPlaylistUrl =
    `https://www.youtube.com/watch?v=Fxkh34i9KVU&list=${customBhagwatamPlaylistId}`;

  function readLibrary() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return value && typeof value === "object" ? value : {};
    } catch {
      return {};
    }
  }

  function writeLibrary(library) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(library));
      return true;
    } catch {
      return false;
    }
  }

  function readProgressList() {
    try {
      const value = JSON.parse(localStorage.getItem(progressStorageKey) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function writeProgressList(items) {
    try {
      localStorage.setItem(progressStorageKey, JSON.stringify(items));
      return true;
    } catch {
      return false;
    }
  }

  function parsePlaylistInfo(urlValue) {
    try {
      const url = new URL(urlValue, location.href);
      const playlistId = url.searchParams.get("list");
      if (!playlistId) return null;

      const rawIndex =
        url.searchParams.get("index") ||
        url.searchParams.get("start_radio") ||
        "0";
      const parsedIndex = Number.parseInt(rawIndex, 10);
      const videoIndex = Number.isFinite(parsedIndex) && parsedIndex > 0
        ? parsedIndex - 1
        : 0;

      return {
        playlistId,
        videoId: url.searchParams.get("v") || "",
        videoIndex,
      };
    } catch {
      return null;
    }
  }

  function parseVideoInfo(urlValue) {
    try {
      const url = new URL(urlValue, location.href);
      let videoId = url.searchParams.get("v") || "";
      if (!videoId && url.hostname.includes("youtu.be")) {
        videoId = url.pathname.split("/").filter(Boolean)[0] || "";
      }
      if (!videoId && url.pathname.includes("/embed/")) {
        videoId = url.pathname.split("/embed/")[1]?.split(/[/?#]/)[0] || "";
      }
      return videoId ? { videoId } : null;
    } catch {
      return null;
    }
  }

  function getYouTubeThumbnail(videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  function firstText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function readPlaylistThumbnails() {
    try {
      const value = JSON.parse(localStorage.getItem(playlistThumbnailStorageKey) || "{}");
      return value && typeof value === "object" ? value : {};
    } catch {
      return {};
    }
  }

  function writePlaylistThumbnails(items) {
    try {
      localStorage.setItem(playlistThumbnailStorageKey, JSON.stringify(items));
    } catch {
      // Thumbnail cache is only a performance hint.
    }
  }

  function cleanYouTubeThumbnail(urlValue) {
    const value = firstText(urlValue);
    if (!value) return "";
    try {
      const url = new URL(value);
      return url.href;
    } catch {
      return "";
    }
  }

  function resolvePlaylistThumbnail(info, onResolved) {
    if (!info?.playlistId || info.videoId) return;

    const cache = readPlaylistThumbnails();
    const cached = cleanYouTubeThumbnail(cache[info.playlistId]);
    if (cached) {
      onResolved(cached);
      return;
    }

    const sourceUrl = info.url || info.youtubeUrl;
    if (!sourceUrl) return;

    const endpoint =
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(sourceUrl)}`;
    fetch(endpoint)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const thumbnail = cleanYouTubeThumbnail(data?.thumbnail_url);
        if (!thumbnail) return;
        const latest = readPlaylistThumbnails();
        latest[info.playlistId] = thumbnail;
        writePlaylistThumbnails(latest);
        onResolved(thumbnail);
      })
      .catch(() => {
        // If YouTube blocks the lookup, keep the existing fallback image.
      });
  }

  function talkImage(card, media) {
    const customImage =
      firstText(card.dataset.customImage) ||
      firstText(card.dataset.talkCustomImage) ||
      firstText(card.dataset.devotionalImage);
    const explicitThumbnail =
      firstText(card.dataset.thumbnail) ||
      firstText(card.dataset.talkThumbnail);
    const cardImage = firstText(card.querySelector("img")?.getAttribute("src"));
    const youtubeThumbnail = media?.videoId ? getYouTubeThumbnail(media.videoId) : "";

    return {
      customImage,
      thumbnail: explicitThumbnail || youtubeThumbnail || cardImage,
      image:
        customImage ||
        explicitThumbnail ||
        youtubeThumbnail ||
        cardImage ||
        defaultDevotionalImage,
    };
  }

  function sanitizeIndex(value) {
    const index = Number.parseInt(value, 10);
    return Number.isFinite(index) && index >= 0 ? index : 0;
  }

  function sanitizeSeconds(value) {
    const seconds = Math.floor(Number(value));
    return Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  }

  function formatTime(totalSeconds) {
    const seconds = sanitizeSeconds(totalSeconds);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainder = seconds % 60;
    const two = (number) => String(number).padStart(2, "0");
    if (hours > 0) return `${hours}:${two(minutes)}:${two(remainder)}`;
    return `${minutes}:${two(remainder)}`;
  }

  function latestProgress() {
    return readProgressList()
      .filter((item) => item && item.playlistId && sanitizeSeconds(item.seconds) >= 5)
      .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))[0] || null;
  }

  function saveProgress(record) {
    if (!record?.playlistId || sanitizeSeconds(record.seconds) < 5) return false;

    // Local-only listening progress: this is stored only in this browser, never sent to a server.
    const cleanRecord = {
      playlistId: record.playlistId,
      playlistTitle: record.playlistTitle || "",
      videoIndex: sanitizeIndex(record.videoIndex),
      videoNumber: sanitizeIndex(record.videoIndex) + 1,
      videoId: record.videoId || "",
      videoTitle: record.videoTitle || "",
      seconds: sanitizeSeconds(record.seconds),
      updatedAt: Number(record.updatedAt) || Date.now(),
    };

    const withoutSamePlaylist = readProgressList().filter(
      (item) => item?.playlistId !== cleanRecord.playlistId,
    );
    const nextItems = [cleanRecord, ...withoutSamePlaylist]
      .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
      .slice(0, recentLimit);
    const saved = writeProgressList(nextItems);
    if (saved) scheduleRender();
    return saved;
  }

  function talkIdFromUrl(urlValue) {
    try {
      const url = new URL(urlValue, location.href);
      const videoId = url.searchParams.get("v");
      const playlistId = url.searchParams.get("list");
      if (videoId) return `video:${videoId}`;
      if (playlistId) return `playlist:${playlistId}`;
      return `url:${url.href}`;
    } catch {
      return `url:${urlValue}`;
    }
  }

  function talkInfo(card) {
    const headingTitle = card.querySelector("h3")?.textContent.trim();
    const title =
      firstText(card.dataset.talkTitle) || headingTitle || "YouTube talk";
    const category =
      card.dataset.talkCategory ||
      Array.from(card.querySelectorAll("span"))
        .find((span) => span.className.includes("bg-secondary"))
        ?.textContent.trim() || "Satsang";
    const url = card.href;
    const playlist = parsePlaylistInfo(url);
    const video = parseVideoInfo(url);
    const media = {
      videoId: card.dataset.videoId || video?.videoId || playlist?.videoId || "",
      playlistId: card.dataset.playlistId || playlist?.playlistId || "",
      youtubeUrl: url,
    };
    const images = talkImage(card, media);
    const description =
      firstText(card.dataset.description) ||
      firstText(card.dataset.talkDescription) ||
      firstText(card.querySelector("div.flex-1 > p")?.textContent);

    return {
      id: talkIdFromUrl(url),
      title,
      category,
      url,
      ...media,
      ...images,
      description,
    };
  }

  function categoryGlyph(category) {
    const glyphs = {
      Ramayana: "\u0930\u093E\u092E",
      "Bhagwat Geeta": "\u0917\u0940\u0924\u093E",
      Bhagwatam: "\u092D\u093E\u0917",
      Upanishads: "\u0950",
      "Prakaran Granth": "\u0917\u094D\u0930",
      Others: "\u2726",
      Satsang: "\u0950",
    };
    return glyphs[category] || "\u0950";
  }

  function normalizedStatus(record) {
    if (["not_started", "partial", "listened"].includes(record?.status)) {
      return record.status;
    }
    return record?.listened ? "listened" : "not_started";
  }

  function ensureRecord(library, info) {
    const current = library[info.id] || {};
    library[info.id] = {
      status: normalizedStatus(current),
      note: typeof current.note === "string" ? current.note : "",
      lastOpenedAt: Number(current.lastOpenedAt) || 0,
      title: info.title,
      category: info.category,
      url: info.url,
    };
    return library[info.id];
  }

  function markOpened(info) {
    const library = readLibrary();
    const record = ensureRecord(library, info);
    if (record.status !== "listened") record.status = "partial";
    record.lastOpenedAt = Date.now();
    writeLibrary(library);
    scheduleRender();
  }

  function stopCardNavigation(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function loadYouTubeApi() {
    if (window.YT?.Player) return Promise.resolve(window.YT);
    if (youtubeApiPromise) return youtubeApiPromise;

    youtubeApiPromise = new Promise((resolve) => {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previousReady === "function") previousReady();
        resolve(window.YT);
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.append(script);
      }
    });

    return youtubeApiPromise;
  }

  function closePlayer() {
    saveActiveProgress();
    window.clearInterval(activeSaveTimer);
    activeSaveTimer = null;
    activeSession = null;
    if (activePlayer?.destroy) activePlayer.destroy();
    activePlayer = null;
    document.querySelector("#satsang-player-dialog")?.remove();
    document.body.style.overflow = "";
  }

  function saveActiveProgress() {
    if (!activePlayer || !activeSession) return;

    let seconds = 0;
    let videoIndex = activeSession.videoIndex;
    let videoId = activeSession.videoId || "";
    let videoTitle = "";

    try {
      seconds = activePlayer.getCurrentTime?.() || 0;
      const playerIndex = activePlayer.getPlaylistIndex?.();
      if (Number.isFinite(playerIndex) && playerIndex >= 0) videoIndex = currentPlaylistIndex();
      const data = activePlayer.getVideoData?.() || {};
      videoId = data.video_id || videoId;
      videoTitle = data.title || "";
    } catch {
      return;
    }

    saveProgress({
      playlistId: activeSession.playlistId,
      playlistTitle: activeSession.playlistTitle,
      videoIndex,
      videoId,
      videoTitle,
      seconds,
      updatedAt: Date.now(),
    });
  }

  function syncTimerForState(state) {
    updatePlayerControls();

    if (state === window.YT?.PlayerState?.PLAYING) {
      window.clearInterval(activeSaveTimer);
      activeSaveTimer = window.setInterval(saveActiveProgress, progressSaveIntervalMs);
      saveActiveProgress();
      return;
    }

    if (
      state === window.YT?.PlayerState?.PAUSED ||
      state === window.YT?.PlayerState?.ENDED
    ) {
      saveActiveProgress();
      window.clearInterval(activeSaveTimer);
      activeSaveTimer = null;
    }
  }

  function currentPlaylistItems() {
    try {
      const items = activePlayer?.getPlaylist?.();
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  }

  function currentPlaylistIndex() {
    try {
      const index = activePlayer?.getPlaylistIndex?.();
      if (!Number.isFinite(index) || index < 0) return sanitizeIndex(activeSession?.videoIndex);

      if (activeSession && activeSession.playerIndexBase == null) {
        activeSession.playerIndexBase =
          activeSession.videoIndex > 0 && index === 0 ? activeSession.videoIndex : 0;
      }

      return sanitizeIndex((activeSession?.playerIndexBase || 0) + index);
    } catch {
      return sanitizeIndex(activeSession?.videoIndex);
    }
  }

  function playlistListCount() {
    const items = currentPlaylistItems();
    const actualCount = items.length;
    const currentIndex = currentPlaylistIndex();
    const base = sanitizeIndex(activeSession?.playerIndexBase);
    if (actualCount <= 0) return currentIndex + 1;
    if (base <= 0) return actualCount;

    try {
      const videoId = activePlayer?.getVideoData?.()?.video_id || "";
      if (videoId && items[base] === videoId) return actualCount;
      if (videoId && items[0] === videoId) return actualCount + base;
    } catch {
      // Fall through to the conservative count below.
    }

    return actualCount < base ? actualCount + base : actualCount;
  }

  function loadPlaylistIndex(index, startSeconds = 0) {
    if (!activePlayer || !activeSession) return;
    const cleanIndex = sanitizeIndex(index);
    saveActiveProgress();
    activeSession.videoIndex = cleanIndex;
    activeSession.playerIndexBase = null;
    activeSession.videoId = "";
    activePlayer.loadPlaylist({
      listType: "playlist",
      list: activeSession.playlistId,
      index: cleanIndex,
      startSeconds: sanitizeSeconds(startSeconds),
    });
    window.setTimeout(updatePlayerControls, 700);
  }

  function updatePlayerControls() {
    const dialog = document.querySelector("#satsang-player-dialog");
    if (!dialog || !activeSession) return;

    const index = currentPlaylistIndex();
    activeSession.videoIndex = index;

    const data = activePlayer?.getVideoData?.() || {};
    const currentVideoTitle = firstText(data.title);
    const label = dialog.querySelector(".satsang-current-talk");
    if (label) label.textContent = "प्रवचन सूची";

    if (currentVideoTitle) {
      const title = dialog.querySelector("#satsang-player-title");
      if (title) title.textContent = currentVideoTitle;

      const devotionalTitle = dialog.querySelector(".satsang-devotional-copy h4");
      if (devotionalTitle) devotionalTitle.textContent = currentVideoTitle;
    }

    const previous = dialog.querySelector(".satsang-prev-talk");
    if (previous) previous.disabled = index <= 0;

    const list = dialog.querySelector(".satsang-talk-list");
    if (list && !list.hidden) renderTalkList();
  }

  function renderTalkList() {
    const dialog = document.querySelector("#satsang-player-dialog");
    const list = dialog?.querySelector(".satsang-talk-list");
    if (!list || !activeSession) return;

    const count = playlistListCount();
    const current = currentPlaylistIndex();
    list.replaceChildren();

    if (currentPlaylistItems().length === 0) {
      const loading = document.createElement("p");
      loading.className = "satsang-talk-list-loading";
      loading.textContent = "प्रवचन सूची लोड हो रही है...";
      list.append(loading);
      window.setTimeout(() => {
        if (!list.hidden) renderTalkList();
      }, 900);
      return;
    }

    for (let index = 0; index < count; index += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "satsang-talk-list-item";
      button.textContent = `प्रवचन ${index + 1}`;
      button.setAttribute("aria-current", index === current ? "true" : "false");
      button.addEventListener("click", () => loadPlaylistIndex(index, 0));
      list.append(button);
    }
  }

  function updateDevotionalStatus(dialog) {
    if (!dialog || !activeSession?.info) return;
    const library = readLibrary();
    const record = ensureRecord(library, activeSession.info);
    const partial = dialog.querySelector(".satsang-devotional-partial");
    const listened = dialog.querySelector(".satsang-devotional-listened");
    const notes = dialog.querySelector(".satsang-devotional-notes");
    const partialActive = record.status === "partial";
    const listenedActive = record.status === "listened";
    partial?.classList.toggle("is-active", partialActive);
    listened?.classList.toggle("is-active", listenedActive);
    notes?.classList.toggle("has-note", Boolean(record.note));
    partial?.setAttribute("aria-pressed", String(partialActive));
    listened?.setAttribute("aria-pressed", String(listenedActive));
  }

  function setStatusForInfo(info, status) {
    const library = readLibrary();
    const record = ensureRecord(library, info);
    record.status = record.status === status ? "not_started" : status;
    writeLibrary(library);
    scheduleRender();
    updateDevotionalStatus(document.querySelector("#satsang-player-dialog"));
  }

  function createPlayerDialog(info, playlistId) {
    closePlayer();

    const dialog = document.createElement("div");
    dialog.id = "satsang-player-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "satsang-player-title");
    dialog.innerHTML = `
      <div class="satsang-player-panel">
        <div class="satsang-player-top">
          <div>
            <p class="satsang-player-kicker">सत्संग श्रवण</p>
            <div class="satsang-player-title-row">
              <img class="satsang-player-title-thumb" alt="" loading="lazy">
              <h3 id="satsang-player-title"></h3>
            </div>
          </div>
          <button type="button" class="satsang-player-close" aria-label="Close">&times;</button>
        </div>
        <div id="satsang-youtube-player"></div>
        <section class="satsang-devotional-context" aria-label="Devotional context">
          <img class="satsang-devotional-image" alt="" loading="lazy">
          <div class="satsang-devotional-copy">
            <p class="satsang-devotional-kicker"></p>
            <h4></h4>
            <p class="satsang-devotional-note"></p>
            <div class="satsang-devotional-actions" aria-label="Listening status">
              <button type="button" class="satsang-devotional-status satsang-devotional-partial" aria-pressed="false">
                <span aria-hidden="true">●</span>
                <span>Partially listened</span>
              </button>
              <button type="button" class="satsang-devotional-status satsang-devotional-listened" aria-pressed="false">
                <span aria-hidden="true">✓</span>
                <span>Listened</span>
              </button>
              <button type="button" class="satsang-devotional-status satsang-devotional-notes">
                <span aria-hidden="true">✎</span>
                <span>Manan</span>
              </button>
            </div>
          </div>
        </section>
        <div class="satsang-player-controls" aria-label="प्रवचन नियंत्रण">
          <button type="button" class="satsang-prev-talk">◀ पिछला</button>
          <button type="button" class="satsang-toggle-list satsang-current-talk" aria-expanded="false">प्रवचन सूची</button>
          <button type="button" class="satsang-next-talk">अगला ▶</button>
        </div>
        <div class="satsang-talk-list" hidden></div>
        <p class="satsang-progress-note">🙏 सुनने के बाद, YouTube पर 👍 Like व 💬 Comment से प. पू. स्वामीजी के प्रति कृतज्ञता व्यक्त कर सकते हैं</p>
        <a class="satsang-youtube-open" target="_blank" rel="noopener noreferrer">YouTube पर खोलें</a>
      </div>
    `;
    dialog.querySelector("h3").textContent = info?.title || "सत्संग";
    dialog.querySelector(".satsang-player-close").textContent = "\u00d7";
    dialog.querySelector(".satsang-player-title-thumb").src =
      info?.thumbnail || info?.image || defaultDevotionalImage;
    dialog.querySelector(".satsang-devotional-image").src = info?.image || defaultDevotionalImage;
    dialog.querySelector(".satsang-devotional-image").alt = info?.title || "";
    dialog.querySelector(".satsang-devotional-kicker").textContent = info?.category || "Satsang";
    dialog.querySelector(".satsang-devotional-copy h4").textContent = info?.title || "Satsang";
    dialog.querySelector(".satsang-devotional-note").textContent =
      info?.description || "Keep the YouTube player visible above while listening.";
    dialog.querySelector(".satsang-youtube-open").href = playlistId
      ? `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`
      : info?.url || info?.youtubeUrl || "#";
    dialog.querySelector(".satsang-player-close").addEventListener("click", closePlayer);
    dialog.querySelector(".satsang-prev-talk").addEventListener("click", () => {
      const nextIndex = Math.max(0, currentPlaylistIndex() - 1);
      loadPlaylistIndex(nextIndex, 0);
    });
    dialog.querySelector(".satsang-next-talk").addEventListener("click", () => {
      loadPlaylistIndex(currentPlaylistIndex() + 1, 0);
    });
    dialog.querySelector(".satsang-toggle-list").addEventListener("click", (event) => {
      const button = event.currentTarget;
      const list = dialog.querySelector(".satsang-talk-list");
      const willOpen = list.hidden;
      list.hidden = !willOpen;
      button.setAttribute("aria-expanded", String(willOpen));
      button.textContent = willOpen ? "प्रवचन सूची छुपाएँ" : "प्रवचन सूची";
      if (willOpen) renderTalkList();
    });
    dialog.querySelector(".satsang-devotional-partial").addEventListener("click", () => {
      if (activeSession?.info) setStatusForInfo(activeSession.info, "partial");
    });
    dialog.querySelector(".satsang-devotional-listened").addEventListener("click", () => {
      if (activeSession?.info) setStatusForInfo(activeSession.info, "listened");
    });
    dialog.querySelector(".satsang-devotional-notes").addEventListener("click", () => {
      if (activeSession?.info) openNotesForInfo(activeSession.info);
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closePlayer();
    });

    document.body.append(dialog);
    document.body.style.overflow = "hidden";
    updateDevotionalStatus(dialog);
    return dialog;
  }

  function openPlaylistPlayer(options) {
    const playlistId = options?.playlistId;
    if (!playlistId) return false;

    const videoIndex = sanitizeIndex(options.videoIndex);
    const seconds = sanitizeSeconds(options.seconds);
    const playlistTitle = options.playlistTitle || options.title || "सत्संग";

    const info = options.info || {
      id: `playlist:${playlistId}`,
      title: playlistTitle,
      category: options.category || "Satsang",
      url: `https://www.youtube.com/playlist?list=${playlistId}`,
      playlistId,
      videoId: options.videoId || "",
      image: options.image || defaultDevotionalImage,
      description: options.description || "",
    };

    createPlayerDialog(info, playlistId);
    activeSession = {
      playlistId,
      playlistTitle,
      videoIndex,
      playerIndexBase: null,
      videoId: options.videoId || "",
      info,
    };
    updateDevotionalStatus(document.querySelector("#satsang-player-dialog"));

    loadYouTubeApi().then((YT) => {
      activePlayer = new YT.Player("satsang-youtube-player", {
        width: "100%",
        height: "100%",
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            event.target.loadPlaylist({
              listType: "playlist",
              list: playlistId,
              index: videoIndex,
              startSeconds: seconds,
            });
            window.setTimeout(updatePlayerControls, 900);
          },
          onStateChange: (event) => syncTimerForState(event.data),
        },
      });
    });

    return true;
  }

  function openPlaylistFromCard(card) {
    const playlist = parsePlaylistInfo(card.href);
    if (!playlist) return false;

    const info = talkInfo(card);
    markOpened(info);
    return openPlaylistPlayer({
      ...playlist,
      playlistTitle: info.title,
      title: info.title,
      info,
    });
  }

  function openVideoPlayer(options) {
    const videoId = options?.videoId;
    if (!videoId) return false;

    const title = options.title || "Satsang";
    const info = options.info || {
      id: `video:${videoId}`,
      title,
      category: options.category || "Satsang",
      url: options.url || `https://www.youtube.com/watch?v=${videoId}`,
      videoId,
      image: options.image || getYouTubeThumbnail(videoId),
      description: options.description || "",
    };

    createPlayerDialog(info, "");
    activeSession = {
      playlistId: "",
      playlistTitle: title,
      videoIndex: 0,
      playerIndexBase: null,
      videoId,
      info,
    };
    updateDevotionalStatus(document.querySelector("#satsang-player-dialog"));

    const controls = document.querySelector(".satsang-player-controls");
    const toggle = document.querySelector(".satsang-toggle-list");
    const list = document.querySelector(".satsang-talk-list");
    if (controls) controls.hidden = true;
    if (toggle) toggle.hidden = true;
    if (list) list.hidden = true;

    loadYouTubeApi().then((YT) => {
      activePlayer = new YT.Player("satsang-youtube-player", {
        width: "100%",
        height: "100%",
        videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            const startSeconds = sanitizeSeconds(options.seconds);
            if (startSeconds > 0) event.target.seekTo(startSeconds, true);
          },
          onStateChange: (event) => syncTimerForState(event.data),
        },
      });
    });
    return true;
  }

  function openVideoFromCard(card) {
    const video = parseVideoInfo(card.href);
    if (!video) return false;

    const info = talkInfo(card);
    markOpened(info);
    return openVideoPlayer({
      ...video,
      title: info.title,
      category: info.category,
      url: info.url,
      info,
    });
  }

  // Exposed so other overlays (e.g. the Satsang search) can open the SAME
  // in-app player instead of sending the visitor out to YouTube. Returns true
  // if the integrated player opened; false lets the caller fall back to YouTube.
  function playByUrl(url, meta) {
    if (!url) return false;
    meta = meta || {};
    const title = meta.title || "सत्संग";
    const category = meta.category || "Satsang";
    const playlist = parsePlaylistInfo(url);
    if (playlist && playlist.playlistId) {
      return openPlaylistPlayer({
        ...playlist,
        playlistTitle: title,
        title,
        category,
      });
    }
    const video = parseVideoInfo(url);
    if (video && video.videoId) {
      return openVideoPlayer({ ...video, title, category, url });
    }
    return false;
  }
  window.SatsangPlayer = window.SatsangPlayer || {};
  window.SatsangPlayer.playByUrl = playByUrl;

  function actionButton(className, label, symbol) {
    const button = document.createElement("span");
    button.className = `talk-action ${className}`;
    button.setAttribute("role", "button");
    button.setAttribute("tabindex", "0");
    button.setAttribute("aria-label", label);
    button.title = label;
    button.textContent = symbol;
    button.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      button.click();
    });
    return button;
  }

  function playTalk(event) {
    stopCardNavigation(event);
    const card = event.currentTarget.closest("a.group");
    if (!card) return;
    if (openPlaylistFromCard(card)) return;
    if (openVideoFromCard(card)) return;
    markOpened(talkInfo(card));
    window.open(card.href, "_blank", "noopener,noreferrer");
  }

  function setStatus(event, status) {
    stopCardNavigation(event);
    const card = event.currentTarget.closest("a.group");
    if (!card) return;

    setStatusForInfo(talkInfo(card), status);
  }

  function closeNotes() {
    document.querySelector("#talk-notes-dialog")?.remove();
    document.body.style.overflow = "";
  }

  function openNotes(event) {
    stopCardNavigation(event);
    const card = event.currentTarget.closest("a.group");
    if (!card) return;

    openNotesForInfo(talkInfo(card));
  }

  function openNotesForInfo(info) {
    closeNotes();
    const library = readLibrary();
    const record = ensureRecord(library, info);

    const dialog = document.createElement("div");
    dialog.id = "talk-notes-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "talk-notes-title");
    dialog.innerHTML = `
      <div class="talk-notes-panel">
        <button type="button" class="talk-notes-close" aria-label="Close">×</button>
        <p class="talk-notes-kicker">मनन नोट्स</p>
        <h3 id="talk-notes-title"></h3>
        <p class="talk-notes-category"></p>
        <textarea
          class="talk-notes-textarea"
          placeholder="इस प्रवचन से मिले विचार यहाँ लिखें…"
          aria-label="मनन नोट्स"
        ></textarea>
        <div class="talk-notes-buttons">
          <button type="button" class="talk-notes-save">Save</button>
          <button type="button" class="talk-notes-clear">Clear</button>
        </div>
        <p class="talk-notes-status" aria-live="polite"></p>
        <p class="talk-local-privacy">
          ये जानकारी केवल आपके इस डिवाइस पर सुरक्षित रहेगी। ब्राउज़र या ऐप डेटा
          मिटाने अथवा डिवाइस बदलने पर यह जानकारी खो सकती है।
        </p>
      </div>
    `;

    const textarea = dialog.querySelector("textarea");
    const statusMessage = dialog.querySelector(".talk-notes-status");
    dialog.querySelector("h3").textContent = info.title;
    dialog.querySelector(".talk-notes-category").textContent = info.category;
    textarea.value = record.note;

    dialog.querySelector(".talk-notes-close").addEventListener("click", closeNotes);
    dialog.addEventListener("click", (clickEvent) => {
      if (clickEvent.target === dialog) closeNotes();
    });

    dialog.querySelector(".talk-notes-save").addEventListener("click", () => {
      const latestLibrary = readLibrary();
      const latestRecord = ensureRecord(latestLibrary, info);
      latestRecord.note = textarea.value.trim();
      statusMessage.textContent = writeLibrary(latestLibrary)
        ? "आपके नोट्स इस डिवाइस पर सुरक्षित हैं।"
        : "इस ब्राउज़र में नोट्स सुरक्षित नहीं किए जा सके।";
      scheduleRender();
    });

    dialog.querySelector(".talk-notes-clear").addEventListener("click", () => {
      textarea.value = "";
      const latestLibrary = readLibrary();
      const latestRecord = ensureRecord(latestLibrary, info);
      latestRecord.note = "";
      writeLibrary(latestLibrary);
      statusMessage.textContent = "नोट्स हटा दिए गए हैं।";
      scheduleRender();
      textarea.focus();
    });

    document.body.append(dialog);
    document.body.style.overflow = "hidden";
    window.setTimeout(() => textarea.focus(), 0);
  }

  function updateActions(card, record) {
    const partial = card.querySelector(".talk-partial-action");
    const listened = card.querySelector(".talk-listened-action");
    const notes = card.querySelector(".talk-notes-action");

    const partialActive = record.status === "partial";
    const listenedActive = record.status === "listened";
    partial.classList.toggle("is-active", partialActive);
    listened.classList.toggle("is-active", listenedActive);
    notes.classList.toggle("has-note", Boolean(record.note));
    partial.setAttribute("aria-pressed", String(partialActive));
    listened.setAttribute("aria-pressed", String(listenedActive));
  }

  function removeOldPersonalUi() {
    document.querySelector("#satsang-personal-filters")?.remove();
    document.querySelector("#satsang-bookmarked-filter")?.remove();
    document.querySelectorAll(".talk-bookmark-button").forEach((item) => item.remove());
    document.querySelectorAll(".talk-personal-actions").forEach((item) => item.remove());
    document.querySelector("#no-personal-talks")?.remove();
    document.querySelector("#no-bookmarked-talks")?.remove();
  }

  function categoryBar() {
    return Array.from(document.querySelectorAll("#talks div")).find((element) => {
      const buttons = element.querySelectorAll(":scope > button");
      return buttons.length >= 2 && element.textContent.includes("Ramayana");
    });
  }

  function updateCategoryCount(button, addedCount) {
    if (!button || button.dataset.satsangCountAdjusted === "true") return;
    const count = button.querySelector("span");
    const countText = count?.textContent || "";
    const current = Number.parseInt(countText.match(/\d+/)?.[0] || "", 10);
    if (!count || !Number.isFinite(current)) return;
    const updated = current + addedCount;
    count.textContent = countText.includes("(") ? `(${updated})` : String(updated);
    button.dataset.satsangCountAdjusted = "true";
  }

  function updateCustomCategoryCounts(bar) {
    const buttons = Array.from(bar.querySelectorAll(":scope > button"));
    const ramayanaButton = buttons.find((button) =>
      button.textContent.includes("Ramayana"),
    );
    const bhagwatamButton = buttons.find((button) =>
      button.textContent.includes("Bhagwatam"),
    );

    updateCategoryCount(ramayanaButton, 1);
    updateCategoryCount(bhagwatamButton, 1);
  }

  function addMobileTabScrollHint(bar) {
    const shell = bar.parentElement;
    shell?.classList.add("satsang-category-scroll-shell");
    document.querySelector("#satsang-tab-scroll-hint")?.remove();
  }

  function scrollToSatsang() {
    const talks = document.querySelector("#talks");
    if (!talks) return false;
    talks.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  }

  function scheduleSatsangScroll() {
    [0, 80, 180, 420, 900].forEach((delay) => {
      window.setTimeout(scrollToSatsang, delay);
    });
  }

  function installSatsangMenuScrollFix() {
    if (document.documentElement.dataset.satsangMenuScrollFix === "true") return;
    document.documentElement.dataset.satsangMenuScrollFix = "true";

    document.addEventListener(
      "click",
      (event) => {
        const link = event.target.closest?.("a[href]");
        if (!link) return;

        let url;
        try {
          url = new URL(link.getAttribute("href"), location.href);
        } catch {
          return;
        }

        if (url.hash !== "#talks") return;
        scheduleSatsangScroll();
      },
      true,
    );

    if (location.hash === "#talks") scheduleSatsangScroll();
  }

  function enhanceTopArea() {
    const bar = categoryBar();
    if (!bar) return;
    bar.classList.add("satsang-category-scroll");
    updateCustomCategoryCounts(bar);
    addMobileTabScrollHint(bar);
    updateSatsangHeading();

    let privacy = document.querySelector("#satsang-device-privacy");
    if (!privacy) {
      privacy = document.createElement("div");
      privacy.id = "satsang-device-privacy";
      privacy.innerHTML = `
        <span aria-hidden="true"></span>
        <p>ये जानकारी केवल आपके इस डिवाइस पर सुरक्षित रहेगी।</p>
        <span aria-hidden="true"></span>
      `;
    }

    const talks = document.querySelector("#talks");
    const talksInner = talks?.querySelector(":scope > div") || talks;
    talksInner?.append(privacy);
  }

  function updateSatsangHeading() {
    const heading = document.querySelector("#talks h2");
    if (!heading || heading.dataset.satsangTitleUpdated) return;

    heading.classList.add("satsang-heading-normalized");
    heading.innerHTML = `
      <span class="satsang-main-title">
      <span class="satsang-title-prefix">सत्संग - </span>
      <span class="satsang-vani-mark" aria-hidden="true">✦</span>
      <span class="satsang-vani-special">सद्गुरु वाणी</span>
      <span class="satsang-vani-mark" aria-hidden="true">✦</span>
      </span>
    `;
    heading.dataset.satsangTitleUpdated = "true";
  }

  function updateBhajanHeading() {
    const heading = document.querySelector("#bhajans h2");
    if (!heading || heading.dataset.bhajanTitleUpdated) return;

    heading.textContent = "भजन संकीर्तन";
    heading.dataset.bhajanTitleUpdated = "true";
  }

  function bhajanDevotionFromText(text) {
    const value = String(text || "").toLowerCase();
    if (
      /\b(shri\s*)?ram(a)?\b|\braghav(a)?\b|hanuman|hanumat|sita|bhaye\s+(prakat|pragat)\s+kr[iu]pala|\u0930\u093E\u092E|\u0930\u093E\u0918\u0935|\u0938\u0940\u0924\u093E|\u0939\u0928\u0941\u092E\u093E\u0928|\u0939\u0928\u0941\u092E\u0924|\u092D\u090F\s+\u092A\u094D\u0930\u0915\u091F\s+\u0915\u0943\u092A\u093E\u0932\u093E/.test(value)
    ) {
      return "ram";
    }
    if (
      /krishna|krsna|govind|gopal|madhav|shyam|vrindavan|vasudev|bhagwate|bhagavate|namo\s+bhag[aw]ate|\u0915\u0943\u0937\u094D\u0923|\u0917\u094B\u0935\u093F\u0928\u094D\u0926|\u0917\u094B\u0935\u093F\u0902\u0926|\u0917\u094B\u092A\u093E\u0932|\u092E\u093E\u0927\u0935|\u0936\u094D\u092F\u093E\u092E|\u0935\u0943\u0928\u094D\u0926\u093E\u0935\u0928|\u0935\u0943\u0902\u0926\u093E\u0935\u0928|\u0935\u093E\u0938\u0941\u0926\u0947\u0935|\u092D\u0917\u0935\u0924\u0947|\u092D\u0917\u0935\u0924\u0947\s+\u0935\u093E\u0938\u0941\u0926\u0947\u0935\u093E\u092F/.test(value)
    ) {
      return "krishna";
    }
    if (
      /shiv|shiva|rudra|mahadev|shankar|shambhu|bhole|\u0936\u093F\u0935|\u0930\u0941\u0926\u094D\u0930|\u092E\u0939\u093E\u0926\u0947\u0935|\u0936\u0902\u0915\u0930|\u0936\u092E\u094D\u092D\u0941|\u0936\u0902\u092D\u0941|\u092D\u094B\u0932\u0947/.test(value)
    ) {
      return "shiv";
    }
    return "";
  }

  function enhanceBhajanCards() {
    document.querySelectorAll("#bhajans .grid a.group").forEach((card) => {
      const devotion = bhajanDevotionFromText(card.textContent);
      if (devotion) {
        card.dataset.bhajanDevotion = devotion;
      } else {
        delete card.dataset.bhajanDevotion;
      }
    });
  }

  function resetCustomPlaylistCard(card) {
    card.removeAttribute("style");
    card.querySelectorAll("[style]").forEach((element) => element.removeAttribute("style"));
    card.classList.remove("opacity-0");
  }

  function ensureTalkPreview(card, info) {
    card.querySelector(":scope > .talk-preview")?.remove();

    const copy = card.querySelector(":scope > div.flex-1");
    const heading = copy?.querySelector("h3");
    if (!copy || !heading) return;

    let row = copy.querySelector(":scope > .talk-title-with-thumb");
    if (!row) {
      row = document.createElement("div");
      row.className = "talk-title-with-thumb";
      copy.insertBefore(row, heading);
      row.append(heading);
    }

    let thumb = row.querySelector(".talk-identity-thumb");
    if (!thumb) {
      thumb = document.createElement("img");
      thumb.className = "talk-identity-thumb";
      thumb.alt = "";
      thumb.loading = "lazy";
      row.insertBefore(thumb, row.firstChild);
    }

    thumb.src = info?.thumbnail || info?.image || defaultDevotionalImage;
  }

  function addCustomRamayanaPlaylist() {
    const talks = document.querySelector("#talks");
    if (!talks || talks.querySelector(`[href*="${customRamayanaPlaylistId}"]`)) return;

    const cards = Array.from(talks.querySelectorAll("a.group[href]"));
    const existingKevatSlot = cards.find((card) => {
      const info = talkInfo(card);
      return (
        info.category === "Ramayana" &&
        info.title.toLowerCase().includes("shri ram valmiki samvad")
      );
    });
    const ramayanaCards = cards.filter((item) => talkInfo(item).category === "Ramayana");
    const reference = ramayanaCards[0];
    if (!reference) return;

    const card = existingKevatSlot || reference.cloneNode(true);
    resetCustomPlaylistCard(card);
    card.href = customRamayanaPlaylistUrl;
    card.dataset.talkCategory = "Ramayana";
    card.dataset.talkTitle = "\u0915\u0947\u0935\u091F \u092A\u094D\u0930\u0938\u0902\u0917";
    card.dataset.customRamayanaPlaylist = "true";
    card.removeAttribute("data-local-talk-ready");

    const title = card.querySelector("h3");
    if (title) title.textContent = card.dataset.talkTitle;

    const meta = card.querySelector("div.flex-1 > p");
    if (meta) meta.textContent = "YouTube Playlist";

    const badge = Array.from(card.querySelectorAll("span")).find((span) =>
      span.className.includes("bg-secondary") ||
      span.classList.contains("category-glyph-badge"),
    );
    if (badge) {
      badge.classList.remove("category-glyph-badge");
      badge.textContent = "Ramayana";
      badge.removeAttribute("data-category-name");
      badge.removeAttribute("aria-label");
      badge.removeAttribute("title");
    }

    card.querySelector(".talk-action-row")?.remove();

    if (existingKevatSlot) return;

    const anchor = ramayanaCards[0] || reference;
    anchor.insertAdjacentElement("afterend", card);
  }

  function addCustomBhagwatamPlaylist() {
    const talks = document.querySelector("#talks");
    if (!talks || talks.querySelector(`[href*="${customBhagwatamPlaylistId}"]`)) return;

    const cards = Array.from(talks.querySelectorAll("a.group[href]"));
    const bhagwatamCards = cards.filter((item) => talkInfo(item).category === "Bhagwatam");
    const reference = bhagwatamCards[0];
    if (!reference) return;

    const card = reference.cloneNode(true);
    resetCustomPlaylistCard(card);
    card.href = customBhagwatamPlaylistUrl;
    card.dataset.talkCategory = "Bhagwatam";
    card.dataset.talkTitle = "Bhagvad 6th Skandh/Canto Sidhbari May 2010";
    card.dataset.customBhagwatamPlaylist = "true";
    card.removeAttribute("data-local-talk-ready");

    const title = card.querySelector("h3");
    if (title) title.textContent = card.dataset.talkTitle;

    const meta = card.querySelector("div.flex-1 > p");
    if (meta) meta.textContent = "YouTube Playlist";

    const badge = Array.from(card.querySelectorAll("span")).find((span) =>
      span.className.includes("bg-secondary") ||
      span.classList.contains("category-glyph-badge"),
    );
    if (badge) {
      badge.classList.remove("category-glyph-badge");
      badge.textContent = "Bhagwatam";
      badge.removeAttribute("data-category-name");
      badge.removeAttribute("aria-label");
      badge.removeAttribute("title");
    }

    card.querySelector(".talk-action-row")?.remove();

    const anchor = bhagwatamCards[bhagwatamCards.length - 1] || reference;
    anchor.insertAdjacentElement("afterend", card);
  }

  function enhanceCards() {
    const cards = document.querySelectorAll("#talks a.group[href]");
    if (cards.length === 0) return;

    const library = readLibrary();
    let changed = false;

    cards.forEach((card) => {
      const headingTitle = card.querySelector("h3")?.textContent.trim();
      if (headingTitle && !card.dataset.talkTitle) {
        card.dataset.talkTitle = headingTitle;
      }

      const info = talkInfo(card);
      const previous = library[info.id];
      const record = ensureRecord(library, info);
      if (
        !previous ||
        previous.status !== record.status ||
        previous.title !== info.title ||
        previous.category !== info.category ||
        previous.url !== info.url
      ) {
        changed = true;
      }

      card.classList.add("talk-card-with-actions");
      card.dataset.talkCategory = info.category;
      ensureTalkPreview(card, info);

      const categoryBadge = Array.from(card.querySelectorAll("span")).find(
        (span) => span.className.includes("bg-secondary"),
      );
      if (categoryBadge && !categoryBadge.classList.contains("category-glyph-badge")) {
        categoryBadge.classList.add("category-glyph-badge");
        categoryBadge.dataset.categoryName = info.category;
        categoryBadge.textContent = categoryGlyph(info.category);
        categoryBadge.setAttribute("aria-label", info.category);
        categoryBadge.title = info.category;
      }

      if (!card.dataset.localTalkReady) {
        card.dataset.localTalkReady = "true";
        card.addEventListener("click", (event) => {
          if (event.target.closest(".talk-action-row")) return;
          if (openPlaylistFromCard(card) || openVideoFromCard(card)) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          markOpened(talkInfo(card));
        });
      }

      let row = card.querySelector(".talk-action-row");
      if (!row) {
        row = document.createElement("div");
        row.className = "talk-action-row";
        row.setAttribute("aria-label", "Listening and reflection actions");

        const play = actionButton("talk-play-action", "सुनें", "\u25B6 \u0938\u0941\u0928\u0947\u0902");
        const partial = actionButton(
          "talk-partial-action",
          "आंशिक सुना",
          "◐",
        );
        const listened = actionButton(
          "talk-listened-action",
          "सुना हुआ",
          "✓",
        );
        const notes = actionButton("talk-notes-action", "मनन नोट्स", "✎");

        play.addEventListener("click", playTalk);
        partial.addEventListener("click", (event) => setStatus(event, "partial"));
        listened.addEventListener("click", (event) =>
          setStatus(event, "listened"),
        );
        notes.addEventListener("click", openNotes);
        row.append(play, partial, listened, notes);

        const oldTrailingIcon = card.lastElementChild;
        if (oldTrailingIcon?.tagName.toLowerCase() === "svg") {
          oldTrailingIcon.remove();
        }
        card.append(row);
      }

      updateActions(card, record);
    });

    if (changed) writeLibrary(library);
  }

  function recentRecords() {
    const record = latestProgress();
    return record ? [record] : [];
  }

  function recentSection() {
    let section = document.querySelector("#recently-listened");
    if (section) return section;
    const bar = categoryBar();
    if (!bar) return null;
    section = document.createElement("section");
    section.id = "recently-listened";
    section.setAttribute("aria-labelledby", "recently-listened-title");
    bar.insertAdjacentElement("beforebegin", section);
    return section;
  }

  function renderRecent() {
    const section = recentSection();
    if (!section) return;
    const records = recentRecords();
    const signature = records
      .map(
        (record) =>
          `${record.playlistId}:${record.videoIndex}:${record.videoId}:${record.seconds}:${record.updatedAt}`,
      )
      .join("|");
    if (section.dataset.signature === signature) return;
    section.dataset.signature = signature;

    if (records.length === 0) {
      section.hidden = true;
      section.replaceChildren();
      return;
    }

    section.hidden = false;
    section.innerHTML = `
      <button type="button" class="continue-listening-card" id="recently-listened-title">
        <span class="continue-listening-main">▶ जहाँ छोड़ा था वहाँ से सुनें</span>
        <span class="continue-listening-detail"></span>
      </button>
      <p class="satsang-progress-note satsang-progress-note--compact">नोट: हाल ही में सुना गया प्रवचन केवल ऐप के अंदर सुनने पर सेव होगा।</p>
    `;

    const record = records[0];
    const detailText =
      record.videoTitle ||
      `प्रवचन ${record.videoNumber || sanitizeIndex(record.videoIndex) + 1}`;
    const button = section.querySelector(".continue-listening-card");
    button.querySelector(".continue-listening-detail").textContent =
      `${detailText} — ${formatTime(record.seconds)} से आगे`;
    button.addEventListener("click", () => {
      openPlaylistPlayer({
        playlistId: record.playlistId,
        playlistTitle: record.playlistTitle,
        videoIndex: record.videoIndex,
        videoId: record.videoId,
        seconds: record.seconds,
      });
    });
  }

  function render() {
    removeOldPersonalUi();
    installSatsangMenuScrollFix();
    enhanceTopArea();
    updateBhajanHeading();
    enhanceBhajanCards();
    addCustomRamayanaPlaylist();
    addCustomBhagwatamPlaylist();
    enhanceCards();
    renderRecent();
  }

  function scheduleRender() {
    if (renderScheduled) return;
    renderScheduled = true;
    requestAnimationFrame(() => {
      renderScheduled = false;
      render();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeNotes();
    closePlayer();
  });

  window.addEventListener("beforeunload", saveActiveProgress);

  document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(scheduleRender);
    observer.observe(document.body, { childList: true, subtree: true });
    scheduleRender();
  });
})();
