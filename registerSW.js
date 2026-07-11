if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    const isLocalDevelopment =
      location.hostname === "localhost" || location.hostname === "127.0.0.1";

    if (isLocalDevelopment) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map((registration) => registration.unregister()),
      );

      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
      return;
    }

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      location.reload();
    });

    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    registration.update();
  });
}
