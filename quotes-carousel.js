(() => {
  /*
    Divya Vani — daily quote carousel (सुविचार / दिव्य वाणी).

    Standalone, no React: this owns the quote card so quotes can be added by
    editing the QUOTES list below — no need to touch the compiled app bundle.

    Quotes are keyed to day-of-month (1–31) and reused every month. The card shows
    a top bar (Month · Weekday · dd-mm-yyyy), the quote photo, and Prev/Next plus a
    date input to jump directly to any date. It replaces the old month-grid
    calendar (which is hidden via CSS in section-banner-overrides.css).

    TO ADD A QUOTE: drop the image in /assets and add a line here, e.g.
      { day: 14, img: "/assets/quote-my-new-one.jpg" },
  */
  const QUOTES = [
    { day: 1, img: "/assets/quote-shraddha.jpg" },
    { day: 2, img: "/assets/quote-dharma-phal.jpg" },
    { day: 3, img: "/assets/q1.jpg" },
    { day: 4, img: "/assets/q2.jpg" },
    { day: 5, img: "/assets/q3.jpg" },
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
    { day: 16, img: "/assets/q16.jpg" },
    { day: 17, img: "/assets/q17.jpg" },
    { day: 18, img: "/assets/q18.jpg" },
  ].sort((a, b) => a.day - b.day);

  const allDays = QUOTES.map((q) => q.day).sort((a, b) => a - b);

  // Live date state. Reveal quotes only UP TO today's date, so you can upload a
  // whole month's quotes in advance and each day automatically unlocks that day's
  // quote from the visitor's system date — no redeploy, and (via the timer in
  // start()) no refresh needed even if the app stays open past midnight. Previous
  // days remain browsable; only future days are hidden.
  let year, month, today, monthName, days;
  function refreshDateState() {
    const d = new Date();
    year = d.getFullYear();
    month = d.getMonth();
    today = d.getDate();
    monthName = d.toLocaleString("en-US", { month: "long" });
    days = allDays.filter((x) => x <= today);
    if (!days.length) days = [allDays[0]]; // fallback: before the first quote's day
  }
  refreshDateState();

  // Open on today's quote (or the latest day revealed so far).
  let selectedDay = nearestDay(today);

  function quoteFor(day) {
    return QUOTES.find((q) => q.day === day);
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function nearestDay(target) {
    if (days.includes(target)) return target;
    return days.reduce(
      (best, d) => (Math.abs(d - target) < Math.abs(best - target) ? d : best),
      days[0],
    );
  }

  function render(card) {
    const quote = quoteFor(selectedDay);
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
      <div class="dv-photo-wrap">
        <img class="dv-photo" src="${quote ? quote.img : ""}" alt="पूज्य स्वामीजी का सुविचार" loading="lazy">
      </div>
      <div class="dv-controls">
        <button type="button" class="dv-nav dv-prev" aria-label="Previous quote">‹</button>
        <input type="date" class="dv-input" value="${inputValue}" max="${year}-${pad(month + 1)}-${pad(today)}" aria-label="Choose a date">
        <button type="button" class="dv-nav dv-next" aria-label="Next quote">›</button>
      </div>
      <p class="dv-count">${index + 1} / ${days.length}</p>
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
    // jarring). Buttons disable at the first/last available day.
    const prevBtn = card.querySelector(".dv-prev");
    const nextBtn = card.querySelector(".dv-next");
    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= days.length - 1;
    prevBtn.addEventListener("click", () => {
      const i = days.indexOf(selectedDay);
      if (i > 0) {
        selectedDay = days[i - 1];
        render(card);
      }
    });
    nextBtn.addEventListener("click", () => {
      const i = days.indexOf(selectedDay);
      if (i < days.length - 1) {
        selectedDay = days[i + 1];
        render(card);
      }
    });
    card.querySelector(".dv-input").addEventListener("change", (event) => {
      const value = event.target.value; // yyyy-mm-dd
      if (!value) return;
      selectedDay = nearestDay(Number(value.slice(8, 10)));
      render(card);
    });
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

  function ensureCard() {
    const section = document.getElementById("quotes");
    if (!section) return;
    const container = section.querySelector(".max-w-5xl") || section;

    hideReactCalendar(container);

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
      if (new Date().getDate() === today) return; // same day, nothing to do
      const wasOnToday = prevOnToday();
      refreshDateState();
      if (wasOnToday) selectedDay = nearestDay(today);
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
