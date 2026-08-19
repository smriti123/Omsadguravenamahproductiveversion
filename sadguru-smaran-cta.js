(function () {
  const FORM_ID = "offer-sadguru-smaran";
  const CARD_MANTRA = "ॐ श्री सद्गुरवे नमः";
  const PRIMARY_INSTRUCTION =
    "कृपया परम पूज्य स्वामीजी से जुड़े अपने संस्मरण साझा करें और अन्य भक्तों को भी उस आनंद का सहभागी बनाएँ।";
  const PRIMARY_BUTTON = "यहाँ क्लिक करें — अपना सद्गुरु-स्मरण साझा करें";
  const DRAFT_KEY = "sadguru-smaran-form-draft-v1";
  const DRAFT_SAVE_DELAY = 450;
  let draftSaveTimer = null;

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

      // Sit the mantra at the very top-centre of the card (above the photo).
      card.insertBefore(mantra, card.firstChild);
    });

    return true;
  };

  const removeObsoleteFormCopy = () => {
    const section = document.getElementById("hommage");
    if (!section) return;

    const consent = document.getElementById("hommage-consent");
    if (consent) {
      // The compiled form still requires a true consent value before submit.
      // Preserve that submission value while removing the obsolete 30-day copy.
      if (consent.getAttribute("aria-checked") !== "true") consent.click();
      consent.parentElement?.classList.add("sadguru-smaran-obsolete-copy");
    }

    section.querySelectorAll("p").forEach((line) => {
      if (
        line.textContent.trim() ===
        "Newest offerings appear first and keep their natural size."
      ) {
        line.classList.add("sadguru-smaran-obsolete-copy");
      }
    });
  };

  const draftFields = (form) =>
    Array.from(
      form.querySelectorAll(
        "input:not([type='file']):not([type='hidden']):not([type='checkbox']):not([type='radio']), textarea, select",
      ),
    ).filter(
      (field) =>
        field.id !== "hommage-website" &&
        field.name !== "website" &&
        !field.disabled,
    );

  const draftFieldKey = (field, index) =>
    field.id || field.name || `field-${index}`;

  const readStoredDraft = () => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && parsed.fields ? parsed : null;
    } catch {
      return null;
    }
  };

  const removeStoredDraft = () => {
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* Browser storage may be unavailable in private/restricted mode. */
    }
  };

  const setControlledFieldValue = (field, value) => {
    const prototype =
      field instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : field instanceof HTMLSelectElement
          ? HTMLSelectElement.prototype
          : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
    if (setter) setter.call(field, value);
    else field.value = value;
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const ensureDraftBar = (form) => {
    let bar = form.querySelector(".sadguru-smaran-draft-bar");
    if (bar) return bar;

    bar = document.createElement("div");
    bar.className = "sadguru-smaran-draft-bar";
    bar.innerHTML = `
      <span class="sadguru-smaran-draft-status" aria-live="polite"></span>
      <button type="button" class="sadguru-smaran-clear-draft">Clear Draft</button>
    `;

    const submit = form.querySelector('button[type="submit"]');
    if (submit?.parentElement) {
      submit.insertAdjacentElement("beforebegin", bar);
    } else {
      form.append(bar);
    }
    return bar;
  };

  const setDraftStatus = (form, message, state = "") => {
    const status = ensureDraftBar(form).querySelector(
      ".sadguru-smaran-draft-status",
    );
    if (!status) return;
    if (status.textContent !== message) status.textContent = message;
    status.dataset.state = state;
  };

  const saveDraft = (form) => {
    if (!form?.isConnected) return;
    const fields = {};
    let hasContent = false;

    draftFields(form).forEach((field, index) => {
      const value = field.value || "";
      fields[draftFieldKey(field, index)] = value;
      if (value.trim()) hasContent = true;
    });

    const photo = form.querySelector('input[type="file"]')?.files?.[0];
    if (!hasContent && !photo) {
      removeStoredDraft();
      setDraftStatus(form, "", "");
      return;
    }

    const draft = {
      fields,
      photoSelected: Boolean(photo),
      photoName: photo?.name || "",
      savedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setDraftStatus(form, "Draft saved", "saved");
    } catch {
      setDraftStatus(
        form,
        "Draft could not be saved on this device.",
        "error",
      );
    }
  };

  const scheduleDraftSave = (form) => {
    if (draftSaveTimer !== null) window.clearTimeout(draftSaveTimer);
    setDraftStatus(form, "Saving draft…", "saving");
    draftSaveTimer = window.setTimeout(() => {
      draftSaveTimer = null;
      saveDraft(form);
    }, DRAFT_SAVE_DELAY);
  };

  const restoreDraft = (form) => {
    const draft = readStoredDraft();
    if (!draft) return;

    let restored = false;
    form.dataset.smaranRestoringDraft = "true";
    draftFields(form).forEach((field, index) => {
      const key = draftFieldKey(field, index);
      if (!Object.prototype.hasOwnProperty.call(draft.fields, key)) return;
      const value = String(draft.fields[key] ?? "");
      if (!value) return;
      setControlledFieldValue(field, value);
      restored = true;
    });
    form.dataset.smaranRestoringDraft = "false";

    if (restored || draft.photoSelected) {
      setDraftStatus(
        form,
        draft.photoSelected
          ? "Unsaved draft restored. Please select the photo again."
          : "Unsaved draft restored",
        "restored",
      );
    }
  };

  const enhanceDraftSaving = () => {
    const form = document.querySelector(`#${FORM_ID} form`);
    if (!form || form.dataset.smaranDraftEnhanced === "true") return;
    form.dataset.smaranDraftEnhanced = "true";

    const bar = ensureDraftBar(form);
    const clear = bar.querySelector(".sadguru-smaran-clear-draft");
    clear?.addEventListener("click", () => {
      if (draftSaveTimer !== null) {
        window.clearTimeout(draftSaveTimer);
        draftSaveTimer = null;
      }
      removeStoredDraft();
      draftFields(form).forEach((field) => setControlledFieldValue(field, ""));
      const photo = form.querySelector('input[type="file"]');
      if (photo) {
        photo.value = "";
        photo.dispatchEvent(new Event("change", { bubbles: true }));
      }
      setDraftStatus(form, "Draft cleared", "cleared");
    });

    form.addEventListener("input", (event) => {
      if (event.target.closest(".sadguru-smaran-draft-bar")) return;
      if (form.dataset.smaranRestoringDraft === "true") return;
      scheduleDraftSave(form);
    });
    form.addEventListener("change", (event) => {
      if (event.target.closest(".sadguru-smaran-draft-bar")) return;
      if (form.dataset.smaranRestoringDraft === "true") return;
      scheduleDraftSave(form);
    });

    restoreDraft(form);

    const successObserver = new MutationObserver(() => {
      const success = Array.from(form.querySelectorAll('[role="status"]')).find(
        (status) =>
          status.className.includes("text-green-900") &&
          status.textContent.trim(),
      );
      if (!success) return;
      removeStoredDraft();
      setDraftStatus(form, "Submitted successfully — draft cleared", "cleared");
    });
    successObserver.observe(form, { childList: true, subtree: true });

    if (!window.__sadguruDraftPagehideBound) {
      window.__sadguruDraftPagehideBound = true;
      window.addEventListener("pagehide", () => {
        const activeForm = document.querySelector(`#${FORM_ID} form`);
        if (activeForm) saveDraft(activeForm);
      });
    }
  };

  // Keep the native React file input and its compression/submission handlers,
  // but present it through one clear, full-width, mobile-friendly upload box.
  const enhanceAttachment = () => {
    const input = document.getElementById("hommage-image");
    if (!input) return;

    input.classList.add("sadguru-smaran-file-input-hidden");
    input.setAttribute(
      "aria-label",
      "Photo — Optional. Choose a photo from your device.",
    );

    const host = input.parentElement;
    if (!host) return;
    host.classList.add("sadguru-smaran-upload-host");

    const fieldGroup = host.parentElement;
    fieldGroup
      ?.querySelector('label[for="hommage-image"]')
      ?.classList.add("sadguru-smaran-obsolete-copy");

    // Remove the old helper/empty-state copy. The same information now lives in
    // the full-width picker, so repeating it makes the control look duplicated.
    Array.from(host.querySelectorAll("p")).forEach((line) => {
      const text = line.textContent.trim();
      if (
        text === "Optional. Large phone photos are compressed automatically." ||
        text === "Add a Sadguru-Smaran photo if you wish."
      ) {
        line.classList.add("sadguru-smaran-obsolete-copy");
      }
    });

    // React renders its own small preview + Remove button after compression.
    // Preserve it for state management, but visually replace it with the clearer
    // preview and Change/Remove actions below.
    Array.from(host.children).forEach((child) => {
      if (
        child !== input &&
        child.querySelector?.("img") &&
        Array.from(child.querySelectorAll("button")).some(
          (button) => button.textContent.trim() === "Remove",
        )
      ) {
        child.classList.add("sadguru-smaran-native-photo-ui");
      }
    });

    let shell = host.querySelector(".sadguru-smaran-upload-shell");
    if (!shell) {
      shell = document.createElement("div");
      shell.className = "sadguru-smaran-upload-shell";
      shell.innerHTML = `
        <button type="button" class="sadguru-smaran-upload-box" aria-controls="hommage-image">
          <span class="sadguru-smaran-upload-label">Photo — Optional</span>
          <span class="sadguru-smaran-upload-action">📷 Tap here to choose a photo</span>
          <span class="sadguru-smaran-upload-help"><em>Select a photo from your phone. Large photos will be compressed automatically.</em></span>
        </button>
        <div class="sadguru-smaran-photo-preview" hidden>
          <img alt="Selected photo preview">
          <span class="sadguru-smaran-photo-name"></span>
          <div class="sadguru-smaran-photo-actions">
            <button type="button" class="sadguru-smaran-change-photo">Change photo</button>
            <button type="button" class="sadguru-smaran-remove-photo">Remove photo</button>
          </div>
        </div>
        <span class="sadguru-smaran-attach-status" role="status" aria-live="polite"></span>
      `;
      input.insertAdjacentElement("afterend", shell);
    }

    const picker = shell.querySelector(".sadguru-smaran-upload-box");
    const preview = shell.querySelector(".sadguru-smaran-photo-preview");
    const previewImage = preview?.querySelector("img");
    const previewName = preview?.querySelector(".sadguru-smaran-photo-name");
    const status = shell.querySelector(".sadguru-smaran-attach-status");

    const setStatus = (message, state) => {
      const currentStatus =
        host.querySelector(".sadguru-smaran-attach-status") || status;
      if (!currentStatus) return;
      if (currentStatus.textContent !== message) {
        currentStatus.textContent = message;
      }
      currentStatus.dataset.state = state || "";
    };

    const revokePreviewUrl = () => {
      if (!input.__sadguruPreviewUrl) return;
      URL.revokeObjectURL(input.__sadguruPreviewUrl);
      input.__sadguruPreviewUrl = "";
    };

    const updatePreview = () => {
      const file = input.files?.[0];
      if (!preview || !previewImage || !previewName) return;
      if (!file || !file.type?.startsWith("image/")) {
        revokePreviewUrl();
        preview.hidden = true;
        preview.dataset.fileSignature = "";
        if (previewImage.hasAttribute("src")) previewImage.removeAttribute("src");
        if (previewName.textContent) previewName.textContent = "";
        return;
      }

      const signature = `${file.name}:${file.size}:${file.lastModified}`;
      if (
        preview.dataset.fileSignature === signature &&
        previewImage.hasAttribute("src")
      ) {
        preview.hidden = false;
        return;
      }

      revokePreviewUrl();
      input.__sadguruPreviewUrl = URL.createObjectURL(file);
      previewImage.src = input.__sadguruPreviewUrl;
      previewName.textContent = file.name;
      preview.dataset.fileSignature = signature;
      preview.hidden = false;
    };

    if (shell.dataset.smaranUploadBound !== "true") {
      shell.dataset.smaranUploadBound = "true";
      picker?.addEventListener("click", () => input.click());
      shell
        .querySelector(".sadguru-smaran-change-photo")
        ?.addEventListener("click", () => input.click());
      shell
        .querySelector(".sadguru-smaran-remove-photo")
        ?.addEventListener("click", () => {
          const nativeRemove = Array.from(host.querySelectorAll("button")).find(
            (button) =>
              !button.closest(".sadguru-smaran-upload-shell") &&
              button.textContent.trim() === "Remove",
          );
          nativeRemove?.click();
          input.value = "";
          input.dispatchEvent(new Event("change", { bubbles: true }));
          updatePreview();
          setStatus("Photo removed.", "");
          picker?.focus();
        });
    }

    if (input.__sadguruAttachmentChangeHandler) {
      input.removeEventListener(
        "change",
        input.__sadguruAttachmentChangeHandler,
      );
    }
    input.__sadguruAttachmentChangeHandler = () => {
        const file = input.files?.[0];
        updatePreview();
        if (!file) {
          setStatus("", "");
          return;
        }

        if (!file.type || !file.type.startsWith("image/")) {
          setStatus("Could not attach this file. Please select a photo.", "error");
          return;
        }

        setStatus(
          `Photo selected successfully: ${file.name}. It is ready to submit.`,
          "success",
        );
      };
    input.addEventListener("change", input.__sadguruAttachmentChangeHandler);
    input.dataset.smaranAttachEnhanced = "true";

    updatePreview();

    const form = input.closest("form");
    if (form && form.dataset.smaranPhotoSubmitBound !== "true") {
      form.dataset.smaranPhotoSubmitBound = "true";
      form.addEventListener("submit", () => {
        const file = input.files && input.files[0];
        if (file) setStatus("Uploading your photo. Please wait...", "loading");
      });
    }

    // Mirror the form's final server result beside the photo control, where
    // uploaders naturally look for confirmation before attempting another upload.
    if (form && form.dataset.smaranPhotoToastBound !== "true") {
      form.dataset.smaranPhotoToastBound = "true";
      const toastObserver = new MutationObserver(() => {
        const toast = document.querySelector(
          "[data-sonner-toast][data-type='success'], [data-sonner-toast][data-type='error']",
        );
        if (!toast) return;

        const type = toast.getAttribute("data-type");
        const message = toast.textContent.trim();
        if (type === "success") {
          setStatus(
            "Success — your Sadguru Smaran and photo have been uploaded.",
            "success",
          );
        } else if (form.contains(document.activeElement) || input.files.length) {
          setStatus(
            message
              ? `Upload failed: ${message}`
              : "Upload failed. Please check your connection and try again.",
            "error",
          );
        }
      });
      toastObserver.observe(document.body, { childList: true, subtree: true });
    }
  };

  // The section's opening shloka (यस्य स्मरणमात्रेण… सद्गुरवे नमस्तस्मै…) sits in a
  // pale washed-out box that blends into the tan section background. Tag its
  // plaque + verse with stable classes so the override CSS can turn it into a
  // proper devotional plaque (warm frame, ॐ watermark, larger serif verse).
  const SHLOKA_HINT = "सद्गुरवे नमस्तस्मै";
  const tagShlokaPlaque = () => {
    const section = document.getElementById("hommage");
    if (!section) return;

    const paras = section.querySelectorAll("p");
    for (const para of paras) {
      if (!para.textContent.includes(SHLOKA_HINT)) continue;

      para.classList.add("sadguru-shloka-text");
      const plaque = para.parentElement;
      if (plaque) plaque.classList.add("sadguru-shloka-plaque");
      break;
    }
  };

  // Full-screen photo viewer for the tribute-wall cards. Tapping a card photo
  // opens it large (with a prominent close); tapping the rest of the card still
  // opens the card's expanded view (we stop the photo click from bubbling).
  const openPhotoViewer = (src, alt) => {
    if (!src) return;
    const existing = document.getElementById("sadguru-photo-viewer");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "sadguru-photo-viewer";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", alt || "Sadguru-Smaran photo");

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "sadguru-photo-viewer__close";
    closeBtn.setAttribute("aria-label", "बंद करें / Close");
    closeBtn.textContent = "×";

    const image = document.createElement("img");
    image.src = src;
    image.alt = alt || "";

    overlay.append(closeBtn, image);

    // Send focus into the dialog and hand it back on close, so someone opening
    // the photo from the keyboard isn't left tabbing around the page behind it.
    const opener = document.activeElement;
    const dismiss = () => {
      overlay.remove();
      if (opener && typeof opener.focus === "function") opener.focus();
    };

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay || event.target === closeBtn) dismiss();
    });
    document.addEventListener("keydown", function esc(event) {
      if (event.key === "Escape") {
        dismiss();
        document.removeEventListener("keydown", esc);
      }
    });

    document.body.appendChild(overlay);
    closeBtn.focus();
  };

  const enablePhotoZoom = () => {
    document.querySelectorAll(".hommage-parchment-card__image").forEach((img) => {
      if (img.dataset.smaranZoom === "true") return;
      img.dataset.smaranZoom = "true";
      img.style.cursor = "zoom-in";

      // The card around this photo is itself role="button", so the photo needs to
      // be reachable and labelled in its own right — otherwise keyboard and
      // screen-reader users can only open the card, never enlarge the photo.
      // (Attributes only: wrapping the <img> in a real <button> would re-parent a
      // node React owns and break its reconciliation on the next re-render.)
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", "फ़ोटो बड़ा करें / Enlarge photo");

      const open = (event) => {
        // Stop the card's own click/Enter/Space handler from also firing, or the
        // card dialog would open behind the photo viewer.
        event.stopPropagation();
        openPhotoViewer(img.getAttribute("src"), img.getAttribute("alt") || "");
      };

      img.addEventListener("click", open);
      img.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault(); // Space would otherwise scroll the page
        open(event);
      });
    });
  };

  // The wall used to hide posts older than 30 days on the server. That filter is
  // gone (posts are never auto-removed now), so the list grows without limit —
  // this collapses it to the newest few with a "show older" toggle instead.
  // Cards arrive newest-first from the API, so plain DOM order is date order.
  const RECENT_CARD_COUNT = 6;
  const OLDER_TOGGLE_ID = "sadguru-smaran-older-toggle";
  let showingOlder = false;

  const applyShowOlder = () => {
    const section = document.getElementById("hommage");
    if (!section) return;

    const cards = Array.from(
      section.querySelectorAll(
        ".hommage-parchment-card:not(.hommage-parchment-card--empty)",
      ),
    );
    const existing = document.getElementById(OLDER_TOGGLE_ID);

    // Few enough to show everything — undo any collapsing and drop the button.
    if (cards.length <= RECENT_CARD_COUNT) {
      cards.forEach((card) => card.classList.remove("hommage-card--older"));
      if (existing) existing.remove();
      return;
    }

    cards.forEach((card, index) => {
      card.classList.toggle(
        "hommage-card--older",
        index >= RECENT_CARD_COUNT && !showingOlder,
      );
    });

    const olderCount = cards.length - RECENT_CARD_COUNT;
    const label = showingOlder
      ? "कम दिखाएँ"
      : `पुराने संस्मरण देखें (${olderCount})`;

    let toggle = existing;
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.id = OLDER_TOGGLE_ID;
      toggle.className = "sadguru-smaran-older-toggle";
      toggle.addEventListener("click", () => {
        showingOlder = !showingOlder;
        applyShowOlder();
        // Collapsing can drop the button far above the viewport; keep it in view.
        if (!showingOlder) toggle.scrollIntoView({ block: "center" });
      });
      // React owns the grid, so the button sits just outside it. If a re-render
      // removes it, the section's MutationObserver puts it back.
      const grid = cards[0].parentElement;
      if (grid) grid.insertAdjacentElement("afterend", toggle);
    }

    // Only write when it actually changes, so this can't loop with the observer.
    if (toggle.textContent !== label) toggle.textContent = label;
    toggle.setAttribute("aria-expanded", showingOlder ? "true" : "false");
  };

  const applyEnhancements = () => {
    hideOriginalCta();
    const primaryReady = enhancePrimaryCta();
    document.querySelectorAll("#hommage p").forEach((line) => {
      if (
        (line.textContent || "").trim() ===
        "Each Sadguru-Smaran appears immediately, newest first, for 30 days."
      ) {
        line.textContent =
          "Each Sadguru-Smaran appears immediately, newest first, and remains here permanently.";
      }
    });
    addCardMantras();
    removeObsoleteFormCopy();
    enhanceDraftSaving();
    enhanceAttachment();
    tagShlokaPlaque();
    enablePhotoZoom();
    applyShowOlder();
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
