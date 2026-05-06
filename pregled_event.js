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
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
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
let currentUser = null;
let currentRole = null;

/* ================= ELEMENTS ================= */
const eventsList = document.getElementById("eventsList");
const editor = document.getElementById("editor");

/* ================= LOAD EVENTS ================= */
async function loadEvents() {

  eventsList.innerHTML = "Učitavanje...";

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
      <div class="owner">
  👤 ${data.ownerName || "Nepoznato"}
</div>
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
  const isSuperAdmin =
  currentRole === "superadmin";

  /* INFO */
  setValue("edit_title", data.title);
  setValue("edit_type", data.type);
  setValue("edit_plan", data.plan);
  setValue("edit_status", data.status);

  setValue("edit_limit", data.uploadLimit || 0);
document.getElementById("edit_plan").disabled =
  !isSuperAdmin;

document.getElementById("edit_limit").disabled =
  !isSuperAdmin;

document.getElementById("edit_originals").disabled =
  !isSuperAdmin;
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
const isSuperAdmin =
  currentRole === "superadmin";
  if (!currentEventId) return;

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
    document.getElementById("edit_originals").checked;
}

  await updateDoc(
    doc(db, "events", currentEventId),
    payload
  );

  alert("Spremljeno ✅");

 
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
//loadEvents();
const auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    window.location.href =
      "/login.html";

    return;
  }

  currentUser = user;

  const userSnap =
    await getDoc(
      doc(db, "users", user.uid)
    );

  if (!userSnap.exists()) {

    window.location.href =
      "/login.html";

    return;
  }

  const userData =
    userSnap.data();

  if (!userData.approved) {

    alert("Račun nije odobren");

    window.location.href =
      "/login.html";

    return;
  }

  currentRole =
    userData.role;
const badge =
  document.getElementById("roleBadge");

if (badge) {

  badge.innerText =
    currentRole === "superadmin"
      ? "SUPERADMIN"
      : "ORGANIZER";
}
  loadEvents();
});