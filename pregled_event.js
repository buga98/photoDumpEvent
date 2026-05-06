// pregled_event.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

/* ================= FIREBASE ================= */
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

/* ================= STATE ================= */
let currentEventId = null;

/* ================= ELEMENTS ================= */
const eventsList = document.getElementById("eventsList");
const editor = document.getElementById("editor");

/* ================= LOAD EVENTS ================= */
async function loadEvents() {

  eventsList.innerHTML = "Učitavanje...";

  const q = query(
    collection(db, "events"),
    orderBy("created", "desc")
  );

  const snapshot = await getDocs(q);

  eventsList.innerHTML = "";

  if (snapshot.empty) {
    eventsList.innerHTML = "Nema eventova";
    return;
  }

  snapshot.forEach((docSnap) => {

    const data = docSnap.data();

    const card = document.createElement("div");
    card.className = "event-card";

    card.innerHTML = `
      <div class="event-top">
        <h3>${data.title || "Bez naziva"}</h3>
        <span class="badge">${data.plan || "basic"}</span>
      </div>

      <div class="event-stats">
        📸 ${data.photoCount || 0}
        ❤️ ${data.likeCount || 0}
        💌 ${data.dedicationCount || 0}
      </div>

      <div class="event-status">
        ${data.status || "active"}
      </div>
    `;

    card.onclick = () => openEditor(docSnap.id);

    eventsList.appendChild(card);
  });
}

/* ================= OPEN EDITOR ================= */
async function openEditor(eventId) {

  currentEventId = eventId;

  const snap = await getDoc(doc(db, "events", eventId));

  if (!snap.exists()) {
    alert("Event ne postoji");
    return;
  }

  const data = snap.data();

  editor.classList.remove("hidden");

  /* INFO */
  setValue("edit_title", data.title);
  setValue("edit_type", data.type);
  setValue("edit_plan", data.plan);
  setValue("edit_status", data.status);

  setValue("edit_limit", data.uploadLimit || 0);

  document.getElementById("edit_originals").checked =
    data.allowOriginals || false;

  /* COUNTERS */
  setText("stat_photos", data.photoCount || 0);
  setText("stat_likes", data.likeCount || 0);
  setText("stat_dedications", data.dedicationCount || 0);

  /* LINKS */
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

  /* TEXTS */
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

  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
}

/* ================= SAVE ================= */
document.getElementById("saveBtn").onclick = async () => {

  if (!currentEventId) return;

  const payload = {

    title: getValue("edit_title"),
    type: getValue("edit_type"),
    plan: getValue("edit_plan"),
    status: getValue("edit_status"),

    uploadLimit: Number(getValue("edit_limit")) || 0,

    allowOriginals:
      document.getElementById("edit_originals").checked,

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

  await updateDoc(
    doc(db, "events", currentEventId),
    payload
  );

  alert("Spremljeno ✅");

  loadEvents();
};

/* ================= HELPERS ================= */
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

function setLink(id, url) {
  const el = document.getElementById(id);

  if (!el) return;

  el.href = url;
  el.innerText = url;
}

/* ================= INIT ================= */
loadEvents();