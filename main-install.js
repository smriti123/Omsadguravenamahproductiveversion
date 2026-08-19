(() => {
  "use strict";
  const installed = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (installed()) return;

  let promptEvent = null;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "main-install-button";
  document.body.append(button);

  const placeWithoutOverlap = () => {
    const main = document.querySelector("main");
    if (!main || button.parentElement === main) return;
    main.prepend(button);
  };

  const showHelpMode = () => {
    button.dataset.ready = "true";
    button.dataset.mode = "help";
    button.setAttribute("aria-label", "Install App instructions");
    button.innerHTML = '<span aria-hidden="true">⇩</span> Install App';
    placeWithoutOverlap();
  };

  const showInstallMode = () => {
    button.dataset.ready = "true";
    button.dataset.mode = "install";
    button.setAttribute("aria-label", "Install App");
    button.innerHTML = '<span aria-hidden="true">⇩</span> Install App';
    placeWithoutOverlap();
  };

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    promptEvent = event;
    showInstallMode();
  });
  window.addEventListener("appinstalled", () => button.remove());
  button.addEventListener("click", async () => {
    if (!promptEvent) {
      window.location.href = "/home#about-app-install";
      return;
    }
    promptEvent.prompt();
    await promptEvent.userChoice;
    promptEvent = null;
    if (!installed()) showHelpMode();
  });
  window.addEventListener("load", () => { if (!installed() && !promptEvent) showHelpMode(); }, { once: true });
})();
