(() => {
  /*
    iPhone/iPad-ONLY tap fix.  On Android (and desktop) this file runs NOTHING —
    the isIOS guard below returns immediately — so Android behaviour is 100%
    unchanged.

    Why this exists (confirmed on-device with the tap-debug logger):
    On iOS Safari the dynamically-injected controls below receive
    touchstart/touchend on the correct target, but Safari does not fire the
    follow-up `click` event — so their click handlers never run. The Satsang
    talk cards are <a> links (iOS fires click on links fine), which is why the
    player opens but its <button> close / प्रवचन-सूची controls didn't respond.

    Fix: on iOS, when a clean tap ends on one of these controls, suppress the
    missing/unreliable native click and dispatch the click ourselves — exactly
    one activation, no double-fire.
  */
  const isIOS =
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (!isIOS) return;

  // Only the custom-injected controls whose click handlers weren't firing.
  // Native links and the React app are deliberately NOT included.
  const SELECTOR = [
    ".satsang-search-clear",
    ".satsang-player-close",
    ".satsang-toggle-list",
    ".satsang-talk-list-item",
    ".satsang-prev-talk",
    ".satsang-next-talk",
    ".satsang-devotional-status",
    ".continue-listening-card",
    ".talk-action",
    ".talk-notes-close",
    ".talk-notes-save",
    ".talk-notes-clear",
  ].join(",");

  const MOVE_TOLERANCE = 12; // px — more than this means the finger scrolled, not tapped
  const GHOST_WINDOW = 800; // ms — swallow a late native "ghost" click within this window

  let startX = 0;
  let startY = 0;
  let startControl = null;
  let synthesizing = null;

  function controlFor(node) {
    return node && node.closest ? node.closest(SELECTOR) : null;
  }

  document.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) {
        startControl = null;
        return;
      }
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startControl = controlFor(event.target);
    },
    { capture: true, passive: true },
  );

  document.addEventListener(
    "touchend",
    (event) => {
      const control = startControl;
      startControl = null;
      if (!control || !control.isConnected) return;
      if (event.changedTouches.length !== 1) return;

      const touch = event.changedTouches[0];
      if (
        Math.abs(touch.clientX - startX) > MOVE_TOLERANCE ||
        Math.abs(touch.clientY - startY) > MOVE_TOLERANCE
      ) {
        return; // a scroll/swipe, not a tap — leave it alone
      }

      // The finger must lift while still over the same control.
      const endEl = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!endEl || (endEl !== control && !control.contains(endEl))) return;

      // Suppress the unreliable native click, then fire our own so there is
      // exactly one activation.
      event.preventDefault();
      control.dataset.iosTapAt = String(event.timeStamp);
      synthesizing = control;
      control.click();
      synthesizing = null;
    },
    { capture: true, passive: false },
  );

  // Guard: if iOS still emits a native "ghost" click shortly after our synthetic
  // one, swallow it so toggles/prev/next don't fire twice. Our own synthetic
  // click (synthesizing === control) is always allowed through.
  document.addEventListener(
    "click",
    (event) => {
      const control = controlFor(event.target);
      if (!control || control === synthesizing) return;
      const tapAt = Number(control.dataset.iosTapAt || 0);
      if (tapAt && event.timeStamp - tapAt < GHOST_WINDOW) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
    true,
  );
})();
