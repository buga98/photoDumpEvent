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
  startAfter,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  getDownloadURL
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

const currentEventId =
  new URLSearchParams(window.location.search).get("event");

if (!currentEventId) {
  alert("Nema event ID-a");
  throw new Error("Missing eventId");
}

const IMAGE_LIMIT = 24;
const DEDICATION_LIMIT = 24;
const SLIDESHOW_LIMIT = 200;

let lastVisible = null;
let loadingMore = false;
let hasMore = true;

let currentFilter = "all";

let selectedPhotoId = null;
let selectedWrapper = null;
let selectedVisible = true;

let selectionMode = false;
let selectedIds = new Set();

let slideshowImages = [];
let slideshowInterval = null;
let slideshowUnsubscribe = null;
let overlay = null;
let currentSlideIndex = -1;

let showAuthor =
  localStorage.getItem("showAuthor") !== "false";

let showDedications =
  localStorage.getItem("showDedications") === "true";

let slideSpeed =
  Number(localStorage.getItem("slideSpeed")) || 3000;

async function loadEventInfo() {
  const snap = await getDoc(
    doc(db, "events", currentEventId)
  );

  if (snap.exists()) {
    const eventName =
      document.getElementById("eventName");

    if (eventName) {
      eventName.innerText =
        snap.data().title || "Event";
    }
  }
}

function photosBaseRef() {
  return collection(
    db,
    "events",
    currentEventId,
    "photos"
  );
}

function dedicationsBaseRef() {
  return collection(
    db,
    "events",
    currentEventId,
    "dedications"
  );
}

function buildPhotosQuery(pageAfter = null) {
  const constraints = [];

  if (currentFilter === "visible") {
    constraints.push(
      where("visible", "==", true)
    );
  }

  if (currentFilter === "hidden") {
    constraints.push(
      where("visible", "==", false)
    );
  }

  constraints.push(
    orderBy("created", "desc")
  );

  if (pageAfter) {
    constraints.push(
      startAfter(pageAfter)
    );
  }

  constraints.push(
    limit(IMAGE_LIMIT)
  );

  return query(
    photosBaseRef(),
    ...constraints
  );
}

