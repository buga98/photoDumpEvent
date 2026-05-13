import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
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

const formLogo =
  document.getElementById("formLogo");

const formTitle =
  document.getElementById("formTitle");

const formSubtitle =
  document.getElementById("formSubtitle");

const loginForm =
  document.getElementById("loginForm");

const registerForm =
  document.getElementById("registerForm");

const loginEmailEl =
  document.getElementById("loginEmail");

const loginPasswordEl =
  document.getElementById("loginPassword");

const registerEmailEl =
  document.getElementById("registerEmail");

const registerPasswordEl =
  document.getElementById("registerPassword");

const firstNameEl =
  document.getElementById("firstName");

const lastNameEl =
  document.getElementById("lastName");

const errorText =
  document.getElementById("errorText");

const loginBtn =
  document.getElementById("loginBtn");

const registerBtn =
  document.getElementById("registerBtn");

const showRegisterBtn =
  document.getElementById("showRegisterBtn");

const showLoginBtn =
  document.getElementById("showLoginBtn");

showRegisterBtn.onclick = () => {
  showRegister();
};

showLoginBtn.onclick = () => {
  showLogin();
};

loginBtn.onclick = login;
registerBtn.onclick = register;

function showRegister() {
  clearMessage();

  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");

  formLogo.innerText = "✨";
  formTitle.innerText = "Registracija";
  formSubtitle.innerText =
    "Kreiraj račun organizatora. Pristup mora odobriti administrator.";
}

function showLogin() {
  clearMessage();

  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");

  formLogo.innerText = "🔒";
  formTitle.innerText = "PhotoDump Admin";
  formSubtitle.innerText =
    "Prijava za organizatore i administratore";
}

function setLoading(button, loading, text) {
  if (!button) return;

  button.disabled = loading;
  button.innerText = loading
    ? "Molim pričekaj..."
    : text;
}

function showError(message) {
  errorText.style.color = "#ff7b7b";
  errorText.innerText = message;
}

function showSuccess(message) {
  errorText.style.color = "#7dffae";
  errorText.innerText = message;
}

function clearMessage() {
  errorText.innerText = "";
  errorText.style.color = "#ff7b7b";
}

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function validatePassword(password) {
  return String(password || "").length >= 6;
}

function getFirebaseErrorMessage(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Email adresa nije ispravna.";

    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Pogrešan email ili lozinka.";

    case "auth/email-already-in-use":
      return "Račun s ovim emailom već postoji.";

    case "auth/weak-password":
      return "Lozinka mora imati minimalno 6 znakova.";

    case "auth/too-many-requests":
      return "Previše pokušaja. Probaj ponovno kasnije.";

    case "auth/network-request-failed":
      return "Problem s internet vezom.";

    default:
      return "Dogodila se greška. Pokušaj ponovno.";
  }
}

async function login() {
  clearMessage();

  const email =
    normalizeEmail(loginEmailEl.value);

  const password =
    loginPasswordEl.value.trim();

  if (!email || !password) {
    showError("Unesi email i lozinku.");
    return;
  }

  if (!validatePassword(password)) {
    showError("Lozinka mora imati minimalno 6 znakova.");
    return;
  }

  setLoading(loginBtn, true, "Prijavi se 🚀");

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
      await signOut(auth);
      showError("Korisnički profil nije pronađen.");
      return;
    }

    const userData =
      userSnap.data();

    if (userData.disabled === true) {
      await signOut(auth);
      showError("Račun je deaktiviran. Obrati se administratoru.");
      return;
    }

    if (userData.approved !== true) {
      await signOut(auth);
      showError("Račun čeka odobrenje administratora.");
      return;
    }

    localStorage.setItem("role", userData.role || "organizer");
    localStorage.setItem("uid", uid);
    localStorage.setItem("userName", userData.name || "");

    window.location.href =
      "/main-admin.html";

  } catch (err) {
    console.error(err);
    showError(getFirebaseErrorMessage(err.code));
  } finally {
    setLoading(loginBtn, false, "Prijavi se 🚀");
  }
}

async function register() {
  clearMessage();

  const firstName =
    firstNameEl.value.trim();

  const lastName =
    lastNameEl.value.trim();

  const email =
    normalizeEmail(registerEmailEl.value);

  const password =
    registerPasswordEl.value.trim();

  if (!firstName || !lastName) {
    showError("Unesi ime i prezime.");
    return;
  }

  if (!email || !password) {
    showError("Unesi email i lozinku.");
    return;
  }

  if (!validatePassword(password)) {
    showError("Lozinka mora imati minimalno 6 znakova.");
    return;
  }

  setLoading(registerBtn, true, "Kreiraj račun ✨");

  try {
    const cred =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const uid =
      cred.user.uid;

    const fullName =
      `${firstName} ${lastName}`.trim();

    await setDoc(
      doc(db, "users", uid),
      {
        firstName,
        lastName,
        name: fullName,
        email,

        role: "organizer",

        approved: false,
        disabled: false,

        created: Date.now()
      }
    );

    await signOut(auth);

    firstNameEl.value = "";
    lastNameEl.value = "";
    registerEmailEl.value = "";
    registerPasswordEl.value = "";

    showLogin();

    showSuccess(
      "Račun je kreiran i čeka odobrenje administratora."
    );

  } catch (err) {
    console.error(err);
    showError(getFirebaseErrorMessage(err.code));
  } finally {
    setLoading(registerBtn, false, "Kreiraj račun ✨");
  }
}

loginPasswordEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    login();
  }
});

registerPasswordEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    register();
  }
});

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  try {
    const snap =
      await getDoc(
        doc(db, "users", user.uid)
      );

    if (!snap.exists()) {
      await signOut(auth);
      return;
    }

    const data =
      snap.data();

    if (
      data.approved === true &&
      data.disabled !== true
    ) {
      window.location.href =
        "/main-admin.html";
    }

  } catch (err) {
    console.error("Auto login error:", err);
  }
});