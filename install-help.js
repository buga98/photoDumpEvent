(function PhotoDumpInstallHelp() {
  "use strict";

  const tr = (text) => window.PDE_I18N?.tr(text) ?? text;

  let deferredInstallPrompt = null;
  let initialized = false;

  const phoneIcon = `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" stroke="currentColor" stroke-width="1.8"/>
      <path d="M10 5h4M10.5 18.5h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M12 8v6m0 0-2.3-2.3M12 14l2.3-2.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  const shieldIcon = `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 5 6v5c0 4.8 2.8 8.2 7 10 4.2-1.8 7-5.2 7-10V6l-7-3Z" stroke="currentColor" stroke-width="1.7"/>
      <path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  function isIOS() {
    return /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  function isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }

  function isIOSSafari() {
    const ua = navigator.userAgent;
    return isIOS() && /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
  }

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
  }

  function currentEventId() {
    return new URLSearchParams(window.location.search).get("event") ||
      localStorage.getItem("eventId") || "";
  }

  function eventInstallContext() {
    const page = document.body?.dataset.pdePage || "";
    const path = window.location.pathname.toLowerCase();
    const isEventPage =
      page === "event" ||
      page === "app" ||
      path.endsWith("/event.html") ||
      path.endsWith("/app.html") ||
      path.endsWith("/event") ||
      path.endsWith("/app");
    return isEventPage ? currentEventId() : "";
  }

  function createModal() {
    if (document.getElementById("pdeInstallModal")) return;

    const hasEvent = Boolean(eventInstallContext());
    const intro = hasEvent
      ? tr("Dodaj ovaj event na početni zaslon. Sljedeći put otvaraš ga direktno preko ikone, a event i prijavljeno ime ostaju zapamćeni.")
      : tr("Za spremanje konkretnog eventa prvo ga otvori preko QR koda ili linka, a zatim dodirni gumb za instalaciju unutar eventa. Tako će ikona uvijek otvarati baš taj event.");

    const modal = document.createElement("div");
    modal.id = "pdeInstallModal";
    modal.className = "pde-install-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="pde-install-backdrop" data-install-close></div>
      <section class="pde-install-dialog" role="dialog" aria-modal="true" aria-labelledby="pdeInstallTitle">
        <button type="button" class="pde-install-close" data-install-close aria-label="${tr("Zatvori")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
        <header class="pde-install-heading">
          <span class="pde-install-kicker">${tr("Instalacija na mobitel")}</span>
          <h2 id="pdeInstallTitle">${tr("PhotoDumpEvent uvijek na početnom zaslonu")}</h2>
          <p>${intro}</p>
        </header>
        <div class="pde-install-success"><b>${tr("Aplikacija je već instalirana ✓")}</b><span>${tr("Otvori je preko PhotoDumpEvent ikone na početnom zaslonu.")}</span></div>
        <div class="pde-install-platforms">
          <article class="pde-install-card pde-ios-card"><span class="pde-install-chip">Apple</span><h3>iPhone / Safari</h3><p class="pde-install-browser-note" id="pdeSafariNote" hidden>${tr("Za instalaciju na iPhoneu otvori ovu stranicu u Safariju.")}</p><ol><li>${tr("Otvori PhotoDumpEvent u Safari pregledniku.")}</li><li>${tr("Dodirni ikonu dijeljenja Share.")}</li><li>${tr("Odaberi Dodaj na početni zaslon.")}</li><li>${tr("Provjeri naziv i dodirni Dodaj.")}</li></ol></article>
          <article class="pde-install-card pde-android-card"><span class="pde-install-chip">Android</span><h3>Android / Chrome</h3><button type="button" class="pde-install-native-btn" id="pdeInstallNow" hidden>${tr("Instaliraj sada")}</button><ol><li>${tr("Otvori PhotoDumpEvent u Chromeu.")}</li><li>${tr("Ako se pojavi poruka, dodirni Instaliraj aplikaciju.")}</li><li>${tr("Ako se ne pojavi, dodirni izbornik ⋮.")}</li><li>${tr("Odaberi Dodaj na početni zaslon ili Instaliraj aplikaciju.")}</li></ol></article>
        </div>
        <div class="pde-install-footer">${shieldIcon}<span>${tr("Nema trgovine aplikacija ni dodatnih preuzimanja. Instalacija traje manje od minute.")}</span></div>
      </section>`

    document.body.appendChild(modal);
  }

  function modalElement() {
    return document.getElementById("pdeInstallModal");
  }

  function closeMenus() {
    document.getElementById("mobileMenu")?.classList.remove("open");
    document.getElementById("mobileMenuBackdrop")?.classList.remove("show");
    document.body.classList.remove("menu-open");
    document.getElementById("menuToggle")?.setAttribute("aria-expanded", "false");
  }

  function updateUI() {
    const modal = modalElement();
    if (!modal) return;

    modal.classList.remove("pde-platform-ios", "pde-platform-android", "pde-platform-desktop");
    if (isIOS()) modal.classList.add("pde-platform-ios");
    else if (isAndroid()) modal.classList.add("pde-platform-android");
    else modal.classList.add("pde-platform-desktop");

    modal.classList.toggle("is-installed", isStandalone());

    const safariNote = document.getElementById("pdeSafariNote");
    if (safariNote) safariNote.hidden = !isIOS() || isIOSSafari();

    const installNow = document.getElementById("pdeInstallNow");
    if (installNow) {
      installNow.hidden = !deferredInstallPrompt || isStandalone() || !eventInstallContext();
    }

    document.querySelectorAll("[data-install-open]").forEach((trigger) => {
      trigger.hidden = isStandalone();
    });
  }

  function openModal() {
    createModal();
    closeMenus();
    updateUI();

    const modal = modalElement();
    if (!modal) return;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("pde-install-lock");
    document.body.classList.add("pde-install-lock");

    window.setTimeout(() => {
      modal.querySelector(".pde-install-close")?.focus();
    }, 30);
  }

  function closeModal() {
    const modal = modalElement();
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("pde-install-lock");
    document.body.classList.remove("pde-install-lock");
  }

  async function requestNativeInstall() {
    if (!deferredInstallPrompt) return;

    const promptEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;

    try {
      await promptEvent.prompt();
      await promptEvent.userChoice;
    } catch (error) {
      console.warn("PWA install prompt error:", error);
    }

    updateUI();
  }

  function maybeAutoOpen() {
    if (document.body.dataset.installAuto !== "event") return;
    if (isStandalone() || (!isIOS() && !isAndroid())) return;

    const eventId = currentEventId();
    if (!eventId) return;

    const key = "installHelpSeen_" + eventId;
    if (localStorage.getItem(key) === "true") return;

    localStorage.setItem(key, "true");
    window.setTimeout(openModal, 2600);
  }

  function initialize() {
    if (initialized) return;
    initialized = true;

    createModal();
    updateUI();

    document.addEventListener("click", (event) => {
      const openTrigger = event.target.closest("[data-install-open]");
      if (openTrigger) {
        event.preventDefault();
        openModal();
        return;
      }

      if (event.target.closest("[data-install-close]")) {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.target.closest("#pdeInstallNow")) {
        event.preventDefault();
        requestNativeInstall();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });

    maybeAutoOpen();
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updateUI();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    localStorage.setItem("pdeAppInstalled", "true");
    updateUI();
  });

  document.addEventListener("pde:languagechange", () => {
    const existing = modalElement();
    const wasOpen = existing?.classList.contains("is-open") || false;
    existing?.remove();
    createModal();
    updateUI();
    if (wasOpen) openModal();
  });

  window.openPhotoDumpInstallHelp = openModal;
  window.closePhotoDumpInstallHelp = closeModal;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
