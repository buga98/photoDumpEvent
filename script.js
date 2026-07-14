const tr = (text) => window.PDE_I18N?.tr(text) ?? text;

// PWA bridge for the first launch of an installed Home Screen app.
const PWA_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function setPwaCookie(name, value) {
  if (!name || value == null || value === "") return;

  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    name + "=" + encodeURIComponent(String(value)) +
    "; Max-Age=" + PWA_COOKIE_MAX_AGE +
    "; Path=/; SameSite=Lax" + secure;
}

function getPwaCookie(name) {
  const prefix = name + "=";

  for (const part of document.cookie.split(";")) {
    const cookie = part.trim();

    if (cookie.startsWith(prefix)) {
      try {
        return decodeURIComponent(cookie.slice(prefix.length));
      } catch {
        return cookie.slice(prefix.length);
      }
    }
  }

  return "";
}

function createGuestUserId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  if (window.crypto && typeof window.crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);

    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (byte) =>
      byte.toString(16).padStart(2, "0")
    );

    return (
      hex.slice(0, 4).join("") + "-" +
      hex.slice(4, 6).join("") + "-" +
      hex.slice(6, 8).join("") + "-" +
      hex.slice(8, 10).join("") + "-" +
      hex.slice(10, 16).join("")
    );
  }

  return "guest-" + Date.now().toString(36) + "-" +
    Math.random().toString(36).slice(2, 12);
}

const storedEventIdBeforeOpen = localStorage.getItem("eventId");
const cookieEventId = getPwaCookie("pde_eventId");

let currentEventId =
  new URLSearchParams(window.location.search).get("event") ||
  storedEventIdBeforeOpen ||
  cookieEventId;

if (!currentEventId) {
  alert("Event nije pronađen. Otvori aplikaciju putem QR koda.");
  window.location.href = "/";
} else {
  localStorage.setItem("eventId", currentEventId);
  setPwaCookie("pde_eventId", currentEventId);
}

function getStoredEventUserId(eventId) {
  if (!eventId) return "";

  const eventUserId = localStorage.getItem("userId_" + eventId);
  if (eventUserId) return eventUserId;

  if (localStorage.getItem("eventId") === eventId) {
    return localStorage.getItem("userId") || "";
  }

  return "";
}

function getActiveUserId() {
  return (
    getStoredEventUserId(currentEventId) ||
    (cookieEventId === currentEventId ? getPwaCookie("pde_userId") : "") ||
    ""
  );
}

function getActiveUserName() {
  return (
    localStorage.getItem("name_" + currentEventId) ||
    (localStorage.getItem("eventId") === currentEventId
      ? localStorage.getItem("name")
      : "") ||
    (cookieEventId === currentEventId ? getPwaCookie("pde_name") : "") ||
    ""
  );
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

import {
  getFirestore,
  onSnapshot,
  orderBy,
  doc,
  setDoc,
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  increment,
  limit,
  startAfter
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";

import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjETOqGf9zNxWO7DB7QokoHu_duiqM8Jg",
  authDomain: "photodumpevent-4578c.firebaseapp.com",
  projectId: "photodumpevent-4578c",
  storageBucket: "photodumpevent-4578c.firebasestorage.app",
  messagingSenderId: "617407847422",
  appId: "1:617407847422:web:2c4a13242a0fa1ba50feaf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

let guestAuthPromise = null;

function storeAuthUid(firebaseUser) {
  if (!firebaseUser || !firebaseUser.uid) return "";

  localStorage.setItem("authUid", firebaseUser.uid);
  localStorage.setItem("authUid_" + currentEventId, firebaseUser.uid);
  setPwaCookie("pde_authUid", firebaseUser.uid);

  return firebaseUser.uid;
}

function getStoredAuthUid() {
  return (
    localStorage.getItem("authUid_" + currentEventId) ||
    localStorage.getItem("authUid") ||
    getPwaCookie("pde_authUid") ||
    ""
  );
}

function waitForAuthState(timeoutMs = 900) {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }

    let settled = false;
    let unsubscribe = () => {};

    const finish = (user) => {
      if (settled) return;
      settled = true;
      unsubscribe();
      resolve(user || null);
    };

    unsubscribe = onAuthStateChanged(
      auth,
      (user) => finish(user),
      () => finish(null)
    );

    setTimeout(() => finish(auth.currentUser || null), timeoutMs);
  });
}

async function ensureGuestAuth() {
  if (auth.currentUser) {
    storeAuthUid(auth.currentUser);
    return auth.currentUser;
  }

  if (!guestAuthPromise) {
    guestAuthPromise = (async () => {
      const existingUser = await waitForAuthState();

      if (existingUser) {
        storeAuthUid(existingUser);
        return existingUser;
      }

      try {
        const credential = await signInAnonymously(auth);
        storeAuthUid(credential.user);
        return credential.user;
      } catch (err) {
        console.warn("Anonymous auth nije dostupan, nastavljam sa starim guest userId fallbackom:", err);
        return null;
      }
    })();
  }

  return guestAuthPromise;
}

function getActiveUploaderUid() {
  return auth.currentUser?.uid || getStoredAuthUid();
}

const THEME_CLASSES = [
  "theme-svadba",
  "theme-rodendan",
  "theme-krstenje",
  "theme-pricest",
  "theme-party"
];

function setTheme(type) {
  document.body.classList.remove(...THEME_CLASSES);
  document.body.classList.add("theme-" + (type || "default"));
}

