import fs from "node:fs";
import assert from "node:assert/strict";
const read=path=>fs.readFileSync(new URL("../"+path,import.meta.url),"utf8");
const catalog=JSON.parse(read("catalogo/catalogo-verificado.json"));
const publicJs=read("cotizar/cotizador.js"),app=read("app.js");
assert.equal(catalog.currency,"PEN");
assert.equal(catalog.tax_included,true);
assert.equal(catalog.brands.YACUSOL.status,"published");
for(const brand of ["XOLMAX","LUXXOL","INTIPOWER","TERMOINOX"]){
 assert.equal(catalog.brands[brand].status,"pending_supplier_verification","Estado no aprobado de "+brand);
 assert.equal(Object.keys(catalog.brands[brand].unit_prices_liters).length,0,"No publicar precios de "+brand);
}
const tableMatch=publicJs.match(/const CATALOGO_YACUSOL=Object\.freeze\(\{([^}]+)\}\);/);
assert(tableMatch,"No se encontró precio del cotizador público");
const publicPrices=Object.fromEntries([...tableMatch[1].matchAll(/(\d+):(\d+)/g)].map(m=>[m[1],Number(m[2])]));
const sourcePrices=catalog.brands.YACUSOL.unit_prices_liters;
assert.deepEqual(publicPrices,sourcePrices,"Difieren precios del cotizador público y fuente verificada");
const appPrices=Object.fromEntries([...app.matchAll(/\{brand:"yacusol",liters:(\d+),tubes:\d+,price:(\d+)\}/g)].map(m=>[m[1],Number(m[2])]));
assert.deepEqual(appPrices,sourcePrices,"Difieren precios del catálogo de la app Flutter");
for(const [code,price] of Object.entries(catalog.extras_yacusol)){
 if(code==="instalacion_basica_huaraz"){
  assert(publicJs.includes("instalacion:{nombre:"),"No se encontró instalación básica");
  assert(publicJs.includes("precio:"+price+"}"),"Revisar tarifa de instalación");
  continue;
 }
 const re=new RegExp(code+':\\{nombre:"[^"]+",precio:(\\d+)\\}');
 const match=publicJs.match(re);
 assert(match,"Falta adicional "+code+" en cotizador");
 assert.equal(Number(match[1]),price,"Precio distinto para "+code);
}
console.log("Catálogo OK: YACUSOL "+Object.keys(sourcePrices).length+" capacidades, 7 adicionales y cuatro marcas sin tarifa aprobada.");
