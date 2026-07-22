(function initPhotoDumpTutorial() {
  "use strict";

  const VERSION = 4;
  const READY_TIMEOUT_MS = 10000;
  const TARGET_PADDING = 8;
  const STEP_CHANGE_DELAY_MS = 100;

  const COPY = {
    hr: {
      offerTitle: "Trebaš kratku pomoć? 👋",
      offerText: "U manje od minute pokazat ćemo ti kako dodati fotografije, pronaći svoje slike i vratiti se u galeriju.",
      start: "Pokreni tutorijal",
      skip: "Preskoči",
      step: "Korak {current} od {total}",
      next: "Dalje",
      finish: "Gotovo",
      exit: "Završi tutorijal",
      uploadingTitle: "Fotografije se učitavaju",
      uploadingText: "Pričekaj trenutak. Čim učitavanje završi, tutorijal će se automatski nastaviti.",
      uploadFailedTitle: "Učitavanje nije uspjelo",
      uploadFailedText: "Možeš ponovno odabrati fotografiju ili nastaviti tutorijal gumbom „Dalje”.",
      done: "Sve jasno — spreman/na si! 🎉",
      steps: [
        {
          id: "add-photos",
          title: "Dodaj fotografije",
          text: "Srednji gumb + otvara kameru i galeriju. Možeš ga sada isprobati ili samo nastaviti gumbom „Dalje”.",
          hint: "Isprobaj označeni gumb ili dodirni „Dalje”.",
          selector: ".navbar .nav-item:nth-child(2)",
          screen: "home",
          showPointer: true,
          advanceOnTap: true
        },
        {
          id: "choose-photos",
          title: "Kamera ili galerija",
          text: "Ovdje biraš jednu ili više fotografija iz mobitela. Fotografiju ne moraš sada odabrati — tutorijal možeš nastaviti gumbom „Dalje”.",
          hint: "Odaberi fotografije ili nastavi bez uploada.",
          selector: ".upload-actions .upload-card:nth-child(2)",
          screen: "upload",
          showPointer: true,
          waitsForUpload: true
        },
        {
          id: "your-photos",
          title: "Tvoje fotografije",
          text: "Nakon uspješnog uploada dolaziš na ovaj ekran. Ovdje su na jednom mjestu sve fotografije koje si ti dodao/la.",
          selector: "#profileTab .profile-header",
          screen: "profile",
          showPointer: false
        },
        {
          id: "gallery",
          title: "Galerija i lajkovi",
          text: "Kućica te vraća u zajedničku galeriju. Tamo pregledavaš fotografije gostiju i možeš ih lajkati.",
          hint: "Dodirni kućicu ili završi gumbom „Gotovo”.",
          selector: ".navbar .nav-item:nth-child(1)",
          screen: "profile",
          showPointer: true,
          advanceOnTap: true
        }
      ]
    },
    en: {
      offerTitle: "Need a quick guide? 👋",
      offerText: "In less than a minute, we will show you how to add photos, find your uploads and return to the gallery.",
      start: "Start tutorial",
      skip: "Skip",
      step: "Step {current} of {total}",
      next: "Next",
      finish: "Done",
      exit: "End tutorial",
      uploadingTitle: "Uploading your photos",
      uploadingText: "Please wait a moment. The tutorial will continue automatically when the upload is complete.",
      uploadFailedTitle: "Upload was not completed",
      uploadFailedText: "Choose a photo again or continue the tutorial with the “Next” button.",
      done: "All set — you are ready! 🎉",
      steps: [
        {
          id: "add-photos",
          title: "Add photos",
          text: "The middle + button opens the camera and gallery. Try it now, or simply continue with “Next”.",
          hint: "Try the highlighted button or tap “Next”.",
          selector: ".navbar .nav-item:nth-child(2)",
          screen: "home",
          showPointer: true,
          advanceOnTap: true
        },
        {
          id: "choose-photos",
          title: "Camera or gallery",
          text: "Choose one or more photos from your phone here. You do not have to select a photo now — continue with “Next” whenever you are ready.",
          hint: "Choose photos or continue without uploading.",
          selector: ".upload-actions .upload-card:nth-child(2)",
          screen: "upload",
          showPointer: true,
          waitsForUpload: true
        },
        {
          id: "your-photos",
          title: "Your photos",
          text: "After a successful upload, you arrive on this screen. This is where all photos you have added are kept together.",
          selector: "#profileTab .profile-header",
          screen: "profile",
          showPointer: false
        },
        {
          id: "gallery",
          title: "Gallery and likes",
          text: "The home icon returns you to the shared gallery, where you can browse and like guests’ photos.",
          hint: "Tap Home or finish with “Done”.",
          selector: ".navbar .nav-item:nth-child(1)",
          screen: "profile",
          showPointer: true,
          advanceOnTap: true
        }
      ]
    },
    de: {
      offerTitle: "Brauchst du eine kurze Hilfe? 👋",
      offerText: "In weniger als einer Minute zeigen wir dir, wie du Fotos hinzufügst, deine Bilder findest und zur Galerie zurückkehrst.",
      start: "Tutorial starten",
      skip: "Überspringen",
      step: "Schritt {current} von {total}",
      next: "Weiter",
      finish: "Fertig",
      exit: "Tutorial beenden",
      uploadingTitle: "Fotos werden hochgeladen",
      uploadingText: "Bitte warte einen Moment. Nach dem Upload wird das Tutorial automatisch fortgesetzt.",
      uploadFailedTitle: "Upload wurde nicht abgeschlossen",
      uploadFailedText: "Wähle erneut ein Foto oder setze das Tutorial mit „Weiter” fort.",
      done: "Alles klar — du bist bereit! 🎉",
      steps: [
        {
          id: "add-photos",
          title: "Fotos hinzufügen",
          text: "Die mittlere + Schaltfläche öffnet Kamera und Galerie. Probiere sie aus oder fahre einfach mit „Weiter” fort.",
          hint: "Probiere die markierte Schaltfläche aus oder tippe auf „Weiter”.",
          selector: ".navbar .nav-item:nth-child(2)",
          screen: "home",
          showPointer: true,
          advanceOnTap: true
        },
        {
          id: "choose-photos",
          title: "Kamera oder Galerie",
          text: "Hier wählst du ein oder mehrere Fotos vom Handy aus. Du musst jetzt kein Foto auswählen — mit „Weiter” kannst du das Tutorial fortsetzen.",
          hint: "Fotos auswählen oder ohne Upload fortfahren.",
          selector: ".upload-actions .upload-card:nth-child(2)",
          screen: "upload",
          showPointer: true,
          waitsForUpload: true
        },
        {
          id: "your-photos",
          title: "Deine Fotos",
          text: "Nach einem erfolgreichen Upload kommst du auf diesen Bildschirm. Hier findest du alle Fotos, die du hinzugefügt hast.",
          selector: "#profileTab .profile-header",
          screen: "profile",
          showPointer: false
        },
        {
          id: "gallery",
          title: "Galerie und Likes",
          text: "Das Haus bringt dich zurück zur gemeinsamen Galerie. Dort kannst du Fotos ansehen und liken.",
          hint: "Tippe auf das Haus oder beende mit „Fertig”.",
          selector: ".navbar .nav-item:nth-child(1)",
          screen: "profile",
          showPointer: true,
          advanceOnTap: true
        }
      ]
    }
  };

  let offer = null;
  let layer = null;
  let coach = null;
  let hand = null;
  let ring = null;
  let shades = [];
  let currentTarget = null;
  let currentTargetHandler = null;
  let active = false;
  let waitingForUpload = false;
  let stepIndex = 0;
  let positionTimer = null;
  let renderToken = 0;

  function getLanguage() {
    const language = window.PDE_I18N?.getLanguage?.() || "hr";
    return COPY[language] ? language : "hr";
  }

  function getCopy() {
    return COPY[getLanguage()];
  }

  function getCurrentStep() {
    return getCopy().steps[stepIndex] || null;
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
      <section class="pde-tutorial-offer-card" role="dialog" aria-modal="true" aria-labelledby="pdeTutorialOfferTitle">
        <div class="pde-tutorial-offer-icon" aria-hidden="true">👋</div>
        <h2 id="pdeTutorialOfferTitle"></h2>
        <p data-tutorial-offer-text></p>
        <div class="pde-tutorial-offer-actions">
          <button type="button" class="pde-tutorial-primary" data-tutorial-start></button>
          <button type="button" class="pde-tutorial-secondary" data-tutorial-skip></button>
        </div>
      </section>`;

    layer = document.createElement("div");
    layer.className = "pde-tutorial-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = `
      <div class="pde-tutorial-shade" data-shade="top"></div>
      <div class="pde-tutorial-shade" data-shade="right"></div>
      <div class="pde-tutorial-shade" data-shade="bottom"></div>
      <div class="pde-tutorial-shade" data-shade="left"></div>
      <div class="pde-tutorial-ring" aria-hidden="true"></div>
      <div class="pde-tutorial-hand" aria-hidden="true">👇</div>
      <section class="pde-tutorial-coach" role="dialog" aria-live="polite" aria-labelledby="pdeTutorialTitle">
        <div class="pde-tutorial-coach-head">
          <span class="pde-tutorial-step"></span>
          <span class="pde-tutorial-status" aria-hidden="true"></span>
        </div>
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
    ring = layer.querySelector(".pde-tutorial-ring");
    shades = Array.from(layer.querySelectorAll(".pde-tutorial-shade"));

    offer.querySelector("[data-tutorial-start]").addEventListener("click", () => startTutorial({ force: true }));
    offer.querySelector("[data-tutorial-skip]").addEventListener("click", skipOffer);
    layer.querySelector("[data-tutorial-exit]").addEventListener("click", () => stopTutorial("skipped"));
    layer.querySelector("[data-tutorial-next]").addEventListener("click", handleNextButton);

    offer.addEventListener("click", (event) => {
      if (event.target === offer) skipOffer();
    });

    window.addEventListener("resize", schedulePosition);
    window.addEventListener("orientationchange", schedulePosition);
    window.addEventListener("scroll", schedulePosition, true);
    window.addEventListener("pde:screenchange", () => schedulePosition(100));
    window.addEventListener("pde:photo-upload-start", handleUploadStart);
    window.addEventListener("pde:photo-upload-complete", handleUploadComplete);
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

  function hideSpotlight() {
    ring?.classList.remove("is-visible");
    hand?.classList.remove("is-visible");
    shades.forEach((shade) => shade.classList.remove("is-visible"));
  }

  function isScreenActive(screen) {
    const ids = {
      home: "homeTab",
      upload: "uploadTab",
      profile: "profileTab"
    };
    const element = document.getElementById(ids[screen]);
    return Boolean(element?.classList.contains("active"));
  }

  function ensureScreen(screen) {
    if (!screen || isScreenActive(screen)) return;
    window.switchScreen?.(screen);
  }

  function startTutorial(options = {}) {
    createUi();
    closeOffer();

    if (!options.force && hasSeenTutorial()) return;

    active = true;
    waitingForUpload = false;
    stepIndex = 0;
    document.body.classList.add("pde-tutorial-active");
    layer.classList.add("is-open");
    layer.setAttribute("aria-hidden", "false");

    ensureScreen("home");
    setTimeout(renderStep, STEP_CHANGE_DELAY_MS);
  }

  function stopTutorial(status = "completed") {
    renderToken += 1;
    clearTimeout(positionTimer);
    clearTarget();
    hideSpotlight();
    waitingForUpload = false;
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

  function goToStep(index) {
    if (!active) return;

    const steps = getCopy().steps;
    if (index >= steps.length) {
      stopTutorial("completed");
      return;
    }

    stepIndex = index;
    waitingForUpload = false;
    ensureScreen(steps[index].screen);
    setTimeout(renderStep, STEP_CHANGE_DELAY_MS);
  }

  function handleNextButton() {
    if (!active || waitingForUpload) return;

    const steps = getCopy().steps;
    if (stepIndex >= steps.length - 1) {
      stopTutorial("completed");
      return;
    }

    goToStep(stepIndex + 1);
  }

  function setCoachCopy(step, options = {}) {
    const copy = getCopy();
    const steps = copy.steps;
    const title = options.title || step.title;
    const text = options.text || step.text;
    const hint = options.hint ?? step.hint ?? "";

    coach.querySelector(".pde-tutorial-step").textContent = copy.step
      .replace("{current}", String(stepIndex + 1))
      .replace("{total}", String(steps.length));
    coach.querySelector("#pdeTutorialTitle").textContent = title;
    coach.querySelector("[data-tutorial-step-text]").textContent = text;
    coach.querySelector(".pde-tutorial-tap-hint").textContent = hint;
    coach.querySelector("[data-tutorial-exit]").textContent = copy.exit;
    coach.querySelector("[data-tutorial-next]").textContent = stepIndex === steps.length - 1 ? copy.finish : copy.next;
    coach.classList.toggle("has-hint", Boolean(hint));
  }

  function renderStep() {
    if (!active) return;

    const token = ++renderToken;
    clearTimeout(positionTimer);
    clearTarget();
    hideSpotlight();
    waitingForUpload = false;

    const step = getCurrentStep();
    if (!step) {
      stopTutorial("completed");
      return;
    }

    ensureScreen(step.screen);
    coach.classList.remove("is-waiting", "is-error");
    setCoachCopy(step);

    setTimeout(() => {
      if (!active || token !== renderToken) return;

      currentTarget = document.querySelector(step.selector);
      if (!currentTarget) {
        console.warn("Tutorial target not found:", step.selector);
        goToStep(stepIndex + 1);
        return;
      }

      currentTarget.classList.add("pde-tutorial-highlight");

      if (step.advanceOnTap) {
        const expectedStepIndex = stepIndex;
        currentTargetHandler = () => {
          setTimeout(() => {
            if (!active || token !== renderToken || stepIndex !== expectedStepIndex) return;

            if (expectedStepIndex >= getCopy().steps.length - 1) {
              stopTutorial("completed");
            } else {
              goToStep(expectedStepIndex + 1);
            }
          }, 160);
        };
        currentTarget.addEventListener("click", currentTargetHandler, { once: true });
      }

      revealTargetAndPosition(token);
    }, 80);
  }

  function revealTargetAndPosition(token) {
    if (!active || token !== renderToken || !currentTarget) return;

    currentTarget.scrollIntoView?.({ behavior: "smooth", block: "center", inline: "center" });

    setTimeout(() => {
      if (!active || token !== renderToken || !currentTarget) return;
      avoidCoachOverlap();
      schedulePosition(120);
    }, 260);
  }

  function avoidCoachOverlap() {
    if (!currentTarget || !coach) return;

    const targetRect = currentTarget.getBoundingClientRect();
    const coachRect = coach.getBoundingClientRect();
    const overlap = targetRect.bottom + 18 - coachRect.top;

    if (overlap > 0 && targetRect.top > 90) {
      window.scrollBy({ top: overlap + 26, behavior: "smooth" });
    }
  }

  function handleUploadStart() {
    const step = getCurrentStep();
    if (!active || !step?.waitsForUpload) return;

    waitingForUpload = true;
    clearTarget();
    hideSpotlight();
    coach.classList.remove("is-error", "has-hint");
    coach.classList.add("is-waiting");
    setCoachCopy(step, {
      title: getCopy().uploadingTitle,
      text: getCopy().uploadingText,
      hint: ""
    });
  }

  function handleUploadComplete(event) {
    const step = getCurrentStep();
    if (!active || !step?.waitsForUpload) return;

    waitingForUpload = false;
    const uploadedCount = Number(event?.detail?.done || 0);

    if (uploadedCount > 0) {
      goToStep(stepIndex + 1);
      return;
    }

    coach.classList.remove("is-waiting");
    coach.classList.add("is-error");
    setCoachCopy(step, {
      title: getCopy().uploadFailedTitle,
      text: getCopy().uploadFailedText,
      hint: step.hint
    });

    currentTarget = document.querySelector(step.selector);
    currentTarget?.classList.add("pde-tutorial-highlight");
    schedulePosition(100);
  }

  function schedulePosition(delay = 0) {
    if (!active || !currentTarget || !ring || !hand) return;
    clearTimeout(positionTimer);
    positionTimer = setTimeout(positionCoachMarks, delay);
  }

  function setRect(element, left, top, width, height) {
    if (!element) return;
    element.style.left = `${Math.max(0, left)}px`;
    element.style.top = `${Math.max(0, top)}px`;
    element.style.width = `${Math.max(0, width)}px`;
    element.style.height = `${Math.max(0, height)}px`;
  }

  function rectanglesOverlap(a, b, margin = 0) {
    return !(
      a.right + margin <= b.left ||
      a.left >= b.right + margin ||
      a.bottom + margin <= b.top ||
      a.top >= b.bottom + margin
    );
  }

  function positionCoachMarks() {
    if (!active || !currentTarget || !ring || !hand) return;

    const step = getCurrentStep();
    const rect = currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const left = Math.max(0, rect.left - TARGET_PADDING);
    const top = Math.max(0, rect.top - TARGET_PADDING);
    const right = Math.min(viewportWidth, rect.right + TARGET_PADDING);
    const bottom = Math.min(viewportHeight, rect.bottom + TARGET_PADDING);
    const width = right - left;
    const height = bottom - top;

    const shadeMap = Object.fromEntries(shades.map((shade) => [shade.dataset.shade, shade]));
    setRect(shadeMap.top, 0, 0, viewportWidth, top);
    setRect(shadeMap.bottom, 0, bottom, viewportWidth, viewportHeight - bottom);
    setRect(shadeMap.left, 0, top, left, height);
    setRect(shadeMap.right, right, top, viewportWidth - right, height);
    shades.forEach((shade) => shade.classList.add("is-visible"));

    setRect(ring, left, top, width, height);
    ring.classList.add("is-visible");

    if (!step?.showPointer) {
      hand.classList.remove("is-visible");
      return;
    }

    const handSize = 38;
    const gap = 9;
    const coachRect = coach.getBoundingClientRect();
    const candidates = [
      {
        left: rect.left + rect.width / 2 - handSize / 2,
        top: rect.top - handSize - gap,
        symbol: "👇"
      },
      {
        left: rect.right + gap,
        top: rect.top + rect.height / 2 - handSize / 2,
        symbol: "👈"
      },
      {
        left: rect.left - handSize - gap,
        top: rect.top + rect.height / 2 - handSize / 2,
        symbol: "👉"
      },
      {
        left: rect.left + rect.width / 2 - handSize / 2,
        top: rect.bottom + gap,
        symbol: "👆"
      }
    ];

    const chosen = candidates.find((candidate) => {
      const candidateRect = {
        left: candidate.left,
        top: candidate.top,
        right: candidate.left + handSize,
        bottom: candidate.top + handSize
      };

      const insideViewport =
        candidateRect.left >= 6 &&
        candidateRect.top >= 6 &&
        candidateRect.right <= viewportWidth - 6 &&
        candidateRect.bottom <= viewportHeight - 6;

      return insideViewport && !rectanglesOverlap(candidateRect, coachRect, 4);
    }) || {
      left: Math.max(6, Math.min(viewportWidth - handSize - 6, rect.right + 4)),
      top: Math.max(6, Math.min(viewportHeight - handSize - 6, rect.top - handSize - 4)),
      symbol: "👇"
    };

    hand.textContent = chosen.symbol;
    hand.style.left = `${chosen.left}px`;
    hand.style.top = `${chosen.top}px`;
    hand.classList.add("is-visible");
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
