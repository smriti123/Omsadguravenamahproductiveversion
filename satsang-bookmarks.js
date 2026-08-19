(() => {
  const storageKey = "satsang-local-library-v1";
  const progressStorageKey = "satsang-listening-progress-v1";
  const playlistThumbnailStorageKey = "satsang-playlist-thumbnails-v1";
  const playlistCountStorageKey = "satsang-playlist-counts-v1";
  const recentLimit = 3;
  const progressSaveIntervalMs = 10000;
  let renderScheduled = false;
  let youtubeApiPromise = null;
  let activePlayer = null;
  let activeSession = null;
  let activeSaveTimer = null;
  let categoryViewOpen = false;
  let selectedCategoryKey = "Ramayana";
  const websiteSeriesCache = new Map();
  let websiteSeriesRequest = 0;
  let seriesCountHydrationRunning = false;
  const defaultDevotionalImage = "/assets/swamiji-new-portrait-PXN53uw1.jpg";
  const customRamayanaPlaylistId = "PLgy41qSqQO41ofxQ1igZ2JjJNNsX96B2n";
  const customRamayanaPlaylistUrl =
    `https://www.youtube.com/playlist?list=${customRamayanaPlaylistId}`;
  // Extra Bhagwatam playlists that aren't in the main talks list. Each card shows
  // its title on top and its place/year in the little pill below (like the other
  // talks) — the city/year is deliberately kept OUT of the title. Add more anytime
  // by appending { id, title, place, year } here.
  const customBhagwatamPlaylists = [
    { id: "PLgy41qSqQO43D930r7EMtCfqS60nzT1FB", title: "Bhagvad 6th Skandh/Canto", place: "Sidhbari", year: "2010" },
    { id: "PLNpiOil-BP1Q", title: "Bhagvat 1st Skandh", place: "Ghaziabad", year: "2018" },
    { id: "PLgy41qSqQO41-g4laNSNDesP8dTzsA_7E", title: "Bhagvad katha 1st Canto", place: "Jabalpur", year: "2019" },
    { id: "PLgy41qSqQO41KafYdIVVPxzUSeCJSuPUT", title: "Bhagvad katha 1st Canto", place: "Prayagraj", year: "2020" },
  ];
  const satsangAnshGroups = [
    { key: "under5", title: "5 मिनट तक", max: 5 * 60 },
    { key: "under10", title: "5–10 मिनट", min: 5 * 60, max: 10 * 60 },
    { key: "under15", title: "10–15 मिनट", min: 10 * 60, max: 15 * 60 },
    { key: "under20", title: "15–20 मिनट", min: 15 * 60, max: 20 * 60 },
    { key: "under30", title: "20–30 मिनट", min: 20 * 60, max: 30 * 60 },
    { key: "over30", title: "30 मिनट से अधिक", min: 30 * 60 },
  ];
  let satsangAnshVideos = [];
  const customSatsangPlaylists = [
    {
      id: "PLZfEqZUPNXrs",
      title: "Bhagvad Geeta Ch 18 (35 talks)",
      category: "Bhagwat Geeta",
      meta: "Sidhbari · 2005–2008 · 35 talks",
      afterId: "PLgy41qSqQO41r8ff4ae_kydqliiNLpTHo",
    },
    {
      id: "PLgy41qSqQO42A-m00YaX7toLoe3R4h05C",
      title: "Drig Drishya Vivek · July 2017",
      category: "Prakaran Granth",
      meta: "July 2017",
      position: "top",
    },
    {
      id: "PLdh1eVwY_OVQ",
      title: "Taitreya Upanishad Shiksha Valli",
      category: "Prakaran Granth",
      meta: "YouTube Playlist",
      position: "top",
    },
    {
      id: "PLOf4SJ61UrIc",
      title: "Taitreya Brahmanand Valli",
      category: "Prakaran Granth",
      meta: "YouTube Playlist",
      position: "top",
    },
    {
      id: "PLgy41qSqQO40SPrHWliuXfiBLXwHMhjLA",
      title: "Vedanta Saar · 2002–2004",
      category: "Prakaran Granth",
      meta: "2002–2004",
      position: "top",
    },
    {
      id: "PLgy41qSqQO43UDjac01cjCbEtzUPiPn7r",
      title: "Bhagvad Geeta Ch 15 · Indore",
      category: "Bhagwat Geeta",
      meta: "Indore · 2019",
      afterId: "PLZfEqZUPNXrs",
    },
    {
      id: "PLgy41qSqQO427tw1qiaKhtx4Jy6jK_LkE",
      title: "Bhagavad Geeta Introduction",
      category: "Bhagwat Geeta",
      meta: "Sidhbari · 2005–2008",
      position: "top",
    },
    {
      id: "PLgy41qSqQO40bzVIjUr9yukQc1m6PJjjQ",
      title: "Bhagvad Geeta in Practical Life",
      category: "Bhagwat Geeta",
      meta: "YouTube Playlist",
      position: "top",
    },
    {
      id: "PLQegAJFfEGb0",
      title: "Prashnopanishad",
      category: "Upanishads",
      meta: "YouTube Playlist",
    },
    {
      id: "PLS96Dj8suYdE",
      title: "Bhagvad Geeta Chapter 12",
      category: "Bhagwat Geeta",
      meta: "September 2017",
    },
    {
      videoId: "8dM5ELs3AUU",
      title: "Question & Answer",
      category: "Others",
      meta: "28 October 2018",
    },
  ];

  // A few existing talks have the city/year baked into the title. Show a clean
  // title and move the place/year into the little pill below (like the others).
  const talkTitleFixes = [
    { from: "Bhagvat Katha Day 1", title: "Bhagvad Katha · Jaipur", pill: "Jaipur · 2018 · 7 talks", href: "https://www.youtube.com/playlist?list=PLgy41qSqQO43W-9jVknI-WfVMhcZoGgY0" },
    { from: "राम कथा - १ | RAAM-KATHA - 1", title: "राम कथा - १ | RAAM-KATHA - 1 · Jaipur", pill: "Jaipur" },
    { from: "Vedanta Saar", title: "Vedanta Saar · 2021", pill: "2021" },
    { from: "Ram Charitra at Sidhbari Oct 2017", title: "Ram Charitra", pill: "Sidhbari - 2017" },
    { from: "Sadhna Panchkam Dehradun", title: "Sadhna Panchkam", pill: "Dehradun" },
    { from: "Sadhna Panchkam at Bhavnagar", title: "Sadhna Panchkam", pill: "Bhavnagar" },
    { from: "Brahmasutra 1989-1991", title: "Brahmasutra", pill: "1989-1991" },
  ];

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
      duration: sanitizeSeconds(record.duration),
      updatedAt: Number(record.updatedAt) || Date.now(),
    };

      const sameTalk = (item) => {
        if (!item || item.playlistId !== cleanRecord.playlistId) return false;
        if (cleanRecord.videoId && item.videoId) {
          return item.videoId === cleanRecord.videoId;
        }
        return sanitizeIndex(item.videoIndex) === cleanRecord.videoIndex;
      };
      const withoutSameTalk = readProgressList().filter((item) => !sameTalk(item));
      const nextItems = [cleanRecord, ...withoutSameTalk]
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
    let duration = 0;

    try {
      seconds = activePlayer.getCurrentTime?.() || 0;
      const playerIndex = activePlayer.getPlaylistIndex?.();
      if (Number.isFinite(playerIndex) && playerIndex >= 0) videoIndex = currentPlaylistIndex();
      const data = activePlayer.getVideoData?.() || {};
      videoId = data.video_id || videoId;
      videoTitle = data.title || "";
      duration = activePlayer.getDuration?.() || 0;
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
      duration,
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
    const count = playlistListCount();
    const label = dialog.querySelector(".satsang-current-talk");
    if (label) label.textContent = `${index + 1} / ${count}`;

    if (currentVideoTitle) {
      const title = dialog.querySelector("#satsang-player-title");
      if (title) title.textContent = currentVideoTitle;
      const videoId = firstText(data.video_id);
      activeSession.info = {
        ...activeSession.info,
        id: videoId ? `video:${videoId}` : `playlist:${activeSession.playlistId}:${index}`,
        title: currentVideoTitle,
        videoId,
        videoIndex: index,
        playlistId: activeSession.playlistId,
      };
    }

    const previous = dialog.querySelector(".satsang-prev-talk");
    if (previous) previous.disabled = index <= 0;
    const next = dialog.querySelector(".satsang-next-talk");
    if (next) next.disabled = index >= count - 1;
    refreshInlineManan(dialog);
    updateDevotionalStatus(dialog);
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

  function refreshInlineManan(dialog) {
    if (!dialog || !activeSession?.info) return;
    const record = ensureRecord(readLibrary(), activeSession.info);
    const textarea = dialog.querySelector(".satsang-inline-manan-text");
    if (textarea && document.activeElement !== textarea) textarea.value = record.note || "";
    const heading = dialog.querySelector(".satsang-inline-manan-title");
    if (heading) heading.textContent = activeSession.info.title || "सत्संग";
  }

  function saveInlineManan(dialog) {
    if (!dialog || !activeSession?.info) return;
    const textarea = dialog.querySelector(".satsang-inline-manan-text");
    const status = dialog.querySelector(".satsang-inline-manan-status");
    const library = readLibrary();
    const record = ensureRecord(library, activeSession.info);
    record.note = textarea?.value.trim() || "";
    const saved = writeLibrary(library);
    if (status) status.textContent = saved ? "मनन इसी उपकरण में सुरक्षित है।" : "मनन सुरक्षित नहीं हो सका।";
    scheduleRender();
    updateDevotionalStatus(dialog);
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
          <h3 id="satsang-player-title"></h3>
          <button type="button" class="satsang-player-close" aria-label="Close">&times;</button>
        </div>
        <div id="satsang-youtube-player"></div>
        <div class="satsang-player-controls" aria-label="प्रवचन नियंत्रण">
          <button type="button" class="satsang-prev-talk">◀ पिछला</button>
          <span class="satsang-current-talk"></span>
          <button type="button" class="satsang-next-talk">अगला ▶</button>
        </div>
        <div class="satsang-player-actions">
          <button type="button" class="satsang-devotional-status satsang-devotional-listened" aria-pressed="false">✓ सुना हुआ</button>
          <button type="button" class="satsang-devotional-status satsang-devotional-notes">✎ मनन</button>
        </div>
        <aside class="satsang-youtube-gratitude">
          <span aria-hidden="true">🙏</span>
          <span><strong>YouTube पर Like या Comment करके परम पूज्य स्वामीजी के प्रति कृतज्ञता व्यक्त करें।</strong><small class="satsang-gratitude-actions"><b>👍 Like</b><b>💬 Comment</b></small></span>
          <a class="satsang-youtube-open" target="_blank" rel="noopener noreferrer">YouTube पर जाएँ ↗</a>
        </aside>
        <details class="satsang-inline-manan">
          <summary>✎ मेरे मनन</summary>
          <p class="satsang-inline-manan-title"></p>
          <label for="satsang-inline-manan-text">नया मनन</label>
          <textarea id="satsang-inline-manan-text" class="satsang-inline-manan-text" rows="5" maxlength="2000" placeholder="मनन, प्रश्न या स्मरण लिखें…"></textarea>
          <button type="button" class="satsang-inline-manan-save">मनन सुरक्षित करें</button>
          <p class="satsang-inline-manan-status" aria-live="polite"></p>
          <small>मनन केवल इसी उपकरण में सुरक्षित रहता है।</small>
        </details>
      </div>
    `;
    dialog.querySelector("h3").textContent = info?.title || "सत्संग";
    dialog.querySelector(".satsang-player-close").textContent = "\u00d7";
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
    dialog.querySelector(".satsang-devotional-listened").addEventListener("click", () => {
      if (activeSession?.info) setStatusForInfo(activeSession.info, "listened");
    });
    dialog.querySelector(".satsang-devotional-notes").addEventListener("click", () => {
      const manan = dialog.querySelector(".satsang-inline-manan");
      manan.open = true;
      refreshInlineManan(dialog);
      dialog.querySelector(".satsang-inline-manan-text")?.focus();
    });
    dialog.querySelector(".satsang-inline-manan-save").addEventListener("click", () => saveInlineManan(dialog));
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closePlayer();
    });

    document.body.append(dialog);
    document.body.style.overflow = "hidden";
    refreshInlineManan(dialog);
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

  function declaredEpisodeCount(info) {
    const text = `${info?.title || ""} ${info?.description || ""}`.replace(/[\u0966-\u096f]/g, (digit) =>
      String(digit.charCodeAt(0) - 0x0966),
    );
    const explicit = text.match(/(?:\(|\b)(\d+)\s*(?:talks?|videos?|satsangs?)/i);
    if (explicit) return Number(explicit[1]) || 0;
    const fraction = text.match(/(?:part|bhag|\u092d\u093e\u0917)?\s*[\dA-Za-z]+\s*\/\s*(\d+)/i);
    return Number(fraction?.[1] || 0);
  }

  function readPlaylistCounts() {
    try {
      const value = JSON.parse(localStorage.getItem(playlistCountStorageKey) || "{}");
      return value && typeof value === "object" ? value : {};
    } catch {
      return {};
    }
  }

  function savePlaylistCount(playlistId, count) {
    if (!playlistId || !Number.isFinite(count) || count <= 0) return;
    try {
      const counts = readPlaylistCounts();
      counts[playlistId] = count;
      localStorage.setItem(playlistCountStorageKey, JSON.stringify(counts));
    } catch {
      // Count caching is optional.
    }
  }

  async function probePlaylistCount(playlistId) {
    const YT = await loadYouTubeApi();
    const host = document.createElement("div");
    host.className = "satsang-series-probe";
    const mount = document.createElement("div");
    host.append(mount);
    document.body.append(host);
    let probe;
    return new Promise((resolve) => {
      let attempts = 0;
      const finish = (count) => {
        try { probe?.destroy?.(); } catch {}
        host.remove();
        resolve(count);
      };
      const inspect = () => {
        attempts += 1;
        let items = [];
        try { items = probe?.getPlaylist?.() || []; } catch {}
        if (items.length || attempts >= 10) finish(items.length);
        else window.setTimeout(inspect, 500);
      };
      probe = new YT.Player(mount, {
        width: "2",
        height: "2",
        playerVars: { playsinline: 1, rel: 0 },
        events: {
          onReady: (event) => {
            event.target.cuePlaylist({ listType: "playlist", list: playlistId, index: 0 });
            window.setTimeout(inspect, 450);
          },
          onError: () => finish(0),
        },
      });
    });
  }

  async function hydrateVisibleSeriesCounts() {
    if (seriesCountHydrationRunning || !categoryViewOpen || selectedCategoryKey === "Satsang Ansh") return;
    const cards = Array.from(document.querySelectorAll("#talks a.group[href]"))
      .filter((card) => talkInfo(card).category === selectedCategoryKey)
      .filter((card) => {
        const playlist = parsePlaylistInfo(card.href);
        return playlist?.playlistId && !Number(card.dataset.episodeCount);
      });
    if (!cards.length) return;
    seriesCountHydrationRunning = true;
    const cached = readPlaylistCounts();
    try {
      for (const card of cards) {
        const playlistId = parsePlaylistInfo(card.href)?.playlistId;
        if (!playlistId) continue;
        const count = Number(cached[playlistId]) || await probePlaylistCount(playlistId);
        if (!count) continue;
        card.dataset.episodeCount = String(count);
        const node = card.querySelector(".series-card-count");
        if (node) node.textContent = String(count);
        savePlaylistCount(playlistId, count);
      }
    } catch {
      // Missing counts can be retried the next time this category opens.
    } finally {
      seriesCountHydrationRunning = false;
    }
  }

  function ensureSeriesScreen() {
    let screen = document.querySelector("#satsang-series-screen");
    if (screen) return screen;
    screen = document.createElement("section");
    screen.id = "satsang-series-screen";
    screen.innerHTML = `
      <header class="satsang-series-header">
        <button type="button" class="satsang-series-back">\u2190 \u0935\u093e\u092a\u093f\u0938</button>
        <div class="satsang-series-heading"><h3></h3><p></p></div>
        <span class="satsang-series-total"></span>
      </header>
      <p class="satsang-series-loading" role="status"></p>
      <div class="satsang-series-episodes"></div>
      <div class="satsang-series-probe" aria-hidden="true"></div>
    `;
    const list = document.querySelector("#talks .space-y-3");
    if (list) list.insertAdjacentElement("beforebegin", screen);
    else document.querySelector("#talks")?.append(screen);
    screen.querySelector(".satsang-series-back").addEventListener("click", () => {
      document.querySelector("#talks")?.classList.remove("satsang-series-open");
      document.querySelector("#satsang-category-detail-header")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return screen;
  }

  function episodeInfo(seriesInfo, playlistId, video, index) {
    const videoId = video?.id || "";
    const title = video?.title || `\u0938\u0924\u094d\u0938\u0902\u0917 ${index + 1}`;
    const url = videoId && playlistId
      ? `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}&index=${index + 1}`
      : videoId
        ? `https://www.youtube.com/watch?v=${videoId}`
        : `https://www.youtube.com/playlist?list=${playlistId}&index=${index + 1}`;
    return {
      id: videoId ? `video:${videoId}` : `playlist:${playlistId}:${index}`,
      title,
      category: seriesInfo.category,
      url,
      youtubeUrl: url,
      playlistId,
      videoId,
      videoIndex: index,
      image: videoId ? getYouTubeThumbnail(videoId) : seriesInfo.image,
      description: seriesInfo.title,
      duration: video?.duration,
    };
  }

  function episodeProgress(playlistId, videoId, index) {
    return readProgressList().find((item) => {
      if (!item || item.playlistId !== playlistId) return false;
      if (videoId && item.videoId) return item.videoId === videoId;
      return sanitizeIndex(item.videoIndex) === index;
    });
  }

  function renderWebsiteEpisodes(screen, seriesInfo, playlistId, videos, expectedCount) {
    const count = videos.length || expectedCount;
    screen.querySelector(".satsang-series-total").textContent = count ? String(count) : "";
    screen.querySelector(".satsang-series-loading").textContent = "";
    const episodes = screen.querySelector(".satsang-series-episodes");
    episodes.replaceChildren();

    if (!count) {
      const empty = document.createElement("p");
      empty.className = "satsang-series-empty";
      empty.textContent = "\u0938\u0924\u094d\u0938\u0902\u0917 \u0938\u0942\u091a\u0940 \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964";
      episodes.append(empty);
      return;
    }

    for (let index = 0; index < count; index += 1) {
      const video = videos[index] || { id: "", position: index };
      const info = episodeInfo(seriesInfo, playlistId, video, index);
      const progress = episodeProgress(playlistId, info.videoId, index);
      const library = readLibrary();
      const listened = normalizedStatus(library[info.id]) === "listened";
      const seconds = sanitizeSeconds(progress?.seconds);
      const duration = sanitizeSeconds(progress?.duration);
      const row = document.createElement("button");
      row.type = "button";
      row.className = "satsang-episode-row";
      const thumb = document.createElement("img");
      thumb.className = "satsang-episode-thumb";
      thumb.src = info.image || defaultDevotionalImage;
      thumb.alt = "";
      thumb.loading = "lazy";
      thumb.decoding = "async";
      const copy = document.createElement("span");
      copy.className = "satsang-episode-copy";
      const title = document.createElement("strong");
      title.textContent = info.title;
      copy.append(title);
      if (listened || seconds >= 5) {
        const status = document.createElement("small");
        status.textContent = listened ? "\u2713 \u0938\u0941\u0928\u093e \u0939\u0941\u0906" : `${formatTime(seconds)} \u0924\u0915 \u0938\u0941\u0928\u093e`;
        copy.append(status);
      } else if (video?.duration?.display) {
        const duration = document.createElement("small");
        duration.textContent = video.duration.display;
        copy.append(duration);
      }
      if (!listened && duration > seconds && seconds >= 5) {
        const track = document.createElement("span");
        track.className = "satsang-episode-progress";
        const fill = document.createElement("i");
        fill.style.width = `${Math.min(98, Math.max(4, (seconds / duration) * 100))}%`;
        track.append(fill);
        copy.append(track);
      }
      const play = document.createElement("span");
      play.className = "satsang-episode-play";
      play.setAttribute("aria-hidden", "true");
      play.textContent = listened ? "\u2713" : "\u25b6";
      row.append(thumb, copy, play);
      row.addEventListener("click", () => {
        markOpened(info);
        if (playlistId) {
          openPlaylistPlayer({
            playlistId,
            playlistTitle: seriesInfo.title,
            title: info.title,
            videoIndex: index,
            videoId: info.videoId,
            seconds,
            info,
          });
        } else {
          openVideoPlayer({ videoId: info.videoId, title: info.title, seconds, info });
        }
      });
      episodes.append(row);
    }
  }

  async function inspectWebsitePlaylist(screen, seriesInfo, playlistId, expectedCount, requestId) {
    if (websiteSeriesCache.has(playlistId)) {
      renderWebsiteEpisodes(screen, seriesInfo, playlistId, websiteSeriesCache.get(playlistId), expectedCount);
      return;
    }
    try {
      const YT = await loadYouTubeApi();
      if (requestId !== websiteSeriesRequest) return;
      const host = screen.querySelector(".satsang-series-probe");
      host.replaceChildren();
      const mount = document.createElement("div");
      host.append(mount);
      let probe;
      let attempts = 0;
      const videos = await new Promise((resolve) => {
        const finish = (ids) => {
          try { probe?.destroy?.(); } catch {}
          host.replaceChildren();
          resolve((ids || []).map((id, position) => ({ id, position })));
        };
        const inspect = () => {
          attempts += 1;
          let ids = [];
          try { ids = probe?.getPlaylist?.() || []; } catch {}
          if (ids.length || attempts >= 12) finish(ids);
          else window.setTimeout(inspect, 650);
        };
        probe = new YT.Player(mount, {
          width: "2",
          height: "2",
          playerVars: { playsinline: 1, rel: 0 },
          events: {
            onReady: (event) => {
              event.target.cuePlaylist({ listType: "playlist", list: playlistId, index: 0 });
              window.setTimeout(inspect, 500);
            },
            onError: () => finish([]),
          },
        });
      });
      if (requestId !== websiteSeriesRequest) return;
      if (videos.length) websiteSeriesCache.set(playlistId, videos);
      renderWebsiteEpisodes(screen, seriesInfo, playlistId, videos, expectedCount);
      const card = Array.from(document.querySelectorAll("#talks a.group")).find((item) =>
        parsePlaylistInfo(item.href)?.playlistId === playlistId,
      );
      const count = videos.length || expectedCount;
      if (card && count) {
        card.dataset.episodeCount = String(count);
        const countNode = card.querySelector(".series-card-count");
        if (countNode) countNode.textContent = String(count);
        savePlaylistCount(playlistId, count);
      }
    } catch {
      if (requestId === websiteSeriesRequest) {
        renderWebsiteEpisodes(screen, seriesInfo, playlistId, [], expectedCount);
      }
    }
  }

  function openWebsiteSeries(card) {
    const playlist = parsePlaylistInfo(card?.href);
    if (!playlist?.playlistId) return false;
    const info = talkInfo(card);
    const expectedCount = Number(card.dataset.episodeCount) || declaredEpisodeCount(info);
    const screen = ensureSeriesScreen();
    const categoryName = categoryPresentation[info.category]?.hi || info.category || "सत्संग संग्रह";
    screen.querySelector(".satsang-series-back").textContent = `← वापिस ${categoryName}`;
    screen.querySelector(".satsang-series-heading h3").textContent = info.title;
    screen.querySelector(".satsang-series-heading p").textContent = info.description || info.category;
    screen.querySelector(".satsang-series-total").textContent = expectedCount ? String(expectedCount) : "";
    screen.querySelector(".satsang-series-loading").textContent = "\u0938\u0924\u094d\u0938\u0902\u0917 \u0938\u0942\u091a\u0940 \u0916\u0941\u0932 \u0930\u0939\u0940 \u0939\u0948\u2026";
    renderWebsiteEpisodes(screen, info, playlist.playlistId, [], expectedCount);
    if (!websiteSeriesCache.has(playlist.playlistId)) {
      screen.querySelector(".satsang-series-loading").textContent = "\u0938\u0924\u094d\u0938\u0902\u0917 \u0938\u0942\u091a\u0940 \u0916\u0941\u0932 \u0930\u0939\u0940 \u0939\u0948\u2026";
    }
    document.querySelector("#talks")?.classList.add("satsang-series-open");
    screen.scrollIntoView({ behavior: "smooth", block: "start" });
    websiteSeriesRequest += 1;
    inspectWebsitePlaylist(screen, info, playlist.playlistId, expectedCount, websiteSeriesRequest);
    return true;
  }

  function openSatsangAnshGroup(card) {
    const key = card?.dataset.satsangAnshDuration;
    const group = satsangAnshGroups.find((item) => item.key === key);
    if (!group) return false;
    const videos = satsangAnshVideos.filter((video) => {
      const seconds = Number(video?.duration?.seconds || 0);
      if (Number.isFinite(group.min) && seconds <= group.min) return false;
      if (Number.isFinite(group.max) && seconds > group.max) return false;
      return seconds > 0;
    });
    const screen = ensureSeriesScreen();
    const info = { title: group.title, category: "Satsang Ansh", image: defaultDevotionalImage };
    screen.querySelector(".satsang-series-back").textContent = "← वापिस सत्संग-अंश";
    screen.querySelector(".satsang-series-heading h3").textContent = group.title;
    screen.querySelector(".satsang-series-heading p").textContent = "सत्संग-अंश";
    screen.querySelector(".satsang-series-loading").textContent = "";
    renderWebsiteEpisodes(screen, info, "", videos, videos.length);
    document.querySelector("#talks")?.classList.add("satsang-series-open");
    screen.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
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

  function actionButton(className, label, symbol, word) {
    const button = document.createElement("span");
    button.className = `talk-action ${className}`;
    button.setAttribute("role", "button");
    button.setAttribute("tabindex", "0");
    button.setAttribute("aria-label", label);
    button.title = label;
    if (word) {
      // Icon + a tiny word beneath it, so the meaning is clear on phones (where the
      // desktop-only `title` tooltip never shows).
      button.classList.add("talk-action--labeled");
      const icon = document.createElement("span");
      icon.className = "talk-action__icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = symbol;
      const text = document.createElement("span");
      text.className = "talk-action__word";
      text.textContent = word;
      button.append(icon, text);
    } else {
      button.textContent = symbol;
    }
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
    if (openWebsiteSeries(card)) return;
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

    let state = card.querySelector(".talk-listening-state");
    if (!state) {
      state = document.createElement("div");
      state.className = "talk-listening-state";
      const copy = document.createElement("span");
      copy.className = "talk-listening-state__copy";
      const track = document.createElement("span");
      track.className = "talk-listening-state__track";
      track.innerHTML = '<span class="talk-listening-state__fill"></span>';
      state.append(copy, track);
      card.append(state);
    }

    const info = talkInfo(card);
    const progress = readProgressList()
      .filter((item) => {
        if (!item) return false;
        if (info.playlistId) return item.playlistId === info.playlistId;
        return Boolean(info.videoId && item.videoId === info.videoId);
      })
      .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))[0];
    const copy = state.querySelector(".talk-listening-state__copy");
    const track = state.querySelector(".talk-listening-state__track");
    const fill = state.querySelector(".talk-listening-state__fill");
    const heardSeconds = sanitizeSeconds(progress?.seconds);
    const duration = sanitizeSeconds(progress?.duration);

    state.hidden = true;
    track.hidden = true;
    state.classList.toggle("is-listened", listenedActive);
    if (listenedActive) {
      state.hidden = false;
      const label = "\u2713 \u0938\u0941\u0928\u093e \u0939\u0941\u0906";
      if (copy.textContent !== label) copy.textContent = label;
    } else if (heardSeconds >= 5) {
      state.hidden = false;
      const label = `${formatTime(heardSeconds)} \u0924\u0915 \u0938\u0941\u0928\u093e`;
      if (copy.textContent !== label) copy.textContent = label;
      if (duration > heardSeconds) {
        track.hidden = false;
        fill.style.width = `${Math.min(98, Math.max(4, (heardSeconds / duration) * 100))}%`;
      }
    }
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
    updateCategoryCount(bhagwatamButton, customBhagwatamPlaylists.length);
    const customCounts = customSatsangPlaylists.reduce((counts, playlist) => {
      counts[playlist.category] = (counts[playlist.category] || 0) + 1;
      return counts;
    }, {});
    Object.entries(customCounts).forEach(([category, count]) => {
      const button = buttons.find((item) =>
        item.textContent.includes(category),
      );
      updateCategoryCount(button, count);
    });
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
    document.querySelector("#sadguru-vani-full-list")?.remove();
    enhanceVerticalCategories(bar);

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

  const categoryPresentation = {
    Ramayana: { hi: "\u0930\u093e\u092e\u093e\u092f\u0923", image: "/assets/category-covers/ramcharitmanas.jfif" },
    "Bhagwat Geeta": { hi: "\u092d\u0917\u0935\u0926\u094d\u0917\u0940\u0924\u093e", image: "/assets/category-covers/bhagavad-geeta.webp" },
    Bhagwatam: { hi: "\u092d\u093e\u0917\u0935\u0924\u092e\u094d", image: "/assets/category-covers/bhagwatam.webp" },
    Upanishads: { hi: "\u0909\u092a\u0928\u093f\u0937\u0926\u094d" },
    "Prakaran Granth": { hi: "\u092a\u094d\u0930\u0915\u0930\u0923 \u0917\u094d\u0930\u0928\u094d\u0925" },
    Others: { hi: "\u0905\u0928\u094d\u092f" },
    "Satsang Ansh": { hi: "\u0938\u0924\u094d\u0938\u0902\u0917-\u0905\u0902\u0936" },
  };

  function enhanceVerticalCategories(bar) {
    const shell = bar.parentElement;
    shell?.classList.add("satsang-category-list-shell");

    let heading = document.querySelector("#satsang-collection-heading");
    if (!heading) {
      heading = document.createElement("h3");
      heading.id = "satsang-collection-heading";
      heading.textContent = "\u0938\u0924\u094d\u0938\u0902\u0917 \u0938\u0902\u0917\u094d\u0930\u0939";
      shell?.insertAdjacentElement("beforebegin", heading);
    }

    if (!bar.querySelector('[data-satsang-category="Satsang Ansh"]')) {
      const reference = bar.querySelector(":scope > button");
      if (reference) {
        const button = reference.cloneNode(false);
        button.type = "button";
        button.dataset.satsangCategory = "Satsang Ansh";
        const count = document.createElement("span");
        count.textContent = String(satsangAnshVideos.length);
        button.append(count);
        bar.append(button);
      }
    }

    Array.from(bar.querySelectorAll(":scope > button")).forEach((button) => {
      if (!button.dataset.satsangCategory) {
        const key = Object.keys(categoryPresentation).find((name) =>
          button.textContent.includes(name),
        );
        if (!key) return;
        button.dataset.satsangCategory = key;
      }

      const key = button.dataset.satsangCategory;
      const presentation = categoryPresentation[key];
      if (!presentation) return;
      if (button.querySelector(".satsang-category-row__title")) {
        if (key === "Satsang Ansh") {
          const count = button.querySelector(".satsang-category-row__count");
          if (count) count.textContent = String(satsangAnshVideos.length);
        }
        return;
      }
      const countText = button.querySelector("span")?.textContent.match(/\d+/)?.[0] || "";
      button.classList.add("satsang-category-row");
      button.replaceChildren();

      const title = document.createElement("span");
      title.className = "satsang-category-row__title";
      title.textContent = presentation.hi;
      const keyText = document.createElement("span");
      keyText.className = "satsang-category-row__key";
      keyText.textContent = key;
      const count = document.createElement("span");
      count.className = "satsang-category-row__count";
      count.textContent = countText;
      const arrow = document.createElement("span");
      arrow.className = "satsang-category-row__arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "\u203a";
      if (presentation.image) {
        const image = document.createElement("img");
        image.className = "satsang-category-row__image";
        image.src = presentation.image;
        image.alt = "";
        image.loading = "lazy";
        button.append(image);
      }
      button.append(title, keyText, count, arrow);

      if (!button.dataset.verticalCategoryReady) {
        button.dataset.verticalCategoryReady = "true";
        button.addEventListener("click", () => {
          selectedCategoryKey = key;
          categoryViewOpen = true;
          document.querySelector("#talks")?.classList.add("satsang-category-open");
          window.setTimeout(scheduleRender, 0);
        });
      }
    });

    let detail = document.querySelector("#satsang-category-detail-header");
    if (!detail) {
      detail = document.createElement("div");
      detail.id = "satsang-category-detail-header";
      detail.innerHTML = `
        <button type="button" class="satsang-category-back">\u2190 \u0935\u093e\u092a\u093f\u0938</button>
        <h3></h3>
        <span class="satsang-category-detail-count"></span>
      `;
      const list = document.querySelector("#talks .space-y-3");
      if (list) list.insertAdjacentElement("beforebegin", detail);
      else shell?.insertAdjacentElement("afterend", detail);
      detail.querySelector("button").addEventListener("click", () => {
        categoryViewOpen = false;
        document.querySelector("#talks")?.classList.remove("satsang-category-open");
        heading?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }

    const categoryButtons = Array.from(bar.querySelectorAll(":scope > button"));
    const active = categoryButtons.find(
      (button) => button.dataset.satsangCategory === selectedCategoryKey,
    ) || categoryButtons.find((button) =>
      button.className.includes("bg-primary") ||
      button.getAttribute("aria-selected") === "true",
    );
    const activeKey = active?.dataset.satsangCategory || selectedCategoryKey;
    const presentation = categoryPresentation[activeKey] || categoryPresentation.Ramayana;
    const detailTitle = detail.querySelector("h3");
    if (detailTitle.textContent !== presentation.hi) detailTitle.textContent = presentation.hi;
    const detailCount = detail.querySelector(".satsang-category-detail-count");
    const countText = active?.querySelector(".satsang-category-row__count")?.textContent || "";
    if (detailCount.textContent !== countText) detailCount.textContent = countText;
    document.querySelector("#talks")?.classList.toggle("satsang-category-open", categoryViewOpen);
  }

  function ensureSadguruVaniLink() {
    const talks = document.querySelector("#talks");
    const container = talks?.querySelector(".container") || talks;
    if (!container) return;

    let link = document.querySelector("#sadguru-vani-full-list");
    if (!link) {
      link = document.createElement("a");
      link.id = "sadguru-vani-full-list";
      link.className = "sadguru-vani-full-list";
      link.href = "/sadguru-vani/#home";
      link.setAttribute("aria-label", "Open the complete Sadguru Vani talk list");
      link.innerHTML = `
        <span class="sadguru-vani-full-list__icon" aria-hidden="true">\u0950</span>
        <span class="sadguru-vani-full-list__copy">
          <strong>\u0938\u092d\u0940 \u0938\u0924\u094d\u0938\u0902\u0917 \u0938\u0941\u0928\u0947\u0902</strong>
          <small>\u092c\u0921\u093c\u0947 \u0905\u0915\u094d\u0937\u0930\u094b\u0902 \u092e\u0947\u0902 \u0938\u0930\u0932 \u0938\u0942\u091a\u0940</small>
        </span>
        <span class="sadguru-vani-full-list__arrow" aria-hidden="true">\u2192</span>
      `;
    }

    if (!link.isConnected) {
      const tabs = container.querySelector(".mb-7.overflow-x-auto");
      const header = container.querySelector(".mb-8.text-center");
      if (tabs) tabs.insertAdjacentElement("beforebegin", link);
      else if (header) header.insertAdjacentElement("afterend", link);
      else container.prepend(link);
    }
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

  function removeSeriesPreview(card) {
    card.querySelector(":scope > .talk-preview")?.remove();
    card.querySelector(":scope > div:first-child:not(.flex-1)")?.remove();
    const row = card.querySelector(".talk-title-with-thumb");
    if (!row) return;
    const heading = row.querySelector("h3");
    const copy = row.parentElement;
    if (heading && copy) copy.insertBefore(heading, row);
    row.remove();
  }

  function ensureSeriesThumbnail(card, info) {
    removeSeriesPreview(card);
    let image = card.querySelector(":scope > .series-youtube-thumb");
    if (!image) {
      image = document.createElement("img");
      image.className = "series-youtube-thumb";
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      card.prepend(image);
    }
    const direct = firstText(card.dataset.thumbnail) ||
      (info?.videoId ? getYouTubeThumbnail(info.videoId) : "");
    if (direct) {
      image.src = direct;
      image.hidden = false;
    } else {
      image.hidden = true;
    }
    resolvePlaylistThumbnail(info, (thumbnail) => {
      if (!image.isConnected) return;
      image.src = thumbnail;
      image.hidden = false;
      card.dataset.thumbnail = thumbnail;
    });
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
    if (!talks) return;

    const cards = Array.from(talks.querySelectorAll("a.group[href]"));
    const bhagwatamCards = cards.filter(
      (item) => talkInfo(item).category === "Bhagwatam",
    );
    const reference = bhagwatamCards[0];
    if (!reference) return;

    let anchor = bhagwatamCards[bhagwatamCards.length - 1] || reference;

    customBhagwatamPlaylists.forEach((playlist) => {
      const existing = talks.querySelector(`a.group[href*="${playlist.id}"]`);
      if (existing) {
        anchor = existing; // already added — keep inserting after it, in order
        return;
      }

      const card = reference.cloneNode(true);
      resetCustomPlaylistCard(card);
      card.href = `https://www.youtube.com/playlist?list=${playlist.id}`;
      card.dataset.talkCategory = "Bhagwatam";
      card.dataset.talkTitle = playlist.title;
      card.dataset.customBhagwatamPlaylist = "true";
      card.removeAttribute("data-local-talk-ready");

      const title = card.querySelector("h3");
      if (title) title.textContent = playlist.title;

      // Place + year live in the little pill below the title (not in the title).
      const meta = card.querySelector("div.flex-1 > p");
      if (meta) {
        const cityYear = [playlist.place, playlist.year]
          .filter(Boolean)
          .join(" - ");
        meta.textContent = cityYear || "YouTube Playlist";
      }

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

      anchor.insertAdjacentElement("afterend", card);
      anchor = card;
    });
  }

  function addCustomSatsangPlaylists() {
    const talks = document.querySelector("#talks");
    if (!talks) return;

    customSatsangPlaylists.forEach((playlist) => {
      const mediaId = playlist.id || playlist.videoId;
      if (!mediaId || talks.querySelector(`a.group[href*="${mediaId}"]`)) return;

      const categoryCards = Array.from(talks.querySelectorAll("a.group[href]"))
        .filter((card) => talkInfo(card).category === playlist.category);
      const reference = categoryCards[0];
      const anchor = categoryCards[categoryCards.length - 1];
      if (!reference || !anchor) return;

      const card = reference.cloneNode(true);
      resetCustomPlaylistCard(card);
      card.href = playlist.id
        ? `https://www.youtube.com/playlist?list=${playlist.id}`
        : `https://www.youtube.com/watch?v=${playlist.videoId}`;
      card.dataset.talkCategory = playlist.category;
      card.dataset.talkTitle = playlist.title;
      card.dataset.customSatsangTalk = "true";
      card.removeAttribute("data-local-talk-ready");

      const title = card.querySelector("h3");
      if (title) title.textContent = playlist.title;

      const meta = card.querySelector("div.flex-1 > p");
      if (meta) meta.textContent = playlist.meta || "YouTube Playlist";

      const badge = Array.from(card.querySelectorAll("span")).find((span) =>
        span.className.includes("bg-secondary") ||
        span.classList.contains("category-glyph-badge"),
      );
      if (badge) {
        badge.classList.remove("category-glyph-badge");
        badge.textContent = playlist.category;
        badge.removeAttribute("data-category-name");
        badge.removeAttribute("aria-label");
        badge.removeAttribute("title");
      }

      card.querySelector(".talk-action-row")?.remove();
      if (playlist.afterId) {
        const afterCard = talks.querySelector(`a.group[href*="${playlist.afterId}"]`);
        (afterCard || anchor).insertAdjacentElement("afterend", card);
      } else if (playlist.position === "top") {
        reference.insertAdjacentElement("beforebegin", card);
      } else {
        anchor.insertAdjacentElement("afterend", card);
      }
    });
  }

  function addSatsangAnshSeries() {
    const talks = document.querySelector("#talks");
    const list = talks?.querySelector(".space-y-3");
    const reference = list?.querySelector("a.group[href]");
    if (!talks || !list || !reference) return;

    satsangAnshGroups.forEach((group) => {
      const count = satsangAnshVideos.filter((video) => {
        const seconds = Number(video?.duration?.seconds || 0);
        if (Number.isFinite(group.min) && seconds <= group.min) return false;
        if (Number.isFinite(group.max) && seconds > group.max) return false;
        return seconds > 0;
      }).length;
      let card = list.querySelector(`a[data-satsang-ansh-duration="${group.key}"]`);
      if (!card) {
        card = reference.cloneNode(true);
        resetCustomPlaylistCard(card);
        card.href = "#satsang-ansh";
        card.dataset.talkCategory = "Satsang Ansh";
        card.dataset.talkTitle = group.title;
        card.dataset.satsangAnshDuration = group.key;
        delete card.dataset.thumbnail;
        delete card.dataset.talkThumbnail;
        card.removeAttribute("data-local-talk-ready");
        const title = card.querySelector("h3");
        if (title) title.textContent = group.title;
        const meta = card.querySelector("div.flex-1 > p");
        if (meta) meta.textContent = "सत्संग-अंश";
        card.querySelector(".talk-action-row")?.remove();
        list.append(card);
      }
      card.dataset.episodeCount = String(count);
      const firstVideo = satsangAnshVideos.find((video) => {
        const seconds = Number(video?.duration?.seconds || 0);
        if (Number.isFinite(group.min) && seconds <= group.min) return false;
        if (Number.isFinite(group.max) && seconds > group.max) return false;
        return seconds > 0;
      });
      if (firstVideo?.id) card.dataset.thumbnail = getYouTubeThumbnail(firstVideo.id);
      const countNode = card.querySelector(".series-card-count");
      if (countNode) countNode.textContent = String(count);
    });

    const customOpen = selectedCategoryKey === "Satsang Ansh";
    Array.from(list.querySelectorAll(":scope > a.group[href]")).forEach((card) => {
      const isAnsh = Boolean(card.dataset.satsangAnshDuration);
      const shouldHide = customOpen ? !isAnsh : isAnsh;
      if (card.hidden !== shouldHide) card.hidden = shouldHide;
    });
  }

  function applyTalkTitleFixes() {
    const talks = document.querySelector("#talks");
    if (!talks) return;
    talks.querySelectorAll("a.group[href]").forEach((card) => {
      const heading = card.querySelector("h3");
      if (!heading) return;
      const fix = talkTitleFixes.find(
        (item) => heading.textContent.trim() === item.from,
      );
      if (!fix) return;
      heading.textContent = fix.title;
      card.dataset.talkTitle = fix.title;
      if (fix.href) card.href = fix.href;
      const meta = card.querySelector("div.flex-1 > p");
      if (meta) meta.textContent = fix.pill;
    });
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
      const isNavigableSeries = Boolean(info.playlistId || card.dataset.satsangAnshDuration);
      if (isNavigableSeries) ensureSeriesThumbnail(card, info);
      else ensureTalkPreview(card, info);

      if (isNavigableSeries) {
        let end = card.querySelector(".series-card-end");
        if (!end) {
          end = document.createElement("span");
          end.className = "series-card-end";
          const count = document.createElement("span");
          count.className = "series-card-count";
          const arrow = document.createElement("span");
          arrow.className = "series-card-chevron";
          arrow.setAttribute("aria-hidden", "true");
          arrow.textContent = "\u203a";
          end.append(count, arrow);
          card.append(end);
        }
        const cachedCount = Number(readPlaylistCounts()[info.playlistId]);
        const count = Number(card.dataset.episodeCount) || declaredEpisodeCount(info) || cachedCount;
        if (count) {
          card.dataset.episodeCount = String(count);
          end.querySelector(".series-card-count").textContent = String(count);
        }
        card.querySelector(":scope > svg")?.remove();
      }

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
          if (openSatsangAnshGroup(card) || openWebsiteSeries(card) || openVideoFromCard(card)) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          markOpened(talkInfo(card));
        });
      }

      // The series screen is navigation only. Playback belongs to the
      // individual-talk screen opened from this card.
      if (isNavigableSeries) {
        card.querySelector(".talk-action-row")?.remove();
        card.querySelector(".talk-listening-state")?.remove();
        return;
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
          "आंशिक",
        );
        const listened = actionButton(
          "talk-listened-action",
          "सुना हुआ",
          "✓",
          "सुना",
        );
        const notes = actionButton("talk-notes-action", "मनन नोट्स", "✎", "मनन");

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
    window.setTimeout(hydrateVisibleSeriesCounts, 0);
  }

  function recentRecords() {
    return readProgressList()
      .filter((item) => item && item.playlistId && sanitizeSeconds(item.seconds) >= 5)
      .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
      .slice(0, recentLimit);
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
    section.replaceChildren();

    const openRecord = (record) => {
      openPlaylistPlayer({
        playlistId: record.playlistId,
        playlistTitle: record.playlistTitle,
        videoIndex: record.videoIndex,
        videoId: record.videoId,
        seconds: record.seconds,
      });
    };
    const talkLabel = (record) =>
      record.videoTitle ||
      `प्रवचन ${record.videoNumber || sanitizeIndex(record.videoIndex) + 1}`;

    const primary = document.createElement("button");
    primary.type = "button";
    primary.className = "continue-listening-card";
    primary.id = "recently-listened-title";

    const primaryMain = document.createElement("span");
    primaryMain.className = "continue-listening-main";
    primaryMain.textContent = "▶ Resume last talk";

    const primaryDetail = document.createElement("span");
    primaryDetail.className = "continue-listening-detail";
    primaryDetail.textContent =
      `${talkLabel(records[0])} — from ${formatTime(records[0].seconds)}`;

    primary.append(primaryMain, primaryDetail);
    primary.addEventListener("click", () => openRecord(records[0]));
    section.append(primary);

    if (records.length > 1) {
      const historyHeader = document.createElement("div");
      historyHeader.className = "satsang-history-header";

      const heading = document.createElement("h3");
      heading.className = "satsang-history-title";
      heading.textContent = "Recently listened";

      const clear = document.createElement("button");
      clear.type = "button";
      clear.className = "satsang-history-clear";
      clear.textContent = "Clear history";
      clear.addEventListener("click", () => {
        try {
          localStorage.removeItem(progressStorageKey);
        } catch {
          // Listening history is optional; the player remains unaffected.
        }
        section.dataset.signature = "";
        renderRecent();
      });

      historyHeader.append(heading, clear);
      section.append(historyHeader);

      const list = document.createElement("div");
      list.className = "satsang-history-list";
      records.slice(1).forEach((record) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "satsang-history-item";

        const title = document.createElement("span");
        title.className = "satsang-history-item-title";
        title.textContent = talkLabel(record);

        const detail = document.createElement("span");
        detail.className = "satsang-history-item-detail";
        const playlist = record.playlistTitle
          ? `${record.playlistTitle} · `
          : "";
        detail.textContent = `${playlist}from ${formatTime(record.seconds)}`;

        item.append(title, detail);
        item.addEventListener("click", () => openRecord(record));
        list.append(item);
      });
      section.append(list);
    }

    const note = document.createElement("p");
    note.className = "satsang-progress-note satsang-progress-note--compact";
    note.textContent = "Listening history is saved on this device only.";
    section.append(note);
  }

  function render() {
    removeOldPersonalUi();
    installSatsangMenuScrollFix();
    addSatsangAnshSeries();
    enhanceTopArea();
    updateBhajanHeading();
    enhanceBhajanCards();
    addCustomRamayanaPlaylist();
    addCustomBhagwatamPlaylist();
    addCustomSatsangPlaylists();
    enhanceCards();
    applyTalkTitleFixes();
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

  async function loadSatsangAnshData() {
    try {
      const response = await fetch("/data/excerpts-playlist-fallback.json");
      if (!response.ok) return;
      const data = await response.json();
      satsangAnshVideos = (data.videos || []).filter(
        (video) => video?.id && video?.title && Number(video?.duration?.seconds || 0) > 0,
      );
      scheduleRender();
    } catch {
      // The rest of the Satsang catalogue remains available offline.
    }
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
    loadSatsangAnshData();
  });
})();
