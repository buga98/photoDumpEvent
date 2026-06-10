let currentEventId =
  new URLSearchParams(window.location.search).get("event") ||
  localStorage.getItem("eventId");
  if (!currentEventId) {
  alert("Event nije pronađen. Otvori aplikaciju putem QR koda.");
  window.location.href = "/";
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
  deleteDoc,
  updateDoc,
  increment,
  limit,
  startAfter
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";

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
    home_title: "Galerija uspomena 🤍",
    home_subtitle: "Svaka fotografija postaje dio uspomena",

    upload_title: "Podijeli trenutak 📸",
    upload_subtitle: "Dodaj fotografiju i ostavi uspomenu",

    profile_title: "Tvoje uspomene",
    profile_subtitle: "Ovdje su tvoje fotografije"
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
let lastVisiblePhoto = null;
let isLoadingMore = false;
let hasMorePhotos = true;
const renderedPhotos = new Map();

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

  renderFeedSkeleton();

  const firstQuery = query(
    collection(db, "events", currentEventId, "photos"),
    orderBy("likes", "desc"),
    orderBy("created", "desc"),
    limit(FEED_PAGE_SIZE)
  );

  onSnapshot(
    firstQuery,

    (snapshot) => {

      if (feed.dataset.loaded !== "true") {
        feed.innerHTML = "";
        feed.dataset.loaded = "true";
      }

const visibleDocs = snapshot.docs.filter(
  d => d.data().visible !== false
);

if (visibleDocs.length === 0) {

  if (renderedPhotos.size === 0) {

    feed.innerHTML = `
      <p style="
        grid-column:1/-1;
        text-align:center;
        opacity:0.6;
        padding:30px 10px;
      ">
        Još nema fotografija 📸
      </p>
    `;
  }

  return;
}

      lastVisiblePhoto = snapshot.docs[snapshot.docs.length - 1];

      snapshot.docChanges().forEach((change) => {
        renderFeedChange(change, feed, true);
      });

      createFeedObserver(feed);
    },

    (error) => {
      console.error("🔥 Feed error:", error);

      feed.innerHTML = `
        <p style="
          grid-column:1/-1;
          text-align:center;
          color:#ff6b6b;
          padding:20px;
        ">
          Greška pri učitavanju 😕<br>
          Provjeri internet ili pokušaj kasnije
        </p>
      `;
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

  feed.appendChild(card);
}

function createFeedCard(photoId, data) {
  const userId = localStorage.getItem("userId");

  const card = document.createElement("div");
  card.className = "feed-card";
  card.dataset.id = photoId;
  card.dataset.full = data.imageUrl;

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
    showBigHeart(card);

    if (likedCache.has(photoId)) return;

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
      heartEl.classList.add("liked");
      return;
    }

    likedCache.add(photoId);
    saveLikedCache();
    heartEl.classList.add("liked");

    await setDoc(userLikeRef, {
      created: Date.now()
    });

    await updateDoc(doc(db, "events", currentEventId, "photos", photoId), {
      likes: increment(1)
    });

await updateDoc(doc(db, "events", currentEventId), {
  likeCount: increment(1)
 });
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

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMoreFeedPhotos(feed);
    }
  }, {
    rootMargin: "300px"
  });

  observer.observe(sentinel);
}

async function loadMoreFeedPhotos(feed) {
  if (isLoadingMore || !hasMorePhotos || !lastVisiblePhoto) return;

  isLoadingMore = true;

const nextQuery = query(
  collection(db, "events", currentEventId, "photos"),
  orderBy("likes", "desc"),
  orderBy("created", "desc"),
  startAfter(lastVisiblePhoto),
  limit(FEED_PAGE_SIZE)
);

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
  return new Promise((resolve) => {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => img.src = e.target.result;

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = height * (maxWidth / width);
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        const newFile = new File(
          [blob],
          file.name.replace(/\.[^/.]+$/, "") + ".jpg",
          { type: "image/jpeg" }
        );

        resolve(newFile);
      }, "image/jpeg", quality);
    };

    reader.readAsDataURL(file);
  });
}

