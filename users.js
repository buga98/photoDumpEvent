import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  query,
  orderBy,
  where
}
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

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

const usersList =
  document.getElementById("usersList");

const userSearch =
  document.getElementById("userSearch");

const filterButtons =
  document.querySelectorAll(".filter-btn");

let allUsers = [];
let allEvents = [];
let currentFilter = "all";
let searchValue = "";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    location.href = "/login.html";
    return;
  }

  try {

    const snap =
      await getDoc(
        doc(db, "users", user.uid)
      );

    if (!snap.exists()) {
      location.href = "/login.html";
      return;
    }

    const me =
      snap.data();

    if (
      me.role !== "superadmin" ||
      me.approved !== true ||
      me.disabled === true
    ) {
      alert("Nemaš pristup");
      location.href = "/main-admin.html";
      return;
    }

    await loadUsersAndEvents();

  } catch (err) {

    console.error("Auth check error:", err);

    alert("Greška kod provjere pristupa");
    location.href = "/main-admin.html";
  }
});

async function loadUsersAndEvents() {

  usersList.innerHTML =
    "<div class='loading'>Učitavanje korisnika...</div>";

  try {

    const usersSnap =
      await getDocs(
        query(
          collection(db, "users"),
          orderBy("created", "desc")
        )
      );

    allUsers = [];

    usersSnap.forEach((userSnap) => {

      allUsers.push({
        id: userSnap.id,
        ...userSnap.data()
      });
    });

  } catch (err) {

    console.warn(
      "Users orderBy created failed, fallback without orderBy:",
      err
    );

    const usersSnap =
      await getDocs(
        collection(db, "users")
      );

    allUsers = [];

    usersSnap.forEach((userSnap) => {

      allUsers.push({
        id: userSnap.id,
        ...userSnap.data()
      });
    });
  }

  try {

    const eventsSnap =
      await getDocs(
        collection(db, "events")
      );

    allEvents = [];

    eventsSnap.forEach((eventSnap) => {

      allEvents.push({
        id: eventSnap.id,
        ...eventSnap.data()
      });
    });

  } catch (err) {

    console.error("Events load error:", err);
    allEvents = [];
  }

  renderUsers();
}

