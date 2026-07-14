import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  writeBatch,
  orderBy,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
  getStorage,
  ref,
  list,
  deleteObject,
  getBlob
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-storage.js";

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

let currentEventId = null;
let currentEventData = null;

let currentUser = null;
let currentRole = null;

let loadedEvents = [];

const eventsList =
  document.getElementById("eventsList");

const editor =
  document.getElementById("editor");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  currentUser = user;

  const userSnap =
    await getDoc(
      doc(db, "users", user.uid)
    );

  if (!userSnap.exists()) {
    window.location.href = "/login.html";
    return;
  }

  const userData =
    userSnap.data();

  if (
    userData.approved !== true ||
    userData.disabled === true
  ) {
    alert("Račun nije odobren ili je deaktiviran");
    window.location.href = "/login.html";
    return;
  }

  currentRole =
    userData.role || "organizer";

  if (
    currentRole !== "superadmin" &&
    currentRole !== "organizer"
  ) {
    alert("Ovaj račun ima samo moderatorski pristup za event i nema pristup pregledu eventova.");
    window.location.href = "/login.html";
    return;
  }

  setRoleBadge();

  if (currentRole !== "superadmin") {
    editor?.remove();
  }

  loadEvents();
});
document.getElementById("openAnalyticsBtn")?.addEventListener("click", () => {
  document.getElementById("analyticsModal")?.classList.remove("hidden");
});

document.getElementById("closeAnalyticsBtn")?.addEventListener("click", () => {
  document.getElementById("analyticsModal")?.classList.add("hidden");
});

document.getElementById("analyticsModal")?.addEventListener("click", (e) => {
  if (e.target.id === "analyticsModal") {
    document.getElementById("analyticsModal")?.classList.add("hidden");
  }
});

