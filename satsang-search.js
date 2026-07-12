(() => {
  // Free-text search for the Satsang (#talks) section only — NOT Satsang-Ansh.
  // The talks are React-rendered one category at a time, so a DOM filter alone
  // can't search across categories. Instead this loads the full talks list from
  // /data/satsang-talks.json and shows matching results across ALL categories.
  // Searching matches title + place + year + category, so talks with a missing
  // city are still found. Typing shows a results panel; clearing restores the
  // normal category view.
  const DATA_URL = "/data/satsang-talks.json";
  const PLACEHOLDER = "सत्संग खोजें — नाम, स्थान या वर्ष…";

  let talks = [];
  let loaded = false;
  let query = "";
  let bar = null;
  let panel = null;
  let input = null;
  let clearBtn = null;
  let countEl = null;
  let listEl = null;

  function norm(v) {
    return String(v || "").toLowerCase();
  }

  // Rough Devanagari -> Roman transliteration so Hindi-titled talks (उत्तरकाण्ड,
  // केवट प्रसंग) are findable by typing "uttarkand", "kevat prasang", etc.
  const DEV_CONS = {
    "क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "ng",
    "च": "ch", "छ": "chh", "ज": "j", "झ": "jh", "ञ": "ny",
    "ट": "t", "ठ": "th", "ड": "d", "ढ": "dh", "ण": "n",
    "त": "t", "थ": "th", "द": "d", "ध": "dh", "न": "n",
    "प": "p", "फ": "ph", "ब": "b", "भ": "bh", "म": "m",
    "य": "y", "र": "r", "ल": "l", "व": "v", "ळ": "l",
    "श": "sh", "ष": "sh", "स": "s", "ह": "h",
  };
  const DEV_VOWEL = {
    "अ": "a", "आ": "aa", "इ": "i", "ई": "ii", "उ": "u", "ऊ": "uu",
    "ऋ": "ri", "ए": "e", "ऐ": "ai", "ओ": "o", "औ": "au", "ॐ": "om",
  };
  const DEV_MATRA = {
    "ा": "aa", "ि": "i", "ी": "ii", "ु": "u", "ू": "uu", "ृ": "ri",
    "े": "e", "ै": "ai", "ो": "o", "ौ": "au",
  };

  function devToLatin(str) {
    const chars = Array.from(String(str || ""));
    let out = "";
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      if (DEV_CONS[ch]) {
        out += DEV_CONS[ch];
        const next = chars[i + 1];
        if (next === "्") {
          i++;
        } else if (DEV_MATRA[next]) {
          out += DEV_MATRA[next];
          i++;
        } else {
          out += "a";
        }
      } else if (DEV_VOWEL[ch]) {
        out += DEV_VOWEL[ch];
      } else if (DEV_MATRA[ch]) {
        out += DEV_MATRA[ch];
      } else if (ch === "ं" || ch === "ँ") {
        out += "n";
      } else if (ch === "ः") {
        out += "h";
      } else if (ch !== "्") {
        out += ch;
      }
    }
    return out;
  }

  // Vowel-stripped "skeleton" so loose spellings match (uttarkand ~ uttarakaanda).
  function stripVowels(s) {
    return String(s || "").replace(/[aeiou]/g, "");
  }

  function escapeHtml(v) {
    return String(v || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  async function loadTalks() {
    if (loaded) return;
    try {
      const res = await fetch(DATA_URL, { headers: { accept: "application/json" } });
      const data = await res.json();
      if (Array.isArray(data)) {
        talks = data
          .filter((t) => t && t.title && t.youtubeUrl)
          .map((t) => {
            // Search text = original title (Devanagari or Roman) + a Roman
            // transliteration of the title + place/year/category.
            const text = norm(
              [t.title, devToLatin(t.title), t.location, t.year, t.category]
                .filter(Boolean)
                .join(" "),
            );
            return { ...t, _text: text, _skel: stripVowels(text) };
          });
        loaded = true;
        if (query) render();
      }
    } catch {
      // If the list can't load, the box simply finds nothing — never breaks.
    }
  }

  function matches() {
    const q = norm(query.trim());
    if (!q) return [];
    const terms = q.split(/\s+/).filter(Boolean);
    return talks.filter((t) =>
      terms.every((term) => {
        if (t._text.includes(term)) return true;
        // Fallback: vowel-loose match (e.g. "uttarkand" -> "ttrknd"), only for
        // longer terms so short queries don't over-match.
        const sk = stripVowels(term);
        return sk.length >= 4 && t._skel.includes(sk);
      }),
    );
  }

  function render() {
    const talksSection = document.getElementById("talks");
    if (!panel || !talksSection) return;

    const q = query.trim();
    if (!q) {
      talksSection.classList.remove("satsang-searching");
      panel.hidden = true;
      if (countEl) countEl.textContent = "";
      return;
    }

    talksSection.classList.add("satsang-searching");
    panel.hidden = false;

    if (!loaded) {
      if (countEl) countEl.textContent = "…";
      if (listEl) listEl.innerHTML = "";
      return;
    }

    const results = matches();
    if (countEl) countEl.textContent = results.length + (results.length === 1 ? " talk" : " talks");

    if (!listEl) return;
    if (results.length === 0) {
      listEl.innerHTML =
        '<p class="satsang-search-empty">No talks found for “' + escapeHtml(q) + '”.</p>';
      return;
    }
    listEl.innerHTML = results
      .map((t) => {
        const meta = [t.location, t.year, t.category].filter(Boolean).join(" · ");
        return (
          '<a class="satsang-search-result" href="' +
          escapeHtml(t.youtubeUrl) +
          '" data-title="' + escapeHtml(t.title) + '"' +
          ' data-category="' + escapeHtml(t.category || "") + '"' +
          ' target="_blank" rel="noopener noreferrer">' +
          '<span class="satsang-search-play" aria-hidden="true">▶</span>' +
          '<span class="satsang-search-copy">' +
          '<span class="satsang-search-title">' +
          escapeHtml(t.title) +
          "</span>" +
          (meta ? '<span class="satsang-search-meta">' + escapeHtml(meta) + "</span>" : "") +
          "</span></a>"
        );
      })
      .join("");
  }

  function buildUI() {
    bar = document.createElement("div");
    bar.className = "satsang-search-bar";
    bar.innerHTML =
      '<div class="satsang-search-field">' +
      '<span class="satsang-search-icon" aria-hidden="true">🔍</span>' +
      '<input type="search" class="satsang-search-input" aria-label="Search Satsang talks" autocomplete="off" placeholder="' +
      PLACEHOLDER +
      '">' +
      '<button type="button" class="satsang-search-clear" aria-label="Clear search" hidden>✕</button>' +
      "</div>" +
      '<span class="satsang-search-count" aria-live="polite"></span>';

    input = bar.querySelector(".satsang-search-input");
    clearBtn = bar.querySelector(".satsang-search-clear");
    countEl = bar.querySelector(".satsang-search-count");

    input.addEventListener("focus", loadTalks);
    input.addEventListener("input", () => {
      query = input.value;
      clearBtn.hidden = !query;
      loadTalks();
      render();
    });
    clearBtn.addEventListener("click", () => {
      input.value = "";
      query = "";
      clearBtn.hidden = true;
      render();
      input.focus();
    });

    panel = document.createElement("div");
    panel.className = "satsang-search-results";
    panel.hidden = true;
    panel.innerHTML = '<div class="satsang-search-list"></div>';
    listEl = panel.querySelector(".satsang-search-list");

    // Open results in the SAME integrated in-app player as the normal list.
    // Only fall back to the YouTube link if the player can't be opened.
    panel.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return; // let modifier / middle clicks open YouTube in a new tab
      }
      const link = event.target.closest("a.satsang-search-result");
      if (!link) return;
      const player = window.SatsangPlayer;
      if (player && typeof player.playByUrl === "function") {
        const opened = player.playByUrl(link.href, {
          title: link.dataset.title,
          category: link.dataset.category,
        });
        if (opened) event.preventDefault();
      }
    });
  }

  function ensureInjected() {
    const talksSection = document.getElementById("talks");
    if (!talksSection) return;
    const container = talksSection.querySelector(".container") || talksSection;
    if (!bar) buildUI();

    if (!bar.isConnected) {
      const tabs = container.querySelector(".mb-7.overflow-x-auto");
      const header = container.querySelector(".mb-8.text-center");
      if (tabs) tabs.insertAdjacentElement("beforebegin", bar);
      else if (header) header.insertAdjacentElement("afterend", bar);
      else container.prepend(bar);
      if (input && query) input.value = query;
    }
    if (!panel.isConnected && bar.isConnected) {
      bar.insertAdjacentElement("afterend", panel);
    }
  }

  function start() {
    ensureInjected();
    let scheduled = false;
    const observer = new MutationObserver(() => {
      // Satsang is a React section; when it re-renders (e.g. on category change)
      // it can discard our injected search bar/panel. Re-insert it and re-apply
      // the current query. positionSection-style: cheap and idempotent.
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        scheduled = false;
        ensureInjected();
        if (query) render();
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
