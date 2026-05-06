import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjETOqGf9zNxWO7DB7QokoHu_duiqM8Jg",
  authDomain: "photodumpevent-4578c.firebaseapp.com",
  projectId: "photodumpevent-4578c",
  storageBucket: "photodumpevent-4578c.firebasestorage.app",
  messagingSenderId: "617407847422",
  appId: "1:617407847422:web:2c4a13242a0fa1ba50feaf"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const emailEl =
  document.getElementById("email");

const passwordEl =
  document.getElementById("password");

const errorText =
  document.getElementById("errorText");

document
  .getElementById("loginBtn")
  .onclick = login;

document
  .getElementById("registerBtn")
  .onclick = register;

// ==============================
// LOGIN
// ==============================

async function login() {

  errorText.innerText = "";

  const email =
    emailEl.value.trim();

  const password =
    passwordEl.value.trim();

  if (!email || !password) {

    errorText.innerText =
      "Unesi email i lozinku";

    return;
  }

  try {

    const cred =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    const uid =
      cred.user.uid;

    const userSnap =
      await getDoc(
        doc(db, "users", uid)
      );

    if (!userSnap.exists()) {

      errorText.innerText =
        "Korisnik nije pronađen";

      return;
    }

    const userData =
      userSnap.data();

    // 🔥 APPROVED CHECK
    if (!userData.approved) {

      errorText.innerText =
        "Račun čeka odobrenje administratora";

      return;
    }

    // 🔥 SAVE ROLE
    localStorage.setItem(
      "role",
      userData.role
    );

    localStorage.setItem(
      "uid",
      uid
    );

    localStorage.setItem(
      "userName",
      userData.name
    );

    // 🔥 REDIRECT
    window.location.href =
      "/main-admin.html";

  } catch (err) {

    console.error(err);

    errorText.innerText =
      "Pogrešan email ili lozinka";
  }
}

// ==============================
// REGISTER
// ==============================

async function register() {

  errorText.innerText = "";

  const email =
    emailEl.value.trim();

  const password =
    passwordEl.value.trim();

  if (!email || !password) {

    errorText.innerText =
      "Unesi email i lozinku";

    return;
  }

  try {

    const cred =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    // 🔥 USERS COLLECTION
    await setDoc(
      doc(db, "users", cred.user.uid),
      {

        email,

        name:
          email.split("@")[0],

        role: "organizer",

        approved: false,

        created: Date.now()
      }
    );

    errorText.style.color =
      "#7dffae";

    errorText.innerText =
      "Račun kreiran — čeka odobrenje administratora";

  } catch (err) {

    console.error(err);

    errorText.innerText =
      "Greška kod registracije";
  }
}

// ==============================
// AUTO LOGIN
// ==============================

onAuthStateChanged(auth, async (user) => {

  if (!user) return;

  const snap =
    await getDoc(
      doc(db, "users", user.uid)
    );

  if (!snap.exists()) return;

  const data =
    snap.data();

  if (!data.approved) return;

  window.location.href =
    "/main-admin.html";
});