import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
}
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";
import {
  signOut
}
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
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

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/* ================= AUTH PROTECTION ================= */
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  try {

    const snap = await getDoc(
      doc(db, "users", user.uid)
    );

    if (!snap.exists()) {
      window.location.href = "/login.html";
      return;
    }

    const data = snap.data();
if (data.role !== "superadmin") {

  const adminActions =
    document.getElementById("superAdminActions");

  if (adminActions) {
    adminActions.classList.add("hidden-admin");
  }
}
    if (!data.approved) {
      alert("Račun još nije odobren");
      window.location.href = "/login.html";
      return;
    }

  } catch (err) {

    console.error(err);

    window.location.href = "/login.html";
  }
});

/* ================= ELEMENTS ================= */
const titleInput = document.getElementById("eventTitle");
const typeInput = document.getElementById("eventType");
const fileInput = document.getElementById("bubbleImages");
const fileLabel = document.getElementById("fileLabel");
const previewGrid = document.getElementById("previewGrid");
const createBtn = document.getElementById("createBtn");
const resultBox = document.getElementById("resultBox");
const qrBox = document.getElementById("qrBox");
const qrImage = document.getElementById("qrImage");
const planInput = document.getElementById("eventPlan");

/* ================= DEFAULT TEXTS ================= */
const defaults = {

  krstenje: {
    index_title: "Dobrodošli na poseban dan naše male zvijezde ✨",

    index_subtitle: `Dragi naši,

hvala što ste danas s nama na ovom posebnom i blagoslovljenom danu 🤍

Ovdje možete podijeliti svoje fotografije i uhvatiti najljepše trenutke kako bi ova uspomena zauvijek ostala s nama 📸

Hvala vam na ljubavi, dolasku i podršci 💫`,

    upload_title: "Podijeli trenutak 📸",
    upload_subtitle: "Dodaj fotografiju i ostavi uspomenu za cijeli život 🤍",

    profile_title: "Tvoje uspomene 🤍",
    profile_subtitle: "Ovdje su sve fotografije koje si podijelio ✨"
  },

  svadba: {
    index_title: "Dobrodošli na našu ljubavnu priču 💍",

    index_subtitle: `Dragi naši,

hvala što ste dio našeg najposebnijeg dana 🤍

Podijelite s nama trenutke koje ste uhvatili – svaki osmijeh, ples i emocija čine ovu priču još ljepšom 📸

Zajedno stvaramo uspomene koje traju zauvijek ✨`,

    upload_title: "Podijelite trenutak 📸",
    upload_subtitle: "Uhvatite ljubav, sreću i zabavu 💍",

    profile_title: "Vaše uspomene 🤍",
    profile_subtitle: "Sve fotografije koje ste podijelili na jednom mjestu"
  },

  rodendan: {
    index_title: "Dobrodošli na slavlje života 🎂",

    index_subtitle: `Hej ekipa! 🎉

vrijeme je za smijeh, zabavu i nezaboravne trenutke 🔥

Uhvati najbolje fotke i podijeli ih ovdje – napravimo zajedno galeriju punu energije i uspomena 📸

Ajmo ovo pretvoriti u nešto što ćemo dugo pamtiti 💜`,

    upload_title: "Podijeli trenutak 📸",
    upload_subtitle: "Dodaj najluđe i najbolje uspomene 🎉",

    profile_title: "Tvoje fotke 🎂",
    profile_subtitle: "Sve tvoje uspomene na jednom mjestu"
  },

  pricest: {
    index_title: "Dobrodošli na ovaj sveti i poseban dan ✝️",

    index_subtitle: `Dragi naši,

hvala što ste danas s nama u ovom važnom i duhovnom trenutku 🤍

Podijelite fotografije i uspomene kako bi ovaj dan ostao zauvijek zabilježen 📸

Neka nas prate mir, ljubav i blagoslov ✨`,

    upload_title: "Podijeli uspomene 📸",
    upload_subtitle: "Zabilježite ovaj sveti trenutak ✝️",

    profile_title: "Tvoje uspomene ✨",
    profile_subtitle: "Ovdje su tvoje fotografije s ovog dana"
  },

  party: {
    index_title: "Dobrodošli na party 🔥",

    index_subtitle: `Okej ekipa 😎

znate pravila — što se dogodi na partyju… završi ovdje 📸

Slikaj, snimi, podijeli i napravi kaos koji ćemo kasnije prepričavati 🎉

Ajmo napraviti uspomene koje ne blijede 💥`,

    upload_title: "Upload 🔥",
    upload_subtitle: "Šibaj slike, nema filtera 😎",

    profile_title: "Tvoje slike 🔥",
    profile_subtitle: "Sve tvoje party uspomene"
  },

  default: {
    index_title: "Dobrodošli u PhotoDump 📸",

    index_subtitle: `Drago nam je da si ovdje 👋

Ova aplikacija služi za jednostavno dijeljenje fotografija i uspomena s eventa u realnom vremenu 📸

👉 Uhvati trenutak  
👉 Podijeli ga s drugima  
👉 I sačuvaj uspomene zauvijek  

Sve fotografije koje podijelite odmah su vidljive svima ✨

Kreni i postani dio ove priče 🤍`,

    upload_title: "Podijeli trenutak 📸",
    upload_subtitle: "Dodaj fotografiju i ostavi uspomenu",

    profile_title: "Tvoje uspomene 🤍",
    profile_subtitle: "Sve tvoje fotografije na jednom mjestu"
  }
};