async function loadEvents() {

  eventsList.innerHTML =
    "<div class='loading'>Učitavanje eventova...</div>";

  let q;

  if (currentRole === "superadmin") {

    q = query(
      collection(db, "events"),
      orderBy("created", "desc")
    );

  } else {

    q = query(
      collection(db, "events"),
      where("ownerId", "==", currentUser.uid),
      orderBy("created", "desc")
    );
  }

  try {

    const snapshot =
      await getDocs(q);

    loadedEvents = [];

    snapshot.forEach((docSnap) => {

      loadedEvents.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    renderAnalytics();
    renderEvents();

  } catch (err) {

    console.error("Load events error:", err);

    eventsList.innerHTML =
      "<div class='loading error'>Greška kod učitavanja eventova.</div>";
  }
}

function renderAnalytics() {

  const totalEvents =
    loadedEvents.length;

  const activeEvents =
    loadedEvents.filter(isActiveEvent).length;

  const expiredEvents =
    loadedEvents.filter(event => !isActiveEvent(event)).length;

  const totalPhotos =
    sumEvents("photoCount");

  const totalLikes =
    sumEvents("likeCount");

  const totalDedications =
    sumEvents("dedicationCount");

  const totalLimit =
    loadedEvents.reduce(
      (sum, event) =>
        sum + Number(event.uploadLimit || 0),
      0
    );

  const usagePercent =
    totalLimit > 0
      ? Math.round((totalPhotos / totalLimit) * 100)
      : 0;

  setText("analyticsTotalEvents", totalEvents);
  setText("analyticsActiveEvents", activeEvents);
  setText("analyticsExpiredEvents", expiredEvents);
  setText("analyticsPhotos", formatNumber(totalPhotos));
  setText("analyticsLikes", formatNumber(totalLikes));
  setText("analyticsDedications", formatNumber(totalDedications));
  setText("analyticsUsage", usagePercent + "%");

  const usageBar =
    document.getElementById("analyticsUsageBar");

  if (usageBar) {
    usageBar.style.width =
      Math.min(usagePercent, 100) + "%";
  }

  setText(
    "analyticsTopOwner",
    getTopOwnerText()
  );

  setText(
    "eventsVisibleCount",
    totalEvents
  );
}

function sumEvents(field) {

  return loadedEvents.reduce(
    (sum, event) =>
      sum + Number(event[field] || 0),
    0
  );
}

function getTopOwnerText() {

  if (!loadedEvents.length) return "-";

  const map = new Map();

  loadedEvents.forEach((event) => {

    const key =
      event.ownerEmail ||
      event.ownerName ||
      "Nepoznato";

    const current =
      map.get(key) || {
        name: event.ownerName || key,
        email: event.ownerEmail || "",
        photos: 0,
        events: 0
      };

    current.photos += Number(event.photoCount || 0);
    current.events += 1;

    map.set(key, current);
  });

  const sorted =
    [...map.values()]
      .sort((a, b) => b.photos - a.photos);

  const top =
    sorted[0];

  if (!top) return "-";

  return `${top.name} · ${top.photos} slika · ${top.events} eventa`;
}

function renderEvents() {

  eventsList.innerHTML = "";

  if (!loadedEvents.length) {
    eventsList.innerHTML =
      "<div class='loading'>Nema eventova</div>";
    return;
  }

  const fragment =
    document.createDocumentFragment();

  loadedEvents.forEach((event) => {
    fragment.appendChild(
      createEventCard(event)
    );
  });

  eventsList.appendChild(fragment);
}

function createEventCard(event) {

  const card =
    document.createElement("div");

  card.className = "event-card analytics-event-card";

  if (!isActiveEvent(event)) {
    card.classList.add("event-card-expired");
  }

  const title =
    event.title || "Bez naziva";

  const plan =
    event.plan || "basic";

  const photoCount =
    Number(event.photoCount || 0);

  const likeCount =
    Number(event.likeCount || 0);

  const dedicationCount =
    Number(event.dedicationCount || 0);

  const uploadLimit =
    Number(event.uploadLimit || 0);

  const percent =
    uploadLimit > 0
      ? Math.round((photoCount / uploadLimit) * 100)
      : 0;

  const status =
    event.status || "active";

  const expires =
    formatDate(event.expiresAt);

  const daysLeft =
    getDaysLeft(event.expiresAt);

  card.innerHTML = `
    <div class="owner">
      👤 ${escapeHTML(event.ownerName || "Nepoznato")}
      ${event.ownerEmail ? `<br><small>${escapeHTML(event.ownerEmail)}</small>` : ""}
    </div>

    <div class="event-top">
      <h3>${escapeHTML(title)}</h3>
      <span class="badge plan-${escapeHTML(plan)}">${escapeHTML(plan)}</span>
    </div>

    <div class="event-card-meta">
      <span class="${isActiveEvent(event) ? "event-status-ok" : "event-status-bad"}">
        ${escapeHTML(status)}
      </span>

      <span>
        Ističe: ${expires}
      </span>

      <span>
        ${daysLeft}
      </span>
    </div>

    <div class="event-stats-grid">
      <div>
        <span>📸</span>
        <b>${formatNumber(photoCount)}</b>
      </div>

      <div>
        <span>❤️</span>
        <b>${formatNumber(likeCount)}</b>
      </div>

      <div>
        <span>💌</span>
        <b>${formatNumber(dedicationCount)}</b>
      </div>
    </div>

    <div class="event-usage-mini">
      <div>
        <span>${formatNumber(photoCount)} / ${formatNumber(uploadLimit)}</span>
        <b>${percent}%</b>
      </div>

      <div class="usage-bar">
        <div style="width:${Math.min(percent, 100)}%"></div>
      </div>
    </div>
  `;

  if (currentRole === "superadmin") {
    card.onclick = () =>
      openEditor(event.id);
  } else {
    card.style.cursor = "default";
  }

  return card;
}

async function openEditor(eventId) {

  clearMaintenanceStatus();

  currentEventId = eventId;

  const snap =
    await getDoc(
      doc(db, "events", eventId)
    );

  if (!snap.exists()) {
    alert("Event ne postoji");
    return;
  }

  currentEventData = {
    id: snap.id,
    ...snap.data()
  };

  const data =
    currentEventData;

document
  .getElementById("editorModal")
  ?.classList.remove("hidden");

editor.classList.remove("hidden");

  const subtitle =
    document.getElementById("editorSubtitle");

  if (subtitle) {
    subtitle.innerText =
      `${data.ownerName || "Nepoznato"} · ${data.ownerEmail || ""}`;
  }

  const isSuperAdmin =
    currentRole === "superadmin";

  setValue("edit_title", data.title);
  setValue("edit_type", data.type);
  setValue("edit_plan", data.plan);
  setValue("edit_status", data.status);

  setValue("edit_limit", data.uploadLimit || 0);

  const expiresDisplay =
    document.getElementById("edit_expires_display");

  if (expiresDisplay) {
    expiresDisplay.value =
      formatDate(data.expiresAt);
  }

  setDisabled("edit_plan", !isSuperAdmin);
  setDisabled("edit_limit", !isSuperAdmin);
  setDisabled("edit_originals", !isSuperAdmin);

  const originals =
    document.getElementById("edit_originals");

  if (originals) {
    originals.checked =
      data.allowOriginals || false;
  }

  setText("stat_photos", formatNumber(data.photoCount || 0));
  setText("stat_likes", formatNumber(data.likeCount || 0));
  setText("stat_dedications", formatNumber(data.dedicationCount || 0));

  renderEventUsage(data);

  const base = location.origin;

  setLink(
    "guest_link",
    `${base}/index.html?event=${eventId}`
  );

  setLink(
    "app_link",
    `${base}/app.html?event=${eventId}`
  );

  setLink(
    "admin_link",
    `${base}/admin.html?event=${eventId}`
  );

  setValue(
    "edit_index_title",
    data.texts?.index?.title || ""
  );

  setValue(
    "edit_index_subtitle",
    data.texts?.index?.subtitle || ""
  );

  setValue(
    "edit_upload_title",
    data.texts?.upload?.title || ""
  );

  setValue(
    "edit_upload_subtitle",
    data.texts?.upload?.subtitle || ""
  );

  setValue(
    "edit_profile_title",
    data.texts?.profile?.title || ""
  );

  setValue(
    "edit_profile_subtitle",
    data.texts?.profile?.subtitle || ""
  );
}

function renderEventUsage(data) {

  const photoCount =
    Number(data.photoCount || 0);

  const uploadLimit =
    Number(data.uploadLimit || 0);

  const percent =
    uploadLimit > 0
      ? Math.round((photoCount / uploadLimit) * 100)
      : 0;

  setText(
    "eventUsageText",
    `${photoCount} / ${uploadLimit} · ${percent}%`
  );

  const bar =
    document.getElementById("eventUsageBar");

  if (bar) {
    bar.style.width =
      Math.min(percent, 100) + "%";
  }
}

document.getElementById("saveBtn").onclick = async () => {

  if (!currentEventId) return;

  const isSuperAdmin =
    currentRole === "superadmin";

  const payload = {

    title: sanitizeSingleLine(getValue("edit_title"), 120),
    type: sanitizeSingleLine(getValue("edit_type"), 30),
    status: sanitizeSingleLine(getValue("edit_status"), 30),

    texts: {
      index: {
        title: sanitizeSingleLine(getValue("edit_index_title"), 120),
        subtitle: sanitizeLongText(getValue("edit_index_subtitle"), 1000)
      },

      upload: {
        title: sanitizeSingleLine(getValue("edit_upload_title"), 120),
        subtitle: sanitizeLongText(getValue("edit_upload_subtitle"), 500)
      },

      profile: {
        title: sanitizeSingleLine(getValue("edit_profile_title"), 120),
        subtitle: sanitizeLongText(getValue("edit_profile_subtitle"), 500)
      }
    }
  };

  if (isSuperAdmin) {

    payload.plan =
      getValue("edit_plan");

    payload.uploadLimit =
      Number(getValue("edit_limit")) || 0;

    payload.allowOriginals =
      document.getElementById("edit_originals")?.checked || false;

    payload.active =
      payload.status === "active";
  }

  try {

    await updateDoc(
      doc(db, "events", currentEventId),
      payload
    );

    alert("Spremljeno ✅");

    await loadEvents();

    await openEditor(currentEventId);

  } catch (err) {

    console.error("Save event error:", err);
    alert("Greška kod spremanja eventa.");
  }
};

function closeEditorModal() {
  document
    .getElementById("editorModal")
    ?.classList.add("hidden");

  editor.classList.add("hidden");

  currentEventId = null;
  currentEventData = null;
}

document
  .getElementById("closeEditorBtn")
  ?.addEventListener("click", closeEditorModal);

document
  .getElementById("editorModal")
  ?.addEventListener("click", (e) => {
    if (e.target.id === "editorModal") {
      closeEditorModal();
    }
  });

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeEditorModal();
  }
});

