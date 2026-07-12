(() => {
  // Reading-size control: a small floating A- / reset / A+ pill that enlarges or
  // reduces the whole page (like the browser's zoom). The site is a compiled
  // build with mixed font units (px / rem / clamp), so page zoom is the only way
  // to scale ALL text reliably. Default is 100% — nothing changes until a visitor
  // chooses to enlarge, and their choice is remembered on their own device.
  const KEY = "reading-scale-v1";
  const MIN = 0.9;
  const MAX = 1.4;
  const STEP = 0.1;

  // React renders the whole app into #root; our control lives OUTSIDE #root (on
  // <body>), so zooming #root scales all content but leaves the control itself
  // at a fixed, usable size.
  const contentTarget = () => document.getElementById("root");

  function clamp(v) {
    const rounded = Math.round(v * 10) / 10;
    return Math.min(MAX, Math.max(MIN, rounded));
  }

  function readScale() {
    const v = parseFloat(localStorage.getItem(KEY) || "");
    return Number.isFinite(v) ? clamp(v) : 1;
  }

  function writeScale(v) {
    try {
      if (v === 1) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, String(v));
    } catch {
      // localStorage is optional; the control still works for this visit.
    }
  }

  function applyScale(v) {
    const target = contentTarget();
    if (target) target.style.zoom = v === 1 ? "" : String(v);
  }

  let scale = readScale();
  let labelEl = null;
  let minusBtn = null;
  let plusBtn = null;

  function refresh() {
    applyScale(scale);
    if (labelEl) labelEl.textContent = Math.round(scale * 100) + "%";
    if (minusBtn) minusBtn.disabled = scale <= MIN + 0.001;
    if (plusBtn) plusBtn.disabled = scale >= MAX - 0.001;
  }

  function setScale(next) {
    scale = clamp(next);
    writeScale(scale);
    refresh();
  }

  function makeButton(className, label, ariaLabel) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "reading-size-btn " + className;
    b.textContent = label;
    b.setAttribute("aria-label", ariaLabel);
    return b;
  }

  function build() {
    if (document.getElementById("reading-size-control")) return;

    const wrap = document.createElement("div");
    wrap.id = "reading-size-control";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Text size / पाठ का आकार");

    minusBtn = makeButton("reading-size-btn--minus", "A", "Smaller text");
    const reset = makeButton("reading-size-btn--reset", "A", "Reset text size");
    plusBtn = makeButton("reading-size-btn--plus", "A", "Larger text");

    labelEl = document.createElement("span");
    labelEl.className = "reading-size-label";

    minusBtn.addEventListener("click", () => setScale(scale - STEP));
    plusBtn.addEventListener("click", () => setScale(scale + STEP));
    reset.addEventListener("click", () => setScale(1));

    wrap.append(minusBtn, reset, plusBtn, labelEl);
    document.body.appendChild(wrap);
    refresh();
  }

  // Apply any saved scale immediately (the empty #root already exists in the HTML,
  // so the zoom carries over once React fills it in), then add the control.
  applyScale(scale);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build, { once: true });
  } else {
    build();
  }
})();
