const SPREADSHEET_ID = "1lTq5VmKSRM9qM5Uu9luJ4-f6FSZM7J5i1gME83LeNDg";
const REGISTRATIONS_SHEET = "Inscripciones";
const PLAYERS_SHEET = "Jugadores";
const MIN_PLAYERS = 6;
const MAX_PLAYERS = 15;

function doGet() {
  return HtmlService.createHtmlOutput(
    "<h2>Copa ANIN 2026</h2><p>Servicio central de inscripciones activo.</p>"
  );
}

function doPost(e) {
  let requestId = "";
  try {
    const raw = e && e.parameter && e.parameter.payload
      ? e.parameter.payload
      : (e && e.postData ? e.postData.contents : "");

    if (!raw) throw new Error("No se recibieron datos de inscripción.");

    const payload = JSON.parse(raw);
    requestId = cleanText_(payload.requestId, 100);
    validatePayload_(payload);

    const result = saveRegistration_(payload);
    return postMessageResponse_({
      source: "COPA_ANIN_API",
      ok: true,
      requestId: requestId,
      code: result.code,
      savedAt: result.savedAt
    });
  } catch (error) {
    return postMessageResponse_({
      source: "COPA_ANIN_API",
      ok: false,
      requestId: requestId,
      error: error && error.message ? error.message : "No se pudo guardar la inscripción."
    });
  }
}

function saveRegistration_(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const registrations = spreadsheet.getSheetByName(REGISTRATIONS_SHEET);
    const playersSheet = spreadsheet.getSheetByName(PLAYERS_SHEET);
    if (!registrations || !playersSheet) {
      throw new Error("La base central no tiene las hojas requeridas.");
    }

    const requestId = cleanText_(payload.requestId, 100);
    const existing = findExistingByRequestId_(registrations, requestId);
    if (existing) {
      return { code: existing.code, savedAt: existing.savedAt };
    }

    const now = new Date();
    const code = generateUniqueCode_(registrations);
    const delegate = payload.delegate || {};
    const source = cleanText_(payload.source, 300);

    const registrationRow = registrations.getLastRow() + 1;
    const registrationValues = [[
      now,
      code,
      "CONFIRMADA",
      safeCellText_(payload.sport, 30),
      safeCellText_(payload.teamName, 80),
      safeCellText_(payload.organization, 100),
      safeCellText_(payload.jersey, 50),
      safeCellText_(delegate.name, 100),
      safeCellText_(delegate.phone, 30),
      safeCellText_(delegate.email, 120).toLowerCase(),
      payload.players.length,
      requestId,
      safeCellText_(source, 300),
      ""
    ]];

    registrations.getRange(registrationRow, 2, 1, 9).setNumberFormat("@");
    registrations.getRange(registrationRow, 12, 1, 3).setNumberFormat("@");
    registrations.getRange(registrationRow, 1, 1, registrationValues[0].length)
      .setValues(registrationValues);
    registrations.getRange(registrationRow, 1).setNumberFormat("dd/mm/yyyy hh:mm:ss");

    const playerRows = payload.players.map(function(player, index) {
      return [
        now,
        code,
        safeCellText_(payload.sport, 30),
        safeCellText_(payload.teamName, 80),
        index + 1,
        safeCellText_(player.name, 100),
        safeCellText_(player.dni, 8),
        safeCellText_(player.gender, 20),
        safeCellText_(delegate.name, 100),
        safeCellText_(delegate.phone, 30),
        safeCellText_(delegate.email, 120).toLowerCase(),
        "CONFIRMADA"
      ];
    });

    const firstPlayerRow = playersSheet.getLastRow() + 1;
    playersSheet.getRange(firstPlayerRow, 2, playerRows.length, 3).setNumberFormat("@");
    playersSheet.getRange(firstPlayerRow, 6, playerRows.length, 7).setNumberFormat("@");
    playersSheet.getRange(firstPlayerRow, 1, playerRows.length, playerRows[0].length)
      .setValues(playerRows);
    playersSheet.getRange(firstPlayerRow, 1, playerRows.length, 1)
      .setNumberFormat("dd/mm/yyyy hh:mm:ss");

    SpreadsheetApp.flush();
    return {
      code: code,
      savedAt: Utilities.formatDate(now, "America/Lima", "dd/MM/yyyy HH:mm:ss")
    };
  } finally {
    lock.releaseLock();
  }
}