function createPhotoCard(imgData) {
  const wrapper =
    document.createElement("div");

  wrapper.className = "photo-card";
  wrapper.dataset.id = imgData.id;

  if (!imgData.visible) {
    wrapper.classList.add("hidden-photo");
  }

  const img =
    document.createElement("img");

  img.src =
    imgData.thumb || imgData.url;

  img.loading = "lazy";
  img.decoding = "async";
  img.draggable = false;

  wrapper.appendChild(img);

  const badge =
    document.createElement("div");

  badge.className = "admin-badge";
  badge.innerText =
    imgData.visible ? "✔" : "🚫";

  wrapper.appendChild(badge);

  let pressTimer = null;
  let moved = false;

  wrapper.addEventListener("touchstart", () => {
    if (selectionMode) return;

    moved = false;

    pressTimer = setTimeout(() => {
      if (!moved) {
        openPhotoAction(
          imgData.id,
          wrapper
        );
      }
    }, 600);
  });

  wrapper.addEventListener("touchmove", () => {
    moved = true;
    clearTimeout(pressTimer);
  });

  wrapper.addEventListener("touchend", () => {
    clearTimeout(pressTimer);
  });

  wrapper.addEventListener("touchcancel", () => {
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

  return wrapper;
}

function normalizePhoto(docSnap) {
  const data = docSnap.data();

  return {
    id: docSnap.id,
    url: data.imageUrl,
    thumb: data.thumbUrl,
    user: data.user || "Gost",
    visible: data.visible !== false,
    created: data.created || 0
  };
}

function setPhotoCount() {
  const el =
    document.getElementById("photoCount");

  if (el) {
    el.innerText =
      document.querySelectorAll(".photo-card").length;
  }
}

window.filterPhotos = function (type) {
  currentFilter = type;
  lastVisible = null;
  hasMore = true;
  selectedIds.clear();

  document
    .querySelectorAll(".admin-filters button")
    .forEach((btn) => {
      btn.classList.remove("active");
    });

  const map = {
    all: 0,
    visible: 1,
    hidden: 2
  };

  document
    .querySelectorAll(".admin-filters button")
    [map[type]]
    ?.classList.add("active");

  loadAllImages();
};

async function loadAllImages() {
  const gallery =
    document.getElementById("gallery");

  if (!gallery) return;

  gallery.innerHTML = "Učitavanje...";

  loadingMore = false;
  hasMore = true;
  lastVisible = null;
  selectedIds.clear();

  try {
    const q = buildPhotosQuery();
    const snapshot = await getDocs(q);

    gallery.innerHTML = "";

    if (snapshot.empty) {
      gallery.innerHTML =
        "<p style='grid-column:1/-1; opacity:.65;'>Nema fotografija za prikaz.</p>";

      setPhotoCount();
      hasMore = false;
      return;
    }

    lastVisible =
      snapshot.docs[snapshot.docs.length - 1];

    const fragment =
      document.createDocumentFragment();

    snapshot.forEach((docSnap) => {
      const card =
        createPhotoCard(
          normalizePhoto(docSnap)
        );

      fragment.appendChild(card);
    });

    gallery.appendChild(fragment);
    setPhotoCount();

  } catch (err) {
    console.error("Load images error:", err);

    gallery.innerHTML =
      "<p style='grid-column:1/-1; color:#ff7b7b;'>Greška kod učitavanja fotografija.</p>";
  }
}

async function loadMoreImages() {
  if (
    loadingMore ||
    !hasMore ||
    !lastVisible
  ) {
    return;
  }

  loadingMore = true;

  try {
    const q =
      buildPhotosQuery(lastVisible);

    const snapshot =
      await getDocs(q);

    if (snapshot.empty) {
      hasMore = false;
      return;
    }

    lastVisible =
      snapshot.docs[snapshot.docs.length - 1];

    const gallery =
      document.getElementById("gallery");

    if (!gallery) return;

    const fragment =
      document.createDocumentFragment();

    snapshot.forEach((docSnap) => {
      const card =
        createPhotoCard(
          normalizePhoto(docSnap)
        );

      fragment.appendChild(card);
    });

    gallery.appendChild(fragment);
    setPhotoCount();

  } catch (err) {
    console.error("Load more images error:", err);
  } finally {
    loadingMore = false;
  }
}

function openPhotoAction(id, wrapper) {
  selectedPhotoId = id;
  selectedWrapper = wrapper;
  selectedVisible =
    !wrapper.classList.contains("hidden-photo");

  const title =
    document.getElementById("photoActionTitle");

  if (title) {
    title.innerText =
      selectedVisible
        ? "Maknuti sliku?"
        : "Vratiti sliku?";
  }

  const modal =
    document.getElementById("photoActionModal");

  if (modal) {
    modal.style.display = "flex";
  }
}

window.confirmPhotoAction = async function (confirm) {
  const modal =
    document.getElementById("photoActionModal");

  if (modal) {
    modal.style.display = "none";
  }

  if (!confirm || !selectedPhotoId) return;

  const newState = !selectedVisible;

  try {
    await updateDoc(
      doc(
        db,
        "events",
        currentEventId,
        "photos",
        selectedPhotoId
      ),
      {
        visible: newState
      }
    );

    selectedWrapper
      ?.classList
      .toggle("hidden-photo", !newState);

    const badge =
      selectedWrapper?.querySelector(".admin-badge");

    if (badge) {
      badge.innerText =
        newState ? "✔" : "🚫";
    }

  } catch (err) {
    console.error("Photo action error:", err);
    alert("Greška kod promjene slike.");
  }
};

async function loadDedications() {
  const list =
    document.getElementById("dedicationsList");

  if (!list) return;

  try {
    const snapshot =
      await getDocs(
        query(
          dedicationsBaseRef(),
          orderBy("created", "desc"),
          limit(DEDICATION_LIMIT)
        )
      );

    list.innerHTML = "";

    if (snapshot.empty) {
      list.innerHTML =
        "<p style='opacity:.65;'>Nema posveta.</p>";

      const countEl =
        document.getElementById("dedicationCount");

      if (countEl) countEl.innerText = 0;

      return;
    }

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      const item =
        document.createElement("div");

      item.className = "dedication-card";

      const text =
        document.createElement("div");

      text.innerText =
        ((data.text || "").slice(0, 50)) +
        ((data.text || "").length > 50 ? "..." : "");

      const author =
        document.createElement("small");

      author.innerText =
        data.name || "Gost";

      item.appendChild(text);
      item.appendChild(author);

      item.onclick = () =>
        openDedicationModal(data);

      list.appendChild(item);
    });

    const countEl =
      document.getElementById("dedicationCount");

    if (countEl) {
      countEl.innerText = snapshot.size;
    }

  } catch (err) {
    console.error("Dedications error:", err);

    list.innerHTML =
      "<p style='color:#ff7b7b;'>Greška kod učitavanja posveta.</p>";
  }
}