function getTitleWithEmoji(title, type) {
  switch (type) {
    case "rodendan": return "🎂 " + title + " 🎂";
    case "svadba": return "💍 " + title + " 💍";
    case "krstenje": return "✨ " + title + " ✨";
    case "pricest": return "✝️ " + title + " ✝️";
    case "party": return "🎉 " + title + " 🎉";
    default: return "✨ " + title + " ✨";
  }
}
function applyEvent(event) {
  if (!event) return;
window.eventData = event;
  setTheme(event.type);

  document.title = event.title + " | PhotoDump";

  const eventTitle = document.getElementById("eventTitle");
  if (eventTitle) {
    eventTitle.innerText = getTitleWithEmoji(event.title, event.type);
  }

  const defaults = {
    home_title: tr("Galerija uspomena 🤍"),
    home_subtitle: tr("Svaka fotografija postaje dio uspomena"),
    upload_title: tr("Podijeli trenutak 📸"),
    upload_subtitle: tr("Dodaj fotografiju i ostavi uspomenu"),
    profile_title: tr("Tvoje uspomene"),
    profile_subtitle: tr("Ovdje su tvoje fotografije")
  };

  const homeTitle =
    event.texts?.index?.title || defaults.home_title;

  const homeSubtitle =
    event.texts?.index?.subtitle || defaults.home_subtitle;

  const uploadTitle =
    event.texts?.upload?.title || defaults.upload_title;

  const uploadSubtitle =
    event.texts?.upload?.subtitle || defaults.upload_subtitle;

  const profileSubtitle =
    event.texts?.profile?.subtitle || defaults.profile_subtitle;

  const homeTitleEl = document.getElementById("homeTitle");
  const homeSubtitleEl = document.getElementById("homeSubtitle");

  if (homeTitleEl) homeTitleEl.innerText = homeTitle;
  if (homeSubtitleEl) homeSubtitleEl.innerText = homeSubtitle;

  const uploadTitleEl = document.getElementById("uploadTitle");
  const uploadSubtitleEl = document.getElementById("uploadSubtitle");

  if (uploadTitleEl) uploadTitleEl.innerText = uploadTitle;
  if (uploadSubtitleEl) uploadSubtitleEl.innerText = uploadSubtitle;

  const profileSubtitleEl = document.getElementById("profileSubtitle");

  if (profileSubtitleEl) profileSubtitleEl.innerText = profileSubtitle;

  localStorage.setItem("eventId", currentEventId);

  console.log("✅ App texts applied");
}

document.addEventListener("pde:languagechange", () => {
  if (window.eventData) applyEvent(window.eventData);
});

function bootEventFromCache() {
  const cached = localStorage.getItem("eventData_" + currentEventId);
  if (!cached) return false;

  try {
    const event = JSON.parse(cached);
if (
  event.expiresAt &&
  Date.now() > event.expiresAt
) {
  localStorage.removeItem(
    "eventData_" + currentEventId
  );

  alert("Event je istekao ⏳");

  return false;
}
    applyEvent(event);
    console.log("⚡ App boot from cached event");
    return true;
  } catch (err) {
    console.warn("Cache event parse error:", err);
    return false;
  }
}

async function loadEventDataFallback() {
  if (!currentEventId) {
    alert("Event ne postoji");
    return false;
  }

  const snap = await getDoc(doc(db, "events", currentEventId));

  if (!snap.exists()) {
    alert("Event nije pronađen");
    return false;
  }

  const event = snap.data();
if (
  event.expiresAt &&
  Date.now() > event.expiresAt
) {
  alert("Event je istekao ⏳");
  return false;
}
  localStorage.setItem("eventId", currentEventId);
  localStorage.setItem("eventData_" + currentEventId, JSON.stringify(event));

  applyEvent(event);

  console.log("🌐 Event loaded from Firebase fallback:", event);
  return true;
}

const FEED_PAGE_SIZE = 18;
const likedCache = new Set(
  JSON.parse(localStorage.getItem("likedPhotos_" + currentEventId) || "[]")
);

function saveLikedCache() {
  localStorage.setItem(
    "likedPhotos_" + currentEventId,
    JSON.stringify([...likedCache])
  );
}

let feedStarted = false;
let feedUnsubscribe = null;
let feedObserver = null;
let lastVisiblePhoto = null;
let isLoadingMore = false;
let hasMorePhotos = true;
const renderedPhotos = new Map();

const FEED_SORT_STORAGE_KEY = "feedSort_" + currentEventId;
const FEED_VIEW_STORAGE_KEY = "feedView_" + currentEventId;
const VALID_FEED_SORTS = new Set(["newest", "popular", "oldest"]);
const VALID_FEED_VIEWS = new Set(["grid", "list"]);

let currentFeedSort = localStorage.getItem(FEED_SORT_STORAGE_KEY) || "newest";
let currentFeedView = localStorage.getItem(FEED_VIEW_STORAGE_KEY) || "grid";

if (!VALID_FEED_SORTS.has(currentFeedSort)) currentFeedSort = "newest";
if (!VALID_FEED_VIEWS.has(currentFeedView)) currentFeedView = "grid";


function getFeedOrderConstraints() {
  if (currentFeedSort === "oldest") {
    return [orderBy("created", "asc")];
  }

  if (currentFeedSort === "popular") {
    return [orderBy("likes", "desc"), orderBy("created", "desc")];
  }

  return [orderBy("created", "desc")];
}

function buildFeedQuery(afterDoc = null) {
  const constraints = [
    ...getFeedOrderConstraints(),
    ...(afterDoc ? [startAfter(afterDoc)] : []),
    limit(FEED_PAGE_SIZE)
  ];

  return query(
    collection(db, "events", currentEventId, "photos"),
    ...constraints
  );
}

function setFeedView(view) {
  if (!VALID_FEED_VIEWS.has(view)) return;

  currentFeedView = view;
  localStorage.setItem(FEED_VIEW_STORAGE_KEY, view);

  const feed = document.getElementById("feed");
  if (feed) {
    feed.classList.toggle("grid", view === "grid");
    feed.classList.toggle("list", view === "list");
  }

  document.querySelectorAll("[data-feed-view]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.feedView === view);
    btn.setAttribute("aria-pressed", String(btn.dataset.feedView === view));
  });
}

function setFeedSort(sort) {
  if (!VALID_FEED_SORTS.has(sort) || sort === currentFeedSort) return;

  currentFeedSort = sort;
  localStorage.setItem(FEED_SORT_STORAGE_KEY, sort);

  document.querySelectorAll("[data-feed-sort]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.feedSort === sort);
    btn.setAttribute("aria-pressed", String(btn.dataset.feedSort === sort));
  });

  reloadFeed();
}

function initGalleryControls() {
  setFeedView(currentFeedView);

  document.querySelectorAll("[data-feed-sort]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.feedSort === currentFeedSort);
    btn.setAttribute("aria-pressed", String(btn.dataset.feedSort === currentFeedSort));
    btn.addEventListener("click", () => setFeedSort(btn.dataset.feedSort));
  });

  document.querySelectorAll("[data-feed-view]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.feedView === currentFeedView);
    btn.setAttribute("aria-pressed", String(btn.dataset.feedView === currentFeedView));
    btn.addEventListener("click", () => setFeedView(btn.dataset.feedView));
  });
}

function clearFeedObserver() {
  if (feedObserver) {
    feedObserver.disconnect();
    feedObserver = null;
  }

  document.getElementById("feedSentinel")?.remove();
}

