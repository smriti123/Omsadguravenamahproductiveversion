(function () {
  const FORM_ID = "offer-sadguru-smaran";
  const CARD_MANTRA = "ॐ श्री सद्गुरवे नमः";
  const PRIMARY_INSTRUCTION =
    "कृपया परम पूज्य स्वामीजी से जुड़े अपने अनुभव, विशेष चित्र, प्रसंग एवं संस्मरण साझा करें और अन्य भक्तों को भी उस आनंद का सहभागी बनाएँ।";
  const PRIMARY_BUTTON = "यहाँ क्लिक करें — अपना सद्गुरु-स्मरण साझा करें";

  const focusSubmissionForm = () => {
    const form = document.getElementById(FORM_ID);
    if (!form) return;

    form.scrollIntoView({ behavior: "smooth", block: "start" });

    window.setTimeout(() => {
      const focusTarget = form.querySelector(
        "input:not([type='hidden']), textarea, button, select",
      );
      if (!focusTarget) return;

      try {
        focusTarget.focus({ preventScroll: true });
      } catch {
        focusTarget.focus();
      }
    }, 520);

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", `#${FORM_ID}`);
    }
  };

  const handleCtaClick = (event) => {
    event.preventDefault();
    focusSubmissionForm();
  };

  const buildButton = (label, modifierClass) => {
    const button = document.createElement("a");
    button.href = `#${FORM_ID}`;
    button.className = `sadguru-smaran-cta-button ${modifierClass}`;
    button.setAttribute("aria-label", label);
    button.addEventListener("click", handleCtaClick);

    const icon = document.createElement("span");
    icon.className = "sadguru-smaran-cta-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "✍";

    const text = document.createElement("span");
    text.textContent = label;

    button.append(icon, text);
    return button;
  };

  const buildCard = (instruction, buttonLabel, cardModifier, buttonModifier) => {
    const card = document.createElement("div");
    card.className = `sadguru-smaran-cta-card ${cardModifier}`;

    const copy = document.createElement("p");
    copy.className = "sadguru-smaran-cta-instruction";
    copy.textContent = instruction;

    card.append(copy, buildButton(buttonLabel, buttonModifier));
    return card;
  };

  const hideOriginalCta = () => {
    const original = Array.from(
      document.querySelectorAll(`a[href="#${FORM_ID}"]`),
    ).find((link) => link.textContent.trim() === "Offer your Sadguru-Smaran");

    if (!original) return null;
    original.classList.add("sadguru-smaran-original-cta");
    original.setAttribute("aria-hidden", "true");
    original.setAttribute("tabindex", "-1");
    return original;
  };

  const enhancePrimaryCta = () => {
    if (document.querySelector(".sadguru-smaran-cta-card--primary")) {
      return true;
    }

    const original = hideOriginalCta();
    if (!original || !original.parentElement) return false;

    const card = buildCard(
      PRIMARY_INSTRUCTION,
      PRIMARY_BUTTON,
      "sadguru-smaran-cta-card--primary order-1",
      "sadguru-smaran-cta-button--primary",
    );

    original.insertAdjacentElement("beforebegin", card);
    return true;
  };

  const addCardMantras = () => {
    const section = document.getElementById("hommage");
    if (!section) return false;

    const cards = section.querySelectorAll(
      ".hommage-parchment-card:not(.hommage-parchment-card--empty)",
    );
    if (!cards.length) return true;

    cards.forEach((card) => {
      if (card.querySelector(".sadguru-smaran-card-mantra")) return;

      const mantra = document.createElement("p");
      mantra.className = "sadguru-smaran-card-mantra";
      mantra.textContent = CARD_MANTRA;

      const meta = card.querySelector(".hommage-parchment-card__meta");
      if (meta) {
        meta.insertAdjacentElement("beforebegin", mantra);
      } else {
        card.append(mantra);
      }
    });

    return true;
  };

  const applyEnhancements = () => {
    hideOriginalCta();
    const primaryReady = enhancePrimaryCta();
    addCardMantras();
    return primaryReady;
  };

  const start = () => {
    applyEnhancements();

    // Keep the observer connected for the life of the page. This is a React app
    // and it re-renders the सद्गुरु-स्मरण section (e.g. on navigation or when the
    // shared list updates), which reverts our Hindi/✍ CTA back to the original
    // English button. A persistent (debounced) observer re-applies it each time,
    // instead of disconnecting after the first success.
    let scheduled = false;
    const run = () => {
      scheduled = false;
      applyEnhancements();
    };
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(run);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
