const tr = (text) => window.PDE_I18N?.tr(text) ?? text;

const t0 = performance.now();
function logTime(label) {
  const t = (performance.now() - t0).toFixed(1);
  console.log(`⏱️ ${label}: ${t}ms`);
}


function sanitizeSingleLine(value, maxLength = 80) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createGuestUserId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  if (window.crypto && typeof window.crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);

    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (byte) =>
      byte.toString(16).padStart(2, "0")
    );

    return (
      hex.slice(0, 4).join("") + "-" +
      hex.slice(4, 6).join("") + "-" +
      hex.slice(6, 8).join("") + "-" +
      hex.slice(8, 10).join("") + "-" +
      hex.slice(10, 16).join("")
    );
  }

  return "guest-" + Date.now().toString(36) + "-" +
    Math.random().toString(36).slice(2, 12);
}

const storedEventIdBeforeOpen = localStorage.getItem("eventId");

const eventIdFromUrl =
  new URLSearchParams(location.search).get("event");

const eventId =
  eventIdFromUrl ||
  storedEventIdBeforeOpen;

if (eventIdFromUrl) {
  localStorage.setItem("eventId", eventIdFromUrl);
}

// 🌍 GLOBAL STATE
let eventData = null;

const titleEl = document.getElementById("eventTitle");
const headingEl = document.getElementById("eventHeading");
const subtitleEl = document.getElementById("eventSubtitle");
const container = document.querySelector(".floating-container");

window.enterApp = function () {
  const nameInput = document.getElementById("name");
  const name = sanitizeSingleLine(
    nameInput ? nameInput.value : "",
    80
  );

  if (nameInput) {
    nameInput.value = name;
  }

  if (!name || name.length < 2) {
    alert("Upiši ime i prezime");
    return;
  }

  const activeEventId =
    new URLSearchParams(location.search).get("event") ||
    localStorage.getItem("eventId");

  if (!activeEventId) {
    alert("Event nije pronađen. Otvori aplikaciju putem QR koda.");
    return;
  }

  localStorage.setItem("eventId", activeEventId);
  localStorage.setItem("name", name);
  localStorage.setItem("name_" + activeEventId, name);

  let userId =
    localStorage.getItem("userId_" + activeEventId) ||
    (storedEventIdBeforeOpen === activeEventId
      ? localStorage.getItem("userId")
      : "");

  if (!userId) {
    userId = createGuestUserId();
  }

  localStorage.setItem("userId", userId);
  localStorage.setItem("userId_" + activeEventId, userId);

  window.location.href =
    "/app.html?event=" + encodeURIComponent(activeEventId);
};
function getSubtitle(type) {
  switch(type) {
    case "svadba": return tr("Dobrodošli na našu svadbu 💍");
    case "rodendan": return tr("Dobrodošli na rođendan 🎂");
    case "krstenje": return tr("Dobrodošli na krštenje ✨");
    case "pricest": return tr("Dobrodošli na pričest ✝️");
    case "party": return tr("Dobrodošli na party 🎉");
    default: return tr("Podijelite uspomene 📸");
  }
}

let bubblesRendered = false;

