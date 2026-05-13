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
let createdEventPayload = null;

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
typeInput.addEventListener("change", () => {

  fillAllDefaults();
  updatePreview();
});

titleInput.addEventListener("input", updatePreview);

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
function safeFileName(value) {
  return String(value || "event")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9čćžšđ-]/gi, "")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function getEventTypeLabel(type) {
  switch (type) {
    case "svadba":
      return "Vjenčanje";
    case "krstenje":
      return "Krštenje";
    case "rodendan":
      return "Rođendan";
    case "pricest":
      return "Prva pričest";
    case "party":
      return "Party";
    default:
      return "Event";
  }
}

function getPlanLabel(plan) {
  switch (plan) {
    case "basic":
      return "Basic";
    case "standard":
      return "Standard";
    case "premium":
      return "Premium";
    default:
      return "Plan";
  }
}

async function imageUrlToDataUrl(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("QR download failed");
  }

  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function ensureCreatedEvent() {
  if (!createdEventPayload) {
    alert("Prvo kreiraj event.");
    return false;
  }

  return true;
}
window.downloadClientPdf = async function () {
  if (!ensureCreatedEvent()) return;

  const { jsPDF } = window.jspdf;

  const event = createdEventPayload;
  const qrDataUrl = await imageUrlToDataUrl(event.qrUrl);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = 210;

  pdf.setFillColor(9, 16, 30);
  pdf.rect(0, 0, 210, 297, "F");

  pdf.setFillColor(18, 33, 55);
  pdf.roundedRect(14, 14, 182, 269, 8, 8, "F");

  pdf.setFillColor(110, 168, 254);
  pdf.roundedRect(22, 24, 166, 14, 4, 4, "F");

  pdf.setTextColor(5, 12, 22);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text("PhotoDump Event", pageWidth / 2, 33, {
    align: "center"
  });

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(27);

  const titleLines = pdf.splitTextToSize(event.title, 160);
  pdf.text(titleLines, pageWidth / 2, 58, {
    align: "center"
  });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(205, 215, 230);

  const description =
    "Dragi gosti, skenirajte QR kod i otvorite digitalnu galeriju eventa. " +
    "Dodajte svoje fotografije, lajkajte najljepše trenutke i ostavite posvetu. " +
    "Sve uspomene bit će spremljene na jednom mjestu.";

  const descLines = pdf.splitTextToSize(description, 158);
  pdf.text(descLines, pageWidth / 2, 82, {
    align: "center",
    lineHeightFactor: 1.45
  });

  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(57, 113, 96, 96, 8, 8, "F");
  pdf.addImage(qrDataUrl, "PNG", 65, 121, 80, 80);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);
  pdf.text("Link za goste:", pageWidth / 2, 226, {
    align: "center"
  });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(145, 197, 253);

  const linkLines = pdf.splitTextToSize(event.guestLink, 170);
  pdf.text(linkLines, pageWidth / 2, 235, {
    align: "center"
  });

  pdf.setFontSize(10);
  pdf.setTextColor(160, 174, 192);
  pdf.text(
    `Tip eventa: ${getEventTypeLabel(event.type)}  |  Paket: ${getPlanLabel(event.plan)}  |  Limit: ${event.uploadLimit} fotografija`,
    pageWidth / 2,
    258,
    { align: "center" }
  );

  pdf.setFontSize(9);
  pdf.setTextColor(120, 135, 155);
  pdf.text(
    "Bez instalacije aplikacije - dovoljno je otvoriti link ili skenirati QR kod.",
    pageWidth / 2,
    269,
    { align: "center" }
  );

  pdf.save(
    `${safeFileName(event.title)}-info-za-klijenta.pdf`
  );
};
window.downloadPrintPdf = async function () {
  if (!ensureCreatedEvent()) return;

  const { jsPDF } = window.jspdf;

  const event = createdEventPayload;
  const qrDataUrl = await imageUrlToDataUrl(event.qrUrl);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = 210;

  pdf.setFillColor(250, 247, 240);
  pdf.rect(0, 0, 210, 297, "F");

  pdf.setDrawColor(210, 180, 120);
  pdf.setLineWidth(1.2);
  pdf.roundedRect(14, 14, 182, 269, 8, 8, "S");

  pdf.setDrawColor(230, 210, 170);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(20, 20, 170, 257, 6, 6, "S");

  pdf.setTextColor(45, 45, 45);
  pdf.setFont("times", "bold");
  pdf.setFontSize(30);

  const titleLines = pdf.splitTextToSize(event.title, 160);
  pdf.text(titleLines, pageWidth / 2, 52, {
    align: "center"
  });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(13);
  pdf.setTextColor(90, 90, 90);
  pdf.text(
    "Podijelite svoje fotografije i uspomene",
    pageWidth / 2,
    78,
    { align: "center" }
  );

  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(43, 95, 124, 124, 10, 10, "F");

  pdf.setDrawColor(225, 205, 165);
  pdf.setLineWidth(0.6);
  pdf.roundedRect(43, 95, 124, 124, 10, 10, "S");

  pdf.addImage(qrDataUrl, "PNG", 54, 106, 102, 102);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(17);
  pdf.setTextColor(45, 45, 45);
  pdf.text(
    "Skeniraj QR kod",
    pageWidth / 2,
    238,
    { align: "center" }
  );

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(85, 85, 85);

  const text =
    "Otvori galeriju, upiši svoje ime i dodaj fotografije s eventa. " +
    "Bez instalacije aplikacije.";

  const textLines = pdf.splitTextToSize(text, 145);
  pdf.text(textLines, pageWidth / 2, 250, {
    align: "center",
    lineHeightFactor: 1.35
  });

  pdf.setFontSize(9);
  pdf.setTextColor(130, 130, 130);
  pdf.text(
    "PhotoDumpEventi.com",
    pageWidth / 2,
    274,
    { align: "center" }
  );

  pdf.save(
    `${safeFileName(event.title)}-qr-print.pdf`
  );
};
window.downloadQrPng = async function () {
  if (!ensureCreatedEvent()) return;

  const event = createdEventPayload;

  const response = await fetch(event.qrUrl);

  if (!response.ok) {
    alert("QR kod nije moguće preuzeti.");
    return;
  }

  const blob = await response.blob();

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeFileName(event.title)}-qr-kod.png`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
};
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
const qrUrl =
  "https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&data=" +
  encodeURIComponent(guestLink);

createdEventPayload = {
  eventId,
  title,
  type,
  plan,
  guestLink,
  appLink,
  adminLink,
  qrUrl,
  uploadLimit,
  allowOriginals
};
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

qrImage.src = qrUrl;

    qrBox.classList.add("show");
document
  .getElementById("pdfTools")
  ?.classList.add("show");
    createBtn.innerText = "Gotovo ✅";

  } catch (err) {

    console.error(err);

    alert("Greška kod kreiranja eventa");

    createBtn.disabled = false;
    createBtn.innerText = "Kreiraj event 🚀";
  }
};

fillAllDefaults();
updatePreview();