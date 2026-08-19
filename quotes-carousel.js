(() => {
  /*
    Divya Vani — daily quote carousel (सुविचार / दिव्य वाणी).

    Standalone, no React: this owns the quote card so quotes can be added by
    editing the QUOTES list below — no need to touch the compiled app bundle.

    The original quote set is keyed to day-of-month (1–31). Month-specific sets
    can override it so a new month has its own maintained dates. The card shows
    a top bar (Month · Weekday · dd-mm-yyyy), the quote photo, and Prev/Next plus a
    date input to jump directly to any date. It replaces the old month-grid
    calendar (which is hidden via CSS in section-banner-overrides.css).

    TO ADD A QUOTE: drop the image in /assets and add a line here, e.g.
      { day: 14, img: "/assets/quote-my-new-one.jpg" },
  */
  const QUOTES = [
    { day: 1, img: "/assets/quote-shraddha.jpg" },
    { day: 2, img: "/assets/quote-dharma-phal.jpg" },
    { day: 3, img: "/assets2/quote-03-0307.jpg" },
    { day: 4, img: "/assets/q2.jpg" },
    { day: 5, img: "/assets2/quote-05-q5.jpg" },
    { day: 6, img: "/assets/q4.jpg" },
    { day: 7, img: "/assets/q5.jpg" },
    { day: 8, img: "/assets/q6-Qg4oN5Gs.jpg" },
    { day: 9, img: "/assets/q7-C1Mw4EzS.jpg" },
    { day: 10, img: "/assets/q8-BRHd3t21.jpg" },
    { day: 11, img: "/assets/q9-kbM3csHm.jpg" },
    { day: 12, img: "/assets/q10.jpg" },
    { day: 13, img: "/assets/quote-jap-mahima.jpg" },
    { day: 14, img: "/assets/quote-chitrakoot.jpg" },
    { day: 15, img: "/assets/quote-sundar.jpg" },
    { day: 16, img: "/assets/quote-16-revised.jpg" },
    { day: 17, img: "/assets/q17.jpg" },
    { day: 18, img: "/assets/q18.jpg" },
    { day: 19, img: "/assets2/q19.jpg" },
    { day: 20, img: "/assets/q20.jpg" },
    { day: 21, img: "/assets2/quote-21.jpg" },
    { day: 22, img: "/assets2/quote-22.jpg" },
    { day: 23, img: "/assets2/quote-23.jpg" },
    { day: 24, img: "/assets2/quote-24.jpg" },
    { day: 25, img: "/assets2/quote-25.jpg" },
    { day: 26, img: "/assets2/quote-26.jpg" },
    { day: 27, img: "/assets2/quote-27-20260728.jpg" },
    { day: 28, img: "/assets2/quote-28-20260728.jpg" },
    { day: 29, img: "/assets2/quote-29-20260728.jpg" },
    { day: 30, img: "/assets2/quote-30-20260728.jpg" },
    { day: 31, img: "/assets2/quote-31-20260728.jpg" },
  ].sort((a, b) => a.day - b.day);

  const MONTHLY_QUOTES = [
    { year: 2026, month: 8, day: 1, img: "/assets2/quote-2026-08-01.jpg" },
    { year: 2026, month: 8, day: 2, img: "/assets2/quote-2026-08-02.jpg" },
    { year: 2026, month: 8, day: 3, img: "/assets2/quote-2026-08-03.jpg" },
    { year: 2026, month: 8, day: 4, img: "/assets2/quote-2026-08-04.jpg" },
    { year: 2026, month: 8, day: 5, img: "/assets2/quote-2026-08-05.jpg" },
    {
      year: 2026,
      month: 8,
      day: 6,
      img: "/assets2/quote-2026-08-06-hi.jpg",
      imgEn: "/assets2/quote-2026-08-06-en.jpg",
    },
    { year: 2026, month: 8, day: 7, img: "/assets2/quote-2026-08-06.jpg" },
    {
      year: 2026,
      month: 8,
      day: 8,
      img: "/assets2/quote-2026-08-08-hi.jpg",
      imgEn: "/assets2/quote-2026-08-08-en.jpg",
    },
    {
      year: 2026,
      month: 8,
      day: 9,
      img: "/assets2/quote-2026-08-09-hi.jpg",
    },
    {
      year: 2026,
      month: 8,
      day: 10,
      img: "/assets2/quote-2026-08-11-hi.jpg",
    },
    {
      year: 2026,
      month: 8,
      day: 11,
      img: "/assets2/quote-2026-08-10-hi.jpg",
    },
    {
      year: 2026,
      month: 8,
      day: 12,
      img: "/assets2/quote-2026-08-12-hi.jpg",
    },
    {
      year: 2026,
      month: 8,
      day: 13,
      img: "/assets2/quote-2026-08-13-hi.jpg",
    },
    {
      year: 2026,
      month: 8,
      day: 14,
      img: "/assets2/quote-2026-08-14-hi.jpg",
    },
    {
      year: 2026,
      month: 8,
      day: 15,
      img: "/assets2/quote-2026-08-15-hi.jpg",
      imgEn: "/assets2/quote-2026-08-15-en.jpg",
    },
    {
      year: 2026,
      month: 8,
      day: 16,
      img: "/assets2/quote-2026-08-16-hi.jpg",
    },
    {
      year: 2026,
      month: 8,
      day: 17,
      img: "/assets2/quote-2026-08-17-hi.jpg",
    },
    {
      year: 2026,
      month: 8,
      day: 18,
      img: "/assets2/quote-2026-08-18-hi.jpg",
      imgEn: "/assets2/quote-2026-08-18-en.jpg",
    },
    {
      year: 2026,
      month: 8,
      day: 19,
      img: "/assets2/quote-2026-08-19-hi.jpg",
    },
    {
      year: 2026,
      month: 8,
      day: 20,
      img: "/assets2/quote-2026-08-20-hi.jpg",
    },
    {
      year: 2026,
      month: 8,
      day: 21,
      img: "/assets2/quote-2026-08-21-hi.jpg",
    },
  ];

  let activeQuotes = QUOTES;
  let allDays = QUOTES.map((q) => q.day).sort((a, b) => a - b);
  const maintainedMonths = [
    { year: 2026, month: 6 }, // Original July collection
    ...MONTHLY_QUOTES.map((quote) => ({
      year: quote.year,
      month: quote.month - 1,
    })),
  ]
    .filter(
      (entry, index, all) =>
        all.findIndex(
          (candidate) =>
            candidate.year === entry.year &&
            candidate.month === entry.month,
        ) === index,
    )
    .sort(
      (a, b) =>
        a.year * 12 + a.month - (b.year * 12 + b.month),
    );

  // Live date state. Reveal quotes only UP TO today's date, so you can upload a
  // whole month's quotes in advance and each day automatically unlocks that day's
  // quote from the visitor's system date — no redeploy, and (via the timer in
  // start()) no refresh needed even if the app stays open past midnight. Previous
  // days remain browsable; only future days are hidden.
  let currentYear, currentMonth, today;
  let revealYear, revealMonth, revealDay;
  let year, month, monthName, days;
  let activeLanguage = "hi";

  // From 5 PM local device time, allow previewing the following day's quote.
  function revealedThroughDay(targetYear = year, targetMonth = month) {
    const targetIndex = targetYear * 12 + targetMonth;
    const revealIndex = revealYear * 12 + revealMonth;
    if (targetIndex < revealIndex) return Number.POSITIVE_INFINITY;
    if (targetIndex > revealIndex) return 0;
    return revealDay;
  }

  function quoteImage(quote) {
    return activeLanguage === "en" && quote?.imgEn ? quote.imgEn : quote?.img;
  }

  function quotesForMonth(targetYear, targetMonth) {
    if (targetYear === 2026 && targetMonth === 6) return QUOTES;
    return MONTHLY_QUOTES.filter(
      (quote) =>
        quote.year === targetYear && quote.month === targetMonth + 1,
    );
  }

  function setMonthState(targetYear, targetMonth) {
    year = targetYear;
    month = targetMonth;
    monthName = new Date(year, month, 1).toLocaleString("en-US", {
      month: "long",
    });
    activeQuotes = quotesForMonth(year, month);
    allDays = activeQuotes
      .map((quote) => quote.day)
      .sort((a, b) => a - b);
    days = allDays.filter((day) => day <= revealedThroughDay(year, month));
  }

  function refreshDateState() {
    const d = new Date();
    currentYear = d.getFullYear();
    currentMonth = d.getMonth();
    today = d.getDate();
    const revealDate = new Date(d);
    if (d.getHours() >= 17) revealDate.setDate(revealDate.getDate() + 1);
    revealYear = revealDate.getFullYear();
    revealMonth = revealDate.getMonth();
    revealDay = revealDate.getDate();
    if (year === undefined || month === undefined) {
      const currentIsMaintained =
        monthIndex(currentYear, currentMonth) >= 0;
      const latestMaintained =
        maintainedMonths[maintainedMonths.length - 1];
      year = currentIsMaintained
        ? currentYear
        : latestMaintained.year;
      month = currentIsMaintained
        ? currentMonth
        : latestMaintained.month;
    }
    setMonthState(year, month);
  }
  refreshDateState();

  // Open on today's quote (or the latest day revealed so far).
  let selectedDay = nearestDay(today);

  function quoteFor(day) {
    return activeQuotes.find((q) => q.day === day);
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function nearestDay(target) {
    if (!days.length) return null;
    if (days.includes(target)) return target;
    return days.reduce(
      (best, d) => (Math.abs(d - target) < Math.abs(best - target) ? d : best),
      days[0],
    );
  }

  function monthIndex(targetYear, targetMonth) {
    return maintainedMonths.findIndex(
      (entry) =>
        entry.year === targetYear && entry.month === targetMonth,
    );
  }

  function openAdjacentMonth(card, direction) {
    const index = monthIndex(year, month);
    const target = maintainedMonths[index + direction];
    if (!target) return false;
    setMonthState(target.year, target.month);
    if (!days.length) return false;
    selectedDay = direction < 0 ? days[days.length - 1] : days[0];
    render(card);
    return true;
  }

  function render(card) {
    const quote = quoteFor(selectedDay);
    if (!quote?.imgEn) activeLanguage = "hi";
    const d = new Date(year, month, selectedDay);
    const weekday = d.toLocaleString("en-US", { weekday: "long" });
    const dmy = `${pad(selectedDay)}-${pad(month + 1)}-${year}`;
    const inputValue = `${year}-${pad(month + 1)}-${pad(selectedDay)}`;
    const index = days.indexOf(selectedDay);

    card.innerHTML = `
      <div class="dv-topbar">
        <span class="dv-month">${monthName} ${year}</span>
        <span class="dv-mantra">ॐ श्री सद्गुरवे नमः</span>
        <span class="dv-daydate">
          <span class="dv-weekday">${weekday}</span>
          <span class="dv-date">${dmy}</span>
        </span>
      </div>
      ${
        quote?.imgEn
          ? `<div class="dv-language-row">
              <button type="button" class="dv-language-toggle" aria-label="Show English quote">English</button>
            </div>`
          : ""
      }
      <div class="dv-photo-wrap">
        <img class="dv-photo" src="${quoteImage(quote) || ""}" alt="पूज्य स्वामीजी का सुविचार" decoding="async">
      </div>
      <div class="dv-controls">
        <button type="button" class="dv-nav dv-prev" aria-label="Previous quote">‹</button>
        <input type="date" class="dv-input" value="${inputValue}" min="2026-07-01" max="${revealYear}-${pad(revealMonth + 1)}-${pad(revealDay)}" aria-label="Choose a date">
        <button type="button" class="dv-nav dv-next" aria-label="Next quote">›</button>
      </div>
      <p class="dv-count">${index + 1} / ${days.length}</p>
      <button type="button" class="dv-share" aria-label="इस कार्ड की तस्वीर शेयर करें">📤 कार्ड शेयर करें</button>
    `;

    // If a day's image is missing/fails (e.g. uploaded a day ahead of its file),
    // drop that day and fall back to the previous one so the card is never blank.
    card.querySelector(".dv-photo").addEventListener(
      "error",
      () => {
        if (days.length <= 1) return;
        const i = days.indexOf(selectedDay);
        days = days.filter((d) => d !== selectedDay);
        selectedDay = days[Math.max(0, Math.min(i - 1, days.length - 1))];
        render(card);
      },
      { once: true },
    );

    // Move to the adjacent day and STOP at the ends (no wrap-around, which felt
    // jarring). Buttons disable at the first/last available day. Navigation
    // patches the card in place (patchCard) rather than rebuilding it, so the
    // arrow keeps focus and the photo cross-fades instead of the whole card
    // blinking and collapsing on every click.
    const prevBtn = card.querySelector(".dv-prev");
    const nextBtn = card.querySelector(".dv-next");
    prevBtn.disabled = index <= 0 && monthIndex(year, month) <= 0;
    nextBtn.disabled =
      index >= days.length - 1 &&
      monthIndex(year, month) >= maintainedMonths.length - 1;
    prevBtn.addEventListener("click", () => {
      const i = days.indexOf(selectedDay);
      activeLanguage = "hi";
      if (i > 0) {
        selectedDay = days[i - 1];
        patchCard(card);
      } else {
        openAdjacentMonth(card, -1);
      }
    });
    nextBtn.addEventListener("click", () => {
      const i = days.indexOf(selectedDay);
      activeLanguage = "hi";
      if (i < days.length - 1) {
        selectedDay = days[i + 1];
        patchCard(card);
      } else {
        openAdjacentMonth(card, 1);
      }
    });
    card.querySelector(".dv-input").addEventListener("change", (event) => {
      const value = event.target.value; // yyyy-mm-dd
      if (!value) return;
      const targetYear = Number(value.slice(0, 4));
      const targetMonth = Number(value.slice(5, 7)) - 1;
      if (monthIndex(targetYear, targetMonth) < 0) {
        event.target.value = inputValue;
        return;
      }
      setMonthState(targetYear, targetMonth);
      selectedDay = nearestDay(Number(value.slice(8, 10)));
      activeLanguage = "hi";
      render(card);
    });

    const languageBtn = card.querySelector(".dv-language-toggle");
    if (languageBtn) {
      languageBtn.addEventListener("click", () => {
        activeLanguage = activeLanguage === "hi" ? "en" : "hi";
        const image = card.querySelector(".dv-photo");
        const source = quoteImage(quote);
        languageBtn.textContent =
          activeLanguage === "hi" ? "English" : "हिंदी";
        languageBtn.setAttribute(
          "aria-label",
          activeLanguage === "hi" ? "Show English quote" : "हिंदी सुविचार दिखाएँ",
        );
        if (image && source) image.src = source;
      });
    }

    const shareBtn = card.querySelector(".dv-share");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => exportCardImage(shareBtn));
    }
  }

  // In-place update used when navigating between days (prev/next/date-picker).
  // Unlike render(), this does NOT rebuild the card's HTML — it only touches the
  // bits that change and cross-fades the photo, so the arrow you clicked keeps
  // focus, the card doesn't blink, and the photo box doesn't collapse to zero
  // height while the next image loads (the old "not smooth" jump).
  function patchCard(card) {
    const img = card.querySelector(".dv-photo");
    // If the expected structure isn't there for any reason, fall back to a full
    // rebuild so navigation still works.
    if (!img) {
      render(card);
      return;
    }

    const quote = quoteFor(selectedDay);
    const d = new Date(year, month, selectedDay);
    const weekday = d.toLocaleString("en-US", { weekday: "long" });
    const dmy = `${pad(selectedDay)}-${pad(month + 1)}-${year}`;
    const inputValue = `${year}-${pad(month + 1)}-${pad(selectedDay)}`;
    const index = days.indexOf(selectedDay);

    const setText = (sel, text) => {
      const el = card.querySelector(sel);
      if (el) el.textContent = text;
    };
    setText(".dv-weekday", weekday);
    setText(".dv-date", dmy);
    setText(".dv-count", `${index + 1} / ${days.length}`);
    setText(".dv-month", `${monthName} ${year}`);

    const input = card.querySelector(".dv-input");
    if (input) input.value = inputValue;

    const prevBtn = card.querySelector(".dv-prev");
    const nextBtn = card.querySelector(".dv-next");
    if (prevBtn) {
      prevBtn.disabled = index <= 0 && monthIndex(year, month) <= 0;
    }
    if (nextBtn) {
      nextBtn.disabled =
        index >= days.length - 1 &&
        monthIndex(year, month) >= maintainedMonths.length - 1;
    }

    const hasLanguageToggle = Boolean(card.querySelector(".dv-language-toggle"));
    if (hasLanguageToggle !== Boolean(quote?.imgEn)) {
      render(card);
      return;
    }
    const newSrc = quoteImage(quote) || "";
    if (!newSrc || img.getAttribute("src") === newSrc) return;

    // Preload the next image, then swap + fade it in. Keeping the current image
    // visible until the new one is decoded avoids the collapse-then-grow flash.
    img.style.transition = "opacity 200ms ease";
    img.style.opacity = "0.35";

    const pre = new Image();
    pre.decoding = "async";
    pre.onload = () => {
      img.src = newSrc;
      img.style.opacity = "1";
    };
    pre.onerror = () => {
      img.style.opacity = "1";
      // Same fallback as render(): a day whose image is missing is dropped and we
      // step back to the previous available day so the card is never blank.
      if (days.length <= 1) return;
      const i = days.indexOf(selectedDay);
      days = days.filter((x) => x !== selectedDay);
      selectedDay = days[Math.max(0, Math.min(i - 1, days.length - 1))];
      patchCard(card);
    };
    pre.src = newSrc;
  }

  // Render the whole card (dark date-bar + quote photo) to a single PNG so it can
  // be shared to Facebook / saved. Done on a <canvas> — no external libraries, so
  // it works offline. On phones it opens the native share sheet (→ Facebook / Save
  // to Photos); on desktop it downloads the PNG to upload manually.
  const DEV_FONT =
    '"Noto Serif Devanagari","Tiro Devanagari Sanskrit","Mukta",serif';

  async function exportCardImage(btn) {
    const quote = quoteFor(selectedDay);
    if (!quote) return;

    const originalLabel = btn ? btn.textContent : "";
    if (btn) {
      btn.disabled = true;
      btn.textContent = "तैयार हो रहा है…";
    }

    try {
      // Make sure the Devanagari fonts are ready so the canvas text isn't drawn
      // in a fallback face.
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch (e) {
          /* ignore */
        }
      }

      const img = new Image();
      img.decoding = "async";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = quoteImage(quote); // same-origin /assets → canvas is not tainted
      });

      const d = new Date(year, month, selectedDay);
      const weekday = d.toLocaleString("en-US", { weekday: "long" });
      const dmy = `${pad(selectedDay)}-${pad(month + 1)}-${year}`;
      const monthText = `${monthName} ${year}`;
      const mantra = "ॐ श्री सद्गुरवे नमः";

      const W = 1080;
      const barH = 150;
      const scale = W / img.naturalWidth;
      const photoH = Math.round(img.naturalHeight * scale);
      const H = barH + photoH;

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");

      // Cream card background + photo.
      ctx.fillStyle = "#fdf3e3";
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(img, 0, barH, W, photoH);

      // Dark date bar.
      ctx.fillStyle = "#a05a10";
      ctx.fillRect(0, 0, W, barH);

      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff8f0";

      // Left: Month Year.
      ctx.textAlign = "left";
      ctx.font = `700 34px ${DEV_FONT}`;
      const leftEnd = 46 + ctx.measureText(monthText).width;

      // Right: weekday over date (two lines).
      ctx.textAlign = "right";
      ctx.font = `700 30px ${DEV_FONT}`;
      const wdW = ctx.measureText(weekday).width;
      ctx.font = `600 26px ${DEV_FONT}`;
      const dtW = ctx.measureText(dmy).width;
      const rightStart = W - 46 - Math.max(wdW, dtW);

      // Centre: mantra, shrunk if needed so it never collides with the sides.
      const avail = rightStart - leftEnd - 44;
      let mFont = 44;
      ctx.font = `700 ${mFont}px ${DEV_FONT}`;
      while (ctx.measureText(mantra).width > avail && mFont > 22) {
        mFont -= 2;
        ctx.font = `700 ${mFont}px ${DEV_FONT}`;
      }

      ctx.fillStyle = "#fff8f0";
      ctx.textAlign = "left";
      ctx.font = `700 34px ${DEV_FONT}`;
      ctx.fillText(monthText, 46, barH / 2);

      ctx.textAlign = "center";
      ctx.font = `700 ${mFont}px ${DEV_FONT}`;
      ctx.fillText(mantra, W / 2, barH / 2);

      ctx.textAlign = "right";
      ctx.font = `700 30px ${DEV_FONT}`;
      ctx.fillText(weekday, W - 46, barH / 2 - 24);
      ctx.font = `600 26px ${DEV_FONT}`;
      ctx.fillText(dmy, W - 46, barH / 2 + 26);

      // Subtle outer frame so it reads as a card on a white Facebook feed.
      ctx.strokeStyle = "rgba(120, 63, 4, 0.35)";
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, W - 2, H - 2);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) return;

      const languageName = activeLanguage === "en" ? "English" : "Hindi";
      const file = new File([blob], `Sadguru-Vani-${dmy}-${languageName}.png`, {
        type: "image/png",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: mantra });
          return;
        } catch (e) {
          if (e && e.name === "AbortError") return; // user cancelled the sheet
        }
      }

      // Desktop / no file-share: download the PNG.
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (e) {
      /* if anything fails, silently restore the button below */
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = originalLabel;
      }
    }
  }

  function hideReactCalendar(container) {
    // Hide the React month-grid + quote display, but ONLY from here — so if this
    // script ever fails to load, the original calendar still shows instead of a
    // blank section. (No CSS `display:none` on them, on purpose.)
    const grid = container.querySelector(".rounded-2xl.max-w-md.mx-auto");
    if (grid) grid.style.display = "none";
    const display = container.querySelector("#quote-display");
    if (display) display.style.display = "none";
  }

  // Replace the whole #quotes header (the "Divya Vani" eyebrow, the "पूज्य स्वामीजी
  // के अनमोल वचन" heading and the subtitle) with just "सद्गुरु कैलेंडर". Re-applied on
  // each render since the React app can restore its own markup.
  function renameHeading(section) {
    const block = section.querySelector(".text-center.mb-10");
    if (!block) return;

    const h2 = block.querySelector("h2");
    if (h2 && h2.textContent.trim() !== "सद्गुरु कैलेंडर") {
      h2.textContent = "सद्गुरु कैलेंडर";
    }
    // Hide the eyebrow + subtitle lines around the heading.
    block.querySelectorAll(":scope > p").forEach((p) => {
      p.style.display = "none";
    });
  }

  function ensureCard() {
    const section = document.getElementById("quotes");
    if (!section) return;
    const container = section.querySelector(".max-w-5xl") || section;

    hideReactCalendar(container);
    renameHeading(section);

    let card = document.getElementById("dv-quote-card");
    if (card && card.isConnected) return;

    if (!card) {
      card = document.createElement("div");
      card.id = "dv-quote-card";
      card.className = "dv-quote-card";
      render(card);
    }
    container.appendChild(card);
  }

  function start() {
    ensureCard();
    let scheduled = false;
    const observer = new MutationObserver(() => {
      // The site is a React SPA and re-renders #quotes; re-attach our card when it
      // does (cheap and idempotent — no-op once the card is in place).
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        ensureCard();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Live daily reveal: if the app is left open past midnight, unlock the new
    // day's quote without a refresh.
    const prevOnToday = () => selectedDay === today;
    window.setInterval(() => {
      const now = new Date();
      const nextReveal = new Date(now);
      if (now.getHours() >= 17) nextReveal.setDate(nextReveal.getDate() + 1);
      if (
        now.getDate() === today &&
        now.getMonth() === currentMonth &&
        now.getFullYear() === currentYear &&
        nextReveal.getDate() === revealDay &&
        nextReveal.getMonth() === revealMonth &&
        nextReveal.getFullYear() === revealYear
      ) {
        return;
      }
      const wasOnToday = prevOnToday();
      const wasShowingCurrentMonth =
        year === currentYear && month === currentMonth;
      refreshDateState();
      if (wasOnToday && wasShowingCurrentMonth) {
        setMonthState(currentYear, currentMonth);
        selectedDay = nearestDay(today);
      }
      else if (!days.includes(selectedDay)) selectedDay = days[days.length - 1];
      const card = document.getElementById("dv-quote-card");
      if (card) render(card);
    }, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
