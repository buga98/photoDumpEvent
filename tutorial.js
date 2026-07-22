(function initPhotoDumpTutorial() {
  "use strict";

  const VERSION = 1;
  const READY_TIMEOUT_MS = 10000;

  const COPY = {
    hr: {
      offerTitle: "Trebaš kratku pomoć? 👋",
      offerText: "U manje od minute pokazat ćemo ti gdje dodaješ fotografije, pišeš posvetu i pronalaziš svoje slike.",
      start: "Pokreni tutorijal",
      skip: "Preskoči",
      step: "Korak {current} od {total}",
      tap: "Dodirni označeni gumb za nastavak.",
      next: "Dalje",
      finish: "Gotovo",
      exit: "Završi tutorijal",
      done: "Sve jasno — spreman/na si! 🎉",
      steps: [
        {
          title: "Dodaj fotografije",
          text: "Dodirni srednji gumb +. On otvara kameru i galeriju.",
          selector: ".navbar .nav-item:nth-child(2)",
          screen: "home",
          requireTap: true
        },
        {
          title: "Kamera ili galerija",
          text: "Lijevo snimaš novu fotografiju, a ovdje odabireš jednu ili više slika iz mobitela.",
          selector: ".upload-actions .upload-card:nth-child(2)",
          screen: "upload"
        },
        {
          title: "Ostavi posvetu",
          text: "Ovdje možeš napisati čestitku ili poruku mladencima. Posveta nije obavezna.",
          selector: ".dedication-open-btn",
          screen: "upload"
        },
        {
          title: "Tvoje fotografije",
          text: "Ovdje uvijek možeš pronaći fotografije koje si ti dodao/la i po potrebi ih obrisati.",
          selector: ".navbar .nav-item:nth-child(3)",
          screen: "upload"
        }
      ]
    },
    en: {
      offerTitle: "Need a quick guide? 👋",
      offerText: "In less than a minute, we will show you where to add photos, leave a message and find your own uploads.",
      start: "Start tutorial",
      skip: "Skip",
      step: "Step {current} of {total}",
      tap: "Tap the highlighted button to continue.",
      next: "Next",
      finish: "Done",
      exit: "End tutorial",
      done: "All set — you are ready! 🎉",
      steps: [
        { title: "Add photos", text: "Tap the middle + button. It opens the camera and gallery.", selector: ".navbar .nav-item:nth-child(2)", screen: "home", requireTap: true },
        { title: "Camera or gallery", text: "Use the left option to take a new photo, or choose one or more photos from your phone here.", selector: ".upload-actions .upload-card:nth-child(2)", screen: "upload" },
        { title: "Leave a message", text: "Write a greeting or a message for the couple here. This step is optional.", selector: ".dedication-open-btn", screen: "upload" },
        { title: "Your photos", text: "Find the photos you uploaded here and delete them if needed.", selector: ".navbar .nav-item:nth-child(3)", screen: "upload" }
      ]
    },
    de: {
      offerTitle: "Brauchst du eine kurze Hilfe? 👋",
      offerText: "In weniger als einer Minute zeigen wir dir, wo du Fotos hinzufügst, eine Nachricht schreibst und deine Bilder findest.",
      start: "Tutorial starten",
      skip: "Überspringen",
      step: "Schritt {current} von {total}",
      tap: "Tippe zum Fortfahren auf die markierte Schaltfläche.",
      next: "Weiter",
      finish: "Fertig",
      exit: "Tutorial beenden",
      done: "Alles klar — du bist bereit! 🎉",
      steps: [
        { title: "Fotos hinzufügen", text: "Tippe auf die mittlere + Schaltfläche. Sie öffnet Kamera und Galerie.", selector: ".navbar .nav-item:nth-child(2)", screen: "home", requireTap: true },
        { title: "Kamera oder Galerie", text: "Links nimmst du ein neues Foto auf; hier wählst du ein oder mehrere Bilder vom Handy aus.", selector: ".upload-actions .upload-card:nth-child(2)", screen: "upload" },
        { title: "Nachricht hinterlassen", text: "Hier kannst du dem Paar gratulieren oder eine Nachricht schreiben. Dieser Schritt ist freiwillig.", selector: ".dedication-open-btn", screen: "upload" },
        { title: "Deine Fotos", text: "Hier findest du deine hochgeladenen Fotos und kannst sie bei Bedarf löschen.", selector: ".navbar .nav-item:nth-child(3)", screen: "upload" }
      ]
    }
  };

  let offer;
  let layer;
  let coach;
  let hand;
  let currentTarget = null;
  let currentTargetHandler = null;
  let active = false;
  let stepIndex = 0;
  let positionTimer = null;

  function getLanguage() {
    const language = window.PDE_I18N?.getLanguage?.() || "hr";
    return COPY[language] ? language : "hr";
  }

  function getCopy() {
    return COPY[getLanguage()];
  }

  function getEventId() {
    return new URLSearchParams(location.search).get("event") || localStorage.getItem("eventId") || "unknown-event";
  }

  function getUserId() {
    const eventId = getEventId();
    return localStorage.getItem("userId_" + eventId) || localStorage.getItem("userId") || "guest";
  }

  function storageKey() {
    return `pde_tutorial_v${VERSION}_${getEventId()}_${getUserId()}`;
  }

  function hasSeenTutorial() {
    return Boolean(localStorage.getItem(storageKey()));
  }

  function markTutorial(status) {
    try {
      localStorage.setItem(storageKey(), status);
    } catch (error) {
      console.warn("Tutorial state could not be stored:", error);
    }
  }

  function createUi() {
    if (offer) return;

    offer = document.createElement("div");
    offer.className = "pde-tutorial-offer";
    offer.setAttribute("aria-hidden", "true");
    offer.innerHTML = `
      <div class="pde-tutorial-offer-card" role="dialog" aria-modal="true" aria-labelledby="pdeTutorialOfferTitle">
        <div class="pde-tutorial-offer-icon" aria-hidden="true">👋</div>
        <h2 id="pdeTutorialOfferTitle"></h2>
        <p data-tutorial-offer-text></p>
        <div class="pde-tutorial-offer-actions">
          <button type="button" class="pde-tutorial-primary" data-tutorial-start></button>
          <button type="button" class="pde-tutorial-secondary" data-tutorial-skip></button>
        </div>
      </div>`;

    layer = document.createElement("div");
    layer.className = "pde-tutorial-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = `
      <div class="pde-tutorial-hand" aria-hidden="true">👆</div>
      <section class="pde-tutorial-coach" role="dialog" aria-live="polite" aria-labelledby="pdeTutorialTitle">
        <span class="pde-tutorial-step"></span>
        <h3 id="pdeTutorialTitle"></h3>
        <p data-tutorial-step-text></p>
        <div class="pde-tutorial-tap-hint"></div>
        <div class="pde-tutorial-actions">
          <button type="button" class="pde-tutorial-exit" data-tutorial-exit></button>
          <button type="button" class="pde-tutorial-next" data-tutorial-next></button>
        </div>
      </section>`;

    document.body.append(offer, layer);
    coach = layer.querySelector(".pde-tutorial-coach");
    hand = layer.querySelector(".pde-tutorial-hand");

    offer.querySelector("[data-tutorial-start]").addEventListener("click", () => startTutorial({ force: true }));
    offer.querySelector("[data-tutorial-skip]").addEventListener("click", skipOffer);
    layer.querySelector("[data-tutorial-exit]").addEventListener("click", () => stopTutorial("skipped"));
    layer.querySelector("[data-tutorial-next]").addEventListener("click", nextStep);

    offer.addEventListener("click", (event) => {
      if (event.target === offer) skipOffer();
    });

    window.addEventListener("resize", schedulePosition);
    window.addEventListener("orientationchange", schedulePosition);
    window.addEventListener("scroll", schedulePosition, true);
    document.addEventListener("pde:languagechange", refreshLanguage);
  }

  function refreshLanguage() {
    if (offer?.classList.contains("is-open")) fillOffer();
    if (active) renderStep();
  }

  function fillOffer() {
    const copy = getCopy();
    offer.querySelector("#pdeTutorialOfferTitle").textContent = copy.offerTitle;
    offer.querySelector("[data-tutorial-offer-text]").textContent = copy.offerText;
    offer.querySelector("[data-tutorial-start]").textContent = copy.start;
    offer.querySelector("[data-tutorial-skip]").textContent = copy.skip;
  }

  function openOffer() {
    createUi();
    fillOffer();
    offer.classList.add("is-open");
    offer.setAttribute("aria-hidden", "false");
    offer.querySelector("[data-tutorial-start]")?.focus();
  }

  function closeOffer() {
    if (!offer) return;
    offer.classList.remove("is-open");
    offer.setAttribute("aria-hidden", "true");
  }

  function skipOffer() {
    markTutorial("skipped");
    closeOffer();
  }

  function clearTarget() {
    if (currentTarget && currentTargetHandler) {
      currentTarget.removeEventListener("click", currentTargetHandler);
    }

    currentTarget?.classList.remove("pde-tutorial-highlight");
    currentTarget = null;
    currentTargetHandler = null;
  }

  function startTutorial(options = {}) {
    createUi();
    closeOffer();

    if (!options.force && hasSeenTutorial()) return;

    active = true;
    stepIndex = 0;
    document.body.classList.add("pde-tutorial-active");
    layer.classList.add("is-open");
    layer.setAttribute("aria-hidden", "false");
    renderStep();
  }

  function stopTutorial(status = "completed") {
    clearTarget();
    active = false;
    document.body.classList.remove("pde-tutorial-active");
    layer?.classList.remove("is-open");
    layer?.setAttribute("aria-hidden", "true");
    markTutorial(status);

    if (status === "completed") {
      window.switchScreen?.("home");
      const done = document.createElement("div");
      done.className = "pde-tutorial-done";
      done.textContent = getCopy().done;
      document.body.appendChild(done);
      setTimeout(() => done.remove(), 2800);
    }
  }

  function nextStep() {
    const total = getCopy().steps.length;
    if (stepIndex >= total - 1) {
      stopTutorial("completed");
      return;
    }

    stepIndex += 1;
    renderStep();
  }

  function renderStep() {
    if (!active) return;

    clearTarget();

    const copy = getCopy();
    const steps = copy.steps;
    const step = steps[stepIndex];
    if (!step) {
      stopTutorial("completed");
      return;
    }

    if (step.screen) {
      window.switchScreen?.(step.screen);
    }

    currentTarget = document.querySelector(step.selector);
    if (!currentTarget) {
      console.warn("Tutorial target not found:", step.selector);
      nextStep();
      return;
    }

    currentTarget.classList.add("pde-tutorial-highlight");
    currentTarget.scrollIntoView?.({ behavior: "smooth", block: "center", inline: "center" });

    coach.classList.toggle("requires-tap", Boolean(step.requireTap));
    coach.querySelector(".pde-tutorial-step").textContent = copy.step
      .replace("{current}", String(stepIndex + 1))
      .replace("{total}", String(steps.length));
    coach.querySelector("#pdeTutorialTitle").textContent = step.title;
    coach.querySelector("[data-tutorial-step-text]").textContent = step.text;
    coach.querySelector(".pde-tutorial-tap-hint").textContent = copy.tap;
    coach.querySelector("[data-tutorial-exit]").textContent = copy.exit;
    coach.querySelector("[data-tutorial-next]").textContent = stepIndex === steps.length - 1 ? copy.finish : copy.next;

    if (step.requireTap) {
      currentTargetHandler = () => {
        setTimeout(() => {
          if (!active || stepIndex !== 0) return;
          nextStep();
        }, 220);
      };
      currentTarget.addEventListener("click", currentTargetHandler, { once: true });
    }

    schedulePosition(350);
  }

  function schedulePosition(delay = 0) {
    if (!active || !currentTarget || !coach || !hand) return;
    clearTimeout(positionTimer);
    positionTimer = setTimeout(positionCoachMarks, delay);
  }

  function positionCoachMarks() {
    if (!active || !currentTarget || !coach || !hand) return;

    const rect = currentTarget.getBoundingClientRect();
    const coachRect = coach.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 12;
    const gap = 62;

    let left = rect.left + rect.width / 2 - coachRect.width / 2;
    left = Math.max(margin, Math.min(left, viewportWidth - coachRect.width - margin));

    const roomBelow = viewportHeight - rect.bottom;
    const roomAbove = rect.top;
    const placeBelow = roomBelow >= coachRect.height + gap || roomBelow > roomAbove;

    let top;
    if (placeBelow) {
      top = Math.min(viewportHeight - coachRect.height - margin, rect.bottom + gap);
      hand.textContent = "👆";
      hand.style.left = `${Math.max(6, Math.min(viewportWidth - 52, rect.left + rect.width / 2 - 23))}px`;
      hand.style.top = `${Math.min(viewportHeight - 52, rect.bottom + 8)}px`;
    } else {
      top = Math.max(margin, rect.top - coachRect.height - gap);
      hand.textContent = "👇";
      hand.style.left = `${Math.max(6, Math.min(viewportWidth - 52, rect.left + rect.width / 2 - 23))}px`;
      hand.style.top = `${Math.max(6, rect.top - 52)}px`;
    }

    coach.style.left = `${left}px`;
    coach.style.top = `${top}px`;
  }

  function waitUntilReady() {
    const startedAt = Date.now();

    const check = () => {
      const ready = document.body.classList.contains("loaded") && typeof window.switchScreen === "function";
      if (ready) {
        createUi();
        setTimeout(() => {
          if (!hasSeenTutorial() && !active) openOffer();
        }, 650);
        return;
      }

      if (Date.now() - startedAt < READY_TIMEOUT_MS) {
        setTimeout(check, 120);
      }
    };

    check();
  }

  window.startPhotoDumpTutorial = startTutorial;
  window.openPhotoDumpTutorialOffer = openOffer;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitUntilReady, { once: true });
  } else {
    waitUntilReady();
  }
})();