function resetFeedState() {
  if (feedUnsubscribe) {
    feedUnsubscribe();
    feedUnsubscribe = null;
  }

  clearFeedObserver();
  renderedPhotos.clear();
  feedStarted = false;
  lastVisiblePhoto = null;
  isLoadingMore = false;
  hasMorePhotos = true;

  const feed = document.getElementById("feed");
  if (feed) {
    delete feed.dataset.loaded;
  }
}

function reloadFeed() {
  resetFeedState();
  loadFeed();
}

function renderEmptyFeed(feed) {
  feed.innerHTML = `
    <p class="feed-empty-state">
      Još nema fotografija 📸
    </p>
  `;
}

function renderFeedError(feed) {
  feed.innerHTML = `
    <p class="feed-empty-state error">
      Greška pri učitavanju 😕<br>
      Provjeri internet ili pokušaj kasnije
    </p>
  `;
}

function renderFeedSkeleton() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  feed.innerHTML = "";

  for (let i = 0; i < 6; i++) {
    const card = document.createElement("div");
    card.className = "feed-card skeleton-card";

    card.innerHTML = `<img src="ucitavanje.png" class="skeleton-img">`;

    feed.appendChild(card);
  }
}

function loadFeed() {
  const feed = document.getElementById("feed");
  if (!feed || feedStarted || !currentEventId) return;

  feedStarted = true;
  setFeedView(currentFeedView);
  renderFeedSkeleton();

  const firstQuery = buildFeedQuery();

  feedUnsubscribe = onSnapshot(
    firstQuery,

    (snapshot) => {
      const wasLoaded = feed.dataset.loaded === "true";

      if (wasLoaded) {
        snapshot.docChanges().forEach((change) => {
          renderFeedChange(change, feed, currentFeedSort === "newest");
        });

        lastVisiblePhoto = snapshot.docs[snapshot.docs.length - 1] || lastVisiblePhoto;
        hasMorePhotos = snapshot.docs.length >= FEED_PAGE_SIZE;
        updateGalleryBadges();
        return;
      }

      feed.innerHTML = "";
      renderedPhotos.clear();
      feed.dataset.loaded = "true";

      const visibleDocs = snapshot.docs.filter(
        d => d.data().visible !== false
      );

      if (visibleDocs.length === 0) {
        renderEmptyFeed(feed);
        lastVisiblePhoto = null;
        hasMorePhotos = false;
        clearFeedObserver();
        return;
      }

      const fragment = document.createDocumentFragment();

      visibleDocs.forEach((docSnap) => {
        const photoId = docSnap.id;
        const card = createFeedCard(photoId, docSnap.data());
        renderedPhotos.set(photoId, card);
        fragment.appendChild(card);
      });

      feed.appendChild(fragment);
      updateGalleryBadges();
      lastVisiblePhoto = snapshot.docs[snapshot.docs.length - 1] || null;
      hasMorePhotos = snapshot.docs.length >= FEED_PAGE_SIZE;

      clearFeedObserver();
      if (hasMorePhotos) {
        createFeedObserver(feed);
      }
    },

    (error) => {
      console.error("🔥 Feed error:", error);
      renderFeedError(feed);
    }
  );
}

function renderFeedChange(change, feed, isLiveTop = false) {

  const docSnap = change.doc;
  const photoId = docSnap.id;

  if (change.type === "removed") {

    const existing =
      renderedPhotos.get(photoId);

    if (existing) {
      existing.remove();
      renderedPhotos.delete(photoId);
    }

    return;
  }

  const data = docSnap.data();

  if (data.visible === false) {

    const existing =
      renderedPhotos.get(photoId);

    if (existing) {
      existing.remove();
      renderedPhotos.delete(photoId);
    }

    return;
  }

  if (change.type === "modified") {

    const existing =
      renderedPhotos.get(photoId);

    if (existing) {

      const countEl =
        existing.querySelector(".like-count");

      if (countEl) {
        countEl.innerText = data.likes || 0;
      }

      existing.dataset.likes = String(data.likes || 0);

      const heart =
        existing.querySelector(".heart");

      if (likedCache.has(photoId)) {
        heart?.classList.add("liked");
      }
    }

    return;
  }

  if (renderedPhotos.has(photoId)) return;

  const card =
    createFeedCard(photoId, data);

  renderedPhotos.set(photoId, card);

  if (isLiveTop) {
    const firstCard = feed.querySelector(".feed-card");
    if (firstCard) {
      feed.insertBefore(card, firstCard);
    } else {
      feed.appendChild(card);
    }
  } else {
    feed.appendChild(card);
  }

  updateGalleryBadges();
}


function getRenderedPhotoCard(photoId) {
  return renderedPhotos.get(photoId) || null;
}

function updateCardLikeDisplay(photoId, likes) {
  const card = getRenderedPhotoCard(photoId);
  if (!card) return;

  const likeValue = Number(likes || 0);
  card.dataset.likes = String(likeValue);

  const countEl = card.querySelector(".like-count");
  if (countEl) countEl.innerText = likeValue;

  updateGalleryBadges();
}

function getCardLikeCount(card) {
  return Number(card?.dataset?.likes || 0) || 0;
}

function updateGalleryBadges() {
  const cards = [...renderedPhotos.values()];

  cards.forEach((card) => {
    card.classList.remove("top-photo-1", "top-photo-2", "top-photo-3");
    const crown = card.querySelector(".top-photo-crown");
    if (crown) crown.style.display = "none";

    const authorCrown = card.querySelector(".feed-author-crown");
    if (authorCrown) authorCrown.style.display = "none";
  });

  cards
    .filter((card) => getCardLikeCount(card) > 0)
    .sort((a, b) => getCardLikeCount(b) - getCardLikeCount(a))
    .slice(0, 3)
    .forEach((card, index) => {
      const rank = index + 1;
      card.classList.add(`top-photo-${rank}`);
      const crown = card.querySelector(".top-photo-crown");
      if (crown) {
        crown.textContent = `👑 ${rank}`;
        crown.style.display = "inline-flex";
      }
    });

  const authorCounts = new Map();

  cards.forEach((card) => {
    const key = card.dataset.authorKey;
    if (!key) return;
    authorCounts.set(key, (authorCounts.get(key) || 0) + 1);
  });

  let topAuthorKey = null;
  let topAuthorCount = 0;

  authorCounts.forEach((count, key) => {
    if (count > topAuthorCount) {
      topAuthorKey = key;
      topAuthorCount = count;
    }
  });

  if (!topAuthorKey || topAuthorCount < 2) return;

  cards.forEach((card) => {
    if (card.dataset.authorKey !== topAuthorKey) return;
    const authorCrown = card.querySelector(".feed-author-crown");
    if (authorCrown) {
      authorCrown.style.display = "inline-flex";
      authorCrown.title = `Najviše objava u učitanom prikazu: ${topAuthorCount}`;
    }
  });
}