function renderUsers() {

  updateSummary();

  const filtered =
    allUsers.filter((user) => {

      const disabled =
        user.disabled === true;

      const approved =
        user.approved === true;

      if (
        currentFilter === "pending" &&
        (approved || disabled)
      ) {
        return false;
      }

      if (
        currentFilter === "approved" &&
        (!approved || disabled)
      ) {
        return false;
      }

      if (
        currentFilter === "disabled" &&
        !disabled
      ) {
        return false;
      }

      const text =
        [
          user.name,
          user.firstName,
          user.lastName,
          user.email,
          user.role
        ]
          .join(" ")
          .toLowerCase();

      if (
        searchValue &&
        !text.includes(searchValue.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

  usersList.innerHTML = "";

  if (!filtered.length) {

    usersList.innerHTML =
      "<div class='loading'>Nema korisnika za prikaz.</div>";

    return;
  }

  filtered.forEach((user) => {

    usersList.appendChild(
      createUserCard(user)
    );
  });
}

function createUserCard(user) {

  const card =
    document.createElement("div");

  card.className = "event-card user-card";

  if (user.disabled === true) {
    card.classList.add("user-disabled");
  }

  if (
    user.approved !== true &&
    user.disabled !== true
  ) {
    card.classList.add("user-pending");
  }

  const eventCount =
    allEvents.filter(
      event => event.ownerId === user.id
    ).length;

  const created =
    formatDate(user.created);

  const status =
    getUserStatus(user);

  const role =
    user.role || "organizer";

  card.innerHTML = `
    <div class="event-top user-card-top">

      <div>
        <h3>${escapeHTML(getDisplayName(user))}</h3>

        <div class="owner">
          ${escapeHTML(user.email || "Bez emaila")}
        </div>
      </div>

      <span class="badge role-${escapeHTML(role)}">
        ${escapeHTML(role)}
      </span>

    </div>

    <div class="user-meta">

      <div>
        <span>Status</span>
        <b class="${status.className}">
          ${status.label}
        </b>
      </div>

      <div>
        <span>Eventi</span>
        <b>${eventCount}</b>
      </div>

      <div>
        <span>Registriran</span>
        <b>${created}</b>
      </div>

    </div>

    <div class="user-actions">

      ${
        user.approved !== true &&
        user.disabled !== true
          ? `
            <button
              class="mini-btn primary"
              data-action="approve"
              data-id="${user.id}"
            >
              ✅ Odobri
            </button>
          `
          : ""
      }

      ${
        user.approved === true &&
        user.disabled !== true &&
        role !== "superadmin"
          ? `
            <button
              class="mini-btn danger"
              data-action="disable"
              data-id="${user.id}"
            >
              🚫 Deaktiviraj
            </button>
          `
          : ""
      }

      ${
        user.disabled === true
          ? `
            <button
              class="mini-btn primary"
              data-action="enable"
              data-id="${user.id}"
            >
              🔄 Aktiviraj
            </button>
          `
          : ""
      }

      ${
        role !== "superadmin" && user.disabled !== true
          ? `
            <button
              class="mini-btn ghost"
              data-action="make-superadmin"
              data-id="${user.id}"
            >
              👑 Superadmin
            </button>
          `
          : ""
      }

      ${
        role === "superadmin"
          ? `
            <button
              class="mini-btn ghost"
              data-action="make-organizer"
              data-id="${user.id}"
            >
              👤 Organizer
            </button>
          `
          : ""
      }

    </div>
  `;

  card
    .querySelectorAll("[data-action]")
    .forEach((btn) => {

      btn.addEventListener("click", () => {

        handleUserAction(
          btn.dataset.action,
          btn.dataset.id
        );
      });
    });

  return card;
}

async function handleUserAction(action, uid) {

  const user =
    allUsers.find(item => item.id === uid);

  if (!user) return;

  if (action === "approve") {

    await updateUser(uid, {
      approved: true,
      disabled: false
    });

    return;
  }

  if (action === "disable") {

    if (
      !confirm(
        `Deaktivirati korisnika ${user.email || ""}?`
      )
    ) {
      return;
    }

    await updateUser(uid, {
      disabled: true,
      approved: false
    });

    return;
  }

  if (action === "enable") {

    await updateUser(uid, {
      disabled: false,
      approved: true
    });

    return;
  }

  if (action === "make-superadmin") {

    if (
      !confirm(
        "Sigurno želiš ovom korisniku dati SUPERADMIN ovlasti?"
      )
    ) {
      return;
    }

    await updateUser(uid, {
      role: "superadmin",
      approved: true,
      disabled: false
    });

    return;
  }

  if (action === "make-organizer") {

    if (
      !confirm(
        "Prebaciti korisnika u organizer rolu?"
      )
    ) {
      return;
    }

    await updateUser(uid, {
      role: "organizer"
    });

    return;
  }
}

async function updateUser(uid, payload) {

  try {

    await updateDoc(
      doc(db, "users", uid),
      payload
    );

    await loadUsersAndEvents();

  } catch (err) {

    console.error("Update user error:", err);
    alert("Greška kod promjene korisnika.");
  }
}

filterButtons.forEach((btn) => {

  btn.addEventListener("click", () => {

    filterButtons.forEach((b) =>
      b.classList.remove("active")
    );

    btn.classList.add("active");

    currentFilter =
      btn.dataset.filter || "all";

    renderUsers();
  });
});

if (userSearch) {

  userSearch.addEventListener("input", () => {

    searchValue =
      userSearch.value.trim();

    renderUsers();
  });
}

function updateSummary() {

  const total =
    allUsers.length;

  const disabled =
    allUsers.filter(u => u.disabled === true).length;

  const approved =
    allUsers.filter(
      u => u.approved === true && u.disabled !== true
    ).length;

  const pending =
    allUsers.filter(
      u => u.approved !== true && u.disabled !== true
    ).length;

  setText("countAll", total);
  setText("countPending", pending);
  setText("countApproved", approved);
  setText("countDisabled", disabled);
}

function getUserStatus(user) {

  if (user.disabled === true) {
    return {
      label: "🚫 Deaktiviran",
      className: "status-disabled"
    };
  }

  if (user.approved === true) {
    return {
      label: "✅ Odobren",
      className: "status-approved"
    };
  }

  return {
    label: "⏳ Čeka odobrenje",
    className: "status-pending"
  };
}

function getDisplayName(user) {

  const full =
    [
      user.firstName,
      user.lastName
    ]
      .filter(Boolean)
      .join(" ");

  return (
    full ||
    user.name ||
    user.email ||
    "Bez imena"
  );
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

function setText(id, value) {

  const el =
    document.getElementById(id);

  if (el) {
    el.innerText = value;
  }
}

function escapeHTML(value) {

  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}