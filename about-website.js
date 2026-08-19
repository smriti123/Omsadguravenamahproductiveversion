(() => {
  const ABOUT_ID = "about-website";
  const ABOUT_NAV_ID = "about-website-nav-item";
  const COLLECTION_NAV_ID = "my-photos-nav-item";
  const ABOUT_MOBILE_NAV_ID = "about-website-mobile-nav-item";
  const COLLECTION_MOBILE_NAV_ID = "my-photos-mobile-nav-item";
  let scheduled = false;

  function createAboutSection() {
    const section = document.createElement("section");
    section.id = ABOUT_ID;
    section.className = "about-website-section";
    section.setAttribute("aria-labelledby", "about-website-title");
    section.innerHTML = `
      <div class="about-website-shell">
        <span id="about-app-install" aria-hidden="true"></span>
        <header class="about-website-header">
          <span class="about-website-om" aria-hidden="true">ॐ</span>
          <p class="about-website-hari">Hari Om</p>
          <h2 id="about-website-title">About This Website</h2>
          <p class="about-website-lead">
            This website is a small effort to bring together some of the
            photographs and remembrances of Param Pujya Swamiji that have been
            shared in the WhatsApp group.
          </p>
        </header>

        <div class="about-website-grid">
          <article class="about-website-card">
            <span class="about-website-card__icon" aria-hidden="true">ॐ</span>
            <h3>Sadguru Smaran</h3>
            <p>
              Through the
              <a href="/home#hommage"><strong>Sadguru Smaran</strong></a>
              section, devotees may share their cherished memories and special
              photographs connected with Param Pujya Swamiji.
            </p>
          </article>

          <article class="about-website-card">
            <span class="about-website-card__icon" aria-hidden="true">⌂</span>
            <h3>Use as an App</h3>
            <p>
              Open the website in your phone’s browser and follow the steps
              for your device:
            </p>
            <div class="about-website-app-browser">
              <h4><span class="browser-icon browser-icon--google" aria-hidden="true">G</span> Google app</h4>
              <p>
                Open this website from the <strong>Google app</strong> (the
                multicolour G icon). If <strong>“Install app”</strong> appears,
                tap it to install directly.
              </p>
            </div>
            <div class="about-website-app-browser">
              <h4><span class="browser-icon browser-icon--chrome" aria-hidden="true"></span> Chrome browser</h4>
              <p>
                Tap the <strong>three-dot menu (⋮)</strong> and select
                <strong>“Add to Home screen”</strong> or
                <strong>“Install app.”</strong> If Chrome does not show either
                option, use the Google app method above.
              </p>
            </div>
            <div class="about-website-app-browser">
              <h4>Samsung Internet Browser</h4>
              <p>
                Tap the <strong>downward arrow (↓)</strong> and select
                <strong>“Install app.”</strong>
              </p>
            </div>
            <div class="about-website-app-browser">
              <h4>iPhone — Safari</h4>
              <p>
                Tap the <strong>Share icon</strong> (a square with an upward
                arrow), scroll down, and select
                <strong>“Add to Home Screen.”</strong> Then tap
                <strong>“Add.”</strong>
              </p>
            </div>
            <p>
              A <strong>Sadgurave Namah</strong> icon will appear on your
              phone’s home screen.
            </p>
            <figure class="about-website-app-preview">
              <img src="/favicon.ico" alt="Sadgurave Namah app icon">
              <figcaption><strong>App name:</strong> SadguraveNamah</figcaption>
            </figure>
            <p>Tap the icon anytime to open the website like an app.</p>
          </article>

          <article class="about-website-card about-website-card--private">
            <span class="about-website-card__icon" aria-hidden="true">🔒</span>
            <h3>Personal Photos and Files</h3>
            <p>
              Photographs and files may be uploaded for personal spiritual
              study. They remain stored locally in the browser or device and
              are not sent to the website or visible to others.
            </p>
            <p>
              They may be lost if the app is removed, browser data is cleared,
              or the phone is changed or reset. Please keep a separate copy of
              important files.
            </p>
            <a class="about-website-card__link" href="/home#my-photos">
              Open मेरा संग्रह
            </a>
          </article>

          <article class="about-website-card about-website-card--note">
            <span class="about-website-card__icon" aria-hidden="true">✦</span>
            <h3>A Note</h3>
            <p>
              This website has not been professionally developed, so occasional
              technical glitches may occur. Kindly bring any such issues to
              attention.
            </p>
            <p>
              AI tools have been used as an aid in organising and presenting
              some of the material, with its original meaning preserved. Any
              errors may kindly be brought to notice. Guidance, corrections,
              and suggestions would be gratefully received.
            </p>
          </article>
        </div>

      </div>
    `;

    const shell = section.querySelector(".about-website-shell");
    const englishContent = Array.from(shell.children);
    const hindiContent = document.createElement("div");
    hindiContent.className = "about-website-language about-website-language--hindi";
    hindiContent.lang = "hi";
    hindiContent.hidden = true;
    hindiContent.innerHTML = `
      <header class="about-website-header">
        <span class="about-website-om" aria-hidden="true">ॐ</span>
        <p class="about-website-hari">Hari Om</p>
        <h2>इस Website के बारे में</h2>
        <p class="about-website-lead">
          यह Website WhatsApp group में साझा किए गए परम पूज्य स्वामीजी के कुछ
          photographs और संस्मरणों को एक स्थान पर प्रस्तुत करती है।
        </p>
      </header>

      <div class="about-website-grid">
        <article class="about-website-card">
          <span class="about-website-card__icon" aria-hidden="true">ॐ</span>
          <h3>Sadguru Smaran</h3>
          <p>
            भक्त और साधक परम पूज्य स्वामीजी से जुड़े अपने संस्मरण, अनुभव और
            photographs <a href="/home#hommage"><strong>Sadguru Smaran</strong></a>
            section के माध्यम से साझा कर सकते हैं।
          </p>
        </article>

        <article class="about-website-card">
          <span class="about-website-card__icon" aria-hidden="true">⌂</span>
          <h3>App के रूप में उपयोग करें</h3>
          <p>नीचे अपने फोन में दिखाई देने वाले app का चिह्न पहचानकर वही विधि अपनाएँ:</p>
          <div class="about-website-app-browser">
            <h4><span class="browser-icon browser-icon--google" aria-hidden="true">G</span> Google app — रंगीन G वाला चिह्न</h4>
            <p>इस website को <strong>Google app</strong> से खोलें। यदि <strong>“Install app”</strong> दिखाई दे, तो उसे दबाएँ। App सीधे install हो जाएगा।</p>
          </div>
          <div class="about-website-app-browser">
            <h4><span class="browser-icon browser-icon--chrome" aria-hidden="true"></span> Chrome browser — गोल रंगीन चिह्न</h4>
            <p><strong>three-dot menu (⋮)</strong> दबाकर <strong>“Add to Home screen”</strong> या <strong>“Install app”</strong> चुनें। यदि ये विकल्प न दिखें, तो ऊपर दी गई Google app विधि अपनाएँ।</p>
          </div>
          <div class="about-website-app-browser">
            <h4>Samsung Internet Browser</h4>
            <p><strong>downward arrow (↓)</strong> दबाकर <strong>“Install app”</strong> चुनें।</p>
          </div>
          <div class="about-website-app-browser">
            <h4>iPhone — Safari</h4>
            <p><strong>Share</strong> चिह्न दबाएँ, फिर <strong>“Add to Home Screen”</strong> और उसके बाद <strong>“Add”</strong> चुनें।</p>
          </div>
          <p>Phone की home screen पर <strong>Sadgurave Namah</strong> icon दिखाई देगा।</p>
          <figure class="about-website-app-preview">
            <img src="/favicon.ico" alt="Sadgurave Namah app icon">
            <figcaption>App name: SadguraveNamah</figcaption>
          </figure>
          <p>Website को app की तरह खोलने के लिए इस icon पर tap करें।</p>
        </article>

        <article class="about-website-card about-website-card--private">
          <span class="about-website-card__icon" aria-hidden="true">🔒</span>
          <h3>Personal Photos and Files</h3>
          <p>
            व्यक्तिगत आध्यात्मिक अध्ययन के लिए photographs और files जोड़ी जा
            सकती हैं। वे केवल browser या device में locally stored रहती हैं और
            Website पर नहीं भेजी जातीं तथा अन्य लोगों को दिखाई नहीं देतीं।
          </p>
          <p>
            App हटाने, browser data clear करने अथवा phone बदलने या reset करने
            पर ये items खो सकती हैं। कृपया महत्वपूर्ण files की अलग copy रखें।
          </p>
          <a class="about-website-card__link" href="/home#my-photos">
            मेरा संग्रह खोलें
          </a>
        </article>

        <article class="about-website-card about-website-card--note">
          <span class="about-website-card__icon" aria-hidden="true">✦</span>
          <h3>एक निवेदन</h3>
          <p>
            यह Website किसी professional web developer द्वारा नहीं बनाई गई है,
            इसलिए कभी-कभी technical glitches आ सकती हैं।
          </p>
          <p>
            सामग्री के translation, organisation और presentation में
            <strong>AI tools</strong> का उपयोग किया गया है। कृपया किसी भी error
            की सूचना दें। आपका मार्गदर्शन, corrections और suggestions अत्यंत
            उपयोगी होंगे।
          </p>
        </article>
      </div>

    `;

    const languageToggle = document.createElement("button");
    languageToggle.type = "button";
    languageToggle.className = "about-website-language-toggle";
    languageToggle.textContent = "हिन्दी में पढ़ें";
    languageToggle.setAttribute("aria-pressed", "false");
    languageToggle.addEventListener("click", () => {
      const showHindi =
        languageToggle.getAttribute("aria-pressed") !== "true";
      englishContent.forEach((element) => {
        element.hidden = showHindi;
      });
      hindiContent.hidden = !showHindi;
      languageToggle.textContent = showHindi
        ? "Read in English"
        : "हिन्दी में पढ़ें";
      languageToggle.setAttribute("aria-pressed", String(showHindi));
    });

    shell.prepend(languageToggle);
    shell.append(hindiContent);
    return section;
  }

  function ensureAboutSection() {
    if (document.getElementById(ABOUT_ID)) return;
    const anchor =
      document.getElementById("my-photos") ||
      document.getElementById("hommage");
    if (!anchor?.parentElement) return;
    anchor.insertAdjacentElement("afterend", createAboutSection());
  }

  function createDesktopNavItem(id, href, label) {
    const item = document.createElement("li");
    item.id = id;
    item.className = "flex items-center about-site-nav-item";
    item.innerHTML = `
      <span aria-hidden="true" class="about-site-nav-separator"></span>
      <a
        class="font-body whitespace-nowrap text-xs font-medium tracking-[0.015em] transition-colors xl:text-sm"
        href="${href}"
      >${label}</a>
    `;
    return item;
  }

  function ensureNavLinks() {
    const nav = document.querySelector("nav.fixed");
    const desktopList = nav?.querySelector("ul");
    if (desktopList) {
      if (!desktopList.querySelector(`#${COLLECTION_NAV_ID}`)) {
        desktopList.append(
          createDesktopNavItem(
            COLLECTION_NAV_ID,
            "/home#my-photos",
            "मेरा संग्रह",
          ),
        );
      }
      if (!desktopList.querySelector(`#${ABOUT_NAV_ID}`)) {
        desktopList.append(
          createDesktopNavItem(
            ABOUT_NAV_ID,
            "/home#about-website",
            "About",
          ),
        );
      }
    }

    const mobileList = nav?.querySelector("ul.flex-col");
    const mobileReference = mobileList?.querySelector('a[href$="#hommage"]');
    if (mobileReference && mobileList) {
      function createMobileItem(id, href, label) {
        const item = document.createElement("li");
        item.id = id;

        const link = mobileReference.cloneNode(false);
        link.href = href;
        link.textContent = label;
        link.removeAttribute("aria-current");
        link.addEventListener("click", () => {
          window.setTimeout(() => {
            nav?.querySelector('button[aria-expanded="true"]')?.click();
          }, 0);
        });

        item.append(link);
        return item;
      }

      if (!mobileList.querySelector(`#${COLLECTION_MOBILE_NAV_ID}`)) {
        mobileList.append(
          createMobileItem(
            COLLECTION_MOBILE_NAV_ID,
            "/home#my-photos",
            "मेरा संग्रह",
          ),
        );
      }

      if (!mobileList.querySelector(`#${ABOUT_MOBILE_NAV_ID}`)) {
        mobileList.append(
          createMobileItem(
            ABOUT_MOBILE_NAV_ID,
            "/home#about-website",
            "About",
          ),
        );
      }
    }
  }

  function ensureHomeCard() {
    const grid = document.querySelector(".home-new__card-grid");
    if (!grid || grid.querySelector(".home-new__about-card")) return;

    const card = document.createElement("a");
    card.className = "home-new__card home-new__about-card";
    card.href = "/home#about-website";
    card.innerHTML = `
      <span class="home-new__card-icon home-new__about-card-icon" aria-hidden="true">ⓘ</span>
      <span class="home-new__card-body">
        <strong>About This Website</strong>
        <span class="home-new__about-card-hindi">जानकारी एवं उपयोग-विधि</span>
      </span>
    `;
    grid.append(card);
  }

  function ensureClosingSectionOrder() {
    const calendar = document.getElementById("quotes");
    const personalFiles = document.getElementById("my-photos");
    const about = document.getElementById(ABOUT_ID);
    const main = personalFiles?.closest("main");
    if (!calendar || !personalFiles || !about || !main) return;

    const directChildOfMain = (element) => {
      let current = element;
      while (current?.parentElement && current.parentElement !== main) {
        current = current.parentElement;
      }
      return current?.parentElement === main ? current : null;
    };

    const calendarUnit = directChildOfMain(calendar);
    const personalUnit = directChildOfMain(personalFiles);
    const aboutUnit = directChildOfMain(about);
    const orderedUnits = [calendarUnit, personalUnit, aboutUnit];
    if (
      !calendarUnit ||
      !personalUnit ||
      !aboutUnit ||
      new Set(orderedUnits).size !== orderedUnits.length
    ) {
      return;
    }

    const closingOrder = orderedUnits;
    const currentTail = Array.from(main.children).slice(-closingOrder.length);
    const alreadyOrdered = closingOrder.every(
      (element, index) => currentTail[index] === element,
    );
    if (alreadyOrdered) return;

    main.append(calendarUnit, personalUnit, aboutUnit);
  }

  function enhance() {
    ensureAboutSection();
    ensureNavLinks();
    ensureHomeCard();
    ensureClosingSectionOrder();
  }

  function scheduleEnhance() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      enhance();
    });
  }

  function start() {
    enhance();
    const observer = new MutationObserver(scheduleEnhance);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