async function likePhoto(photoId, animationParent = null) {
  const userId = getActiveUserId();
  if (!photoId || !userId) return false;

  if (animationParent) showBigHeart(animationParent);

  const card = getRenderedPhotoCard(photoId);
  const currentCount = getCardLikeCount(card);

  if (likedCache.has(photoId)) {
    card?.querySelector(".heart")?.classList.add("liked");
    return false;
  }

  const userLikeRef = doc(
    db,
    "events",
    currentEventId,
    "photos",
    photoId,
    "likes",
    userId
  );

  const checkSnap = await getDoc(userLikeRef);

  if (checkSnap.exists()) {
    likedCache.add(photoId);
    saveLikedCache();
    card?.querySelector(".heart")?.classList.add("liked");
    return false;
  }

  likedCache.add(photoId);
  saveLikedCache();
  card?.querySelector(".heart")?.classList.add("liked");
  updateCardLikeDisplay(photoId, currentCount + 1);

  await setDoc(userLikeRef, {
    created: Date.now()
  });

  await updateDoc(doc(db, "events", currentEventId, "photos", photoId), {
    likes: increment(1)
  });

  await updateDoc(doc(db, "events", currentEventId), {
    likeCount: increment(1)
  });

  return true;
}

function getPhotoDownloadFileName(photoId = "fotografija") {
  const cleanEvent = (currentEventId || "event")
    .toString()
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "event";

  const cleanPhoto = (photoId || "fotografija")
    .toString()
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "fotografija";

  return `${cleanEvent}-${cleanPhoto}.jpg`;
}

async function downloadImageFromUrl(url, fileName) {
  if (!url) return;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fileName || "photodump-fotografija.jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
  } catch (err) {
    console.warn("Image download fallback:", err);
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

function getFeedAuthorKey(data, authorName) {
  const rawUserId =
    typeof data?.userId === "string"
      ? data.userId.trim()
      : "";

  if (rawUserId) return `id:${rawUserId}`;

  return `name:${(authorName || "Gost").trim().toLowerCase()}`;
}

function getFeedAuthorName(data) {
  const rawName =
    typeof data?.user === "string"
      ? data.user.trim()
      : "";

  return rawName || "Gost";
}

function getFeedAuthorInitial(name) {
  const cleanName = (name || "Gost").trim();

  return (cleanName.charAt(0) || "G").toLocaleUpperCase("hr-HR");
}

function createFeedCard(photoId, data) {
  const card = document.createElement("div");
  card.className = "feed-card";
  card.dataset.id = photoId;
  card.dataset.full = data.imageUrl;
  card.dataset.likes = String(data.likes || 0);

  const img = document.createElement("img");
  img.src = data.thumbUrl || data.imageUrl;
  img.loading = "lazy";
  img.decoding = "async";
  img.style.userSelect = "none";
  img.style.webkitUserSelect = "none";
  img.draggable = false;

  img.onload = () => {
    img.classList.add("loaded");
  };

  const likeBox = document.createElement("div");
  likeBox.className = "like-box";

  const isLiked = likedCache.has(photoId);

  likeBox.innerHTML = `
    <span class="heart ${isLiked ? "liked" : ""}">❤️</span>
    <span class="like-count">${data.likes || 0}</span>
  `;

  const heartEl = likeBox.querySelector(".heart");

  async function doLike() {
    await likePhoto(photoId, card);
  }

  likeBox.onclick = (e) => {
    e.stopPropagation();
    doLike();
  };

  let lastTap = 0;
  let tapTimer = null;
  let isDoubleTap = false;

  let startX = 0;
  let startY = 0;
  let moved = false;

  img.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    moved = false;
  });

  img.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - startX);
    const dy = Math.abs(t.clientY - startY);

    if (dx > 15 || dy > 15) {
      moved = true;
    }
  }, { passive: true });

  img.addEventListener("touchend", () => {
    if (moved) return;

    const now = Date.now();
    const diff = now - lastTap;

    if (diff < 300 && diff > 0) {
      isDoubleTap = true;
      clearTimeout(tapTimer);
      tapTimer = null;
      doLike();
      lastTap = 0;
      return;
    }

    isDoubleTap = false;
    lastTap = now;

    clearTimeout(tapTimer);

    tapTimer = setTimeout(() => {
      if (!isDoubleTap) {
        openFullscreen(data.imageUrl);
      }
    }, 300);
  });

  img.addEventListener("click", () => {
    if (!("ontouchstart" in window)) {
      openFullscreen(data.imageUrl);
    }
  });

  const authorName = getFeedAuthorName(data);
  const authorKey = getFeedAuthorKey(data, authorName);
  card.dataset.authorName = authorName;
  card.dataset.authorKey = authorKey;

  const authorBar = document.createElement("div");
  authorBar.className = "feed-author";

  const authorAvatar = document.createElement("span");
  authorAvatar.className = "feed-author-avatar";

  const authorInitial = document.createElement("span");
  authorInitial.className = "feed-author-initial";
  authorInitial.textContent = getFeedAuthorInitial(authorName);

  const authorCrown = document.createElement("span");
  authorCrown.className = "feed-author-crown";
  authorCrown.textContent = "👑";
  authorCrown.style.display = "none";

  authorAvatar.appendChild(authorInitial);
  authorAvatar.appendChild(authorCrown);

  const authorText = document.createElement("div");
  authorText.className = "feed-author-text";

  const authorNameEl = document.createElement("strong");
  authorNameEl.className = "feed-author-name";
  authorNameEl.textContent = authorName;

  authorText.appendChild(authorNameEl);
  authorBar.appendChild(authorAvatar);
  authorBar.appendChild(authorText);

  const topPhotoCrown = document.createElement("span");
  topPhotoCrown.className = "top-photo-crown";
  topPhotoCrown.style.display = "none";

  card.appendChild(topPhotoCrown);
  card.appendChild(authorBar);
  card.appendChild(img);
  card.appendChild(likeBox);

  return card;
}

function createFeedObserver(feed) {
  if (document.getElementById("feedSentinel")) return;

  const sentinel = document.createElement("div");
  sentinel.id = "feedSentinel";
  sentinel.style.height = "40px";
  feed.after(sentinel);

  feedObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMoreFeedPhotos(feed);
    }
  }, {
    rootMargin: "300px"
  });

  feedObserver.observe(sentinel);
}

