import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

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

    title: getValue("edit_title"),
    type: getValue("edit_type"),
    status: getValue("edit_status"),

    texts: {
      index: {
        title: getValue("edit_index_title"),
        subtitle: getValue("edit_index_subtitle")
      },

      upload: {
        title: getValue("edit_upload_title"),
        subtitle: getValue("edit_upload_subtitle")
      },

      profile: {
        title: getValue("edit_profile_title"),
        subtitle: getValue("edit_profile_subtitle")
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