window.openDedicationModal = function (data) {
  const fullText =
    document.getElementById("dedicationFullText");

  const author =
    document.getElementById("dedicationAuthor");

  const modal =
    document.getElementById("dedicationModal");

  if (fullText) {
    fullText.innerText =
      data.text || "";
  }

  if (author) {
    author.innerText =
      "— " + (data.name || "Gost");
  }

  if (modal) {
    modal.style.display = "flex";
  }
};

window.closeDedicationModal = function () {
  const modal =
    document.getElementById("dedicationModal");

  if (modal) {
    modal.style.display = "none";
  }
};

function buildSlideshowQuery() {
  return query(
    photosBaseRef(),
    where("visible", "==", true),
    orderBy("created", "desc"),
    limit(SLIDESHOW_LIMIT)
  );
}

function stopSlideshow() {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
  }

  if (slideshowUnsubscribe) {
    slideshowUnsubscribe();
    slideshowUnsubscribe = null;
  }

  if (overlay) {
    overlay.remove();
    overlay = null;
  }

  document.body.classList.remove("slideshow-open");

  slideshowImages = [];
  currentSlideIndex = -1;
}

function renderSlideshowOverlay() {
  overlay =
    document.createElement("div");

  overlay.id = "slideshowOverlay";
  overlay.innerHTML = "";

  const closeBtn =
    document.createElement("button");

  closeBtn.className = "slideshow-close";
  closeBtn.innerText = "×";

  const imgWrap =
    document.createElement("div");

  imgWrap.className = "slideshow-image-wrap";

  const img =
    document.createElement("img");

  img.id = "slideshowImage";
  img.alt = "Slideshow fotografija";

  imgWrap.appendChild(img);

  const caption =
    document.createElement("div");

  caption.id = "slideshowCaption";

  const counter =
    document.createElement("div");

  counter.id = "slideshowCounter";

  const loading =
    document.createElement("div");

  loading.id = "slideshowLoading";
  loading.innerText = "Učitavam slideshow...";

  overlay.appendChild(closeBtn);
  overlay.appendChild(imgWrap);
  overlay.appendChild(caption);
  overlay.appendChild(counter);
  overlay.appendChild(loading);

  document.body.appendChild(overlay);
  document.body.classList.add("slideshow-open");

  closeBtn.onclick = (e) => {
    e.stopPropagation();
    stopSlideshow();
  };

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      stopSlideshow();
    }
  });

  document.addEventListener(
    "keydown",
    function escClose(e) {
      if (e.key === "Escape") {
        stopSlideshow();
        document.removeEventListener("keydown", escClose);
      }
    }
  );
}

function updateSlideshowCounter() {
  const counter =
    document.getElementById("slideshowCounter");

  if (!counter) return;

  counter.innerText =
    slideshowImages.length
      ? `${currentSlideIndex + 1} / ${slideshowImages.length}`
      : "";
}