async function loadMoreFeedPhotos(feed) {
  if (isLoadingMore || !hasMorePhotos || !lastVisiblePhoto) return;

  isLoadingMore = true;

const nextQuery = buildFeedQuery(lastVisiblePhoto);

  const snapshot = await getDocs(nextQuery);

  if (snapshot.empty) {
    hasMorePhotos = false;
    isLoadingMore = false;
    return;
  }

  lastVisiblePhoto = snapshot.docs[snapshot.docs.length - 1];

  const fragment = document.createDocumentFragment();

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.visible === false) return;

    const photoId = docSnap.id;
    if (renderedPhotos.has(photoId)) return;

    const card = createFeedCard(photoId, data);
    renderedPhotos.set(photoId, card);
    fragment.appendChild(card);
  });

  feed.appendChild(fragment);
  updateGalleryBadges();
  isLoadingMore = false;
}

function showBigHeart(parent) {
  const heart = document.createElement("div");
  heart.className = "big-heart";
  heart.innerText = "❤️";

  parent.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 900);
}

async function resizeImage(file, maxWidth, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    const objectUrl =
      URL.createObjectURL(file);

    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height =
            Math.round(height * (maxWidth / width));

          width = maxWidth;
        }

        const canvas =
          document.createElement("canvas");

        const ctx =
          canvas.getContext("2d", {
            alpha: false
          });

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          URL.revokeObjectURL(objectUrl);

          if (!blob) {
            reject(new Error("IMAGE_RESIZE_FAILED"));
            return;
          }

          const newFile =
            new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, "") + ".jpg",
              {
                type: "image/jpeg"
              }
            );

          resolve(newFile);

        }, "image/jpeg", quality);

      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("IMAGE_LOAD_FAILED"));
    };

    img.src = objectUrl;
  });
}
window.uploadToFirebase = function (file, user, onProgress) {
  return new Promise(async (resolve, reject) => {
    const eventSnap =
      await getDoc(
        doc(db, "events", currentEventId)
      );

    if (!eventSnap.exists()) {
      reject("EVENT_NOT_FOUND");
      return;
    }

    const eventData =
      eventSnap.data();

    if (
      eventData.expiresAt &&
      Date.now() > eventData.expiresAt
    ) {
      reject("EVENT_EXPIRED");
      return;
    }

    if (
      (eventData.photoCount || 0) >=
      (eventData.uploadLimit || 1000)
    ) {
      showToast("Dosegnut je limit fotografija 📸");

      reject("UPLOAD_LIMIT");
      return;
    }

    try {
      const [bigFile, thumbFile] =
        await Promise.all([
          resizeImage(file, 1200, 0.72),
          resizeImage(file, 320, 0.6)
        ]);

      const safeName =
        file.name.replace(/\s+/g, "-");

      const timestamp =
        Date.now();

      const bigRef =
        ref(
          storage,
          `events/${currentEventId}/photos/${timestamp}_${safeName}`
        );

      const thumbRef =
        ref(
          storage,
          `events/${currentEventId}/thumbs/${timestamp}_${safeName}`
        );

      const originalPath =
        window.eventData?.allowOriginals
          ? `events/${currentEventId}/originals/${timestamp}_${safeName}`
          : null;

      const originalRef =
        originalPath
          ? ref(storage, originalPath)
          : null;

      const uploadTask =
        uploadBytesResumable(bigRef, bigFile);

      let thumbUploadPromise = null;
      let originalUploadPromise = null;

      thumbUploadPromise =
        uploadBytesResumable(thumbRef, thumbFile);

      if (originalRef) {
        originalUploadPromise =
          uploadBytesResumable(originalRef, file);
      }

      uploadTask.on(
        "state_changed",

        (snapshot) => {
          const percent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          if (onProgress) {
            onProgress(percent);
          }
        },

        reject,

        async () => {
          try {
            const imageUrl =
              await getDownloadURL(uploadTask.snapshot.ref);

            await thumbUploadPromise;

            const thumbUrl =
              await getDownloadURL(thumbRef);

            if (originalUploadPromise) {
              await originalUploadPromise;
            }

            const authUser = await ensureGuestAuth();
            const uploaderUid = authUser?.uid || getActiveUploaderUid();

            const photoData = {
              imageUrl,
              thumbUrl,

              path: uploadTask.snapshot.ref.fullPath,
              thumbPath: thumbRef.fullPath,

              originalPath,

              user,
              userId: getActiveUserId(),

              created: Date.now(),
              likes: 0,
              visible: true
            };

            if (uploaderUid) {
              photoData.uploaderUid = uploaderUid;
            }

            await addDoc(
              collection(db, "events", currentEventId, "photos"),
              photoData
            );

            await updateDoc(
              doc(db, "events", currentEventId),
              {
                photoCount: increment(1)
              }
            );

            resolve(imageUrl);

          } catch (err) {
            reject(err);
          }
        }
      );

    } catch (err) {
      reject(err);
    }
  });
};

function showUploadOverlay(message = "Pripremam upload...", percent = 0) {
  const overlay =
    document.getElementById("uploadOverlay");

  const text =
    document.getElementById("uploadOverlayText");

  const progress =
    document.getElementById("uploadOverlayProgress");

  if (text) {
    text.innerText = tr(message);
  }

  if (progress) {
    progress.style.width =
      Math.max(0, Math.min(100, percent)) + "%";
  }

  if (overlay) {
    overlay.classList.add("show");
  }
}

function updateUploadOverlay(message, percent) {
  const text =
    document.getElementById("uploadOverlayText");

  const progress =
    document.getElementById("uploadOverlayProgress");

  if (text) {
    text.innerText = tr(message);
  }

  if (progress) {
    progress.style.width =
      Math.max(0, Math.min(100, percent)) + "%";
  }
}

function hideUploadOverlay() {
  const overlay =
    document.getElementById("uploadOverlay");

  const progress =
    document.getElementById("uploadOverlayProgress");

  if (progress) {
    progress.style.width = "0%";
  }

  if (overlay) {
    overlay.classList.remove("show");
  }
}