function validatePayload_(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Formato de inscripción no válido.");
  }

  const allowedSports = ["Fútbol", "Vóley mixto"];
  if (allowedSports.indexOf(payload.sport) === -1) {
    throw new Error("La disciplina seleccionada no es válida.");
  }
  if (cleanText_(payload.teamName, 80).length < 3) {
    throw new Error("El nombre del equipo no es válido.");
  }
  if (cleanText_(payload.jersey, 50).length < 3) {
    throw new Error("El color de camiseta no es válido.");
  }

  const delegate = payload.delegate || {};
  if (cleanText_(delegate.name, 100).split(/\s+/).length < 2) {
    throw new Error("Los datos del delegado están incompletos.");
  }
  if (!/^\+?[\d\s-]{9,15}$/.test(cleanText_(delegate.phone, 30))) {
    throw new Error("El celular del delegado no es válido.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanText_(delegate.email, 120))) {
    throw new Error("El correo del delegado no es válido.");
  }

  if (!Array.isArray(payload.players) || payload.players.length < MIN_PLAYERS || payload.players.length > MAX_PLAYERS) {
    throw new Error("El equipo debe registrar entre 6 y 15 jugadores.");
  }

  const dnis = {};
  let hasFemale = false;
  let hasMale = false;

  payload.players.forEach(function(player) {
    if (cleanText_(player.name, 100).split(/\s+/).length < 2) {
      throw new Error("Hay un jugador sin nombres y apellidos completos.");
    }
    const dni = cleanText_(player.dni, 8);
    if (!/^\d{8}$/.test(dni)) {
      throw new Error("Todos los DNI deben tener 8 dígitos.");
    }
    if (dnis[dni]) {
      throw new Error("La relación contiene un DNI repetido.");
    }
    dnis[dni] = true;

    if (["Femenino", "Masculino"].indexOf(player.gender) === -1) {
      throw new Error("El género de uno de los jugadores no es válido.");
    }
    if (player.gender === "Femenino") hasFemale = true;
    if (player.gender === "Masculino") hasMale = true;
  });

  if (payload.sport === "Vóley mixto" && (!hasFemale || !hasMale)) {
    throw new Error("Vóley mixto requiere participantes femeninos y masculinos.");
  }
}

function findExistingByRequestId_(sheet, requestId) {
  if (!requestId || sheet.getLastRow() < 2) return null;

  const finder = sheet.getRange(2, 12, sheet.getLastRow() - 1, 1)
    .createTextFinder(requestId)
    .matchEntireCell(true)
    .findNext();

  if (!finder) return null;
  const row = finder.getRow();
  return {
    code: String(sheet.getRange(row, 2).getDisplayValue()),
    savedAt: String(sheet.getRange(row, 1).getDisplayValue())
  };
}

function generateUniqueCode_(sheet) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const existingCodes = sheet.getLastRow() > 1
    ? sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getDisplayValues().flat()
    : [];

  for (let attempt = 0; attempt < 20; attempt += 1) {
    let suffix = "";
    for (let i = 0; i < 7; i += 1) {
      suffix += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    const code = "ANIN-" + suffix;
    if (existingCodes.indexOf(code) === -1) return code;
  }

  throw new Error("No se pudo generar un código único. Inténtalo nuevamente.");
}

function cleanText_(value, maxLength) {
  return String(value == null ? "" : value).trim().slice(0, maxLength || 500);
}

function safeCellText_(value, maxLength) {
  const text = cleanText_(value, maxLength);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function postMessageResponse_(payload) {
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  const html = [
    "<!doctype html><html><head><meta charset='utf-8'></head><body>",
    "<script>",
    "window.parent.postMessage(" + json + ", '*');",
    "<\\/script>",
    "</body></html>"
  ].join("");

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