document.getElementById("copyEventIdBtn")?.addEventListener("click", async () => {

  if (!currentEventId) return;

  await navigator.clipboard.writeText(currentEventId);
  alert("Event ID kopiran ✅");
});

document.getElementById("extendEventBtn")?.addEventListener("click", async () => {

  if (!currentEventId || currentRole !== "superadmin") return;

  const base =
    currentEventData?.expiresAt &&
    currentEventData.expiresAt > Date.now()
      ? currentEventData.expiresAt
      : Date.now();

  const newExpires =
    base + (1000 * 60 * 60 * 24 * 30);

  await updateDoc(
    doc(db, "events", currentEventId),
    {
      expiresAt: newExpires,
      status: "active",
      active: true
    }
  );

  alert("Event produžen 30 dana ✅");

  await loadEvents();
  await openEditor(currentEventId);
});

document.getElementById("expireEventBtn")?.addEventListener("click", async () => {

  if (!currentEventId || currentRole !== "superadmin") return;

  if (!confirm("Označiti event kao expired?")) return;

  await updateDoc(
    doc(db, "events", currentEventId),
    {
      status: "expired",
      active: false,
      expiredManuallyAt: Date.now()
    }
  );

  alert("Event označen kao expired ✅");

  await loadEvents();
  await openEditor(currentEventId);
});

