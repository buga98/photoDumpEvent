(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  // ==============================
  // Existing event-entry logic
  // ==============================
  window.openEventFromInput = function openEventFromInput() {
    const input = $("#eventCode");
    const value = input?.value.trim() || "";

    if (!value) {
      alert("Upiši event ID ili zalijepi event link.");
      return;
    }

    let eventId = value;

    try {
      if (value.includes("http")) {
        const url = new URL(value);
        eventId =
          url.searchParams.get("event") ||
          url.searchParams.get("code") ||
          value;
      }
    } catch {
      eventId = value;
    }

    if (eventId.toLowerCase() === "demo") {
      localStorage.setItem("eventId", "demo");
      window.location.href = "/demo.html?event=demo";
      return;
    }

    localStorage.setItem("eventId", eventId);
    window.location.href = "/event.html?event=" + encodeURIComponent(eventId);
  };

  $("#eventCode")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") window.openEventFromInput();
  });

  // ==============================
  // Mobile navigation
  // ==============================
  const menuToggle = $("#menuToggle");
  const mobileMenu = $("#mobileMenu");
  const mobileMenuBackdrop = $("#mobileMenuBackdrop");
  const mobileMenuClose = $("#mobileMenuClose");

  function setMenu(open) {
    mobileMenu?.classList.toggle("open", open);
    mobileMenuBackdrop?.classList.toggle("show", open);
    document.body.classList.toggle("menu-open", open);
    menuToggle?.setAttribute("aria-expanded", String(open));
  }

  menuToggle?.addEventListener("click", () => setMenu(true));
  mobileMenuClose?.addEventListener("click", () => setMenu(false));
  mobileMenuBackdrop?.addEventListener("click", () => setMenu(false));
  $$(".mobile-nav a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

  // ==============================
  // Header behavior
  // ==============================
  const header = $("#siteHeader");
  let lastScrollY = window.scrollY;

  function updateHeader() {
    const current = window.scrollY;
    header?.classList.toggle("scrolled", current > 24);
    header?.classList.toggle("header-hidden", current > 220 && current > lastScrollY + 6);
    if (current < lastScrollY - 8) header?.classList.remove("header-hidden");
    lastScrollY = current;
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // ==============================
  // Reveal animation
  // ==============================
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = $$(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // ==============================
  // Scrollytelling engine
  // ==============================
  const storyStage = $("#storyStage");
  const storySteps = $$(".story-step");
  const progressBar = $("#storyProgress");
  const stageNumber = $("#stageNumber");
  const progressDots = $$("[data-go-scene]");
  const photoCount = $("#photoCount");
  let activeScene = -1;
  let countAnimationFrame = null;

  function animatePhotoCount(scene) {
    if (!photoCount) return;
    cancelAnimationFrame(countAnimationFrame);

    const target = scene >= 4 ? 284 : 127;
    const start = Number(photoCount.textContent) || 127;
    const started = performance.now();
    const duration = 650;

    function tick(now) {
      const progress = clamp((now - started) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      photoCount.textContent = String(Math.round(start + (target - start) * eased));
      if (progress < 1) countAnimationFrame = requestAnimationFrame(tick);
    }

    countAnimationFrame = requestAnimationFrame(tick);
  }

  function setScene(scene) {
    const nextScene = clamp(Number(scene) || 0, 0, storySteps.length - 1);
    if (nextScene === activeScene) return;

    activeScene = nextScene;
    storyStage?.setAttribute("data-scene", String(nextScene));
    storySteps.forEach((step, index) => step.classList.toggle("active", index === nextScene));
    progressDots.forEach((dot, index) => dot.classList.toggle("active", index === nextScene));

    if (progressBar) {
      progressBar.style.height = `${(nextScene / Math.max(storySteps.length - 1, 1)) * 100}%`;
    }

    if (stageNumber) stageNumber.textContent = String(nextScene + 1).padStart(2, "0");
    animatePhotoCount(nextScene);
  }

  if (storySteps.length && "IntersectionObserver" in window) {
    const stepObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]) setScene(visible[0].target.dataset.scene);
    }, {
      threshold: [0.22, 0.4, 0.58, 0.76],
      rootMargin: "-22% 0px -32% 0px"
    });

    storySteps.forEach((step) => stepObserver.observe(step));
  } else {
    setScene(0);
  }

  progressDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const scene = Number(dot.dataset.goScene);
      storySteps[scene]?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    });
  });

  setScene(0);

  // ==============================
  // Theme showcase
  // ==============================
  const themeData = {
    wedding: {
      label: "Vjenčanje",
      title: "Elegantna galerija za trenutke koji se ne ponavljaju.",
      text: "Boje, tekstovi i atmosfera prilagođeni su mladencima i stilu proslave.",
      top: "💍 Ivan & Marija",
      deviceTitle: "Galerija uspomena 🤍",
      images: [1, 2, 3, 4, 5, 6]
    },
    baptism: {
      label: "Krštenje",
      title: "Nježna digitalna uspomena za obitelj i najbliže.",
      text: "Svijetla paleta, mirnija atmosfera i prostor za fotografije i posvete cijele obitelji.",
      top: "✨ Lucija — Krštenje",
      deviceTitle: "Obiteljske uspomene",
      images: [3, 1, 5, 6, 2, 4]
    },
    party: {
      label: "Party",
      title: "Brza, energična galerija koja raste sa svakim beatom.",
      text: "Neonski detalji, dinamične fotografije i feed koji izgleda kao dio same zabave.",
      top: "🎉 Birthday Party",
      deviceTitle: "Party uspomene 🔥",
      images: [6, 5, 4, 3, 2, 1]
    }
  };

  const themePreview = $("#themePreview");
  const themeLabel = $("#themeLabel");
  const themeTitle = $("#themeTitle");
  const themeText = $("#themeText");
  const themeTop = $("#themeTop");
  const themeDeviceTitle = $("#themeDeviceTitle");

  function setTheme(themeKey) {
    const theme = themeData[themeKey];
    if (!theme) return;

    themePreview?.setAttribute("data-theme", themeKey);
    if (themeLabel) themeLabel.textContent = theme.label;
    if (themeTitle) themeTitle.textContent = theme.title;
    if (themeText) themeText.textContent = theme.text;
    if (themeTop) themeTop.textContent = theme.top;
    if (themeDeviceTitle) themeDeviceTitle.textContent = theme.deviceTitle;

    theme.images.forEach((number, index) => {
      const image = $(`#themeImg${index + 1}`);
      if (!image) return;
      image.classList.add("switching");
      window.setTimeout(() => {
        image.src = `assets/demo/${number}.png`;
        image.onload = () => image.classList.remove("switching");
      }, 55 + index * 25);
    });

    $$("[data-theme-demo]").forEach((button) => {
      button.classList.toggle("active", button.dataset.themeDemo === themeKey);
    });
  }

  $$("[data-theme-demo]").forEach((button) => {
    button.addEventListener("click", () => setTheme(button.dataset.themeDemo));
  });

  setTheme("wedding");

  // ==============================
  // Desktop depth interactions
  // ==============================
  const hero = $(".hero");
  const heroPhone = $(".hero-phone-shell");
  const heroPhotos = $$(".hero-photo");
  const pointerFine = window.matchMedia("(pointer: fine)").matches;

  if (!reduceMotion && pointerFine && hero && heroPhone) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      heroPhone.style.setProperty("--rx", `${-y * 5}deg`);
      heroPhone.style.setProperty("--ry", `${x * 7}deg`);
      heroPhone.style.setProperty("--tx", `${x * 10}px`);
      heroPhone.style.setProperty("--ty", `${y * 8}px`);

      heroPhotos.forEach((photo, index) => {
        const strength = 14 + index * 8;
        photo.style.translate = `${x * strength}px ${y * strength}px`;
      });
    });

    hero.addEventListener("pointerleave", () => {
      heroPhone.style.removeProperty("--rx");
      heroPhone.style.removeProperty("--ry");
      heroPhone.style.removeProperty("--tx");
      heroPhone.style.removeProperty("--ty");
      heroPhotos.forEach((photo) => { photo.style.translate = ""; });
    });
  }

  // ==============================
  // Cursor glow (desktop only)
  // ==============================
  const cursorGlow = $("#cursorGlow");
  if (!reduceMotion && pointerFine && cursorGlow) {
    window.addEventListener("pointermove", (event) => {
      cursorGlow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    }, { passive: true });
  } else {
    cursorGlow?.remove();
  }

  // ==============================
  // FAQ accordion: keep one open
  // ==============================
  $$(".faq-item").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      $$(".faq-item").forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  // ==============================
  // Footer year
  // ==============================
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
