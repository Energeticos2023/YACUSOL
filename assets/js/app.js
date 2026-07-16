(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const form = $("#registration-form");
  const playersList = $("#players-list");
  const template = $("#player-template");
  const modal = $("#success-modal");
  const config = window.ANIN_CONFIG || {};
  const endpoint = String(config.REGISTRATION_ENDPOINT || "").trim();
  const whatsappNumber = String(config.WHATSAPP_NUMBER || "51942899919").replace(/\D/g, "");
  const MIN_PLAYERS = 6;
  const MAX_PLAYERS = 15;
  const REQUEST_TIMEOUT_MS = 30000;

  const pad = (value) => String(value).padStart(2, "0");

  function updateCountdown() {
    const node = $("#countdown");
    const eventDate = new Date("2026-07-17T19:00:00-05:00");
    const distance = Math.max(0, eventDate.getTime() - Date.now());
    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    node.innerHTML = `<b>${pad(days)}</b><em>D</em><b>${pad(hours)}</b><em>H</em><b>${pad(minutes)}</b><em>M</em>`;
  }

  function updateHeader() {
    $(".site-header").classList.toggle("scrolled", window.scrollY > 90);
  }

  function setupReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    $$(".reveal").forEach((item) => observer.observe(item));
  }

  function updatePlayerRows() {
    const rows = $$(".player-row", playersList);
    rows.forEach((row, index) => {
      $(".player-number", row).textContent = pad(index + 1);
      $("[data-field='name']", row).name = `player_${index + 1}_name`;
      $("[data-field='dni']", row).name = `player_${index + 1}_dni`;
      $("[data-field='gender']", row).name = `player_${index + 1}_gender`;
      $(".remove-player", row).hidden = rows.length <= MIN_PLAYERS;
    });
    $("#player-count").textContent = `${rows.length} registrados`;
    $("#add-player").hidden = rows.length >= MAX_PLAYERS;
  }

  function addPlayer() {
    if ($$(".player-row", playersList).length >= MAX_PLAYERS) return;
    playersList.append(template.content.cloneNode(true));
    updatePlayerRows();
  }

  function clearFieldError(input) {
    input.classList.remove("invalid");
    const error = input.closest(".field")?.querySelector(".error");
    if (error) error.textContent = "";
  }

  function showFieldError(input, message) {
    input.classList.add("invalid");
    const error = input.closest(".field")?.querySelector(".error");
    if (error) error.textContent = message;
  }

  function showFormMessage(message) {
    const node = $("#form-message");
    node.textContent = message;
    node.classList.add("show");
  }

  function validateForm() {
    let valid = true;
    $$("input, select", form).forEach(clearFieldError);
    $("#form-message").classList.remove("show");

    const rules = [
      [form.elements.teamName, (v) => v.trim().length >= 3, "Ingresa un nombre de equipo válido."],
      [form.elements.jersey, (v) => v.trim().length >= 3, "Indica el color de camiseta."],
      [form.elements.delegate, (v) => v.trim().split(/\s+/).length >= 2, "Ingresa nombres y apellidos."],
      [form.elements.phone, (v) => /^\+?[\d\s-]{9,15}$/.test(v.trim()), "Ingresa un celular válido."],
      [form.elements.email, (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), "Ingresa un correo válido."]
    ];
    rules.forEach(([input, test, message]) => {
      if (!test(input.value)) {
        showFieldError(input, message);
        valid = false;
      }
    });

    const players = $$(".player-row", playersList);
    const dnis = [];
    players.forEach((row) => {
      const name = $("[data-field='name']", row);
      const dni = $("[data-field='dni']", row);
      const gender = $("[data-field='gender']", row);
      if (name.value.trim().split(/\s+/).length < 2) {
        showFieldError(name, "Completa nombre y apellido.");
        valid = false;
      }
      if (!/^\d{8}$/.test(dni.value.trim())) {
        showFieldError(dni, "Debe tener 8 dígitos.");
        valid = false;
      }
      if (!gender.value) {
        showFieldError(gender, "Selecciona una opción.");
        valid = false;
      }
      dnis.push(dni.value.trim());
    });

    dnis.forEach((dni, index) => {
      if (dni && dnis.indexOf(dni) !== index) {
        showFieldError($("[data-field='dni']", players[index]), "Este DNI está repetido.");
        valid = false;
      }
    });

    if (form.elements.sport.value === "Vóley mixto") {
      const genders = players.map((row) => $("[data-field='gender']", row).value);
      if (!genders.includes("Femenino") || !genders.includes("Masculino")) {
        showFormMessage("Para vóley mixto, registra participantes femeninos y masculinos.");
        valid = false;
      }
    }

    if (!form.elements.consent.checked) {
      showFormMessage("Debes aceptar las bases y confirmar la veracidad de los datos.");
      valid = false;
    }

    if (!valid) form.querySelector(".invalid")?.focus();
    return valid;
  }

  function createRequestId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `req-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function getPayload() {
    return {
      requestId: createRequestId(),
      submittedAtClient: new Date().toISOString(),
      event: "Copa ANIN 2026",
      source: window.location.href,
      sport: form.elements.sport.value,
      teamName: form.elements.teamName.value.trim(),
      organization: form.elements.organization.value.trim(),
      jersey: form.elements.jersey.value.trim(),
      delegate: {
        name: form.elements.delegate.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim().toLowerCase()
      },
      players: $$(".player-row", playersList).map((row) => ({
        name: $("[data-field='name']", row).value.trim(),
        dni: $("[data-field='dni']", row).value.trim(),
        gender: $("[data-field='gender']", row).value
      }))
    };
  }

  function ensureTransportFrame() {
    let frame = $("#registration-transport-frame");
    if (!frame) {
      frame = document.createElement("iframe");
      frame.id = "registration-transport-frame";
      frame.name = "registration-transport-frame";
      frame.hidden = true;
      frame.setAttribute("aria-hidden", "true");
      document.body.append(frame);
    }
    return frame;
  }

  function submitRegistration(payload) {
    return new Promise((resolve, reject) => {
      ensureTransportFrame();
      const transportForm = document.createElement("form");
      transportForm.method = "POST";
      transportForm.action = endpoint;
      transportForm.target = "registration-transport-frame";
      transportForm.hidden = true;

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "payload";
      input.value = JSON.stringify(payload);
      transportForm.append(input);
      document.body.append(transportForm);

      let settled = false;
      const cleanup = () => {
        window.removeEventListener("message", onMessage);
        transportForm.remove();
        clearTimeout(timer);
      };

      const finish = (callback, value) => {
        if (settled) return;
        settled = true;
        cleanup();
        callback(value);
      };

      const onMessage = (event) => {
        const data = event.data;
        if (!data || data.source !== "COPA_ANIN_API" || data.requestId !== payload.requestId) return;
        if (data.ok) finish(resolve, data);
        else finish(reject, new Error(data.error || "El servidor rechazó la inscripción."));
      };

      window.addEventListener("message", onMessage);
      const timer = window.setTimeout(() => {
        finish(reject, new Error("El servidor no confirmó la inscripción dentro del tiempo esperado."));
      }, REQUEST_TIMEOUT_MS);

      transportForm.submit();
    });
  }

  function createReferenceCode() {
    const timePart = Date.now().toString(36).toUpperCase().slice(-6);
    const randomPart = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(2, 5);
    return `ANIN-${timePart}${randomPart}`;
  }

  function buildWhatsAppMessage(payload, code, centralConfirmed) {
    const players = payload.players.map((player, index) =>
      `${index + 1}. ${player.name} | DNI ${player.dni} | ${player.gender}`
    ).join("\n");

    return [
      centralConfirmed
        ? "*COPA ANIN 2026 – INSCRIPCIÓN CONFIRMADA*"
        : "*COPA ANIN 2026 – SOLICITUD DE INSCRIPCIÓN*",
      "",
      `*Código:* ${code}`,
      `*Disciplina:* ${payload.sport}`,
      `*Equipo:* ${payload.teamName}`,
      `*Área / institución:* ${payload.organization || "No indicada"}`,
      `*Color de camiseta:* ${payload.jersey}`,
      "",
      "*Delegado:*",
      payload.delegate.name,
      `Celular: ${payload.delegate.phone}`,
      `Correo: ${payload.delegate.email}`,
      "",
      `*Jugadores (${payload.players.length}):*`,
      players,
      "",
      centralConfirmed
        ? "Registro guardado en la base central de la Copa ANIN 2026."
        : "Solicito confirmar la recepción de esta inscripción por este mismo medio."
    ].join("\n");
  }

  function configureWhatsAppButton(payload, code, centralConfirmed) {
    const message = buildWhatsAppMessage(payload, code, centralConfirmed);
    const button = $("#whatsapp-confirmation");
    button.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    button.hidden = !whatsappNumber;
  }

  function openModal(payload, code, centralConfirmed, serverError = "") {
    $("#registration-code").textContent = code;
    configureWhatsAppButton(payload, code, centralConfirmed);

    const status = $("#modal-status");
    const title = $("#modal-title");
    const description = $("#modal-description");

    if (centralConfirmed) {
      status.textContent = "REGISTRO CENTRAL CONFIRMADO";
      title.innerHTML = "¡YA ESTÁN<br>EN EL JUEGO!";
      description.textContent = "La inscripción fue guardada correctamente. Conserva el código y envía la constancia al WhatsApp oficial.";
    } else {
      status.textContent = "PASO FINAL POR WHATSAPP";
      title.innerHTML = "INSCRIPCIÓN<br>LISTA PARA ENVIAR";
      description.textContent = serverError
        ? "El registro central no respondió. Para no perder los datos, envía ahora la inscripción al WhatsApp oficial. Quedará confirmada cuando la organización reciba el mensaje."
        : "Toca el botón y presiona Enviar en WhatsApp. La inscripción quedará confirmada cuando la organización reciba el mensaje en el 942 899 919.";
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    $("#whatsapp-confirmation", modal).focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function resetForm() {
    form.reset();
    playersList.innerHTML = "";
    for (let i = 0; i < MIN_PLAYERS; i += 1) addPlayer();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    const button = $(".submit-button", form);
    const original = button.innerHTML;
    const payload = getPayload();
    const fallbackCode = createReferenceCode();

    if (!endpoint) {
      openModal(payload, fallbackCode, false);
      return;
    }

    button.disabled = true;
    button.innerHTML = "<span>GUARDANDO EN EL REGISTRO CENTRAL…</span><i>•••</i>";

    try {
      const result = await submitRegistration(payload);
      openModal(payload, result.code, true);
      resetForm();
    } catch (error) {
      console.error(error);
      openModal(payload, fallbackCode, false, error.message || "El servidor no respondió.");
    } finally {
      button.disabled = false;
      button.innerHTML = original;
    }
  }

  $("#add-player").addEventListener("click", addPlayer);
  playersList.addEventListener("click", (event) => {
    const button = event.target.closest(".remove-player");
    if (!button) return;
    button.closest(".player-row").remove();
    updatePlayerRows();
  });
  playersList.addEventListener("input", (event) => {
    if (event.target.matches("[data-field='dni']")) {
      event.target.value = event.target.value.replace(/\D/g, "").slice(0, 8);
    }
    clearFieldError(event.target);
  });
  form.addEventListener("input", (event) => clearFieldError(event.target));
  form.addEventListener("submit", handleSubmit);

  $$(".choose-sport").forEach((button) => button.addEventListener("click", () => {
    const radio = $(`input[name='sport'][value='${button.dataset.sport}']`, form);
    if (radio) radio.checked = true;
    $("#inscripcion").scrollIntoView({ behavior: "smooth" });
  }));

  $(".menu-toggle").addEventListener("click", (event) => {
    const open = document.body.classList.toggle("menu-open");
    event.currentTarget.setAttribute("aria-expanded", String(open));
  });
  $$(".main-nav a").forEach((link) => link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    $(".menu-toggle").setAttribute("aria-expanded", "false");
  }));

  $(".modal-close").addEventListener("click", closeModal);
  $(".modal-done").addEventListener("click", closeModal);
  $(".modal-backdrop").addEventListener("click", closeModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
  window.addEventListener("scroll", updateHeader, { passive: true });

  for (let i = 0; i < MIN_PLAYERS; i += 1) addPlayer();
  updateCountdown();
  setInterval(updateCountdown, 60000);
  updateHeader();
  setupReveal();
})();