function showSlide(index = null) {
  if (!slideshowImages.length) return;

  const imgEl =
    document.getElementById("slideshowImage");

  const caption =
    document.getElementById("slideshowCaption");

  const loading =
    document.getElementById("slideshowLoading");

  if (!imgEl || !caption) return;

  let nextIndex;

  if (index !== null) {
    nextIndex = index;
  } else {
    if (slideshowImages.length === 1) {
      nextIndex = 0;
    } else {
      do {
        nextIndex =
          Math.floor(
            Math.random() * slideshowImages.length
          );
      } while (nextIndex === currentSlideIndex);
    }
  }

  currentSlideIndex = nextIndex;

  const current =
    slideshowImages[currentSlideIndex];

  if (loading) {
    loading.style.display = "none";
  }

  imgEl.classList.remove("show");

  const preload =
    new Image();

  preload.onload = () => {
    imgEl.src = preload.src;

    requestAnimationFrame(() => {
      imgEl.classList.add("show");
    });
  };

  preload.src = current.url;

  caption.innerText =
    showAuthor
      ? "📸 " + (current.user || "Gost")
      : "";

  updateSlideshowCounter();
}

function restartSlideshowTimer() {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
  }

  slideshowInterval =
    setInterval(() => {
      showSlide();
    }, slideSpeed);
}

window.startSlideshow = function () {
  stopSlideshow();
  renderSlideshowOverlay();

  const loading =
    document.getElementById("slideshowLoading");

  slideshowUnsubscribe =
    onSnapshot(
      buildSlideshowQuery(),

      (snapshot) => {
        slideshowImages = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();

          if (!data.imageUrl) return;

          slideshowImages.push({
            id: docSnap.id,
            url: data.imageUrl,
            thumb: data.thumbUrl,
            user: data.user || "Gost",
            created: data.created || 0
          });
        });

        if (!slideshowImages.length) {
          if (loading) {
            loading.innerText =
              "Nema vidljivih fotografija za slideshow.";
          }

          return;
        }

        if (
          currentSlideIndex < 0 ||
          currentSlideIndex >= slideshowImages.length
        ) {
          showSlide(0);
        }

        restartSlideshowTimer();
      },

      (err) => {
        console.error("Slideshow listener error:", err);

        if (loading) {
          loading.innerText =
            "Greška kod učitavanja slideshowa.";
        }
      }
    );
};

window.switchAdminScreen = function (screen) {
  document
    .querySelectorAll(".tab-content")
    .forEach((el) =>
      el.classList.remove("active")
    );

  document
    .querySelectorAll(".admin-nav-item")
    .forEach((el) =>
      el.classList.remove("active")
    );

  const photoActions =
    document.getElementById("photoAdminActions");

  const photoFilters =
    document.getElementById("photoAdminFilters");

  if (screen === "photos") {
    document
      .getElementById("adminPhotos")
      ?.classList.add("active");

    document
      .querySelectorAll(".admin-nav-item")[0]
      ?.classList.add("active");

    photoActions?.classList.remove("admin-hidden");
    photoFilters?.classList.remove("admin-hidden");

    return;
  }

  if (screen === "dedications") {
    document
      .getElementById("adminDedications")
      ?.classList.add("active");

    document
      .querySelectorAll(".admin-nav-item")[1]
      ?.classList.add("active");

    photoActions?.classList.add("admin-hidden");
    photoFilters?.classList.add("admin-hidden");

    if (selectionMode) {
      selectionMode = false;
      selectedIds.clear();

      document.body.classList.remove("select-mode");

      document
        .querySelectorAll(".photo-card")
        .forEach((card) => {
          card.classList.remove("selected");
        });
    }
  }
};

window.goBackFromAdmin = function () {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  window.location.href =
    "/app.html?event=" + encodeURIComponent(currentEventId);
};