function renderBubbles(images) {
  if (bubblesRendered) return;
  if (!images || !images.length) return;

  bubblesRendered = true;
  container.innerHTML = "";

  images.forEach((src) => {
    const el = document.createElement("div");
    el.className = "bubble";

    const img = document.createElement("img");
    img.src = src;

    el.appendChild(img);
    container.appendChild(el);

    let x = Math.random() * (window.innerWidth - 90);
    let y = Math.random() * (window.innerHeight - 90);

    let dx = (Math.random() - 0.5) * 0.5;
    let dy = (Math.random() - 0.5) * 0.5;

    function move() {
      x += dx;
      y += dy;

      if (x <= 0 || x >= window.innerWidth - 90) dx *= -1;
      if (y <= 0 || y >= window.innerHeight - 90) dy *= -1;

      el.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(move);
    }

    move();
  });

  logTime("Bubbles render");
}
function formatText(text) {
  if (!text) return "";

  return text
    .split("\n")
    .map(line => line.trim())
    .map(line => line ? `<p>${escapeHTML(line)}</p>` : `<br>`)
    .join("");
}
function applyEvent(event) {
  if (!event) return;

  eventData = event;
const nameInput =
  document.getElementById("name");

const enterBtn =
  document.querySelector(".glass-card button");

if (nameInput) {
  nameInput.style.display = "";
  nameInput.disabled = false;
}

if (enterBtn) {
  enterBtn.style.display = "";
  enterBtn.disabled = false;
}
  document.body.classList.remove(
    "theme-svadba",
    "theme-rodendan",
    "theme-krstenje",
    "theme-pricest",
    "theme-party"
  );

  if (event.type) {
    document.body.classList.add("theme-" + event.type);
  }

const defaultTexts = {
  index_title: event.title || "PhotoDump",
  index_subtitle: getSubtitle(event.type || "default")
};

  const indexTitle =
    event.texts?.index?.title || defaultTexts.index_title;

  const indexSubtitle =
    event.texts?.index?.subtitle || defaultTexts.index_subtitle;

  titleEl.innerText = event.title || "PhotoDump";
  headingEl.innerText = indexTitle;

  subtitleEl.innerHTML = formatText(indexSubtitle);

  document.title = (event.title || "PhotoDump") + " | PhotoDump";

  if (event.bubbles && event.bubbles.length) {
    bubblesRendered = false;
    renderBubbles(event.bubbles);
  }

  console.log("✅ Event applied", event);
}
function renderNoEvent() {
  titleEl.innerText = "PhotoDump";
  headingEl.innerText = tr("Nema aktivnog eventa");
  subtitleEl.innerText =
    tr("Otvori aplikaciju putem QR koda ili linka eventa.");

  const nameInput =
    document.getElementById("name");

  const enterBtn =
    document.querySelector(".glass-card button");

  if (nameInput) {
    nameInput.style.display = "none";
  }

  if (enterBtn) {
    enterBtn.style.display = "none";
  }
}
function bootFromCache() {
  if (!eventId) return false;

  const cached = localStorage.getItem("eventData_" + eventId);
  if (!cached) return false;

  try {
    const event = JSON.parse(cached);
    applyEvent(event);

    console.log("⚡ Boot from cache");
    logTime("Cache render");

    return true;
  } catch {
    return false;
  }
}

function tryAutoLogin() {
  const savedName =
    localStorage.getItem("name_" + eventId) ||
    (storedEventIdBeforeOpen === eventId
      ? localStorage.getItem("name")
      : "");
  const savedUserId =
    localStorage.getItem("userId_" + eventId) ||
    (storedEventIdBeforeOpen === eventId
      ? localStorage.getItem("userId")
      : "");
  const savedEvent = localStorage.getItem("eventId");

  if (savedName && savedUserId && savedEvent === eventId) {
    console.log("🚀 Auto login");

    setTimeout(() => {
      window.location.href = "/app.html?event=" + eventId;
    }, 80);
  }
}

async function fetchEvent() {
  if (!eventId) return;

  logTime("Start Firebase");

  try {
    const { initializeApp, getApps, getApp } = await import("https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js");
    const { getFirestore, doc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js");

    const firebaseConfig = {
      apiKey: "AIzaSyBjETOqGf9zNxWO7DB7QokoHu_duiqM8Jg",
      authDomain: "photodumpevent-4578c.firebaseapp.com",
      projectId: "photodumpevent-4578c"
    };

    const app = getApps().length
      ? getApp()
      : initializeApp(firebaseConfig);

    const db = getFirestore(app);
    const snap = await getDoc(doc(db, "events", eventId));

if (!snap.exists()) {
  renderNoEvent();
  return;
}

    const event = snap.data();

    localStorage.setItem("eventData_" + eventId, JSON.stringify(event));

    if (!eventData) {
      applyEvent(event);
    }

    logTime("Firebase loaded");

  } catch (err) {
    console.log("Firebase error", err);
  }
}

function renderFallback() {
  titleEl.innerText = "PhotoDump";
  headingEl.innerText = tr("Učitavanje eventa...");
  subtitleEl.innerText =
    "Molimo pričekaj trenutak.";

  const nameInput =
    document.getElementById("name");

  const enterBtn =
    document.querySelector(".glass-card button");

  if (nameInput) {
    nameInput.style.display = "";
    nameInput.disabled = true;
  }

  if (enterBtn) {
    enterBtn.style.display = "";
    enterBtn.disabled = true;
  }
}

if (!eventId) {
  renderFallback();
} else {
  const booted = bootFromCache();

  if (!booted) {
    renderFallback();
  }

  tryAutoLogin();

  setTimeout(fetchEvent, 100);
}

document.addEventListener("pde:languagechange", () => { if (eventData) applyEvent(eventData); else if (!eventId) renderFallback(); });

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  logTime("Page loaded");
});
let clickCount = 0;
let clickTimer;

