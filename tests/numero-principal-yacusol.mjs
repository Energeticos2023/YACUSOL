import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const read=p=>fs.readFileSync(new URL("../"+p,import.meta.url),"utf8");
const html=read("index.html"),app=read("app.js"),form=read("cotizar/cotizador.js"),
  faq=read("comercial/red-comercial.js"),assistant=read("asistente/asistente.js");
for(const [path,js] of [["app.js",app],["cotizar/cotizador.js",form],["comercial/red-comercial.js",faq],["asistente/asistente.js",assistant]])
 new vm.Script(js,{filename:path});
assert(html.includes('const WA_VENTAS = "51983926721";'),"Cotización embedded YACUSOL no usa principal");
assert(html.includes('class="float" href="https://wa.me/51983926721?'),"Botón flotante dirige al número antiguo");
assert(html.includes('class="btn wh" href="https://wa.me/51983926721?'),"Hero dirige al número antiguo");
assert(html.includes('wa.me/51942899919'),"Debe conservar contacto técnico anterior");
assert(html.includes('wa.me/51961120481'),"Debe conservar línea complementaria");
assert(app.includes('sales1:"51983926721"'),"La vitrina multimarca no usa el número principal");
assert(form.includes('const WA_PUBLICO="51983926721"'),"El formulario público usa otra línea");
assert(faq.includes('wa.me/51983926721'),"Red comercial deriva a otro número");
assert(!faq.includes('wa.me/51942899919'),"Asistente comercial usa línea antigua");
assert(assistant.includes('C.whatsapp || "51983926721"'),"Respaldo asistente no coincide");
console.log("YACUSOL: entradas de cotizaciones a 983926721; contactos alternativos preservados.");
