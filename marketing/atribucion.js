/* YACUSOL - trazabilidad de consultas sin datos personales.
 * Identifica la campana en el mensaje que el cliente decide enviar por WhatsApp.
 * No envia informacion a servidores propios ni publica mensajes automaticamente.
 */
(function () {
  "use strict";
  var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
  var query = new URLSearchParams(window.location.search);
  var tags = {};
  keys.forEach(function (key) {
    var value = query.get(key);
    if (value) {
      var clean = value.replace(/[^A-Za-z0-9_.-]/g, "").slice(0, 60);
      if (clean) tags[key] = clean;
    }
  });
  var page = /Yacusol-app/i.test(window.location.pathname) ? "app" : "web";
  var origin = ["canal=" + page].concat(keys.filter(function (k) { return tags[k]; }).map(function (k) {
    return k + "=" + tags[k];
  })).join(";");
  var marker = "[Ref YACUSOL: ";

  function enrichWhatsApp(href) {
    var url;
    try { url = new URL(href, window.location.href); } catch (_) { return null; }
    var host = url.hostname.toLowerCase();
    if (host !== "wa.me" && host !== "api.whatsapp.com") return null;
    var existing = url.searchParams.get("text") || "Hola YACUSOL, deseo informacion sobre sus termas solares.";
    if (existing.indexOf(marker) !== -1) return null;
    url.searchParams.set("text", existing.trim() + "\n" + marker + origin + "]");
    return url.toString();
  }

  function enrichAppLinks() {
    if (!Object.keys(tags).length) return;
    document.querySelectorAll('a[href*="Yacusol-app/"]').forEach(function (a) {
      try {
        var u = new URL(a.href, window.location.href);
        if (u.hostname.toLowerCase() !== "energeticos2023.github.io") return;
        keys.forEach(function (k) { if (tags[k] && !u.searchParams.has(k)) u.searchParams.set(k, tags[k]); });
        a.href = u.toString();
      } catch (_) { /* Keep original link if malformed. */ }
    });
  }

  document.addEventListener("click", function (event) {
    var target = event.target;
    var a = target && typeof target.closest === "function" ? target.closest("a[href]") : null;
    if (!a) return;
    var next = enrichWhatsApp(a.href);
    if (!next) return;
    a.href = next;
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: "yacusol_whatsapp_click", channel: page,
        campaign_source: tags.utm_source || "", campaign_name: tags.utm_campaign || "" });
    }
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enrichAppLinks);
  } else {
    enrichAppLinks();
  }
})();
