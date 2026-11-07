/* ENERGETICOS / YACUSOL - Red comercial (2026-11-07).
 * Navegacion, contacto humano y recomendacion voluntaria.
 * No envia mensajes ni almacena datos personales.
 */
(function () {
  "use strict";
  if (window.__energeticosRedComercial) return;
  window.__energeticosRedComercial = true;
  function el(tag, cls, value) {
    var x = document.createElement(tag);
    if (cls) x.className = cls;
    if (value) x.textContent = value;
    return x;
  }
  var p = location.pathname.toLowerCase();
  var source = p.indexOf("yacusol-app") >= 0 ? "app_yacusol" :
    p.indexOf("yacusol") >= 0 ? "web_yacusol" :
    p.indexOf("tecgo") >= 0 ? "tecgo" :
    p.indexOf("calculo-sfv") >= 0 ? "sfv" : "energeticos";
  var catalogue = "https://energeticos2023.github.io/YACUSOL/";
  var referral = catalogue + "?utm_source=recomendacion&utm_medium=compartido&utm_campaign=clientes_recomiendan&utm_content=" + encodeURIComponent(source);
  var links = [
    ["Termas solares YACUSOL", catalogue],
    ["Catálogo y cotizador", "https://energeticos2023.github.io/Yacusol-app/"],
    ["Servicios ENERGÉTICOS", "https://energeticos2023.github.io/energeticos/"],
    ["TecGo · Soporte técnico", "https://energeticos2023.github.io/TecGo/"]
  ];
  var css = [
    "#en-red-launcher{position:fixed;left:14px;bottom:15px;z-index:2147482500;display:flex;align-items:center;gap:8px;padding:12px 16px;border:2px solid #f8b951;border-radius:999px;background:#0c2340;color:#fff;box-shadow:0 7px 25px #061c3a55;cursor:pointer;font:700 14px/1.2 Arial,sans-serif}",
    "#en-red-launcher:focus-visible,#en-red-panel a:focus-visible,#en-red-panel button:focus-visible{outline:3px solid #F28C1E;outline-offset:2px}",
    "#en-red-panel{position:fixed;left:14px;bottom:69px;z-index:2147482501;width:min(345px,calc(100vw - 28px));max-height:min(72vh,630px);overflow:auto;border:1px solid #dce6f2;border-radius:18px;background:#fff;color:#10294a;box-shadow:0 16px 50px #061c3a77;font:14px/1.45 Arial,sans-serif}",
    "#en-red-panel[hidden]{display:none!important}",
    "#en-red-panel .en-red-head{background:#0c2340;color:#fff;padding:14px 16px}",
    "#en-red-panel .en-red-head strong{font-size:17px}",
    "#en-red-panel .en-red-inner{padding:14px 16px;display:grid;gap:8px}",
    "#en-red-panel .en-red-title{margin:8px 0 0;font-size:12px;color:#5a708c;text-transform:uppercase;letter-spacing:.05em;font-weight:700}",
    "#en-red-panel a{display:block;padding:10px 12px;border-radius:10px;background:#edf4fd;color:#12345a;text-decoration:none;font-weight:700}",
    "#en-red-panel a:hover{background:#d8e8fb}",
    "#en-red-panel .en-red-human{background:#e0f6e8;color:#11562a}",
    "#en-red-panel .en-red-share{background:#f28c1e;color:#fff}",
    "#en-red-panel .en-red-note{font-size:12px;color:#55677e;margin:5px 0}",
    "#en-red-panel .en-red-close{float:right;background:#fff3;border:0;color:#fff;font:700 20px Arial;cursor:pointer;border-radius:7px;width:30px;height:30px}",
    "#en-red-panel .en-red-quick{display:grid;grid-template-columns:1fr 1fr;gap:7px}#en-red-panel .en-red-choice{background:#eaf1fb;color:#12345a;padding:10px;border:1px solid #c6dbf2;border-radius:10px;text-align:left;font:700 12px/1.3 Arial;cursor:pointer}#en-red-panel .en-red-choice:hover{background:#d6e5f8}#en-red-panel .en-red-answer{padding:11px 12px;border-radius:12px;border:1px solid #c6dbf2;background:#f5f9ff;font-size:13px}#en-red-panel .en-red-answer[hidden]{display:none}#en-red-panel .en-red-answer p{margin:0 0 10px}",
    "@media(max-width:520px){#en-red-launcher{left:10px;bottom:12px;padding:10px 13px;font-size:13px}#en-red-panel{left:10px;bottom:62px;max-height:65vh}}"
  ].join("");
  var st = el("style");
  st.textContent = css;
  document.head.appendChild(st);
  var launcher = el("button", "", "☀️ Servicios y recomendaciones");
  launcher.id = "en-red-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "en-red-panel");
  var panel = el("aside");
  panel.id = "en-red-panel";
  panel.hidden = true;
  panel.setAttribute("aria-label", "Enlaces de ENERGÉTICOS y YACUSOL");
  var head = el("div", "en-red-head");
  var close = el("button", "en-red-close", "×");
  close.type = "button";
  close.setAttribute("aria-label", "Cerrar menú de servicios");
  head.appendChild(close);
  head.appendChild(el("strong", "", "ENERGÉTICOS · YACUSOL"));
  head.appendChild(el("div", "", "Encuentra soluciones y atención especializada"));
  panel.appendChild(head);
  var content = el("div", "en-red-inner");
  function addLink(label, url, cls) {
    var a = el("a", cls || "", label);
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    content.appendChild(a);
    return a;
  }
  content.appendChild(el("p", "en-red-title", "Visita nuestras páginas"));
  links.forEach(function (item) {
    var u = new URL(item[1]);
    u.searchParams.set("utm_source", "red_energeticos");
    u.searchParams.set("utm_medium", "navegacion");
    u.searchParams.set("utm_campaign", "ecosistema");
    u.searchParams.set("utm_content", source);
    addLink("↗ " + item[0], u.toString());
  });

  content.appendChild(el("p", "en-red-title", "¿Cómo podemos ayudarte?"));
  content.appendChild(el("p", "en-red-note", "Selecciona una consulta y recibirás orientación inmediata. Si necesitas una cotización especial o atención personal, podrás escribir directamente al ingeniero."));
  var quickOptions = [
    {label:"☀️ Comprar terma solar", answer:"Para orientarte con YACUSOL necesitamos saber el distrito de instalación, cuántas personas usarán agua caliente y cuántas duchas tienes. Puedes revisar capacidades y precios publicados en el catálogo. La elección definitiva requiere confirmar las condiciones de instalación.", topic:"Quiero cotizar una terma solar. Distrito: [indicar]. Número de personas: [indicar]. Duchas: [indicar]."},
    {label:"🔧 Mantenimiento de terma", answer:"Podemos evaluar limpieza, revisión de tubos, válvulas, controlador y funcionamiento. Si hay fuga importante, deformación del tanque o riesgo eléctrico, suspende su uso de manera segura y solicita atención especializada. El costo de mantenimiento se cotiza según diagnóstico.", topic:"Solicito mantenimiento de mi terma solar. Marca y capacidad: [indicar]. Problema o servicio solicitado: [indicar]. Distrito: [indicar]."},
    {label:"⚡ Instalaciones eléctricas", answer:"ENERGÉTICOS brinda servicios técnicos eléctricos. Para cotizar correctamente necesitamos ubicación, alcance del trabajo y características generales de la instalación. Los trabajos y plazos se confirman después de una evaluación técnica.", topic:"Solicito un servicio de instalaciones eléctricas. Distrito: [indicar]. Trabajo requerido: [indicar]."},
    {label:"📋 Proyecto o visita técnica", answer:"Para evaluar un proyecto de energía solar o eléctrico necesitamos conocer la ubicación y el objetivo. Un especialista revisará el alcance, las condiciones de sitio y la documentación necesaria antes de presentar una propuesta.", topic:"Necesito una visita o evaluación de proyecto. Ubicación: [indicar]. Necesidad: [indicar]."}
  ];
  var quickArea = el("div", "en-red-quick");
  var answerBox = el("div", "en-red-answer");
  answerBox.setAttribute("aria-live", "polite");
  answerBox.hidden = true;
  quickOptions.forEach(function (opt) {
    var b = el("button", "en-red-choice", opt.label);
    b.type = "button";
    b.addEventListener("click", function () {
      answerBox.hidden = false;
      answerBox.textContent = "";
      answerBox.appendChild(el("p", "", opt.answer));
      var link = el("a", "en-red-human", "🟢 Pedir atención humana por WhatsApp");
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.href = "https://wa.me/51942899919?text=" + encodeURIComponent("ATENCIÓN HUMANA - ENERGÉTICOS/YACUSOL: " + opt.topic);
      answerBox.appendChild(link);
    });
    quickArea.appendChild(b);
  });
  content.appendChild(quickArea);
  content.appendChild(answerBox);
  content.appendChild(el("p", "en-red-title", "Atención personalizada"));
  addLink("💬 Asistente de termas YACUSOL", catalogue + "#asistente");
  var msg = "Hola, Ing. Rafael. Necesito atención humana para una consulta sobre ENERGÉTICOS / YACUSOL. Llegué desde " + source + ".";
  addLink("🟢 Hablar con el Ing. Rafael por WhatsApp", "https://wa.me/51942899919?text=" + encodeURIComponent(msg), "en-red-human");
  content.appendChild(el("p", "en-red-note", "El cliente decide si envía el mensaje. La respuesta personal está sujeta a disponibilidad."));
  content.appendChild(el("p", "en-red-title", "Ayúdanos a llegar a más familias"));
  content.appendChild(el("p", "en-red-note", "Si conoces a alguien que busque agua caliente con energía solar, agradeceremos que compartas nuestro catálogo."));
  var shareMsg = "Te comparto YACUSOL, termas solares de ENERGÉTICOS en Huaraz, con experiencia desde 2018: " + referral;
  var share = addLink("📣 Recomendar YACUSOL a familiares y amigos", "https://wa.me/?text=" + encodeURIComponent(shareMsg), "en-red-share");
  share.addEventListener("click", function (event) {
    if (typeof navigator.share !== "function") return;
    event.preventDefault();
    navigator.share({title:"Termas solares YACUSOL",text:"Si buscas agua caliente con energía solar, conoce YACUSOL.",url:referral}).catch(function () {});
  });
  content.appendChild(el("p", "en-red-title", "Nuestras redes"));
  addLink("Facebook YACUSOL", "https://www.facebook.com/profile.php?id=61590174891879");
  addLink("Facebook ENERGÉTICOS", "https://www.facebook.com/INGENIEROS.RYC/");
  panel.appendChild(content);
  document.body.appendChild(launcher);
  document.body.appendChild(panel);
  function toggle(open) { panel.hidden = !open; launcher.setAttribute("aria-expanded", String(open)); }
  launcher.addEventListener("click", function () { toggle(panel.hidden); });
  close.addEventListener("click", function () { toggle(false); launcher.focus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) toggle(false); });
})();