window.uploadFile = async function (files) {
  const gallery =
    document.getElementById("gallery");

  if (!gallery || !files || !files.length) return;

  const user =
    getActiveUserName();

  let fileList =
    Array.from(files);

  const MAX_FILES_PER_SELECTION = 15;

  if (fileList.length > MAX_FILES_PER_SELECTION) {
    showToast(tr("Možeš odabrati najviše 15 fotografija odjednom. Prenosit će se prvih 15."));
    fileList = fileList.slice(0, MAX_FILES_PER_SELECTION);
  }

  const MAX_PARALLEL_UPLOADS = 2;

  showUploadOverlay(
    `Pripremam ${fileList.length} fotografija...`,
    3
  );

  let done = 0;
  let failed = 0;
  let currentIndex = 0;

  function updateOverallProgress(activePercent = 0) {
    const totalProgress =
      ((done + failed + activePercent / 100) / fileList.length) * 100;

    updateUploadOverlay(
      `Učitavam fotografije... ${done + failed}/${fileList.length}`,
      Math.min(99, Math.round(totalProgress))
    );
  }

  async function uploadOne(file, index) {
    const wrapper =
      document.createElement("div");

    const progress =
      document.createElement("div");

    const img =
      document.createElement("img");

    const previewUrl =
      URL.createObjectURL(file);

    img.src =
      previewUrl;

    wrapper.appendChild(img);
    wrapper.appendChild(progress);
    gallery.appendChild(wrapper);

    try {
      const url =
        await uploadToFirebase(file, user, (percent) => {
          progress.style.width =
            percent + "%";

          updateUploadOverlay(
            `Učitavam fotografiju ${index + 1}/${fileList.length}... ${Math.round(percent)}%`,
            ((done + failed + percent / 100) / fileList.length) * 100
          );
        });

      img.src = url;
      progress.remove();

      done++;

    } catch (err) {
      failed++;

      progress.remove();
      wrapper.remove();

      if (err === "EVENT_EXPIRED") {
        showToast("Event je istekao ⏳");
        return;
      }

      if (err === "UPLOAD_LIMIT") {
        showToast("Dosegnut je limit fotografija 📸");
        return;
      }

      if (err === "EVENT_NOT_FOUND") {
        showToast("Event nije pronađen 😕");
        return;
      }

      const pending =
        JSON.parse(
          localStorage.getItem("pendingUploads") || "[]"
        );

      pending.push({
        name: file.name,
        time: Date.now()
      });

      localStorage.setItem(
        "pendingUploads",
        JSON.stringify(pending)
      );

      console.warn("Upload failed:", file.name, err);
    } finally {
      URL.revokeObjectURL(previewUrl);

      updateOverallProgress();
    }
  }

  async function worker() {
    while (currentIndex < fileList.length) {
      const index =
        currentIndex++;

      await uploadOne(
        fileList[index],
        index
      );
    }
  }

  const workers =
    Array.from(
      {
        length: Math.min(
          MAX_PARALLEL_UPLOADS,
          fileList.length
        )
      },
      () => worker()
    );

  await Promise.allSettled(workers);

  updateUploadOverlay(
    failed
      ? `Upload završen — ${done} uspješno, ${failed} nije uspjelo`
      : "Upload završen 🤍",
    100
  );

  setTimeout(() => {
    hideUploadOverlay();

    switchScreen("profile");
    loadMyImages();

    showToast(
      failed
        ? `Upload završen — ${done} uspješno, ${failed} nije uspjelo`
        : "Upload završen 🤍"
    );
  }, 750);
};

let selectedPhotoId = null;
let selectedProfileImageEl = null;

window.confirmDelete = async function () {
  const modal =
    document.getElementById("deleteModal");

  if (modal) {
    modal.style.display = "none";
  }

  if (!selectedPhotoId) {
    showToast("Fotografija nije odabrana 😕");
    return;
  }

  const photoIdToDelete = selectedPhotoId;

  try {
    await updateDoc(
      doc(db, "events", currentEventId, "photos", photoIdToDelete),
      {
        visible: false
      }
    );

    try {
      await updateDoc(
        doc(db, "events", currentEventId),
        {
          photoCount: increment(-1)
        }
      );
    } catch (counterErr) {
      console.warn("Photo counter update skipped:", counterErr);
    }

    const feedCard =
      renderedPhotos.get(photoIdToDelete);

    if (feedCard) {
      feedCard.remove();
      renderedPhotos.delete(photoIdToDelete);
    }

    if (selectedProfileImageEl) {
      selectedProfileImageEl.remove();
      selectedProfileImageEl = null;
    }

    selectedPhotoId = null;

    showToast("Fotografija je obrisana 🗑️");

    loadMyImages();

  } catch (err) {
    console.error("Delete photo error:", err);

    if (err.code === "permission-denied") {
      showToast("Nemaš dozvolu za brisanje ove fotografije 😕");
      return;
    }

    showToast("Greška kod brisanja fotografije 😕");
  }
};

window.closeDelete = function () {
  document.getElementById("deleteModal").style.display = "none";
};

window.switchScreen = function (screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

  if (screen === "home") {
    document.getElementById("homeTab").classList.add("active");
    document.querySelectorAll(".nav-item")[0].classList.add("active");
  }

  if (screen === "upload") {
    document.getElementById("uploadTab").classList.add("active");
    document.querySelectorAll(".nav-item")[1].classList.add("active");
  }

  if (screen === "profile") {
    document.getElementById("profileTab").classList.add("active");
    document.querySelectorAll(".nav-item")[2].classList.add("active");
    loadMyImages();
  }
};

window.saveDedication = async function () {
  const text = document.getElementById("dedicationText").value.trim();
  const name = getActiveUserName();

  if (!text) {
    alert("Napiši poruku 🤍");
    return;
  }

  await addDoc(collection(db, "events", currentEventId, "dedications"), {
    name,
    text,
    created: Date.now()
  });

await updateDoc(doc(db, "events", currentEventId), {
  dedicationCount: increment(1)
});

  document.getElementById("dedicationText").value = "";
  closeDedicationComposer();
  showToast("🤍 Hvala na lijepim riječima");
};

window.openDedicationComposer = function () {
  const modal =
    document.getElementById("dedicationComposerModal");

  if (modal) {
    modal.style.display = "flex";
  }

  setTimeout(() => {
    document
      .getElementById("dedicationText")
      ?.focus();
  }, 120);
};

window.closeDedicationComposer = function () {
  const modal =
    document.getElementById("dedicationComposerModal");

  if (modal) {
    modal.style.display = "none";
  }
};