document.getElementById("cleanedEventBtn")?.addEventListener("click", async () => {

  if (!currentEventId || currentRole !== "superadmin") return;

  if (!confirm("Označiti event kao očišćen? Ovo ne briše Storage automatski.")) return;

  await updateDoc(
    doc(db, "events", currentEventId),
    {
      storageCleaned: true,
      cleanedAt: Date.now()
    }
  );

  alert("Event označen kao očišćen ✅");

  await loadEvents();
  await openEditor(currentEventId);
});

function setMaintenanceStatus(message, type = "") {

  const el =
    document.getElementById("eventMaintenanceStatus");

  if (!el) return;

  el.classList.remove(
    "hidden",
    "success",
    "error",
    "warning"
  );

  if (type) {
    el.classList.add(type);
  }

  el.innerText = message || "";
}

function clearMaintenanceStatus() {
  const el =
    document.getElementById("eventMaintenanceStatus");

  if (!el) return;

  el.classList.add("hidden");
  el.classList.remove("success", "error", "warning");
  el.innerText = "";
}

function sanitizeSingleLine(value, maxLength = 120) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizeLongText(value, maxLength = 1000) {
  return String(value || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);
}

function safeDownloadName(value, fallback = "event") {
  return String(value || fallback)
    .toLowerCase()
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/[\/?%*:|"<>\\]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90) || fallback;
}

function normalizeForJson(value) {
  if (value == null) return value;

  if (
    typeof value === "object" &&
    typeof value.toDate === "function"
  ) {
    const date = value.toDate();
    return {
      _type: "Timestamp",
      iso: date.toISOString(),
      millis: date.getTime()
    };
  }

  if (Array.isArray(value)) {
    return value.map(normalizeForJson);
  }

  if (typeof value === "object") {
    const out = {};

    for (const [key, childValue] of Object.entries(value)) {
      out[key] = normalizeForJson(childValue);
    }

    return out;
  }

  return value;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

async function getDocsArray(colRef) {
  const snapshot = await getDocs(colRef);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    data: normalizeForJson(docSnap.data())
  }));
}