window.uploadToFirebase = function (file, user, onProgress) {
  return new Promise(async (resolve, reject) => {
const eventSnap = await getDoc(
  doc(db, "events", currentEventId)
);

if (!eventSnap.exists()) {
  reject("EVENT_NOT_FOUND");
  return;
}

const eventData = eventSnap.data();
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
      const bigFile = await resizeImage(file, 1450, 0.8);
      const thumbFile = await resizeImage(file, 350, 0.65);

      const safeName = file.name.replace(/\s+/g, "-");
      const timestamp = Date.now();

      const bigRef = ref(
        storage,
        `events/${currentEventId}/photos/${timestamp}_${safeName}`
      );

      const thumbRef = ref(
        storage,
        `events/${currentEventId}/thumbs/${timestamp}_${safeName}`
      );

      const uploadTask = uploadBytesResumable(bigRef, bigFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          if (onProgress) onProgress(percent);
        },
        reject,
        async () => {
          try {
            const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

            await uploadBytesResumable(thumbRef, thumbFile);
            const thumbUrl = await getDownloadURL(thumbRef);

            if (window.eventData?.allowOriginals) {
              const originalRef = ref(
                storage,
                `events/${currentEventId}/originals/${timestamp}_${safeName}`
              );

              await uploadBytesResumable(originalRef, file);
            }

await addDoc(collection(db, "events", currentEventId, "photos"), {
  imageUrl,
  thumbUrl,

  path: uploadTask.snapshot.ref.fullPath,
  thumbPath: thumbRef.fullPath,

  originalPath:
    window.eventData?.allowOriginals
      ? `events/${currentEventId}/originals/${timestamp}_${safeName}`
      : null,

  user,
  userId: localStorage.getItem("userId"),

  created: Date.now(),
  likes: 0,
  visible: true
});

await updateDoc(doc(db, "events", currentEventId), {
  photoCount: increment(1)
});

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

window.uploadFile = async function (files) {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const user = localStorage.getItem("name");

  showToast("Fotografije se učitavaju 📸");

  let uploads = [];

  for (let file of files) {
    const wrapper = document.createElement("div");
    const progress = document.createElement("div");
    const img = document.createElement("img");

    img.src = URL.createObjectURL(file);

    wrapper.appendChild(img);
    wrapper.appendChild(progress);
    gallery.appendChild(wrapper);

const task = uploadToFirebase(file, user, (percent) => {
  progress.style.width = percent + "%";
})
.then((url) => {
  img.src = url;
  progress.remove();
})
.catch((err) => {

  if (err === "EVENT_EXPIRED") {
    progress.remove();
    wrapper.remove();

    showToast("Event je istekao ⏳");
    return;
  }

  if (err === "UPLOAD_LIMIT") {
    progress.remove();
    wrapper.remove();

    showToast("Dosegnut je limit fotografija 📸");
    return;
  }

  if (err === "EVENT_NOT_FOUND") {
    progress.remove();
    wrapper.remove();

    showToast("Event nije pronađen 😕");
    return;
  }

  let pending = JSON.parse(
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

  showToast("Slika će se poslati kad se vrati internet 📡");
});
uploads.push(task);
  }

  await Promise.all(uploads);

  switchScreen("profile");
  loadMyImages();

  showToast("Upload završen 🤍");
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
  const name = localStorage.getItem("name");

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
  const name = localStorage.getItem("name");

  if (!gallery) return;

  gallery.innerHTML =
    "<p style='grid-column:1/-1; opacity:0.6;'>Učitavam...</p>";

  try {
    const q = query(
      collection(db, "events", currentEventId, "photos"),
      where("user", "==", name)
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

  const prevBtn = document.createElement("button");
  prevBtn.className = "fullscreen-nav-btn fullscreen-prev-btn";
  prevBtn.type = "button";
  prevBtn.innerText = "‹";

  const nextBtn = document.createElement("button");
  nextBtn.className = "fullscreen-nav-btn fullscreen-next-btn";
  nextBtn.type = "button";
  nextBtn.innerText = "›";

  const img = document.createElement("img");
  img.className = "admin-fullscreen-img";
  img.src = "";

  full.appendChild(img);
  full.appendChild(closeBtn);
  full.appendChild(prevBtn);
  full.appendChild(nextBtn);

  document.body.appendChild(full);
  document.body.classList.add("fullscreen-open");

  let photos = [...renderedPhotos.keys()];
  let index = startIndex !== null ? startIndex : 0;

  if (!photos.length) {
    img.src = url;
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  } else {
    const currentId = [...renderedPhotos.entries()]
      .find(([id, el]) => el.dataset.full === url);

    index = photos.indexOf(currentId?.[0]);

    if (index < 0) index = 0;
  }

  function closeFullscreen() {
    document.body.classList.remove("fullscreen-open");
    full.remove();
  }

  function render() {
    if (!photos.length) {
      img.src = url;
      return;
    }

    const id = photos[index];
    if (!id) return;

    const card = renderedPhotos.get(id);
    if (!card) return;

    img.style.opacity = "0";

    const newImg = new Image();

    newImg.onload = () => {
      img.src = newImg.src;
      img.style.opacity = "1";
    };

    newImg.src = card.dataset.full;
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

full.addEventListener("touchstart", (e) => {
  if (e.touches.length !== 1) return;

  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: true });

  full.addEventListener("touchend", (e) => {
    if (!e.changedTouches.length) return;
      if (e.touches && e.touches.length > 0) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = startX - endX;
    const diffY = startY - endY;

    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    if (absX > absY && absX > 50) {
      if (diffX > 0) {
        showNext();
      } else {
        showPrev();
      }

      return;
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

  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2000);
}
if (!localStorage.getItem("userId")) {
  localStorage.setItem(
    "userId",
    crypto.randomUUID()
  );
}
const user = localStorage.getItem("name");
const welcomeEl = document.getElementById("welcome");

if (!user) {
  window.location.href =
    "/event.html?event=" + encodeURIComponent(currentEventId);
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

initApp();