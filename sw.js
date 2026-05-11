const CACHE_NAME = "photodump-v2";

const APP_SHELL = [
  "/",
  "/index.html",
  "/event.html",
  "/app.html",
  "/demo.html",
  "/style.css",
  "/demo.css",
  "/manifest.json",
  "/icon.png",
  "/icon-512.png",
  "/home.png",
  "/add.png",
  "/profile.png",
  "/kamera.png",
  "/galerija.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
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
        const clone = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, clone);
        });

        return response;
      })
      .catch(() => caches.match(request))
  );
});