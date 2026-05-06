import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc
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

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    location.href = "/login.html";
    return;
  }

  const snap =
    await getDoc(doc(db, "users", user.uid));

  if (!snap.exists()) {
    location.href = "/login.html";
    return;
  }

  const me = snap.data();

  if (me.role !== "superadmin") {
    alert("Nemaš pristup");
    location.href = "/main-admin.html";
    return;
  }

  loadUsers();
});

async function loadUsers() {

  usersList.innerHTML = "";

  const snapshot =
    await getDocs(collection(db, "users"));

  snapshot.forEach((userSnap) => {

    const data = userSnap.data();

    const card =
      document.createElement("div");

    card.className = "event-card";

    card.innerHTML = `
      <div class="owner">
        ${data.email}
      </div>

      <div class="event-top">
        <h3>${data.name || "Bez imena"}</h3>

        <span class="badge">
          ${data.role || "organizer"}
        </span>
      </div>

      <div class="event-status">
        ${data.approved ? "✅ Odobren" : "⏳ Čeka Odobrenje"}
      </div>

      ${
        !data.approved
        ? `
          <button
            class="save-btn"
            onclick="approveUser('${userSnap.id}')"
          >
            Odobri korisnika
          </button>
        `
        : ""
      }
    `;

    usersList.appendChild(card);
  });
}

window.approveUser = async function(uid){

  await updateDoc(
    doc(db, "users", uid),
    {
      approved: true
    }
  );

  alert("Korisnik odobren ✅");

  loadUsers();
}