window.toggleSelectionMode = function () {
  selectionMode = !selectionMode;

  selectedIds.clear();

  document.body.classList.toggle(
    "select-mode",
    selectionMode
  );

  document
    .querySelectorAll(".photo-card")
    .forEach((card) => {
      card.classList.remove("selected");
    });
};

window.selectAll = function () {
  selectedIds.clear();

  document
    .querySelectorAll(".photo-card")
    .forEach((card) => {
      const id = card.dataset.id;

      if (!id) return;

      selectedIds.add(id);
      card.classList.add("selected");
    });
};

window.hideSelected = async function () {
  if (!selectedIds.size) {
    alert("Nisi označio slike.");
    return;
  }

  try {
    for (const id of selectedIds) {
      await updateDoc(
        doc(
          db,
          "events",
          currentEventId,
          "photos",
          id
        ),
        {
          visible: false
        }
      );
    }

    alert("Sakriveno ✔");

    selectedIds.clear();
    selectionMode = false;
    document.body.classList.remove("select-mode");

    loadAllImages();

  } catch (err) {
    console.error("Hide selected error:", err);
    alert("Greška kod sakrivanja slika.");
  }
};

window.showSelected = async function () {
  if (!selectedIds.size) {
    alert("Nisi označio slike.");
    return;
  }

  try {
    for (const id of selectedIds) {
      await updateDoc(
        doc(
          db,
          "events",
          currentEventId,
          "photos",
          id
        ),
        {
          visible: true
        }
      );
    }

    alert("Vraćeno ✔");

    selectedIds.clear();
    selectionMode = false;
    document.body.classList.remove("select-mode");

    loadAllImages();

  } catch (err) {
    console.error("Show selected error:", err);
    alert("Greška kod vraćanja slika.");
  }
};

window.openSettings = function () {
  const modal =
    document.getElementById("settingsModal");

  const showAuthorEl =
    document.getElementById("showAuthor");

  const showDedicationsEl =
    document.getElementById("showDedications");

  const speedEl =
    document.getElementById("slideSpeed");

  if (showAuthorEl) {
    showAuthorEl.checked = showAuthor;
  }

  if (showDedicationsEl) {
    showDedicationsEl.checked = showDedications;
  }

  if (speedEl) {
    speedEl.value = String(slideSpeed);
  }

  if (modal) {
    modal.style.display = "flex";
  }
};

window.closeSettings = function () {
  const showAuthorEl =
    document.getElementById("showAuthor");

  const showDedicationsEl =
    document.getElementById("showDedications");

  const speedEl =
    document.getElementById("slideSpeed");

  if (showAuthorEl) {
    showAuthor = showAuthorEl.checked;
  }

  if (showDedicationsEl) {
    showDedications =
      showDedicationsEl.checked;
  }

  if (speedEl) {
    const value =
      Number(speedEl.value);

    if (value >= 1500 && value <= 15000) {
      slideSpeed = value;
    }
  }

  localStorage.setItem(
    "showAuthor",
    showAuthor
  );

  localStorage.setItem(
    "showDedications",
    showDedications
  );

  localStorage.setItem(
    "slideSpeed",
    slideSpeed
  );

  const modal =
    document.getElementById("settingsModal");

  if (modal) {
    modal.style.display = "none";
  }

  if (slideshowInterval) {
    restartSlideshowTimer();
  }
};

