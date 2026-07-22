const CACHE_NAME = "photodump-v31-guided-tutorial-action-flow";

const APP_SHELL = [
  "/",
  "/index.html",
  "/event.html",
  "/app.html",
  "/demo.html",
  "/style.css",
  "/index.css",
  "/install-help.css",
  "/install-help.js",
  "/tutorial.css",
  "/tutorial.js",
  "/i18n.css",
  "/i18n.js",
  "/assets/lang/hr.png",
  "/assets/lang/en.svg",
  "/assets/lang/de.svg",
  "/manifest.json",
  "/icon.png",
  "/home.png",
  "/add.png",
  "/profile.png",
  "/kamera.png",
  "/galerija.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        APP_SHELL.map(async (url) => {
          try {
            const response = await fetch(url, {
              cache: "no-cache"
            });

            if (response.ok) {
              await cache.put(url, response);
            } else {
              console.warn("SW skip cache:", url, response.status);
            }
          } catch (err) {
            console.warn("SW cache failed:", url, err);
          }
        })
      );
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.pathname.startsWith("/api/")) {
    return;
  }

  if (
    url.hostname.includes("firebasestorage.googleapis.com") ||
    url.hostname.includes("firestore.googleapis.com") ||
    url.hostname.includes("gstatic.com") ||
    url.hostname.includes("googleapis.com")
  ) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || !response.ok) {
          return response;
        }

        const clone = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, clone);
        });

        return response;
      })
      .catch(() => caches.match(request))
  );
});