async function buildEventBackup(eventId) {
  const eventSnap = await getDoc(doc(db, "events", eventId));

  if (!eventSnap.exists()) {
    throw new Error("Event ne postoji.");
  }

  const photosSnap = await getDocs(
    collection(db, "events", eventId, "photos")
  );

  const photos = [];

  for (const photoSnap of photosSnap.docs) {
    const likes = await getDocsArray(
      collection(
        db,
        "events",
        eventId,
        "photos",
        photoSnap.id,
        "likes"
      )
    );

    photos.push({
      id: photoSnap.id,
      data: normalizeForJson(photoSnap.data()),
      likes
    });
  }

  const [dedications, moderators, eventUsers] = await Promise.all([
    getDocsArray(collection(db, "events", eventId, "dedications")),
    getDocsArray(collection(db, "events", eventId, "moderators")),
    getDocsArray(collection(db, "events", eventId, "users"))
  ]);

  return {
    meta: {
      exportedAt: new Date().toISOString(),
      exportedBy: currentUser?.email || currentUser?.uid || "unknown",
      eventId,
      schema: "photodump-event-backup-v1"
    },
    event: {
      id: eventSnap.id,
      data: normalizeForJson(eventSnap.data())
    },
    photos,
    dedications,
    moderators,
    eventUsers
  };
}

async function exportCurrentEventBackup() {
  if (!currentEventId || currentRole !== "superadmin") return;

  try {
    setMaintenanceStatus("Pripremam JSON backup eventa...");

    const backup = await buildEventBackup(currentEventId);
    const name = safeDownloadName(
      backup.event?.data?.title || currentEventId,
      currentEventId
    );

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: "application/json;charset=utf-8" }
    );

    downloadBlob(
      blob,
      `${name}-${currentEventId}-backup.json`
    );

    setMaintenanceStatus("JSON backup preuzet ✅", "success");

  } catch (err) {
    console.error("Backup export error:", err);
    setMaintenanceStatus("Greška kod backup exporta.", "error");
  }
}

function loadJSZip() {
  if (window.JSZip) {
    return Promise.resolve(window.JSZip);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
    script.async = true;
    script.onload = () => resolve(window.JSZip);
    script.onerror = () => reject(new Error("JSZip se nije učitao."));
    document.head.appendChild(script);
  });
}

function fileExtensionFromPath(path) {
  const match = String(path || "").match(/\.[a-z0-9]{2,6}(?=($|\?))/i);
  return match ? match[0].toLowerCase() : ".jpg";
}

async function addStoragePathToZip(zip, storagePath, zipPath) {
  if (!storagePath) return false;

  const blob = await getBlob(ref(storage, storagePath));
  zip.file(zipPath, blob);

  return true;
}

async function exportCurrentEventMediaZip() {
  if (!currentEventId || currentRole !== "superadmin") return;

  if (!confirm("Export ZIP može trajati dulje i zauzeti dosta memorije ako event ima puno fotografija. Nastaviti?")) {
    return;
  }

  try {
    setMaintenanceStatus("Učitavam backup i JSZip...");

    const [JSZip, backup] = await Promise.all([
      loadJSZip(),
      buildEventBackup(currentEventId)
    ]);

    const zip = new JSZip();
    const name = safeDownloadName(
      backup.event?.data?.title || currentEventId,
      currentEventId
    );

    zip.file(
      "event-backup.json",
      JSON.stringify(backup, null, 2)
    );

    const manifest = [];

    for (let i = 0; i < backup.photos.length; i++) {
      const photo = backup.photos[i];
      const data = photo.data || {};
      const base = String(i + 1).padStart(4, "0") + "_" + photo.id;

      setMaintenanceStatus(
        `Dodajem fotografije u ZIP... ${i + 1}/${backup.photos.length}`
      );

      manifest.push({
        id: photo.id,
        path: data.path || "",
        thumbPath: data.thumbPath || "",
        originalPath: data.originalPath || "",
        user: data.user || "",
        created: data.created || ""
      });

      try {
        await addStoragePathToZip(
          zip,
          data.path,
          `photos/${base}${fileExtensionFromPath(data.path)}`
        );
      } catch (err) {
        console.warn("Photo ZIP skip:", data.path, err);
      }

      try {
        await addStoragePathToZip(
          zip,
          data.thumbPath,
          `thumbs/${base}${fileExtensionFromPath(data.thumbPath)}`
        );
      } catch (err) {
        console.warn("Thumb ZIP skip:", data.thumbPath, err);
      }

      if (data.originalPath) {
        try {
          await addStoragePathToZip(
            zip,
            data.originalPath,
            `originals/${base}${fileExtensionFromPath(data.originalPath)}`
          );
        } catch (err) {
          console.warn("Original ZIP skip:", data.originalPath, err);
        }
      }
    }

    zip.file(
      "media-manifest.json",
      JSON.stringify(manifest, null, 2)
    );

    setMaintenanceStatus("Pakiram ZIP... Ovo može potrajati.");

    const blob = await zip.generateAsync({ type: "blob" });

    downloadBlob(
      blob,
      `${name}-${currentEventId}-media.zip`
    );

    setMaintenanceStatus("ZIP export preuzet ✅", "success");

  } catch (err) {
    console.error("Media ZIP export error:", err);
    setMaintenanceStatus("Greška kod ZIP exporta. Probaj JSON backup ili manji event.", "error");
  }
}

