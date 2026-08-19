(() => {
  "use strict";

  const DATA_URL = "../data/satsang-talks.json?v=9";
  const ANSH_DATA_URL = "../data/excerpts-playlist-fallback.json";
  const BHAJAN_DATA_URL = "./data/bhajans.json";
  const STORAGE_KEY = "sadguru-vani-youtube-v2";
  const INSTALL_DISMISSED_KEY = "sadguru-vani-v2-install-dismissed";
  const categories = [
    { key: "Ramayana", hi: "रामायण", en: "Ramayana", symbol: "राम", icon: "🏹", tint: "#f7e2c6" },
    { key: "Bhagwatam", hi: "भागवतम्", en: "Bhagwatam", symbol: "श्री", icon: "🪷", tint: "#f1dfda" },
    { key: "Bhagwat Geeta", hi: "भगवद्गीता", en: "Bhagavad Gita", symbol: "गीता", icon: "☀", tint: "#f6e8b9" },
    { key: "Upanishads", hi: "उपनिषद्", en: "Upanishads", symbol: "ॐ", icon: "ॐ", tint: "#e0ead7" },
    { key: "Prakaran Granth", hi: "प्रकरण ग्रन्थ", en: "Prakarana Grantha", symbol: "बोध", icon: "▤", tint: "#dfE6ef" },
    { key: "Others", hi: "अन्य", en: "Other Talks", symbol: "ज्ञान", icon: "✦", tint: "#eadff0" },
    { key: "Bhajan", hi: "भजन", en: "Bhajan", symbol: "भजन", icon: "♫", tint: "#f2e5d2" },
    { key: "Satsang Ansh", hi: "सत्संग-अंश", en: "Satsang Ansh", symbol: "अंश", icon: "", tint: "#f2e5d2" },
  ];
  const anshDurationGroups = [
    { key: "under5", hi: "5 मिनट तक", en: "Up to 5 minutes", max: 5 * 60 },
    { key: "under10", hi: "5–10 मिनट", en: "5–10 minutes", min: 5 * 60, max: 10 * 60 },
    { key: "under15", hi: "10–15 मिनट", en: "10–15 minutes", min: 10 * 60, max: 15 * 60 },
    { key: "under20", hi: "15–20 मिनट", en: "15–20 minutes", min: 15 * 60, max: 20 * 60 },
    { key: "under30", hi: "20–30 मिनट", en: "20–30 minutes", min: 20 * 60, max: 30 * 60 },
    { key: "over30", hi: "30 मिनट से अधिक", en: "Over 30 minutes", min: 30 * 60 },
  ];
  const bhajanGroups = [
    { key: "ram", hi: "श्री राम भजन", en: "Shri Ram Bhajans" },
    { key: "krishna", hi: "श्री कृष्ण भजन", en: "Shri Krishna Bhajans" },
    { key: "general", hi: "More", en: "More" },
  ];

  let talks = [];
  let satsangAnsh = [];
  let bhajans = [];
  let activeCategory = "all";
  let activeAnshDuration = "";
  let activeBhajanGroup = "";
  let activeLibraryTab = "contemplation";
  let playerList = [];
  let playerIndex = -1;
  let activeSeries = null;
  const episodeCache = new Map();
  const knownEpisodes = new Map();
  let deferredInstall = null;
  let youtubeApiPromise = null;
  const bhajanDurationRequests = new Map();
  let activeMainPlayer = null;
  let progressTimer = null;
  let playerReturnHash = "#home";
  let searchReturnHash = "#home";
  let pendingMananSeconds = null;
  let playerRequestId = 0;
  let store = readStore();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js", { scope: "./", updateViaCache: "none" }).catch(() => {}));
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstall = event;
    const button = document.querySelector("#installButton");
    if (button && !localStorage.getItem(INSTALL_DISMISSED_KEY)) {
      button.hidden = false;
      const dismiss = document.querySelector("#dismissInstallButton");
      if (dismiss) dismiss.hidden = false;
      button.dataset.hi = "Install App";
      button.dataset.en = "Install App";
      button.textContent = "Install App";
      button.setAttribute("aria-label", store.language === "en" ? "Install Sadguru Vani" : "सद्गुरु वाणी इंस्टॉल करें");
    }
  });

  function isStandaloneApp() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  window.addEventListener("appinstalled", () => {
    const button = document.querySelector("#installButton");
    if (button) button.hidden = true;
    const dismiss = document.querySelector("#dismissInstallButton");
    if (dismiss) dismiss.hidden = true;
  });

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function readStore() {
    try {
      const value = { contemplation: {}, notes: {}, mananNotes: {}, progress: {}, history: [], language: "hi", ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
      let migrated = false;
      Object.entries(value.notes || {}).forEach(([id, note]) => {
        if (!String(note || "").trim() || value.mananNotes[id]?.length) return;
        value.mananNotes[id] = [{ id: `legacy-${Date.now()}`, text: String(note).trim(), seconds: null, createdAt: Date.now(), migrated: true }];
        migrated = true;
      });
      if (migrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      return value;
    } catch {
      return { contemplation: {}, notes: {}, mananNotes: {}, progress: {}, history: [], language: "hi" };
    }
  }

  function saveStore() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch {}
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }

  function talkId(talk) {
    const url = String(talk.youtubeUrl || "");
    const video = url.match(/[?&]v=([^&]+)/)?.[1];
    const list = url.match(/[?&]list=([^&]+)/)?.[1];
    const source = video ? `v:${video}` : list ? `p:${list}` : "talk";
    return `${source}|${talk.title}`;
  }

  function playlistId(talk) {
    return String(talk?.youtubeUrl || "").match(/[?&]list=([^&]+)/)?.[1] || "";
  }

  function declaredEpisodeCount(talk) {
    if (Number(talk?.episodeCount) > 0) return Number(talk.episodeCount);
    const title = String(talk?.title || "");
    const match = title.match(/\((\d+)\s*videos?\)|(?:part|भाग)\s*\S*\/?(\d+)/i) || title.match(/\/(\d+)\b/);
    return Number(match?.[1] || match?.[2] || 0);
  }

  function toDevanagariNumber(value) {
    return String(value).replace(/\d/g, (digit) => "०१२३४५६७८९"[Number(digit)]);
  }

  function localizeGeneratedTitle(value) {
    const title = String(value || "");
    if (store.language === "en") return title;
    return title
      .replace(/^Bhagavad\s+Geeta\s+Introduction$/i, "भगवद्गीता परिचय")
      .replace(/\bBhagavad\s+Geeta\s+(?:Ch|Chapter)\s*(\d+)\b/gi, (_, chapter) => `भगवद्गीता अध्याय ${toDevanagariNumber(chapter)}`)
      .replace(/\bBhagwat\s+Geeta\s+(?:Ch|Chapter)\s*(\d+)\b/gi, (_, chapter) => `भगवद्गीता अध्याय ${toDevanagariNumber(chapter)}`)
      .replace(/सत्संग\s+(\d+)\b/g, (_, number) => `सत्संग ${toDevanagariNumber(number)}`);
  }

  function displaySeriesTitle(talk) {
    const title = String(talk?.title || "").replace(/\s*\(\s*\d+\s+videos?\s*\)\s*$/i, "").trim();
    return localizeGeneratedTitle(title);
  }

  function displayTalkTitle(talk) {
    const title = store.language === "en" && talk?.titleEn ? talk.titleEn : talk?.title || "";
    return localizeGeneratedTitle(title);
  }

  function anshAsTalk(item) {
    return {
      title: item.title,
      category: "Satsang Ansh",
      youtubeUrl: `https://www.youtube.com/watch?v=${item.id}`,
      duration: item.duration,
      thumbnail: item.thumbnail,
      parentTitle: item.sourcePlaylistTitle || "सत्संग-अंश",
      isEpisode: true,
      isAnsh: true,
    };
  }

  function matchesAnshDuration(talk, group) {
    const seconds = Number(talk?.duration?.seconds || 0);
    if (Number.isFinite(group.min) && seconds <= group.min) return false;
    if (Number.isFinite(group.max) && seconds > group.max) return false;
    return seconds > 0;
  }

  function anshDurationLabel(group) {
    return store.language === "en" ? group.en : group.hi;
  }

  function bhajanGroupFor(talk) {
    const text = `${talk?.title || ""} ${talk?.titleEn || ""}`.toLowerCase();
    if (/राम|रामचरित|विभीषण|अयोध्या|प्रगट कृपाला|\bram|ramcharit|vibhishan|ayodhya|pragat kripala/.test(text)) return "ram";
    if (/कृष्ण|गोविंद|वासुदेव|भगवद गीता|krishna|govind|vasudev|bhagavad gita/.test(text)) return "krishna";
    return "general";
  }

  function bhajanGroupLabel(key) {
    const group = bhajanGroups.find((item) => item.key === key);
    return store.language === "en" ? group?.en : group?.hi;
  }

  function countLabel(count, englishSingular, englishPlural, hindiLabel) {
    return store.language === "en" ? `${count} ${count === 1 ? englishSingular : englishPlural}` : `${toDevanagariNumber(count)} ${hindiLabel}`;
  }

  function categoryInfo(key) {
    return categories.find((item) => item.key === key) || categories[categories.length - 1];
  }

  function categoryLabel(key) {
    const item = categoryInfo(key);
    return store.language === "en" ? item.en : item.hi;
  }

  function metaText(talk) {
    const parentTitle = talk.category === "Bhajan" ? categoryLabel("Bhajan") : talk.parentTitle ? displaySeriesTitle({ title: talk.parentTitle }) : "";
    const year = String(talk.year || "").replace(/(\d)\s*-\s*(\d)/g, "$1–$2");
    return [parentTitle, talk.location, year].filter(Boolean).join(" · ") || (store.language === "en" ? "Satsang" : "सत्संग");
  }

  function statusOf(talk) {
    return store.progress[talkId(talk)]?.status || "new";
  }

  function statusLabel(status) {
    if (status === "listened") return store.language === "en" ? "✓ Listened" : "✓ सुना हुआ";
    if (status === "partial") return store.language === "en" ? "Continue" : "जारी रखें";
    return "";
  }

  function formatTime(seconds) {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}` : `${minutes}:${String(secs).padStart(2, "0")}`;
  }

  function formatNoteDate(timestamp) {
    if (!timestamp) return "";
    try { return new Date(timestamp).toLocaleDateString(store.language === "en" ? "en-GB" : "hi-IN", { day: "numeric", month: "long" }); }
    catch { return ""; }
  }

  function durationSeconds(talk) {
    return Number(store.progress[talkId(talk)]?.duration || talk?.duration?.seconds || 0);
  }

  function rowPresentation(talk) {
    const id = talkId(talk);
    const progress = store.progress[id] || {};
    const status = progress.status || "new";
    const duration = durationSeconds(talk);
    const elapsed = Number(progress.seconds || 0);
    const details = [];
    if (status === "listened") {
      details.push(store.language === "en" ? "✓ Listened" : "✓ सुना हुआ");
    } else if (status === "partial") {
      if (elapsed) details.push(store.language === "en" ? `Listened until ${formatTime(elapsed)}` : `${formatTime(elapsed)} तक सुना`);
    }
    const isCurrent = playerIndex >= 0 && talkId(playerList[playerIndex]) === id;
    return {
      status,
      isCurrent,
      details: details.join(" · "),
      hasManan: Boolean(store.contemplation[id] || store.mananNotes[id]?.length),
      ratio: status === "partial" && duration ? Math.min(100, Math.max(2, elapsed / duration * 100)) : 0,
    };
  }

  function talkSnapshot(talk) {
    return { title: talk.title, titleEn: talk.titleEn, location: talk.location, year: talk.year, category: talk.category, youtubeUrl: talk.youtubeUrl, duration: talk.duration, parentTitle: talk.parentTitle, isEpisode: talk.isEpisode };
  }

  function youtubeEmbed(url, autoplay = true) {
    try {
      const parsed = new URL(url);
      const video = parsed.searchParams.get("v") || (parsed.hostname.includes("youtu.be") ? parsed.pathname.slice(1) : "");
      const list = parsed.searchParams.get("list");
      const index = parsed.searchParams.get("index");
      const params = new URLSearchParams({ rel: "0", playsinline: "1", autoplay: autoplay ? "1" : "0" });
      if (list) params.set("list", list);
      if (index) params.set("index", index);
      if (video) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video)}?${params}`;
      if (list) {
        const playlistParams = new URLSearchParams({ list, rel: "0", autoplay: autoplay ? "1" : "0" });
        if (index) playlistParams.set("index", index);
        return `https://www.youtube-nocookie.com/embed/videoseries?${playlistParams}`;
      }
    } catch {}
    return "";
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  function updateOnlineStatus() {
    $("#offlineNotice").hidden = navigator.onLine;
  }

  function updateInterfaceLanguage() {
    const language = store.language === "en" ? "en" : "hi";
    document.documentElement.lang = language;
    $$(`[data-${language}]`).forEach((element) => { element.textContent = element.dataset[language]; });
    $("#searchInput").placeholder = language === "en" ? "Search by name, place, year or subject…" : "नाम, स्थान, वर्ष या विषय खोजें…";
    $("#clearSearch").setAttribute("aria-label", language === "en" ? "Clear search" : "खोज मिटाएँ");
    $("#globalSearchInput").placeholder = language === "en" ? "Search by name, place, year or subject…" : "नाम, स्थान, वर्ष या विषय खोजें…";
    $("#clearGlobalSearch").setAttribute("aria-label", language === "en" ? "Clear search" : "खोज मिटाएँ");
    $$("[data-open-search]").forEach((button) => button.setAttribute("aria-label", language === "en" ? "Open global satsang search" : "वैश्विक सत्संग खोज खोलें"));
  }

  function renderCategories() {
    const grid = $("#categoryGrid");
    grid.innerHTML = categories.map((category) => {
      const count = category.key === "Satsang Ansh" ? satsangAnsh.length : category.key === "Bhajan" ? bhajans.length : talks.filter((talk) => talk.category === category.key).length;
      return `<button class="category-card" type="button" data-category="${escapeHtml(category.key)}">
        <h3>${store.language === "en" ? category.en : category.hi}</h3><span class="category-count" aria-label="${count}">${store.language === "en" ? count : toDevanagariNumber(count)}</span><span class="row-chevron" aria-hidden="true">›</span>
      </button>`;
    }).join("");
  }

  function usefulStatus(talk) {
    const progress = store.progress[talkId(talk)];
    if (progress?.status === "listened") return statusLabel("listened");
    if (progress?.status === "partial") return `${statusLabel("partial")}${progress.seconds ? ` · ${formatTime(progress.seconds)}` : ""}`;
    return "";
  }

  function seriesRow(talk) {
    const id = talkId(talk);
    const count = declaredEpisodeCount(talk);
    const details = [talk.location, talk.year].filter(Boolean).join(" · ") || (store.language === "en" ? "Satsang" : "सत्संग");
    return `<button class="series-row" type="button" data-series="${escapeHtml(id)}" data-talk-id="${escapeHtml(id)}">
      <span class="series-row-copy"><strong>${escapeHtml(displaySeriesTitle(talk))}</strong><span>${escapeHtml(details)}</span></span>
      ${count ? `<span class="series-count">${count}</span>` : ""}
      <span class="row-chevron" aria-hidden="true">›</span>
    </button>`;
  }

  function talkCard(talk, list, index) {
    const id = talkId(talk);
    const state = rowPresentation(talk);
    const action = playlistId(talk) && !talk.isEpisode ? `data-series="${escapeHtml(id)}"` : `data-play="${escapeHtml(id)}"`;
    const isSeries = playlistId(talk) && !talk.isEpisode;
    const isBhajan = talk.category === "Bhajan";
    const isKrishnaCollection = isBhajan && /श्रीकृष्ण भक्ति भजन|shri krishna bhakti bhajan/i.test(`${talk.title || ""} ${talk.titleEn || ""}`);
    const bhajanDuration = talk?.duration?.display || (durationSeconds(talk) ? formatTime(durationSeconds(talk)) : "");
    const secondary = isBhajan
      ? (isKrishnaCollection ? (store.language === "en" ? "Collection" : "संग्रह") : bhajanDuration)
      : [categoryLabel(talk.category), metaText(talk)].join(" · ");
    const row = `<button class="simple-talk-row ${isSeries ? "" : `is-${state.status}${state.isCurrent ? " is-current" : ""}`}" type="button" ${action} data-talk-id="${escapeHtml(id)}">
      <span><strong>${escapeHtml(isSeries ? displaySeriesTitle(talk) : displayTalkTitle(talk))}</strong>${secondary ? `<small>${escapeHtml(secondary)}</small>` : ""}${!isSeries && state.details ? `<small class="useful-status">${escapeHtml(state.details)}</small>` : ""}${!isSeries && state.hasManan ? `<small class="row-manan">✎ ${store.language === "en" ? "Manan" : "मनन"}</small>` : ""}${!isSeries && state.ratio ? `<span class="row-progress" aria-hidden="true"><i style="width:${state.ratio}%"></i></span>` : ""}</span>
      <span class="row-chevron ${isSeries ? "" : "quiet-play"}" aria-hidden="true">${isSeries ? "›" : state.status === "listened" ? "✓" : "▶"}</span>
    </button>`;
    return isSeries ? row : `<div class="v2-talk-actions">${row}<button class="v2-manan-button" type="button" data-v2-manan="${escapeHtml(id)}">✎ <span>${store.language === "en" ? "Manan" : "मनन"}</span></button></div>`;
  }

  function filteredTalks() {
    if (activeCategory === "Satsang Ansh") return satsangAnsh;
    if (activeCategory === "Bhajan") return bhajans;
    return talks.filter((talk) => {
      const categoryMatch = activeCategory === "all" || talk.category === activeCategory;
      return categoryMatch;
    });
  }

  function renderCatalogue() {
    renderCategories();
    const allVisible = filteredTalks();
    const visible = activeCategory === "Bhajan" && activeBhajanGroup ? allVisible.filter((talk) => bhajanGroupFor(talk) === activeBhajanGroup) : allVisible;
    $("#catalogueTitle").textContent = activeCategory === "Bhajan" && activeBhajanGroup ? bhajanGroupLabel(activeBhajanGroup) : activeCategory === "all" ? (store.language === "en" ? "All Satsangs" : "सभी सत्संग") : categoryLabel(activeCategory);
    $("#catalogueSubtitle").textContent = activeCategory === "Satsang Ansh"
      ? (store.language === "en" ? `${countLabel(visible.length, "excerpt", "excerpts", "अंश")} available` : `${visible.length} अंश उपलब्ध`)
      : activeCategory === "Bhajan"
        ? activeBhajanGroup ? (store.language === "en" ? `${visible.length} available` : `${visible.length} उपलब्ध`) : (store.language === "en" ? `${bhajanGroups.length} groups` : `${bhajanGroups.length} वर्ग`)
        : (store.language === "en" ? `${countLabel(visible.length, "collection", "collections", "संग्रह")} available` : `${visible.length} संग्रह उपलब्ध`);
    $("#talkGrid").innerHTML = activeCategory === "Satsang Ansh" ? anshDurationGroups.map((group) => {
      const count = satsangAnsh.filter((talk) => matchesAnshDuration(talk, group)).length;
      return `<button class="series-row" type="button" data-ansh-duration="${group.key}"><span class="series-row-copy"><strong>${escapeHtml(anshDurationLabel(group))}</strong></span><span class="series-count">${count}</span><span class="row-chevron" aria-hidden="true">›</span></button>`;
    }).join("") : activeCategory === "Bhajan" && !activeBhajanGroup ? bhajanGroups.map((group) => {
      const count = bhajans.filter((talk) => bhajanGroupFor(talk) === group.key).length;
      return `<button class="series-row" type="button" data-bhajan-group="${group.key}"><span class="series-row-copy"><strong>${escapeHtml(store.language === "en" ? group.en : group.hi)}</strong></span><span class="series-count">${count}</span><span class="row-chevron" aria-hidden="true">›</span></button>`;
    }).join("") : activeCategory === "Bhajan" ? visible.map((talk, index) => talkCard(talk, visible, index)).join("") : visible.map(seriesRow).join("");
    $("#emptyCatalogue").hidden = visible.length > 0;
    if (activeCategory === "Bhajan" && activeBhajanGroup) {
      hydrateBhajanDurations(visible).then((changed) => {
        if (changed && activeCategory === "Bhajan" && activeBhajanGroup) renderCatalogue();
      });
    }
  }

  function episodeAsTalk(video, series) {
    const position = Number(video.position || 0);
    const list = playlistId(series);
    return {
      title: video.title || `सत्संग ${position + 1}`,
      location: series.location,
      year: series.year,
      category: series.category,
      youtubeUrl: video.id
        ? `https://www.youtube.com/watch?v=${video.id}&list=${list}&index=${position + 1}`
        : `https://www.youtube.com/playlist?list=${list}&index=${position + 1}`,
      duration: video.duration,
      thumbnail: video.thumbnail,
      parentTitle: series.title,
      isEpisode: true,
    };
  }

  function ensureYouTubeApi() {
    if (window.YT?.Player) return Promise.resolve(window.YT);
    if (youtubeApiPromise) return youtubeApiPromise;
    youtubeApiPromise = new Promise((resolve, reject) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previous === "function") previous();
        resolve(window.YT);
      };
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.onerror = () => reject(new Error("YouTube player API unavailable"));
        document.head.append(script);
      }
      setTimeout(() => reject(new Error("YouTube player API timed out")), 12000);
    });
    return youtubeApiPromise;
  }

  function bhajanVideoId(talk) {
    try {
      const parsed = new URL(talk.youtubeUrl);
      return parsed.searchParams.get("v") || (parsed.hostname.includes("youtu.be") ? parsed.pathname.slice(1) : "");
    } catch { return ""; }
  }

  async function hydrateBhajanDurations(items) {
    const missing = items.filter((talk) => !durationSeconds(talk) && bhajanVideoId(talk));
    if (!missing.length) return false;
    try { await ensureYouTubeApi(); } catch { return false; }
    const host = $("#playlistProbe");
    const values = await Promise.all(missing.map((talk) => {
      const id = bhajanVideoId(talk);
      if (bhajanDurationRequests.has(id)) return bhajanDurationRequests.get(id);
      const request = new Promise((resolve) => {
        const mount = document.createElement("div");
        host.append(mount);
        let player;
        let settled = false;
        const finish = (seconds = 0) => {
          if (settled) return;
          settled = true;
          try { player?.destroy?.(); } catch {}
          mount.remove();
          resolve({ talk, seconds: Math.max(0, Math.floor(seconds || 0)) });
        };
        const timer = setTimeout(() => finish(0), 10000);
        player = new window.YT.Player(mount, {
          width: "2",
          height: "2",
          videoId: id,
          playerVars: { autoplay: 0, controls: 0, playsinline: 1, rel: 0 },
          events: {
            onReady: (event) => {
              let attempts = 0;
              const readDuration = () => {
                attempts += 1;
                const seconds = event.target.getDuration?.() || 0;
                if (seconds > 0 || attempts >= 12) {
                  clearTimeout(timer);
                  finish(seconds);
                } else setTimeout(readDuration, 500);
              };
              event.target.cueVideoById?.(id);
              setTimeout(readDuration, 500);
            },
            onError: () => { clearTimeout(timer); finish(0); },
          },
        });
      });
      bhajanDurationRequests.set(id, request);
      return request;
    }));
    let changed = false;
    values.forEach(({ talk, seconds }) => {
      if (!seconds || durationSeconds(talk)) return;
      talk.duration = { seconds, display: formatTime(seconds) };
      changed = true;
    });
    return changed;
  }

  async function playlistVideosFromPlayer(listId, expectedCount = 0) {
    await ensureYouTubeApi();
    const host = $("#playlistProbe");
    host.replaceChildren();
    const mount = document.createElement("div");
    host.append(mount);
    return new Promise((resolve) => {
      let player;
      let attempts = 0;
      const finish = (ids) => {
        try { player?.destroy(); } catch {}
        host.replaceChildren();
        const count = ids.length || expectedCount;
        resolve(Array.from({ length: count }, (_, position) => ({ id: ids[position] || "", position })));
      };
      const inspect = () => {
        attempts += 1;
        let ids = [];
        try { ids = player?.getPlaylist?.() || []; } catch {}
        if (ids.length || attempts >= 12) finish(ids);
        else setTimeout(inspect, 650);
      };
      player = new window.YT.Player(mount, {
        width: "2",
        height: "2",
        playerVars: { playsinline: 1, rel: 0 },
        events: {
          onReady: (event) => {
            event.target.cuePlaylist({ listType: "playlist", list: listId, index: 0 });
            setTimeout(inspect, 500);
          },
          onError: () => finish([]),
        },
      });
    });
  }

  function renderEpisodes(series, videos) {
    const allEpisodes = videos.filter((video) => video?.id).map((video) => episodeAsTalk(video, series));
    if (playlistId(series) === "PLZfEqZUPNXrs") {
      allEpisodes.sort((left, right) => {
        const number = (talk) => Number(String(talk.title || "").match(/(?:talk|satsang|part|प्रवचन|सत्संग|भाग)\s*[-:#.]?\s*(\d+)/i)?.[1] || Number.MAX_SAFE_INTEGER);
        return number(left) - number(right);
      });
    }
    const episodes = allEpisodes;
    allEpisodes.forEach((episode) => knownEpisodes.set(talkId(episode), episode));
    episodeCache.set(playlistId(series), videos);
    $("#seriesLoading").hidden = true;
    $("#seriesFallback").hidden = allEpisodes.length > 0;
    const resumable = allEpisodes.find((episode) => statusOf(episode) === "partial" && Number(store.progress[talkId(episode)]?.seconds || 0) > 0);
    $("#seriesSummary").innerHTML = `${escapeHtml(countLabel(allEpisodes.length, "satsang", "satsangs", "सत्संग"))}${resumable ? `<button class="series-resume" type="button" data-play="${escapeHtml(talkId(resumable))}">▶ ${store.language === "en" ? "Continue from your place" : "वहीं से जारी रखें"} · ${escapeHtml(displayTalkTitle(resumable))}</button>` : ""}`;
    $("#episodeList").innerHTML = episodes.length ? episodes.map((episode, index) => {
      const id = talkId(episode);
      const state = rowPresentation(episode);
      return `<div class="v2-talk-actions"><button class="episode-row is-${state.status}${state.isCurrent ? " is-current" : ""}" type="button" data-talk-id="${escapeHtml(id)}" data-play="${escapeHtml(id)}">
        <span class="episode-copy"><strong>${escapeHtml(episode.title || `${store.language === "en" ? "Satsang" : "सत्संग"} ${index + 1}`)}</strong>${state.details ? `<span class="useful-status">${escapeHtml(state.details)}</span>` : ""}${state.hasManan ? `<small class="row-manan">✎ ${store.language === "en" ? "Manan" : "मनन"}</small>` : ""}${state.ratio ? `<span class="row-progress" aria-hidden="true"><i style="width:${state.ratio}%"></i></span>` : ""}</span>
        <span class="episode-play" aria-hidden="true">${state.status === "listened" ? "✓" : "▶"}</span>
      </button><button class="v2-manan-button" type="button" data-v2-manan="${escapeHtml(id)}">✎ <span>${store.language === "en" ? "Manan" : "मनन"}</span></button></div>`;
    }).join("") : `<p class="empty-state">${store.language === "en" ? "No satsangs are available." : "कोई सत्संग उपलब्ध नहीं है।"}</p>`;
  }

  async function openSeries(id) {
    const series = talks.find((talk) => talkId(talk) === id);
    if (!series) return;
    const listId = playlistId(series);
    if (!listId) { openTalk(id, talks); return; }
    activeSeries = series;
    store.lastSeriesId = id;
    saveStore();
    $("#seriesTitle").textContent = displaySeriesTitle(series);
    $("#seriesMeta").textContent = metaText(series);
    $("#seriesSummary").textContent = declaredEpisodeCount(series) ? countLabel(declaredEpisodeCount(series), "satsang", "satsangs", "सत्संग") : (store.language === "en" ? "Satsang list" : "सत्संग सूची");
    $("#episodeList").innerHTML = "";
    $("#seriesFallback").hidden = true;
    location.hash = "series";

    if (episodeCache.has(listId)) {
      renderEpisodes(series, episodeCache.get(listId));
      return;
    }

    $("#seriesLoading").hidden = false;
    try {
      const videos = await playlistVideosFromPlayer(listId, declaredEpisodeCount(series));
      if (!videos.length) throw new Error("Playlist is empty");
      renderEpisodes(series, videos);
    } catch (error) {
      $("#seriesLoading").hidden = true;
      $("#seriesFallback").hidden = false;
      $("#episodeList").innerHTML = "";
      console.warn(error);
    }
  }

  function openAnshDuration(key) {
    const group = anshDurationGroups.find((item) => item.key === key);
    if (!group) return;
    activeAnshDuration = key;
    const items = satsangAnsh.filter((talk) => matchesAnshDuration(talk, group)).sort((left, right) => Number(left.duration?.seconds || 0) - Number(right.duration?.seconds || 0));
    $("#anshTitle").textContent = anshDurationLabel(group);
    $("#anshSubtitle").textContent = countLabel(items.length, "satsang", "satsangs", "सत्संग");
    $("#anshTalkList").innerHTML = items.map((talk) => {
      const id = talkId(talk);
      const state = rowPresentation(talk);
      return `<button class="episode-row is-${state.status}${state.isCurrent ? " is-current" : ""}" type="button" data-talk-id="${escapeHtml(id)}" data-play="${escapeHtml(id)}"><span class="episode-copy"><strong>${escapeHtml(talk.title)}</strong>${state.details ? `<span class="useful-status">${escapeHtml(state.details)}</span>` : ""}${state.hasManan ? `<small class="row-manan">✎ ${store.language === "en" ? "Manan" : "मनन"}</small>` : ""}${state.ratio ? `<span class="row-progress" aria-hidden="true"><i style="width:${state.ratio}%"></i></span>` : ""}</span><span class="episode-play" aria-hidden="true">${state.status === "listened" ? "✓" : "▶"}</span></button>`;
    }).join("");
    location.hash = "ansh";
  }

  function normalize(value) {
    return String(value || "").toLocaleLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  }

  function searchTalks(query) {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    const available = [...talks, ...satsangAnsh, ...bhajans, ...knownEpisodes.values()];
    const unique = [...new Map(available.map((talk) => [talkId(talk), talk])).values()];
    return unique.filter((talk) => {
      const haystack = normalize([talk.title, talk.titleEn, talk.keywords, talk.parentTitle, talk.location, talk.year, talk.category, categoryLabel(talk.category)].filter(Boolean).join(" "));
      return terms.every((term) => haystack.includes(term));
    });
  }

  function renderGlobalSearch() {
    const query = $("#globalSearchInput").value.trim();
    $("#clearGlobalSearch").hidden = !query;
    if (!query) {
      $("#globalSearchSummary").textContent = store.language === "en" ? "Search the complete satsang collection." : "संपूर्ण सत्संग संग्रह में खोजें।";
      $("#globalSearchResults").innerHTML = "";
      return;
    }
    const results = searchTalks(query);
    $("#globalSearchSummary").textContent = store.language === "en" ? `${results.length} results` : `${results.length} परिणाम मिले`;
    $("#globalSearchResults").innerHTML = results.length
      ? results.map((talk, index) => talkCard(talk, results, index)).join("")
      : `<p class="empty-state">${store.language === "en" ? `No satsang found for “${escapeHtml(query)}”.` : `“${escapeHtml(query)}” के लिए कोई सत्संग नहीं मिला।`}</p>`;
  }

  function openGlobalSearch() {
    if (location.hash !== "#search") searchReturnHash = location.hash || "#home";
    location.hash = "search";
    setTimeout(() => $("#globalSearchInput").focus(), 0);
  }

  function closeGlobalSearch() {
    location.hash = searchReturnHash === "#search" ? "#home" : searchReturnHash;
  }

  function renderSearch() {
    const query = $("#searchInput").value.trim();
    $("#clearSearch").hidden = !query;
    if (!query) {
      $("#searchSummary").textContent = "";
      $("#searchResults").innerHTML = "";
      return;
    }
    const results = searchTalks(query);
    $("#searchSummary").textContent = store.language === "en" ? `${results.length} results` : `${results.length} परिणाम मिले`;
    $("#searchResults").innerHTML = results.length
      ? results.map((talk, index) => talkCard(talk, results, index)).join("")
      : `<p class="empty-state">${store.language === "en" ? `No satsang found for “${escapeHtml(query)}”.` : `“${escapeHtml(query)}” के लिए कोई सत्संग नहीं मिला।`}</p>`;
  }

  function findTalk(id) {
    return talks.find((talk) => talkId(talk) === id) || satsangAnsh.find((talk) => talkId(talk) === id) || bhajans.find((talk) => talkId(talk) === id) || knownEpisodes.get(id) || store.history.find((entry) => entry.id === id)?.talk || store.contemplation[id]?.talk || null;
  }

  function talksFromHistory() {
    return store.history.map((entry) => findTalk(entry.id)).filter(Boolean);
  }

  function renderHomePersonalization() {
    const history = talksFromHistory();
    const latestPartial = history.find((talk) => statusOf(talk) === "partial" && Number(store.progress[talkId(talk)]?.seconds || 0) > 0);
    $("#continueSection").hidden = !latestPartial;
    if (latestPartial) {
      const seconds = Number(store.progress[talkId(latestPartial)]?.seconds || 0);
      const duration = durationSeconds(latestPartial);
      const ratio = duration ? Math.min(100, seconds / duration * 100) : 0;
      const series = latestPartial.parentTitle ? displaySeriesTitle({ title: latestPartial.parentTitle }) : categoryLabel(latestPartial.category);
      const placeAndYear = [latestPartial.location, String(latestPartial.year || "").replace(/(\d)\s*-\s*(\d)/g, "$1–$2")].filter(Boolean).join(" · ");
      const heardUntil = store.language === "en" ? `Listened until ${formatTime(seconds)}` : `${formatTime(seconds)} तक सुना`;
      $("#continueCard").innerHTML = `<div class="continue-label">${store.language === "en" ? "Where you paused" : "जहाँ छोड़ा था"}</div><div class="continue-card"><div class="continue-copy"><h3>${escapeHtml(displayTalkTitle(latestPartial))}</h3><p class="continue-series">${escapeHtml(series)}</p><p>${escapeHtml([placeAndYear, heardUntil].filter(Boolean).join(" · "))}</p>${ratio ? `<span class="row-progress" aria-hidden="true"><i style="width:${ratio}%"></i></span>` : ""}</div><button class="continue-action" data-resume="${escapeHtml(talkId(latestPartial))}" type="button"><span>▶ ${store.language === "en" ? "Continue from there" : "वहीं से जारी रखें"}</span><small>${store.language === "en" ? "Opens the Player" : "प्लेयर में खुलेगा"}</small></button></div>`;
    }
  }

  function renderLibrary() {
    let list = [];
    if (activeLibraryTab === "contemplation") {
      const ids = [...new Set([...Object.keys(store.contemplation), ...Object.keys(store.mananNotes || {})])];
      list = ids.map(findTalk).filter(Boolean);
      const groups = new Map();
      list.forEach((talk) => {
        const key = `${talk.category}|${talk.parentTitle || talk.title}`;
        if (!groups.has(key)) groups.set(key, { category: talk.category, series: displaySeriesTitle({ title: talk.parentTitle || talk.title }), talks: [] });
        groups.get(key).talks.push(talk);
      });
      $("#libraryGrid").innerHTML = [...groups.values()].map((group) => `<section class="manan-group">
        <p class="kicker">${escapeHtml(categoryLabel(group.category))}</p><h2>${escapeHtml(group.series)}</h2>
        ${group.talks.map((talk) => {
          const id = talkId(talk);
          const notes = store.mananNotes[id] || [];
          return `<article class="manan-talk" data-talk-id="${escapeHtml(id)}"><h3>${escapeHtml(talk.title)}</h3><p>${escapeHtml(metaText(talk))}</p>
            ${notes.map((note) => `<div class="manan-note">${Number.isFinite(note.seconds) ? `<button type="button" data-seek="${note.seconds}" data-talk="${escapeHtml(id)}">▶ ${formatTime(note.seconds)}${formatNoteDate(note.createdAt) ? ` · ${escapeHtml(formatNoteDate(note.createdAt))}` : ""}</button>` : (formatNoteDate(note.createdAt) ? `<small>${escapeHtml(formatNoteDate(note.createdAt))}</small>` : "")}<p>${escapeHtml(note.text)}</p><button class="delete-manan" type="button" data-delete-manan="${escapeHtml(note.id)}" data-talk="${escapeHtml(id)}" aria-label="मनन हटाएँ">हटाएँ</button></div>`).join("")}
            <button class="secondary-button" type="button" data-open-manan="${escapeHtml(id)}">✎ मनन खोलें</button></article>`;
        }).join("")}</section>`).join("");
    } else {
      list = talksFromHistory().filter((talk) => statusOf(talk) === "listened");
      $("#libraryGrid").innerHTML = list.map((talk, index) => talkCard(talk, list, index)).join("");
    }
    const empty = $("#emptyLibrary");
    empty.hidden = list.length > 0;
    if (!list.length) {
      empty.querySelector("h2").textContent = activeLibraryTab === "contemplation" ? (store.language === "en" ? "No Manan notes yet" : "अभी कोई मनन नहीं है") : (store.language === "en" ? "No listened satsangs yet" : "अभी कोई सत्संग सुना हुआ नहीं है");
      empty.querySelector("p").textContent = activeLibraryTab === "contemplation" ? (store.language === "en" ? "Open Manan from an individual satsang to write a note." : "किसी सत्संग से मनन खोलकर अपना मनन लिखें।") : (store.language === "en" ? "Completed satsangs will appear here." : "पूरा सुना हुआ सत्संग यहाँ दिखाई देगा।");
    }
  }

  function updateHistory(talk) {
    const id = talkId(talk);
    const snapshot = { title: talk.title, location: talk.location, year: talk.year, category: talk.category, youtubeUrl: talk.youtubeUrl, duration: talk.duration, parentTitle: talk.parentTitle, isEpisode: talk.isEpisode };
    store.history = [{ id, at: Date.now(), talk: snapshot }, ...store.history.filter((entry) => entry.id !== id)].slice(0, 50);
  }

  function renderTalkManan() {
    const talk = playerList[playerIndex];
    if (!talk) return;
    const id = talkId(talk);
    $("#mananTalkTitle").textContent = talk.title;
    $("#mananTalkMeta").textContent = `${categoryLabel(talk.category)} · ${metaText(talk)}`;
    const notes = store.mananNotes[id] || [];
    $("#talkMananNotes").innerHTML = notes.length ? notes.map((note) => `<article class="manan-note">
      ${Number.isFinite(note.seconds) ? `<button type="button" data-seek="${note.seconds}" data-talk="${escapeHtml(id)}">▶ ${formatTime(note.seconds)}${formatNoteDate(note.createdAt) ? ` · ${escapeHtml(formatNoteDate(note.createdAt))}` : ""}</button>` : (formatNoteDate(note.createdAt) ? `<small>${escapeHtml(formatNoteDate(note.createdAt))}</small>` : "")}
      <p>${escapeHtml(note.text)}</p><button class="delete-manan" type="button" data-delete-manan="${escapeHtml(note.id)}" data-talk="${escapeHtml(id)}">हटाएँ</button>
    </article>`).join("") : `<p class="manan-empty">इस सत्संग के लिए अभी कोई मनन नहीं है।</p>`;
  }

  function selectCurrentTime() {
    let seconds = Number(store.progress[talkId(playerList[playerIndex])]?.seconds || 0);
    try { seconds = Math.floor(activeMainPlayer?.getCurrentTime?.() || seconds); } catch {}
    pendingMananSeconds = Math.max(0, seconds);
    $("#selectedTimestamp").hidden = false;
    $("#selectedTimestamp").textContent = formatTime(pendingMananSeconds);
  }

  function updateMananComposeState() {
    $("#savePrivateNote").hidden = !$("#privateNote").value.trim();
  }

  function saveMananNote() {
    const talk = playerList[playerIndex];
    const text = $("#privateNote").value.trim();
    if (!talk || !text) { showToast("कृपया मनन लिखें"); return; }
    const id = talkId(talk);
    store.mananNotes[id] ||= [];
    store.mananNotes[id].unshift({ id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text, seconds: Number.isFinite(pendingMananSeconds) ? pendingMananSeconds : null, createdAt: Date.now() });
    store.contemplation[id] ||= { addedAt: Date.now(), talk: talkSnapshot(talk) };
    $("#privateNote").value = "";
    updateMananComposeState();
    pendingMananSeconds = null;
    $("#selectedTimestamp").hidden = true;
    saveStore();
    renderTalkManan();
    renderLibrary();
    updatePlayerControls();
    showToast("मनन सुरक्षित किया");
  }

  function deleteMananNote(talkIdValue, noteId) {
    store.mananNotes[talkIdValue] = (store.mananNotes[talkIdValue] || []).filter((note) => note.id !== noteId);
    if (!store.mananNotes[talkIdValue].length) delete store.mananNotes[talkIdValue];
    saveStore();
    renderLibrary();
    renderTalkManan();
    showToast("मनन हटाया");
  }

  let v2MananTalkId = "";

  function openV2Manan(id) {
    const talk = findTalk(id);
    if (!talk) return;
    v2MananTalkId = id;
    $("#v2MananTitle").textContent = displayTalkTitle(talk);
    $("#v2MananText").value = "";
    $("#v2MananDialog").showModal();
    $("#v2MananText").focus();
  }

  function saveV2Manan() {
    const talk = findTalk(v2MananTalkId);
    const text = $("#v2MananText").value.trim();
    if (!talk || !text) return;
    store.mananNotes[v2MananTalkId] ||= [];
    store.mananNotes[v2MananTalkId].unshift({ id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text, seconds: null, createdAt: Date.now() });
    store.contemplation[v2MananTalkId] ||= { addedAt: Date.now(), talk: talkSnapshot(talk) };
    saveStore();
    renderAllDynamic();
    $("#v2MananDialog").close();
    showToast(store.language === "en" ? "Manan saved privately" : "मनन सुरक्षित हो गया");
  }

  function playerParts(url) {
    try {
      const parsed = new URL(url);
      return {
        videoId: parsed.searchParams.get("v") || (parsed.hostname.includes("youtu.be") ? parsed.pathname.slice(1) : ""),
        listId: parsed.searchParams.get("list") || "",
        index: Math.max(0, Number(parsed.searchParams.get("index") || 1) - 1),
      };
    } catch { return { videoId: "", listId: "", index: 0 }; }
  }

  function resetPlayerMount() {
    playerRequestId += 1;
    clearInterval(progressTimer);
    progressTimer = null;
    try { activeMainPlayer?.destroy?.(); } catch {}
    activeMainPlayer = null;
    $(".video-frame").innerHTML = '<div id="youtubePlayer"></div>';
  }

  function showPlayerPoster(talk) {
    resetPlayerMount();
    const id = talkId(talk);
    const seconds = Number(store.progress[id]?.seconds || 0);
    const duration = durationSeconds(talk);
    const series = talk.parentTitle ? displaySeriesTitle({ title: talk.parentTitle }) : categoryLabel(talk.category);
    const context = [talk.location, String(talk.year || "").replace(/(\d)\s*-\s*(\d)/g, "$1–$2")].filter(Boolean).join(" · ");
    $(".video-frame").innerHTML = `<div class="player-poster">
      <div class="player-poster-copy"><strong>${escapeHtml(displayTalkTitle(talk))}</strong><span>${escapeHtml(series)}</span>${context ? `<small>${escapeHtml(context)}</small>` : ""}</div>
      ${seconds > 0 ? `<small class="player-resume-cue">${escapeHtml(store.language === "en" ? `Listened until ${formatTime(seconds)}` : `${formatTime(seconds)} तक सुना`)}</small>` : ""}
      <button class="player-start" type="button" data-start-player aria-label="${store.language === "en" ? "Start this pravachan" : "यह प्रवचन चलाएँ"}"><span aria-hidden="true">▶</span><strong>${seconds > 0 ? (store.language === "en" ? "Continue from saved position" : "वहीं से जारी रखें") : (store.language === "en" ? "Play pravachan" : "प्रवचन सुनें")}</strong></button>
    </div>`;
  }

  async function startMainPlayer(url) {
    resetPlayerMount();
    const requestId = playerRequestId;
    const parts = playerParts(url);
    const playlistOnly = !parts.videoId && Boolean(parts.listId);
    try {
      await ensureYouTubeApi();
      if (requestId !== playerRequestId) return;
      activeMainPlayer = new window.YT.Player("youtubePlayer", {
        width: "100%",
        height: "100%",
        videoId: parts.videoId || undefined,
        playerVars: { autoplay: 1, playsinline: 1, rel: 0, listType: playlistOnly ? "playlist" : undefined, list: playlistOnly ? parts.listId : undefined, index: playlistOnly ? parts.index : undefined },
        events: {
          onReady: (event) => {
            if (!parts.videoId && parts.listId) event.target.loadPlaylist({ listType: "playlist", list: parts.listId, index: parts.index });
            const talk = playerList[playerIndex];
            const savedSeconds = Number(talk && store.progress[talkId(talk)]?.seconds || 0);
            if (savedSeconds > 5) event.target.seekTo(savedSeconds, true);
            clearInterval(progressTimer);
            progressTimer = setInterval(saveActiveProgress, 10000);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) handleTalkCompleted();
          },
        },
      });
    } catch {
      const fallback = document.createElement("iframe");
      fallback.id = "youtubePlayer";
      fallback.title = "YouTube सत्संग प्लेयर";
      fallback.allow = "autoplay; encrypted-media; picture-in-picture";
      fallback.allowFullscreen = true;
      fallback.src = youtubeEmbed(url, true);
      $(".video-frame").replaceChildren(fallback);
    }
  }

  function handleTalkCompleted() {
    const talk = playerList[playerIndex];
    if (talk) {
      store.progress[talkId(talk)] = { status: "listened", updatedAt: Date.now() };
      saveStore();
      updatePlayerControls();
      renderAllDynamic();
      if (activeSeries && episodeCache.has(playlistId(activeSeries))) renderEpisodes(activeSeries, episodeCache.get(playlistId(activeSeries)));
    }
  }

  function saveActiveProgress() {
    const talk = playerList[playerIndex];
    if (!talk || !activeMainPlayer?.getCurrentTime) return;
    let seconds = 0;
    let duration = 0;
    try {
      seconds = Math.max(0, Math.floor(activeMainPlayer.getCurrentTime() || 0));
      duration = Math.max(0, Math.floor(activeMainPlayer.getDuration?.() || 0));
    } catch { return; }
    if (seconds < 1) return;
    const id = talkId(talk);
    const completed = duration > 0 && seconds / duration >= .95;
    store.progress[id] = { status: completed ? "listened" : "partial", seconds, duration, updatedAt: Date.now() };
    saveStore();
  }

  function openTalk(id, list = null) {
    if (!navigator.onLine) {
      updateOnlineStatus();
      showToast("सत्संग चलाने के लिए इंटरनेट आवश्यक है");
      return;
    }
    const context = list || filteredTalks();
    let index = context.findIndex((talk) => talkId(talk) === id);
    if (index < 0) {
      const standalone = findTalk(id);
      playerList = standalone ? [standalone] : [];
      index = standalone ? 0 : -1;
    }
    else playerList = context;
    playerIndex = index;
    const talk = playerList[playerIndex];
    if (!talk) return;
    updateHistory(talk);
    saveStore();
    window.location.href = talk.youtubeUrl;
  }

  function updatePlayerControls() {
    const talk = playerList[playerIndex];
    if (!talk) return;
    const id = talkId(talk);
    const contemplate = Boolean(store.contemplation[id]);
    const listened = statusOf(talk) === "listened";
    $("#playerContemplate").hidden = false;
    $("#markListened").hidden = false;
    $("#playerContemplate").textContent = contemplate ? (store.language === "en" ? "✎ In Manan" : "✎ मनन में") : (store.language === "en" ? "✎ Manan" : "✎ मनन");
    $("#markListened").textContent = store.language === "en" ? (listened ? "✓ Listened" : "✓ Mark listened") : "✓ सुना हुआ";
    $("#markListened").classList.toggle("is-selected", listened);
    $("#markListened").setAttribute("aria-pressed", String(listened));
    $("#playerContemplate").classList.toggle("is-selected", contemplate);
    $("#playerContemplate").setAttribute("aria-pressed", String(contemplate));
    $("#openYouTube").textContent = store.language === "en" ? "Open YouTube" : "YouTube पर जाएँ";
    $("#previousTalk").disabled = playerIndex <= 0;
    $("#nextTalk").disabled = playerIndex >= playerList.length - 1;
    $("#playerPosition").textContent = `${playerIndex + 1} / ${playerList.length}`;
  }

  function closePlayer() {
    saveActiveProgress();
    resetPlayerMount();
    location.hash = playerReturnHash;
  }

  function toggleContemplation(id) {
    if (store.contemplation[id]) delete store.contemplation[id];
    else {
      const talk = findTalk(id);
      store.contemplation[id] = { addedAt: Date.now(), talk: talk ? talkSnapshot(talk) : null };
    }
    saveStore();
    renderAllDynamic();
    if (activeSeries && episodeCache.has(playlistId(activeSeries))) renderEpisodes(activeSeries, episodeCache.get(playlistId(activeSeries)));
    if (playerIndex >= 0) updatePlayerControls();
    showToast(store.contemplation[id] ? "मनन में रखा" : "मनन सूची से हटाया");
  }

  function toggleListened() {
    const talk = playerList[playerIndex];
    if (!talk) return;
    const id = talkId(talk);
    const listened = statusOf(talk) === "listened";
    store.progress[id] = { status: listened ? "partial" : "listened", updatedAt: Date.now() };
    saveStore();
    updatePlayerControls();
    renderAllDynamic();
    if (activeSeries && episodeCache.has(playlistId(activeSeries))) renderEpisodes(activeSeries, episodeCache.get(playlistId(activeSeries)));
    showToast(listened ? "आंशिक श्रवण के रूप में रखा" : "सुना हुआ चिह्नित किया");
  }

  function renderAllDynamic() {
    renderCatalogue();
    renderSearch();
    renderLibrary();
    renderHomePersonalization();
  }

  function route() {
    const name = location.hash.slice(1).split("/")[0] || "home";
    let valid = ["home", "catalogue", "series", "ansh", "listened", "manan", "player", "search"].includes(name) ? name : "home";
    if (valid !== "player" && (activeMainPlayer || progressTimer || $(".video-frame iframe"))) {
      saveActiveProgress();
      resetPlayerMount();
    }
    if (valid === "player" && playerIndex < 0) valid = "home";
    if (valid === "player" && playerIndex >= 0 && !activeMainPlayer && !$(".video-frame iframe") && !$(".player-poster")) setTimeout(() => showPlayerPoster(playerList[playerIndex]), 0);
    if (valid === "series" && !activeSeries) {
      const savedSeries = talks.find((talk) => talkId(talk) === store.lastSeriesId);
      if (savedSeries) setTimeout(() => openSeries(talkId(savedSeries)), 0);
      else valid = "catalogue";
    }
    if (valid === "ansh" && !activeAnshDuration) valid = "catalogue";
    if (valid === "listened" || valid === "manan") {
      activeLibraryTab = valid === "manan" ? "contemplation" : "history";
      $("#libraryTitle").textContent = valid === "manan" ? "मनन" : (store.language === "en" ? "Listened" : "सुना हुआ");
      $$('[data-library-tab]').forEach((item) => item.setAttribute("aria-selected", String(item.dataset.libraryTab === activeLibraryTab)));
      renderLibrary();
    }
    if (valid === "search") renderGlobalSearch();
    const viewName = valid === "listened" || valid === "manan" ? "library" : valid;
    $$(".view").forEach((view) => view.classList.toggle("is-active", view.id === `${viewName}View`));
    $$(".bottom-nav a").forEach((link) => {
      if (link.dataset.route === valid) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    scrollTo({ top: 0, behavior: "auto" });
  }

  function wireEvents() {
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-open-search]")) { openGlobalSearch(); return; }
      if (event.target.closest("[data-start-player]")) {
        const talk = playerList[playerIndex];
        if (talk) startMainPlayer(talk.youtubeUrl);
        return;
      }
      const resume = event.target.closest("[data-resume]");
      if (resume) {
        const talk = findTalk(resume.dataset.resume);
        if (talk) openTalk(resume.dataset.resume, [talk]);
        return;
      }
      const category = event.target.closest("[data-category]");
      if (category) {
        activeCategory = category.dataset.category;
        activeBhajanGroup = "";
        renderCatalogue();
        location.hash = "catalogue";
        return;
      }
      const series = event.target.closest("[data-series]");
      if (series) { openSeries(series.dataset.series); return; }
      const anshDuration = event.target.closest("[data-ansh-duration]");
      if (anshDuration) { openAnshDuration(anshDuration.dataset.anshDuration); return; }
      const bhajanGroup = event.target.closest("[data-bhajan-group]");
      if (bhajanGroup) { activeBhajanGroup = bhajanGroup.dataset.bhajanGroup; renderCatalogue(); scrollTo({ top: 0, behavior: "auto" }); return; }
      const play = event.target.closest("[data-play]");
      if (play) {
        const containingGrid = play.closest(".talk-grid, .episode-list, .series-list");
        let list = containingGrid ? $$('[data-talk-id]', containingGrid).map((card) => findTalk(card.dataset.talkId)).filter(Boolean) : null;
        openTalk(play.dataset.play, list);
        return;
      }
      const contemplate = event.target.closest("[data-contemplate]");
      if (contemplate) { toggleContemplation(contemplate.dataset.contemplate); return; }
      const v2Manan = event.target.closest("[data-v2-manan]");
      if (v2Manan) { openV2Manan(v2Manan.dataset.v2Manan); return; }
      const openManan = event.target.closest("[data-open-manan]");
      if (openManan) { openTalk(openManan.dataset.openManan, [findTalk(openManan.dataset.openManan)].filter(Boolean)); setTimeout(() => { $("#mananPanel").open = true; $("#privateNote").focus(); }, 100); return; }
      const seek = event.target.closest("[data-seek]");
      if (seek) {
        const id = seek.dataset.talk;
        const seconds = Number(seek.dataset.seek || 0);
        if (playerIndex >= 0 && talkId(playerList[playerIndex]) === id) activeMainPlayer?.seekTo?.(seconds, true);
        else { openTalk(id, [findTalk(id)].filter(Boolean)); setTimeout(() => activeMainPlayer?.seekTo?.(seconds, true), 1200); }
        return;
      }
      const deleteButton = event.target.closest("[data-delete-manan]");
      if (deleteButton) { deleteMananNote(deleteButton.dataset.talk, deleteButton.dataset.deleteManan); return; }
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (action === "browse") location.hash = "catalogue";
      if (action === "home") {
        if (activeCategory === "Bhajan" && activeBhajanGroup) { activeBhajanGroup = ""; renderCatalogue(); scrollTo({ top: 0, behavior: "auto" }); }
        else location.hash = "home";
      }
      if (action === "back-to-category") location.hash = "catalogue";
      if (action === "back-to-ansh-durations") location.hash = "catalogue";
    });

    $("#searchInput").addEventListener("input", renderSearch);
    $("#clearSearch").addEventListener("click", () => { $("#searchInput").value = ""; renderSearch(); $("#searchInput").focus(); });
    $("#globalSearchInput").addEventListener("input", renderGlobalSearch);
    $("#clearGlobalSearch").addEventListener("click", () => { $("#globalSearchInput").value = ""; renderGlobalSearch(); $("#globalSearchInput").focus(); });
    $("#closeGlobalSearch").addEventListener("click", closeGlobalSearch);
    $("#playSeriesFallback").addEventListener("click", () => { if (activeSeries) openTalk(talkId(activeSeries), [activeSeries]); });
    $("#closePlayer").addEventListener("click", closePlayer);
    $("#playerContemplate").addEventListener("click", () => { const talk = playerList[playerIndex]; if (talk) { if (!store.contemplation[talkId(talk)]) toggleContemplation(talkId(talk)); $("#mananPanel").open = true; $("#privateNote").focus(); } });
    $("#markListened").addEventListener("click", toggleListened);
    $("#addCurrentTime").addEventListener("click", selectCurrentTime);
    $("#savePrivateNote").addEventListener("click", saveMananNote);
    $("#saveV2Manan").addEventListener("click", saveV2Manan);
    $("#cancelV2Manan").addEventListener("click", () => $("#v2MananDialog").close());
    $("#privateNote").addEventListener("input", updateMananComposeState);
    $("#previousTalk").addEventListener("click", () => { if (playerIndex > 0) openTalk(talkId(playerList[playerIndex - 1]), playerList); });
    $("#nextTalk").addEventListener("click", () => { if (playerIndex < playerList.length - 1) openTalk(talkId(playerList[playerIndex + 1]), playerList); });
    $$("[data-library-tab]").forEach((tab) => tab.addEventListener("click", () => {
      activeLibraryTab = tab.dataset.libraryTab;
      $$("[data-library-tab]").forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      renderLibrary();
    }));
    $("#languageButton").addEventListener("click", () => { store.language = store.language === "hi" ? "en" : "hi"; saveStore(); updateInterfaceLanguage(); renderAllDynamic(); renderGlobalSearch(); if (activeSeries) { $("#seriesTitle").textContent = displaySeriesTitle(activeSeries); $("#seriesMeta").textContent = metaText(activeSeries); if (episodeCache.has(playlistId(activeSeries))) renderEpisodes(activeSeries, episodeCache.get(playlistId(activeSeries))); } if (activeAnshDuration && location.hash === "#ansh") openAnshDuration(activeAnshDuration); if (playerIndex >= 0) updatePlayerControls(); showToast(store.language === "hi" ? "हिन्दी" : "English"); });
    window.addEventListener("hashchange", route);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    $("#installButton").addEventListener("click", async () => {
      if (!deferredInstall) {
        const instructions = $("#vaniInstallInstructions");
        instructions.hidden = !instructions.hidden;
        if (!instructions.hidden) instructions.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
      deferredInstall.prompt();
      await deferredInstall.userChoice;
      deferredInstall = null;
      $("#installButton").hidden = true;
      $("#dismissInstallButton").hidden = true;
    });
    const dismissInstall = () => {
      localStorage.setItem(INSTALL_DISMISSED_KEY, "1");
      $("#installButton").hidden = true;
      $("#dismissInstallButton").hidden = true;
      $("#vaniInstallInstructions").hidden = true;
    };
    $("#dismissInstallButton").addEventListener("click", dismissInstall);
    let installTouchX = 0;
    $(".home-install-action").addEventListener("touchstart", (event) => { installTouchX = event.changedTouches[0]?.clientX || 0; }, { passive: true });
    $(".home-install-action").addEventListener("touchend", (event) => { if (Math.abs((event.changedTouches[0]?.clientX || 0) - installTouchX) > 35) dismissInstall(); }, { passive: true });
    if (!isStandaloneApp() && !localStorage.getItem(INSTALL_DISMISSED_KEY) && window.matchMedia("(max-width: 820px), (pointer: coarse)").matches) {
      const installButton = $("#installButton");
      installButton.hidden = false;
      $("#dismissInstallButton").hidden = false;
      if (!deferredInstall) {
        installButton.dataset.hi = "Install App";
        installButton.dataset.en = "Install App";
        installButton.textContent = "Install App";
        installButton.setAttribute("aria-label", store.language === "en" ? "See app installation instructions" : "ऐप इंस्टॉल करने की विधि देखें");
      }
    }
  }

  async function init() {
    try {
      const [talkResponse, anshResponse, bhajanResponse] = await Promise.all([fetch(DATA_URL), fetch(ANSH_DATA_URL), fetch(BHAJAN_DATA_URL)]);
      if (!talkResponse.ok || !anshResponse.ok || !bhajanResponse.ok) throw new Error("Catalogue unavailable");
      talks = (await talkResponse.json()).filter((talk) => talk?.title && talk?.youtubeUrl);
      const anshData = await anshResponse.json();
      satsangAnsh = (anshData.videos || []).filter((item) => item?.id && item?.title).map(anshAsTalk);
      const bhajanData = await bhajanResponse.json();
      bhajans = (bhajanData.items || []).filter((item) => item?.title && item?.youtubeUrl).map((item) => ({ ...item, category: "Bhajan", isEpisode: true }));
      renderCategories();
      updateInterfaceLanguage();
      renderAllDynamic();
      wireEvents();
      updateOnlineStatus();
      route();
    } catch (error) {
      $("#categoryGrid").innerHTML = `<p class="empty-state">सत्संग सूची अभी उपलब्ध नहीं है। कृपया पुनः प्रयास करें।</p>`;
      console.error(error);
    }
  }

  init();
})();