titleEl.addEventListener("click", () => {
  clickCount++;

  clearTimeout(clickTimer);

  clickTimer = setTimeout(() => {
    clickCount = 0;
  }, 800);

  if (clickCount >= 3) {
    openAdminModal();
    clickCount = 0;
  }
});
window.openAdminModal = function () {
  document.getElementById("adminModal").style.display = "flex";
};

window.closeAdminModal = function () {
  document.getElementById("adminModal").style.display = "none";
};

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

async function checkModeratorAccess(user, app, db) {
  if (!user?.uid || !eventId) return false;

  const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js");

  const [eventSnap, userSnap, moderatorSnap] = await Promise.all([
    getDoc(doc(db, "events", eventId)),
    getDoc(doc(db, "users", user.uid)),
    getDoc(doc(db, "events", eventId, "moderators", user.uid))
  ]);

  if (!eventSnap.exists() || !userSnap.exists()) return false;

  const eventInfo = eventSnap.data();
  const userInfo = userSnap.data();

  const approved =
    userInfo.approved === true && userInfo.disabled !== true;

  if (!approved) return false;

  return (
    userInfo.role === "superadmin" ||
    eventInfo.ownerId === user.uid ||
    (moderatorSnap.exists() && moderatorSnap.data().active === true)
  );
}

window.checkAdmin = async function () {
  const email = normalizeEmail(document.getElementById("adminEmail")?.value);
  const pass = String(document.getElementById("adminPass")?.value || "").trim();

  if (!email || !pass) {
    alert("Unesi moderator email i lozinku");
    return;
  }

  try {
    const { initializeApp, getApps, getApp } = await import("https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js");
    const { getAuth, signInWithEmailAndPassword, signOut } = await import("https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js");
    const { getFirestore } = await import("https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js");

    const firebaseConfig = {
      apiKey: "AIzaSyBjETOqGf9zNxWO7DB7QokoHu_duiqM8Jg",
      authDomain: "photodumpevent-4578c.firebaseapp.com",
      projectId: "photodumpevent-4578c"
    };

    const app = getApps().length
      ? getApp()
      : initializeApp(firebaseConfig);

    const auth = getAuth(app);
    const db = getFirestore(app);

    const credential = await signInWithEmailAndPassword(auth, email, pass);
    const allowed = await checkModeratorAccess(credential.user, app, db);

    if (!allowed) {
      await signOut(auth).catch(() => {});
      alert("Ovaj račun nema pristup moderator panelu za ovaj event.");
      return;
    }

    window.location.href = "/admin.html?event=" + encodeURIComponent(eventId);

  } catch (err) {
    console.error("Moderator login error:", err);
    alert("Pogrešan email ili lozinka");
  }
};
window.addEventListener("click", (e) => {
  const modal = document.getElementById("adminModal");

  if (e.target === modal) {
    closeAdminModal();
  }
});
window.openAdminModal = function () {
  const modal = document.getElementById("adminModal");
  modal.style.display = "flex";

  setTimeout(() => {
    document.getElementById("adminEmail")?.focus();
  }, 50);
};