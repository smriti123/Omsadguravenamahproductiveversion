(() => {
  const playlistUrl =
    "https://www.youtube.com/playlist?list=PLPZZ4rJCboBUaa3CHa8jdPV2tN9OhNCcG";
  const playlistId = new URL(playlistUrl).searchParams.get("list") || "";
  const cacheKey = `excerpts-playlist-cache-v1:${playlistId}`;
  const staticFallbackUrl = "/data/excerpts-playlist-fallback.json";
  const durationFilters = [
    { key: "under5", label: "≤5 min", max: 5 * 60 },
    { key: "under10", label: "5-10 min", min: 5 * 60, max: 10 * 60 },
    { key: "under15", label: "10-15 min", min: 10 * 60, max: 15 * 60 },
    { key: "under20", label: "15-20 min", min: 15 * 60, max: 20 * 60 },
    { key: "under30", label: "20-30 min", min: 20 * 60, max: 30 * 60 },
    { key: "over30", label: "30+ min", min: 30 * 60 },
  ];
  const cacheMaxAgeMs = 6 * 60 * 60 * 1000;
  // Topic-wise (प्रकरण) full Satsang playlists shown as a "Playlists" group at the
  // top of Satsang-Ansh. Tapping one opens the same integrated player used by the
  // Satsang list (window.SatsangPlayer); falls back to YouTube if unavailable.
  const excerptPlaylists = [
    {
      title: "भक्ति प्रकरण",
      subtitle: "Bhakti Prakaran",
      videoId: "Y89LVnRuDhI",
      url: "https://www.youtube.com/playlist?list=PLgy41qSqQO40vxoignhmCfgRJYTpbBHAj",
    },
    {
      title: "ईश्वर प्रकरण",
      subtitle: "Ishwar Prakaran",
      videoId: "-VF1D_r_KZM",
      url: "https://www.youtube.com/playlist?list=PLgy41qSqQO43xNVt8WOEGZszlUUURRdi_",
    },
    {
      title: "जीवन प्रकरण",
      subtitle: "Jeevan Prakaran",
      videoId: "E6-2U5U_Y9g",
      url: "https://www.youtube.com/playlist?list=PLgy41qSqQO40O0ec0PWpNMlBNHThamJQO",
    },
    {
      title: "साधना प्रकरण",
      subtitle: "Sadhna Prakaran",
      videoId: "s39y4fNXepk",
      url: "https://www.youtube.com/playlist?list=PLgy41qSqQO420ztBxZE6tga9I4bMkMgM4",
    },
    {
      title: "कर्म प्रकरण",
      subtitle: "Karma Prakaran",
      videoId: "VSixisuFNnI",
      url: "https://www.youtube.com/playlist?list=PLgy41qSqQO43KWmNeH8OijWevP014gyTo",
    },
    {
      title: "वेद-वेदांत, आगम-निगम",
      subtitle: "Ved, Vedant, Aagam, Nigam",
      videoId: "CThjnmM02J8",
      url: "https://www.youtube.com/playlist?list=PLgy41qSqQO41a83lWCTUXFMJmAtwJqITj",
    },
    {
      title: "कृपणता",
      subtitle: "Miserliness",
      videoId: "4EV3v5UXKOY",
      url: "https://www.youtube.com/playlist?list=PLgy41qSqQO42ywATXayBhAulpElojvBlZ",
    },
  ];
  let videos = [];
  let activeDurationFilter = "under5";
  let listExpanded = false;
  const collapsedCount = 8;
  let selectedVideoId = "";
  let section = null;
  let initStarted = false;
  let observer = null;
  let retryTimer = null;
  let initRetries = 0;
  let shouldOpenPlayer = false;
  let youtubeApiPromise = null;
  let excerptsPlayer = null;
  let playlistIds = [];
  let metadataResolveTimer = null;
  const metadataKey = `excerpts-video-metadata-v1:${playlistId}`;
  const recentKey = "excerpts-recent-v1";
  // Playback position is saved the same way Satsang does it: every 10s while
  // playing, plus on pause/end/unload. Local to this browser, never sent anywhere.
  const progressSaveIntervalMs = 10000;
  // Resuming this close to the end just replays the tail, so start over instead.
  const resumeEndGraceSeconds = 15;
  // Below this, resuming isn't worth it — matches Satsang's 5s threshold.
  const resumeMinSeconds = 5;
  let activeSaveTimer = null;

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "");
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Local storage is optional; the playlist still works without it.
    }
  }

  function createEl(tag, className = "", text = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function playExcerptPlaylist(item) {
    const player = window.SatsangPlayer;
    if (player && typeof player.playByUrl === "function") {
      const opened = player.playByUrl(item.url, {
        title: item.title,
        category: "सत्संग अंश",
      });
      if (opened) return;
    }
    window.open(item.url, "_blank", "noopener,noreferrer");
  }

  // Build the प्रकरण playlist cards as a grid element (shown in the list area
  // when the प्रकरण tab is active).
  function buildPlaylistGrid() {
    const grid = createEl("div", "excerpts-playlists-grid");
    grid.append(
      ...excerptPlaylists.map((item) => {
        const card = createEl("button", "excerpts-playlist-card");
        card.type = "button";
        card.setAttribute("aria-label", `${item.title} — सुनें`);
        card.innerHTML = `
          <span class="excerpts-playlist-thumb" aria-hidden="true">
            <img src="https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg" alt="" loading="lazy">
            <span class="excerpts-playlist-play">▶</span>
          </span>
          <span class="excerpts-playlist-copy">
            <span class="excerpts-playlist-title">${escapeHtml(item.title)}</span>
            <span class="excerpts-playlist-sub">${escapeHtml(item.subtitle)}</span>
          </span>
        `;
        card.addEventListener("click", () => playExcerptPlaylist(item));
        return card;
      }),
    );
    return grid;
  }

  // Place (or re-place) the excerpts section immediately after Satsang (#talks).
  // The site is a React SPA, so on the first run #talks often has not rendered
  // yet — the section then used to land at the very end of <main> and stay stuck
  // there (renderShell early-returned without ever repositioning it). This keeps
  // it anchored right after Satsang, and moves it there as soon as #talks exists.
  function positionSection() {
    if (!section) return;

    const talks = document.querySelector("#talks");
    if (talks?.parentElement) {
      if (talks.nextElementSibling !== section) {
        talks.insertAdjacentElement("afterend", section);
      }
      return;
    }

    // Satsang is not on this view yet. Only give the section a provisional home
    // if it is not placed at all; never yank an already-placed section around.
    if (section.isConnected) return;

    // Anchor ONLY to Satsang (or Bhajan as a same-spot backup). Never append to
    // <main>: the immersive home page has a <main> but NO Satsang section, and
    // that fallback dropped Satsang-Ansh at the very bottom of the home page.
    const bhajans = document.querySelector("#bhajans");
    if (bhajans?.parentElement) {
      bhajans.insertAdjacentElement("beforebegin", section);
    }
  }

  function renderShell() {
    if (document.querySelector("#excerpts")) {
      section = document.querySelector("#excerpts");
      positionSection();
      injectNavLink();
      injectExploreCard();
      return section;
    }

    // Satsang-Ansh only belongs on pages that actually have Satsang (or Bhajan).
    // The immersive home page has neither, so we must not build the section there
    // (otherwise it would have nowhere to anchor and dangle at the bottom).
    if (!document.querySelector("#talks") && !document.querySelector("#bhajans")) {
      return null;
    }

    section = document.createElement("section");
    section.id = "excerpts";
    section.className = "excerpts-section";
    section.innerHTML = `
      <div class="excerpts-inner">
        <div class="excerpts-heading">
          <h2>सत्संग-अंश</h2>
          <span>Short selections from Pujya Swamiji's satsangs</span>
        </div>
        <div class="excerpts-player-wrap" hidden>
          <button type="button" class="excerpts-player-close" aria-label="Close Satsang-Ansh player">×</button>
          <div class="excerpts-player" id="excerpts-player-anchor">
            <div id="excerpts-youtube-player"></div>
          </div>
          <p class="excerpts-now-playing"></p>
          <a class="excerpts-youtube-open" href="${playlistUrl}" target="_blank" rel="noopener noreferrer">YouTube पर खोलें</a>
          <p class="excerpts-gratitude">🙏 सुनने के बाद, YouTube पर 👍 Like व 💬 Comment से प. पू. स्वामीजी के प्रति कृतज्ञता व्यक्त कर सकते हैं</p>
        </div>
        <div class="excerpts-recent" hidden></div>
        <div class="excerpts-filter-wrap">
          <p>Browse by duration</p>
          <div class="excerpts-duration-tabs" role="tablist" aria-label="Browse talks by duration"></div>
        </div>
        <div class="excerpts-status">Loading excerpts...</div>
        <div class="excerpts-list"></div>
      </div>
    `;

    section
      .querySelector(".excerpts-player-close")
      ?.addEventListener("click", () => {
        saveExcerptProgress();
        excerptsPlayer?.stopVideo?.();
        const wrap = section?.querySelector(".excerpts-player-wrap");
        if (wrap) wrap.hidden = true;
        if (selectedVideoId) {
          section
            ?.querySelector(`.excerpt-card[data-video-id="${selectedVideoId}"]`)
            ?.focus();
        }
      });

    positionSection();
    if (!section.isConnected) {
      // Satsang/Bhajan not rendered yet. Leave the node detached and retry on
      // the next scheduleInit()/observer pass (never appended to <main>).
      section = null;
      return null;
    }

    injectNavLink();
    injectExploreCard();
    return section;
  }

  function excerptsHrefFromTalksHref(href) {
    if (!href) return "#excerpts";
    if (href.includes("#talks")) return href.replace("#talks", "#excerpts");
    return href.startsWith("/home") || href.startsWith("/old-home") ? `${href.split("#")[0]}#excerpts` : "#excerpts";
  }

  function closeMobileMenu() {
    // The mobile drawer's close control (only present while the drawer is open).
    // Clicking it dismisses the drawer exactly like the built-in menu items do.
    const closeBtn = Array.from(document.querySelectorAll("button")).find(
      (b) =>
        (b.getAttribute("aria-label") || "").trim().toLowerCase() ===
        "close menu",
    );
    if (closeBtn) closeBtn.click();
  }

  function injectNavLink() {
    document.querySelectorAll("nav").forEach((nav) => {
      // A single <nav> can hold more than one copy of the menu — e.g. a hidden
      // desktop bar AND the mobile drawer list, both inside the same <nav>. Add
      // our link after EVERY Satsang link so whichever copy is visible always
      // shows सत्संग-अंश (previously only the first, often hidden, copy got it).
      Array.from(nav.querySelectorAll("a"))
        .filter((link) => (link.getAttribute("href") || "").includes("#talks"))
        .forEach(insertExcerptsLinkAfter);
    });
  }

  function insertExcerptsLinkAfter(talksLink) {
    // Mirror the Satsang link's structure: if it sits inside its own <li> (both
    // the desktop bar and the mobile menu are list-based), give our link its own
    // <li> too so it reads as a separate menu row. Otherwise insert a sibling <a>.
    const talksItem =
      talksLink.parentElement && talksLink.parentElement.tagName === "LI"
        ? talksLink.parentElement
        : talksLink;
    const useListItem = talksItem.tagName === "LI";

    // If our item already sits immediately after THIS Satsang item, leave it
    // untouched — prevents duplicates and MutationObserver loops.
    const next = talksItem.nextElementSibling;
    let existingLink = null;
    if (next && next.matches) {
      if (next.matches('a[data-excerpts-nav-link="true"]')) {
        existingLink = next;
      } else if (next.matches('li[data-excerpts-nav-item="true"]')) {
        existingLink = next.querySelector('a[data-excerpts-nav-link="true"]');
      }
    }
    if (existingLink && existingLink.textContent === "सत्संग-अंश") return;

    const href = talksLink.getAttribute("href") || "#talks";
    const targetHref = excerptsHrefFromTalksHref(href);

    const link = document.createElement("a");
    link.className = talksLink.className;
    link.removeAttribute("aria-current");
    link.setAttribute("href", targetHref);
    link.setAttribute("data-excerpts-nav-link", "true");
    link.setAttribute("aria-label", "सत्संग-अंश");
    link.textContent = "सत्संग-अंश";
    link.addEventListener("click", (event) => {
      const target = link.getAttribute("href") || "#excerpts";
      const targetUrl = new URL(target, window.location.href);

      // Because we handle the click ourselves (preventDefault below), the mobile
      // drawer would otherwise stay open — the real menu items close it as a side
      // effect of their own navigation. Close it the same way they do.
      closeMobileMenu();

      if (targetUrl.pathname !== window.location.pathname) return;

      event.preventDefault();
      openExcerptsSection();
    });

    let item;
    if (useListItem) {
      // Shallow-clone the Satsang <li> to inherit its layout classes, then drop
      // any active/current state and give it our link.
      item = talksItem.cloneNode(false);
      item.removeAttribute("id");
      item.removeAttribute("aria-current");
      item.setAttribute("data-excerpts-nav-item", "true");
      item.appendChild(link);
    } else {
      item = link;
    }
    talksItem.insertAdjacentElement("afterend", item);
  }

  function injectExploreCard() {
    document.querySelectorAll(".home-new__card-grid").forEach((grid) => {
      if (grid.querySelector('a[data-excerpts-card-link="true"]')) return;

      const talksCard = Array.from(grid.querySelectorAll("a")).find((link) =>
        (link.getAttribute("href") || "").includes("#talks"),
      );
      if (!talksCard) return;

      const link = talksCard.cloneNode(true);
      link.setAttribute("href", excerptsHrefFromTalksHref(talksCard.getAttribute("href") || "#talks"));
      link.setAttribute("data-excerpts-card-link", "true");
      link.setAttribute("aria-label", "सत्संग-अंश");

      const title = link.querySelector("strong");
      if (title) title.textContent = "सत्संग-अंश";

      const description = link.querySelector("small");
      if (description) {
        description.textContent =
          "Short selections from Pujya Swamiji's satsangs";
      }

      const action = link.querySelector("em");
      if (action) action.textContent = "सुनें →";

      talksCard.insertAdjacentElement("afterend", link);
    });
  }

  function openExcerptsSection() {
    shouldOpenPlayer = true;
    renderShell();
    init();

    window.history.replaceState(null, "", "#excerpts");
    window.setTimeout(() => {
      document.querySelector("#excerpts")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  function cachedPlaylist() {
    const cached = readJson(cacheKey, null);
    if (!cached || !Array.isArray(cached.videos) || !cached.cachedAt) return null;
    return Date.now() - Number(cached.cachedAt) < cacheMaxAgeMs ? cached : null;
  }

  async function fetchPlaylist() {
    const cached = cachedPlaylist();
    if (cached) return cached;

    const response = await fetch(
      `/api/youtube-playlist?playlistId=${encodeURIComponent(playlistId)}`,
      { headers: { accept: "application/json" } },
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "Unable to load excerpts right now.");
    }

    const payload = { ...data, cachedAt: Date.now() };
    writeJson(cacheKey, payload);
    return payload;
  }

  async function fetchStaticPlaylist() {
    const response = await fetch(staticFallbackUrl, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !Array.isArray(data.videos)) {
      throw new Error("Local excerpts list is unavailable.");
    }

    return {
      ...data,
      videos: data.videos.filter((video) => video?.id),
    };
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

  function metadataCache() {
    const cache = readJson(metadataKey, {});
    return cache && typeof cache === "object" ? cache : {};
  }

  function writeMetadataCache(cache) {
    writeJson(metadataKey, cache);
  }

  function syncPlaylistIdsFromPlayer() {
    if (!excerptsPlayer) return playlistIds;
    try {
      const items = excerptsPlayer.getPlaylist?.();
      if (Array.isArray(items) && items.length) playlistIds = items.filter(Boolean);
    } catch {
      // Playlist IDs are exposed only after YouTube finishes cueing the playlist.
    }
    return playlistIds;
  }

  function ensurePlaylistPlayer({ autoplay = false, index = 0 } = {}) {
    if (!section) return Promise.resolve(null);

    const wrap = section.querySelector(".excerpts-player-wrap");
    const nowPlaying = section.querySelector(".excerpts-now-playing");
    const youtubeLink = section.querySelector(".excerpts-youtube-open");
    wrap.hidden = false;
    nowPlaying.textContent = "Playing Satsang Ansh playlist";
    youtubeLink.href = playlistUrl;

    return loadYouTubeApi().then((YT) => {
      const playlistOptions = {
        listType: "playlist",
        list: playlistId,
        index,
      };

      if (excerptsPlayer) {
        const command = autoplay ? "loadPlaylist" : "cuePlaylist";
        excerptsPlayer[command]?.(playlistOptions);
        if (!autoplay) window.setTimeout(() => excerptsPlayer.pauseVideo?.(), 400);
        window.setTimeout(updateFallbackPlaylistList, 900);
        return excerptsPlayer;
      }

      excerptsPlayer = new YT.Player("excerpts-youtube-player", {
        width: "100%",
        height: "100%",
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            const command = autoplay ? "loadPlaylist" : "cuePlaylist";
            event.target[command]?.(playlistOptions);
            if (!autoplay) window.setTimeout(() => event.target.pauseVideo?.(), 400);
            window.setTimeout(updateFallbackPlaylistList, 900);
          },
          onStateChange: (event) => {
            window.setTimeout(updateFallbackPlaylistList, 350);
            // The fallback player can become the shared instance that a later
            // selectVideo() reuses, so it must drive progress saving too.
            syncProgressTimer(event.data);
          },
        },
      });

      return excerptsPlayer;
    });
  }

  function sourcePlaylistIdFor(video) {
    if (video?.standalone) return "";
    return video?.sourcePlaylistId || playlistId;
  }

  function youtubeHrefFor(video) {
    const base = `https://www.youtube.com/watch?v=${encodeURIComponent(video?.id || "")}`;
    const sourcePlaylistId = sourcePlaylistIdFor(video);
    return sourcePlaylistId
      ? `${base}&list=${encodeURIComponent(sourcePlaylistId)}`
      : base;
  }

  function sanitizeSeconds(value) {
    const seconds = Math.floor(Number(value) || 0);
    return seconds > 0 ? seconds : 0;
  }

  // Where to pick a saved excerpt back up — 0 if it was finished (or near enough).
  function resumeSecondsFor(video, seconds) {
    const start = sanitizeSeconds(seconds);
    if (start < resumeMinSeconds) return 0;
    const total = durationSeconds(video);
    if (total > 0 && start >= total - resumeEndGraceSeconds) return 0;
    return start;
  }

  function saveExcerptProgress() {
    if (!excerptsPlayer || !selectedVideoId) return;

    const video = videos.find((item) => item.id === selectedVideoId);
    if (!video) return;

    let seconds = 0;
    let total = 0;
    try {
      seconds = excerptsPlayer.getCurrentTime?.() || 0;
      total = excerptsPlayer.getDuration?.() || 0;
    } catch {
      return;
    }

    // The player knows the true length even when our metadata doesn't; without
    // this, finishing an excerpt would save a near-end position and "resume"
    // would drop the listener at the very end.
    if (total > 0 && seconds >= total - resumeEndGraceSeconds) seconds = 0;

    writeJson(recentKey, {
      id: video.id,
      title: video.title,
      seconds: sanitizeSeconds(seconds),
      updatedAt: Date.now(),
    });
  }

  function syncProgressTimer(state) {
    if (state === window.YT?.PlayerState?.PLAYING) {
      window.clearInterval(activeSaveTimer);
      activeSaveTimer = window.setInterval(saveExcerptProgress, progressSaveIntervalMs);
      saveExcerptProgress();
      return;
    }

    if (
      state === window.YT?.PlayerState?.PAUSED ||
      state === window.YT?.PlayerState?.ENDED
    ) {
      saveExcerptProgress();
      window.clearInterval(activeSaveTimer);
      activeSaveTimer = null;
    }
  }

  function ensureVideoPlayer(videoId, startSeconds = 0) {
    if (!section || !videoId) return Promise.resolve(null);

    const wrap = section.querySelector(".excerpts-player-wrap");
    wrap.hidden = false;

    const start = sanitizeSeconds(startSeconds);

    return loadYouTubeApi().then((YT) => {
      if (excerptsPlayer) {
        excerptsPlayer.loadVideoById?.({ videoId, startSeconds: start });
        return excerptsPlayer;
      }

      excerptsPlayer = new YT.Player("excerpts-youtube-player", {
        width: "100%",
        height: "100%",
        videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          start,
        },
        events: {
          onReady: (event) => {
            if (start > 0) event.target.seekTo?.(start, true);
            event.target.playVideo?.();
          },
          onStateChange: (event) => syncProgressTimer(event.data),
        },
      });

      return excerptsPlayer;
    });
  }

  function selectVideo(videoId, shouldScroll = true, startSeconds = 0) {
    const video = videos.find((item) => item.id === videoId);
    if (!video || !section) return;

    // Bank the outgoing excerpt's position before selectedVideoId moves on,
    // otherwise it would be filed under the excerpt we're switching to.
    if (selectedVideoId && selectedVideoId !== videoId) saveExcerptProgress();

    // Player selection logic: one shared iframe is reused and pointed at the selected video ID.
    selectedVideoId = videoId;
    const wrap = section.querySelector(".excerpts-player-wrap");
    const nowPlaying = section.querySelector(".excerpts-now-playing");
    const youtubeLink = section.querySelector(".excerpts-youtube-open");
    wrap.hidden = false;
    nowPlaying.textContent = `Now playing: ${video.title}`;
    youtubeLink.href = youtubeHrefFor(video);
    const start = resumeSecondsFor(video, startSeconds);
    ensureVideoPlayer(videoId, start);

    section.querySelectorAll(".excerpt-card").forEach((card) => {
      card.classList.toggle("is-playing", card.dataset.videoId === videoId);
    });

    // Remember the last excerpt opened + where it is (on this device only).
    writeJson(recentKey, {
      id: video.id,
      title: video.title,
      seconds: start,
      updatedAt: Date.now(),
    });
    renderRecent();

    if (shouldScroll) {
      section.querySelector("#excerpts-player-anchor")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  // A lightweight "recently listened" card: reopens the last excerpt you tapped
  // and picks up at the saved timestamp. Lives only in this browser.
  function renderRecent() {
    if (!section) return;
    const box = section.querySelector(".excerpts-recent");
    if (!box) return;

    const saved = readJson(recentKey, null);
    const video = saved && saved.id ? videos.find((item) => item.id === saved.id) : null;
    if (!video) {
      box.hidden = true;
      box.replaceChildren();
      return;
    }

    if (box.dataset.videoId !== video.id) {
      box.dataset.videoId = video.id;
      box.hidden = false;
      box.innerHTML = `
        <button type="button" class="excerpts-recent-card">
          <span class="excerpts-recent-main">▶ Resume last excerpt</span>
          <span class="excerpts-recent-detail"></span>
        </button>
        <p class="excerpts-recent-note">Saved on this device only.</p>
      `;
      // Read the position at click time — the interval keeps moving it on.
      box.querySelector(".excerpts-recent-card").addEventListener("click", () => {
        const latest = readJson(recentKey, null);
        const seconds = latest && latest.id === video.id ? latest.seconds : 0;
        selectVideo(video.id, true, seconds);
      });
    }

    // Refreshed on every render, not just on rebuild, so the timestamp stays current.
    // "— from 3:24" matches Satsang's Resume button wording exactly.
    const resumeAt = resumeSecondsFor(video, saved.seconds);
    box.querySelector(".excerpts-recent-detail").textContent = resumeAt
      ? `${video.title} — from ${formatDuration(resumeAt)}`
      : video.title;
  }

  function playPlaylistFallback(shouldScroll = true) {
    if (!section) return;

    ensurePlaylistPlayer({ autoplay: true });

    if (shouldScroll) {
      section.querySelector("#excerpts-player-anchor")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function durationSeconds(video) {
    const seconds = Number(video?.duration?.seconds);
    return Number.isFinite(seconds) ? seconds : 0;
  }

  function formatDuration(seconds) {
    const clean = Math.max(0, Number(seconds) || 0);
    const hours = Math.floor(clean / 3600);
    const minutes = Math.floor((clean % 3600) / 60);
    const remainingSeconds = clean % 60;
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    }
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  function durationLabel(seconds) {
    const clean = Math.max(0, Number(seconds) || 0);
    if (clean <= 0) return "Short excerpt";
    return `${Math.max(1, Math.round(clean / 60))} min`;
  }

  function normalizeVideo(video) {
    const seconds = durationSeconds(video);
    return {
      ...video,
      duration: {
        seconds,
        display: video?.duration?.display || formatDuration(seconds),
        label: video?.duration?.label || durationLabel(seconds),
      },
    };
  }

  function matchesDurationFilter(video, filter) {
    if (!filter || filter.key === "all") return true;
    const seconds = durationSeconds(video);
    if (Number.isFinite(filter.min) && seconds <= filter.min) return false;
    if (Number.isFinite(filter.max) && seconds > filter.max) return false;
    return true;
  }

  function filteredVideos() {
    const filter = durationFilters.find((item) => item.key === activeDurationFilter) || durationFilters[0];
    return videos.filter((video) => matchesDurationFilter(video, filter));
  }

  function renderDurationTabs() {
    if (!section) return;
    const tabs = section.querySelector(".excerpts-duration-tabs");
    if (!tabs) return;

    // प्रकरण tab — sits alongside the duration tabs; shows the topic-wise playlists.
    const prakaranTab = createEl(
      "button",
      "excerpts-duration-tab excerpts-tab-prakaran",
      `Playlists (${excerptPlaylists.length})`,
    );
    prakaranTab.type = "button";
    prakaranTab.setAttribute("role", "tab");
    prakaranTab.setAttribute("aria-selected", String(activeDurationFilter === "prakaran"));
    prakaranTab.classList.toggle("is-active", activeDurationFilter === "prakaran");
    prakaranTab.addEventListener("click", () => {
      activeDurationFilter = "prakaran";
      listExpanded = false;
      renderLists();
    });

    tabs.replaceChildren(
      ...durationFilters.map((filter) => {
        const count = videos.filter((video) => matchesDurationFilter(video, filter)).length;
        const button = createEl("button", "excerpts-duration-tab", `${filter.label} (${count})`);
        button.type = "button";
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", String(filter.key === activeDurationFilter));
        button.classList.toggle("is-active", filter.key === activeDurationFilter);
        button.addEventListener("click", () => {
          activeDurationFilter = filter.key;
          listExpanded = false;
          renderLists();
        });
        return button;
      }),
      prakaranTab,
    );
  }

  function updateStatusSummary() {
    if (!section || !videos.length) return;
    const status = section.querySelector(".excerpts-status");
    const filter = durationFilters.find((item) => item.key === activeDurationFilter) || durationFilters[0];
    const shown = filteredVideos().length;
    const rangeText = filter.key === "all" ? "all durations" : filter.label;
    status.textContent = `${shown} of ${videos.length} talks shown (${rangeText}), sorted shortest to longest.`;
  }

  function renderCard(video) {
    const card = createEl("article", "excerpt-card");
    card.dataset.videoId = video.id;
    if (video.id === selectedVideoId) card.classList.add("is-playing");

    const durationDisplay = video.duration?.display || "";
    card.innerHTML = `
      <button type="button" class="excerpt-main" aria-label="${escapeHtml(`Play: ${video.title}`)}">
        <span class="excerpt-play-icon" aria-hidden="true">▶</span>
        <span class="excerpt-title">${escapeHtml(video.title)}</span>
        ${durationDisplay ? `<span class="excerpt-duration">${escapeHtml(durationDisplay)}</span>` : ""}
      </button>
      <div class="excerpt-actions">
        <a class="excerpt-youtube-link" href="${youtubeHrefFor(video)}" target="_blank" rel="noopener noreferrer">YouTube</a>
      </div>
    `;

    card.querySelector(".excerpt-main").addEventListener("click", () => selectVideo(video.id));
    return card;
  }

  function renderShowMoreToggle(total, collapsed) {
    // "collapsed" means only the first `collapsedCount` rows are showing.
    // Clicking expands the full list; clicking again collapses it back.
    const button = createEl(
      "button",
      "excerpts-show-more",
      collapsed ? `Show all ${total} excerpts` : "Show fewer",
    );
    button.type = "button";
    button.setAttribute("aria-expanded", String(!collapsed));
    button.addEventListener("click", () => {
      listExpanded = collapsed;
      renderLists();
      if (!listExpanded) {
        section.querySelector(".excerpts-list")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
    return button;
  }

  function renderLists() {
    if (!section) return;
    const list = section.querySelector(".excerpts-list");

    renderDurationTabs();

    if (activeDurationFilter === "prakaran") {
      list.replaceChildren(buildPlaylistGrid());
      const status = section.querySelector(".excerpts-status");
      if (status) {
        status.textContent = "विषय अनुसार पूर्ण सत्संग शृंखला — सुनने के लिए किसी प्रकरण को चुनें।";
      }
    } else {
      const visibleVideos = filteredVideos();
      if (visibleVideos.length) {
        const collapsed = !listExpanded && visibleVideos.length > collapsedCount;
        const shownVideos = collapsed ? visibleVideos.slice(0, collapsedCount) : visibleVideos;
        const children = shownVideos.map((video) => renderCard(video));
        if (visibleVideos.length > collapsedCount) {
          children.push(renderShowMoreToggle(visibleVideos.length, collapsed));
        }
        list.replaceChildren(...children);
      } else {
        list.replaceChildren(createEl("p", "excerpts-empty", "No talks in this duration yet."));
      }
      updateStatusSummary();
    }

    renderRecent();
  }

  function applyPlaylistData(data, statusMessage = "") {
    const seen = new Set();
    videos = Array.isArray(data.videos)
      ? data.videos
          .filter((video) => video?.id && !seen.has(video.id) && seen.add(video.id))
          .map(normalizeVideo)
          .sort(
            (left, right) =>
              durationSeconds(left) - durationSeconds(right) ||
              String(left.title || "").localeCompare(String(right.title || "")),
          )
      : [];
    if (videos.length === 0) return false;

    const status = section?.querySelector(".excerpts-status");
    if (status) status.textContent = statusMessage;
    renderLists();
    return true;
  }

  function currentFallbackIndex() {
    try {
      const index = excerptsPlayer?.getPlaylistIndex?.();
      return Number.isFinite(index) && index >= 0 ? index : 0;
    } catch {
      return 0;
    }
  }

  function fallbackVideoFromId(videoId, index) {
    const cached = metadataCache()[videoId] || {};
    return {
      id: videoId,
      title: cached.title || `Excerpt ${index + 1}`,
      thumbnail: cached.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      duration: cached.duration || {
        display: "...",
        label: "Duration appears after YouTube API setup",
      },
      fallback: true,
    };
  }

  function updateFallbackPlaylistList() {
    if (!section) return;

    const ids = syncPlaylistIdsFromPlayer();
    const status = section.querySelector(".excerpts-status");
    if (!ids.length) {
      status.innerHTML = `
        <strong>Loading playlist list...</strong>
        <span>The talks are being read from the shared YouTube player.</span>
      `;
      return;
    }

    const hasDetailedApiData = videos.some((video) => video && video.fallback !== true);
    if (!hasDetailedApiData) {
      videos = ids.map((videoId, index) => fallbackVideoFromId(videoId, index));
    }

    const playerIndex = currentFallbackIndex();
    if (ids[playerIndex]) selectedVideoId = ids[playerIndex];

    const selected = videos.find((video) => video.id === selectedVideoId);
    if (selected) {
      section.querySelector(".excerpts-now-playing").textContent = `Now playing: ${selected.title}`;
      section.querySelector(".excerpts-youtube-open").href =
        `https://www.youtube.com/watch?v=${encodeURIComponent(selected.id)}&list=${encodeURIComponent(playlistId)}`;
    }

    if (!hasDetailedApiData) {
      status.innerHTML = `
        <strong>${videos.length} excerpts loaded.</strong>
        <span>Exact duration badges need the YouTube API key; the list will keep working in this browser.</span>
      `;
      resolveFallbackMetadata(ids);
    }

    renderLists();
  }

  function resolveFallbackMetadata(ids) {
    if (metadataResolveTimer !== null) window.clearTimeout(metadataResolveTimer);
    metadataResolveTimer = window.setTimeout(() => {
      loadFallbackMetadata(ids);
    }, 150);
  }

  async function loadFallbackMetadata(ids) {
    const cache = metadataCache();
    const missing = ids.filter((id) => !cache[id]?.title);
    if (!missing.length) return;

    for (const videoId of missing) {
      try {
        const response = await fetch(
          `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`,
        );
        if (!response.ok) continue;
        const data = await response.json();
        cache[videoId] = {
          ...cache[videoId],
          title: data.title || cache[videoId]?.title,
          thumbnail: data.thumbnail_url || cache[videoId]?.thumbnail,
        };
      } catch {
        // oEmbed is best-effort; the ID list and thumbnails still work without it.
      }
    }

    writeMetadataCache(cache);
    if (!section) return;

    const currentIds = playlistIds.length ? playlistIds : ids;
    const hasDetailedApiData = videos.some((video) => video && video.fallback !== true);
    if (!hasDetailedApiData) {
      videos = currentIds.map((videoId, index) => fallbackVideoFromId(videoId, index));
      renderLists();
    }
  }

  function renderPlaylistFallback(message = "") {
    if (!section) return;

    const status = section.querySelector(".excerpts-status");
    const list = section.querySelector(".excerpts-list");

    if (playlistIds.length) {
      updateFallbackPlaylistList();
      return;
    }

    status.innerHTML = `
      <strong>Playlist player is ready.</strong>
      <span>${escapeHtml(message || "The detailed excerpt list will appear after the YouTube API key is configured.")}</span>
    `;

    const card = createEl("article", "excerpt-card excerpt-card--playlist");
    card.innerHTML = `
      <button type="button" class="excerpt-main">
        <span class="excerpt-play-icon" aria-hidden="true">▶</span>
        <span class="excerpt-title">Satsang Ansh playlist</span>
        <span class="excerpt-duration">Playlist</span>
      </button>
      <p class="excerpt-playlist-note">Short excerpts from spiritual talks. Detailed titles and durations need the YouTube Data API key.</p>
      <div class="excerpt-actions">
        <a class="excerpt-youtube-link" href="${playlistUrl}" target="_blank" rel="noopener noreferrer">YouTube पर खोलें</a>
      </div>
    `;
    card.querySelector(".excerpt-main").addEventListener("click", () => playPlaylistFallback());
    list.replaceChildren(card);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function init() {
    renderShell();
    if (!section || !section.isConnected || initStarted || section.dataset.excerptsReady === "true") return;
    initStarted = true;
    section.dataset.excerptsReady = "true";

    const status = section.querySelector(".excerpts-status");
    status.textContent = "Loading excerpts...";

    try {
      const data = await fetchStaticPlaylist();
      if (applyPlaylistData(data, "")) return;
    } catch {
      // Fall through to the API route if the bundled list is unavailable.
    }

    try {
      const data = await fetchPlaylist();
      const message = data.unavailableCount
        ? `${data.unavailableCount} unavailable video${data.unavailableCount === 1 ? "" : "s"} skipped quietly.`
        : "";
      if (applyPlaylistData(data, message)) return;
    } catch (error) {
      renderPlaylistFallback(error.message || "Detailed list is unavailable right now.");
    }
  }

  function scheduleInit() {
    injectNavLink();
    injectExploreCard();
    init();
    stopObserverIfReady();
    if (section?.isConnected) return;

    // Stop polling after a while. On pages without Satsang (the immersive home
    // page) the section is intentionally never placed; the persistent observer
    // still handles it if the visitor navigates to a page that has Satsang.
    if (initRetries >= 40) return;
    initRetries += 1;
    if (retryTimer !== null) window.clearTimeout(retryTimer);
    retryTimer = window.setTimeout(scheduleInit, 350);
  }

  function startObserver() {
    if (observer || !document.body) return;
    let scheduled = false;
    const run = () => {
      scheduled = false;
      injectNavLink();
      injectExploreCard();
      // Keep the section anchored right after Satsang. React can re-render #talks
      // (or render it after we first placed the section), which would otherwise
      // leave our section orphaned at the end of the page. positionSection() only
      // moves it when it is not already immediately after #talks, so this stays a
      // no-op once it is in the right place (no observer feedback loop).
      positionSection();
      // Self-heal: the site is a React app and the excerpts section is injected
      // into React's DOM (right after #talks). Whenever React re-renders — e.g.
      // when the visitor navigates between sections — it discards our injected
      // node. Detect that the section is gone OR detached from the page and
      // rebuild + repopulate it, instead of only checking for a null reference.
      if (!section || !section.isConnected) {
        initStarted = false;
        init();
      }
    };
    observer = new MutationObserver(() => {
      // Coalesce mutation bursts into a single frame to stay light on the SPA.
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(run);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // The observer intentionally stays connected for the lifetime of the page:
  // the mobile menu is rendered on demand (inside a Sheet), so the सत्संग-अंश
  // nav link must be re-injected every time that menu opens.
  function stopObserverIfReady() {}

  // Catch the position when the tab closes or the app is backgrounded on a phone
  // (pagehide/visibilitychange fire on iOS where beforeunload often doesn't).
  window.addEventListener("beforeunload", saveExcerptProgress);
  window.addEventListener("pagehide", saveExcerptProgress);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") saveExcerptProgress();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      startObserver();
      scheduleInit();
    });
  } else {
    startObserver();
    scheduleInit();
  }
})();
