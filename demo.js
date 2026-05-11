/* ==============================
   PHOTODUMP STATIC DEMO
   NEMA FIREBASEA
   NEMA UPLOADA
   NEMA WRITEOVA
============================== */

const DEMO_EVENT_ID = "demo";

const demoPhotos = [
  { id: 1, user: "Ana", likes: 5, liked: true,  src: "assets/demo/demo-1.jpg" },
  { id: 2, user: "Marko", likes: 2, liked: false, src: "assets/demo/demo-2.jpg" },
  { id: 3, user: "Ivana", likes: 7, liked: true,  src: "assets/demo/demo-3.jpg" },
  { id: 4, user: "Luka", likes: 1, liked: false, src: "assets/demo/demo-4.jpg" },
  { id: 5, user: "Petra", likes: 4, liked: false, src: "assets/demo/demo-5.jpg" },
  { id: 6, user: "Maja", likes: 3, liked: true,  src: "assets/demo/demo-6.jpg" },
  { id: 7, user: "Kum", likes: 6, liked: true,  src: "assets/demo/demo-7.jpg" },
  { id: 8, user: "Kuma", likes: 0, liked: false, src: "assets/demo/demo-8.jpg" },
  { id: 9, user: "Gost", likes: 2, liked: false, src: "assets/demo/demo-9.jpg" },
  { id: 10, user: "Obitelj", likes: 1, liked: false, src: "assets/demo/demo-10.jpg" },
  { id: 11, user: "Prijatelji", likes: 3, liked: true, src: "assets/demo/demo-11.jpg" },
  { id: 12, user: "Tena", likes: 0, liked: false, src: "assets/demo/demo-12.jpg" },
  { id: 13, user: "Nikola", likes: 2, liked: false, src: "assets/demo/demo-13.jpg" },
  { id: 14, user: "Sara", likes: 1, liked: true, src: "assets/demo/demo-14.jpg" },
  { id: 15, user: "Demo gost", likes: 0, liked: false, src: "assets/demo/demo-15.jpg" }
];

const demoProfilePhotos = demoPhotos.slice(0, 4);

document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("eventId", DEMO_EVENT_ID);

  renderDemoBubbles();
  renderDemoFeed();
  renderDemoProfile();

  document.body.classList.add("loaded");
});

/* ==============================
   ENTER DEMO
============================== */

window.enterDemoApp = function () {
  const input = document.getElementById("demoName");
  const name = input?.value.trim() || "Demo gost";

  localStorage.setItem("name", name);

  const welcome = document.getElementById("welcome");
  if (welcome) {
    welcome.innerText = name;
  }

  document.getElementById("demoLanding")?.classList.add("hidden");
  document.getElementById("demoApp")?.classList.remove("hidden");

  demoToast("Dobrodošao/la u demo galeriju. Ovo je prikaz bez spremanja podataka.");
};

/* ==============================
   SCREEN SWITCH
============================== */

window.switchDemoScreen = function (screen) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.classList.remove("active");
  });

  document.querySelectorAll(".nav-item").forEach((el) => {
    el.classList.remove("active");
  });

  if (screen === "home") {
    document.getElementById("homeTab")?.classList.add("active");
    document.querySelectorAll(".nav-item")[0]?.classList.add("active");
  }

  if (screen === "upload") {
    document.getElementById("uploadTab")?.classList.add("active");
    document.querySelectorAll(".nav-item")[1]?.classList.add("active");

    demoToast("Ovdje gosti u pravoj aplikaciji dodaju fotografije i posvete.");
  }

  if (screen === "profile") {
    document.getElementById("profileTab")?.classList.add("active");
    document.querySelectorAll(".nav-item")[2]?.classList.add("active");

    demoToast("Ovdje gost vidi fotografije koje je sam objavio.");
  }
};

/* ==============================
   RENDER FEED
============================== */

function renderDemoFeed() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  feed.innerHTML = "";

  demoPhotos.forEach((photo) => {
    const card = createPhotoCard(photo, false);
    feed.appendChild(card);
  });

  updateDemoStats();
}

function renderDemoProfile() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  gallery.innerHTML = "";

  demoProfilePhotos.forEach((photo) => {
    const card = createPhotoCard(photo, true);
    gallery.appendChild(card);
  });
}

function createPhotoCard(photo, isProfile) {
  const card = document.createElement("div");
  card.className = "feed-card demo-photo-card";

  const img = document.createElement("img");
  img.src = photo.src;
  img.alt = "Demo fotografija";
  img.loading = "lazy";

  img.onerror = () => {
    img.src = createPlaceholderImage(photo.id);
  };

  img.onload = () => {
    img.classList.add("loaded");
  };

  img.addEventListener("click", () => {
    openDemoImage(photo);
  });

  card.appendChild(img);

  const likeBox = document.createElement("div");
  likeBox.className = "like-box";
  likeBox.innerHTML = `
    <span class="heart">${photo.liked ? "❤️" : "🤍"}</span>
    <span>${photo.likes}</span>
  `;

  likeBox.addEventListener("click", (e) => {
    e.stopPropagation();

    demoToast(
      isProfile
        ? "U pravoj aplikaciji ovdje gost vidi svoju objavljenu fotografiju."
        : "U pravoj aplikaciji ovdje gosti lajkaju fotografije ❤️"
    );

    showDemoHeart(card);
  });

  card.appendChild(likeBox);

  return card;
}