window.loadMyImages = async function () {
  const gallery = document.getElementById("gallery");
  const userId = getActiveUserId();

  if (!gallery) return;

  gallery.innerHTML =
    "<p style='grid-column:1/-1; opacity:0.6;'>Učitavam...</p>";

  if (!userId) {
    gallery.innerHTML =
      "<p style='grid-column:1/-1; opacity:0.6;'>Nema još tvojih slika 📸</p>";
    return;
  }

  try {
    const q = query(
      collection(db, "events", currentEventId, "photos"),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);

    gallery.innerHTML = "";

    if (snapshot.empty) {
      gallery.innerHTML =
        "<p style='grid-column:1/-1; opacity:0.6;'>Nema još tvojih slika 📸</p>";
      return;
    }

    snapshot.forEach((docSnap) => {
  const data = docSnap.data();

  if (data.visible === false) return;

  const img = document.createElement("img");
  img.src = data.thumbUrl || data.imageUrl;
img.addEventListener("click", () => {
  selectedPhotoId = docSnap.id;
  selectedProfileImageEl = img;

  openProfileFullscreen(
    data.imageUrl || data.thumbUrl,
    docSnap.id
  );
});
      let pressTimer;
      let isLongPress = false;

      img.addEventListener("touchstart", () => {
        isLongPress = false;

        pressTimer = setTimeout(() => {
          isLongPress = true;
          selectedPhotoId = docSnap.id;
          selectedProfileImageEl = img;

          document.getElementById("deleteModal").style.display = "flex";

          if (navigator.vibrate) navigator.vibrate(50);
        }, 700);
      });

      img.addEventListener("touchend", () => {
        clearTimeout(pressTimer);
      });

      img.addEventListener("touchmove", () => clearTimeout(pressTimer));
      img.addEventListener("mouseleave", () => clearTimeout(pressTimer));

      gallery.appendChild(img);
    });
  } catch (err) {
    console.error(err);
    gallery.innerHTML =
      "<p style='grid-column:1/-1;'>Greška pri učitavanju</p>";
  }
};

const secretBtn =
  document.getElementById("secretAdminBtn");

if (secretBtn) {

  secretBtn.onclick = () => {

    const pass =
      prompt("Admin šifra");

    if (pass === "admin") {

      window.location.href =
        "/admin.html?event=" + currentEventId;

    } else {

      alert("Kriva šifra");
    }
  };
}


function openProfileFullscreen(url, photoId) {
  if (document.querySelector(".admin-fullscreen")) return;

  selectedPhotoId = photoId;

  const full = document.createElement("div");
  full.className = "admin-fullscreen profile-fullscreen";

  const closeBtn = document.createElement("button");
  closeBtn.className = "fullscreen-close-btn";
  closeBtn.type = "button";
  closeBtn.innerText = "×";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "profile-delete-btn";
  deleteBtn.type = "button";
  deleteBtn.innerText = "Izbriši fotografiju";

const img = document.createElement("img");
img.className = "admin-fullscreen-img profile-fullscreen-img";
img.src = "";

img.onload = () => {
  img.style.opacity = "1";
};

img.src = url;

  full.appendChild(img);
  full.appendChild(closeBtn);
  full.appendChild(deleteBtn);

  document.body.appendChild(full);
  document.body.classList.add("fullscreen-open");

  function closeFullscreen() {
    document.body.classList.remove("fullscreen-open");
    full.remove();
  }

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeFullscreen();
  });

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    closeFullscreen();

    const modal =
      document.getElementById("deleteModal");

    if (modal) {
      modal.style.display = "flex";
    }
  });
}

function loadLiveCounters() {
  const photoEl = document.getElementById("livePhotoCount");
  const dedicationEl = document.getElementById("liveDedicationCount");
  const likesEl = document.getElementById("liveLikesCount");

  if (!photoEl || !dedicationEl || !currentEventId) return;

  const statsRef = doc(db, "events", currentEventId);

  onSnapshot(
    statsRef,

    (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();

      photoEl.innerText = data.photoCount || 0;
      dedicationEl.innerText = data.dedicationCount || 0;

      if (likesEl) {
        likesEl.innerText = data.likeCount || 0;
      }
    },

    (err) => {
      console.error("Live counter error:", err);
    }
  );
}