async function commitAndResetBatch(batchState) {
  if (!batchState.count) return;

  await batchState.batch.commit();
  batchState.batch = writeBatch(db);
  batchState.count = 0;
}

function queueDelete(batchState, refToDelete) {
  batchState.batch.delete(refToDelete);
  batchState.count += 1;
}

async function deleteCollectionWithBatch(colRef, label, batchState) {
  const snapshot = await getDocs(colRef);
  let deleted = 0;

  for (const docSnap of snapshot.docs) {
    queueDelete(batchState, docSnap.ref);
    deleted += 1;

    if (batchState.count >= 450) {
      setMaintenanceStatus(`Brišem Firestore: ${label}...`);
      await commitAndResetBatch(batchState);
    }
  }

  return deleted;
}

async function deleteEventFirestoreData(eventId) {
  const batchState = {
    batch: writeBatch(db),
    count: 0
  };

  const photosSnap = await getDocs(
    collection(db, "events", eventId, "photos")
  );

  let photoCount = 0;
  let likeCount = 0;

  for (const photoSnap of photosSnap.docs) {
    likeCount += await deleteCollectionWithBatch(
      collection(db, "events", eventId, "photos", photoSnap.id, "likes"),
      "likes",
      batchState
    );

    queueDelete(batchState, photoSnap.ref);
    photoCount += 1;

    if (batchState.count >= 450) {
      setMaintenanceStatus(`Brišem Firestore fotografije... ${photoCount}`);
      await commitAndResetBatch(batchState);
    }
  }

  const dedicationCount = await deleteCollectionWithBatch(
    collection(db, "events", eventId, "dedications"),
    "dedications",
    batchState
  );

  const moderatorCount = await deleteCollectionWithBatch(
    collection(db, "events", eventId, "moderators"),
    "moderators",
    batchState
  );

  const eventUserCount = await deleteCollectionWithBatch(
    collection(db, "events", eventId, "users"),
    "event users",
    batchState
  );

  queueDelete(batchState, doc(db, "events", eventId));
  await commitAndResetBatch(batchState);

  return {
    photos: photoCount,
    likes: likeCount,
    dedications: dedicationCount,
    moderators: moderatorCount,
    eventUsers: eventUserCount
  };
}

async function deleteStorageFolder(folderPath) {
  let pageToken = undefined;
  let deleted = 0;

  do {
    const result = await list(
      ref(storage, folderPath),
      {
        maxResults: 1000,
        pageToken
      }
    );

    for (const item of result.items) {
      try {
        await deleteObject(item);
        deleted += 1;
      } catch (err) {
        if (err?.code !== "storage/object-not-found") {
          throw err;
        }
      }
    }

    for (const prefix of result.prefixes) {
      deleted += await deleteStorageFolder(prefix.fullPath);
    }

    pageToken = result.nextPageToken;
  } while (pageToken);

  return deleted;
}