window.downloadAllPhotos = async function () {
  const btn =
    document.getElementById("downloadZipBtn");

  if (!window.JSZip) {
    alert("ZIP alat nije učitan. Osvježi stranicu i pokušaj ponovno.");
    return;
  }

  const confirmDownload = confirm(
    "Preuzimanje ZIP datoteke može potrajati.\n\n" +
    "Preporučeno preuzimanje preko laptopa/računala zbog veličine datoteke.\n\n" +
    "Želiš nastaviti?"
  );

  if (!confirmDownload) return;

  const originalText =
    btn ? btn.innerHTML : "";

  try {
    if (btn) {
      btn.disabled = true;
      btn.innerHTML =
        "⏳ Pripremam fotografije...<br><small>Ovo može potrajati</small>";
    }

    const zip = new JSZip();

    const photosSnapshot =
      await getDocs(
        query(
          photosBaseRef(),
          where("visible", "==", true),
          orderBy("created", "desc")
        )
      );

    if (photosSnapshot.empty) {
      alert("Nema vidljivih fotografija za preuzimanje.");
      return;
    }

    let index = 1;
    let downloaded = 0;
    let originalsUsed = 0;
    let photosUsed = 0;

    const total =
      photosSnapshot.size;

    for (const docSnap of photosSnapshot.docs) {
      const data =
        docSnap.data();

      if (btn) {
        btn.innerHTML =
          `⏳ Preuzimam ${downloaded + 1}/${total}...<br>` +
          `<small>Preporučeno preko laptopa/računala</small>`;
      }

      let downloadUrl = null;
      let usedOriginal = false;

      if (data.originalPath) {
        try {
          downloadUrl =
            await getDownloadURL(
              ref(storage, data.originalPath)
            );

          usedOriginal = true;

        } catch (err) {
          console.warn(
            "Original nije dostupan, koristim komprimiranu fotografiju:",
            docSnap.id,
            err
          );
        }
      }

      if (!downloadUrl && data.imageUrl) {
        downloadUrl =
          data.imageUrl;

        usedOriginal = false;
      }

      if (!downloadUrl) {
        console.warn(
          "Preskačem fotografiju bez URL-a:",
          docSnap.id
        );
        continue;
      }

      try {
        const response =
          await fetch(downloadUrl);

        if (!response.ok) {
          console.warn(
            "Preskačem fotografiju:",
            docSnap.id,
            response.status
          );
          continue;
        }

        const blob =
          await response.blob();

        const extension =
          getFileExtensionFromUrl(downloadUrl) || "jpg";

        const fileName =
          String(index).padStart(4, "0") +
          "-" +
          docSnap.id +
          "." +
          extension;

        zip.file(fileName, blob);

        if (usedOriginal) {
          originalsUsed++;
        } else {
          photosUsed++;
        }

        index++;
        downloaded++;

      } catch (err) {
        console.warn(
          "Greška kod preuzimanja fotografije:",
          docSnap.id,
          err
        );
      }
    }

    if (downloaded === 0) {
      alert("Nije moguće preuzeti fotografije.");
      return;
    }

    if (btn) {
      btn.innerHTML =
        "📦 Stvaram ZIP datoteku...<br><small>Još malo</small>";
    }

    const zipBlob =
      await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6
        }
      });

    const eventSnap =
      await getDoc(
        doc(db, "events", currentEventId)
      );

    const eventTitle =
      eventSnap.exists()
        ? eventSnap.data().title || currentEventId
        : currentEventId;

    const safeTitle =
      eventTitle
        .toString()
        .trim()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || currentEventId;

    const url =
      URL.createObjectURL(zipBlob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download =
      `PhotoDump-${safeTitle}-${currentEventId}.zip`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);

    alert(
      "ZIP je pripremljen.\n" +
      `Preuzeto fotografija: ${downloaded}/${total}\n` 
    );

  } catch (err) {
    console.error("Download ZIP error:", err);
    alert("Greška kod pripreme ZIP datoteke.");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }
};
function getFileExtensionFromUrl(url) {
  try {
    const cleanUrl =
      decodeURIComponent(url.split("?")[0]);

    const match =
      cleanUrl.match(/\.([a-zA-Z0-9]+)$/);

    if (!match) return null;

    const ext =
      match[1].toLowerCase();

    if (
      ["jpg", "jpeg", "png", "webp", "heic"].includes(ext)
    ) {
      return ext === "jpeg" ? "jpg" : ext;
    }

    return null;

  } catch (err) {
    return null;
  }
}

loadEventInfo();
loadAllImages();
loadDedications();
switchAdminScreen("photos");

window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 300
  ) {
    loadMoreImages();
  }
});