import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  limit,
  getDoc,
  startAfter   
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* ================= FIREBASE (ISTI KAO APP) ================= */
const firebaseConfig = {
  apiKey: "AIzaSyBjETO...",
  authDomain: "photodumpevent-4578c.firebaseapp.com",
  projectId: "photodumpevent-4578c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= EVENT ID ================= */
const currentEventId =
  new URLSearchParams(window.location.search).get("event");

if (!currentEventId) {
  alert("Nema event ID-a");
  throw new Error("Missing eventId");
}

/* ================= SETTINGS ================= */
const IMAGE_LIMIT = 24;
const DEDICATION_LIMIT = 24;
let lastVisible = null;
let loadingMore = false;
let hasMore = true;
/* ================= STATE ================= */
let currentFilter = "all";
let selectedPhotoId = null;
let selectedWrapper = null;
let selectedVisible = true;

let allImages = [];
let slideshowImages = [];

let slideshowInterval = null;
let overlay = null;

let showAuthor = localStorage.getItem("showAuthor") !== "false";
let showDedications = localStorage.getItem("showDedications") === "true";
let selectionMode = false;
let selectedIds = new Set();

/* ================= EVENT INFO ================= */
async function loadEventInfo() {
  const snap = await getDoc(doc(db, "events", currentEventId));

  if (snap.exists()) {
    document.getElementById("eventName").innerText =
      snap.data().title;
  }
}

/* ================= HELPERS ================= */
function buildImageList(snapshot) {
  allImages = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    if (currentFilter === "visible" && data.visible === false) return;
    if (currentFilter === "hidden" && data.visible !== false) return;

    allImages.push({
      id: docSnap.id,
      url: data.imageUrl,
      thumb: data.thumbUrl,
      user: data.user || "Gost",
      visible: data.visible !== false
    });
  });
}

/* ================= FILTER ================= */
window.filterPhotos = function (type) {
  lastVisible = null;
hasMore = true;
  currentFilter = type;

  document.querySelectorAll(".admin-filters button").forEach((btn) => {
    btn.classList.remove("active");
  });

  const map = { all: 0, visible: 1, hidden: 2 };
  document.querySelectorAll(".admin-filters button")[map[type]]?.classList.add("active");

  loadAllImages();
};

/* ================= GALLERY ================= */
async function loadAllImages() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  gallery.innerHTML = "Učitavanje...";

const q = query(
  collection(db, "events", currentEventId, "photos"),
  orderBy("created", "desc"),
  limit(IMAGE_LIMIT)
);

const snapshot = await getDocs(q);

lastVisible = snapshot.docs[snapshot.docs.length - 1];

  gallery.innerHTML = "";
  buildImageList(snapshot);

  let count = 0;

  allImages.forEach((imgData) => {
    count++;

    const wrapper = document.createElement("div");
    wrapper.className = "photo-card";
    wrapper.dataset.id = imgData.id;

    if (!imgData.visible) wrapper.classList.add("hidden-photo");

    const img = document.createElement("img");
    img.src = imgData.thumb || imgData.url;
    img.loading = "lazy";
    img.decoding = "async";

    wrapper.appendChild(img);

    const badge = document.createElement("div");
    badge.className = "admin-badge";
    badge.innerText = imgData.visible ? "✔" : "🚫";
    wrapper.appendChild(badge);

    let pressTimer;
    let moved = false;

    wrapper.addEventListener("touchstart", (e) => {
  if (selectionMode) return;
      moved = false;

      pressTimer = setTimeout(() => {
        if (!moved) {
          openPhotoAction(imgData.id, wrapper);
        }
      }, 600);
    });

    wrapper.addEventListener("touchmove", () => {
      moved = true;
      clearTimeout(pressTimer);
    });
wrapper.addEventListener("click", () => {
  if (!selectionMode) return;

  const id = imgData.id;

  if (selectedIds.has(id)) {
    selectedIds.delete(id);
    wrapper.classList.remove("selected");
  } else {
    selectedIds.add(id);
    wrapper.classList.add("selected");
  }
});
    wrapper.addEventListener("touchend", () => {
      clearTimeout(pressTimer);
    });

    gallery.appendChild(wrapper);
  });

  document.getElementById("photoCount").innerText = count;
}
async function loadMoreImages() {
  if (loadingMore || !hasMore || !lastVisible) return;

  loadingMore = true;

  const q = query(
    collection(db, "events", currentEventId, "photos"),
    orderBy("created", "desc"),
    startAfter(lastVisible),
    limit(IMAGE_LIMIT)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    hasMore = false;
    loadingMore = false;
    return;
  }

  lastVisible = snapshot.docs[snapshot.docs.length - 1];

  const gallery = document.getElementById("gallery");

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    // 🔥 FILTER SUPPORT
    if (currentFilter === "visible" && data.visible === false) return;
    if (currentFilter === "hidden" && data.visible !== false) return;

    const wrapper = document.createElement("div");
    wrapper.className = "photo-card";
    wrapper.dataset.id = docSnap.id;

    if (data.visible === false) wrapper.classList.add("hidden-photo");

    const img = document.createElement("img");
    img.src = data.thumbUrl || data.imageUrl;
    img.loading = "lazy";

    wrapper.appendChild(img);

    const badge = document.createElement("div");
    badge.className = "admin-badge";
    badge.innerText = data.visible === false ? "🚫" : "✔";
    wrapper.appendChild(badge);

    // 🔥 LONG PRESS
    let pressTimer;
    let moved = false;

    wrapper.addEventListener("touchstart", (e) => {
  if (selectionMode) return;
      moved = false;

      pressTimer = setTimeout(() => {
        if (!moved) {
          openPhotoAction(docSnap.id, wrapper);
        }
      }, 600);
    });
wrapper.addEventListener("click", () => {
  if (!selectionMode) return;

  const id = docSnap.id;
  if (selectedIds.has(id)) {
    selectedIds.delete(id);
    wrapper.classList.remove("selected");
  } else {
    selectedIds.add(id);
    wrapper.classList.add("selected");
  }
});
    wrapper.addEventListener("touchmove", () => {
      moved = true;
      clearTimeout(pressTimer);
    });

    wrapper.addEventListener("touchend", () => {
      clearTimeout(pressTimer);
    });

    gallery.appendChild(wrapper);
  });

  // 🔥 UPDATE COUNT
  document.getElementById("photoCount").innerText =
    document.querySelectorAll(".photo-card").length;

  loadingMore = false;
}
/* ================= ACTION ================= */
function openPhotoAction(id, wrapper) {
  selectedPhotoId = id;
  selectedWrapper = wrapper;
  selectedVisible = !wrapper.classList.contains("hidden-photo");

  document.getElementById("photoActionTitle").innerText =
    selectedVisible ? "Maknuti sliku?" : "Vratiti sliku?";

  document.getElementById("photoActionModal").style.display = "flex";
}