async function deleteCurrentEventCompletely() {
  if (!currentEventId || currentRole !== "superadmin") return;

  const eventTitle = currentEventData?.title || currentEventId;

  if (!confirm(`Trajno obrisati cijeli event "${eventTitle}"? Ovo briše Firestore podatke i Storage slike.`)) {
    return;
  }

  const expected = `DELETE ${currentEventId}`;
  const typed = prompt(
    `Za potvrdu upiši točno:\n${expected}`
  );

  if (typed !== expected) {
    setMaintenanceStatus("Brisanje otkazano — potvrda nije bila točna.", "warning");
    return;
  }

  try {
    setMaintenanceStatus("Prije brisanja pripremam JSON backup...");
    const backup = await buildEventBackup(currentEventId);
    const backupName = safeDownloadName(
      backup.event?.data?.title || currentEventId,
      currentEventId
    );

    downloadBlob(
      new Blob(
        [JSON.stringify(backup, null, 2)],
        { type: "application/json;charset=utf-8" }
      ),
      `${backupName}-${currentEventId}-backup-before-delete.json`
    );

    setMaintenanceStatus("Brišem Storage datoteke...");

    let storageDeleted = 0;

    for (const folder of [
      "bubbles",
      "photos",
      "thumbs",
      "originals"
    ]) {
      setMaintenanceStatus(`Brišem Storage folder: ${folder}...`);
      storageDeleted += await deleteStorageFolder(
        `events/${currentEventId}/${folder}`
      );
    }

    setMaintenanceStatus("Brišem Firestore podatke...");
    const firestoreDeleted = await deleteEventFirestoreData(currentEventId);

    setMaintenanceStatus(
      `Event trajno obrisan ✅\nStorage datoteka: ${storageDeleted}\nFotografija: ${firestoreDeleted.photos}\nLajkova: ${firestoreDeleted.likes}\nPosveta: ${firestoreDeleted.dedications}`,
      "success"
    );

    closeEditorModal();
    await loadEvents();

  } catch (err) {
    console.error("Full event delete error:", err);
    setMaintenanceStatus(
      "Greška kod brisanja eventa. Event možda nije potpuno obrisan — provjeri konzolu/Firebase prije ponovnog pokušaja.",
      "error"
    );
  }
}

document
  .getElementById("backupEventBtn")
  ?.addEventListener("click", exportCurrentEventBackup);

document
  .getElementById("exportMediaZipBtn")
  ?.addEventListener("click", exportCurrentEventMediaZip);

document
  .getElementById("deleteFullEventBtn")
  ?.addEventListener("click", deleteCurrentEventCompletely);


function setRoleBadge() {

  const badge =
    document.getElementById("roleBadge");

  if (!badge) return;

  badge.innerText =
    currentRole === "superadmin"
      ? "SUPERADMIN"
      : "ORGANIZER";

  badge.classList.toggle(
    "role-superadmin",
    currentRole === "superadmin"
  );

  badge.classList.toggle(
    "role-organizer",
    currentRole !== "superadmin"
  );
}

function isActiveEvent(event) {

  return event.active !== false
    && (event.status || "active") === "active"
    && (
      !event.expiresAt ||
      event.expiresAt > Date.now()
    );
}

function getDaysLeft(expiresAt) {

  if (!expiresAt) return "Bez isteka";

  const diff =
    expiresAt - Date.now();

  if (diff <= 0) return "Istekao";

  const days =
    Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days === 1) return "Još 1 dan";

  return `Još ${days} dana`;
}

function formatDate(value) {

  if (!value) return "-";

  let date;

  if (
    typeof value === "object" &&
    typeof value.toDate === "function"
  ) {
    date = value.toDate();
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("hr-HR");
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("hr-HR");
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

function getValue(id) {
  return document.getElementById(id)?.value || "";
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

function setDisabled(id, value) {
  const el = document.getElementById(id);
  if (el) el.disabled = value;
}

function setLink(id, url) {
  const el = document.getElementById(id);

  if (!el) return;

  el.href = url;
  el.innerText = url;
}

function escapeHTML(value) {

  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}