/* ==============================
   MODAL
============================== */

function openDemoImage(photo) {
  const modal = document.getElementById("demoImageModal");
  const img = document.getElementById("demoModalImage");
  const caption = document.getElementById("demoModalCaption");

  if (!modal || !img || !caption) return;

  img.src = photo.src;
  img.onerror = () => {
    img.src = createPlaceholderImage(photo.id);
  };

  caption.innerText =
    `Fotografiju dodao/la: ${photo.user} · ${photo.likes} lajkova`;

  modal.style.display = "flex";
}

window.closeDemoImage = function () {
  const modal = document.getElementById("demoImageModal");
  if (modal) {
    modal.style.display = "none";
  }
};

document.getElementById("demoImageModal")?.addEventListener("click", (e) => {
  if (e.target.id === "demoImageModal") {
    closeDemoImage();
  }
});

/* ==============================
   FAKE ACTIONS
============================== */

window.demoUploadMessage = function (type) {
  if (type === "camera") {
    demoToast("U pravoj aplikaciji ovdje se otvara kamera za hvatanje trenutka 📸");
    return;
  }

  demoToast("U pravoj aplikaciji ovdje gost odabire jednu ili više fotografija iz galerije.");
};

window.demoDedication = function () {
  const text = document.getElementById("dedicationText")?.value.trim();

  if (!text) {
    demoToast("Ovdje gost može napisati posvetu mladencima ili slavljeniku 💌");
    return;
  }

  demoToast("Demo prikaz: u pravoj aplikaciji ova posveta bi se spremila.");
  document.getElementById("dedicationText").value = "";
};

function showDemoHeart(card) {
  const heart = document.createElement("div");
  heart.className = "big-heart";
  heart.innerText = "❤️";

  card.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 800);
}

/* ==============================
   STATS
============================== */

function updateDemoStats() {
  const photos = demoPhotos.length;
  const likes = demoPhotos.reduce((sum, photo) => sum + photo.likes, 0);
  const dedications = 4;

  setText("livePhotoCount", photos);
  setText("liveLikesCount", likes);
  setText("liveDedicationCount", dedications);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.innerText = value;
  }
}

/* ==============================
   BUBBLES
============================== */

function renderDemoBubbles() {
  const container = document.getElementById("demoBubbles");
  if (!container) return;

  demoPhotos.slice(0, 6).forEach((photo) => {
    const bubble = document.createElement("div");
    bubble.className = "bubble";

    const img = document.createElement("img");
    img.src = photo.src;
    img.onerror = () => {
      img.src = createPlaceholderImage(photo.id);
    };

    bubble.appendChild(img);
    container.appendChild(bubble);

    let x = Math.random() * (window.innerWidth - 90);
    let y = Math.random() * (window.innerHeight - 90);

    let dx = (Math.random() - 0.5) * 0.45;
    let dy = (Math.random() - 0.5) * 0.45;

    function move() {
      x += dx;
      y += dy;

      if (x <= 0 || x >= window.innerWidth - 90) dx *= -1;
      if (y <= 0 || y >= window.innerHeight - 90) dy *= -1;

      bubble.style.transform =
        `translate(${x}px, ${y}px)`;

      requestAnimationFrame(move);
    }

    move();
  });
}

/* ==============================
   TOAST
============================== */

window.demoToast = function (message) {
  const toast = document.getElementById("toast");
  if (!toast) {
    alert(message);
    return;
  }

  toast.innerText = message;
  toast.classList.add("show");

  clearTimeout(window.__demoToastTimer);

  window.__demoToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
};

/* ==============================
   PLACEHOLDER IMAGE
   ako nemaš assets/demo slike
============================== */

function createPlaceholderImage(number) {
  const colors = [
    ["#fff3f7", "#d86b8c"],
    ["#f6fbff", "#6ea8dc"],
    ["#f8f6ff", "#6a5acd"],
    ["#fff7e8", "#b48a43"],
    ["#eceaff", "#7e57c2"]
  ];

  const pair = colors[number % colors.length];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${pair[0]}"/>
          <stop offset="100%" stop-color="${pair[1]}"/>
        </linearGradient>
      </defs>
      <rect width="900" height="900" fill="url(#g)"/>
      <circle cx="450" cy="360" r="120" fill="rgba(255,255,255,0.42)"/>
      <rect x="210" y="520" width="480" height="70" rx="35" fill="rgba(255,255,255,0.44)"/>
      <text x="450" y="720" text-anchor="middle" font-size="46" font-family="Arial" fill="rgba(255,255,255,0.88)">
        PhotoDump demo ${number}
      </text>
    </svg>
  `;

  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}