/* ================= HELPERS ================= */
function getInput(id) {
  return document.getElementById(id);
}

function getTextValue(id) {
  return getInput(id)?.value.trim() || "";
}

function setText(id, value) {
  const el = document.getElementById(id);

  if (el) {
    el.innerText = value;
  }
}

function setHTML(id, value) {
  const el = document.getElementById(id);

  if (el) {
    el.innerHTML = value;
  }
}

function formatText(text) {

  if (!text) return "";

  return text
    .split("\n")
    .map(line => line.trim())
    .map(line => line ? `<p>${line}</p>` : `<br>`)
    .join("");
}
window.logout = async function () {

  await signOut(auth);

  localStorage.clear();

  window.location.href =
    "/login.html";
};
function cleanTexts(obj) {

  const result = {};

  for (const section in obj) {

    result[section] = {};

    for (const key in obj[section]) {

      const value = obj[section][key];

      if (value && value.trim()) {
        result[section][key] = value.trim();
      }
    }

    if (!Object.keys(result[section]).length) {
      delete result[section];
    }
  }

  return result;
}

function getTextsFromInputs() {

  return cleanTexts({

    index: {
      title: getTextValue("text_index_title"),
      subtitle: getTextValue("text_index_subtitle")
    },

    upload: {
      title: getTextValue("text_upload_title"),
      subtitle: getTextValue("text_upload_subtitle")
    },

    profile: {
      title: getTextValue("text_profile_title"),
      subtitle: getTextValue("text_profile_subtitle")
    }
  });
}

/* ================= DEFAULT FILL ================= */
function fillAllDefaults() {

  [
    "index_title",
    "index_subtitle",
    "upload_title",
    "upload_subtitle",
    "profile_title",
    "profile_subtitle"
  ].forEach((field) => {

    const value =
      defaults[typeInput.value]?.[field];

    const input =
      getInput("text_" + field);

    if (input) {
      input.value = value || "";
    }
  });

  updatePreview();
}

/* ================= PREVIEW ================= */
function getPreviewTitleWithEmoji(title, type) {

  switch (type) {

    case "rodendan":
      return "🎂 " + title + " 🎂";

    case "svadba":
      return "💍 " + title + " 💍";

    case "krstenje":
      return "✨ " + title + " ✨";

    case "pricest":
      return "✝️ " + title + " ✝️";

    case "party":
      return "🎉 " + title + " 🎉";

    default:
      return "✨ " + title + " ✨";
  }
}

function updatePreview() {

  const title =
    titleInput.value.trim() || "Naziv eventa";

  const type =
    typeInput.value || "default";

  const d =
    defaults[type] || defaults.default;

  const indexTitle =
    getTextValue("text_index_title") || d.index_title;

  const indexText =
    getTextValue("text_index_subtitle") || d.index_subtitle;

  const uploadTitle =
    getTextValue("text_upload_title") || d.upload_title;

  const uploadText =
    getTextValue("text_upload_subtitle") || d.upload_subtitle;

  const profileTitle =
    getTextValue("text_profile_title") || d.profile_title;

  const profileText =
    getTextValue("text_profile_subtitle") || d.profile_subtitle;

  const phone =
    document.querySelector(".preview-phone");

  if (phone) {
    phone.className =
      "preview-phone theme-" + type;
  }

  const topbar =
    getPreviewTitleWithEmoji(title, type);

  setText("previewIndexTopbar", topbar);
  setText("previewAppTopbar", topbar);

  setText("previewIndexTitle", indexTitle);
  setHTML("previewIndexText", formatText(indexText));

  setText("previewUploadTitle", uploadTitle);
  setText("previewUploadText", uploadText);

  setText("previewProfileTitle", profileTitle);
  setText("previewProfileText", profileText);
}
window.switchPreview = function(screen) {

  document
    .getElementById("previewIndex")
    ?.classList.remove("active");

  document
    .getElementById("previewApp")
    ?.classList.remove("active");

  if (screen === "index") {

    document
      .getElementById("previewIndex")
      ?.classList.add("active");
  }

  if (screen === "app") {

    document
      .getElementById("previewApp")
      ?.classList.add("active");
  }
};
/* ================= LISTENERS ================= */
typeInput.addEventListener("change", () => {

  fillAllDefaults();
  updatePreview();
});