window.confirmPhotoAction = async function (confirm) {
  document.getElementById("photoActionModal").style.display = "none";
  if (!confirm) return;

  const newState = !selectedVisible;

  await updateDoc(
    doc(db, "events", currentEventId, "photos", selectedPhotoId),
    { visible: newState }
  );

  selectedWrapper.classList.toggle("hidden-photo", !newState);

  const badge = selectedWrapper.querySelector(".admin-badge");
  if (badge) badge.innerText = newState ? "✔" : "🚫";
};

/* ================= DEDICATIONS ================= */
async function loadDedications() {
  const list = document.getElementById("dedicationsList");
  if (!list) return;

  const snapshot = await getDocs(
    query(
      collection(db, "events", currentEventId, "dedications"),
      orderBy("created", "desc"),
      limit(DEDICATION_LIMIT)
    )
  );

  list.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    const item = document.createElement("div");
    item.className = "dedication-card";

    item.innerHTML = `
      <div>${(data.text || "").slice(0, 50)}...</div>
      <small>${data.name || "Gost"}</small>
    `;

    item.onclick = () => openDedicationModal(data);
    list.appendChild(item);
  });

  document.getElementById("dedicationCount").innerText = snapshot.size;
}

window.openDedicationModal = function (data) {
  document.getElementById("dedicationFullText").innerText = data.text;
  document.getElementById("dedicationAuthor").innerText = "— " + data.name;
  document.getElementById("dedicationModal").style.display = "flex";
};

window.closeDedicationModal = function () {
  document.getElementById("dedicationModal").style.display = "none";
};

/* ================= SLIDESHOW ================= */
window.startSlideshow = async function () {
  const snapshot = await getDocs(
    query(
      collection(db, "events", currentEventId, "photos"),
      orderBy("created", "desc"),
      limit(IMAGE_LIMIT)
    )
  );

  slideshowImages = [];

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    if (data.visible === false) return;

    slideshowImages.push({
      url: data.imageUrl,
      user: data.user || "Gost"
    });
  });

  if (!slideshowImages.length) return alert("Nema slika");

  overlay = document.createElement("div");
  overlay.id = "slideshowOverlay";

  const img = document.createElement("img");
  const caption = document.createElement("div");

  overlay.append(img, caption);
  document.body.appendChild(overlay);

  function next() {
    const i = Math.floor(Math.random() * slideshowImages.length);
    const current = slideshowImages[i];

    img.src = current.url;
    caption.innerText = showAuthor ? "📸 " + current.user : "";
  }

  next();
  slideshowInterval = setInterval(next, 3000);

  overlay.onclick = () => {
    clearInterval(slideshowInterval);
    overlay.remove();
  };
};

/* ================= NAV ================= */
window.switchAdminScreen = function (screen) {
  document.querySelectorAll(".tab-content").forEach(el =>
    el.classList.remove("active")
  );

  document.querySelectorAll(".admin-nav-item").forEach(el =>
    el.classList.remove("active")
  );

  if (screen === "photos") {
    document.getElementById("adminPhotos").classList.add("active");
    document.querySelectorAll(".admin-nav-item")[0].classList.add("active");
  }

  if (screen === "dedications") {
    document.getElementById("adminDedications").classList.add("active");
    document.querySelectorAll(".admin-nav-item")[1].classList.add("active");
  }
};

/* ================= INIT ================= */
loadEventInfo();
loadAllImages();
loadDedications();
switchAdminScreen("photos");
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 300
  ) {
    loadMoreImages();
  }
});
window.toggleSelectionMode = function () {
  selectionMode = !selectionMode;

  selectedIds.clear();

  document.body.classList.toggle("select-mode", selectionMode);

  document.querySelectorAll(".photo-card").forEach(card => {
    card.classList.remove("selected");
  });
};
window.hideSelected = async function () {
  for (let id of selectedIds) {
    await updateDoc(
      doc(db, "events", currentEventId, "photos", id),
      { visible: false }
    );
  }

  alert("Sakriveno ✔");
  loadAllImages();
selectedIds.clear();
};

window.showSelected = async function () {
  for (let id of selectedIds) {
    await updateDoc(
      doc(db, "events", currentEventId, "photos", id),
      { visible: true }
    );
  }

  alert("Vraćeno ✔");
  loadAllImages();
selectedIds.clear();
};
window.selectAll = function () {
  selectedIds.clear();

  document.querySelectorAll(".photo-card").forEach(card => {
    const id = card.dataset.id;

    if (!id) return;

    selectedIds.add(id);
    card.classList.add("selected");
  });
};