import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const dir=new URL("./",import.meta.url);
const get=name=>fs.readFileSync(new URL(name,dir),"utf8");
const html=get("index.html"),js=get("cotizador.js"),css=get("estilos.css"),website=get("../index.html");
assert(js.includes("crypto.randomUUID()"),"Falta referencia UUID de consulta");
assert(js.includes("no confirma recepción"),"No se distingue referencia local de mensaje recibido");
new vm.Script(js,{filename:"cotizador.js"});
for(const b of ["YACUSOL","XOLMAX","LUXXOL","INTIPOWER","TERMOINOX"])assert(html.includes('value="'+b+'"'),"Falta la marca "+b);
assert(website.includes('href="cotizar/"'),"El sitio oficial no enlaza cotizador");
assert(css.includes("#F28C1E")&&css.includes("#0C2340"),"Falta paleta ENERGÉTICOS");
assert(!js.includes("sb_secret_")&&!js.includes("service_role"),"No incluir credenciales");
const elements=new Map();
const el=id=>{if(!elements.has(id))elements.set(id,{id,value:"",textContent:"",hidden:false,disabled:false,replaceChildren(){},append(){},addEventListener(){},focus(){}});return elements.get(id)};
const boxes=[];
const doc={readyState:"loading",getElementById:el,addEventListener(){},querySelectorAll(query){
 if(query==='#adicionales input[type="checkbox"]:checked')return boxes.filter(b=>b.checked);
 if(query==='#adicionales input[type="checkbox"]')return boxes;
 return [];
},createElement(tag){return {tag,textContent:""}}};
const run=new Function("document","window",js+"\nreturn {entrada,calcular,CATALOGO_YACUSOL};");
const app=run(doc,{location:{search:""}});
el("marca").value="YACUSOL";el("capacidad").value="120";el("cantidad").value="1";el("paquete").value="navidad";
assert.equal(app.entrada().total,1700,"120L Navidad debe S/1700");
boxes.push({value:"magnesio",checked:true,disabled:false},{value:"resistencia",checked:true,disabled:false},{value:"valvula",checked:true,disabled:false});
assert.equal(app.entrada().total,2050,"No cobrar dos veces magnesio y resistencia");
boxes.length=0;
el("capacidad").value="400";el("cantidad").value="2";el("paquete").value="regular";
assert.equal(app.entrada().total,8900,"400 L por dos unidades");
for(const brand of ["XOLMAX","LUXXOL","INTIPOWER","TERMOINOX"]){
 el("marca").value=brand; assert.equal(app.entrada().total,null,"No inventar precio de "+brand);
 assert.equal(app.entrada().incluye.length,0,"No inventar fichas de "+brand);
}
console.log("Cotizador publico: OK · 5 marcas, precios autenticados y promociones sin duplicados.");
