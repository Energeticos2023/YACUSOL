/* =====================================================================
   ASISTENTE YACUSOL — "¿Qué deseas saber?"
   Ventana de preguntas con respuestas inmediatas para clientes.
   Funciona sin internet y sin servidor: responde con los precios y la
   información técnica cargados en window.ASISTENTE_CONFIG.

   Uso:
     <script>window.ASISTENTE_CONFIG = { ... };</script>
     <script src="asistente/asistente.js" defer></script>

   Campos de ASISTENTE_CONFIG:
     whatsapp        número de ventas, formato 51XXXXXXXXX
     equipos         [{cap, tubos, personas, precio, asistente}]
     accesorios      [{id, nombre, uso, precio}]   (precio 0 = a cotizar)
     componentesPaquete  ids que arman el Paquete Todo en Uno
     precioPaquete   (opcional) función(equipo) → precio del paquete
     descuentos      (opcional) {cap: soles} promoción vigente por modelo
     instalacionIncluida (opcional) true si el paquete incluye instalación en Huaraz
     margenInferior  (opcional) px desde abajo para el botón, si hay otro botón flotante
   ===================================================================== */
(function () {
  "use strict";
  var C = window.ASISTENTE_CONFIG;
  if (!C || !C.equipos || document.getElementById("ya-launcher")) return;

  var WA = C.whatsapp || "51942899919";
  var EQ = C.equipos;
  var AC = C.accesorios || [];
  var DESC = C.descuentos || {};

  /* ---------------- Utilidades ---------------- */
  function money(n) { return "S/ " + Number(n).toLocaleString("es-PE"); }
  function norm(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[¿?¡!.,;:()"]/g, " ").replace(/\s+/g, " ").trim();
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function has(t, words) {
    for (var i = 0; i < words.length; i++) if (t.indexOf(words[i]) !== -1) return true;
    return false;
  }
  function acc(id) { for (var i = 0; i < AC.length; i++) if (AC[i].id === id) return AC[i]; return null; }
  function equipo(cap) { for (var i = 0; i < EQ.length; i++) if (EQ[i].cap === cap) return EQ[i]; return null; }
  function waLink(texto) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(texto); }

  function componentes(e) {
    return (C.componentesPaquete || []).map(function (id) {
      if (id === "asistente") return e.asistente === "10 L" ? acc("tanque10") : acc("tanque5");
      return acc(id);
    }).filter(Boolean);
  }
  function precioPaquete(e) {
    if (typeof C.precioPaquete === "function") return C.precioPaquete(e);
    return componentes(e).reduce(function (t, c) { return t + c.precio; }, e.precio);
  }
  function precioEquipoHTML(e) {
    var d = DESC[e.cap] || 0;
    if (!d) return "<b>" + money(e.precio) + "</b>";
    return "<s>" + money(e.precio) + "</s> <b>" + money(e.precio - d) + "</b> <span class='ya-tag'>promo −" + money(d) + "</span>";
  }

  var PALABRAS_NUM = { un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7,
    ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, trece: 13, catorce: 14, quince: 15 };

  /* Capacidad en litros mencionada: "200 litros", "200l", "de 200" */
  function capacidadEn(t) {
    var m = t.match(/(\d{3})\s*(l|lt|lts|litro|litros)\b/) || t.match(/\b(\d{3})\b/);
    if (m && equipo(+m[1])) return +m[1];
    return null;
  }
  /* Número de personas: "somos 5", "5 personas", "familia de cinco" */
  function personasEn(t) {
    var m = t.match(/(\d{1,2})\s*(persona|personas|integrantes|miembros|hijos|habitantes|usuarios)/) ||
            t.match(/(somos|familia de|para)\s+(\d{1,2})\b/);
    if (m) return +(m[2] && /^\d+$/.test(m[2]) ? m[2] : m[1]);
    var w = t.match(/(somos|familia de|para)\s+([a-z]+)/) || t.match(/\b([a-z]+)\s+personas?/);
    if (w) { var n = PALABRAS_NUM[w[2] || w[1]]; if (n) return n; }
    return null;
  }
  function capacidadPara(p) {
    if (p <= 3) return 120;
    if (p === 4) return 150;
    if (p === 5) return 200;
    if (p === 6) return 250;
    if (p <= 8) return 300;
    if (p <= 12) return 400;
    return equipo(500) ? 500 : 400;
  }

  /* ---------------- Respuestas ---------------- */
  var R = {};

  R.saludo = function () {
    return { html: "¡Hola! 👋 Soy el asistente de <b>YACUSOL</b>. Pregúntame lo que quieras: precios, qué capacidad necesitas, instalación, garantía o si tu terma tiene algún problema.",
      chips: ["Precios", "¿Qué capacidad necesito?", "Paquete Todo en Uno", "Tengo un problema"] };
  };

  R.precios = function () {
    var filas = EQ.map(function (e) {
      return "<tr><td>YACUSOL " + e.cap + " L<small>" + esc(e.personas) + "</small></td><td>" + precioEquipoHTML(e) + "</td></tr>";
    }).join("");
    return { html: "💰 <b>Precios de termas solares YACUSOL</b> (solo equipo: termotanque, tubos al vacío y estructura):" +
      "<table class='ya-tabla'>" + filas + "</table>" +
      "<p class='ya-nota'>Tanque interior de acero inoxidable 316 · garantía 5 años. Accesorios e instalación aparte, o elige el <b>Paquete Todo en Uno</b>.</p>",
      chips: ["Paquete Todo en Uno", "Accesorios", "¿Qué capacidad necesito?", "Instalación"],
      wa: "Hola YACUSOL, vi los precios en la app y quiero cotizar una terma solar." };
  };

  R.precioModelo = function (cap) {
    var e = equipo(cap);
    var pk = precioPaquete(e);
    var h = "☀️ <b>YACUSOL " + cap + " L</b> — " + e.tubos + " tubos al vacío, ideal para " + esc(e.personas).toLowerCase() + ".<br>" +
      "Solo equipo: " + precioEquipoHTML(e);
    if (C.componentesPaquete) {
      h += "<br>Paquete Todo en Uno: <b>" + money(pk) + "</b>" +
        "<p class='ya-nota'>El paquete incluye: " + componentes(e).map(function (c) { return esc(c.nombre); }).join(", ") +
        (C.instalacionIncluida ? ", más traslado e instalación básica en Huaraz e Independencia" : "") + ".</p>";
    }
    return { html: h, chips: ["Ver todos los precios", "Instalación", "Garantía"],
      wa: "Hola YACUSOL, quiero la terma solar de " + cap + " L. ¿Está disponible?" };
  };

  R.capacidad = function (p) {
    if (p) {
      var cap = capacidadPara(p), e = equipo(cap);
      var r = R.precioModelo(cap);
      r.html = "👨‍👩‍👧 Para <b>" + p + " persona" + (p > 1 ? "s" : "") + "</b> te recomendamos la <b>YACUSOL " + cap + " L</b>.<br><br>" + r.html +
        "<p class='ya-nota'>Si se duchan varias personas seguidas o las duchas son largas, conviene subir una capacidad.</p>";
      r.wa = "Hola YACUSOL, somos " + p + " personas y me recomendaron la terma de " + cap + " L. Quiero cotizar.";
      return r;
    }
    var filas = EQ.map(function (e) { return "<tr><td>" + esc(e.personas) + "</td><td><b>" + e.cap + " L</b></td></tr>"; }).join("");
    return { html: "📏 La capacidad depende de cuántas personas usan agua caliente:" +
      "<table class='ya-tabla'>" + filas + "</table>" +
      "<p class='ya-nota'>Escríbeme por ejemplo <i>“somos 5”</i> y te digo el modelo y el precio.</p>",
      chips: ["Somos 3", "Somos 5", "Somos 8", "Precios"] };
  };

  R.paquete = function () {
    var e0 = EQ[0];
    var filas = EQ.map(function (e) { return "<tr><td>Paquete " + e.cap + " L</td><td><b>" + money(precioPaquete(e)) + "</b></td></tr>"; }).join("");
    return { html: "📦 <b>Paquete Todo en Uno</b>: la terma lista para usar. Incluye la terma más " +
      componentes(e0).map(function (c) { return esc(c.nombre).replace(/ 5 L$/, ""); }).join(", ") +
      (C.instalacionIncluida ? ", con traslado e instalación básica en Huaraz e Independencia" : "") + "." +
      "<table class='ya-tabla'>" + filas + "</table>",
      chips: ["Accesorios", "Instalación", "Garantía"],
      wa: "Hola YACUSOL, quiero información del Paquete Todo en Uno." };
  };

  R.accesorios = function () {
    var filas = AC.filter(function (a) { return a.id !== "instalacion" && a.id !== "mantto" && a.id !== "flete"; })
      .map(function (a) { return "<tr><td>" + esc(a.nombre) + "<small>" + esc(a.uso) + "</small></td><td><b>" + (a.precio > 0 ? money(a.precio) : "A cotizar") + "</b></td></tr>"; }).join("");
    return { html: "🔧 <b>Accesorios y repuestos</b>:<table class='ya-tabla'>" + filas + "</table>",
      chips: ["Válvula termostática", "Controlador TK", "Resistencia eléctrica", "Barra de magnesio"],
      wa: "Hola YACUSOL, quiero cotizar accesorios para mi terma solar." };
  };

  var INFO_ACC = {
    valvula: "Mezcla automáticamente agua caliente y fría para que la ducha salga a temperatura estable y sin riesgo de quemaduras. Conexión: <b>H</b> = caliente de la terma, <b>C</b> = fría, <b>MIX</b> = hacia la ducha.",
    controlador: "Muestra la temperatura y el nivel del agua. Según el kit, maneja el llenado automático con electroválvula y enciende la resistencia de respaldo. <b>Nunca</b> encienda la resistencia con el tanque vacío.",
    resistencia: "Calienta el agua los días nublados o de lluvia. Debe ir en un circuito dedicado con interruptor diferencial, termomagnético y puesta a tierra. Solo se enciende con el tanque lleno.",
    magnesio: "Es un ánodo de sacrificio: se desgasta en lugar del tanque y lo protege de la corrosión. Revísela periódicamente y cámbiela cuando esté muy consumida.",
    tanque5: "Mantiene el nivel de agua del termotanque y hace el llenado más simple y controlado. Se usa de 5 L en modelos de 120 a 250 L y de 10 L en 300 y 400 L.",
    tubo: "Es el captador solar (58 × 1800 mm, triple capa, al vacío). Manténgalo limpio y sin golpes. Si uno se rompe, se cambia solo ese tubo."
  };
  R.accesorio = function (id) {
    var a = acc(id);
    if (!a) return R.accesorios();
    var h = "🔧 <b>" + esc(a.nombre) + "</b>: " + (a.precio > 0 ? "<b>" + money(a.precio) + "</b>" : "precio a cotizar") + ".<br>" + (INFO_ACC[id] || esc(a.uso) + ".");
    if (id === "tanque5" && acc("tanque10")) h += "<br>Tanque asistente 10 L: <b>" + money(acc("tanque10").precio) + "</b>.";
    return { html: h, chips: ["Accesorios", "Paquete Todo en Uno", "Precios"],
      wa: "Hola YACUSOL, quiero comprar: " + a.nombre + "." };
  };

  R.instalacion = function () {
    var i = acc("instalacion");
    return { html: "🛠️ <b>Instalación</b>" + (i && i.precio ? ": instalación básica en Huaraz <b>" + money(i.precio) + "</b>" : "") + "." +
      (C.instalacionIncluida ? " Si compras el <b>Paquete Todo en Uno</b>, el traslado e instalación básica en Huaraz e Independencia ya están incluidos." : "") +
      "<ul><li>Se instala en techo plano, soporte a 15°, orientado al sol y sin sombras.</li>" +
      "<li>Se conecta a tu tanque elevado, a un tanque asistente o con controlador TK de llenado automático.</li>" +
      "<li>El tubo de venteo siempre queda abierto, 10 a 20 cm por encima del nivel del tanque elevado.</li>" +
      "<li>Lo instala personal técnico bajo la dirección del Ing. Rafael Zeña (CIP 85540).</li></ul>",
      chips: ["Envíos a provincias", "Paquete Todo en Uno", "Garantía"],
      wa: "Hola YACUSOL, quiero coordinar la instalación de una terma solar." };
  };

  R.envio = function () {
    return { html: "🚚 Atendemos <b>Huaraz, Independencia y todo el Perú</b>. Para otras ciudades enviamos por agencia de transporte; el flete se cotiza según el destino. Escríbenos tu ciudad y te damos el monto.",
      chips: ["Precios", "Instalación", "Formas de pago"],
      wa: "Hola YACUSOL, estoy en otra ciudad y quiero saber el costo de envío de una terma solar a: " };
  };

  R.garantia = function () {
    return { html: "🛡️ <b>Garantía YACUSOL: 5 años</b> para el tanque y la estructura de soporte. Los accesorios tienen la garantía de cada componente.<br>Además recibes acompañamiento técnico posventa del Ing. José Rafael Zeña Peche, Ingeniero Mecánico Electricista.",
      chips: ["Mantenimiento", "Tengo un problema", "Contacto"] };
  };

  R.caracteristicas = function () {
    return { html: "⚙️ <b>Así es tu YACUSOL</b>:<ul>" +
      "<li>Terma solar <b>no presurizada</b> con tubos al vacío 58 × 1800 mm.</li>" +
      "<li>Tanque interior de <b>acero inoxidable 316</b>, exterior de acero 304.</li>" +
      "<li>Aislamiento de poliuretano de alta densidad de 50 mm: conserva el calor por la noche.</li>" +
      "<li>Estructura de acero inoxidable 304 de 1.2 mm, inclinación 15°.</li>" +
      "<li>Capacidades: " + EQ.map(function (e) { return e.cap; }).join(", ") + " litros.</li></ul>",
      chips: ["¿Cómo funciona?", "Precios", "Garantía"] };
  };

  R.funciona = function () {
    return { html: "☀️ <b>¿Cómo funciona?</b> Los tubos al vacío captan la energía del sol y calientan el agua, que sube al termotanque aislado y se conserva caliente para usarla en la ducha, el lavadero o la cocina. <b>No consume luz ni gas.</b><br>Los días sin sol puedes usar la <b>resistencia eléctrica de respaldo</b> opcional.",
      chips: ["¿Y los días nublados?", "Características", "Precios"] };
  };

  R.nublado = function () {
    var r = acc("resistencia");
    return { html: "🌥️ Con nubes la terma sigue captando radiación, pero calienta menos. Para días de lluvia o poco sol está la <b>resistencia eléctrica de respaldo</b>" +
      (r && r.precio ? " (" + money(r.precio) + ")" : "") + ", que puede controlarse con el <b>controlador TK</b>. El tanque aislado conserva el agua caliente durante la noche.",
      chips: ["Resistencia eléctrica", "Controlador TK", "Paquete Todo en Uno"] };
  };

  R.mantenimiento = function () {
    return { html: "🧽 <b>Mantenimiento</b> (recomendado una vez al año):<ul>" +
      "<li><b>Tubos al vacío</b>: limpiar el polvo y revisar que no haya fisuras.</li>" +
      "<li><b>Barra de magnesio</b>: revisar el desgaste y cambiarla si está muy consumida.</li>" +
      "<li><b>Venteo</b>: que esté libre, sin tapones ni insectos.</li>" +
      "<li><b>Uniones y válvula termostática</b>: sin fugas y regulando bien.</li></ul>" +
      "Nosotros hacemos el mantenimiento preventivo; el precio se cotiza según tu equipo.",
      chips: ["Barra de magnesio", "Tengo un problema", "Contacto"],
      wa: "Hola YACUSOL, quiero programar el mantenimiento de mi terma solar." };
  };

  R.problemas = function () {
    return { html: "🩺 Cuéntame qué pasa con tu terma. Elige el caso más parecido:",
      chips: ["No sale agua caliente", "El agua sale tibia", "Rebalsa por el venteo", "Temperatura inestable", "Fuga o tanque deformado", "El TK no marca", "La resistencia no calienta", "Llena muy lento"] };
  };

  var DIAG = {
    noSale: ["No sale agua caliente", "Lo más común es una <b>bolsa de aire</b> en la tubería (si oyes gorgoteos o el agua sale y se corta). También puede ser una llave cerrada o una válvula check invertida.",
      "Purga el punto alto de la tubería de agua caliente y revisa que las llaves estén abiertas. La tubería debe bajar sin “lomos” hacia la ducha."],
    tibia: ["El agua sale tibia", "Puede ser alto consumo, sombra sobre los tubos, tubos sucios o dañados, o la válvula termostática regulada muy baja.",
      "Revisa que no haya sombras, limpia los tubos y sube un poco la válvula termostática. En días nublados usa la resistencia de respaldo."],
    rebose: ["Rebalsa agua por el venteo", "El llenado no se detiene: flotador, electroválvula o sensor con falla, o presión de alimentación alta.",
      "Cierra la alimentación de agua y revisa el control de nivel. <b>Nunca tapes el venteo.</b>"],
    inestable: ["Temperatura inestable en la ducha", "Válvula termostática mal regulada, entradas H/C invertidas o caudales desbalanceados.",
      "Verifica que H vaya a la terma y C al agua fría, y regula la válvula con el agua corriendo."],
    fuga: ["Fuga o tanque deformado", "Sobrepresión: venteo bloqueado o conexión indebida a la red presurizada.",
      "⚠️ <b>Suspende el llenado y el uso</b> y llámanos. Revisaremos el venteo y la conexión."],
    tk: ["El controlador TK no marca", "Sensor desconectado, cableado suelto o falta de alimentación del controlador.",
      "Desenergiza y revisa el sensor y sus conexiones, o pide revisión técnica."],
    resistencia: ["La resistencia no calienta", "Sin alimentación, protección disparada, salida del TK o resistencia dañada.",
      "Verifica el interruptor. Si sigue igual, pide revisión técnica: es trabajo eléctrico."],
    lento: ["Llena muy lento", "Poca presión de alimentación, filtro o llaves restringidas, o electroválvula parcialmente obstruida.",
      "Revisa el caudal de entrada y limpia filtros."]
  };
  R.diagnostico = function (k) {
    var d = DIAG[k];
    return { html: "🩺 <b>" + d[0] + "</b><br><b>Causa probable:</b> " + d[1] + "<br><b>Qué hacer:</b> " + d[2] +
      "<p class='ya-nota'>Detén el uso y llámanos si ves deformación del tanque, fuga importante, olor a quemado o si salta la protección eléctrica.</p>",
      chips: ["Otro problema", "Mantenimiento", "Contacto"],
      wa: "Hola YACUSOL, tengo un problema con mi terma: " + d[0].toLowerCase() + ". ¿Me pueden ayudar?" };
  };

  R.venteo = function () {
    return { html: "🌬️ <b>El venteo</b> es el tubo que mantiene la terma abierta al aire. Es una pieza de seguridad:<ul>" +
      "<li>Siempre abierto: sin válvulas, tapones ni reducciones.</li>" +
      "<li>Entre 10 y 20 cm por encima del nivel del tanque elevado.</li>" +
      "<li>No lo alargues para “ganar presión”: dañaría el tanque.</li>" +
      "<li>Si bota agua todo el tiempo, revisa el nivel del tanque de alimentación.</li></ul>",
      chips: ["Rebalsa por el venteo", "Instalación", "Tengo un problema"] };
  };

  R.presion = function () {
    return { html: "🚿 La YACUSOL es <b>no presurizada</b>: la presión en la ducha la da la altura de tu tanque elevado. No se debe conectar directo a la red de agua ni alargar el venteo para ganar presión. Si necesitas más presión, se resuelve en la red de distribución (por ejemplo con una bomba presurizadora después de la terma). Consúltanos tu caso.",
      chips: ["Instalación", "Venteo", "Contacto"],
      wa: "Hola YACUSOL, tengo dudas sobre la presión de agua para instalar una terma solar." };
  };

  R.pago = function () {
    return { html: "💳 Las formas de pago y la disponibilidad se coordinan directamente con ventas. Escríbenos por WhatsApp y te respondemos al momento.",
      chips: ["Precios", "Envíos a provincias", "Contacto"],
      wa: "Hola YACUSOL, ¿qué formas de pago aceptan?" };
  };

  R.contacto = function () {
    return { html: "📍 <b>ENERGÉTICOS · YACUSOL</b><br>Corporación R y C Contratistas Generales S.A.C.<br>Jr. Augusto B. Leguía 563, Independencia – Huaraz, Áncash.<br>" +
      "WhatsApp: <b>" + WA.replace(/^51/, "").replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3") + "</b><br>Correo: energeticos.ryc@gmail.com<br>" +
      "Atención técnica: Ing. José Rafael Zeña Peche, CIP 85540.",
      chips: ["Precios", "Instalación", "Garantía"],
      wa: "Hola YACUSOL, quiero más información." };
  };

  R.gracias = function () {
    return { html: "¡Con gusto! 😊 Si tienes otra duda, aquí estoy. Y si quieres comprar, toca el botón de WhatsApp.", chips: ["Precios", "Contacto"] };
  };

  R.noEntiendo = function (q) {
    return { html: "No tengo esa respuesta exacta todavía 🤔, pero el Ing. Rafael o el equipo de ventas te responden rápido por WhatsApp. También puedes elegir un tema:",
      chips: ["Precios", "¿Qué capacidad necesito?", "Paquete Todo en Uno", "Instalación", "Garantía", "Tengo un problema"],
      wa: "Hola YACUSOL, tengo una consulta: " + q };
  };

  /* ---------------- Entender la pregunta ---------------- */
  function responder(q) {
    var t = norm(q);
    var cap = capacidadEn(t);
    var p = personasEn(t);
    var pidePrecio = has(t, ["precio", "cuanto", "cuesta", "costo", "vale", "cotiz", "soles", "tarifa", "valor", "barato", "caro", "oferta", "descuento", "promo"]);

    if (has(t, ["gracias", "muy amable", "ok gracias", "perfecto"])) return R.gracias();

    // Problemas (van primero: "no sale agua caliente" no debe responderse con precios)
    if (has(t, ["no sale", "no bota", "no llega", "no hay agua", "gorgote", "sale aire"])) return R.diagnostico("noSale");
    if (has(t, ["tibia", "poco caliente", "no calienta bien", "sale fria", "agua fria", "no calienta el agua", "no esta caliente"])) return R.diagnostico("tibia");
    if (has(t, ["rebalsa", "rebosa", "rebose", "bota agua", "chorrea", "derrama", "sale agua por el venteo"])) return R.diagnostico("rebose");
    if (has(t, ["inestable", "cambia la temperatura", "a ratos caliente", "quema", "muy caliente"])) return R.diagnostico("inestable");
    if (has(t, ["fuga", "gotea", "deform", "hinch", "abollad"])) return R.diagnostico("fuga");
    if (has(t, ["tk no", "controlador no", "no marca", "no muestra", "pantalla"])) return R.diagnostico("tk");
    if (has(t, ["resistencia no", "no calienta la resistencia", "salta la llave", "salta el interruptor", "dispara"])) return R.diagnostico("resistencia");
    if (has(t, ["lento", "demora en llenar", "tarda en llenar"])) return R.diagnostico("lento");
    if (has(t, ["otro problema", "problema", "falla", "averia", "malogr", "no funciona", "ayuda con mi terma", "reclamo"])) return R.problemas();

    if (has(t, ["venteo", "ventilacion", "respiradero"])) return R.venteo();

    // Accesorios concretos
    if (has(t, ["valvula", "termostat", "mezcladora"])) return R.accesorio("valvula");
    if (has(t, ["controlador", " tk", "tk ", "tk-", "automatic", "electrovalvula", "sensor"]) || t === "tk") return R.accesorio("controlador");
    if (has(t, ["resistencia", "electrica", "respaldo"])) return R.accesorio("resistencia");
    if (has(t, ["magnesio", "anodo", "barra"])) return R.accesorio("magnesio");
    if (has(t, ["tanque asistente", "asistente", "flotador"])) return R.accesorio("tanque5");
    if (has(t, ["tubo", "se rompio"])) return R.accesorio("tubo");
    if (has(t, ["accesorio", "repuesto"])) return R.accesorios();

    // Capacidad / personas
    if (p) return R.capacidad(p);
    if (cap) return R.precioModelo(cap);
    if (has(t, ["paquete", "todo en uno", "completo", "kit", "combo"])) return R.paquete();
    if (has(t, ["instal", "techo", "montaje", "colocan", "ponen"])) return R.instalacion();
    if (has(t, ["envio", "envian", "provincia", "flete", "delivery", "lima", "otra ciudad", "departamento", "agencia"])) return R.envio();
    if (has(t, ["mantenim", "limpi", "cuidado", "cada cuanto"])) return R.mantenimiento();
    if (has(t, ["garantia", "garantiz"])) return R.garantia();
    if (has(t, ["pago", "pagar", "tarjeta", "yape", "plin", "transferencia", "cuotas", "credito", "contado"])) return R.pago();
    if (has(t, ["capacidad", "tamano", "cuantos litros", "que litros", "cual me conviene", "recomiend", "cual necesito", "que modelo", "personas", "familia"])) return R.capacidad(null);
    if (pidePrecio || has(t, ["lista", "modelos", "catalogo", "termas"])) return R.precios();

    if (has(t, ["presion", "bomba", "presuriz"])) return R.presion();
    if (has(t, ["nublad", "lluvia", "llueve", "sin sol", "noche", "invierno", "friaje", "helada"])) return R.nublado();
    if (has(t, ["como funciona", "funciona", "que es una terma", "ahorro", "ahorra", "luz", "gas"])) return R.funciona();
    if (has(t, ["caracteristica", "material", "acero", "316", "304", "especificacion", "ficha", "aislamiento", "calidad", "dura"])) return R.caracteristicas();
    if (has(t, ["contacto", "telefono", "celular", "whatsapp", "direccion", "donde estan", "ubicacion", "ubicados", "tienda", "local", "horario", "correo", "ingeniero", "rafael", "hablar"])) return R.contacto();
    if (has(t, ["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches", "info", "informacion", "ayuda", "menu", "inicio"])) return R.saludo();

    return R.noEntiendo(q);
  }

  // Los botones rápidos llevan su propio texto; algunos se resuelven directo.
  var ATAJOS = {
    "precios": R.precios, "ver todos los precios": R.precios, "paquete todo en uno": R.paquete,
    "accesorios": R.accesorios, "tengo un problema": R.problemas, "otro problema": R.problemas,
    "no sale agua caliente": function () { return R.diagnostico("noSale"); },
    "el agua sale tibia": function () { return R.diagnostico("tibia"); },
    "rebalsa por el venteo": function () { return R.diagnostico("rebose"); },
    "temperatura inestable": function () { return R.diagnostico("inestable"); },
    "fuga o tanque deformado": function () { return R.diagnostico("fuga"); },
    "el tk no marca": function () { return R.diagnostico("tk"); },
    "la resistencia no calienta": function () { return R.diagnostico("resistencia"); },
    "llena muy lento": function () { return R.diagnostico("lento"); },
    "que capacidad necesito": function () { return R.capacidad(null); },
    "y los dias nublados": R.nublado, "caracteristicas": R.caracteristicas, "venteo": R.venteo,
    "envios a provincias": R.envio, "formas de pago": R.pago
  };
  function resolver(q) {
    var f = ATAJOS[norm(q)];
    return f ? f() : responder(q);
  }

  /* ---------------- Interfaz ---------------- */
  var css = "" +
    "#ya-launcher{position:fixed;right:16px;bottom:16px;z-index:2147483000;display:flex;align-items:center;gap:8px;border:0;border-radius:999px;padding:12px 18px 12px 14px;background:#F28C1E;color:#fff;font:700 16px/1.1 system-ui,-apple-system,'Segoe UI',Arial,sans-serif;box-shadow:0 10px 28px rgba(6,28,58,.32);cursor:pointer}" +
    "#ya-launcher:hover{background:#D9700A}#ya-launcher .ya-ic{font-size:22px}" +
    "#ya-launcher.ya-pulse{animation:yaPulse 1.6s ease-in-out 3}" +
    "@keyframes yaPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}" +
    "#ya-panel{position:fixed;right:16px;bottom:16px;z-index:2147483001;width:min(390px,calc(100vw - 32px));height:min(620px,calc(100vh - 32px));display:none;flex-direction:column;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 24px 70px rgba(6,28,58,.38);font:15px/1.45 system-ui,-apple-system,'Segoe UI',Arial,sans-serif;color:#132238}" +
    "#ya-panel.ya-open{display:flex}" +
    ".ya-head{display:flex;align-items:center;gap:10px;padding:14px 14px 14px 16px;background:linear-gradient(135deg,#0C2340,#16315B);color:#fff}" +
    ".ya-head .ya-av{width:38px;height:38px;border-radius:50%;background:#F28C1E;display:grid;place-items:center;font-size:20px;flex:none}" +
    ".ya-head b{display:block;font-size:16px}.ya-head small{opacity:.8;font-size:12.5px}" +
    ".ya-x{margin-left:auto;border:0;background:rgba(255,255,255,.14);color:#fff;width:34px;height:34px;border-radius:50%;font-size:20px;cursor:pointer;flex:none}" +
    ".ya-body{flex:1;overflow-y:auto;padding:14px;background:#F3F7FC;display:flex;flex-direction:column;gap:10px}" +
    ".ya-msg{max-width:88%;padding:10px 12px;border-radius:14px;word-wrap:break-word}" +
    ".ya-bot{align-self:flex-start;background:#fff;border:1px solid #DCE6F2;border-bottom-left-radius:4px}" +
    ".ya-user{align-self:flex-end;background:#16315B;color:#fff;border-bottom-right-radius:4px}" +
    ".ya-msg ul{margin:6px 0 0;padding-left:18px}.ya-msg li{margin:2px 0}" +
    ".ya-tabla{width:100%;border-collapse:collapse;margin:8px 0 2px;font-size:14px}" +
    ".ya-tabla td{padding:6px 4px;border-top:1px solid #E6EDF6;vertical-align:top}.ya-tabla td:last-child{text-align:right;white-space:nowrap}" +
    ".ya-tabla small{display:block;color:#5D7086;font-size:12px}" +
    ".ya-msg s{color:#8a97a8}.ya-tag{display:inline-block;background:#FFF1DE;color:#B45A00;font-size:11.5px;font-weight:700;padding:1px 6px;border-radius:6px}" +
    ".ya-nota{margin:8px 0 0;font-size:13px;color:#5D7086}" +
    ".ya-wa{display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:8px 12px;border-radius:10px;background:#25D366;color:#fff!important;font-weight:700;text-decoration:none;font-size:14px}" +
    ".ya-chips{display:flex;flex-wrap:wrap;gap:6px;align-self:flex-start;max-width:100%}" +
    ".ya-chip{border:1px solid #F28C1E;background:#fff;color:#B45A00;border-radius:999px;padding:6px 11px;font:600 13.5px/1.2 inherit;font-family:inherit;cursor:pointer}" +
    ".ya-chip:hover{background:#FFF1DE}" +
    ".ya-typing{align-self:flex-start;color:#5D7086;font-size:13px;padding:0 4px}" +
    ".ya-form{display:flex;gap:8px;padding:10px;border-top:1px solid #DCE6F2;background:#fff}" +
    ".ya-form input{flex:1;min-width:0;border:1px solid #C9D6E4;border-radius:12px;padding:11px 12px;font:16px system-ui,-apple-system,'Segoe UI',Arial,sans-serif;color:#132238;background:#fff}" +
    ".ya-form input:focus{outline:2px solid #F28C1E;border-color:transparent}" +
    ".ya-form button{border:0;border-radius:12px;padding:0 16px;background:#F28C1E;color:#fff;font-weight:700;font-size:15px;cursor:pointer}" +
    "@media (max-width:520px){#ya-panel{right:0;bottom:0;width:100vw;height:100%;border-radius:0}#ya-launcher .ya-tx{font-size:15px}}" +
    "@media (prefers-reduced-motion:reduce){#ya-launcher.ya-pulse{animation:none}}";

  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  var launcher = document.createElement("button");
  launcher.id = "ya-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-label", "Abrir asistente: ¿Qué deseas saber?");
  launcher.innerHTML = "<span class='ya-ic' aria-hidden='true'>💬</span><span class='ya-tx'>¿Qué deseas saber?</span>";

  var panel = document.createElement("section");
  panel.id = "ya-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Asistente YACUSOL");
  panel.innerHTML =
    "<div class='ya-head'><div class='ya-av' aria-hidden='true'>☀️</div><div><b>Asistente YACUSOL</b><small>Respuestas al instante · 24 horas</small></div>" +
    "<button class='ya-x' type='button' aria-label='Cerrar'>×</button></div>" +
    "<div class='ya-body' aria-live='polite'></div>" +
    "<form class='ya-form'><input type='text' placeholder='Escribe tu pregunta… ej: precio 200 litros' aria-label='Tu pregunta' maxlength='200' autocomplete='off'><button type='submit'>Enviar</button></form>";

  if (C.margenInferior) launcher.style.bottom = C.margenInferior + "px";
  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  var body = panel.querySelector(".ya-body");
  var form = panel.querySelector(".ya-form");
  var input = form.querySelector("input");
  var iniciado = false;

  function bajar() { body.scrollTop = body.scrollHeight; }
  function quitarChips() { Array.prototype.forEach.call(body.querySelectorAll(".ya-chips"), function (c) { c.remove(); }); }

  function mostrarUsuario(q) {
    quitarChips();
    var d = document.createElement("div");
    d.className = "ya-msg ya-user";
    d.textContent = q;
    body.appendChild(d);
    bajar();
  }

  function mostrarBot(r) {
    var d = document.createElement("div");
    d.className = "ya-msg ya-bot";
    d.innerHTML = r.html + (r.wa ? "<br><a class='ya-wa' target='_blank' rel='noopener' href='" + esc(waLink(r.wa)) + "'>🟢 Escribir por WhatsApp</a>" : "");
    body.appendChild(d);
    if (r.chips && r.chips.length) {
      var c = document.createElement("div");
      c.className = "ya-chips";
      r.chips.forEach(function (txt) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "ya-chip";
        b.textContent = txt;
        b.addEventListener("click", function () { preguntar(txt); });
        c.appendChild(b);
      });
      body.appendChild(c);
    }
    bajar();
  }

  function preguntar(q) {
    q = String(q).trim();
    if (!q) return;
    mostrarUsuario(q);
    var ty = document.createElement("div");
    ty.className = "ya-typing";
    ty.textContent = "Escribiendo…";
    body.appendChild(ty);
    bajar();
    setTimeout(function () { ty.remove(); mostrarBot(resolver(q)); }, 350);
  }

  function abrir() {
    panel.classList.add("ya-open");
    launcher.style.display = "none";
    if (!iniciado) { iniciado = true; mostrarBot(R.saludo()); }
    if (window.matchMedia("(min-width:521px)").matches) input.focus();
  }
  function cerrar() {
    panel.classList.remove("ya-open");
    launcher.style.display = "";
    launcher.focus();
  }

  launcher.addEventListener("click", abrir);
  panel.querySelector(".ya-x").addEventListener("click", cerrar);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.classList.contains("ya-open")) cerrar(); });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value;
    input.value = "";
    preguntar(q);
  });
  // Evita que la app anfitriona (p. ej. Flutter) capture las teclas del cuadro de texto.
  ["keydown", "keyup", "keypress"].forEach(function (ev) {
    panel.addEventListener(ev, function (e) { e.stopPropagation(); });
  });

  setTimeout(function () { launcher.classList.add("ya-pulse"); }, 2500);

  // Acceso para enlaces: <a href="#asistente"> abre la ventana.
  window.abrirAsistenteYacusol = abrir;
  if (location.hash === "#asistente") abrir();
  window.addEventListener("hashchange", function () { if (location.hash === "#asistente") abrir(); });

  // Solo para pruebas.
  window.__asistenteYacusol = { responder: resolver };
})();