function openFullscreen(url, startIndex = null) {
  if (document.querySelector(".admin-fullscreen")) return;

  const full = document.createElement("div");
  full.className = "admin-fullscreen";

  const closeBtn = document.createElement("button");
  closeBtn.className = "fullscreen-close-btn";
  closeBtn.type = "button";
  closeBtn.innerText = "×";
  closeBtn.setAttribute("aria-label", "Zatvori pregled");

  const downloadBtn = document.createElement("button");
  downloadBtn.className = "fullscreen-download-btn";
  downloadBtn.type = "button";
  downloadBtn.innerHTML = `
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M16 5v15" />
      <path d="M9.5 14.5 16 21l6.5-6.5" />
      <path d="M9 26h14" />
    </svg>
  `;
  downloadBtn.setAttribute("aria-label", "Preuzmi fotografiju");

  const prevBtn = document.createElement("button");
  prevBtn.className = "fullscreen-nav-btn fullscreen-prev-btn";
  prevBtn.type = "button";
  prevBtn.innerText = "‹";

  const nextBtn = document.createElement("button");
  nextBtn.className = "fullscreen-nav-btn fullscreen-next-btn";
  nextBtn.type = "button";
  nextBtn.innerText = "›";

  const likeBtn = document.createElement("button");
  likeBtn.className = "fullscreen-like-btn";
  likeBtn.type = "button";
  likeBtn.innerHTML = `
    <span class="heart">❤️</span>
    <span class="like-count">0</span>
  `;
  likeBtn.setAttribute("aria-label", "Lajkaj fotografiju");

  const img = document.createElement("img");
  img.className = "admin-fullscreen-img";
  img.src = "";
  img.draggable = false;

  full.appendChild(img);
  full.appendChild(closeBtn);
  full.appendChild(downloadBtn);
  full.appendChild(prevBtn);
  full.appendChild(nextBtn);
  full.appendChild(likeBtn);

  document.body.appendChild(full);
  document.body.classList.add("fullscreen-open");

  let photos = [...renderedPhotos.keys()];
  let index = startIndex !== null ? startIndex : 0;
  let currentPhotoId = null;
  let currentImageUrl = url;

  if (!photos.length) {
    currentPhotoId = null;
    currentImageUrl = url;
    img.src = url;
    img.style.opacity = "1";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    likeBtn.style.display = "none";
  } else {
    const currentEntry = [...renderedPhotos.entries()]
      .find(([id, el]) => el.dataset.full === url);

    index = photos.indexOf(currentEntry?.[0]);

    if (index < 0) index = 0;
  }

  function closeFullscreen() {
    document.body.classList.remove("fullscreen-open");
    full.remove();
  }

  function updateFullscreenActions() {
    if (!currentPhotoId) {
      likeBtn.style.display = "none";
      return;
    }

    likeBtn.style.display = "inline-flex";

    const card = renderedPhotos.get(currentPhotoId);
    const count = getCardLikeCount(card);
    const countEl = likeBtn.querySelector(".like-count");
    const heartEl = likeBtn.querySelector(".heart");

    if (countEl) countEl.innerText = count;
    heartEl?.classList.toggle("liked", likedCache.has(currentPhotoId));
  }

  function render() {
    if (!photos.length) {
      currentPhotoId = null;
      currentImageUrl = url;
      img.src = url;
      img.style.opacity = "1";
      updateFullscreenActions();
      return;
    }

    const id = photos[index];
    if (!id) return;

    const card = renderedPhotos.get(id);
    if (!card) return;

    currentPhotoId = id;
    currentImageUrl = card.dataset.full;
    updateFullscreenActions();

    img.style.opacity = "0";

    const newImg = new Image();

    newImg.onload = () => {
      img.src = newImg.src;
      img.style.opacity = "1";
    };

    newImg.src = currentImageUrl;
  }

  function showPrev() {
    if (!photos.length) return;

    index =
      (index - 1 + photos.length) % photos.length;

    render();
  }

  function showNext() {
    if (!photos.length) return;

    index =
      (index + 1) % photos.length;

    render();
  }

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeFullscreen();
  });

  downloadBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await downloadImageFromUrl(
      currentImageUrl,
      getPhotoDownloadFileName(currentPhotoId || "fullscreen")
    );
  });

  likeBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (!currentPhotoId) return;
    await likePhoto(currentPhotoId, full);
    updateFullscreenActions();
  });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
  });

  let startX = 0;
  let startY = 0;
  let pinchInProgress = false;
  let swipeMoved = false;

  function isZoomed() {
    return Boolean(window.visualViewport && window.visualViewport.scale > 1.02);
  }

  full.addEventListener("touchstart", (e) => {
    if (e.touches.length > 1) {
      pinchInProgress = true;
      return;
    }

    pinchInProgress = false;
    swipeMoved = false;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  full.addEventListener("touchmove", (e) => {
    if (e.touches.length > 1) {
      pinchInProgress = true;
      return;
    }

    if (!e.touches.length) return;

    const diffX = Math.abs(e.touches[0].clientX - startX);
    const diffY = Math.abs(e.touches[0].clientY - startY);

    if (diffX > 12 || diffY > 12) {
      swipeMoved = true;
    }
  }, { passive: true });

  full.addEventListener("touchend", (e) => {
    if (pinchInProgress || isZoomed()) {
      if (!e.touches || e.touches.length === 0) {
        setTimeout(() => {
          pinchInProgress = false;
        }, 180);
      }
      return;
    }

    if (!e.changedTouches.length) return;
    if (e.touches && e.touches.length > 0) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = startX - endX;
    const diffY = startY - endY;

    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    if (swipeMoved && absX > absY && absX > 55) {
      if (diffX > 0) {
        showNext();
      } else {
        showPrev();
      }
    }
  }, { passive: true });

  document.addEventListener(
    "keydown",
    function fullscreenKeyHandler(e) {
      if (!document.body.classList.contains("fullscreen-open")) {
        document.removeEventListener("keydown", fullscreenKeyHandler);
        return;
      }

      if (e.key === "Escape") {
        closeFullscreen();
        document.removeEventListener("keydown", fullscreenKeyHandler);
      }

      if (e.key === "ArrowLeft") {
        showPrev();
      }

      if (e.key === "ArrowRight") {
        showNext();
      }
    }
  );

  render();
}

window.checkAdmin = function () {
  const pass = document.getElementById("adminPass")?.value;

  if (pass === "admin") {
    window.location.href =
      "/admin.html?event=" + encodeURIComponent(currentEventId);
  } else {
    alert("Kriva šifra");
  }
};

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerText = tr(message);
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2000);
}
let activeUserId =
  localStorage.getItem("userId_" + currentEventId) ||
  (storedEventIdBeforeOpen === currentEventId
    ? localStorage.getItem("userId")
    : "") ||
  (cookieEventId === currentEventId
    ? getPwaCookie("pde_userId")
    : "");

if (!activeUserId) {
  activeUserId = createGuestUserId();
}

const user =
  localStorage.getItem("name_" + currentEventId) ||
  (storedEventIdBeforeOpen === currentEventId
    ? localStorage.getItem("name")
    : "") ||
  (cookieEventId === currentEventId
    ? getPwaCookie("pde_name")
    : "");

const welcomeEl = document.getElementById("welcome");

if (!user) {
  window.location.href =
    "/event.html?event=" + encodeURIComponent(currentEventId);
} else {
  // Keep the existing keys for all current app functions, while also storing
  // an event-specific copy and a cookie bridge for future PWA installs.
  localStorage.setItem("eventId", currentEventId);
  localStorage.setItem("name", user);
  localStorage.setItem("userId", activeUserId);
  localStorage.setItem("name_" + currentEventId, user);
  localStorage.setItem("userId_" + currentEventId, activeUserId);

  setPwaCookie("pde_eventId", currentEventId);
  setPwaCookie("pde_name", user);
  setPwaCookie("pde_userId", activeUserId);

  const storedAuthUid = getStoredAuthUid();
  if (storedAuthUid) {
    localStorage.setItem("authUid_" + currentEventId, storedAuthUid);
  }
}

if (user && welcomeEl) {
  welcomeEl.innerText = "Pozdrav, " + user;
}

async function initApp() {
  const booted = bootEventFromCache();

  if (!booted) {
    const loaded = await loadEventDataFallback();

    if (!loaded) {
      document.body.classList.add("loaded");
      return;
    }
  }

  initGalleryControls();
  loadFeed();
  loadLiveCounters();

  requestAnimationFrame(() => {
    document.body.classList.add("loaded");
  });
}

let reloaded = false;

window.addEventListener("online", () => {
  if (reloaded) return;

  const pending = JSON.parse(localStorage.getItem("pendingUploads") || "[]");

if (pending.length > 0) {
  reloaded = true;

  localStorage.removeItem("pendingUploads");

  showToast("Internet vraćen — pokušavam upload 📡");

  setTimeout(() => {
    location.reload();
  }, 1500);
}
});

void ensureGuestAuth();
initApp();