titleInput.addEventListener("input", updatePreview);

/* ================= FILE PREVIEW ================= */
fileInput.addEventListener("change", () => {

  const files = [...fileInput.files];

  previewGrid.innerHTML = "";

  if (!files.length) {

    fileLabel.innerText =
      "Dodaj 6 slika za bubble";

    return;
  }

  fileLabel.innerText =
    `Odabrano slika: ${files.length}/6`;

  files.slice(0, 6).forEach((file) => {

    const img =
      document.createElement("img");

    img.src =
      URL.createObjectURL(file);

    previewGrid.appendChild(img);
  });
});

/* ================= IMAGE RESIZE ================= */
async function resizeImage(file, maxWidth = 900, quality = 0.82) {

  return new Promise((resolve, reject) => {

    const reader = new FileReader();
    const img = new Image();

    reader.onerror = reject;
    img.onerror = reject;

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {

        height =
          Math.round(height * (maxWidth / width));

        width = maxWidth;
      }

      const canvas =
        document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx =
        canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {

        if (!blob) {
          reject(new Error("Resize fail"));
          return;
        }

        const resized =
          new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, "") + ".jpg",
            { type: "image/jpeg" }
          );

        resolve(resized);

      }, "image/jpeg", quality);
    };

    reader.readAsDataURL(file);
  });
}

/* ================= CREATE EVENT ================= */
window.createNewEvent = async function () {

  const title =
    titleInput.value.trim();

  const type =
    typeInput.value;

  const files =
    [...fileInput.files];

  if (!title) {
    alert("Upiši naslov eventa");
    return;
  }

  if (files.length !== 6) {
    alert("Dodaj točno 6 bubble slika");
    return;
  }

  const currentUser =
    auth.currentUser;

  if (!currentUser) {
    alert("Nisi prijavljen");
    return;
  }

  const userSnap =
    await getDoc(
      doc(db, "users", currentUser.uid)
    );

  const userData =
    userSnap.data();

  createBtn.disabled = true;
  createBtn.innerText = "Kreiram event...";

  try {

    const eventRef =
      doc(collection(db, "events"));

    const eventId =
      eventRef.id;

    const bubbleUrls = [];

    for (let i = 0; i < files.length; i++) {

      createBtn.innerText =
        `Upload ${i + 1}/6`;

      const resized =
        await resizeImage(files[i], 300, 0.6);

      const cleanName =
        files[i].name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9.-]/g, "");

      const fileRef =
        ref(
          storage,
          `events/${eventId}/bubbles/${Date.now()}_${i}_${cleanName}`
        );

      await uploadBytes(fileRef, resized);

      const url =
        await getDownloadURL(fileRef);

      bubbleUrls.push(url);
    }

    const plan =
      planInput.value || "basic";

    let allowOriginals = false;
    let uploadLimit = 1000;

    if (plan === "standard") {
      allowOriginals = true;
      uploadLimit = 1200;
    }

    if (plan === "premium") {
      allowOriginals = true;
      uploadLimit = 1500;
    }

    const expiresAt =
      Date.now() + (1000 * 60 * 60 * 24 * 30);

    await setDoc(eventRef, {

      title,
      type,
      plan,

      ownerId: currentUser.uid,
      ownerEmail: currentUser.email,
      ownerName: userData?.name || "",

      bubbles: bubbleUrls,

      texts: getTextsFromInputs(),

      active: true,
      status: "active",

      allowOriginals,
      uploadLimit,

      photoCount: 0,
      dedicationCount: 0,
      likeCount: 0,

      expiresAt,

      created: Date.now()
    });

const guestLink =
  `${location.origin}/?event=${eventId}`;

    const appLink =
      `${location.origin}/app.html?event=${eventId}`;

    const adminLink =
      `${location.origin}/admin.html?event=${eventId}`;

    resultBox.innerHTML = `
      <p><b>Event kreiran ✅</b></p>

      <br>

      <p><b>Guest link:</b></p>

      <a href="${guestLink}" target="_blank">
        ${guestLink}
      </a>

      <br><br>

      <p><b>App link:</b></p>

      <a href="${appLink}" target="_blank">
        ${appLink}
      </a>

      <br><br>

      <p><b>Admin link:</b></p>

      <a href="${adminLink}" target="_blank">
        ${adminLink}
      </a>
    `;

    resultBox.classList.add("show");

    qrImage.src =
      "https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=" +
      encodeURIComponent(guestLink);

    qrBox.classList.add("show");

    createBtn.innerText = "Gotovo ✅";

  } catch (err) {

    console.error(err);

    alert("Greška kod kreiranja eventa");

    createBtn.disabled = false;
    createBtn.innerText = "Kreiraj event 🚀";
  }
};

/* ================= INIT ================= */
fillAllDefaults();
updatePreview();